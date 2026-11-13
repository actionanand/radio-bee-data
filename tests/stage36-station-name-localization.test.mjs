import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,cpSync,rmSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import os from 'node:os';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
import {stationDisplayName,stationNameErrors,parseLocaleJson} from '../scripts/station-localization.mjs';
const baseline=JSON.parse(readFileSync(new URL('../docs/stage36/baseline.json',import.meta.url)));
const hash=value=>createHash('sha256').update(value).digest('hex');
const get=()=>readCatalogue(undefined,'v2');

test('Stage 36 preserves all 240 canonical records, 245 streams, artists, rights, geography and v1 bytes',()=>{
  const data=get();assert.equal(data.index.catalogVersion,'2.8.6');assert.equal(data.stations.length,240);
  assert.equal(data.stations.flatMap(station=>station.streams).length,245);
  for(const [file,expected]of Object.entries(baseline.protectedFiles))assert.equal(hash(readFileSync(new URL('../data/'+file,import.meta.url))),expected,file);
  assert.equal(hash(JSON.stringify({...data.browseIndex,catalogVersion:baseline.catalogVersion})),baseline.previousBrowseHash);
  for(const locale of ['ta','sa']){const {stationNames,artistNames,...previous}=data.i18n[locale];assert.ok(stationNames);assert.equal(hash(JSON.stringify(previous)),baseline.previousLocaleHashes[locale]);}
  assert.deepEqual(validateCatalogue(data,{version:'v2'}),[]);
});

test('both locale dictionaries cover precisely the 240 canonical IDs with NFC Unicode or exact English fallback',()=>{
  const data=get(),ids=data.stations.map(station=>station.id).sort();
  for(const locale of ['ta','sa']){
    const names=data.i18n[locale].stationNames;assert.deepEqual(Object.keys(names).sort(),ids);
    const script=locale==='ta'?/\p{Script=Tamil}/u:/\p{Script=Devanagari}/u;
    let local=0,fallback=0;
    for(const station of data.stations){const name=names[station.id];assert.equal(typeof name,'string');assert.ok(name.trim());assert.ok(name.isWellFormed());assert.equal(name,name.normalize('NFC'));if(name===station.name)fallback++;else{local++;assert.ok(script.test(name),station.id);}}
    assert.equal(local,224);assert.equal(fallback,16);
  }
  assert.equal(data.i18n.en.stationNames,undefined,'canonical English names are the fallback, not a duplicated station registry');
});

test('missing dictionaries, missing labels, unsupported locales and blank labels safely fall back to canonical English',()=>{
  const data=get(),station=data.stations[0],canonical=station.name;
  assert.equal(stationDisplayName(station,data.i18n,'ta'),'ஆகாஷவாணி நாகர்கோவில்');
  assert.equal(stationDisplayName(station,data.i18n,'sa'),'आकाशवाणी नागरकोविल्');
  for(const locale of ['en','zz'])assert.equal(stationDisplayName(station,data.i18n,locale),canonical);
  delete data.i18n.ta.stationNames[station.id];assert.equal(stationDisplayName(station,data.i18n,'ta'),canonical);assert.deepEqual(stationNameErrors(data),[]);
  data.i18n.ta.stationNames[station.id]=' ';assert.equal(stationDisplayName(station,data.i18n,'ta'),canonical);
  assert.equal(stationDisplayName(station,{},'sa'),canonical);
  delete data.i18n.sa.stationNames;delete data.i18n.ta.stationNames;assert.deepEqual(validateCatalogue(data,{version:'v2'}),[]);
  assert.equal(station.name,canonical);
});

test('numerical frequencies, decade/brand identifiers and artist labels retain their identity',()=>{
  const data=get();
  for(const locale of ['ta','sa']){
    for(const [id,token]of [['oli-968-sg','968'],['tamil-894-ae','89.4'],['stage29-pasumai-90-4-fm','90.4'],['80s80s-michael-jackson-de','80s80s'],['stage29-clubhouse-tamil-90s-2k-vibes','2K'],['3zzz-au','3ZZZ']])assert.ok(data.i18n[locale].stationNames[id].includes(token));
  }
  assert.match(data.i18n.ta.stationNames['ilayaraja-radio'],/இளையராஜா/);
  assert.match(data.i18n.sa.stationNames['exclusively-taylor-swift-ae'],/टेलर् स्विफ़्ट्/);
  assert.deepEqual(stationNameErrors(data),[],'92.3FM may localize FM without inventing a numeric 3FM identifier');
  data.i18n.ta.stationNames['80s80s-michael-jackson-de']='80s 80s மைக்கேல் ஜாக்சன்';assert.ok(stationNameErrors(data).some(error=>error.includes('brand identifier')));
});

test('invalid IDs, values, Unicode, scripts and changed numbers are rejected without weakening UI-label parity',()=>{
  const invalid=[names=>names.obsolete='தமிழ்',names=>names['air-nagercoil']='',names=>names['air-nagercoil']=null,names=>names['air-nagercoil']='\ud800',names=>names['air-nagercoil']='\ufffd தமிழ்',names=>names['air-nagercoil']='ஆ\nகா',names=>names['air-nagercoil']='आकाशवाणी',names=>names['air-nagercoil']={},names=>names['oli-968-sg']='ஒலி 969'];
  for(const mutate of invalid){const data=get();mutate(data.i18n.ta.stationNames);assert.ok(validateCatalogue(data,{version:'v2'}).length);}
  const data=get();data.i18n.sa.stationNames=[];assert.ok(stationNameErrors(data).length);
  delete data.i18n.ta.catalog.title;assert.ok(validateCatalogue(data,{version:'v2'}).some(error=>error.includes('catalog.title')));
});

test('duplicate raw JSON keys, including escaped aliases, are rejected before parsing loses them',()=>{
  for(const raw of [String.raw`{"stationNames":{"air-nagercoil":"தமிழ்","air-nagercoil":"ஒலி"}}`,String.raw`{"stationNames":{"air-nagercoil":"தமிழ்","air-\u006eagercoil":"ஒலி"}}`,String.raw`{"stationNames":{},"station\u004eames":{}}`])assert.throws(()=>parseLocaleJson(raw),/duplicate JSON key/);
  assert.deepEqual(parseLocaleJson('{"a":[{"name":"x"},{"name":"y"}],"b":"a,{}:\\"b"}'),{a:[{name:'x'},{name:'y'}],b:'a,{}:"b'});
});

test('the catalogue loader rejects duplicate translation keys from disk',()=>{
  const temporary=mkdtempSync(path.join(os.tmpdir(),'radiobee-names-'));
  try{cpSync(new URL('../data',import.meta.url),path.join(temporary,'data'),{recursive:true});writeFileSync(path.join(temporary,'data/v2/i18n/ta.json'),'{"stationNames":{"air-nagercoil":"ஆ","air-nagercoil":"இ"}}');assert.throws(()=>readCatalogue(temporary,'v2'),/duplicate JSON key/);}finally{rmSync(temporary,{recursive:true,force:true});}
});
