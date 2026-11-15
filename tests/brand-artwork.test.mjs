import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readCatalogue,validateCatalogue,validPublicLogoUrl} from '../scripts/validate.mjs';

const catalogue = () => readCatalogue(undefined,'v2');

test('V2 replaces generic network radio pictures with 11 reviewed brand URLs',()=>{
  const data=catalogue();
  assert.equal(data.networks.filter(network=>network.logoUrl).length,11);
  assert.equal(data.networks.filter(network=>network.logoPath).length,0);
  for(const network of data.networks.filter(network=>network.logoUrl))
    assert.ok(validPublicLogoUrl(network.logoUrl),network.id);
  assert.deepEqual(validateCatalogue(data,{version:'v2'}),[]);
});

test('Akashvani and Suryan share their respective network brand artwork, and Sri Lankan Sooriyan stays separate',()=>{
  const data=catalogue();
  const networkById=new Map(data.networks.map(network=>[network.id,network]));
  const stationById=new Map(data.stations.map(station=>[station.id,station]));
  const airA=networkById.get(stationById.get('air-nagercoil').networkId);
  const airB=networkById.get(stationById.get('air-chennai-rainbow').networkId);
  const suryan=networkById.get(stationById.get('suryan-chennai').networkId);
  const sooriyan=networkById.get(stationById.get('sooriyan-srilanka').networkId);
  assert.equal(airA.logoUrl,airB.logoUrl);
  assert.ok(airA.logoUrl);
  assert.notEqual(suryan.logoUrl,sooriyan.logoUrl);
  assert.ok(suryan.logoUrl&&sooriyan.logoUrl);
});

test('Unverified or unreachable imagery is left unspecified, allowing RadioBee fallback',()=>{
  const data=catalogue();
  for(const id of ['stage29-network-tamil-kadavul-murugan-fm','stage29-network-100-love-radio','stage29-network-100-new-songs','stage29-network-100-sad-songs','shaivam','star-fm-lk','boom-tamil','big-fm','hello-fm']) {
    const network=data.networks.find(n=>n.id===id);
    assert.ok(network,id);
    assert.equal(network.logoUrl,undefined,id);
    assert.equal(network.logoPath,undefined,id);
  }
});

test('Reject malformed and off-domain image URLs without touching the canonical data',()=>{
  for(const url of [
    'http://i1.sndcdn.com/logo.png',
    'https://attacker.example/logo.jpg',
    'https://i1.sndcdn.com@evil.example/logo.png',
    'https://i1.sndcdn.com/x.svg',
    'https://i1.sndcdn.com/x.jpg#fragment',
    'javascript:alert(1)',
    'https://user:pass@i1.sndcdn.com/x.png',
  ])assert.equal(validPublicLogoUrl(url),false,url);
  const data=catalogue();
  data.networks.find(n=>n.id==='akashvani').logoUrl='https://attacker.example/logo.png';
  assert.ok(validateCatalogue(data,{version:'v2'}).some(e=>e.includes('invalid logoUrl')));
});

test('Station schema permits an independently verified override without requiring any artwork',()=>{
  const schema=JSON.parse(readFileSync(new URL('../schema/v2/station.schema.json',import.meta.url)));
  const network=JSON.parse(readFileSync(new URL('../schema/v2/network.schema.json',import.meta.url)));
  for(const item of [schema,network]) {
    assert.ok(item.properties.logoUrl);
    assert.equal(item.required.includes('logoUrl'),false);
  }
});
