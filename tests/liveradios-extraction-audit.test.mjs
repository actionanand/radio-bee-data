import test from 'node:test';

test('temporary stream page-inspection audit; not intended for publication', async () => {
  const pages = [
    'https://liveradios.in/thr-raaga.html',
    'https://liveradios.in/radio-gilli.html',
    'https://liveradios.in/tamil-amuthu-bakthi-radio.html',
    'https://liveradios.in/goldy-garba.html',
    'https://onlineradiofm.in/stations/mirchi',
    'https://liveradios.in/radio-kasoot.html'
  ];
  const results = await Promise.all(pages.map(async url => {
    try {
      const r = await fetch(url,{signal:AbortSignal.timeout(15000),headers:{'User-Agent':'Mozilla/5.0 (compatible; RadioBee-Research/1.0)','Accept':'text/html,application/xhtml+xml'}});
      const raw = await r.text();
      const html=raw.replaceAll('\\/','/').replaceAll('&amp;','&');
      const match=(pattern)=>[...html.matchAll(pattern)].slice(0,20).map(m=>html.slice(Math.max(0,m.index-90),Math.min(html.length,m.index+180)).replace(/\s+/g,' '));
      return {url,status:r.status,redirect:r.url,size:raw.length,preview:html.slice(0,120).replace(/\s+/g,' '),
       zeno:match(/(?:zeno\.fm|zenolive\.com|radioca\.st|icecast|\.m3u8|\.mp3|data-stream|streamUrl|audio_url|file\s*:)/gi),
       players:match(/(?:<audio\b|<source\b|<iframe\b|jPlayer|player-container|stream-url|radio_player)/gi)};
    } catch(e){return {url,error:String(e).slice(0,250)}}
  }));
  for(const row of results)console.log('STREAM_AUDIT_JSON '+JSON.stringify(row));
});
