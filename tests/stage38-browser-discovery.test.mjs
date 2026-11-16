import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
import {buildBrowseIndex} from '../scripts/catalogue-navigation.mjs';

test('Stage 38 adds only distinct V2 audio candidates without modifying old programmes',()=>{
  const data=readCatalogue(undefined,'v2');
  assert.ok(/^2\.8\.\d+$/.test(data.index.catalogVersion));
  assert.equal(data.stations.filter(s=>!s.id.startsWith('stage39-')&&!s.id.startsWith('stage40-')&&!s.id.startsWith('stage41-')).length,263);
  assert.equal(data.stations.filter(s=>!s.id.startsWith('stage39-')&&!s.id.startsWith('stage40-')&&!s.id.startsWith('stage41-')).flatMap(s=>s.streams).length,268);
  assert.equal(data.networks.filter(n=>!n.id.startsWith('stage39-')&&!n.id.startsWith('stage40-')&&!n.id.startsWith('stage41-')).length,246);
  assert.equal(data.discoveryStations.length,0);
  const added=data.stations.filter(s=>s.id.startsWith('stage38-'));
  assert.equal(added.length,23);
  assert.equal(added.filter(s=>s.networkId==='namm-radio').length,4);
  const allStreams=data.stations.flatMap(s=>s.streams);
  assert.equal(new Set(allStreams.map(s=>s.url)).size,allStreams.length);
  for(const s of added) {
    assert.equal(s.listingStatus,'candidate',s.id);
    assert.equal(s.streams.length,1,s.id);
    const stream=s.streams[0];
    assert.equal(stream.verificationStatus,'unverified',s.id);
    assert.equal(stream.rightsStatus,'unconfirmed',s.id);
    assert.equal(stream.directListening.status,'needs-review',s.id);
    assert.equal(stream.directListening.recording,'unconfirmed',s.id);
    assert.equal(stream.directListening.redistribution,'unconfirmed',s.id);
    assert.ok(stream.url.startsWith('https://'),s.id);
    assert.ok(!/\.aac(?:\?|$)/i.test(stream.url)||!stream.url.includes('segment_'),s.id);
    assert.ok(!/\?zt=|live_180p|\/chunks\.m3u8/i.test(stream.url),s.id);
    assert.ok(data.sources.some(source=>source.id===stream.sourceId),s.id);
    assert.ok(s.logoPath||data.networks.some(n=>n.id===s.networkId&&(n.logoPath||n.logoUrl)),s.id);
  }
  assert.ok(!data.stations.some(s=>/aaj\s*tak|aajtak/i.test(s.id+' '+s.name)));
  assert.ok(!data.stations.some(s=>s.id==='stage38-fm-24-90-8'));
  assert.deepEqual(data.browseIndex,buildBrowseIndex(data));
  assert.deepEqual(validateCatalogue(data,{version:'v2'}),[]);
});
