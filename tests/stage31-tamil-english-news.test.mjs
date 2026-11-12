import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
import {buildBrowseIndex} from '../scripts/catalogue-navigation.mjs';
const additions={
  ta:['news18-tamil-nadu','thanthi-tv','puthiya-thalaimurai','news-tamil-24x7','sathiyam-tv','kalaignar-seithigal','tamil-janam'],
  en:['cnn-news18','india-today','ndtv-24x7','ndtv-profit','wion','republic-tv','dd-india','cnbc-tv18','mirror-now','newsx'],
};
test('Stage 31 adds distinct, named HLS TV-news audio trials without relaxing stream rights',()=>{
 const d=readCatalogue(undefined,'v2');
 assert.equal(d.index.catalogVersion,'2.9.0');
 assert.equal(d.stations.length,244);
 assert.equal(d.index.counts.streams,248);
 assert.deepEqual(d.discoveryStations,[]);
 for(const [language,names] of Object.entries(additions)){
  const facet=d.browseIndex.facets.languages.find(x=>x.id===language);
  assert.ok(facet);
  for(const suffix of names){
   const id='stage31-'+suffix,s=d.stations.find(x=>x.id===id);
   assert.ok(s,id);
   assert.deepEqual(s.broadcastLanguages,[language]);
   assert.deepEqual(s.genres,['news']);
   assert.equal(s.streams.length,1);
   const stream=s.streams[0];
   assert.equal(stream.format,'hls');
   assert.ok(stream.url.startsWith('https://')&&stream.url.includes('.m3u8'));
   assert.equal(stream.verificationStatus,'unverified');
   assert.equal(stream.rightsStatus,'unconfirmed');
   assert.equal(stream.directListening.status,'needs-review');
   assert.ok(facet.stationIds.includes(id));
  }
 }
 for(const id of ['stage29-news7-tamil-tv-audio','stage29-polimer-news-tv-audio'])assert.ok(d.stations.some(x=>x.id===id));
 const allUrls=d.stations.flatMap(x=>x.streams.map(y=>y.url));
 assert.equal(new Set(allUrls).size,allUrls.length);
 assert.deepEqual(d.browseIndex,buildBrowseIndex(d));
 assert.deepEqual(validateCatalogue(d,{version:'v2'}),[]);
});
