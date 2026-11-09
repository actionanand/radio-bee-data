import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,cpSync,mkdirSync,writeFileSync,existsSync,rmSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
import {buildStatic} from '../scripts/build-static.mjs';
const read=relative=>JSON.parse(readFileSync(new URL(relative,import.meta.url)));
const backlog=read('../docs/research/station-backlog.json');
test('Internet catalogue and backlog partition every historical station ID',()=>{
 const d=readCatalogue(), historical=read('../docs/stage6/stations.json').stations.map(s=>s.stationId);
 const retained=d.stations.filter(s=>historical.includes(s.id)).map(s=>s.id);
 const all=[...retained,...backlog.stations.map(r=>r.station.id).filter(id=>!retained.includes(id))];
 assert.equal(new Set(all).size,all.length);assert.deepEqual(all.sort(),historical.sort());
 assert.deepEqual(backlog.stations.map(r=>r.station.id).filter(id=>retained.includes(id)),[]);
 const worldwide=[...read('../docs/worldwide/stations.json'),...read('../docs/stage12/stations.json'),...read('../docs/stage13/promotions.json'),...read('../docs/stage14/stations.json')];
 for(const s of d.stations.filter(s=>!historical.includes(s.id)))assert.ok(worldwide.some(row=>row.id===s.id&&row.publication==='unverified-trial')||(s.id==='iskcon-nagercoil'&&s.sourceIds.includes('iskcon-trial-2026')),s.id);
 assert.ok(d.stations.every(s=>s.streams.length));
 assert.deepEqual(d.stationMigrations.removed.map(m=>m.oldId).sort(),backlog.stations.map(r=>r.station.id).filter(id=>!retained.includes(id)).sort());
 assert.ok(d.stationMigrations.removed.every(m=>m.canonicalId===null));
});
test('publication rejects empty streams and same URL on different programme cards',()=>{
 const d=readCatalogue();d.stations[0].streams=[];
 assert.ok(validateCatalogue(d).some(e=>e.includes('requires at least one')));
 const duplicate=readCatalogue();duplicate.stations[1].streams[0].url=duplicate.stations[0].streams[0].url;
 assert.ok(validateCatalogue(duplicate).some(e=>e.includes('shared stream URL')));
 const names=readCatalogue();names.stations[1].name=names.stations[0].name;
 assert.ok(validateCatalogue(names).some(e=>e.includes('duplicate network/programme')));
});
test('alternatives remain under one national Shakthi card without invented geography',()=>{
 const d=readCatalogue(),s=d.stations.find(s=>s.id==='shakthi-srilanka');
 assert.equal(d.stations.filter(s=>s.networkId==='shakthi-lk').length,1);
 assert.equal(s.name,'Shakthi FM Sri Lanka');assert.equal(s.regionId,null);assert.equal(s.localityId,null);
 assert.equal(s.streams.length,2);assert.equal(new Set(s.streams.map(x=>x.id)).size,2);
 assert.ok(s.streams.every(x=>x.rightsStatus==='unconfirmed'&&x.directListening.status==='needs-review'));
 assert.ok(d.stations.some(s=>s.delivery==='fm'));
 assert.deepEqual(validateCatalogue(d),[]);
});
test('migration targets require evidence and cannot shadow retained IDs',()=>{
 const d=readCatalogue();d.stationMigrations.removed[0].canonicalId='air-nagercoil';
 assert.ok(validateCatalogue(d).some(e=>e.includes('requires existing target and provenance')));
 const bad=readCatalogue();bad.stationMigrations.removed[0].oldId=bad.stations[0].id;
 assert.ok(validateCatalogue(bad).some(e=>e.includes('removed station ID')));
 const shape=readCatalogue();shape.stationMigrations.removed={};
 assert.ok(validateCatalogue(shape).some(e=>e.includes('Invalid station migration document')));
});
test('static publication allowlist excludes research even if placed inside data/v1',()=>{
 const root=mkdtempSync(path.join(os.tmpdir(),'radio-internet-'));
 try{mkdirSync(path.join(root,'data'));cpSync(new URL('../data/v1',import.meta.url),path.join(root,'data/v1'),{recursive:true});
 mkdirSync(path.join(root,'data/v1/research'));writeFileSync(path.join(root,'data/v1/research/backlog.json'),'{}');
 writeFileSync(path.join(root,'data/v1/backlog.json'),'{}');
 const dest=buildStatic(root);assert.equal(existsSync(path.join(dest,'v1/research')),false);assert.equal(existsSync(path.join(dest,'v1/backlog.json')),false);
 assert.ok(existsSync(path.join(dest,'v1/station-migrations.json')));
 rmSync(path.join(root,'data/v1/station-migrations.json'));
 assert.ok(validateCatalogue(readCatalogue(root),{root}).some(e=>e.includes('migration manifest reference')));
 const index=JSON.parse(readFileSync(path.join(root,'data/v1/index.json')));delete index.files.stationMigrations;
 writeFileSync(path.join(root,'data/v1/index.json'),JSON.stringify(index));
 buildStatic(root);assert.equal(existsSync(path.join(dest,'v1/station-migrations.json')),false);
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('retained legacy stream approvals and use reviews are unchanged',()=>{
 const historical=read('../docs/stage6/stations.json');const old=new Map(historical.stations.flatMap(s=>s.existingAndAddedCandidates).map(s=>[s.id,s]));
 for(const s of readCatalogue().stations)for(const stream of s.streams){
  const previous=old.get(stream.id);if(previous){for(const key of ['url','verificationStatus','lastVerifiedAt','rightsStatus','directListening'])assert.deepEqual(stream[key],previous[key],`${stream.id}/${key}`);}
 }
});
