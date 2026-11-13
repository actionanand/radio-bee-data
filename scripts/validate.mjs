import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {inspectLogo} from './logo-assets.mjs';
import {policyErrors} from './listening-policy.mjs';
import {discoveryErrors} from './discovery-catalogue.mjs';
import {metadataErrors,stationGeographyErrors} from './metadata-validation.mjs';
import {v1BaselineErrors} from './versioned-publication.mjs';

const projectRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const codePattern = /^[a-z]{2,3}$/;
const isText = value => typeof value === 'string' && value.trim().length > 0;
const isNullableText = value => value === null || isText(value);
export function readCatalogue(root = projectRoot, version = 'v1') {
  if (!['v1','v2'].includes(version)) throw Error('Unsupported API directory');
  const base = path.join(root,'data',version);
  const file = name => JSON.parse(readFileSync(path.join(base, name), 'utf8'));
  const index = file('index.json');
  const data = Object.fromEntries(['networks', 'stations', 'locations', 'languages', 'categories', 'sources'].map(name => [name, file(`${name}.json`)]));
  data.i18n = Object.fromEntries(['en', 'ta', 'sa'].map(locale => [locale, file(`i18n/${locale}.json`)]));
  data.stationMigrations=existsSync(path.join(base,'station-migrations.json'))?file('station-migrations.json'):undefined;
  data.discoveryStations=existsSync(path.join(base,'discovery-stations.json'))?file('discovery-stations.json'):undefined;
  for(const [key,name]of [['broadcasters','broadcasters.json'],['programmeThemes','programme-themes.json'],['browseIndex','browse-index.json'],['artists','artists.json']])
    if(index.files?.[key]!==undefined && existsSync(path.join(base,name)))data[key]=file(name);
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
export function validateCatalogue(data,{root=projectRoot,version}={}) {
  const errors = [];
  if (!data || typeof data !== 'object') return ['Catalogue is not an object'];
  errors.push(...discoveryErrors(data,validHttps));
  const { index, networks, stations, locations, languages, categories, sources, i18n } = data;
  const isV2=index?.schemaVersion===2;
  if(version!==undefined && (!['v1','v2'].includes(version)||index?.schemaVersion!==Number(version.slice(1))))errors.push('API directory/schemaVersion mismatch');
  for(const [kind,items] of [['Network',networks],['Station',stations]])for(const item of items || []) {
    if(item && Object.hasOwn(item,'logoPath')) {
      try {inspectLogo(root,item.logoPath,isV2?'v2':'v1');}catch(error){errors.push(`${kind} ${item.id}: logoPath: ${error.message}`);}
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
    const previousType = { country: null, state: ['country'], district: ['state'], locality: isV2?['country','state','district']:['district'] }[item.type];
    if (previousType === null) {
      if (item.parentId !== null || item.id !== item.countryCode.toLowerCase()) errors.push(`Country ${item.id}: parent or ISO code mismatch`);
    } else {
      const parent = loc.get(item.parentId);
      if (!parent || !previousType?.includes(parent.type) || parent.countryCode !== item.countryCode) errors.push(`Location ${item.id}: invalid parent ${item.parentId}`);
    }
  }
  const streamIds = new Set();
  const programmeNames=new Set(),streamOwners=new Map();
  for (const item of stations || []) {
    const fail = message => errors.push(`Station ${item.id}: ${message}`);
    if(item.aliases!==undefined && (!Array.isArray(item.aliases)||item.aliases.some(a=>!isText(a))||new Set(item.aliases).size!==item.aliases.length))fail('invalid station aliases');
    const programmeKey=`${item.networkId}|${String(item.name).trim().toLowerCase()}`;
    if(programmeNames.has(programmeKey))fail('duplicate network/programme name');
    programmeNames.add(programmeKey);
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
    if(isV2)for(const message of stationGeographyErrors(item,locations))fail(message);
    else {
      if (item.districtId !== null && (!item.regionId || loc.get(item.districtId)?.parentId !== item.regionId)) fail('district/region mismatch');
      if (item.localityId !== null && (!item.districtId || loc.get(item.localityId)?.parentId !== item.districtId)) fail('locality/district mismatch');
    }
    if (!Array.isArray(item.streams)) { fail('streams must be array'); continue; }
    if(!item.streams.length)fail('published internet station requires at least one direct stream candidate');
    for (const stream of item.streams) {
      try {const key=new URL(stream.url).href;const owner=streamOwners.get(key);if(owner)fail(owner===item.id?'duplicate stream URL within programme':'shared stream URL across station cards; consolidate proven programme identity');streamOwners.set(key,item.id);}catch{}
      for(const message of policyErrors(stream,src))fail(`stream ${stream.id}: ${message}`);
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
  const migrations=data.stationMigrations;
  if(migrations && (migrations.schemaVersion!==1 || !Array.isArray(migrations.removed)))errors.push('Invalid station migration document');
  const removedIds=new Set();
  for(const migration of Array.isArray(migrations?.removed)?migrations.removed:[]) {
    if(!migration || typeof migration!=='object' || Array.isArray(migration)) {errors.push('Invalid station migration entry');continue;}
    const keys=['oldId','canonicalId','sourceId','reason'];
    if(keys.some(k=>!Object.hasOwn(migration,k)) || Object.keys(migration).some(k=>!keys.includes(k)))errors.push('Invalid station migration fields');
    if(!isText(migration.oldId)||!idPattern.test(migration.oldId)||removedIds.has(migration.oldId)||sta.has(migration.oldId))errors.push('Invalid/duplicate removed station ID');
    removedIds.add(migration.oldId);
    if(!isText(migration.reason))errors.push('Station migration requires reason');
    if(migration.canonicalId!==null&&(!sta.has(migration.canonicalId)||!src.has(migration.sourceId)))errors.push('Canonical station migration requires existing target and provenance');
    if(migration.canonicalId===null&&migration.sourceId!==null)errors.push('Unavailable station migration must have null provenance');
  }
  if (!index || ![1,2].includes(index.schemaVersion) || !isText(index.catalogVersion) || !/^\d{4}-\d{2}-\d{2}$/.test(index.publishedOn)) errors.push('Invalid index metadata');
  if(isV2) {
    const fields=['schemaVersion','catalogVersion','publishedOn','defaultLocale','locales','countries','counts','files','localizationRoot','disclaimer'];
    if(fields.some(key=>!Object.hasOwn(index,key))||Object.keys(index).some(key=>!fields.includes(key))||!isText(index.disclaimer))errors.push('Invalid v2 manifest fields');
    const countKeys=['networks','stations','locations','streams','verifiedStreams','discoveryStations','discoverableStations','stationsWithStreamCandidates','productionEligibleStations'];
    if(!index.counts||typeof index.counts!=='object'||Array.isArray(index.counts)||countKeys.some(key=>!Number.isInteger(index.counts[key])||index.counts[key]<0)||Object.keys(index.counts).some(key=>!countKeys.includes(key)))errors.push('Invalid v2 manifest count fields');
    if(typeof index.publishedOn!=='string'||!Number.isFinite(Date.parse(index.publishedOn))||new Date(index.publishedOn).toISOString().slice(0,10)!==index.publishedOn)errors.push('Invalid v2 publication date');
    if(!/^2\.\d+\.\d+$/.test(index.catalogVersion)||index.localizationRoot!=='i18n/')errors.push('Invalid v2 catalogue version/localization root');
    const files={networks:'networks.json',stations:'stations.json',locations:'locations.json',languages:'languages.json',categories:'categories.json',sources:'sources.json',stationMigrations:'station-migrations.json',discoveryStations:'discovery-stations.json',broadcasters:'broadcasters.json',programmeThemes:'programme-themes.json',browseIndex:'browse-index.json',artists:'artists.json'};
    const optional=['broadcasters','programmeThemes','browseIndex','artists'];
    if(!index.files||Object.keys(index.files).some(key=>!Object.hasOwn(files,key))||Object.entries(files).some(([key,file])=>(!optional.includes(key)||index.files?.[key]!==undefined)&&index.files?.[key]!==file))errors.push('Invalid or incomplete v2 manifest references');
    // v2 manifest declares every country used by its referenced registries, not
    // just countries with a playable station. Clients validate network and
    // location records before displaying the station directory.
    const countries=[...new Set([
      ...(networks??[]).flatMap(n=>n.countryCodes??[]),
      ...(locations??[]).map(l=>l.countryCode),
      ...(stations??[]).map(s=>s.countryCode),
      ...(data.discoveryStations??[]).map(s=>s.countryCode),
    ])].sort();
    if(JSON.stringify(index.countries)!==JSON.stringify(countries))errors.push('Invalid v2 manifest country inventory');
  }
  if (index?.defaultLocale !== 'en' || JSON.stringify(index?.locales) !== JSON.stringify(['en','ta','sa'])) errors.push('Invalid index locales');
  if (index?.counts) {
    for (const [key, actual] of Object.entries({ networks:networks?.length, stations:stations?.length, locations:locations?.length, streams:[...(stations || [])].reduce((sum,s)=>sum+(s.streams?.length || 0),0), verifiedStreams:[...(stations || [])].reduce((sum,s)=>sum+(s.streams || []).filter(z=>z.verificationStatus==='verified').length,0) }))
      if (index.counts[key] !== actual) errors.push(`index count ${key} is stale`);
  } else errors.push('Index counts missing');
  const targetFiles = ['networks','stations','locations','languages','categories','sources'];
  for (const key of targetFiles) if (index?.files?.[key] !== `${key}.json`) errors.push(`index file ref missing: ${key}`);
  if(index?.files?.stationMigrations!==undefined && (index.files.stationMigrations!=='station-migrations.json'||!migrations))errors.push('Invalid station migration manifest reference');
  if (!i18n?.en || !i18n?.ta || !i18n?.sa) errors.push('Missing i18n locale');
  else {
    for (const code of ['en','ta','sa']) checkLocaleShape(i18n.en, i18n[code], code, errors);
    for (const category of categories || []) for (const code of ['en','ta','sa']) if (!isText(i18n[code]?.categories?.[category.id])) errors.push(`${code}: missing category ${category.id}`);
  }
  if(isV2)errors.push(...metadataErrors(data,validHttps));
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

export function validateRepository(root=projectRoot) {
  const errors=[];
  for(const version of ['v1','v2'])try{errors.push(...validateCatalogue(readCatalogue(root,version),{root,version}).map(e=>version+': '+e));}catch(error){errors.push(version+': '+error.message);}
  errors.push(...v1BaselineErrors(root));
  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let errors;
  try { errors = validateRepository(); }
  catch (error) { console.error(`Cannot read catalogue: ${error.message}`); process.exit(1); }
  if (errors.length) { console.error(`Catalogue invalid: ${errors.length} error(s)`); for (const error of errors) console.error(`- ${error}`); process.exitCode=1; }
  else console.log('Catalogues valid: v1 baseline preserved; v2 references, metadata, streams, counts, browse index and en/ta/sa locale parity.');
}
