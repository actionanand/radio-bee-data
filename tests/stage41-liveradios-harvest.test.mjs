import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readCatalogue, validateCatalogue } from '../scripts/validate.mjs';
import { buildBrowseIndex } from '../scripts/catalogue-navigation.mjs';

const selected=JSON.parse(readFileSync(new URL('../research/liveradios-selection-2026-11-16.json',import.meta.url),'utf8')).selection;

test('Stage 41 imports 108 distinct V2 streams with source provenance, no playback approval',()=>{
 const d=readCatalogue(undefined,'v2');
 assert.match(d.index.catalogVersion,/^2\.8\.\d+$/);
 const imported=d.stations.filter(s=>s.id.startsWith('stage41-'));
 assert.equal(imported.length,108);
 assert.equal(selected.length,108);
 assert.equal(d.stations.filter(s=>!s.id.startsWith('stage42-')&&!s.id.startsWith('stage43-')).length,396);
 assert.equal(d.networks.filter(n=>!n.id.startsWith('stage42-')&&!n.id.startsWith('stage43-')).length,371);
 assert.equal(d.locations.length,148);
 assert.equal(d.stations.filter(s=>!s.id.startsWith('stage42-')&&!s.id.startsWith('stage43-')).flatMap(s=>s.streams).length,401);
 assert.ok(d.index.counts.stations>=396);
 assert.ok(d.index.counts.streams>=401);
 const byId=new Map(imported.map(s=>[s.id,s]));
 const references=new Map(d.sources.map(s=>[s.id,s]));
 for(const item of selected){
   const station=byId.get(item.id);
   assert.ok(station,item.id);
   assert.equal(station.name,item.name,item.id);
   assert.equal(station.countryCode,item.country,item.id);
   assert.deepEqual(station.broadcastLanguages,[item.lang],item.id);
   assert.deepEqual(station.genres,[item.genre],item.id);
   assert.equal(station.streams.length,1,item.id);
   assert.equal(station.streams[0].url,item.url,item.id);
   assert.equal(station.streams[0].verificationStatus,'unverified',item.id);
   assert.equal(station.streams[0].rightsStatus,'unconfirmed',item.id);
   assert.equal(station.streams[0].directListening.status,'needs-review',item.id);
   assert.ok(station.sourceIds.every(id=>references.has(id)),item.id);
   assert.ok(d.browseIndex.stationIds.includes(item.id),item.id);
   assert.ok(d.browseIndex.facets.languages.find(x=>x.id===item.lang)?.stationIds.includes(item.id),item.id);
 }
 assert.equal(new Set(d.stations.map(s=>s.id)).size,d.stations.length);
 const urls=d.stations.flatMap(s=>s.streams.map(t=>t.url));
 assert.equal(new Set(urls).size,urls.length);
 assert.deepEqual(d.browseIndex,buildBrowseIndex(d));
 assert.deepEqual(validateCatalogue(d,{version:'v2'}),[]);
});

test('Stage 41 adds language identities and Bangladesh without conflating stations',()=>{
 const d=readCatalogue(undefined,'v2');
 const added=d.stations.filter(s=>s.id.startsWith('stage41-'));
 for(const [code,count] of Object.entries({ta:37,en:7,hi:14,pa:10,or:2,mr:4,ml:19,bn:3,gu:6,bgc:1,kok:3,bho:1,sd:1})){
   assert.ok(d.languages.some(l=>l.code===code),code);
   assert.equal(added.filter(s=>s.broadcastLanguages.includes(code)).length,count,code);
 }
 assert.equal(d.languages.find(x=>x.code==='har')?.name,'Harari');
 assert.equal(d.languages.find(x=>x.code==='bgc')?.name,'Haryanvi');
 assert.equal(d.stations.filter(s=>s.id.startsWith('stage41-')&&s.countryCode==='BD').length,3);
 assert.ok(d.locations.some(l=>l.id==='bd'&&l.type==='country'));
 for(const locale of ['en','ta','sa'])assert.ok(d.i18n[locale].countries.BD);
 for(const id of ['stage29-tamil-kadavul-murugan-fm','stage39-mugugan-songs-fm','stage40-air-tamil-90s-songs'])
   assert.ok(d.stations.some(s=>s.id===id),id);
 assert.equal(d.homeStations.count,16,'existing curated Home selection remains unchanged');
});
