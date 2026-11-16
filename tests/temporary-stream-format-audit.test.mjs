import test from 'node:test';
import {readFileSync} from 'node:fs';
const records=JSON.parse(readFileSync(new URL('../data/v2/stations.json',import.meta.url)));
const rows=records.flatMap(s=>s.streams.filter(t=>t.format==='unknown').map(t=>({id:s.id,name:s.name,url:t.url})));
const pages=['https://onlineradiofm.in/stations/mirchi','https://onlineradiofm.in/stations/red'];
function classify(bytes,ct){
 const hex=Buffer.from(bytes).subarray(0,24).toString('hex');
 const head=Buffer.from(bytes).subarray(0,100).toString('utf8').trim();
 if(head.startsWith('#EXTM3U')||/mpegurl|m3u8/.test(ct))return ['hls',hex];
 if(hex.startsWith('494433')||(/^ff[ef][0-9a-f]/.test(hex)&&!/^fff[19]/.test(hex))||/audio\/mpeg|audio\/mp3/.test(ct))return ['mp3',hex];
 if(/^fff[19]/.test(hex)||/audio\/aac|audio\/aacp/.test(ct))return ['aac',hex];
 if(/audio\//.test(ct))return ['audio-unclassified',hex];
 return ['unknown',hex];
}
async function check(row){
 const ctrl=new AbortController(), timer=setTimeout(()=>ctrl.abort(),8500);
 try{
  const res=await fetch(row.url,{signal:ctrl.signal,headers:{'User-Agent':'Mozilla/5.0 (RadioBee-audit)','Accept':'audio/*,application/vnd.apple.mpegurl,*/*','Range':'bytes=0-32767'}});
  const ct=(res.headers.get('content-type')??'').toLowerCase();
  let bytes=new Uint8Array();if(res.body){const reader=res.body.getReader();const x=await reader.read();bytes=x.value??bytes;void reader.cancel();}
  const [format,hex]=classify(bytes,ct);
  return {id:row.id,name:row.name,status:res.status,ct,format,hex,final:new URL(res.url).hostname,error:''};
 }catch(e){return {id:row.id,name:row.name,error:String(e).slice(0,85),format:'unknown'}}
 finally{clearTimeout(timer);ctrl.abort()}
}
test('temporary stream format and new Mirchi RED page audit',async()=>{
 await Promise.all(pages.map(async url=>{
   try{const res=await fetch(url,{signal:AbortSignal.timeout(12000)}),html=await res.text(),m=html.match(/var\s+FILE\s*=\s*["']([^"']+)["']/i);console.log('MIRCHI_RED_PAGE '+JSON.stringify({url,status:res.status,stream:m?.[1]??null,title:html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]??null}));}
   catch(e){console.log('MIRCHI_RED_PAGE '+JSON.stringify({url,error:String(e)}))}
 }));
 let i=0,results=Array(rows.length);
 await Promise.all(Array.from({length:12},async()=>{while(i<rows.length){const n=i++;results[n]=await check(rows[n]);}}));
 for(const x of results)console.log('STREAM_FORMAT_AUDIT '+JSON.stringify(x));
 console.log('FORMAT_AUDIT_SUMMARY '+JSON.stringify({total:results.length,counts:results.reduce((a,x)=>(a[x.format]=(a[x.format]||0)+1,a),{})}));
});
