import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
import {buildBrowseIndex} from '../scripts/catalogue-navigation.mjs';
const rows=[["hello-telugu-in","te","IN","https://listen.radioking.com/radio/503281/stream/560701"],["radio-malayalam-in","ml","IN","https://radiomalayalamfm.com/radio/8000/radio.mp3"],["bol-punjabi-radio-in","pa","IN","https://bolpunjabi-ekamsoftware.radioca.st//stream"],["radio-mast-marathi-in","mr","IN","https://stream.zeno.fm/8fqvoovoiwtuv"],["freefm-uae-sinhala-ae","si","AE","https://stream.zeno.fm/n7u7aog5og6vv"],["radio-amr-kannada-in","kn","IN","https://stream.zenolive.com/7g8axtgtsg0uv"],["kannada-hits-in","kn","IN","https://stream.zeno.fm/68snnbug8rhvv"],["hindi-gold-radio-in","hi","IN","https://azuracast.vibesounds.in:8010/radio.mp3"],["radio-mirchi-dubai-ae","hi","AE","https://eu8.fastcast4u.com/proxy/clyedupq/stream"],["radio-quarantine-kolkata-in","bn","IN","https://stream.zeno.fm/krk4kw830tzuv"]];
test('Stage 26 adds only decoded HTTPS research candidates and preserves zero discovery cards',()=>{
 const d=readCatalogue(undefined,'v2');
 assert.equal(d.index.catalogVersion,'2.9.0');
 assert.equal(d.stations.length,244);assert.equal(d.index.counts.streams,248);assert.deepEqual(d.discoveryStations,[]);
 for(const [id,language,country,url] of rows){const s=d.stations.find(x=>x.id===id);assert.ok(s,id);assert.deepEqual(s.broadcastLanguages,[language]);assert.equal(s.countryCode,country);assert.equal(s.streams.length,1);assert.equal(s.streams[0].url,url);assert.ok(url.startsWith('https://'));assert.equal(s.streams[0].verificationStatus,'unverified');assert.equal(s.streams[0].rightsStatus,'unconfirmed');assert.equal(s.streams[0].directListening.status,'needs-review');}
 assert.deepEqual(d.browseIndex,buildBrowseIndex(d));assert.deepEqual(validateCatalogue(d,{version:'v2'}),[]);
});
