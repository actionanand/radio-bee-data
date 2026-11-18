import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
import {buildBrowseIndex} from '../scripts/catalogue-navigation.mjs';

test('Stage 42: imported stations have URLs; 89 previously unknown codecs now carry audio type evidence',()=>{
 const d=readCatalogue(undefined,'v2');
 assert.match(d.index.catalogVersion,/^2\\.8\\.\\d+$/);
 assert.equal(d.stations.filter(s=>!s.id.startsWith('stage43-')).length,398);
 assert.equal(d.networks.filter(n=>!n.id.startsWith('stage43-')).length,372);
 assert.equal(d.broadcasters.length,12);
 assert.equal(d.stations.filter(s=>!s.id.startsWith('stage43-')).flatMap(s=>s.streams).length,403);
 const streams=d.stations.filter(s=>!s.id.startsWith('stage43-')).flatMap(s=>s.streams);
 assert.ok(streams.every(s=>typeof s.url==='string'&&s.url.startsWith('https://')));
 assert.equal(streams.filter(s=>s.format==='unknown').length,25);
 assert.equal(streams.filter(s=>s.verificationStatus==='verified').length,1);
 assert.deepEqual(d.browseIndex,buildBrowseIndex(d));
 assert.deepEqual(validateCatalogue(d,{version:'v2'}),[]);
});

test('Stage 42: Mirchi and RED are separate, linked to documented broadcaster and network',()=>{
 const d=readCatalogue(undefined,'v2');
 const mirchi=d.stations.find(s=>s.id==='stage42-mirchi-98-3-online');
 const red=d.stations.find(s=>s.id==='stage42-red-fm-93-5-delhi');
 assert.ok(mirchi);assert.ok(red);
 assert.equal(mirchi.streams[0].url,'https://stream.zeno.fm/wgaznsmt92quv');
 assert.equal(red.streams[0].url,'https://stream.zeno.fm/9phrkb1e3v8uv');
 assert.equal(mirchi.networkId,'mirchi');
 assert.equal(red.networkId,'stage42-red-fm-delhi');
 assert.equal(d.networks.find(n=>n.id===mirchi.networkId)?.broadcasterId,'enil');
 assert.equal(d.networks.find(n=>n.id===red.networkId)?.broadcasterId,'sun-group');
 assert.ok(d.broadcasters.some(b=>b.id==='south-asia-fm-ltd'));
 assert.equal(d.networks.find(n=>n.id==='red-fm')?.broadcasterId,'sun-group');
 for(const s of [mirchi,red]){
  assert.equal(s.streams[0].verificationStatus,'unverified');
  assert.equal(s.streams[0].rightsStatus,'unconfirmed');
  assert.equal(s.streams[0].directListening?.status,'needs-review');
  assert.ok(d.browseIndex.facets.languages.find(f=>f.id==='hi').stationIds.includes(s.id));
  assert.ok(d.browseIndex.facets.networks.find(f=>f.id===s.networkId).stationIds.includes(s.id));
 }
 assert.ok(d.browseIndex.facets.broadcasters.find(f=>f.id==='enil').stationIds.includes(mirchi.id));
 assert.ok(d.browseIndex.facets.broadcasters.find(f=>f.id==='sun-group').stationIds.includes(red.id));
 const oldMirchi=d.stations.find(s=>s.id==='mirchi-chennai');
 const oldSuryan=d.stations.find(s=>s.id==='suryan-chennai');
 const oldBig=d.stations.find(s=>s.id==='big-chennai');
 assert.ok(oldMirchi&&oldSuryan&&oldBig);
 assert.equal(d.networks.find(n=>n.id==='suryan-in').broadcasterId,'sun-group');
 assert.ok(d.browseIndex.facets.broadcasters.find(f=>f.id==='sun-group').stationIds.includes(oldSuryan.id));
 assert.ok(d.sources.some(s=>s.id==='stage42-mib-red-delhi-2026'));
 assert.ok(d.broadcasters.some(b=>b.id==='south-asia-fm-ltd'));
 assert.equal(d.homeStations.count,16);
});

test('Stage 42: one bad endpoint does not erase documented prior stations',()=>{
 const d=readCatalogue(undefined,'v2');
 for(const id of ['stage39-mugugan-songs-fm','stage29-tamil-kadavul-murugan-fm','stage39-raja-fm-sri-lanka-zeno','stage40-air-tamil-90s-songs']){
  assert.ok(d.stations.some(s=>s.id===id),id);
 }
 assert.equal(new Set(d.stations.filter(s=>!s.id.startsWith('stage43-')).flatMap(s=>s.streams.map(t=>t.url))).size,403);
});
