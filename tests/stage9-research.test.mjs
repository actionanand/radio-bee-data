import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,cpSync,mkdirSync,mkdtempSync,rmSync,readdirSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {readCatalogue} from '../scripts/validate.mjs';
import {buildStatic} from '../scripts/build-static.mjs';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url)));
const evidence=read('../docs/stage9/stream-evidence.json');
const cases=read('../docs/stage9/station-discovery.json').stations;
test('Stage 9 investigation counts and source/candidate references reconcile',()=>{
 const summary=evidence.summary,research=evidence.candidates.filter(c=>!c.existingPublished);
 assert.equal(new Set(evidence.sources.map(s=>s.id)).size,evidence.sources.length);
 assert.equal(new Set(evidence.candidates.map(c=>c.id)).size,evidence.candidates.length);
 assert.equal(new Set(cases.map(s=>s.researchId)).size,cases.length);
 assert.equal(cases.length,summary.serviceInvestigations);
 assert.equal(cases.filter(s=>s.citySpecific).length,summary.citySpecificServicesReviewed);
 assert.equal(new Set(cases.map(s=>s.broadcaster==='Radio City Tamil digital'?'Radio City':s.broadcaster)).size,summary.broadcastersInvestigated);
 for(const group of ['A','B','C'])assert.equal(research.filter(c=>c.group===group).length,summary.groups[group]);
 assert.equal(Object.values(summary.groups).reduce((a,b)=>a+b,0),research.length);
 assert.equal(research.filter(c=>c.candidateUrl?.startsWith('https:')).length,summary.researchHttpsEndpointsAssessed);
 assert.equal(research.filter(c=>c.candidateUrl?.startsWith('http:')).length,summary.researchHttpLeadsNotProbed);
 assert.equal(research.filter(c=>c.browserPlayback.result==='decoded-playback-progress').length,summary.browserDecodedResearchCandidates);
 const sourceIds=new Set(evidence.sources.map(s=>s.id)),candidateIds=new Set(evidence.candidates.map(c=>c.id));
 for(const row of [...cases,...evidence.candidates])for(const id of row.sourceIds)assert.ok(sourceIds.has(id),id);
 for(const row of cases)for(const id of row.candidateIds)assert.ok(candidateIds.has(id),id);
});
test('pending Stage 9 research preserves archived identities and stays out of published streams',()=>{
 const d=readCatalogue(),backlog=read('../docs/research/station-backlog.json').stations.map(r=>r.station),known=new Map([...d.stations,...backlog].map(s=>[s.id,s]));
 for(const row of cases)if(row.stationId){const old=known.get(row.stationId);assert.ok(old,row.stationId);assert.equal(row.networkId,old.networkId);assert.equal(row.legacyDistrictId,old.districtId);assert.equal(row.legacyLocalityId,old.localityId);}
 const publishedUrls=new Set(d.stations.flatMap(s=>s.streams.map(x=>x.url)));
 for(const row of evidence.candidates){
  if(row.existingPublished){assert.ok(publishedUrls.has(row.candidateUrl));continue;}
  if(row.group!=='A'&&row.candidateUrl)assert.equal(publishedUrls.has(row.candidateUrl),false,row.id);
  if(row.group!=='A')assert.equal(row.publicationDecision,'research-only');
  for(const url of [row.candidateUrl,row.sourcePage])if(url?.startsWith('http'))assert.equal([...new URL(url).searchParams.keys()].some(k=>/token|signature|^zt$|^zs$|session|lsid/i.test(k)),false,row.id);
 }
 const annai=cases.find(s=>s.stationId==='annai-kuzhithurai');assert.deepEqual(annai.languages,['ta','ml']);
});
test('static build excludes the real Stage 9 research files',()=>{
 const root=mkdtempSync(path.join(os.tmpdir(),'radiobee-stage9-'));
 try{mkdirSync(path.join(root,'data'));cpSync(new URL('../data/v1',import.meta.url),path.join(root,'data/v1'),{recursive:true});
 mkdirSync(path.join(root,'docs'));cpSync(new URL('../docs/stage9',import.meta.url),path.join(root,'docs/stage9'),{recursive:true});
 const dest=buildStatic(root),files=readdirSync(dest,{recursive:true});
 assert.ok(files.includes('v1'));assert.equal(files.some(p=>/stage9|stream-evidence|station-discovery|source-observations|research/.test(p)),false);
 }finally{rmSync(root,{recursive:true,force:true});}
});
