import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
import {buildBrowseIndex} from '../scripts/catalogue-navigation.mjs';
const ids=["mahakatha-radio-in","shaiva-lahari-in","radio-sai-8006-in","radio-sai-8004-in","radio-sai-8012-in","radio-sai-8010-in"];
test('Stage 23 preserves HTTPS stream policy and archives HTTP-only Radio Sai candidates',()=>{
const d=readCatalogue(undefined,'v2');
assert.equal(d.index.catalogVersion,'2.8.0');assert.equal(d.stations.length,225);assert.equal(d.discoveryStations.length,0);assert.equal(d.index.counts.streams,229);
for(const id of ids.slice(0,2)){const s=d.stations.find(s=>s.id===id);assert.ok(s,id);assert.ok(s.broadcastLanguages.includes('sa'));}
for(const s of d.stations)for(const x of s.streams)assert.match(x.url,/^https:\/\//);
for(const id of ids.slice(2))assert.ok(!d.discoveryStations.some(s=>s.id===id),'research-only '+id);
assert.deepEqual(d.browseIndex,buildBrowseIndex(d));assert.deepEqual(validateCatalogue(d,{version:'v2'}),[]);
});
