/** Public records retain broadcaster facts and media contracts but no internal research notes.
 * Canonical v1 source snapshots stay frozen; static distribution is redacted.
 */
const redacted = new Set(['stations.json','discovery-stations.json','sources.json','broadcasters.json','station-migrations.json']);
function publicDiscoveryAbout(s) {
  const lang=s.broadcastLanguages.length===1
    ? ({ta:'Tamil',en:'English',ml:'Malayalam',sa:'Sanskrit',hi:'Hindi'}[s.broadcastLanguages[0]] ?? 'regional')+'-language '
    : s.broadcastLanguages.length>1?'multilingual ':'';
  const subjects=s.genres.map(id=>({
    music:'music',news:'news',general:'general programmes',talk:'talk programmes',
    devotional:'devotional programmes',classical:'classical music',community:'community programming',
  })[id]).filter(Boolean);
  return s.name+' is a '+lang+(s.delivery==='fm'?'FM station':'radio service')+
    ' listed by RadioBee. Its catalogue categories include '+
    (subjects.length?subjects.join(' and '):'general programming')+'.';
}
function scrub(value) {
  if(Array.isArray(value))return value.map(scrub);
  if(!value||typeof value!=='object')return value;
  return Object.fromEntries(Object.entries(value).map(([k,v])=>[
    k,k==='notes'?'Editorial review retained in the source repository.':
      k==='reason'?'Previous catalogue listing updated.':scrub(v),
  ]));
}
export function publicJsonText(version,file,value) {
  if(!redacted.has(file))return null;
  let doc=scrub(value);
  if(file==='stations.json')doc=doc.map(s=>({...s,notes:null}));
  if(file==='discovery-stations.json')doc=doc.map(s=>({
    ...s,notes:version==='v1'?publicDiscoveryAbout(s):null,
  }));
  if(file==='sources.json'||file==='broadcasters.json')
    doc=doc.map(s=>({...s,notes:'Catalogue source reference.'}));
  return JSON.stringify(doc,null,2)+'\n';
}
export function publicSnapshot(data,version) {
  const filtered={...data};
  for(const [field,file]of [['stations','stations.json'],['discoveryStations','discovery-stations.json'],['sources','sources.json'],['broadcasters','broadcasters.json'],['stationMigrations','station-migrations.json']])
    if(data[field]!==undefined)filtered[field]=JSON.parse(publicJsonText(version,file,data[field]));
  return filtered;
}
