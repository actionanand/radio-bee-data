import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
import {buildBrowseIndex} from '../scripts/catalogue-navigation.mjs';

test('Suryan Chennai has distinct primary and fallback candidates in intended order',()=>{
 const data=readCatalogue(undefined,'v2');
 const station=data.stations.find(s=>s.id==='suryan-chennai');
 assert.ok(station);
 assert.equal(station.streams.length,2);
 assert.deepEqual(station.streams.map(s=>s.url),[
  'https://tamil.crabdance.com:8002/2',
  'https://radios.crabdance.com:8002/2'
 ]);
 for(const s of station.streams){
  assert.equal(s.verificationStatus,'unverified');
  assert.equal(s.rightsStatus,'unconfirmed');
  assert.equal(s.directListening.status,'needs-review');
  assert.equal(s.directListening.recording,'unconfirmed');
  assert.equal(s.directListening.redistribution,'unconfirmed');
  assert.ok(data.sources.some(source=>source.id===s.sourceId));
 }
 assert.equal(data.index.catalogVersion,'2.8.3');
 assert.equal(data.index.counts.streams,245);
 assert.equal(data.discoveryStations.length,0);
 assert.deepEqual(data.browseIndex,buildBrowseIndex(data));
 assert.deepEqual(validateCatalogue(data,{version:'v2'}),[]);
});
