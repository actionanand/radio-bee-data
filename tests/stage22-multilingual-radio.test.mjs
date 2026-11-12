import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalogue, validateCatalogue} from '../scripts/validate.mjs';
import {buildBrowseIndex} from '../scripts/catalogue-navigation.mjs';

const expectedSanskrit=[
 ['divyavani-sanskrit-in','https://divyavani.radioca.st/stream'],
 ['sanskrit-bharati-radio-in','https://stream.zeno.fm/c0adewsyw8quv']
];
const sampleLanguages=[
 ['radio-paloma-de','DE','de'],
 ['nostalgia-fi','FI','fi'],
 ['suomipop-fi','FI','fi'],
 ['pop-fm-dk','DK','da'],
 ['sveriges-radio-p1-se','SE','sv'],
 ['radio-roks-ua','UA','uk'],
 ['jazz-radio-blues-fr','FR','fr'],
 ['radio-jamaica-jm','JM','en']
];
test('Stage 22 keeps dedicated Sanskrit online trial stations and supports accurate filters',()=>{
 const d=readCatalogue(undefined,'v2');
 assert.equal(d.index.catalogVersion,'2.4.0');
 assert.equal(d.stations.length,120);
 assert.equal(d.stations.flatMap(s=>s.streams).length,124);
 assert.equal(d.discoveryStations.length,4);
 for(const [id,url] of expectedSanskrit) {
  const s=d.stations.find(s=>s.id===id);
  assert.ok(s,id);assert.deepEqual(s.broadcastLanguages,['sa']);
  assert.equal(s.delivery,'online');
  assert.equal(s.streams.length,1);assert.equal(s.streams[0].url,url);
  assert.equal(s.streams[0].verificationStatus,'unverified');
  assert.equal(s.streams[0].rightsStatus,'unconfirmed');
  assert.equal(s.streams[0].directListening.status,'needs-review');
  assert.equal(s.streams[0].directListening.recording,'unconfirmed');
  assert.equal(s.streams[0].directListening.redistribution,'unconfirmed');
  assert.ok(d.sources.find(source=>source.id===s.streams[0].sourceId));
 }
 for(const [id,country,lang] of sampleLanguages){
  const s=d.stations.find(x=>x.id===id);
  assert.ok(s,id);
  assert.equal(s.countryCode,country);
  assert.deepEqual(s.broadcastLanguages,[lang]);
  assert.ok(d.index.countries.includes(country));
 }
 assert.ok(d.browseIndex.facets.languages.find(l=>l.id==='sa').stationIds.includes('divyavani-sanskrit-in'));
 assert.ok(d.browseIndex.facets.languages.find(l=>l.id==='sa').stationIds.includes('sanskrit-bharati-radio-in'));
 assert.deepEqual(d.browseIndex,buildBrowseIndex(d));
 assert.deepEqual(validateCatalogue(d,{version:'v2'}),[]);
});
test('Stage 22 maintains all previous IDs and URL uniqueness, no unsupported rights approval',()=>{
 const d=readCatalogue(undefined,'v2');
 const oldIds=['thaalam-in','thaalam-ch','air-nagercoil','mirchi-chennai','suryan-chennai','hello-chennai','big-chennai','radio-city-chennai'];
 for(const id of oldIds)assert.ok(d.stations.some(s=>s.id===id),id);
 assert.equal(d.stations.find(s=>s.id==='thaalam-in').streams[0].url,'https://themelo.in/stream/471');
 assert.equal(d.stations.find(s=>s.id==='thaalam-ch').streams[0].url,'https://thaalamradio.out.airtime.pro/thaalamradio_b');
 assert.equal(d.stations.filter(s=>s.delivery==='fm').length,53);
 assert.equal(d.index.counts.productionEligibleStations,0);
 assert.ok(d.stations.every(s=>s.streams.length));
 const urls=d.stations.flatMap(s=>s.streams.map(u=>u.url));
 assert.equal(new Set(urls).size,urls.length);
 assert.equal(d.index.counts.streams,124);
});
test('Stage 22 manifest includes every network country and all known location references',()=>{
 const d=readCatalogue(undefined,'v2');
 const referenced=[...new Set([...d.networks.flatMap(n=>n.countryCodes),...d.locations.map(l=>l.countryCode),...d.stations.map(s=>s.countryCode)])].sort();
 assert.deepEqual(d.index.countries,referenced);
 for(const locale of d.index.locales)for(const code of ['BR','FI','SE','UA'])assert.ok(d.i18n[locale].countries[code],locale+' missing '+code);
});
