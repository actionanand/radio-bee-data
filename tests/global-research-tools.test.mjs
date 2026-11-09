import test from 'node:test';import assert from 'node:assert/strict';
import {normalizedName,deduplicateCandidates,spreadsheetCell,researchCsv,auditCandidates,reportPath,resumeState,inspectPage} from '../scripts/research-tamil-expansion.mjs';
const row={id:'radio-one',name:'Tamil Radio',publisherId:'one',programme:'Tamil Radio',url:'https://radio.example.com/live',countryCode:'IN',sourceUrl:'https://example.com/'};
test('global research normalizes identities and distinguishes programmes from shared endpoints',()=>{
 assert.equal(normalizedName(' தமிழ்  RADIO—１ '),'தமிழ் radio 1');
 const result=deduplicateCandidates([row,{...row,id:'alias',name:'Tamil-Radio',programme:'tamil radio'},{...row,id:'wrong-publisher',publisherId:'two'},{...row,id:'distinct',programme:'Devotional',url:'https://radio.example.com/devotional'}]);
 assert.deepEqual(result.candidates.map(r=>r.id),['radio-one','distinct']);assert.equal(result.duplicates.length,2);
 assert.match(result.duplicates[1].reason,/identity review/);
 assert.throws(()=>deduplicateCandidates([row,{...row,programme:'different'}]),/Conflicting/);
 for(const url of ['http://radio.example.com/live','https://foo.localhost/live','https://radio.example.com/live?token=private','https://radio.example.com/live?zt=signed','https://u:p@radio.example.com/live','https://radio.example.com/live#fake-programme','https://radio.example.com/live?nocache=signed','https://radio.example.com/live?dist=token.jwt'])assert.throws(()=>deduplicateCandidates([{...row,url}]),/Unsafe/);
 for(const suffix of ['?mp=/1','?type=mp3&nocache=','?dist=3zzzwebsite'])assert.equal(deduplicateCandidates([{...row,url:row.url+suffix}]).candidates.length,1);
});

test('publisher page inspection caps bytes, cancels the body and retains non-success HTTP status',async()=>{
 let cancelled=false,signal,options;
 const result=await inspectPage(row.sourceUrl,{fetcher:async(_url,o)=>{options=o;signal=o.signal;return new Response(new ReadableStream({start(c){c.enqueue(new Uint8Array(262144).fill(65));},cancel(){cancelled=true;}}),{status:503,headers:{'content-type':'text/html'}});}});
 assert.equal(result.httpStatus,503);assert.equal(result.bytes,131072);assert.equal(result.text.length,131072);assert.equal(result.truncated,true);assert.ok(cancelled);assert.ok(signal.aborted);assert.equal(options.maxBytes,131072);assert.equal(options.redirect,'manual');
});

test('serial research preserves the completed checkpoint when a later operation fails',async()=>{
 let active=0,max=0;const saved=[];const rows=[row,{...row,id:'next',programme:'Next',url:row.url+'/next'}];
 await assert.rejects(()=>auditCandidates(rows,{delayMs:0,pause:async()=>{},probe:async target=>{active++;max=Math.max(max,active);await new Promise(resolve=>setImmediate(resolve));active--;if(target.id==='next')throw Error('simulated interruption');return {id:target.id,requestUrl:target.url,status:'down'};},checkpoint:r=>saved.push(structuredClone(r))}),/interruption/);
 assert.equal(max,1);assert.equal(saved.length,1);assert.equal(saved[0].results[0].status,'down');assert.equal(rows.length,2);
 await assert.rejects(()=>auditCandidates(rows,{delayMs:10001}),/rate delay/);
});
test('global CSV export escapes untrusted formula values without changing JSON metadata',()=>{
 const values=['=HYPERLINK("https://evil.example")',' +SUM(1,2)','-1+2','@SUM(1)','\tformula','\rformula','\nformula','\ufeff=1','\u0000=1'];
 for(const value of values){assert.equal(spreadsheetCell(value),"'"+value);const r={...row,name:value};const before=JSON.stringify(r);assert.ok(researchCsv([r]).includes("'"));assert.equal(JSON.stringify(r),before);}
 assert.equal(spreadsheetCell('தமிழ் Radio'),'தமிழ் Radio');assert.match(researchCsv([{...row,name:'say "hello"'}]),/say ""hello""/);
});
test('research resumes exact checkpoints serially without editing candidates or granting approval',async()=>{
 const rows=[row,{...row,id:'two',programme:'two',url:'https://radio.example.com/two'}],prior=[{id:row.id,requestUrl:row.url,status:'down'}],calls=[],saved=[];
 const before=JSON.stringify(rows);const result=await auditCandidates(rows,{previous:prior,delayMs:0,pause:async()=>{},probe:async(r,o)=>{calls.push([r.id,o.mode]);return{id:r.id,requestUrl:r.url,status:'decoded-sample'};},checkpoint:r=>saved.push(structuredClone(r))});
 assert.deepEqual(calls,[['two','deep']]);assert.equal(result.results.length,2);assert.equal(result.results[0].status,'down');assert.equal(result.results[1].editorialApproval,'not-granted');assert.equal(saved.length,1);assert.equal(JSON.stringify(rows),before);
 const meta=resumeState(rows,null);assert.equal(resumeState(rows,{...meta,results:prior}).previous,prior);assert.throws(()=>resumeState(rows,{results:[]}),/matching/);assert.throws(()=>resumeState([],{...meta,results:prior}),/matching/);
});
test('research reports cannot target catalogue files or historical nonmatching reports',()=>{
 assert.ok(reportPath('reports/stage14/checkpoint.json').endsWith('checkpoint.json'));
 for(const file of ['data/v1/stations.json','reports/../data/v1/stations.json','reports/results.csv'])assert.throws(()=>reportPath(file),/inside reports/);
 assert.throws(()=>resumeState([row],{kind:'historical-audit',results:[]}),/matching/);
});
