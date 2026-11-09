import test from 'node:test';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';
import {request} from '../scripts/research-network.mjs';import {publicLookup} from '../scripts/safe-https.mjs';import {auditEndpoint} from '../scripts/audit-streams.mjs';
test('Python CSV exports escape malicious fields/headers without changing JSON or source identities',()=>{
 const result=spawnSync('python3',['-B','tests/research_tools_checks.py'],{encoding:'utf8'});assert.equal(result.status,0,result.stdout+result.stderr);
});
test('research bridge rejects private redirect syntax and unexpected status responses',async()=>{
 for(const target of ['https://player.localhost/live','https://169.254.169.254/']){let calls=0;await assert.rejects(request('probe','https://radio.example/live',{fetcher:async()=>{calls++;return new Response(null,{status:302,headers:{location:target}});}}));assert.equal(calls,1);}
 await assert.rejects(request('api','https://radio.example/',{fetcher:async()=>new Response(null,{status:304})}),/HTTP 304/);
});
test('research API fails on a full byte ceiling and probes expose only 2 KiB',async()=>{
 const fetcher=async()=>new Response(new Uint8Array(131073));
 await assert.rejects(request('api','https://radio.example/',{fetcher}),/ceiling/);
 const sample=await request('probe','https://radio.example/',{fetcher});assert.equal(Buffer.from(sample.bytes,'base64').length,2048);
});
test('nested HLS segment DNS is checked before decoding; public-looking private destination is refused',async()=>{
 const looked=[];let decodes=0;
 const fetcher=async(url,options)=>{const host=new URL(url).hostname;looked.push(host);await new Promise((resolve,reject)=>publicLookup({resolver:async()=>[{address:host==='segment.example'?'10.0.0.1':'8.8.8.8',family:4}]})(host,{},e=>e?reject(e):resolve()));return new Response(options.method==='HEAD'?null:'#EXTM3U\n#EXT-X-TARGETDURATION:4\n#EXTINF:4,\nhttps://segment.example/audio.ts\n',{headers:{'content-type':'application/vnd.apple.mpegurl'}});};
 const result=await request('decode','https://radio.example/index.m3u8',{fetcher,audit:(target,options)=>auditEndpoint(target,{...options,decoder:async()=>{decodes++;return {outcome:'decoded'};}})});
 assert.ok(looked.includes('segment.example'));assert.equal(decodes,0);assert.notEqual(result.status,'decoded');
});
test('reviewed decoder workflow passes only bounded segment bytes to the decoder',async()=>{
 let size=0;const fetcher=async(url,options)=>new Response(options.method==='HEAD'?null:url.endsWith('.m3u8')?'#EXTM3U\n#EXT-X-TARGETDURATION:4\n#EXTINF:4,\nhttps://radio.example/audio.ts\n':new Uint8Array([255,251,0,0]));
 const result=await request('decode','https://radio.example/index.m3u8',{fetcher,audit:(target,options)=>auditEndpoint(target,{...options,decoder:async bytes=>{assert.ok(Buffer.isBuffer(bytes));size=bytes.length;return {outcome:'decoded',pcmBytes:32000};}})});
 assert.equal(size,4);assert.equal(result.seconds,2);assert.equal(result.status,'decoded');
 for(const [pcmBytes,exitCode,expected]of [[16000,0,'short-audio'],[32000,1,'partial-error']]){
  const sample=await request('decode','https://radio.example/',{audit:async()=>({sampleDecodeResult:'decoded',decoding:{pcmBytes,exitCode}})});assert.equal(sample.status,expected);
 }
});
