import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
import {buildBrowseIndex} from '../scripts/catalogue-navigation.mjs';
const streamIds=["kexp-seattle-us","wnyc-939-us","wqxr-1059-us"];
const discoveryIds=["chennai-live-digital-in","radio-one-chennai-in","voice-of-arunachala-in"];
test('Stage 24 preserves previous catalogue and adds HTTPS trial streams and English discovery',()=>{
const d=readCatalogue(undefined,'v2');
assert.equal(d.index.catalogVersion,'2.7.0');assert.equal(d.stations.length,144);assert.equal(d.discoveryStations.length,0);assert.equal(d.index.counts.streams,148);
for(const id of streamIds){const s=d.stations.find(x=>x.id===id);assert.ok(s,id);assert.ok(s.broadcastLanguages.includes('en'));assert.ok(s.streams.every(x=>x.url.startsWith('https://')&&x.verificationStatus==='unverified'&&x.rightsStatus==='unconfirmed'));}
assert.deepEqual(d.discoveryStations,[]);
for(const id of ['thaalam-in','thaalam-ch','divyavani-sanskrit-in','mahakatha-radio-in'])assert.ok(d.stations.some(s=>s.id===id));
assert.deepEqual(d.browseIndex,buildBrowseIndex(d));assert.deepEqual(validateCatalogue(d,{version:'v2'}),[]);
});
