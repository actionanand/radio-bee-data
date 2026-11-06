import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCatalogue, validateCatalogue, validHttps } from './validate.mjs';
import { safeHttpsFetch, LIMITS, boundedInteger } from './safe-https.mjs';

// Validate each redirect before issuing another request (including HTTPS downgrades).
export async function fetchHttps(url, options, fetcher=safeHttpsFetch, maxRedirects=LIMITS.maxRedirects) {
  boundedInteger(maxRedirects,LIMITS.maxRedirects,'maxRedirects',0);
  const redirects=[];
  for(let hop=0; ; hop++) {
    if(!validHttps(url)) throw new Error('redirect to non-HTTPS or blocked URL');
    const response=await fetcher(url,{...options,redirect:'manual'});
    if(![301,302,303,307,308].includes(response.status)) return {response,redirects};
    const location=response.headers.get('location');
    if(response.body) await response.body.cancel();
    if(!location) throw new Error('redirect without Location');
    if(hop>=maxRedirects) throw new Error('too many redirects');
    const next=new URL(location,url).href;
    if(!validHttps(next)) throw new Error('redirect to non-HTTPS or blocked URL');
    redirects.push({status:response.status,from:url,to:next}); url=next;
  }
}

export async function checkStream(url,{timeoutMs=7500,fetcher=safeHttpsFetch}={}) {
  boundedInteger(timeoutMs,LIMITS.timeoutMs,'timeoutMs');
  if(!validHttps(url)) return {outcome:'skipped',reason:'HTTPS URL not safe for basic checking'};
  const controller=new AbortController();
  const cancel=setTimeout(()=>controller.abort(),timeoutMs);
  async function probe(method) {
    const {response,redirects}=await fetchHttps(url,{method,maxBytes:method==='GET'?1:0,signal:controller.signal,headers:{'User-Agent':'RadioBeeDataHealthCheck/1.0 (+https://github.com/actionanand/radio-bee-data)', ...(method==='GET'?{'Range':'bytes=0-0'}:{})}},fetcher);
    const result={status:response.status,contentType:response.headers.get('content-type') ?? null,finalUrl:response.url || url,redirects};
    if(response.body) await response.body.cancel();
    if(response.status>=200&&response.status<300) return {outcome:'reachable',...result};
    return {outcome:'failed',reason:`HTTP ${response.status}`,...result};
  }
  try {
    const head=await probe('HEAD');
    if(head.status===403||head.status===405||head.status===501) return await probe('GET');
    return head;
  }catch(error){return {outcome:'failed',reason:controller.signal.aborted?'timeout':String(error?.message||error).slice(0,130)};}
  finally {clearTimeout(cancel);}
}
export async function checkAll(data=readCatalogue(), opts={}) {
  const errors=validateCatalogue(data); if(errors.length) throw new Error(errors.join('\n'));
  const rows=[];
  for(const s of data.stations){
    for(const stream of s.streams){
      const result=await checkStream(stream.url,opts);
      rows.push({stationId:s.id,streamId:stream.id,verificationStatus:stream.verificationStatus,url:stream.url,...result});
      console.log(`${s.id}/${stream.id}: ${result.outcome} ${result.status||''}`);
    }
  }
  return {checkedAt:new Date().toISOString(),note:'Reachability only, not playback verification, rights approval, codec support or a basis for automatic status changes.',results:rows};
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const report=await checkAll();
  mkdirSync('reports',{recursive:true});
  writeFileSync('reports/stream-health.json',JSON.stringify(report,null,2)+'\n');
  console.log('Wrote reports/stream-health.json. No catalogue files were changed.');
}
