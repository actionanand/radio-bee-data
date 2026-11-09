// Manual-only research. No import or health result changes editorial approval.
import {readFileSync,writeFileSync,renameSync,existsSync,mkdirSync,lstatSync,rmSync} from 'node:fs';
import {createHash,randomUUID} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validHttps} from './validate.mjs';
import {safeHttpsFetch} from './safe-https.mjs';
import {fetchHttps} from './check-streams.mjs';
import {auditEndpoint} from './audit-streams.mjs';
export const normalizedName=value=>String(value??'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu,' ').trim();
export function deduplicateCandidates(rows){
 const identities=new Map(),urls=new Map(),ids=new Map(),accepted=[],duplicates=[];
 for(const row of rows){
  const key=normalizedName(row.publisherId)+'|'+normalizedName(row.programme??row.name);
  if(!row.id||!normalizedName(row.name)||!normalizedName(row.publisherId))throw Error('Candidate requires stable id, publisher and programme identity');
  if(row.url&&(!validHttps(row.url)||new URL(row.url).hash||[...new URL(row.url).searchParams].some(([k,v])=>!['mp','type','mount'].includes(k)&&!(k==='nocache'&&v==='')&&!(k==='dist'&&/^[a-z0-9-]{1,40}$/.test(v)))))throw Error('Unsafe or session-dependent candidate URL: '+row.id);
  if(ids.has(row.id)&&ids.get(row.id)!==key)throw Error('Conflicting candidate ID: '+row.id);
  ids.set(row.id,key);
  const url=row.url?new URL(row.url).href:null;
  const existing=identities.get(key)??(url?urls.get(url):null);
  if(existing){duplicates.push({id:row.id,duplicateOf:existing.id,reason:identities.has(key)?'same publisher/programme':'shared endpoint; identity review required'});continue;}
  identities.set(key,row);if(url)urls.set(url,row);accepted.push({...row,url});
 }return {candidates:accepted,duplicates};
}
export function spreadsheetCell(value){const s=String(value??'');return /^[\s\ufeff\x00-\x1f]*[=+@-]/u.test(s)||/^[\t\r\n]/u.test(s)?"'"+s:s;}
export function researchCsv(rows){const fields=['id','name','countryCode','publisherId','url','status','sourceUrl'];return [fields,...rows.map(r=>fields.map(f=>spreadsheetCell(r[f])))].map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n')+'\n';}
export async function inspectPage(url,{fetcher=safeHttpsFetch,headers={}}={}){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);let response,reader;
 try{const result=await fetchHttps(url,{method:'GET',maxBytes:131072,signal:controller.signal,headers:{...headers,'Accept-Encoding':'identity'}},fetcher);response=result.response;
  reader=response.body?.getReader();const chunks=[];let count=0;while(reader&&count<131072){const r=await reader.read();if(r.done)break;const b=r.value.subarray(0,131072-count);chunks.push(Buffer.from(b));count+=b.length;}
  return {url,checkedAt:new Date().toISOString(),httpStatus:response.status,mime:response.headers.get('content-type'),redirects:result.redirects,truncated:count===131072,bytes:count,text:Buffer.concat(chunks).toString('utf8').replaceAll('\\/','/')};
 }finally{clearTimeout(timer);controller.abort();await reader?.cancel().catch(()=>{});if(!reader)await response?.body?.cancel().catch(()=>{});}
}
export async function auditCandidates(rows,{previous=[],probe=auditEndpoint,checkpoint=()=>{},delayMs=350,pause=ms=>new Promise(resolve=>setTimeout(resolve,ms))}={}){
 if(!Number.isInteger(delayMs)||delayMs<0||delayMs>10000)throw Error('Invalid rate delay');
 const {candidates,duplicates}=deduplicateCandidates(rows),results=[...previous];
 for(const row of candidates){if(!row.url||results.some(r=>r.id===row.id&&r.requestUrl===row.url))continue;
  const result=await probe({id:row.id,url:row.url},{mode:'deep'});results.push({...result,editorialApproval:'not-granted'});await checkpoint({results,duplicates});await pause(delayMs);
 }return {results,duplicates};
}
function atomicJson(file,value){
 const json=JSON.stringify(value,null,2)+'\n';
 mkdirSync(path.dirname(file),{recursive:true});const temp=file+'.'+randomUUID()+'.tmp';
 try{writeFileSync(temp,json,{flag:'wx'});renameSync(temp,file);}finally{rmSync(temp,{force:true});}
}
export function reportPath(raw,root=process.cwd()){
 const target=path.resolve(root,raw),reports=path.resolve(root,'reports');
 if(path.extname(target)!=='.json'||!target.startsWith(reports+path.sep))throw Error('Research output must be a JSON file inside reports/');
 let current=target;while(current!==root&&current!==path.dirname(current)){if(existsSync(current)&&lstatSync(current).isSymbolicLink())throw Error('Research output cannot use symlinks');current=path.dirname(current);}
 return target;
}
export function resumeState(rows,prior){
 const fingerprint=createHash('sha256').update(JSON.stringify(rows)).digest('hex');
 if(prior&&(prior.kind!=='radiobee-stage14-research-v1'||prior.inputFingerprint!==fingerprint||!Array.isArray(prior.results)))throw Error('Existing output is not a matching research checkpoint');
 return {kind:'radiobee-stage14-research-v1',inputFingerprint:fingerprint,previous:prior?.results??[]};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.platform!=='linux')throw Error('Use WSL2 Linux Node');
 const [input,output,...flags]=process.argv.slice(2);if(!input||!output||flags.some(f=>f!=='--resume'))throw Error('Usage: node scripts/research-tamil-expansion.mjs INPUT.json OUTPUT.json [--resume]');
 if(path.resolve(input)===path.resolve(output))throw Error('Input and output must differ');
 if(existsSync(output)&&!flags.includes('--resume'))throw Error('Output exists; use an explicit resume or another filename');
 const target=reportPath(output),rows=JSON.parse(readFileSync(input)),prior=existsSync(target)?JSON.parse(readFileSync(target)):null;
 const {previous,...metadata}=resumeState(rows,prior);
 const result=await auditCandidates(rows,{previous,checkpoint:r=>atomicJson(target,{...metadata,...r})});atomicJson(target,{...metadata,...result});
}
