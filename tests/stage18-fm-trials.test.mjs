import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
import {buildBrowseIndex} from '../scripts/catalogue-navigation.mjs';
const expected=[['mirchi-chennai',1,'aac'],['suryan-chennai',2,'mp3'],['hello-chennai',3,'aac'],['big-chennai',4,'aac'],['radio-city-chennai',5,'aac']];
const before=JSON.parse(readFileSync(new URL('../docs/stage18/pre-import-v2-snapshot.json',import.meta.url),'utf8'));
const held=JSON.parse(readFileSync(new URL('../docs/stage18/held-discovery-stations.json',import.meta.url),'utf8'));
test('Stage 18 publishes only stations with at least one HTTPS URL, no metadata-only cards',()=>{
 const d=readCatalogue(undefined,'v2');
 assert.deepEqual(validateCatalogue(d,{version:'v2'}),[]);
 assert.equal(d.index.catalogVersion,'2.8.5');
 assert.equal(d.stations.length,240);assert.equal(d.discoveryStations.length,0);
 assert.equal(d.stations.filter(s=>s.delivery==='fm').length,57);
 assert.equal(d.stations.flatMap(s=>s.streams).length,245);
 assert.ok(d.stations.every(s=>s.streams.length>0&&s.streams.every(x=>x.url.startsWith('https://'))));
 assert.deepEqual(d.browseIndex,buildBrowseIndex(d));
 assert.equal(d.index.counts.productionEligibleStations,0);
});
test('Five Chennai FM mounts are correctly mapped, unverified and not approved for recording',()=>{
 const d=readCatalogue(undefined,'v2');
 for(const [id,n,fmt]of expected){
  const s=d.stations.find(s=>s.id===id);assert.ok(s,id);assert.equal(s.delivery,'fm');assert.equal(s.districtId,'in-tn-chennai');
  const url='https://radios.crabdance.com:8002/'+n,stream=s.streams.find(x=>x.url===url);
  assert.ok(stream,id);assert.equal(stream.format,fmt);
  assert.equal(stream.verificationStatus,'unverified');assert.equal(stream.rightsStatus,'unconfirmed');
  assert.equal(stream.directListening.status,'needs-review');
  assert.equal(stream.directListening.recording,'unconfirmed');
  assert.equal(stream.directListening.redistribution,'unconfirmed');
  assert.ok(d.sources.some(src=>src.id===stream.sourceId&&src.url===url));
 }
 assert.ok(d.stations.find(s=>s.id==='hello-chennai').streams.some(s=>s.url==='https://listen.openstream.co/4428/audio'));
});
test('All 46 unplayable listings are archived; v2 migration state follows four newly playable identities',()=>{
 const d=readCatalogue(undefined,'v2');
 assert.deepEqual(held,before.discoveryStations);
 assert.equal(held.filter(s=>s.delivery==='fm').length,34);
 const promoted=expected.filter(([id])=>id!=='hello-chennai').map(([id])=>id);
 assert.deepEqual(d.stationMigrations.removed,before.stationMigrations.removed.filter(s=>!promoted.includes(s.oldId)));
 for(const id of promoted)assert.ok(!d.stationMigrations.removed.some(m=>m.oldId===id));
 assert.equal(d.stations.find(s=>s.id==='air-nagercoil').streams.length,2);
});
