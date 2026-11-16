import test from 'node:test';
test('temporary inspect deferred player bundle',async()=>{
 for(const url of ['https://liveradios.in/thr-raaga.html','https://liveradios.in/tamil-amuthu-bakthi-radio.html','https://liveradios.in/goldy-garba.html','https://liveradios.in/radio-gilli.html']){
  try{const h=await (await fetch(url,{signal:AbortSignal.timeout(15000)})).text();const jurl=[...h.matchAll(/<script[^>]+src="(https:\/\/liveradios\.in\/wp-content\/cache\/autoptimize\/js\/[^"]+)"/g)].at(-1)?.[1];
   if(!jurl){console.log('JS_AUDIT '+JSON.stringify({url,error:'no autoptimize script'}));continue}
   const r=await fetch(jurl,{signal:AbortSignal.timeout(20000)});const js=await r.text();
   const hits=[...js.matchAll(/(?:radio-playerjs|new Playerjs|\.zeno\.fm|\.m3u8|\.mp3|radioca\.st|\.aac|file\s*:)/gi)];
   console.log('JS_AUDIT '+JSON.stringify({url,jsUrl:jurl,status:r.status,jsLength:js.length,hits:hits.slice(0,22).map(x=>js.slice(Math.max(0,x.index-140),x.index+300))}));
  }catch(e){console.log('JS_AUDIT '+JSON.stringify({url,error:String(e)}))}
 }
});