import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { publicAddress, publicLookup, createHttpsFetcher, LIMITS } from '../scripts/safe-https.mjs';
import { validHttps } from '../scripts/validate.mjs';
import { checkStream, fetchHttps } from '../scripts/check-streams.mjs';
import { probeStream, decodeSample } from '../scripts/probe-streams.mjs';

const publicDNS=async()=>[{address:'93.184.216.34',family:4}];
const resolveWith=answers=>new Promise((resolve,reject)=>publicLookup({resolver:async()=>answers})('radio.example.com',{},(error,address)=>error?reject(error):resolve(address)));

test('HTTPS syntax refuses local suffixes, trailing-dot aliases, literals and credentials',()=>{
  for(const host of ['localhost','player.localhost','player.localhost.','player.local.','player.internal.','player.home.arpa','intranet','127.1','2130706433','0x7f000001','[::1]','[::ffff:127.0.0.1]'])
    assert.equal(validHttps(`https://${host}/`),false,host);
  assert.equal(validHttps('https://user:pass@radio.example.com/'),false);
  assert.equal(validHttps('https://radio.example.com/\n'),false);
  assert.ok(validHttps('https://radio.example.com.:8086/stream'));
});

test('public DNS policy rejects private, link-local, metadata, special-use and transition addresses',()=>{
  for(const address of ['0.0.0.0','10.1.2.3','127.0.0.1','100.64.0.1','169.254.169.254','172.16.0.1','172.31.255.255','192.168.1.2','192.0.0.1','192.0.2.1','198.18.0.1','198.51.100.1','203.0.113.1','224.1.2.3','255.255.255.255','::','::1','::ffff:8.8.8.8','::ffff:0808:0808','64:ff9b::808:808','fc00::1','fe80::1','ff02::1','2001:db8::1','2001:20::1','2002:0808:0808::','3fff::1','2606:4700::1%eth0','not-an-ip'])
    assert.equal(publicAddress(address),false,address);
  for(const address of ['8.8.8.8','93.184.216.34','172.32.0.1','2001:4860:4860::8888','2606:4700:4700::1111'])
    assert.equal(publicAddress(address),true,address);
});

test('socket lookup fails closed for private-only, empty and mixed DNS answers',async()=>{
  for(const answers of [[],[{address:'10.0.0.1',family:4}],[...(await publicDNS()),{address:'::1',family:6}]])
    await assert.rejects(resolveWith(answers),/not exclusively public/);
  assert.equal(await resolveWith(await publicDNS()),'93.184.216.34');
});

test('socket lookup returns only the checked address, including all-address connector mode',async()=>{
  let lookups=0;
  const value=await new Promise((resolve,reject)=>publicLookup({resolver:async()=>{lookups++;return [...[{address:'93.184.216.34',family:4}],{address:'8.8.8.8',family:4}];}})
    ('radio.example.com',{all:true},(error,answers)=>error?reject(error):resolve(answers)));
  assert.deepEqual(value,[{address:'93.184.216.34',family:4}]);assert.equal(lookups,1);
});

test('unhandled 3xx statuses never count as reachability',async()=>{
  for(const status of [300,304,305,306,399]) {
    const result=await checkStream('https://radio.example.com/',{fetcher:async()=>new Response(null,{status})});
    assert.equal(result.outcome,'failed');assert.equal(result.status,status);
  }
  await assert.rejects(()=>fetchHttps('https://radio.example.com/',{},async()=>new Response(null,{status:302})),/without Location/);
});

test('redirects reject local suffixes and IP literals before another request',async()=>{
  for(const location of ['https://player.localhost/','https://player.localhost./','https://127.1/','https://[::1]/','https://name:password@radio.example.com/']) {
    let calls=0;
    await assert.rejects(()=>fetchHttps('https://radio.example.com/',{},async()=>{calls++;return new Response(null,{status:302,headers:{location}});}),/blocked URL/);
    assert.equal(calls,1);
  }
});

// Fake native transport: exercises the real public lookup hook and body/cancel
// lifecycle without contacting a network or writing any test media to disk.
function fixture({status=200,encoding,event,body=Buffer.alloc(128,42),stall=false,onStart=()=>{},onClose=()=>{}}={}) {
  const calls=[];
  const request=(url,options,respond)=>{
    const req=new EventEmitter();let res,closed=false;
    const close=()=>{if(closed)return;closed=true;onClose();queueMicrotask(()=>req.emit('close'));};
    req.destroy=error=>{res?.destroy(error);if(error)req.emit('error',error);close();};
    req.end=()=>queueMicrotask(()=>{
      onStart();calls.push({url,options});
      options.signal.addEventListener('abort',()=>req.destroy(options.signal.reason),{once:true});
      options.lookup(new URL(url).hostname,{all:true},(error,addresses)=>{
        if(closed)return;
        if(error){req.destroy(error);return;}
        if(event==='information'){req.emit('information',{});return;}
        if(event==='upgrade'){req.emit('upgrade',{}, {destroy(){}});return;}
        calls.at(-1).addresses=addresses;
        res=new PassThrough();res.statusCode=status;res.headers=encoding?{'content-encoding':encoding}:{};
        res.once('close',close);respond(res);
        if(!stall)res.end(body);
      });
    });
    return req;
  };
  return {request,calls};
}

test('native transport pins DNS, keeps TLS checks, caps body and closes ignored Range responses',async()=>{
  const f=fixture();const fetcher=createHttpsFetcher({request:f.request,resolver:publicDNS});
  const result=await probeStream('https://radio.example.com/',{fetcher,maxBytes:32,decoder:async()=>({outcome:'failed'})});
  assert.equal(result.sampledBytes,32);assert.equal(result.stop,'byte-limit');
  const {options,addresses}=f.calls[0];
  assert.deepEqual(addresses,await publicDNS());assert.equal(options.agent,false);assert.equal(options.rejectUnauthorized,true);
  assert.equal(options.maxHeaderSize,8192);assert.equal(options.headers['Accept-Encoding'],'identity');
  assert.equal(options.headers.Range,'bytes=0-31');
});

test('native transport blocks a private redirect destination at its socket lookup',async()=>{
  const f=fixture();let responses=0;
  const fetcher=createHttpsFetcher({request:(url,opts,respond)=>f.request(url,opts,res=>{
    responses++;res.statusCode=302;res.headers.location='https://private.example.com/';respond(res);
  }),resolver:async host=>host.startsWith('private.')?[{address:'169.254.169.254',family:4}]:publicDNS()});
  await assert.rejects(()=>fetchHttps('https://radio.example.com/',{},fetcher),/not exclusively public/);
  assert.equal(responses,1); // No HTTP response/socket to the private destination.
});

test('native transport rejects compressed bodies and limits concurrent requests through socket close',async()=>{
  let active=0,peak=0;
  const f=fixture({encoding:'gzip',onStart(){active++;peak=Math.max(peak,active);},onClose(){active--;}});
  const fetcher=createHttpsFetcher({request:f.request,resolver:publicDNS});
  const results=await Promise.allSettled(Array.from({length:3},()=>fetcher('https://radio.example.com/')));
  assert.ok(results.every(r=>r.status==='rejected' && /compressed/.test(r.reason.message)));
  await new Promise(setImmediate); // Rejection precedes the final socket close event.
  assert.equal(peak,1);assert.equal(active,0);
});

test('native body cancellation before first read releases the request slot',async()=>{
  const f=fixture({stall:true});const fetcher=createHttpsFetcher({request:f.request,resolver:publicDNS});
  const first=await fetcher('https://radio.example.com/');await first.body.cancel();
  const second=await fetcher('https://radio.example.com/');await second.body.cancel();
  assert.equal(f.calls.length,2);
});

test('DNS wait, request queue and slow body share the probe deadline',async()=>{
  const f=fixture({stall:true});const fetcher=createHttpsFetcher({request:f.request,resolver:publicDNS});
  const first=probeStream('https://radio.example.com/',{fetcher,timeoutMs:40});
  const second=probeStream('https://radio.example.com/',{fetcher,timeoutMs:10});
  const values=await Promise.all([first,second]);
  assert.ok(values.every(r=>r.stop==='timeout'));assert.equal(f.calls.length,1);
  const pending=createHttpsFetcher({request:f.request,resolver:()=>new Promise(resolve=>setTimeout(()=>resolve([{address:'10.0.0.1',family:4}]),25))});
  const result=await probeStream('https://radio.example.com/',{fetcher:pending,timeoutMs:10});
  assert.equal(result.stop,'timeout');
});

test('invalid budgets cannot remove hard limits',async()=>{
  for(const timeoutMs of [0,-1,Infinity,NaN,LIMITS.timeoutMs+1])await assert.rejects(()=>probeStream('https://radio.example.com/',{timeoutMs}),RangeError);
  for(const maxBytes of [0,-1,Infinity,NaN,LIMITS.maxBytes+1])await assert.rejects(()=>probeStream('https://radio.example.com/',{maxBytes}),RangeError);
  await assert.rejects(()=>fetchHttps('https://radio.example.com/',{},undefined,6),RangeError);
  assert.throws(()=>decodeSample(Buffer.alloc(1),{timeoutMs:Infinity}),RangeError);
  assert.throws(()=>decodeSample(Buffer.alloc(LIMITS.maxBytes+1)),RangeError);
});

test('informational responses and protocol upgrades close without a hanging promise',async()=>{
  for(const event of ['information','upgrade']) {
    const f=fixture({event});const fetcher=createHttpsFetcher({request:f.request,resolver:publicDNS});
    await assert.rejects(()=>fetcher('https://radio.example.com/'),/informational|upgrade/);
  }
});

test('HEAD fallback shares the same overall deadline and one-byte GET budget',async()=>{
  const signals=[];
  const result=await checkStream('https://radio.example.com/',{timeoutMs:20,fetcher:async(_url,options)=>{
    signals.push(options.signal);
    if(options.method==='HEAD')return new Response(null,{status:405});
    assert.equal(options.maxBytes,1);
    return new Promise((_resolve,reject)=>options.signal.addEventListener('abort',()=>reject(options.signal.reason),{once:true}));
  }});
  assert.equal(result.reason,'timeout');assert.equal(signals.length,2);assert.equal(signals[0],signals[1]);
});
