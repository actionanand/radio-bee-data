import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalogue, validateCatalogue, validHttps} from '../scripts/validate.mjs';
import {allowedV2StreamUrl, legacyHttpStreams} from '../scripts/stream-urls.mjs';

const expected = [
  'hiru-fm-lk','gold-fm-lk','stage41-sun-fm','shaa-fm-lk',
  'lankasri-fm','ilc-tamil-radio','asal-tamil-fm','yarl-fm-lk',
  'siragukal-fm','bee-fm-lk','num-tamil-radio-nz',
];

test('eleven supplied stations appear once (existing Sun FM is not duplicated)', () => {
  const data=readCatalogue(undefined,'v2');
  assert.deepEqual(validateCatalogue(data,{version:'v2'}),[]);
  for(const id of expected)assert.equal(data.stations.filter(s=>s.id===id).length,1,id);
  assert.equal(data.stations.length,408);
  assert.equal(data.networks.length,382);
});

test('all public descriptions are listener-facing, and translated into English, Tamil, Sanskrit', () => {
  const data=readCatalogue(undefined,'v2');
  for(const id of expected) {
    const station=data.stations.find(s=>s.id===id);
    assert.ok(station.about.length>=65,id);
    for(const locale of ['en','ta','sa']){
      const d=data.i18n[locale].stationDescriptions[id];
      assert.ok(typeof d==='string' && d.trim().length>30,`${locale}:${id}`);
      assert.doesNotMatch(d, /(?:https?:\/\/|stream\.zeno\.|\.mp3|audio endpoint|verificationStatus|sourceId)/i,`${locale}:${id}`);
    }
    assert.ok(data.i18n.ta.stationNames[id]);
    assert.ok(data.i18n.sa.stationNames[id]);
  }
});

test('only the three specifically submitted legacy URLs are allowed on HTTP',()=>{
  const data=readCatalogue(undefined,'v2');
  const urls=data.stations.flatMap(s=>s.streams.map(x=>x.url));
  for(const url of legacyHttpStreams)assert.ok(urls.includes(url),url);
  for(const url of ['http://untrusted.example.com/live','http://117.241.19.61:89/broadwave.mp3','http://media2.lankasri.fm/other.mp3','http://127.0.0.1:88/live','http://localhost/radio']) {
    assert.equal(allowedV2StreamUrl(url,validHttps),false,url);
  }
  assert.ok(allowedV2StreamUrl('https://stream.zeno.fm/swa83te314zuv',validHttps));
  assert.equal(validHttps(legacyHttpStreams[0]),false,'V1 remains HTTPS-only');
});
