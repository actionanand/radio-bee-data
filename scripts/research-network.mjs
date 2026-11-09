import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {safeHttpsFetch} from './safe-https.mjs';
import {fetchHttps} from './check-streams.mjs';
import {auditEndpoint} from './audit-streams.mjs';
// Exported dependencies permit offline tests; production always uses safeHttpsFetch.
export async function request(mode,url,{fetcher=safeHttpsFetch,audit=auditEndpoint}={}) {
 if(mode==='decode') {
  // auditEndpoint fetches bounded manifests/segments through safeHttpsFetch.
  // Only memory bytes reach decodeSample's pipe-only FFmpeg, never URLs/playlists.
  const row=await audit({url},{mode:'deep',fetcher});
  const seconds=(row.decoding?.pcmBytes??0)/16000;
  let status=row.sampleDecodeResult??'not-tested';
  if(status==='decoded')status=row.decoding?.exitCode!=null&&row.decoding.exitCode!==0?'partial-error':seconds<2?'short-audio':'decoded';
  return {status,seconds,
   note:row.failureReason??row.decoding?.limitation??row.qualityObservations?.join('; ')??'Not decoded'};
 }
 if(!['api','probe'].includes(mode))throw Error('Unsupported research operation');
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
 let reader,response;
 try {
  const cap=mode==='probe'?2048:131072;
  ({response}=await fetchHttps(url,{method:'GET',signal:controller.signal,maxBytes:cap,
   headers:{'User-Agent':'RadioBeeResearch/2.0','Accept-Encoding':'identity'}},fetcher));
  if(!response.ok)throw Error(`HTTP ${response.status}`);
  reader=response.body?.getReader();const chunks=[];let size=0;
  while(reader&&size<cap){const {done,value}=await reader.read();if(done)break;const bytes=value.subarray(0,cap-size);chunks.push(Buffer.from(bytes));size+=bytes.length;}
  if(mode==='api'&&size>=cap)throw Error('Directory page reaches byte ceiling; request a smaller page');
  const bytes=Buffer.concat(chunks);
  return mode==='api'?JSON.parse(bytes.toString('utf8')):{contentType:response.headers.get('content-type')??'',bytes:bytes.toString('base64')};
 }finally{clearTimeout(timer);controller.abort();await reader?.cancel().catch(()=>{});if(!reader)await response?.body?.cancel().catch(()=>{});}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.platform!=='linux')throw Error('Use WSL2 Linux Node');
 try{process.stdout.write(JSON.stringify(await request(process.argv[2],process.argv[3])));}
 catch(error){process.stderr.write(String(error.message));process.exitCode=1;}
}
