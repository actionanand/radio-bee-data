import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { fetchHttps } from './check-streams.mjs';
import { readCatalogue, validateCatalogue, validHttps } from './validate.mjs';
import { safeHttpsFetch, LIMITS, boundedInteger } from './safe-https.mjs';

export function detectMedia(bytes) {
  const text=bytes.subarray(0,4096).toString('utf8').trimStart();
  if(text.startsWith('#EXTM3U') && /#EXT-X-/.test(text)) return 'hls';
  if(text.startsWith('#EXTM3U') || /^\[playlist\]/i.test(text)) return 'playlist';
  if(/^<!doctype html|^<html/i.test(text)) return 'html';
  if(bytes.subarray(0,3).toString()==='ID3') return 'mp3';
  // Frame sync is a hint, never a substitute for a decoder or broadcaster evidence.
  for(let i=0;i<Math.min(bytes.length-1,4096);i++) {
    if(bytes[i]===255 && (bytes[i+1]&0xf6)===0xf0) return 'aac';
    if(bytes[i]===255 && (bytes[i+1]&0xe0)===0xe0 && (bytes[i+1]&6)!==0) return 'mp3';
  }
  if(bytes.subarray(0,4).toString()==='OggS') return 'ogg';
  return 'unknown';
}

// Only bounded bytes in memory enter the decoder. No URLs, playlists or audio files
// are handed to FFmpeg; output is decoded PCM counted then discarded.
export function decodeSample(bytes,{command='ffmpeg',timeoutMs=5000}={}) {
  boundedInteger(timeoutMs,LIMITS.decoderTimeoutMs,'decoder timeoutMs');
  if(bytes.length>LIMITS.maxBytes)throw new RangeError('decoder input exceeds byte budget');
  return new Promise(resolve=>{
    const child=spawn(command,['-hide_banner','-loglevel','info','-protocol_whitelist','pipe',
      '-i','pipe:0','-map','0:a:0','-t','2','-ac','1','-ar','8000','-f','s16le','pipe:1'],{windowsHide:true});
    let pcmBytes=0, finished=false, diagnostic='';
    const finish=result=>{if(finished)return;finished=true;clearTimeout(timer);resolve(result);};
    const timer=setTimeout(()=>{child.kill('SIGKILL');finish({outcome:'timeout',pcmBytes});},timeoutMs);
    child.stdout.on('data',chunk=>{pcmBytes+=chunk.length;});
    child.stderr.on('data',chunk=>{if(diagnostic.length<16384)diagnostic+=chunk.toString().slice(0,16384-diagnostic.length);});
    child.stdin.on('error',()=>{});
    child.on('error',error=>finish({outcome:error.code==='ENOENT'?'not-tested':'failed',reason:error.code,pcmBytes}));
    child.on('close',code=>finish({outcome:pcmBytes>0?'decoded':'failed',exitCode:code,pcmBytes,
      codec:diagnostic.match(/Audio:\s*([a-zA-Z0-9_]+)/)?.[1] ?? null,
      sampleRateHz:Number(diagnostic.match(/Audio:[^\n]*?([0-9]+) Hz/)?.[1]) || null,
      completeTwoSeconds:code===0 && pcmBytes>=32000,
      limitation:'A short sample is not sustained playback, audible identity or client compatibility.'}));
    child.stdin.end(bytes);
  });
}

export async function probeStream(url,{fetcher=safeHttpsFetch,timeoutMs=10000,maxBytes=131072,decoder=decodeSample}={}) {
  boundedInteger(timeoutMs,LIMITS.timeoutMs,'timeoutMs');
  boundedInteger(maxBytes,LIMITS.maxBytes,'maxBytes');
  if(!validHttps(url)) return {reachability:'skipped',reason:'unsafe HTTPS URL'};
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  let reader, response, redirects=[], chunks=[], size=0, stop='end';
  try {
    ({response,redirects}=await fetchHttps(url,{method:'GET',maxBytes,signal:controller.signal,
      headers:{'User-Agent':'RadioBeeDataVerification/1.0 (+https://github.com/actionanand/radio-bee-data)','Icy-MetaData':'0','Range':`bytes=0-${maxBytes-1}`}},fetcher));
    if(response.ok && response.body) {
      reader=response.body.getReader();
      while(size<maxBytes) {
        const {done,value}=await reader.read(); if(done)break;
        const part=Buffer.from(value.subarray(0,maxBytes-size)); chunks.push(part);size+=part.length;
      }
      if(size===maxBytes)stop='byte-limit';
    }
  } catch(error) {
    stop=controller.signal.aborted?'timeout':error.cause?.code || error.message;
  } finally {
    controller.abort();clearTimeout(timer);
    if(reader) {try{await reader.cancel();}catch{ /* already aborted */ }}
    else if(response?.body) {try{await response.body.cancel();}catch{ /* aborted */ }}
  }
  const bytes=Buffer.concat(chunks), mediaHint=detectMedia(bytes);
  const decoding=bytes.length && ['mp3','aac','ogg','unknown'].includes(mediaHint)
    ? await decoder(bytes) : {outcome:'not-tested',reason:'No direct audio sample; playlists require separate bounded segment review.'};
  return {reachability:response?.ok?'reachable':'failed',status:response?.status ?? null,
    finalUrl:response?.url || url,redirects,https:response ? 'TLS validated for requested hops' : 'not-established',
    contentType:response?.headers.get('content-type') ?? null,
    corsAllowOrigin:response?.headers.get('access-control-allow-origin') ?? null,
    sampledBytes:size,stop,mediaHint,decoding,
    broadcasterIdentity:'requires-independent-editorial-evidence',webCompatibility:'not-tested',
    androidCompatibility:'not-tested',permission:'not-assessed'};
}

export async function probeAll(data=readCatalogue(),options={}) {
  const errors=validateCatalogue(data);if(errors.length)throw new Error(errors.join('\n'));
  const results=[];
  for(const station of data.stations)for(const stream of station.streams) {
    const samples=[];
    for(let i=0;i<2;i++) samples.push({checkedAt:new Date().toISOString(),...await probeStream(stream.url,options)});
    results.push({stationId:station.id,streamId:stream.id,url:stream.url,samples});
    console.log(`${station.id}/${stream.id}: ${samples.map(s=>`${s.reachability}/${s.mediaHint}/${s.decoding?.outcome}`).join(', ')}`);
  }
  return {checkedAt:new Date().toISOString(),note:'Two short independent connections; no uptime guarantee, identity approval or permission. No catalogue mutation. No audio retained.',results};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const report=await probeAll();mkdirSync('reports',{recursive:true});
  writeFileSync('reports/stream-probes.json',JSON.stringify(report,null,2)+'\n');
  console.log('Wrote reports/stream-probes.json. No catalogue files changed.');
}
