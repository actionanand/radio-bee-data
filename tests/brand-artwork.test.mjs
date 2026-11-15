import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readCatalogue,validateCatalogue,validPublicLogoUrl} from '../scripts/validate.mjs';

const catalogue = () => readCatalogue(undefined,'v2');

test('V2 supports original branded and publisher favicon network URLs',()=>{
  const data=catalogue();
  assert.equal(data.networks.filter(network=>network.logoUrl).length,54);
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
  for(const id of ['stage29-network-100-love-radio','stage29-network-100-new-songs','stage29-network-100-sad-songs','hello-fm','star-fm-lk','annai-fm','tarana']) {
    const network=data.networks.find(n=>n.id===id);
    assert.ok(network,id);
    assert.equal(network.logoUrl,undefined,id);
    assert.equal(network.logoPath,undefined,id);
  }
});

test('Reject non-public and malformed image URLs without touching the canonical data',()=>{
  for(const url of [
    'http://i1.sndcdn.com/logo.png',
    'https://attacker.example/logo.jpg',
    'https://localhost/image.png',
    'https://10.0.0.1/pic.jpg',
    'https://i1.sndcdn.com@evil.example/logo.png',
    'https://i1.sndcdn.com:8080/x.svg',
    'https://i1.sndcdn.com/x.jpg#fragment',
    'javascript:alert(1)',
    'https://user:pass@i1.sndcdn.com/x.png',
  ])assert.equal(validPublicLogoUrl(url),false,url);
  for (const image of ['https://www.google.com/s2/favicons?domain=hello.fm&sz=256', 'https://commons.wikimedia.org/wiki/Special:FilePath/Michael_Jackson_in_1988.jpg']) assert.ok(validPublicLogoUrl(image));
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

test('new KEXP and WNYC network artwork is verified and independently identified',()=>{
  const data=catalogue();
  const n=new Map(data.networks.map(x=>[x.id,x]));
  assert.match(n.get('stage24-kexp').logoUrl,/^https:\/\/www\.kexp\.org\/.*\.png$/);
  assert.match(n.get('stage24-wnyc').logoUrl,/^https:\/\/upload\.wikimedia\.org\/.*\.png$/);
  assert.notEqual(n.get('stage24-kexp').logoUrl,n.get('stage24-wnyc').logoUrl);
});

test('artist and devotional station photos override general network artwork',()=>{
  const data=catalogue();
  const map=new Map(data.stations.map(s=>[s.id,s]));
  assert.match(map.get('80s80s-michael-jackson-de').logoUrl,/Michael(?:_|%20| )Jackson/);
  assert.match(map.get('exclusively-michael-jackson-ae').logoUrl,/Michael(?:_|%20| )Jackson/);
  assert.match(map.get('stage29-tamil-kadavul-murugan-fm').logoUrl,/Murugan/);
  for(const s of map.values())if(s.logoUrl)assert.ok(validPublicLogoUrl(s.logoUrl),s.id);
});

test('every published V2 station has network, individual or data-hosted editorial artwork',()=>{
  const data=catalogue();
  const networkById=new Map(data.networks.map(n=>[n.id,n]));
  const editorial=data.stations.filter(s=>s.logoPath?.startsWith('assets/artwork/stations/'));
  assert.equal(editorial.length,169);
  for(const s of data.stations){
    const network=networkById.get(s.networkId);
    assert.ok(s.logoUrl||s.logoPath||network?.logoUrl||network?.logoPath,s.id);
  }
  assert.deepEqual(validateCatalogue(data,{version:'v2'}),[]);
});
