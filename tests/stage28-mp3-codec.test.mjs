import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalogue, validateCatalogue} from '../scripts/validate.mjs';
import {buildBrowseIndex} from '../scripts/catalogue-navigation.mjs';
const expected = [{"id":"hello-telugu-in","url":"https://listen.radioking.com/radio/503281/stream/560701"},{"id":"radio-malayalam-in","url":"https://radiomalayalamfm.com/radio/8000/radio.mp3"},{"id":"bol-punjabi-radio-in","url":"https://bolpunjabi-ekamsoftware.radioca.st//stream"},{"id":"radio-mast-marathi-in","url":"https://stream.zeno.fm/8fqvoovoiwtuv"},{"id":"freefm-uae-sinhala-ae","url":"https://stream.zeno.fm/n7u7aog5og6vv"},{"id":"radio-amr-kannada-in","url":"https://stream.zenolive.com/7g8axtgtsg0uv"},{"id":"kannada-hits-in","url":"https://stream.zeno.fm/68snnbug8rhvv"},{"id":"hindi-gold-radio-in","url":"https://azuracast.vibesounds.in:8010/radio.mp3"},{"id":"radio-mirchi-dubai-ae","url":"https://eu8.fastcast4u.com/proxy/clyedupq/stream"},{"id":"radio-quarantine-kolkata-in","url":"https://stream.zeno.fm/krk4kw830tzuv"},{"id":"exclusively-michael-jackson-ae","url":"https://streaming.exclusive.radio/er-app/michaeljackson/icecast.audio"},{"id":"exclusively-justin-bieber-ae","url":"https://streaming.exclusive.radio/er-app/justinbieber/icecast.audio"},{"id":"exclusively-shakira-ae","url":"https://streaming.exclusive.radio/er-app/shakira/icecast.audio"},{"id":"exclusively-one-direction-ae","url":"https://streaming.exclusive.radio/er-app/onedirection/icecast.audio"},{"id":"exclusively-adele-ae","url":"https://streaming.exclusive.radio/er-app/adele/icecast.audio"},{"id":"exclusively-ed-sheeran-ae","url":"https://streaming.exclusive.radio/er-app/edsheeran/icecast.audio"},{"id":"exclusively-queen-ae","url":"https://streaming.exclusive.radio/er-app/queen/icecast.audio"},{"id":"exclusively-westlife-ae","url":"https://streaming.exclusive.radio/er-app/westlife/icecast.audio"}];
test('Stage 28 codec results unblock playable metadata without approving rights',()=>{
 const d=readCatalogue(undefined,'v2');
 assert.equal(d.index.catalogVersion,'2.9.0');
 assert.equal(d.stations.length,244);
 assert.equal(d.stations.flatMap(s=>s.streams).length,248);
 assert.equal(d.discoveryStations.length,0);
 const map=new Map(d.stations.map(s=>[s.id,s]));
 for(const {id,url} of expected){
   const station=map.get(id);assert.ok(station,id);
   const stream=station.streams.find(s=>s.url===url);assert.ok(stream,id);
   assert.equal(stream.format,'mp3');
   assert.equal(stream.verificationStatus,'unverified');
   assert.equal(stream.rightsStatus,'unconfirmed');
   assert.equal(stream.directListening.status,'needs-review');
   assert.equal(stream.directListening.recording,'unconfirmed');
   assert.equal(stream.directListening.redistribution,'unconfirmed');
 }
 assert.ok(d.stations.flatMap(s=>s.streams).every(s=>['mp3','aac','hls'].includes(s.format)));
 assert.deepEqual(d.browseIndex,buildBrowseIndex(d));
 assert.deepEqual(validateCatalogue(d,{version:'v2'}),[]);
});

test('Radio Beat Extra appears under English, not Tamil, while retaining its original stream and permissions',()=>{
 const d=readCatalogue(undefined,'v2');
 const s=d.stations.find(s=>s.id==='radio-beat-extra');
 assert.ok(s);
 assert.deepEqual(s.broadcastLanguages,['en']);
 assert.equal(s.streams[0].url,'https://listen.openstream.co/4172/audio');
 assert.equal(s.streams[0].verificationStatus,'unverified');
 assert.equal(s.streams[0].rightsStatus,'unconfirmed');
 const en=d.browseIndex.facets.languages.find(x=>x.id==='en');
 const ta=d.browseIndex.facets.languages.find(x=>x.id==='ta');
 assert.ok(en.stationIds.includes(s.id));
 assert.ok(!ta.stationIds.includes(s.id));
 assert.deepEqual(d.browseIndex,buildBrowseIndex(d));
 assert.deepEqual(validateCatalogue(d,{version:'v2'}),[]);
});
