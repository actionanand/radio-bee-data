// Pure, offline navigation helpers. No playback or permission decisions occur here.
export const sortKeys = ['name','country','region','district','network','broadcaster','language','genre','artist','availability'];
const normalized = value => String(value).normalize('NFKC').toLowerCase();
const compare = (a,b) => a < b ? -1 : a > b ? 1 : 0;
const byId = (a,b) => compare(a.id,b.id);
export const allStations = data => [...(data.stations ?? []),...(data.discoveryStations ?? [])];
export const availabilityClass = station => Array.isArray(station.streams) && station.streams.length ? 'stream-bearing' : 'discovery-only';

export function locationChain(station, locations) {
  const map = new Map(locations.map(l=>[l.id,l]));
  let id = station.localityId ?? station.districtId ?? station.regionId ?? station.countryCode?.toLowerCase();
  const chain=[],seen=new Set();
  while(id !== null && id !== undefined) {
    if(seen.has(id)) throw Error('Cyclic location hierarchy: '+id);
    seen.add(id);const row=map.get(id);
    if(!row || row.countryCode!==station.countryCode) throw Error('Missing or foreign location: '+id);
    chain.unshift(row);id=row.parentId;
  }
  if(chain[0]?.type!=='country' || chain[0]?.id!==station.countryCode?.toLowerCase()) throw Error('Location chain lacks its country');
  for(const key of ['regionId','districtId','localityId']) if(station[key]!=null && !seen.has(station[key])) throw Error('Conflicting station location: '+key);
  return chain;
}

export function selectStations(data, filters={}) {
  const allowed=['countryCode','regionId','districtId','localityId','language','networkId','broadcasterId','genre','theme','artist','availability','multilingual','sort'];
  if(!filters || typeof filters!=='object' || Array.isArray(filters) || Object.keys(filters).some(k=>!allowed.includes(k))) throw Error('Unknown filter field');
  if(filters.multilingual!==undefined && typeof filters.multilingual!=='boolean') throw Error('multilingual must be boolean');
  for(const key of allowed.filter(k=>!['multilingual'].includes(k))) if(filters[key]!==undefined && (typeof filters[key]!=='string'||!filters[key])) throw Error('Filter values must be nonempty strings');
  if(filters.availability!==undefined && !['all','stream-bearing','discovery-only'].includes(filters.availability)) throw Error('Invalid availability filter');
  const sort=filters.sort??'name';if(!sortKeys.includes(sort)) throw Error('Invalid sort key');
  const nets=new Map(data.networks.map(n=>[n.id,n])),broadcasters=new Map((data.broadcasters??[]).map(b=>[b.id,b]));
  const languageNames=new Map(data.languages.map(l=>[l.code,l.name])),genreNames=new Map(data.categories.map(c=>[c.id,c.name]));
  const chains=new Map(allStations(data).map(s=>[s.id,locationChain(s,data.locations)]));
  const rows=allStations(data).filter(s=>{
    if(filters.countryCode && s.countryCode!==filters.countryCode) return false;
    for(const [key,type]of [['regionId','state'],['districtId','district'],['localityId','locality']]) if(filters[key] && !chains.get(s.id).some(l=>l.id===filters[key]&&l.type===type)) return false;
    if(filters.language && !s.broadcastLanguages.includes(filters.language)) return false;
    if(filters.networkId && s.networkId!==filters.networkId) return false;
    if(filters.broadcasterId && nets.get(s.networkId)?.broadcasterId!==filters.broadcasterId) return false;
    if(filters.genre && !s.genres.includes(filters.genre)) return false;
    if(filters.theme && !s.programmeThemeIds?.includes(filters.theme)) return false;
    if(filters.artist && !s.artistIds?.includes(filters.artist)) return false;
    if(filters.multilingual!==undefined && (s.languageProfile?.classification==='multilingual')!==filters.multilingual) return false;
    return !filters.availability || filters.availability==='all' || availabilityClass(s)===filters.availability;
  });
  const value=s=>{
    const chain=chains.get(s.id),network=nets.get(s.networkId);
    switch(sort) {
      case 'name': return s.name;
      case 'country': return chain[0].name;
      case 'region': return chain.find(l=>l.type==='state')?.name??null;
      case 'district': return chain.find(l=>l.type==='district')?.name??null;
      case 'network': return network?.name??null;
      case 'broadcaster': return broadcasters.get(network?.broadcasterId)?.name??null;
      case 'language': return languageNames.get(filters.language??s.languageProfile?.primaryLanguage)??null;
      case 'genre': return filters.genre?genreNames.get(filters.genre):s.genres.map(id=>genreNames.get(id)).filter(Boolean).sort((a,b)=>compare(normalized(a),normalized(b)))[0]??null;
      case 'artist': return (data.artists??[]).find(a=>a.id===s.artistIds?.[0])?.name??null;
      case 'availability': return availabilityClass(s);
    }
  };
  return rows.sort((a,b)=>{
    const x=value(a),y=value(b);
    if(x===null || y===null) return x===y?compare(a.id,b.id):x===null?1:-1;
    return compare(normalized(x),normalized(y)) || compare(a.id,b.id);
  });
}

export function buildBrowseIndex(data) {
  const stations=allStations(data).sort(byId),chains=new Map(stations.map(s=>[s.id,locationChain(s,data.locations)]));
  if(new Set(stations.map(s=>s.id)).size!==stations.length)throw Error('Duplicate station IDs cannot form a navigation index');
  const facet=(id,name,key,members,extra={})=>{
    const stationIds=[...new Set(members.map(s=>s.id))].sort(compare),streamBearing=members.filter(s=>availabilityClass(s)==='stream-bearing').length;
    return {id,name,key,...extra,stationIds,counts:{all:stationIds.length,streamBearing,discoveryOnly:stationIds.length-streamBearing}};
  };
  const networks=new Map(data.networks.map(n=>[n.id,n]));
  return {
    schemaVersion:data.index.schemaVersion,catalogVersion:data.index.catalogVersion,
    countScope:'Unique station IDs in stations.json plus discovery-stations.json; stream-bearing does not mean verified, playable or permission-approved.',
    totals:{all:stations.length,streamBearing:data.stations.length,discoveryOnly:(data.discoveryStations??[]).length},
    stationIds:stations.map(s=>s.id),
    facets:{
      countries:data.locations.filter(l=>l.type==='country'&&stations.some(s=>s.countryCode===l.countryCode)).sort(byId).map(l=>facet(l.countryCode,l.name,'country:'+l.countryCode,stations.filter(s=>s.countryCode===l.countryCode),{locationId:l.id})),
      locations:[...data.locations].sort(byId).map(l=>facet(l.id,l.name,'location:'+l.id,stations.filter(s=>chains.get(s.id).some(p=>p.id===l.id)),{type:l.type,countryCode:l.countryCode,parentId:l.parentId,childIds:data.locations.filter(p=>p.parentId===l.id).map(p=>p.id).sort(compare),directStationIds:stations.filter(s=>(s.localityId??s.districtId??s.regionId??s.countryCode.toLowerCase())===l.id).map(s=>s.id)})),
      languages:[...data.languages].sort((a,b)=>compare(a.code,b.code)).map(l=>facet(l.code,l.name,'language:'+l.code,stations.filter(s=>s.broadcastLanguages.includes(l.code)),{nativeName:l.nativeName})),
      languageClassifications:['multilingual','single-language','unknown'].map(id=>facet(id,id,'language-classification:'+id,stations.filter(s=>(s.languageProfile?.classification??'unknown')===id))),
      networks:[...data.networks].sort(byId).map(n=>facet(n.id,n.name,'network:'+n.id,stations.filter(s=>s.networkId===n.id),{aliases:n.aliases,countryCodes:n.countryCodes,broadcasterId:n.broadcasterId??null})),
      broadcasters:[...(data.broadcasters??[])].sort(byId).map(b=>facet(b.id,b.name,'broadcaster:'+b.id,stations.filter(s=>networks.get(s.networkId)?.broadcasterId===b.id),{aliases:b.aliases,sourceIds:b.sourceIds,networkIds:data.networks.filter(n=>n.broadcasterId===b.id).map(n=>n.id).sort(compare)})),
      genres:[...data.categories].sort(byId).map(c=>facet(c.id,c.name,'genre:'+c.id,stations.filter(s=>s.genres.includes(c.id)))),
      themes:[...(data.programmeThemes??[])].sort(byId).map(t=>facet(t.id,t.name,'theme:'+t.id,stations.filter(s=>s.programmeThemeIds?.includes(t.id)))),
      ...(data.index.files.artists ? {artists:[...(data.artists??[])].sort(byId).map(a=>facet(a.id,a.name,'artist:'+a.id,stations.filter(s=>s.artistIds?.includes(a.id)),{aliases:a.aliases}))} : {})
    },
    availability:['stream-bearing','discovery-only'].map(id=>facet(id,id,'availability:'+id,stations.filter(s=>availabilityClass(s)===id)))
  };
}
