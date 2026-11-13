import {allStations,locationChain,buildBrowseIndex} from './catalogue-navigation.mjs';
const text=v=>typeof v==='string'&&!!v.trim();
const id=v=>text(v)&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
const date=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
const shape=(o,required,optional=[])=>o&&typeof o==='object'&&!Array.isArray(o)&&required.every(k=>Object.hasOwn(o,k))&&Object.keys(o).every(k=>[...required,...optional].includes(k));
const list=(v,known,{nonempty=false}={})=>Array.isArray(v)&&(!nonempty||v.length>0)&&new Set(v).size===v.length&&v.every(x=>known.has(x));

export function stationGeographyErrors(station,locations) {
 const errors=[],map=new Map(locations.map(l=>[l.id,l]));
 for(const [key,type]of [['regionId','state'],['districtId','district'],['localityId','locality']]) if(station[key]!==null && (!map.has(station[key])||map.get(station[key]).type!==type||map.get(station[key]).countryCode!==station.countryCode)) errors.push('bad '+key);
 try {
   const chain=locationChain(station,locations);
   for(const [key,type]of [['regionId','state'],['districtId','district'],['localityId','locality']]) {
     const ancestor=chain.find(l=>l.type===type);
     if(ancestor && station[key]!==ancestor.id) errors.push(type==='locality'?'locality/district mismatch':'missing or conflicting '+key+' ancestor');
   }
 } catch(e){errors.push('locality/district mismatch or invalid geographic hierarchy: '+e.message);}
 return errors;
}

export function metadataErrors(data,validHttps) {
 const errors=[],sources=new Set((data.sources??[]).map(s=>s.id)),sourceMap=new Map((data.sources??[]).map(s=>[s.id,s])),languages=new Set((data.languages??[]).map(l=>l.code));
 const broadcasters=data.broadcasters===undefined?[]:data.broadcasters,themes=data.programmeThemes===undefined?[]:data.programmeThemes,artists=data.artists===undefined?[]:data.artists;
 for(const [field,file]of [['broadcasters','broadcasters.json'],['programmeThemes','programme-themes.json'],['browseIndex','browse-index.json'],['artists','artists.json']]) {
   if(data.index?.files?.[field]!==undefined && (data.index.files[field]!==file || data[field]===undefined)) errors.push('Invalid '+field+' manifest reference');
   if(data[field]!==undefined && data.index?.files?.[field]!==file) errors.push(field+' requires manifest reference');
 }
 const broadIds=new Set(),themeIds=new Set(),artistIds=new Set();
 if(!Array.isArray(artists))errors.push('artists must be an array');
 for(const a of Array.isArray(artists)?artists:[]){
   if(!shape(a,['id','name','aliases'])||!id(a.id)||artistIds.has(a.id)||!text(a.name)||!Array.isArray(a.aliases)||a.aliases.some(v=>!text(v))||new Set(a.aliases).size!==a.aliases.length)errors.push('Invalid artist record');
   if(a&&typeof a==='object')artistIds.add(a.id);
 }
 if(!Array.isArray(broadcasters))errors.push('broadcasters must be an array');
 for(const b of Array.isArray(broadcasters)?broadcasters:[]) {
   if(!shape(b,['id','name','aliases','website','sourceIds','reviewedOn','notes'])||!id(b.id)||broadIds.has(b.id)||!text(b.name)||!Array.isArray(b.aliases)||b.aliases.some(a=>!text(a))||new Set(b.aliases).size!==b.aliases.length||!validHttps(b.website)||!list(b.sourceIds,sources,{nonempty:true})||!date(b.reviewedOn)||!text(b.notes))errors.push('Invalid broadcaster record');
   if(b && typeof b==='object')broadIds.add(b.id);
 }
 if(!Array.isArray(themes))errors.push('programmeThemes must be an array');
 for(const t of Array.isArray(themes)?themes:[]) {
   if(!shape(t,['id','name','description'])||!id(t.id)||themeIds.has(t.id)||!text(t.name)||!text(t.description))errors.push('Invalid programme theme');
   if(t && typeof t==='object')themeIds.add(t.id);
 }
 for(const n of data.networks??[]) {
   if(n.broadcasterId!==undefined) {if(!broadIds.has(n.broadcasterId)||!list(n.broadcasterSourceIds,sources,{nonempty:true})||!['public-broadcaster','licensed-operator','publisher-operator'].includes(n.broadcasterRelationship))errors.push('Network '+n.id+': invalid broadcaster relationship/provenance');}
   else if(n.broadcasterSourceIds!==undefined||n.broadcasterRelationship!==undefined)errors.push('Network '+n.id+': broadcaster sources without broadcaster');
 }
 for(const s of allStations(data)) {
   const fail=m=>errors.push('Metadata '+s.id+': '+m);
   if(!Array.isArray(s.broadcastLanguages)||!Array.isArray(s.genres))continue;
   if(new Set(s.broadcastLanguages).size!==s.broadcastLanguages.length||new Set(s.genres).size!==s.genres.length)fail('duplicate language/category');
   if(s.artistIds!==undefined && (!list(s.artistIds,artistIds,{nonempty:true})||!s.genres.includes('artist-hits')))fail('invalid artist membership');
   if(s.programmeThemeIds!==undefined && (!list(s.programmeThemeIds,themeIds)||s.programmeThemeIds.length&&!s.genres.includes('devotional')))fail('invalid devotional theme membership');
   if(s.geographyEvidence!==undefined) {
     const g=s.geographyEvidence;
     if(!shape(g,['confidence','evidenceType','sourceIds','reviewedOn','notes'])||!['high','medium','low','unknown'].includes(g.confidence)||!['publisher','official','directory-corroborated','user-corroborated','legacy-catalogue','unknown'].includes(g.evidenceType)||!list(g.sourceIds,sources,{nonempty:g.confidence!=='unknown'})||!date(g.reviewedOn)||!text(g.notes))fail('invalid geography evidence');
   }
   if(s.languageProfile===undefined)continue;
   const p=s.languageProfile;
   if(!shape(p,['classification','programmingPattern','coverage','primaryLanguage','sourceIds','reviewedOn','notes'],['schedules'])){fail('invalid languageProfile fields');continue;}
   if(!['single-language','multilingual','unknown'].includes(p.classification)||!['continuous','mixed','scheduled','unknown'].includes(p.programmingPattern)||!['complete','partial','unknown'].includes(p.coverage)||!date(p.reviewedOn)||!text(p.notes)||!list(p.sourceIds,sources,{nonempty:p.classification!=='unknown'}))fail('invalid languageProfile metadata');
   if(p.primaryLanguage!==null && (!languages.has(p.primaryLanguage)||!s.broadcastLanguages.includes(p.primaryLanguage)))fail('primary language is not documented');
   if(p.classification==='single-language'&&s.broadcastLanguages.length!==1 || s.broadcastLanguages.length>1&&p.classification!=='multilingual' || p.coverage==='complete'&&!s.broadcastLanguages.length)fail('inconsistent language classification/coverage');
   if(p.schedules!==undefined&&!Array.isArray(p.schedules)){fail('schedules must be an array');continue;}
   const ids=new Set();
   for(const q of p.schedules??[]) {
     if(!q||typeof q!=='object'||Array.isArray(q)){fail('invalid sourced programme schedule');continue;}
     if(!shape(q,['id','title','languages','days','startLocal','endLocal','timeZone','sourceIds','reviewedOn'])||!id(q.id)||ids.has(q.id)||!text(q.title)||!list(q.languages,new Set(s.broadcastLanguages),{nonempty:true})||!Array.isArray(q.days)||!q.days.length||new Set(q.days).size!==q.days.length||q.days.some(d=>!Number.isInteger(d)||d<1||d>7)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(q.startLocal)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(q.endLocal)||q.startLocal===q.endLocal||!list(q.sourceIds,sources,{nonempty:true})||!list(q.sourceIds,new Set(Array.isArray(p.sourceIds)?p.sourceIds:[]),{nonempty:true})||!date(q.reviewedOn)||p.programmingPattern!=='scheduled')fail('invalid sourced programme schedule');
     try{if(!text(q.timeZone)||!q.timeZone.includes('/'))throw Error();new Intl.DateTimeFormat('en',{timeZone:q.timeZone});}catch{fail('invalid IANA schedule timezone');}ids.add(q.id);
     if(Array.isArray(q.sourceIds)&&q.sourceIds.some(sid=>! /^(publisher|official)(-|$)/.test(sourceMap.get(sid)?.kind??'')))fail('schedule requires reviewed publisher/official provenance');
   }
 }
 if(data.index?.files?.browseIndex==='browse-index.json'&&data.browseIndex!==undefined) {
   try{if(JSON.stringify(data.browseIndex)!==JSON.stringify(buildBrowseIndex(data)))errors.push('browseIndex is stale or malformed; run npm run generate:browse');}catch(e){errors.push('Cannot derive browseIndex: '+e.message);}
 }
 return errors;
}
