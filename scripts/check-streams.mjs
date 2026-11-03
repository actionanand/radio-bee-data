import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { readCatalogue, validateCatalogue, validHttps } from './validate.mjs';

export async function checkStream(url,{timeoutMs=7500,fetcher=fetch}={}) {
  if(!validHttps(url)) return {outcome:'skipped',reason:'HTTPS URL not safe for basic checking'};
  async function probe(method) {
    const controller=new AbortController();
    const cancel=setTimeout(()=>controller.abort(),timeoutMs);
    try {
      const response=await fetcher(url,{method,redirect:'follow',signal:controller.signal,headers:{'User-Agent':'RadioBeeDataHealthCheck/1.0 (+https://github.com/actionanand/radio-bee-data)', ...(method==='GET'?{'Range':'bytes=0-0'}:{})}});
      const result={status:response.status,contentType:response.headers.get('content-type') ?? null};
      if(!validHttps(response.url)) return {outcome:'failed',reason:'redirect to non-HTTPS or blocked URL',...result};
      if(response.body) await response.body.cancel();
      if(response.status>=200&&response.status<400) return {outcome:'reachable',...result};
      return {outcome:'failed',reason:`HTTP ${response.status}`,...result};
    } finally { clearTimeout(cancel); }
  }
  try {
    const head=await probe('HEAD');
    if(head.status===403||head.status===405||head.status===501) return await probe('GET');
    return head;
  }catch(error){return {outcome:'failed',reason:error?.name==='AbortError'?'timeout':String(error?.message||error).slice(0,130)};}
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
if(process.argv[1] && import.meta.url===new URL(`file://${path.resolve(process.argv[1])}`).href){
  const report=await checkAll();
  mkdirSync('reports',{recursive:true});
  writeFileSync('reports/stream-health.json',JSON.stringify(report,null,2)+'\n');
  console.log('Wrote reports/stream-health.json. No catalogue files were changed.');
}
