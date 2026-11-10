import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,cpSync,mkdtempSync,rmSync,existsSync,readdirSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
import {readStage14Catalogue} from './catalogue-history.mjs';
import {allStations,availabilityClass,locationChain,selectStations,buildBrowseIndex,sortKeys} from '../scripts/catalogue-navigation.mjs';
import {metadataErrors,stationGeographyErrors} from '../scripts/metadata-validation.mjs';
import {generateBrowseIndex} from '../scripts/generate-browse-index.mjs';
import {buildStatic} from '../scripts/build-static.mjs';

const json=file=>JSON.parse(readFileSync(new URL('../'+file,import.meta.url)));
const baseline=json('docs/stage15/baseline.json'),audit=json('docs/stage15/metadata-audit.json');
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const ids=rows=>rows.map(s=>s.id);
const get=()=>readCatalogue(undefined,'v2');
const row=(data,id)=>allStations(data).find(s=>s.id===id);
const validUrl=url=>typeof url==='string'&&url.startsWith('https://');
const metadata=data=>metadataErrors(data,validUrl);
const temporary=action=>{
  const root=mkdtempSync(path.join(os.tmpdir(),'radio-stage15-'));
  try {cpSync(new URL('../data',import.meta.url),path.join(root,'data'),{recursive:true});return action(root);}finally{rmSync(root,{recursive:true,force:true});}
};

test('Stage 15 preserves all baseline identities, stream objects, networks, migrations and historical evidence',()=>{
  const data=get(),dated=readStage14Catalogue();
  for(const key of ['stations','discoveryStations','networks'])assert.deepEqual(ids(data[key]),baseline.ids[key]);
  for(const [key,hashes]of Object.entries(baseline.hashes))for(const [id,expected]of Object.entries(hashes))assert.equal(hash(dated[key].find(r=>(r.id??r.code)===id)),expected,key+':'+id);
  for(const station of data.stations)assert.equal(hash(station.streams),baseline.streamHashes[station.id],station.id);
  assert.equal(hash(data.stationMigrations),baseline.migrationHash);
  for(const [file,expected]of Object.entries(baseline.historicalFileHashes))assert.equal(createHash('sha256').update(readFileSync(new URL('../'+file,import.meta.url))).digest('hex'),expected,file);
  for(const station of allStations(data)){
    const previous=row(dated,station.id);
    for(const field of ['name','networkId','website','frequencyMHz','logo','logoUrl','notes','genres','delivery','coverage'])assert.deepEqual(station[field],previous[field],station.id+':'+field);
  }
  assert.ok(data.discoveryStations.some(s=>s.id==='air-thoothukudi'));
  assert.ok(!data.stations.some(s=>s.id==='air-thoothukudi'));
});

test('Stage 15 counts and reference registries agree without added station identities',()=>{
  const d=get();assert.deepEqual(validateCatalogue(d),[]);
  assert.equal(d.index.catalogVersion,'2.0.0');assert.equal(d.index.schemaVersion,2);
  assert.equal(allStations(d).length,117);assert.equal(d.stations.length,71);assert.equal(d.discoveryStations.length,46);
  assert.equal(d.stations.flatMap(s=>s.streams).length,74);assert.equal(d.networks.length,71);
  assert.equal(d.locations.length,131);assert.equal(d.languages.length,61);assert.equal(d.broadcasters.length,10);assert.equal(d.programmeThemes.length,4);
  assert.equal(new Set(allStations(d).map(s=>s.id)).size,117);
  assert.equal(new Set(allStations(d).map(s=>s.countryCode)).size,20);
});

test('change journal covers every live metadata edit and supports a reversible baseline',()=>{
  const d=get(),old=readStage14Catalogue(),sources=new Set(d.sources.map(s=>s.id));
  for(const edit of audit.changes){
    assert.ok(edit.sourceIds.length&&edit.sourceIds.every(id=>sources.has(id)));
    assert.ok(edit.evidenceType&&edit.confidence&&edit.remainingUncertainty);
    assert.equal(edit.reviewedOn,'2026-11-10');
  }
  for(const s of allStations(d)){
    const before=row(old,s.id);
    for(const key of new Set([...Object.keys(before),...Object.keys(s)]))if(JSON.stringify(before[key])!==JSON.stringify(s[key]))assert.ok(audit.changes.some(e=>e.entityId===s.id&&e.field===key),s.id+':'+key);
  }
  // Replaying the journal forward must reach the actual records, including repeated edits.
  for(const edit of audit.changes){const r=edit.entityType==='network'?old.networks.find(n=>n.id===edit.entityId):row(old,edit.entityId);assert.equal(Object.hasOwn(r,edit.field),edit.previousPresent);assert.deepEqual(r[edit.field]??null,edit.previousValue);r[edit.field]=structuredClone(edit.newValue);}
  assert.deepEqual(old.stations,d.stations);assert.deepEqual(old.discoveryStations,d.discoveryStations);assert.deepEqual(old.networks,d.networks);
});

test('AR Radio uses evidenced Thrissur district and three languages without invented locality or frequency',()=>{
  const d=get(),s=row(d,'ar-radio');
  assert.equal(s.regionId,'in-kl');assert.equal(s.districtId,'in-kl-thrissur');assert.equal(s.localityId,null);assert.equal(s.frequencyMHz,null);
  assert.deepEqual(new Set(s.broadcastLanguages),new Set(['ta','ml','hi']));
  assert.equal(s.languageProfile.classification,'multilingual');assert.equal(s.languageProfile.coverage,'complete');
  assert.equal(s.geographyEvidence.evidenceType,'publisher');assert.ok(s.geographyEvidence.sourceIds.length);
});

test('language profiles preserve partial knowledge and never infer Tamil or a primary language from array position',()=>{
  const d=get(),time=row(d,'time-fm-toronto-ca');
  assert.deepEqual(time.broadcastLanguages,['ta']);assert.equal(time.languageProfile.classification,'multilingual');assert.equal(time.languageProfile.coverage,'partial');assert.equal(time.languageProfile.primaryLanguage,null);
  for(const s of allStations(d))if(s.broadcastLanguages.length>1)assert.equal(s.languageProfile.classification,'multilingual',s.id);
  for(const s of allStations(d).filter(s=>s.broadcastLanguages.length===0)){assert.equal(s.languageProfile.classification,'unknown');assert.equal(s.languageProfile.primaryLanguage,null);}
  const expected={multilingual:19,'single-language':11,unknown:87};
  assert.deepEqual(Object.fromEntries(d.browseIndex.facets.languageClassifications.map(f=>[f.id,f.counts.all])),expected);
  for(const id of ['east-fm-ca','lotus-fm-za','3zzz-au','4eb-fm-au','4eb-global-au','5ebi-au','live-fm-bh','mauradio-mu','radio-plus-indiz-mu'])assert.equal(row(d,id).languageProfile.classification,'multilingual',id);
  assert.equal(row(d,'lotus-fm-za').languageProfile.primaryLanguage,'en');
});

test('breadcrumbs use canonical ancestors, distinguish namesakes and skip missing district levels',()=>{
  const d=get();
  assert.deepEqual(ids(locationChain(row(d,'air-nagercoil'),d.locations)),['in','in-tn','in-tn-kanyakumari','in-tn-kanyakumari-nagercoil']);
  assert.deepEqual(ids(locationChain(row(d,'ar-radio'),d.locations)),['in','in-kl','in-kl-thrissur']);
  assert.deepEqual(ids(locationChain(row(d,'time-fm-toronto-ca'),d.locations)),['ca','ca-on','ca-on-toronto']);
  assert.deepEqual(stationGeographyErrors(row(d,'time-fm-toronto-ca'),d.locations),[]);
  const chennai=d.locations.filter(l=>l.name==='Chennai');assert.ok(chennai.length>=2);assert.equal(new Set(ids(chennai)).size,chennai.length);
});

test('geographic validation rejects conflicting parents, foreign locations and cycles for both inventories',()=>{
  for(const inventory of ['stations','discoveryStations']){
    const d=get(),s=d[inventory][0];s.regionId='au-vic';assert.ok(validateCatalogue(d).some(e=>e.includes(s.id)));
  }
  const d=get(),s=row(d,'time-fm-toronto-ca');s.regionId=null;
  assert.ok(stationGeographyErrors(s,d.locations).some(e=>e.includes('ancestor')));
  s.regionId='ca-on';d.locations.find(l=>l.id==='ca-on').parentId='ca-on-toronto';
  assert.throws(()=>locationChain(s,d.locations),/Cyclic/);
});

test('generated facets are deterministic, unique, correctly scoped and derived without mutation',()=>{
  const d=get(),before=hash(d),index=buildBrowseIndex(d);assert.deepEqual(index,d.browseIndex);assert.equal(hash(d),before);
  for(const key of ['stations','discoveryStations','networks','locations','languages','categories','broadcasters','programmeThemes'])d[key].reverse();
  assert.deepEqual(buildBrowseIndex(d),index);
  assert.deepEqual(index.totals,{all:117,streamBearing:71,discoveryOnly:46});
  for(const group of [...Object.values(index.facets),index.availability])for(const facet of group){
    assert.equal(new Set(facet.stationIds).size,facet.counts.all,facet.key);
    assert.equal(facet.counts.streamBearing+facet.counts.discoveryOnly,facet.counts.all);
    assert.equal(facet.counts.streamBearing,facet.stationIds.filter(id=>availabilityClass(row(d,id))==='stream-bearing').length);
  }
  assert.equal(index.facets.countries.reduce((n,f)=>n+f.counts.all,0),117);
  assert.equal(index.facets.networks.reduce((n,f)=>n+f.counts.all,0),117);
  assert.equal(index.facets.languageClassifications.reduce((n,f)=>n+f.counts.all,0),117);
  d.stations.push(d.stations[0]);assert.throws(()=>buildBrowseIndex(d),/Duplicate station/);
});

test('combined filters intersect established memberships and never substitute unrelated results',()=>{
  const d=get(),filters={language:'hi',countryCode:'IN',regionId:'in-kl',multilingual:true};
  const rows=selectStations(d,filters);assert.ok(rows.some(s=>s.id==='ar-radio'));assert.ok(rows.length>=2);
  assert.equal(new Set(ids(rows)).size,rows.length);
  assert.ok(rows.every(s=>s.countryCode==='IN'&&s.broadcastLanguages.includes('hi')&&s.regionId==='in-kl'));
  assert.deepEqual(selectStations(d,{countryCode:'CA',districtId:'in-tn-kanyakumari'}),[]);
  assert.deepEqual(selectStations(d,{districtId:'in-tn'}),[]);
  assert.deepEqual(selectStations(d,{language:'nonexistent'}),[]);
  assert.equal(selectStations(d,{countryCode:'CA'}).length,allStations(d).filter(s=>s.countryCode==='CA').length);
  for(const s of selectStations(d,{districtId:'in-tn-kanyakumari'}))assert.equal(s.districtId,'in-tn-kanyakumari');
  for(const s of selectStations(d,{countryCode:'CA',multilingual:true,genre:'music'}))assert.equal(s.languageProfile.classification,'multilingual');
  assert.equal(selectStations(d,{availability:'stream-bearing'}).length,71);assert.equal(selectStations(d,{availability:'discovery-only'}).length,46);
  assert.throws(()=>selectStations(d,{popularity:true}),/Unknown filter/);assert.throws(()=>selectStations(d,{language:['ta','hi']}),/strings/);
});

test('all sort keys are deterministic with stable ID ties and missing values last',()=>{
  const d=get();
  for(const sort of sortKeys){const expected=ids(selectStations(d,{sort}));d.stations.reverse();d.discoveryStations.reverse();assert.deepEqual(ids(selectStations(d,{sort})),expected,sort);}
  const byLanguage=selectStations(d,{sort:'language'});const firstMissing=byLanguage.findIndex(s=>s.languageProfile.primaryLanguage===null);
  assert.ok(firstMissing>0);assert.ok(byLanguage.slice(firstMissing).every(s=>s.languageProfile.primaryLanguage===null));
  assert.deepEqual(ids(selectStations(d,{language:'ta',sort:'language'})),ids(selectStations(d,{language:'ta'})).sort());
  const a=d.stations[0],b=d.stations[1];a.name=b.name='Identical';
  assert.deepEqual(ids(selectStations(d).filter(s=>s.id===a.id||s.id===b.id)),[a.id,b.id].sort());
});

test('broadcasters are sourced operators separate from brands and do not conflate Suryan with Sooriyan',()=>{
  const d=get(),indian=d.networks.find(n=>n.id==='suryan-in'),sriLankan=d.networks.find(n=>n.id==='sooriyan-lk');
  assert.equal(indian.broadcasterId,'sun-tv-network');assert.equal(sriLankan.broadcasterId,'asia-broadcasting-corporation');
  assert.notEqual(indian.broadcasterId,sriLankan.broadcasterId);
  for(const b of d.broadcasters){const networks=d.networks.filter(n=>n.broadcasterId===b.id);assert.ok(networks.length);assert.deepEqual(ids(selectStations(d,{broadcasterId:b.id})).sort(),allStations(d).filter(s=>networks.some(n=>n.id===s.networkId)).map(s=>s.id).sort());}
  const n=d.networks.find(n=>n.broadcasterId);n.broadcasterSourceIds=[];assert.ok(metadata(d).some(e=>e.includes('provenance')));
});

test('devotional themes describe evidenced content without inferring it from an organization name',()=>{
  const d=get();
  assert.equal(allStations(d).filter(s=>s.programmeThemeIds?.length).length,12);
  for(const s of allStations(d).filter(s=>s.programmeThemeIds?.length))assert.ok(s.genres.includes('devotional'));
  assert.equal(row(d,'iskcon-nagercoil').programmeThemeIds,undefined);
  const themed=allStations(d).find(s=>s.programmeThemeIds?.length);themed.programmeThemeIds=['invented'];assert.ok(metadata(d).some(e=>e.includes('theme')));
});

test('profiles and sourced schedules reject invalid times, references, classifications and fields',()=>{
  const mutate=fn=>{const d=get();fn(d);assert.ok(metadata(d).length);};
  mutate(d=>{row(d,'ar-radio').languageProfile.classification='single-language';});
  mutate(d=>{row(d,'ar-radio').languageProfile.primaryLanguage='fr';});
  mutate(d=>{row(d,'ar-radio').languageProfile.onAirLanguage='ta';});
  for(const fn of [q=>q.days=[0],q=>q.startLocal='25:01',q=>q.endLocal=q.startLocal,q=>q.timeZone='Invented/Zone',q=>q.languages=['not-known'],q=>q.sourceIds=['absent'],q=>q.sourceIds=[get().sources[0].id]])mutate(d=>fn(allStations(d).find(s=>s.languageProfile.schedules?.length).languageProfile.schedules[0]));
  mutate(d=>{const p=allStations(d).find(s=>s.languageProfile.schedules?.length).languageProfile;p.schedules.push(structuredClone(p.schedules[0]));});
  mutate(d=>{allStations(d).find(s=>s.languageProfile.schedules?.length).languageProfile.sourceIds=null;});
  const d=get();d.broadcasters=[null];d.programmeThemes=[null];assert.doesNotThrow(()=>metadata(d));assert.ok(metadata(d).length);
  d.broadcasters=null;d.programmeThemes=null;assert.doesNotThrow(()=>metadata(d));assert.ok(metadata(d).length);
});

test('optional index absence supports canonical fallback while stale facets block publication',()=>{
  const d=get();delete d.browseIndex;delete d.index.files.browseIndex;assert.deepEqual(validateCatalogue(d),[]);assert.equal(selectStations(d).length,117);
  const stale=get();stale.browseIndex.totals.all++;assert.ok(validateCatalogue(stale).some(e=>e.includes('stale')));
  temporary(root=>{const file=path.join(root,'data/v2/browse-index.json'),saved=readFileSync(file);writeFileSync(file,JSON.stringify(stale.browseIndex));assert.throws(()=>buildStatic(root),/stale/);generateBrowseIndex(root);assert.deepEqual(readFileSync(file),saved);assert.ok(!readdirSync(path.dirname(file)).some(n=>n.endsWith('.tmp')));});
});

test('generator rejects invalid metadata before writing and preserves the prior index',()=>temporary(root=>{
  const file=path.join(root,'data/v2/browse-index.json'),saved=readFileSync(file),stationsFile=path.join(root,'data/v2/stations.json');
  const stations=JSON.parse(readFileSync(stationsFile));stations[0].regionId='invalid';writeFileSync(stationsFile,JSON.stringify(stations));
  assert.throws(()=>generateBrowseIndex(root));assert.deepEqual(readFileSync(file),saved);
}));

test('static publication includes optional API files but excludes all research and injected metadata',()=>temporary(root=>{
  writeFileSync(path.join(root,'data/v2/private-research.json'),'{}');
  const dest=buildStatic(root);
  for(const file of ['broadcasters.json','programme-themes.json','browse-index.json'])assert.ok(existsSync(path.join(dest,'v2',file)));
  assert.ok(!existsSync(path.join(dest,'v2/private-research.json')));assert.ok(!existsSync(path.join(dest,'docs')));assert.ok(!existsSync(path.join(dest,'reports')));
}));

test('JSON schemas retain old contracts and declare the additive metadata fields',()=>{
  for(const name of ['station','discovery-station']){
    const schema=json('schema/v2/'+name+'.schema.json');
    for(const field of ['languageProfile','geographyEvidence','programmeThemeIds']){assert.ok(schema.properties[field]);assert.ok(!schema.required.includes(field));}
  }
  const schema=json('schema/v2/network.schema.json');assert.ok(schema.properties.broadcasterId);assert.ok(!schema.required.includes('broadcasterId'));
  for(const locale of ['en','ta','sa']){const before=baseline.i18n[locale],now=get().i18n[locale];for(const [section,values]of Object.entries(before))for(const [key,value]of Object.entries(values))assert.equal(now[section][key],value);}
});

test('all 117 station audit rows and grouped research reports match the canonical snapshot',()=>{
  const d=get(),report=json('docs/stage15/stations.json'),summary=json('docs/stage15/summary.json'),groupings=json('docs/stage15/groupings.json'),geo=json('docs/stage15/geography.json'),languages=json('docs/stage15/languages.json');
  assert.deepEqual(report.stations.map(s=>s.stationId),allStations(d).map(s=>s.id).sort());
  for(const r of report.stations){const s=row(d,r.stationId);assert.deepEqual(r.languages.broadcastLanguages,s.broadcastLanguages);assert.deepEqual(r.languages.languageProfile,s.languageProfile);assert.deepEqual(r.categories.genres,s.genres);assert.deepEqual(r.geography.evidence,s.geographyEvidence);assert.ok(r.remainingUncertainty.length);}
  assert.equal(summary.changes.journalEntries,audit.changes.length);assert.equal(summary.changes.geographyCorrections,geo.corrections.length);
  assert.deepEqual(groupings.genres,d.browseIndex.facets.genres);assert.deepEqual(groupings.broadcasters,d.browseIndex.facets.broadcasters);assert.deepEqual(languages.languages,d.browseIndex.facets.languages);
  assert.deepEqual(geo.locations,d.browseIndex.facets.locations);assert.equal(geo.coverage.country.all,117);
});

test('published-file inventory is exact and approved artwork bytes remain unchanged',()=>temporary(root=>{
  const dest=buildStatic(root),walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.relative(dest,path.join(dir,e.name)).split(path.sep).join('/')]);
  const files=walk(dest).sort();assert.deepEqual(files,json('docs/stage15/published-files.json').files);
  for(const file of files.filter(f=>/^v[12]\/assets\//.test(f)))assert.deepEqual(readFileSync(path.join(dest,file)),readFileSync(new URL('../data/'+file,import.meta.url)));
}));
