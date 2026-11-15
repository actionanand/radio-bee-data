// Manual/CI audit only: public image URLs must return image bytes.
// No artwork is copied into the repository and the normal local validation
// does not depend on external web availability.
import {readFileSync} from 'node:fs';
import {request} from 'node:https';
const networks=JSON.parse(readFileSync(new URL('../data/v2/networks.json',import.meta.url)));
const stations=JSON.parse(readFileSync(new URL('../data/v2/stations.json',import.meta.url)));
const withArtwork=[
  ...networks.filter(n=>n.logoUrl).map(n=>({...n,category:'network'})),
  ...stations.filter(s=>s.logoUrl).map(s=>({...s,category:'station'})),
];
async function probe(url,redirects=0) {
  return new Promise(resolve=>{
    const req=request(url,{
      method:'GET',
      headers:{'User-Agent':'Mozilla/5.0 (compatible; RadioBeeArtworkAudit/1.0)','Range':'bytes=0-1023','Accept':'image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8'},
      timeout:9000,
    },res=>{
      if([301,302,303,307,308].includes(res.statusCode)&&res.headers.location&&redirects<4){
        res.resume();
        probe(new URL(res.headers.location,url).href,redirects+1).then(resolve);
        return;
      }
      const type=(res.headers['content-type']||'').split(';')[0].toLowerCase();
      let bytes=0;
      res.on('data',data=>{bytes+=data.length;if(bytes>1024)res.destroy();});
      res.on('close',()=>resolve({status:res.statusCode,type,bytes}));
      res.on('end',()=>resolve({status:res.statusCode,type,bytes}));
      res.on('error',err=>resolve({error:err.message,status:res.statusCode,type,bytes}));
    });
    req.on('timeout',()=>req.destroy(new Error('timeout')));
    req.on('error',err=>resolve({error:err.message}));
    req.end();
  });
}
const results=[];
for(const n of withArtwork) {
  const result=await probe(n.logoUrl);
  const ok=[200,206].includes(result.status)&&/^image\/(?:png|jpeg|webp|avif)$/.test(result.type)&&result.bytes>0;
  results.push({type:n.category,id:n.id,ok,...result});
  console.log(`${ok?'OK':'FAIL'} ${n.category}/${n.id} ${JSON.stringify(result)} ${n.logoUrl}`);
}
console.log(`Image audit: ${results.filter(r=>r.ok).length}/${results.length} accessible from GitHub Actions`);
// Station-specific remote photos may be blocked by hotlink protections or
// Wikimedia rate limits. Each has an independently validated data-hosted SVG
// fallback. Publisher network images remain a strict release gate.
const brokenNetworks=results.filter(r=>!r.ok&&r.type==='network');
const brokenStations=results.filter(r=>!r.ok&&r.type==='station');
console.log('Station photo audit warnings:',brokenStations.length,'(data-hosted fallback available)');
if(brokenNetworks.length)process.exitCode=1;

