import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import path from 'node:path';import {fileURLToPath} from 'node:url';
import {readCatalogue,validateCatalogue} from './validate.mjs';
import {directListeningReady} from './listening-policy.mjs';
export const categories=['in-app-playback-ready','browser-audible-awaiting-use-review','reachable-not-decoded','incorrect-station-identity','unavailable-down','no-known-stream','restricted-source'];
export function classifyStation(station,observations,{historicalAudible=false,incorrectLead=false}={}) {
  if(station.streams.some(directListeningReady))return categories[0];
  if(station.streams.length&&station.streams.every(x=>x.directListening?.status==='restricted'))return categories[6];
  if(historicalAudible)return categories[1];
  if(observations.some(r=>['http-reachable','playlist-parsed','segments-retrieved','decoded-sample'].includes(r.status)))return categories[2];
  if(incorrectLead)return categories[3];
  if(observations.some(r=>['down','blocked'].includes(r.status)))return categories[4];
  return categories[5];
}
// Public evidence must never reproduce expiring/authenticated directory URLs.
export function publicEvidence(value) {
  if(Array.isArray(value))return value.map(publicEvidence);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,publicEvidence(v)]));
  if(typeof value==='string'&&/^https?:\/\//.test(value)) {
    try{const u=new URL(value);if(u.username||u.password||[...u.searchParams.keys()].some(k=>!['mp','name','limit','hidebroken','countrycode'].includes(k)))return '[withheld: query-bearing or authenticated URL]';}catch{return '[invalid URL]';}
  }
  return value;
}
export function makeInventory(data,{audit,extra=[],sites=[],directory=[],channels=[],browser=[]}) {
  const errors=validateCatalogue(data);if(errors.length)throw Error(errors.join('\n'));
  const observations=[...audit.results,...extra];const loc=new Map(data.locations.map(l=>[l.id,l]));
  const inventory=data.stations.map(s=>{
    const network=data.networks.find(n=>n.id===s.networkId);
    const checks=observations.filter(r=>r.stationId===s.id).map(r=>({...r,region:loc.get(s.districtId)?.name??loc.get(s.regionId)?.name??s.countryCode}));
    const termUrl=s.networkId==='akashvani'?'https://prasarbharati.gov.in/en/terms-conditions/':s.networkId==='suryan-in'?'https://www.suryanfm.in/terms-of-use/':s.networkId==='asr-digital'?'https://radio.asrdmm.com/p/terms-conditions.html':network.website;
    const leads=[];
    for(const q of directory)for(const c of q.stations??[]) {
      if(c.countrycode!==s.countryCode)continue;
      const city=loc.get(s.localityId)?.name.toLowerCase();
      if(city&&c.name.toLowerCase().includes(city))leads.push({name:c.name,uuid:c.stationuuid,url:c.url_resolved||c.url,homepage:c.homepage,status:'directory-name/location lead only; not independent identity proof'});
    }
    const rejected=s.id==='mirchi-bengaluru'?[{reason:'Radio Browser name radiomirchibengaluru points to RADIO_SUNO_MELODY_S06.mp3; conflicting mount branding; Mirchi association unproven, reject pending independent identity evidence',source:'https://de1.api.radio-browser.info/json/stations/search?name=Mirchi'}]:[];
    const historical=s.id==='sooriyan-srilanka'?{kind:'historical-user-reported-audible',observedOn:'2026-11-06',exactTime:null,notes:'Stage 4 handoff reports user heard Sooriyan in RadioBee for approximately 20 seconds. Not independently repeated in Stage 6.'}:null;
    const mapping=channels.filter(c=>s.streams.some(x=>x.url===c.url));
    const category=classifyStation(s,checks,{historicalAudible:!!historical,incorrectLead:false});
    return {stationId:s.id,station:s.name,networkId:network.id,broadcaster:network.name,country:s.countryCode,geography:{region:loc.get(s.regionId)?.name??null,district:loc.get(s.districtId)?.name??null,locality:loc.get(s.localityId)?.name??null,confidence:s.listingStatus==='candidate'?'candidate geography; not independently confirmed':'documentary listing; not proof of stream origin'},languages:s.broadcastLanguages.map(code=>({code,name:data.languages.find(l=>l.code===code)?.name})),genres:s.genres,frequencyMHz:s.frequencyMHz,website:s.website,websiteScope:'Broadcaster or named service website; network homepage does not establish a local transmitter',listingStatus:s.listingStatus,sourceIds:s.sourceIds,existingAndAddedCandidates:s.streams,officialChannelMappings:mapping,additionalLeads:leads.slice(0,8),rejectedLeads:rejected,observations:checks,historicalBrowserAudibility:historical,currentBrowserPlayback:browser.find(b=>b.stationId===s.id)??'not-tested',currentAudiblePlayback:'not-tested',identityConfidence:mapping.length?'official exact named-channel mapping; audible identity untested':s.streams.some(x=>/official|player/.test(x.sourceId))?'official published endpoint association; audible identity untested':s.listingStatus==='candidate'?'unconfirmed listing/lead association':'documentary listing; endpoint identity needs independent check',termsReview:{url:termUrl,status:'needs-review',decision:'No explicit RadioBee direct-listening allowance established. Website material/redistribution restrictions are not automatically interpreted as a universal ban on unmodified end-user listening; resolve stream-specific terms before enabling.',recording:'unconfirmed',redistribution:'unconfirmed'},directInAppListening:category===categories[0],category,blockers:[...(s.streams.length?[]:['No independently supported direct HTTPS endpoint in catalogue']),...(checks.some(r=>r.status==='decoded-sample')?[]:['No current decoder-confirmed audio']), 'No current browser-audible verification','Direct in-app use conditions await review',...(s.listingStatus==='candidate'?['Listing identity/location/language require editorial confirmation']:[])],research:{officialSite:sites.find(r=>r.networkId===s.networkId)??null,directoryQueries:directory.filter(q=>q.query.toLowerCase().includes(network.name.split(' ')[0].toLowerCase())).map(q=>q.query),notes:'All catalogue rows reviewed against network research and prior Stage 4 evidence; exhaustive global discovery or confirmed absence is not claimed.'},notes:s.notes};
  });
  const counts=Object.fromEntries(categories.map(c=>[c,inventory.filter(r=>r.category===c).length]));
  if(inventory.length!==88||new Set(inventory.map(r=>r.stationId)).size!==88||Object.values(counts).reduce((a,b)=>a+b,0)!==88)throw Error('Stage 6 inventory must account for exactly 88 unique stations');
  return publicEvidence({generatedAt:new Date().toISOString(),catalogVersion:data.index.catalogVersion,categoryRules:'Mutually exclusive in listed priority order; browser-audible category includes explicitly dated historical user evidence. Restricted requires express direct-listening restriction; unclear terms do not imply a ban. Wrong identity concerns rejected lead, not station existence.',counts,stations:inventory});
}
export function writeInventory(report,dir='docs/stage6') {
  mkdirSync(dir,{recursive:true});writeFileSync(path.join(dir,'stations.json'),JSON.stringify(report,null,2)+'\n');
  const fields=['stationId','station','networkId','broadcaster','country','geography','languages','genres','frequencyMHz','website','category','identityConfidence','directInAppListening','currentBrowserPlayback','termsReview','blockers','existingAndAddedCandidates','additionalLeads','observations'];
  const cell=x=>{let v=typeof x==='object'?JSON.stringify(x):String(x??'');if(/^[=+@\-\t\r]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"';};
  writeFileSync(path.join(dir,'stations.csv'),[fields.map(cell).join(','),...report.stations.map(r=>fields.map(f=>cell(r[f])).join(','))].join('\n')+'\n');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const load=(p,fallback)=>existsSync(p)?JSON.parse(readFileSync(p)):fallback;
  const report=makeInventory(readCatalogue(),{audit:load('reports/stage6-deep-audit.json',{results:[]}),extra:load('reports/stage6-extra-audit.json',[]),sites:load('reports/stage6-official-sites.json',[]),directory:load('reports/stage6-radio-browser.json',[]),channels:load('reports/stage6-air-channels.json',[]),browser:load('reports/stage6-browser.json',[])});
  writeInventory(report);console.log(report.counts);
}
