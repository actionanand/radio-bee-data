import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
const inventory=()=>JSON.parse(readFileSync(new URL('../docs/worldwide/stations.json',import.meta.url)));
test('worldwide Tamil discovery covers the six requested countries and sourced additional communities',()=>{
 const d=readCatalogue(),rows=[...d.stations,...d.discoveryStations],world=inventory();
 assert.equal(world.length,20);assert.equal(new Set(world.map(s=>s.id)).size,20);
 for(const code of ['GB','CA','US','AU','SG','AE','MY','CH','DE','NO','NZ','ZA']){
  assert.ok(d.index.countries.includes(code));assert.ok(d.locations.some(l=>l.id===code.toLowerCase()&&l.type==='country'));assert.ok(world.some(s=>s.country===code));
 }
 for(const s of world){const published=rows.filter(x=>x.id===s.id);assert.equal(published.length,1,s.id);assert.ok(published[0].broadcastLanguages.includes('ta'));assert.ok(d.sources.some(x=>x.id===s.sourceId&&x.url===s.evidence));assert.equal(published[0].countryCode,s.country);}
 assert.equal(d.index.counts.discoverableStations,92);assert.deepEqual(validateCatalogue(d),[]);
});
test('digital services and multilingual schedules do not become fabricated analogue FM stations',()=>{
 const d=readCatalogue(),get=id=>[...d.stations,...d.discoveryStations].find(s=>s.id===id);
 for(const id of ['ibc-tamil-uk','atbc-au','cmr-tamil-ca','thaalam-ch','akkini-ch','etr-de','tarana-tamil-nz']){assert.equal(get(id).delivery,'online');assert.equal(get(id).frequencyMHz,null);}
 assert.equal(get('oli-968-sg').frequencyMHz,96.8);assert.equal(get('tamil-894-ae').frequencyMHz,89.4);assert.equal(get('east-fm-ca').frequencyMHz,102.7);
 for(const id of ['raaga-my','minnal-my','lotus-fm-za'])assert.equal(get(id).frequencyMHz,null);
 assert.match(get('east-fm-ca').notes,/multilingual/i);assert.match(get('lotus-fm-za').notes,/not a 24-hour Tamil/);
 assert.match(get('cmr-tamil-ca').notes,/not the multilingual analogue/);
});
test('playable unverified trial candidates retain explicit unresolved verification and permission metadata',()=>{
 const d=readCatalogue(),worldIds=new Set(inventory().map(s=>s.id));
 const trial=d.stations.filter(s=>worldIds.has(s.id));assert.ok(trial.length>0,'retain browser-decoded candidates for trial listening');
 for(const s of trial)for(const stream of s.streams){assert.equal(stream.verificationStatus,'unverified');assert.equal(stream.lastVerifiedAt,null);assert.equal(stream.rightsStatus,'unconfirmed');assert.equal(stream.directListening.status,'needs-review');assert.equal(stream.directListening.recording,s.id==='ibc-tamil-uk'?'prohibited':'unconfirmed');assert.equal(stream.directListening.redistribution,s.id==='ibc-tamil-uk'?'prohibited':'unconfirmed');}
 assert.equal(d.index.counts.productionEligibleStations,0);
 for(const s of d.discoveryStations)assert.equal(Object.hasOwn(s,'streams'),false);
 const urls=d.stations.flatMap(s=>s.streams.map(x=>x.url));assert.equal(urls.some(u=>/MOTSWEDING|josh_pan\.mp3|cloud\.etr\.audio\/recordings/.test(u)),false);
});
