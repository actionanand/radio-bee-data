import test from 'node:test';
test('temporary page HTML analysis',async ()=>{
 const pages=['https://liveradios.in/thr-raaga.html','https://liveradios.in/tamil-amuthu-bakthi-radio.html','https://onlineradiofm.in/stations/mirchi'];
 for(const url of pages){
 try{let response=await fetch(url,{signal:AbortSignal.timeout(15000)});let html=await response.text();const parts=[];
 const patterns=[/https?:\\?\/\\?\/[^\s'"<>]{8,180}/gi,/src\s*=\s*["'][^"']{4,200}["']/gi,/(?:iframe|player|embed|stream|radio-url|data-url|track|audio|sound|zeno|radioca)\S{0,90}/gi];
 for(let j=0;j<patterns.length;j++){let matches=[...html.matchAll(patterns[j])].map(m=>m[0]);parts.push({type:j,count:matches.length,first:matches.slice(0,j===0?100:65)});}
 console.log("PAGE_HTML_DETAILS "+JSON.stringify({url,status:response.status,htmlSize:html.length,title:html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1],details:parts}));
 }catch(e){console.log("PAGE_HTML_DETAILS "+JSON.stringify({url,error:String(e)}))}}
});