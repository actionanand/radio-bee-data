import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
import {buildBrowseIndex} from '../scripts/catalogue-navigation.mjs';

test('Stage 40 keeps Mugugan Songs FM and Tamil Kadavul Murugan as distinct programmes',()=>{
  const d=readCatalogue(undefined,'v2');
  const mugugan=d.stations.find(s=>s.id==='stage39-mugugan-songs-fm');
  const kadavul=d.stations.find(s=>s.id==='stage29-tamil-kadavul-murugan-fm');
  assert.ok(mugugan);assert.ok(kadavul);
  assert.notEqual(mugugan.id,kadavul.id);
  assert.notEqual(mugugan.networkId,kadavul.networkId);
  assert.equal(mugugan.streams[0].url,'https://stream.zeno.fm/6seaxxbyxmrvv');
  assert.equal(kadavul.streams[0].url,'https://cast6.asurahosting.com/proxy/tkmradio/stream');
  assert.ok(d.homeStations.stationIds.includes(mugugan.id));
  assert.ok(d.homeStations.stationIds.includes(kadavul.id));
  assert.deepEqual(mugugan.broadcastLanguages,['ta']);
  assert.ok(mugugan.genres.includes('devotional'));
});

test('Stage 40 publishes a distinct Air Tamil 90S Songs stream and labels',()=>{
  const d=readCatalogue(undefined,'v2');
  const added=d.stations.find(s=>s.id==='stage40-air-tamil-90s-songs');
  const existing=d.stations.find(s=>s.id==='stage29-airtamil-90s');
  assert.ok(added);assert.ok(existing);
  assert.notEqual(added.id,existing.id);
  assert.notEqual(added.networkId,existing.networkId);
  assert.equal(added.streams[0].url,'https://stream.zeno.fm/mw96g2eafwzuv');
  assert.equal(existing.streams[0].url,'https://stream.zeno.fm/06ar0cnafwzuv');
  assert.deepEqual(added.broadcastLanguages,['ta']);
  assert.equal(added.streams[0].format,'mp3');
  assert.equal(added.streams[0].verificationStatus,'unverified');
  assert.equal(added.streams[0].rightsStatus,'unconfirmed');
  assert.equal(added.streams[0].directListening.status,'needs-review');
  assert.ok(d.homeStations.stationIds.includes(added.id));
  assert.match(d.i18n.ta.stationNames[added.id],/\p{Script=Tamil}/u);
  assert.match(d.i18n.sa.stationNames[added.id],/\p{Script=Devanagari}/u);
});

test('Stage 40 preserves unique Sri Lankan Raja FM and exposes all sourced languages',()=>{
  const d=readCatalogue(undefined,'v2');
  const raja=d.stations.find(s=>s.id==='stage39-raja-fm-sri-lanka-zeno');
  assert.ok(raja);
  assert.equal(raja.countryCode,'LK');
  assert.equal(raja.streams[0].url,'https://stream.zeno.fm/ute2b5hbrfvtv');
  assert.deepEqual(raja.broadcastLanguages,['si','ta','en']);
  assert.equal(raja.languageProfile.classification,'multilingual');
  assert.ok(d.homeStations.stationIds.includes(raja.id));
  for(const code of ['si','ta','en']){
    assert.ok(d.browseIndex.facets.languages.find(l=>l.id===code).stationIds.includes(raja.id),code);
  }
  assert.ok(d.browseIndex.facets.languageClassifications.find(l=>l.id==='multilingual').stationIds.includes(raja.id));
});

test('Stage 40 catalogue, Home selection, and derived browse index remain consistent',()=>{
  const d=readCatalogue(undefined,'v2');
  assert.equal(d.index.catalogVersion,'2.8.9');
  assert.equal(d.stations.length,288);
  assert.equal(d.networks.length,270);
  assert.equal(d.stations.flatMap(s=>s.streams).length,293);
  assert.equal(d.homeStations.count,d.homeStations.stationIds.length);
  assert.equal(new Set(d.homeStations.stationIds).size,d.homeStations.count);
  const ids=d.stations.flatMap(s=>s.streams.map(x=>x.url));
  assert.equal(new Set(ids).size,ids.length);
  assert.deepEqual(d.browseIndex,buildBrowseIndex(d));
  assert.deepEqual(validateCatalogue(d,{version:'v2'}),[]);
});
