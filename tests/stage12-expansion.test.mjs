import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,mkdtempSync,rmSync,cpSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {validateCatalogue,validHttps} from '../scripts/validate.mjs';
import {readStage12Catalogue as readCatalogue} from './catalogue-history.mjs';
import {buildStatic} from '../scripts/build-static.mjs';
import {inspectLogo} from '../scripts/logo-assets.mjs';
const root=fileURLToPath(new URL('..',import.meta.url));
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const baseline=read('docs/stage12/baseline.json'),added=read('docs/stage12/stations.json'),art=read('docs/stage12/artwork.json'),helloReview=read('docs/stage12/hello-chennai.json');
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
test('Stage 12 adds seven new programmes and promotes the existing Hello FM Chennai identity',()=>{
 const d=readCatalogue(),all=[...d.stations,...d.discoveryStations];
 assert.equal(added.length,7);assert.equal(new Set(all.map(s=>s.id)).size,92);
 assert.deepEqual(Object.fromEntries(d.stations.filter(s=>baseline.stationHashes[s.id]).map(s=>[s.id,hash(s)])),baseline.stationHashes);
 const reconstructed=[...d.discoveryStations]; reconstructed.splice(helloReview.previousDiscoveryIndex,0,helloReview.previousDiscoveryRecord);
 assert.equal(hash(reconstructed),baseline.discoveryHash);const restoredMigrations=structuredClone(d.stationMigrations);restoredMigrations.removed.splice(helloReview.previousMigrationIndex,0,helloReview.previousMigrationRecord);assert.equal(hash(restoredMigrations),baseline.migrationsHash);assert.ok(!d.stationMigrations.removed.some(m=>m.oldId==='hello-chennai'));assert.ok(!read('docs/research/station-backlog.json').stations.some(r=>r.station.id==='hello-chennai'));
 for(const locale of ['en','ta','sa'])assert.equal(hash(d.i18n[locale]),baseline.localeHashes[locale]);
 assert.deepEqual(d.stations.filter(s=>!baseline.stationHashes[s.id]&&s.id!=='hello-chennai').map(s=>s.id).sort(),added.map(s=>s.id).sort());
 assert.equal(d.index.schemaVersion,1);assert.equal(d.index.catalogVersion,'1.7.0');
 assert.equal(d.stations.length,43);assert.equal(d.discoveryStations.length,49);assert.equal(d.networks.length,47);
 assert.equal(d.stations.flatMap(s=>s.streams).length,46);assert.equal(d.index.counts.discoverableStations,92);
 assert.equal(d.index.counts.productionEligibleStations,0);assert.deepEqual(validateCatalogue(d),[]);
});
test('new trial feeds resolve provenance, unique HTTPS endpoints, references and retain unresolved use/verification',()=>{
 const d=readCatalogue(),urls=d.stations.flatMap(s=>s.streams.map(x=>x.url));assert.equal(new Set(urls).size,urls.length);
 for(const row of added){const s=d.stations.find(s=>s.id===row.id),x=s.streams[0];
  assert.ok(d.networks.some(n=>n.id===s.networkId));assert.ok(d.sources.some(src=>src.id===row.sourceId&&src.url===row.website));
  assert.equal(x.url,row.url);assert.equal(validHttps(x.url),true);assert.equal(x.verificationStatus,'unverified');assert.equal(x.lastVerifiedAt,null);
  assert.equal(x.rightsStatus,'unconfirmed');assert.equal(x.directListening.status,'needs-review');
  assert.equal(x.directListening.recording,'unconfirmed');assert.equal(x.directListening.redistribution,'unconfirmed');
  assert.equal(row.decoding.completeTwoSeconds,true);assert.equal(row.decoding.exitCode,0);assert.equal(row.browserPlayback,'not-tested');
  assert.equal(s.delivery,'online');assert.equal(s.frequencyMHz,null);assert.equal(s.localityId,null);
 }
 assert.equal(d.stations.filter(s=>s.networkId==='hello-fm').length,1);
 assert.equal(d.discoveryStations.filter(s=>s.networkId==='hello-fm').length,10);
 assert.notEqual(d.networks.find(n=>n.id==='suryan-in').logoPath,d.networks.find(n=>n.id==='sooriyan-lk').logoPath);
});
// Decode all PNG scanlines, including filter reconstruction, without a platform codec dependency.
function pixels(bytes){let offset=8,idat=[],width,height;
 while(offset<bytes.length){const n=bytes.readUInt32BE(offset),kind=bytes.toString('ascii',offset+4,offset+8),data=bytes.subarray(offset+8,offset+8+n);assert.equal(data.length,n);
  if(kind==='IHDR'){width=data.readUInt32BE(0);height=data.readUInt32BE(4);assert.deepEqual([...data.subarray(8)],[8,6,0,0,0]);}
  if(kind==='IDAT')idat.push(data);offset+=n+12;if(kind==='IEND')break;
 }
 const raw=inflateSync(Buffer.concat(idat)),stride=width*4;assert.equal(raw.length,height*(stride+1));const decoded=Buffer.alloc(stride*height);
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++){const filter=raw[y*(stride+1)];assert.ok(filter<=4);
  for(let x=0;x<stride;x++){const a=x>=4?decoded[y*stride+x-4]:0,b=y?decoded[(y-1)*stride+x]:0,c=y&&x>=4?decoded[(y-1)*stride+x-4]:0;
   decoded[y*stride+x]=(raw[y*(stride+1)+1+x]+[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][filter])&255;
  }
 }return {width,height,decoded};
}
test('eleven original network illustrations fully decode, satisfy limits and resolve through the v1 build path',()=>{
 const d=readCatalogue();assert.equal(art.length,11);
 assert.equal([...d.stations,...d.discoveryStations].filter(s=>art.some(a=>a.networkId===s.networkId)).length,59);
 const temp=mkdtempSync(path.join(os.tmpdir(),'stage12-art-'));
 try{mkdirSync(path.join(temp,'data'));cpSync(path.join(root,'data/v1'),path.join(temp,'data/v1'),{recursive:true});const dest=buildStatic(temp);
  for(const a of art){assert.equal(a.officialBranding,false);const n=d.networks.find(n=>n.id===a.networkId);assert.equal(n.logoPath,a.path);
   const file=path.join(root,'data/v1',a.path),bytes=readFileSync(file),info=inspectLogo(root,a.path);assert.equal(info.bytes,a.bytes);assert.equal(info.width,512);assert.equal(info.height,512);
   const raster=pixels(bytes);assert.equal(raster.decoded[3],0);assert.equal(raster.decoded[(256*512+256)*4+3],255);
   assert.deepEqual(readFileSync(path.join(dest,'v1',a.path)),bytes);
   assert.equal(new URL(a.path,'https://actionanand.github.io/radio-bee-data/v1/').pathname,'/radio-bee-data/v1/'+a.path);
  }
  for(const p of ['reports','v1/reports','research','v1/research','docs','v1/docs','radio_browser_tamil.csv'])assert.equal(existsSync(path.join(dest,p)),false);
 }finally{rmSync(temp,{recursive:true,force:true});}
});

test('Hello FM Chennai is one unverified AAC trial and no other regional Hello record changes',()=>{
 const d=readCatalogue(),s=d.stations.find(row=>row.id==='hello-chennai'),x=s?.streams[0];
 assert.ok(s);assert.equal(s.networkId,'hello-fm');assert.equal(s.districtId,'in-tn-chennai');
 assert.equal(s.frequencyMHz,106.4);assert.equal(s.delivery,'fm');
 assert.equal(x?.id,'hello-chennai-openstream-aac-trial');
 assert.equal(x?.url,'https://listen.openstream.co/4428/audio');assert.equal(x?.format,'aac');
 assert.equal(x?.verificationStatus,'unverified');assert.equal(x?.lastVerifiedAt,null);
 assert.equal(x?.rightsStatus,'unconfirmed');assert.equal(x?.directListening?.status,'needs-review');
 assert.equal(x?.directListening?.recording,'unconfirmed');assert.equal(x?.directListening?.redistribution,'unconfirmed');
 assert.equal(helloReview.reportedProbe.completeTwoSecondsDecoded,true);
 assert.equal(helloReview.browserPlayback,'not-tested');assert.equal(helloReview.androidPlayback,'not-tested');
 assert.ok(d.sources.some(src=>src.id===x?.sourceId&&src.url===x.url));
 assert.equal(d.stations.filter(row=>row.networkId==='hello-fm').length,1);
 assert.equal(d.discoveryStations.filter(row=>row.networkId==='hello-fm').length,10);
 assert.equal(d.index.counts.discoverableStations,92);assert.equal(d.index.counts.stationsWithStreamCandidates,43);
 assert.equal(d.index.counts.discoveryStations,49);assert.equal(d.index.counts.streams,46);
 assert.deepEqual(validateCatalogue(d),[]);
});
