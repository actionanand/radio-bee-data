import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
import {buildBrowseIndex} from '../scripts/catalogue-navigation.mjs';

const requested = [
  ['hiru-fm-lk','https://radio.lotustechnologieslk.net:2020/stream/hirufmgarden'],
  ['gold-fm-lk','https://radio.lotustechnologieslk.net:8000/;'],
  ['shaa-fm-lk','https://radio.lotustechnologieslk.net:2020/stream/shaafmgarden'],
  ['asal-tamil-fm-gb','https://stream.zeno.fm/swa83te314zuv'],
  ['yarl-fm-lk','https://stg.lay.breezybamboo.com/session/2sc/0hl/icj/zoa/e.mytuner-radio.com/tyo/qwhvi331tyxywywt3cyrzv0yrmgnnr0mvjmssyrqsjyw7ncs3fv3nywl6ywlfy7nsynafy73iyck6oyeinfci3yceeyfyeqsy7nqycvlqyevtyin43gvycyzyky2yz99qs7xfcy37y7n4yz99yzkymwyzykyl'],
  ['bee-fm-lk','https://stream.zeno.fm/xwueh52exy8uv'],
  ['num-tamil-radio-nz','https://usa15.fastcast4u.com/proxy/tammus00?mp=/;'],
];
const unavailable = [
  ['lankasri-fm-gb','http://media2.lankasri.fm/;stream.mp3'],
  ['ilc-tamil-gb','http://s2.voscast.com:9370/;'],
  ['siragugal-fm-in','http://117.241.19.61:88/broadwave.mp3'],
];

test('Stage 43 publishes each HTTPS station exactly once and preserves its requested URL', () => {
  const data=readCatalogue(undefined,'v2');
  assert.equal(data.index.catalogVersion,'2.8.15');
  assert.deepEqual(validateCatalogue(data,{version:'v2'}),[]);
  assert.equal(data.stations.length,405);
  assert.equal(data.discoveryStations.length,3);
  assert.equal(data.stations.filter(s=>s.name==='Sun FM Sri Lanka').length,1);
  assert.equal(data.stations.find(s=>s.id==='stage41-sun-fm').streams[0].url,'https://radio.lotustechnologieslk.net:2020/stream/sunfmgarden');
  for (const [slug,url] of requested) {
    const match=data.stations.filter(s=>s.id==='stage43-'+slug);
    assert.equal(match.length,1,slug);
    assert.equal(match[0].streams[0].url,url);
    assert.equal(match[0].streams[0].verificationStatus,'unverified');
    assert.equal(match[0].streams[0].rightsStatus,'unconfirmed');
    assert.equal(match[0].streams[0].directListening.status,'needs-review');
    assert.ok(data.networks.some(n=>n.id===match[0].networkId));
    assert.ok(data.sources.some(s=>s.id===match[0].sourceIds[0]));
  }
});

test('HTTP-only stations appear as honest metadata-only discoveries', () => {
  const data=readCatalogue(undefined,'v2');
  for(const [slug,http]of unavailable){
    const id='stage43-'+slug;
    assert.ok(!data.stations.some(s=>s.id===id));
    const d=data.discoveryStations.find(s=>s.id===id);
    assert.ok(d);
    assert.equal(d.availability,'no-direct-stream');
    assert.equal(d.streams,undefined);
    assert.ok(d.notes.includes(http));
  }
  assert.ok(data.stations.every(s=>s.streams.every(x=>x.url.startsWith('https://'))));
  assert.deepEqual(data.browseIndex,buildBrowseIndex(data),'navigation index must match canonical station membership');
});

test('all new network and discovery names are available in all UI locales',()=>{
  const data=readCatalogue(undefined,'v2');
  for(const locale of ['en','ta','sa']){
    const dict=data.i18n[locale];
    for(const [slug] of [...requested,...unavailable])
      assert.ok(dict.networkNames['stage43-network-'+slug]);
    for(const [slug] of unavailable)
      assert.ok(dict.discoveryNames['stage43-'+slug]);
    if(locale!=='en')for(const [slug]of requested)
      assert.ok(dict.stationNames['stage43-'+slug]);
  }
});
