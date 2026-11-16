import test from 'node:test';
test('temporary player snippet investigation',async()=>{
 for(const url of ['https://liveradios.in/thr-raaga.html','https://liveradios.in/tamil-amuthu-bakthi-radio.html']){
  const r=await fetch(url,{signal:AbortSignal.timeout(15000)});const html=await r.text();
  const i=html.indexOf('playerjs'); const x=html.indexOf('player-sec-right'); const j=html.lastIndexOf('</body>');
  console.log('PLAYER_SNIPPET '+JSON.stringify({url,size:html.length,aroundPlayer:html.slice(Math.max(0,i-650),i+2000),aroundRight:html.slice(Math.max(0,x-400),x+1500),lastHtml:html.slice(j-4800,j+15)}));
 }
});