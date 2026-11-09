import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
test('Nagercoil retains primary and adds one independently reviewed unverified alternative without a new card',()=>{
 const d=readCatalogue(),s=d.stations.find(s=>s.id==='air-nagercoil');assert.equal([...d.stations,...d.discoveryStations].filter(s=>s.id==='air-nagercoil').length,1);
 assert.equal(s.streams[0].url,'https://radio.wavespb.com/live/10c64309264eb009/10c64309264eb009.m3u8');
 const alt=s.streams.find(x=>x.id==='air-nagercoil-bitgravity-hls-trial');assert.equal(alt.url,'https://air.pc.cdn.bitgravity.com/air/live/pbaudio129/chunklist.m3u8');assert.equal(alt.verificationStatus,'unverified');assert.equal(alt.lastVerifiedAt,null);assert.equal(alt.rightsStatus,'unconfirmed');assert.deepEqual(alt.directListening,s.streams[0].directListening);
 assert.ok(d.sources.some(x=>x.id===alt.sourceId&&x.notes.includes('user explicitly confirmed')));assert.deepEqual(validateCatalogue(d),[]);
});
test('shared network artwork inventory covers both publication arrays without cross-brand copying',()=>{
 const d=readCatalogue(),inventory=JSON.parse(readFileSync(new URL('../docs/stage11/network-artwork.json',import.meta.url))),all=[...d.stations,...d.discoveryStations];
 for(const row of inventory)assert.equal(row.stations,all.filter(s=>s.networkId===row.networkId).length);
 for(const id of ['akashvani','suryan-in','sooriyan-lk','hello-fm','mirchi','radio-city','big-fm']){assert.ok(d.networks.some(n=>n.id===id));for(const s of all.filter(s=>s.networkId===id))assert.equal(s.logoPath,undefined,'No network logo duplicated onto station '+s.id);}
 assert.notEqual(d.networks.find(n=>n.id==='suryan-in').id,d.networks.find(n=>n.id==='sooriyan-lk').id);
 assert.ok(d.networks.every(n=>!n.logoPath),'No unapproved candidate artwork promoted');
});
