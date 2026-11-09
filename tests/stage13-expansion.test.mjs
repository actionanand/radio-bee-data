import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {readCatalogue,validateCatalogue,validHttps} from '../scripts/validate.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const baseline=read('docs/stage13/baseline.json'),promotions=read('docs/stage13/promotions.json');
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const restored=(current,key,index,record)=>{
 const result=structuredClone(current);
 for(const p of promotions.filter(p=>p[record]).sort((a,b)=>a[index]-b[index]))result[key].splice(p[index],0,structuredClone(p[record]));
 return result;
};
test('Stage 13 exhaustively accounts for all 49 discovery IDs without introducing or duplicating identities',()=>{
 const d=readCatalogue(),review=read('docs/stage13/discovery-review.json');
 assert.equal(review.stations.length,49);assert.equal(new Set(review.stations.map(s=>s.stationId)).size,49);
 const before=[...d.discoveryStations];for(const p of [...promotions].sort((a,b)=>a.previousDiscoveryIndex-b.previousDiscoveryIndex))before.splice(p.previousDiscoveryIndex,0,p.previousDiscoveryRecord);
 assert.equal(hash(before),baseline.discoveryHash);assert.deepEqual(review.stations.map(r=>r.stationId),before.map(s=>s.id));
 assert.equal(review.stations.filter(r=>r.action==='promoted').length,4);assert.equal(review.stations.filter(r=>r.action==='held').length,45);
 assert.equal(new Set([...d.stations,...d.discoveryStations].map(s=>s.id)).size,92);
 assert.deepEqual([...d.stations,...d.discoveryStations].map(s=>s.id).sort(),[...Object.keys(baseline.stationHashes),...before.map(s=>s.id)].sort());
 assert.deepEqual(promotions.map(p=>p.stationId).sort(),['air-thoothukudi','east-fm-ca','lotus-fm-za','swiss-tamil-radio-ch']);
 assert.equal(d.index.catalogVersion,'1.8.0');assert.equal(d.index.schemaVersion,1);
 assert.equal(d.stations.length,47);assert.equal(d.discoveryStations.length,45);assert.equal(d.stations.flatMap(s=>s.streams).length,50);assert.equal(d.networks.length,47);
 assert.equal(d.index.counts.productionEligibleStations,0);assert.deepEqual(validateCatalogue(d),[]);
});
test('all 43 Stage 12 station objects, source records, artwork, networks and locales remain exact',()=>{
 const d=readCatalogue();for(const [id,expected]of Object.entries(baseline.stationHashes))assert.equal(hash(d.stations.find(s=>s.id===id)),expected,id);
 for(const [id,expected]of Object.entries(baseline.sourceHashes))assert.equal(hash(d.sources.find(s=>s.id===id)),expected,id);
 assert.equal(hash(d.networks),baseline.networkHash);for(const l of ['en','ta','sa'])assert.equal(hash(d.i18n[l]),baseline.localeHashes[l]);
 for(const [file,expected]of Object.entries(baseline.artworkHashes))assert.equal(createHash('sha256').update(readFileSync(new URL('../data/v1/'+file,import.meta.url))).digest('hex'),expected,file);
 const user=read('docs/stage13/user-playback.json');assert.equal(user.stations.length,8);
 for(const row of user.stations)assert.deepEqual(d.stations.find(s=>s.id===row.stationId).streams.map(s=>s.url),row.streamUrls);
});
test('promotions retain regional identity, original sources and truthful independent playback/use metadata',()=>{
 const d=readCatalogue(),ids=new Set(d.stations.map(s=>s.id));
 for(const p of promotions){const s=d.stations.find(s=>s.id===p.stationId),old=p.previousDiscoveryRecord;
  for(const key of ['id','name','networkId','countryCode','regionId','districtId','localityId','broadcastLanguages','genres','delivery','coverage','listingStatus','frequencyMHz','website','aliases'])assert.deepEqual(s[key],old[key],p.stationId+'/'+key);
  assert.deepEqual(s.sourceIds.slice(0,old.sourceIds.length),old.sourceIds);assert.ok(s.sourceIds.includes(p.sourceId));
  assert.ok(d.sources.some(src=>src.id===p.sourceId&&src.url===p.sourceUrl));
  for(const x of s.streams){assert.ok(validHttps(x.url));assert.ok(d.sources.some(src=>src.id===x.sourceId));assert.equal(x.verificationStatus,'unverified');assert.equal(x.lastVerifiedAt,null);assert.equal(x.rightsStatus,'unconfirmed');assert.equal(x.directListening.status,'needs-review');assert.equal(x.directListening.recording,'unconfirmed');assert.equal(x.directListening.redistribution,'unconfirmed');}
  assert.equal(d.discoveryStations.some(s=>s.id===p.stationId),false);
 }
 const archive=read('docs/research/station-backlog.json');
 assert.ok(d.stationMigrations.removed.every(m=>!ids.has(m.oldId)));assert.ok(archive.stations.every(r=>!ids.has(r.station.id)));
 const urls=d.stations.flatMap(s=>s.streams.map(x=>x.url));assert.equal(new Set(urls).size,urls.length);
});
test('Thoothukudi restoration reconciles exact archived records and retains historical stream history',()=>{
 const d=readCatalogue(),p=promotions.find(p=>p.stationId==='air-thoothukudi');
 assert.equal(p.previousMigrationRecord.oldId,'air-thoothukudi');assert.match(p.previousMigrationRecord.reason,/404/);
 assert.equal(p.previousBacklogRecord.station.id,'air-thoothukudi');
 assert.deepEqual(d.stations.find(s=>s.id===p.stationId).streams,p.previousBacklogRecord.station.streams);
 assert.equal(hash(restored(d.stationMigrations,'removed','previousMigrationIndex','previousMigrationRecord')),baseline.migrationHash);
 assert.equal(hash(restored(read('docs/research/station-backlog.json'),'stations','previousBacklogIndex','previousBacklogRecord')),baseline.backlogHash);
 assert.equal(promotions.filter(p=>p.previousMigrationRecord).length,1);assert.equal(promotions.filter(p=>p.previousBacklogRecord).length,1);
 const invalid=readCatalogue();invalid.stationMigrations.removed.push(p.previousMigrationRecord);
 assert.ok(validateCatalogue(invalid).some(e=>e.includes('removed station ID')));
});
test('network-wide and wrong-programme leads do not become fake regional cards',()=>{
 const d=readCatalogue(),review=read('docs/stage13/discovery-review.json');
 for(const [network,count]of [['hello-fm',10],['suryan-in',11],['mirchi',6],['radio-city',3],['big-fm',2]])assert.equal(d.discoveryStations.filter(s=>s.networkId===network).length,count);
 assert.equal(d.stations.filter(s=>s.networkId==='hello-fm').length,1);
 assert.equal(d.networks.find(n=>n.id==='suryan-in').countryCodes[0],'IN');assert.equal(d.networks.find(n=>n.id==='sooriyan-lk').countryCodes[0],'LK');
 const lotus=d.stations.find(s=>s.id==='lotus-fm-za');assert.match(lotus.streams[0].url,/\/LOTUSFMAAC\.aac$/);assert.match(lotus.notes,/not a 24-hour Tamil/);
 assert.equal(d.stations.some(s=>s.streams.some(x=>/MOTSWEDING|josh_pan|crabdance|1ut6qwtbv4uvv|198\.27\.66\.225/.test(x.url))),false);
 assert.equal(review.stations.find(s=>s.stationId==='raaga-my').outcome,'decoded-identity-unresolved');
});
test('technical evidence keeps bounded decoding, browser progress, identity and permission separate',()=>{
 const report=read('docs/stage13/technical-checks.json');assert.equal(report.results.length,8);
 assert.equal(report.results.filter(r=>r.decoding?.completeTwoSeconds).length,5);
 assert.equal(report.limits.mediaBytesPerAudit,131072);assert.equal(report.limits.networkDeadlineMs,35000);assert.equal(report.limits.decoderTimeoutMs,5000);assert.equal(report.limits.maxRedirects,5);assert.equal(report.limits.concurrentAuditRequests,1);assert.equal(report.limits.savedAudioBytes,0);
 for(const r of report.results){assert.ok(r.sampledBytes<=131072);assert.equal(r.permission,'unconfirmed');assert.equal(r.directListening,'needs-review');}
 for(const p of promotions){const r=report.results.find(r=>r.stationId===p.stationId);assert.equal(r.status,'decoded-sample');assert.equal(r.decoding.exitCode,0);assert.equal(r.decoding.pcmBytes,32000);assert.equal(p.androidPlayback,'not-tested');}
 for(const id of ['east-fm-ca','swiss-tamil-radio-ch']){const p=promotions.find(p=>p.stationId===id);assert.ok(p.browserObservation.currentTimeSeconds>3);assert.equal(p.browserObservation.readyState,4);assert.equal(p.browserObservation.humanAudibility,'not-attested');assert.equal(p.browserObservation.stoppedAfterCheck,true);}
 const air=report.results.find(r=>r.stationId==='air-thoothukudi');assert.equal(air.format,'hls');assert.equal(air.segment.httpStatus,206);assert.ok(air.segment.bytes>0);
});
