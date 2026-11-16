import test from 'node:test';
const candidates=[
 ['radio-mirchi-98-3','https://stream.zeno.fm/wgaznsmt92quv'],
 ['red-fm-93-5','https://stream.zeno.fm/9phrkb1e3v8uv'],
 ['mugugan-songs','https://stream.zeno.fm/6seaxxbyxmrvv'],
 ['raja-fm-lk','https://stream.zeno.fm/ute2b5hbrfvtv'],
 ['tamil-a1','https://stream.zeno.fm/dsvagw8dc8zuv'],
 ['tamil-amudhu','https://stream.zeno.fm/19arez84vwzuv'],
 ['erode-city','https://stream.zeno.fm/9fp1383f0d0uv'],
 ['vellur','https://stream.zeno.fm/z394fckpzwzu'],
 ['just-odisha-alt','https://stream.zeno.fm/06k46a9mk98uv'],
 ['radio-talky-alt','https://stream.zeno.fm/wyqezxthwlfvv'],
 ['muthamil-alt','https://radio.massstream.net:7003/;Muthamil.mp3'],
 ['sun-tamil','https://usa2.fastcast4u.com/proxy/tamilsun?mp=/;'],
 ['sahara-alt','https://azuracast.vibesounds.in:8000/radio.mp3'],
 ['radio-sri-lanka-raw','http://220.247.227.20:8000/RSLstream'],
 ['yo-punjabi-alt','http://playerservices.streamtheworld.com/api/livestream-redirect/YPB_PUJ_PSTaac.aac'],
 ['hot-now-alt','https://s8.voscast.com:7021/stream'],
 ['radio-benziger-alt','https://radio.radiobenziger.com/stream?type=http&nocache=1169'],
 ['radio-kerala-2','https://streaming.radiokerala.in/listen/radio_kerala/radio.mp3']
];
function classify(ct,h){const a=h.toLowerCase();if(/mpegurl/.test(ct)||a.startsWith('234558544d3355'))return 'hls';if(/audio\/mpeg|audio\/mp3/.test(ct)||a.startsWith('494433')||a.startsWith('fffb'))return 'mp3';if(/audio\/aac/.test(ct)||a.startsWith('fff1')||a.startsWith('fff9'))return 'aac';return 'unknown'}
async function probe([id,url]){const ctrl=new AbortController(),tid=setTimeout(()=>ctrl.abort(),12500);try{let res=await fetch(url,{signal:ctrl.signal,headers:{'Accept':'audio/*,application/vnd.apple.mpegurl,*/*','User-Agent':'Mozilla/5.0','Range':'bytes=0-8192'}});let bytes=new Uint8Array();if(res.body){let reader=res.body.getReader();let chunk=await reader.read();bytes=chunk.value??bytes;await reader.cancel().catch(()=>{})}let ct=res.headers.get('content-type')||'';return {id,url,status:res.status,ct,format:res.ok?classify(ct,Buffer.from(bytes).subarray(0,12).toString('hex')):'unknown',final:res.url.slice(0,170)}}catch(e){return {id,url,error:String(e)}}finally{clearTimeout(tid);ctrl.abort()}}
test('temporary target and alternative URL probes',async()=>{const results=await Promise.all(candidates.map(probe));for(let r of results)console.log('TARGET_RECHECK '+JSON.stringify(r))});
