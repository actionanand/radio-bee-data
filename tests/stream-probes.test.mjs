import test from 'node:test';
import assert from 'node:assert/strict';
import { checkStream, fetchHttps } from '../scripts/check-streams.mjs';
import { detectMedia, probeStream, decodeSample, probeAll } from '../scripts/probe-streams.mjs';
import { readCatalogue } from '../scripts/validate.mjs';
import { readFileSync } from 'node:fs';

test('health checker refuses HTTPS downgrade before contacting its target',async()=>{
  const calls=[];
  const fetcher=async url=>{calls.push(url);return new Response(null,{status:302,headers:{location:'http://radio.example.com/audio'}});};
  const result=await checkStream('https://radio.example.com/audio',{fetcher});
  assert.equal(result.outcome,'failed');assert.equal(calls.length,1);
});
test('redirect hops and loops are reported and bounded',async()=>{
  const calls=[];
  const fetcher=async(url,opts)=>{calls.push([url,opts.redirect]);return url.endsWith('/a')
    ? new Response(null,{status:302,headers:{location:'/b'}}):new Response(null,{status:200});};
  const {redirects}=await fetchHttps('https://radio.example.com/a',{},fetcher);
  assert.equal(redirects[0].to,'https://radio.example.com/b');assert.equal(calls[1][1],'manual');
  await assert.rejects(()=>fetchHttps('https://radio.example.com/a',{},async()=>new Response(null,{status:302,headers:{location:'/a'}}),1),/too many/);
});
test('HTML 200 and playlists cannot become decodable audio',async()=>{
  let calls=0; const decoder=async()=>{calls++;return {outcome:'decoded'};};
  for(const body of ['<!doctype html><html>Not radio</html>','#EXTM3U\n#EXT-X-TARGETDURATION:5\nsegment.ts']) {
    const result=await probeStream('https://radio.example.com/',{fetcher:async()=>new Response(body),decoder});
    assert.equal(result.reachability,'reachable');assert.equal(result.decoding.outcome,'not-tested');
    assert.equal(result.webCompatibility,'not-tested');assert.equal(result.permission,'not-assessed');
  }
  assert.equal(calls,0);
});
test('GET bytes are bounded, cancelled, and decoded separately from MIME claims',async()=>{
  let cancelled=false;let decodedSize;
  const body=new ReadableStream({pull(c){c.enqueue(new Uint8Array(1024).fill(42));},cancel(){cancelled=true;}});
  const result=await probeStream('https://radio.example.com/',{maxBytes:64,
    fetcher:async()=>new Response(body,{headers:{'content-type':'audio/mpeg'}}),
    decoder:async bytes=>{decodedSize=bytes.length;return {outcome:'failed'};}});
  assert.equal(result.sampledBytes,64);assert.equal(decodedSize,64);assert.ok(cancelled);
  assert.equal(result.mediaHint,'unknown');assert.equal(result.decoding.outcome,'failed');
});
test('a stalled live body times out even after successful HTTP headers',async()=>{
  const result=await probeStream('https://radio.example.com/',{timeoutMs:20,
    fetcher:async(_url,{signal})=>new Response(new ReadableStream({start(c){signal.addEventListener('abort',()=>c.error(new DOMException('Aborted','AbortError')));}}))});
  assert.equal(result.reachability,'reachable');assert.equal(result.stop,'timeout');
  assert.equal(result.sampledBytes,0);assert.equal(result.decoding.outcome,'not-tested');
});
test('network errors and decoder absence are explicit limitations',async()=>{
  const result=await probeStream('https://radio.example.com/',{fetcher:async()=>{throw new Error('DNS failed');}});
  assert.equal(result.reachability,'failed');assert.equal(result.stop,'DNS failed');
  const decode=await decodeSample(Buffer.from('invalid'),{command:'radiobee-nonexistent-decoder'});
  assert.equal(decode.outcome,'not-tested');assert.equal(decode.reason,'ENOENT');
});
test('media signatures distinguish AAC, MP3, HLS and unknown data',()=>{
  assert.equal(detectMedia(Buffer.from([255,241,80,128])),'aac');
  assert.equal(detectMedia(Buffer.from([255,251,144,0])),'mp3');
  assert.equal(detectMedia(Buffer.from('ID3metadata')),'mp3');
  assert.equal(detectMedia(Buffer.from('[playlist]\nFile1=x')),'playlist');
  assert.equal(detectMedia(Buffer.from('not-audio')),'unknown');
});
test('a health report never mutates catalogue approval, even when a decoder succeeds',async()=>{
  const data=readCatalogue(),before=JSON.stringify(data);
  const report=await probeAll(data,{fetcher:async()=>new Response(Buffer.from('ID3sample')),
    decoder:async()=>({outcome:'decoded',pcmBytes:32})});
  assert.equal(JSON.stringify(data),before);assert.equal(report.results[0].samples.length,2);
});

test('editorial review agrees with language provenance, new station sources and permission state',()=>{
  const evidence=JSON.parse(readFileSync(new URL('../docs/verification/stage3a-editorial-review.json',import.meta.url),'utf8'));
  const data=readCatalogue();
  for(const row of evidence.akashvaniLanguageEvidence.stations) {
    const station=data.stations.find(s=>s.id===row.stationId);
    assert.deepEqual(station.broadcastLanguages,row.broadcastLanguages);
    assert.ok(station.sourceIds.includes(evidence.akashvaniLanguageEvidence.sourceId));
  }
  for(const row of evidence.newStationEvidence) {
    const station=data.stations.find(s=>s.id===row.stationId);assert.ok(station);
    for(const id of row.sourceIds) {
      assert.ok(station.sourceIds.includes(id));assert.equal(data.sources.find(s=>s.id===id).kind,'official');
    }
  }
  assert.equal(data.index.catalogVersion,evidence.catalogVersion);
  const streams=data.stations.flatMap(s=>s.streams);
  assert.equal(streams.filter(s=>s.verificationStatus==='verified').length,evidence.approval.technicalVerifiedStreams);
  assert.equal(streams.filter(s=>s.rightsStatus==='permission-granted').length,evidence.approval.permissionGrantedStreams);
  assert.deepEqual(data.stations.filter(s=>s.streams.some(x=>x.verificationStatus==='verified' && x.rightsStatus==='permission-granted')).map(s=>s.id),evidence.approval.productionEligibleStations);
});
