import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,cpSync,mkdirSync,rmSync,existsSync,renameSync,symlinkSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {readCatalogue,validateCatalogue,validateRepository} from '../scripts/validate.mjs';
import {buildStatic} from '../scripts/build-static.mjs';
import {fileInventory,sha256,v1BaselineErrors} from '../scripts/versioned-publication.mjs';
import {generateBrowseIndex} from '../scripts/generate-browse-index.mjs';

const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const json=name=>JSON.parse(readFileSync(path.join(root,name)));
const saved=json('docs/stage15/enriched-snapshot.json');
function fixture(t){
  const temporary=mkdtempSync(path.join(os.tmpdir(),'radiobee-dual-'));
  t.after(()=>rmSync(temporary,{recursive:true,force:true}));
  cpSync(path.join(root,'data'),path.join(temporary,'data'),{recursive:true});
  mkdirSync(path.join(temporary,'docs/stage15'),{recursive:true});
  cpSync(path.join(root,'docs/stage15/v1-production-baseline.json'),path.join(temporary,'docs/stage15/v1-production-baseline.json'));
  return temporary;
}

test('legacy source and generated v1 are byte-identical to the complete approved master production snapshot',t=>{
  const temporary=fixture(t);assert.deepEqual(v1BaselineErrors(temporary),[]);
  assert.deepEqual(validateRepository(temporary),[]);
  buildStatic(temporary,{requireV2:true,preserveV1:true});
  assert.deepEqual(v1BaselineErrors(temporary,'dist/v1'),[]);
  const baseline=json('docs/stage15/v1-production-baseline.json');
  assert.equal(baseline.baseCommit,'d32b32c703256e042aa4b2f17dd5823528a8fa59');assert.equal(Object.keys(baseline.files).length,25);
  const index=JSON.parse(readFileSync(path.join(temporary,'dist/v1/index.json')));assert.equal(index.schemaVersion,1);assert.equal(index.catalogVersion,'1.9.0');
});

test('every enriched Stage 15 metadata and asset byte survives migration; only release markers change',()=>{
  assert.deepEqual(fileInventory(path.join(root,'data/v2')),Object.keys(saved.files).sort());
  const changed=new Set(['stations.json','discovery-stations.json','sources.json','station-migrations.json','index.json','browse-index.json']);
  for(const [file,expected]of Object.entries(saved.files)){
    if(changed.has(file))continue; // Reviewed Stage 18 v2 delta, pre-import snapshot kept separately.
    let bytes=readFileSync(path.join(root,'data/v2',file));
    if(['index.json','browse-index.json'].includes(file)){
      const document=JSON.parse(bytes);assert.equal(document.schemaVersion,2);assert.equal(document.catalogVersion,'2.0.0');
      document.schemaVersion=1;document.catalogVersion='1.10.0';bytes=Buffer.from(JSON.stringify(document,null,2)+'\n');
    }
    assert.equal(sha256(bytes),expected,file);
  }
});

test('every v2 manifest, locale and artwork reference resolves to an identical self-contained published file',t=>{
  const temporary=fixture(t),dest=buildStatic(temporary,{requireV2:true,preserveV1:true}),d=readCatalogue(temporary,'v2');
  assert.equal(d.index.schemaVersion,2);assert.equal(d.index.catalogVersion,'2.1.0');
  for(const file of ['index.json',...Object.values(d.index.files),...d.index.locales.map(locale=>d.index.localizationRoot+locale+'.json')])assert.deepEqual(readFileSync(path.join(dest,'v2',file)),readFileSync(path.join(temporary,'data/v2',file)),file);
  for(const row of [...d.networks,...d.stations,...d.discoveryStations])if(row.logoPath)assert.deepEqual(readFileSync(path.join(dest,'v2',row.logoPath)),readFileSync(path.join(temporary,'data/v2',row.logoPath)));
  assert.equal(d.stationMigrations.schemaVersion,1,'migration document retains its independent format version');
  assert.equal(d.browseIndex.schemaVersion,2);
});

test('explicit API directory checks reject mixed schema versions and unsafe directory selectors',()=>{
  assert.equal(readCatalogue().index.schemaVersion,1);assert.equal(readCatalogue(undefined,'v2').index.schemaVersion,2);
  for(const version of ['v1','v2']){
    const data=readCatalogue(undefined,version),other=version==='v1'?'v2':'v1';
    assert.ok(validateCatalogue(data,{version:other}).some(e=>e.includes('directory/schemaVersion')));
  }
  assert.throws(()=>readCatalogue(root,'../v2'),/Unsupported API/);
  const data=readCatalogue(undefined,'v2');data.browseIndex.schemaVersion=1;assert.ok(validateCatalogue(data).some(e=>e.includes('stale')));
});

test('v2 validation resolves artwork from v2 instead of silently reusing healthy v1 assets',t=>{
  const temporary=fixture(t),data=readCatalogue(temporary,'v2'),network=data.networks.find(n=>n.logoPath);
  writeFileSync(path.join(temporary,'data/v2',network.logoPath),'invalid image');
  assert.ok(validateCatalogue(data,{root:temporary,version:'v2'}).some(e=>e.includes('logoPath')));
  assert.deepEqual(validateCatalogue(readCatalogue(temporary),{root:temporary,version:'v1'}),[]);
});

test('production v1 freeze detects even JSON-equivalent byte changes and extra files',t=>{
  const temporary=fixture(t),file=path.join(temporary,'data/v1/stations.json');
  writeFileSync(file,readFileSync(file,'utf8')+'\n');
  assert.ok(validateRepository(temporary).some(e=>e.includes('bytes differ')));
  writeFileSync(path.join(temporary,'data/v1/research.json'),'{}');
  assert.ok(v1BaselineErrors(temporary).some(e=>e.includes('inventory')));
});

test('a missing or invalid v2 prevents strict build before erasing existing output',t=>{
  const temporary=fixture(t),dest=path.join(temporary,'dist');mkdirSync(dest);writeFileSync(path.join(dest,'sentinel'),'preserve me');
  const file=path.join(temporary,'data/v2/index.json'),index=JSON.parse(readFileSync(file));
  index.files.broadcasters='../v1/networks.json';writeFileSync(file,JSON.stringify(index));
  assert.throws(()=>buildStatic(temporary,{requireV2:true,preserveV1:true}),/manifest|reference/);
  assert.equal(readFileSync(path.join(dest,'sentinel'),'utf8'),'preserve me');
  rmSync(file);assert.throws(()=>buildStatic(temporary,{requireV2:true,preserveV1:true}));assert.equal(readFileSync(path.join(dest,'sentinel'),'utf8'),'preserve me');
});

test('publication allowlists cannot be widened by legacy manifest fields or arbitrary research files',t=>{
  const temporary=fixture(t),file=path.join(temporary,'data/v1/index.json'),index=JSON.parse(readFileSync(file));
  index.files.privateResearch='private-research.json';writeFileSync(file,JSON.stringify(index));writeFileSync(path.join(temporary,'data/v1/private-research.json'),'not public');
  writeFileSync(path.join(temporary,'data/v2/private-research.json'),'not public');
  const dest=buildStatic(temporary);
  for(const version of ['v1','v2'])assert.ok(!existsSync(path.join(dest,version,'private-research.json')));
  for(const forbidden of ['find_stream_url.py','apply-hello-chennai-stage12.py','fix-stage12-hello-chennai-migration.py','README-HELLO-CHENNAI-STAGE12.md'])assert.ok(!fileInventory(dest).some(file=>file.endsWith(forbidden)));
});

test('v2 browse generation never writes to the legacy version',t=>{
  const temporary=fixture(t),before=fileInventory(path.join(temporary,'data/v1')).map(file=>[file,sha256(readFileSync(path.join(temporary,'data/v1',file)))]);
  generateBrowseIndex(temporary);
  for(const [file,hash]of before)assert.equal(sha256(readFileSync(path.join(temporary,'data/v1',file))),hash,file);
});

// URI resource lookup only: never fetch a missing resource or fall back to a
// sibling file when $id has changed the effective base URI.
function assertSchemaReferences(documents) {
  const resources=new Map(documents),references=[];
  const visit=(node,base)=>{
    if(!node||typeof node!=='object')return;
    if(typeof node.$id==='string'){
      const resource=new URL(node.$id,base);
      assert.equal(resource.hash,'','Schema $id must not have a nonempty fragment');
      resource.hash='';base=resource.href;
      assert.ok(!resources.has(base)||resources.get(base)===node,'Duplicate schema resource: '+base);
      resources.set(base,node);
    }
    for(const key of ['$anchor','$dynamicAnchor'])if(typeof node[key]==='string')resources.set(base+'#'+node[key],node);
    for(const key of ['$ref','$dynamicRef'])if(typeof node[key]==='string')references.push(new URL(node[key],base));
    for(const child of Object.values(node))visit(child,base);
  };
  for(const [uri,schema]of documents)visit(schema,uri);
  for(const uri of references){
    if(resources.has(uri.href))continue;
    const fragment=decodeURIComponent(uri.hash.slice(1));uri.hash='';
    assert.ok(resources.has(uri.href),'Unregistered schema resource: '+uri.href);
    let value=resources.get(uri.href);
    if(fragment){assert.ok(fragment.startsWith('/'),'Unknown schema anchor: '+fragment);for(const key of fragment.slice(1).split('/'))value=value?.[key.replaceAll('~1','/').replaceAll('~0','~')];}
    assert.notEqual(value,undefined,'Missing schema fragment: '+uri.href+'#'+fragment);
  }
}
const schemaDocuments=()=>fileInventory(path.join(root,'schema/v2')).map(file=>{
  const location=path.join(root,'schema/v2',file);
  return [pathToFileURL(location).href,JSON.parse(readFileSync(location))];
});

test('v2 JSON Schemas resolve their local references with retrieval and $id bases, keeping v1 separate',()=>{
  assertSchemaReferences(schemaDocuments());
  assert.equal(json('schema/v2/index.schema.json').properties.schemaVersion.const,2);
  assert.equal(json('schema/v2/browse-index.schema.json').properties.schemaVersion.const,2);
  assert.equal(json('schema/station.schema.json').properties.languageProfile,undefined);
  assert.equal(json('schema/discovery-station.schema.json').properties.languageProfile,undefined);
});

test('schema resource lookup rejects the legacy $id regression instead of guessing filesystem siblings',()=>{
  const documents=schemaDocuments(),station=documents.find(([uri])=>uri.endsWith('/station.schema.json'))[1];
  station.$id='https://github.com/actionanand/radio-bee-data/blob/main/schema/station.schema.json';
  assert.throws(()=>assertSchemaReferences(documents),/Unregistered schema resource/);
});

test('relative references respect nested $id resources instead of their enclosing filesystem directory',()=>{
  assertSchemaReferences([
    ['file:///local/schema/v2/root.json',{$id:'https://schemas.example/schema/v2/root.json',$defs:{nested:{$id:'nested/resource.json',$ref:'../leaf.json'}}}],
    ['file:///local/schema/v2/leaf.json',{$id:'https://schemas.example/schema/v2/leaf.json',type:'string'}],
  ]);
});

test('unreferenced v2 localization and artwork files never expand the exact production inventory',t=>{
  const temporary=fixture(t),extra=[
    'i18n/fr.json','i18n/en.json.bak','i18n/research/notes.txt',
    'assets/private.json','assets/logos/networks/orphan.png','assets/logos/stations/preview.svg',
    'assets/logos/networks/.gitkeep.bak',
  ];
  const knownLogo=readFileSync(path.join(temporary,'data/v2/assets/logos/networks/akashvani-radio.png'));
  for(const file of extra){const target=path.join(temporary,'data/v2',file);mkdirSync(path.dirname(target),{recursive:true});writeFileSync(target,file.endsWith('.png')?knownLogo:'unreviewed fixture content');}
  const dest=buildStatic(temporary,{requireV2:true,preserveV1:true});
  for(const file of extra)assert.ok(!existsSync(path.join(dest,'v2',file)),file);
  assert.deepEqual(fileInventory(dest),json('docs/stage15/published-files.json').files);
  assert.deepEqual(fileInventory(path.join(dest,'v2/i18n')),['en.json','sa.json','ta.json']);
  assert.deepEqual(v1BaselineErrors(temporary,'dist/v1'),[]);
});

test('legacy fixture publication also excludes unreferenced localization and artwork',t=>{
  const temporary=fixture(t);
  for(const file of ['i18n/fr.json','assets/logos/networks/orphan.png','assets/unreviewed.txt'])writeFileSync(path.join(temporary,'data/v1',file),'not approved');
  // The production CLI rejects extra v1 sources via its freeze guard. Even a
  // non-frozen legacy test build must not copy them into the publication.
  const dest=buildStatic(temporary);
  assert.deepEqual(v1BaselineErrors(temporary,'dist/v1'),[]);
  assert.deepEqual(fileInventory(dest),json('docs/stage15/published-files.json').files);
});

test('a referenced v2 station image resolves under v2 with identical bytes',t=>{
  const temporary=fixture(t),stationsFile=path.join(temporary,'data/v2/stations.json'),stations=JSON.parse(readFileSync(stationsFile));
  const logoPath='assets/logos/stations/approved-fixture.png',bytes=readFileSync(path.join(temporary,'data/v2/assets/logos/networks/akashvani-radio.png'));
  writeFileSync(path.join(temporary,'data/v2',logoPath),bytes);stations[0].logoPath=logoPath;writeFileSync(stationsFile,JSON.stringify(stations));
  const dest=buildStatic(temporary,{requireV2:true,preserveV1:true});
  const published=new URL(logoPath,'https://actionanand.github.io/radio-bee-data/v2/');
  assert.equal(published.pathname,'/radio-bee-data/v2/'+logoPath);
  assert.deepEqual(readFileSync(path.join(dest,'v2',logoPath)),bytes);
  assert.deepEqual(v1BaselineErrors(temporary,'dist/v1'),[]);
});

test('historical v2 placeholders cannot publish nonempty unreviewed content',t=>{
  const temporary=fixture(t),dest=path.join(temporary,'dist');mkdirSync(dest);writeFileSync(path.join(dest,'sentinel'),'keep');
  writeFileSync(path.join(temporary,'data/v2/assets/logos/stations/.gitkeep'),'unreviewed fixture content');
  assert.throws(()=>buildStatic(temporary,{requireV2:true,preserveV1:true}),/placeholder must be empty/);
  assert.equal(readFileSync(path.join(dest,'sentinel'),'utf8'),'keep');
});

const linkCases=[
  {relative:'data',directory:true},
  {relative:'data/v2',directory:true},
  {relative:'data/v2/i18n',directory:true},
  {relative:'data/v2/assets',directory:true},
  {relative:'data/v2/assets/logos/networks',directory:true},
  {relative:'data/v2/index.json'},
  {relative:'data/v2/stations.json'},
  {relative:'data/v2/i18n/en.json'},
  {relative:'data/v2/assets/logos/networks/akashvani-radio.png'},
  {relative:'data/v2/assets/logos/stations/.gitkeep'},
  {relative:'data/v2/i18n/unreviewed-link.json',inside:true},
  {relative:'data/v2/assets/unreviewed-cache/link',directory:true},
  {relative:'data/v2/assets/dangling.png',dangling:true},
  {relative:'data/v1/i18n/ta.json'},
];
for(const {relative,directory=false,inside=false,dangling=false}of linkCases)test('publication rejects source symlink at '+relative+' before replacing output',t=>{
  const temporary=fixture(t),source=path.join(temporary,relative),external=path.join(temporary,'outside-publication');
  if(existsSync(source))renameSync(source,external);
  else if(!dangling&&!inside){if(directory)mkdirSync(external);else writeFileSync(external,'unreviewed target');}
  mkdirSync(path.dirname(source),{recursive:true});
  symlinkSync(inside?path.join(temporary,'data/v2/i18n/en.json'):external,source,directory?'dir':'file');
  const dest=path.join(temporary,'dist');mkdirSync(dest);writeFileSync(path.join(dest,'sentinel'),'keep');
  assert.throws(()=>buildStatic(temporary,{requireV2:true,preserveV1:true}),/symlink/i);
  assert.equal(readFileSync(path.join(dest,'sentinel'),'utf8'),'keep');
  assert.deepEqual(fileInventory(dest),['sentinel']);
});
