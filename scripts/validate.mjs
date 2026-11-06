import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {inspectLogo} from './logo-assets.mjs';

const projectRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const codePattern = /^[a-z]{2,3}$/;
const isText = value => typeof value === 'string' && value.trim().length > 0;
const isNullableText = value => value === null || isText(value);
export function readCatalogue(root = projectRoot) {
  const file = name => JSON.parse(readFileSync(path.join(root, 'data/v1', name), 'utf8'));
  const index = file('index.json');
  const data = Object.fromEntries(['networks', 'stations', 'locations', 'languages', 'categories', 'sources'].map(name => [name, file(`${name}.json`)]));
  data.i18n = Object.fromEntries(['en', 'ta', 'sa'].map(locale => [locale, file(`i18n/${locale}.json`)]));
  return { index, ...data };
}
function ids(items, label, errors) {
  if (!Array.isArray(items)) { errors.push(`${label} must be an array`); return new Map(); }
  const map = new Map();
  for (const [n, item] of items.entries()) {
    if (!item || typeof item !== 'object' || !isText(item.id) || !idPattern.test(item.id)) {
      errors.push(`${label}[${n}] has an invalid id`); continue;
    }
    if (map.has(item.id)) errors.push(`Duplicate ${label} id: ${item.id}`);
    map.set(item.id, item);
  }
  return map;
}
function checkLocaleShape(english, value, locale, errors, base = '') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) { errors.push(`${locale}: expected object at ${base || 'root'}`); return; }
  for (const key of Object.keys(english)) {
    const keypath = `${base}${key}`;
    if (!(key in value)) { errors.push(`${locale}: missing ${keypath}`); continue; }
    if (typeof english[key] === 'string') {
      if (!isText(value[key])) errors.push(`${locale}: invalid string ${keypath}`);
    } else checkLocaleShape(english[key], value[key], locale, errors, `${keypath}.`);
  }
  for (const key of Object.keys(value)) if (!(key in english)) errors.push(`${locale}: unexpected ${base}${key}`);
}
export function validateCatalogue(data,{root=projectRoot}={}) {
  const errors = [];
  if (!data || typeof data !== 'object') return ['Catalogue is not an object'];
  const { index, networks, stations, locations, languages, categories, sources, i18n } = data;
  for(const [kind,items] of [['Network',networks],['Station',stations]])for(const item of items || []) {
    if(item && Object.hasOwn(item,'logoPath')) {
      try {inspectLogo(root,item.logoPath);}catch(error){errors.push(`${kind} ${item.id}: logoPath: ${error.message}`);}
    }
  }
  const net = ids(networks, 'networks', errors), loc = ids(locations, 'locations', errors), cat = ids(categories, 'categories', errors), src = ids(sources, 'sources', errors), sta = ids(stations, 'stations', errors);
  const codes = new Set();
  if (!Array.isArray(languages)) errors.push('languages must be an array');
  else for (const item of languages) {
    if (!item || !codePattern.test(item.code) || !isText(item.name) || !isText(item.nativeName)) errors.push(`Invalid language: ${JSON.stringify(item)}`);
    if (codes.has(item.code)) errors.push(`Duplicate language: ${item.code}`);
    codes.add(item.code);
  }
  for (const item of networks || []) {
    if (!isText(item.name) || !Array.isArray(item.countryCodes) || !item.countryCodes.every(x => /^[A-Z]{2}$/.test(x))) errors.push(`Network ${item.id}: invalid name/countries`);
    if (!Array.isArray(item.aliases) || !['public', 'broadcaster', 'online'].includes(item.kind)) errors.push(`Network ${item.id}: invalid metadata`);
    if (item.website !== null && (!validHttps(item.website) || !isText(item.website))) errors.push(`Network ${item.id}: website must be HTTPS or null`);
  }
  for (const item of sources || []) {
    if (!isText(item.title) || !isText(item.kind) || !isText(item.notes)) errors.push(`Source ${item.id}: missing provenance`);
    if (item.url !== null && !validHttps(item.url)) errors.push(`Source ${item.id}: URL must be HTTPS or null`);
  }
  for (const item of locations || []) {
    if (!isText(item.name) || !['country', 'state', 'district', 'locality'].includes(item.type) || !/^[A-Z]{2}$/.test(item.countryCode)) errors.push(`Location ${item.id}: invalid metadata`);
    const previousType = { country: null, state: 'country', district: 'state', locality: 'district' }[item.type];
    if (previousType === null) {
      if (item.parentId !== null || item.id !== item.countryCode.toLowerCase()) errors.push(`Country ${item.id}: parent or ISO code mismatch`);
    } else {
      const parent = loc.get(item.parentId);
      if (!parent || parent.type !== previousType || parent.countryCode !== item.countryCode) errors.push(`Location ${item.id}: invalid parent ${item.parentId}`);
    }
  }
  const streamIds = new Set();
  for (const item of stations || []) {
    const fail = message => errors.push(`Station ${item.id}: ${message}`);
    const network = net.get(item.networkId);
    if (!network) fail('unknown network');
    else if (!network.countryCodes.includes(item.countryCode)) fail('network/country mismatch');
    if (!isText(item.name) || !/^[A-Z]{2}$/.test(item.countryCode)) fail('invalid name/countryCode');
    if (!['fm', 'am', 'online'].includes(item.delivery)) fail('invalid delivery');
    if (!['local', 'regional', 'national', 'global'].includes(item.coverage)) fail('invalid coverage');
    if (!['candidate', 'reviewed'].includes(item.listingStatus)) fail('invalid listingStatus');
    if (!Array.isArray(item.genres) || !item.genres.length || item.genres.some(x => !cat.has(x))) fail('unknown category');
    if (!Array.isArray(item.broadcastLanguages) || item.broadcastLanguages.some(x => !codes.has(x))) fail('unknown broadcast language');
    if (!Array.isArray(item.sourceIds) || item.sourceIds.some(x => !src.has(x))) fail('unknown source');
    if (item.listingStatus === 'reviewed' && (!item.sourceIds || !item.sourceIds.length)) fail('reviewed requires source');
    if (item.website !== null && !validHttps(item.website)) fail('invalid website URL');
    if (!isNullableText(item.notes)) fail('invalid notes');
    if (item.frequencyMHz !== null && (!Number.isFinite(item.frequencyMHz) || item.frequencyMHz < 65 || item.frequencyMHz > 110 || item.delivery !== 'fm')) fail('invalid FM frequency');
    const hierarchy = [['regionId','state'],['districtId','district'],['localityId','locality']];
    for (const [key, type] of hierarchy) {
      if (item[key] === null) continue;
      const entry = loc.get(item[key]);
      if (!entry || entry.type !== type || entry.countryCode !== item.countryCode) fail(`bad ${key}`);
    }
    if (item.districtId !== null && (!item.regionId || loc.get(item.districtId)?.parentId !== item.regionId)) fail('district/region mismatch');
    if (item.localityId !== null && (!item.districtId || loc.get(item.localityId)?.parentId !== item.districtId)) fail('locality/district mismatch');
    if (!Array.isArray(item.streams)) { fail('streams must be array'); continue; }
    for (const stream of item.streams) {
      if (!isText(stream.id) || !idPattern.test(stream.id) || streamIds.has(stream.id)) fail('invalid/duplicate stream ID');
      streamIds.add(stream.id);
      if (!validHttps(stream.url)) fail(`stream ${stream.id}: invalid HTTPS URL`);
      if (!['mp3','aac','hls','unknown'].includes(stream.format)) fail(`stream ${stream.id}: invalid format`);
      if (!['unverified','verified','unavailable'].includes(stream.verificationStatus)) fail(`stream ${stream.id}: invalid status`);
      if (!['unconfirmed','permission-granted'].includes(stream.rightsStatus)) fail(`stream ${stream.id}: invalid rights status`);
      if (!src.has(stream.sourceId)) fail(`stream ${stream.id}: invalid sourceId`);
      if (stream.verificationStatus === 'verified' && !/^\d{4}-\d{2}-\d{2}T/.test(stream.lastVerifiedAt || '')) fail(`stream ${stream.id}: verified stream needs timestamp`);
      if (stream.verificationStatus === 'unverified' && stream.lastVerifiedAt !== null) fail(`stream ${stream.id}: unverified should have null lastVerifiedAt`);
    }
  }
  if (!index || index.schemaVersion !== 1 || !isText(index.catalogVersion) || !/^\d{4}-\d{2}-\d{2}$/.test(index.publishedOn)) errors.push('Invalid index metadata');
  if (index?.defaultLocale !== 'en' || JSON.stringify(index?.locales) !== JSON.stringify(['en','ta','sa'])) errors.push('Invalid index locales');
  if (index?.counts) {
    for (const [key, actual] of Object.entries({ networks:networks?.length, stations:stations?.length, locations:locations?.length, streams:[...(stations || [])].reduce((sum,s)=>sum+(s.streams?.length || 0),0), verifiedStreams:[...(stations || [])].reduce((sum,s)=>sum+(s.streams || []).filter(z=>z.verificationStatus==='verified').length,0) }))
      if (index.counts[key] !== actual) errors.push(`index count ${key} is stale`);
  } else errors.push('Index counts missing');
  const targetFiles = ['networks','stations','locations','languages','categories','sources'];
  for (const key of targetFiles) if (index?.files?.[key] !== `${key}.json`) errors.push(`index file ref missing: ${key}`);
  if (!i18n?.en || !i18n?.ta || !i18n?.sa) errors.push('Missing i18n locale');
  else {
    for (const code of ['en','ta','sa']) checkLocaleShape(i18n.en, i18n[code], code, errors);
    for (const category of categories || []) for (const code of ['en','ta','sa']) if (!isText(i18n[code]?.categories?.[category.id])) errors.push(`${code}: missing category ${category.id}`);
  }
  return errors;
}
export function validHttps(raw) {
  if (!isText(raw)) return false;
  try {
    const url = new URL(raw);
    const h = url.hostname.toLowerCase().replace(/\.$/, '');
    const localNames = ['localhost','local','internal','lan','home','home.arpa','onion','invalid'];
    return url.protocol === 'https:' && h.includes('.') && !url.username && !url.password
      && !localNames.some(name => h === name || h.endsWith(`.${name}`))
      && !/^\d+\.\d+\.\d+\.\d+$/.test(h) && !h.includes(':')
      && !/[\s\u0000-\u001f\u007f]/.test(raw);
  } catch { return false; }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let errors;
  try { errors = validateCatalogue(readCatalogue()); }
  catch (error) { console.error(`Cannot read catalogue: ${error.message}`); process.exit(1); }
  if (errors.length) { console.error(`Catalogue invalid: ${errors.length} error(s)`); for (const error of errors) console.error(`- ${error}`); process.exitCode=1; }
  else console.log('Catalogue valid: network/station/geo references, streams, counts and en/ta/sa locale parity.');
}
