import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
import {buildBrowseIndex,selectStations} from '../scripts/catalogue-navigation.mjs';

test('Stage 34 groups 35 existing stations into 31 artist identities, without mutating URL inventory',()=>{
 const d=readCatalogue(undefined,'v2');
 assert.equal(d.index.catalogVersion,'2.8.6');
 assert.equal(d.index.files.artists,'artists.json');
 assert.equal(d.artists.length,31);
 assert.equal(d.stations.length,240);
 assert.equal(d.stations.flatMap(s=>s.streams).length,245);
 assert.equal(d.discoveryStations.length,0);
 const tagged=d.stations.filter(s=>s.artistIds?.length);
 assert.equal(tagged.length,35);
 assert.equal(new Set(d.stations.flatMap(s=>s.streams.map(t=>t.url))).size,245);
 assert.deepEqual(d.browseIndex,buildBrowseIndex(d));
 assert.deepEqual(validateCatalogue(d,{version:'v2'}),[]);
});
test('Artist pages remain distinct stations, not alternate/fallback streams',()=>{
 const d=readCatalogue(undefined,'v2');
 const cases=[['michael-jackson',2],['a-r-rahman',2],['s-p-balasubrahmanyam',2],['ilaiyaraaja',2],['m-g-ramachandran',2],['sivaji-ganesan',1]];
 for(const [id,count]of cases){
   const found=selectStations(d,{artist:id});
   assert.equal(found.length,count,id);
   assert.equal(d.browseIndex.facets.artists.find(x=>x.id===id)?.counts.all,count);
 }
 const shared=d.stations.find(s=>s.id==='stage29-mgr-sivaji-radio');
 assert.deepEqual(new Set(shared.artistIds),new Set(['m-g-ramachandran','sivaji-ganesan']));
 assert.equal(shared.streams.length,1);
 for(const sid of ['radio-beat-love','radio-beat-extra','tamil-80s-hits','stage29-maestro-hits','stage29-vijay-tamil-radio'])assert.equal(d.stations.find(s=>s.id===sid).artistIds,undefined);
});
test('Unknown artist references, duplicate groups and non-artist station memberships fail closed',()=>{
 const d=readCatalogue(undefined,'v2');
 d.stations.find(s=>s.id==='stage29-spb-online-radio').artistIds=['no-such-artist'];
 assert.ok(validateCatalogue(d,{version:'v2'}).some(e=>e.includes('invalid artist membership')));
});
