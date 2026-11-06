import https from 'node:https';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { Readable } from 'node:stream';
import { validHttps } from './validate.mjs';

export const LIMITS=Object.freeze({timeoutMs:10000,maxBytes:131072,maxRedirects:5,decoderTimeoutMs:5000,maxConcurrentRequests:1,maxHeaderBytes:8192});
export function boundedInteger(value,maximum,name,minimum=1) {
  if(!Number.isInteger(value) || value<minimum || value>maximum) throw new RangeError(`${name} must be an integer from ${minimum} to ${maximum}`);
  return value;
}

// Conservative public-unicast policy. Private/non-global addresses, IPv6
// transition and selected special-use blocks are excluded; some blocks contain
// globally routable exceptions that this tool intentionally also rejects.
// References: IANA IPv4/IPv6 Special-Purpose Address Registries (see report).
export function publicAddress(address) {
  if(isIP(address)===4) {
    const [a,b,c]=address.split('.').map(Number);
    return !(a===0 || a===10 || a===127 || a>=224 || (a===100 && b>=64 && b<=127)
      || (a===169 && b===254) || (a===172 && b>=16 && b<=31)
      || (a===192 && (b===168 || (b===0 && (c===0 || c===2)) || (b===88 && c===99)))
      || (a===198 && (b===18 || b===19 || (b===51 && c===100))) || (a===203 && b===0 && c===113));
  }
  if(isIP(address)!==6 || address.includes('.') || address.includes('%'))return false;
  const [first,second]=address.toLowerCase().split(':').map(x=>parseInt(x || '0',16));
  return first>=0x2000 && first<=0x3fff
    && !(first===0x2001 && (second<=0x1ff || second===0xdb8))
    && first!==0x2002 && !(first===0x3fff && second<=0x0fff);
}

// This lookup is used by the socket itself, not as a preflight followed by a
// second DNS lookup. Reject mixed public/private answers and hand only one
// approved address to the connector. Keep the URL hostname for SNI/cert checks.
export function publicLookup({resolver=lookup,signal}={}) {
  return (hostname,options,callback)=>{
    Promise.resolve().then(()=>resolver(hostname,{all:true,verbatim:true})).then(answers=>{
      signal?.throwIfAborted();
      if(!answers.length || answers.some(x=>!publicAddress(x.address)))throw new Error('DNS destination is not exclusively public unicast');
      const answer=answers[0];
      if(options?.all)callback(null,[answer]);else callback(null,answer.address,answer.family);
    }).catch(error=>callback(error));
  };
}

// The permit lasts until the socket closes, not merely until headers arrive.
// A shared gate also bounds callers using Promise.all. Queued waits are abortable.
let occupied=false;
const queue=[];
async function acquire(signal) {
  signal.throwIfAborted();
  if(occupied)await new Promise((resolve,reject)=>{
    const entry={resolve:()=>{signal.removeEventListener('abort',abort);resolve();}};
    const abort=()=>{const i=queue.indexOf(entry);if(i>=0)queue.splice(i,1);reject(signal.reason);};
    signal.addEventListener('abort',abort,{once:true});queue.push(entry);
  });
  occupied=true;
  let released=false;
  return ()=>{if(released)return;released=true;const next=queue.shift();if(next)next.resolve();else occupied=false;};
}

// No global fetch/automatic redirects, proxy env, connection reuse, cookies,
// decompression or disk writes. Native HTTPS pins the checked DNS destination.
export function createHttpsFetcher({request=https.request,resolver=lookup}={}) {
  return async (raw,{method='GET',headers={},signal,maxBytes=LIMITS.maxBytes}={})=>{
    if(!validHttps(raw))throw new Error('HTTPS URL not safe for checking');
    boundedInteger(maxBytes,LIMITS.maxBytes,'maxBytes',0);
    const deadline=AbortSignal.timeout(LIMITS.timeoutMs);
    const combined=signal ? AbortSignal.any([signal,deadline]) : deadline;
    const release=await acquire(combined);
    let started=false;
    try {
      combined.throwIfAborted();
      return await new Promise((resolve,reject)=>{
        const req=request(raw,{method,headers:{...headers,'Accept-Encoding':'identity'},agent:false,
          signal:combined,lookup:publicLookup({resolver,signal:combined}),autoSelectFamily:false,
          maxHeaderSize:LIMITS.maxHeaderBytes,highWaterMark:16384,rejectUnauthorized:true},res=>{
          const status=res.statusCode, responseHeaders=new Headers();
          res.on('error',()=>{}); // The body may be cancelled before its first read.
          for(const [key,value]of Object.entries(res.headers))if(value!==undefined)responseHeaders.set(key,Array.isArray(value)?value.join(', '):value);
          // Never read redirect/error/HEAD bodies; do not let one consume a sample.
          if(method==='HEAD' || status<200 || status>=300 || maxBytes===0) {
            res.destroy();resolve({status,ok:status>=200&&status<300,url:raw,headers:responseHeaders,body:null});return;
          }
          if(!['identity',''].includes(responseHeaders.get('content-encoding') || '')) {
            res.destroy();reject(new Error('compressed response rejected'));return;
          }
          // Read at most the body budget from the HTTP stream; immediately destroy
          // the socket at the cap. TCP/TLS and kernel receive buffers can read ahead;
          // this is an application-body limit, not a physical wire-byte promise.
          let consumed=0;
          async function* boundedBody() {
            try {
              for await(const chunk of res) {
                const part=chunk.subarray(0,maxBytes-consumed);consumed+=part.length;
                if(part.length)yield part;
                if(consumed>=maxBytes)break;
              }
            } finally {res.destroy();}
          }
          const nodeBody=Readable.from(boundedBody(),{objectMode:false,highWaterMark:1});
          nodeBody.once('close',()=>res.destroy());
          const body=Readable.toWeb(nodeBody,{strategy:{highWaterMark:0}});
          resolve({status,ok:true,url:raw,headers:responseHeaders,body});
        });
        started=true;
        req.once('error',reject);req.once('close',release);
        req.on('information',()=>req.destroy(new Error('unexpected informational response')));
        req.once('upgrade',(_res,socket)=>{
          const error=new Error('protocol upgrade rejected');socket.destroy();req.destroy(error);reject(error);
        });
        req.end();
      });
    } catch(error) {if(!started)release();throw error;}
  };
}
export const safeHttpsFetch=createHttpsFetcher();
