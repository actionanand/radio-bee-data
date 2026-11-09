import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validateCatalogue} from '../scripts/validate.mjs';
import {readStage13HotfixCatalogue as readCatalogue} from './catalogue-history.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const saved=read('docs/hotfix13/thoothukudi.json');
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');

test('1.8.1 quarantines the failed Thoothukudi URL and exposes one exact-name discovery record',()=>{
 const d=readCatalogue(),s=d.discoveryStations.filter(s=>s.id==='air-thoothukudi');
 assert.equal(d.index.catalogVersion,'1.8.1');assert.equal(d.stations.some(s=>s.id==='air-thoothukudi'),false);assert.equal(s.length,1);
 assert.equal(s[0].name,'Akashvani Thoothukudi');assert.equal(s[0].availability,'temporarily-unavailable');assert.equal(Object.hasOwn(s[0],'streams'),false);
 for(const key of ['id','name','networkId','countryCode','regionId','districtId','localityId','broadcastLanguages','genres','delivery','coverage','listingStatus','frequencyMHz','website','aliases'])assert.deepEqual(s[0][key],saved.previousStationRecord[key],key);
 assert.deepEqual(s[0].sourceIds.slice(0,saved.previousStationRecord.sourceIds.length),saved.previousStationRecord.sourceIds);
 // A future accidental re-addition of this URL anywhere in playback metadata fails CI.
 assert.ok(d.stations.every(s=>s.streams.every(x=>x.url!==saved.failingUrl)));
 assert.ok(!JSON.stringify(d.stations).includes('2e8cfad789dc692d'));
 assert.equal(d.stations.length,46);assert.equal(d.discoveryStations.length,46);assert.equal(d.stations.flatMap(s=>s.streams).length,49);assert.equal(d.networks.length,47);
 assert.equal(new Set([...d.stations,...d.discoveryStations].map(s=>s.id)).size,92);assert.equal(d.index.counts.discoverableStations,92);assert.equal(d.index.counts.productionEligibleStations,0);
 assert.deepEqual(validateCatalogue(d),[]);
});
test('hotfix preserves every other active/discovery record, source, network and Stage 13 evidence object',()=>{
 const d=readCatalogue();assert.equal(Object.keys(saved.preservedStationHashes).length,46);
 for(const [id,expected]of Object.entries(saved.preservedStationHashes))assert.equal(hash(d.stations.find(s=>s.id===id)),expected,id);
 for(const [id,expected]of Object.entries(saved.preservedDiscoveryHashes))assert.equal(hash(d.discoveryStations.find(s=>s.id===id)),expected,id);
 for(const [id,expected]of Object.entries(saved.preservedSourceHashes))assert.equal(hash(d.sources.find(s=>s.id===id)),expected,id);
 assert.equal(hash(d.networks),saved.networkHash);
 for(const [file,expected]of Object.entries(saved.historicalStage13Hashes))assert.equal(hash(read('docs/stage13/'+file)),expected,file);
 for(const id of ['east-fm-ca','swiss-tamil-radio-ch','lotus-fm-za','hello-chennai','air-nagercoil'])assert.equal(hash(d.stations.find(s=>s.id===id)),saved.preservedStationHashes[id]);
});
test('demotion archives the exact failed candidate and reconciles null-target migration/backlog history',()=>{
 const d=readCatalogue(),backlog=read('docs/research/station-backlog.json');
 assert.deepEqual(d.stationMigrations.removed.filter(m=>m.oldId===saved.stationId),[saved.newMigrationRecord]);
 assert.equal(saved.newMigrationRecord.canonicalId,null);assert.equal(saved.newMigrationRecord.sourceId,null);assert.match(saved.newMigrationRecord.reason,/404/);
 const archived=backlog.stations.filter(r=>r.station.id===saved.stationId);assert.deepEqual(archived,[saved.newBacklogRecord]);assert.deepEqual(archived[0].station,saved.previousStationRecord);
 assert.equal(archived[0].station.streams[0].url,saved.failingUrl);assert.equal(archived[0].station.streams[0].rightsStatus,'unconfirmed');
 const p=read('docs/stage13/promotions.json').find(p=>p.stationId===saved.stationId);assert.equal(p.publication,'unverified-trial');
 const old=read('docs/stage13/technical-checks.json').results.find(r=>r.stationId===saved.stationId);assert.equal(old.decoding.completeTwoSeconds,true);
 const failure=saved.networkChecks.find(r=>r.url===saved.failingUrl);assert.equal(failure.httpStatus,404);assert.equal(failure.mime,'text/html');assert.equal(failure.redirects[0].status,302);
 assert.equal(new URL(failure.redirects[0].to).hostname,'d1tmej9eu7kw5c.cloudfront.net');assert.equal(saved.userChromeEvidence.clientDefectDemonstrated,false);
 const active=new Set(d.stations.map(s=>s.id));assert.ok(d.stationMigrations.removed.every(m=>!active.has(m.oldId)));assert.ok(backlog.stations.every(r=>!active.has(r.station.id)));
});
