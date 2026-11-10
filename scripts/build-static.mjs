import {copyFileSync,constants,existsSync,lstatSync,mkdirSync,rmSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {readCatalogue,validateCatalogue} from './validate.mjs';
import {fileInventory,v1BaselineErrors} from './versioned-publication.mjs';
import {inspectLogo} from './logo-assets.mjs';

const localizationFiles=['i18n/en.json','i18n/ta.json','i18n/sa.json'];
// Explicit legacy placeholders, retained in both versions; never glob assets/.
const historicalPlaceholders=['assets/logos/networks/.gitkeep','assets/logos/stations/.gitkeep'];
function publicationFiles(root,version,data) {
  const files=['index.json','stations.json','networks.json','sources.json','locations.json','languages.json','categories.json',...localizationFiles,...historicalPlaceholders];
  for(const [key,file]of [['stationMigrations','station-migrations.json'],['discoveryStations','discovery-stations.json'],...(version==='v2'?[['broadcasters','broadcasters.json'],['programmeThemes','programme-themes.json'],['browseIndex','browse-index.json']]:[])])if(data.index.files[key])files.push(file);
  for(const row of [...data.networks,...data.stations,...(data.discoveryStations??[])])if(Object.hasOwn(row,'logoPath'))files.push(inspectLogo(root,row.logoPath,version).path);
  return [...new Set(files)].sort();
}

const projectRoot=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
export function buildStatic(root=projectRoot,{requireV2=false,preserveV1=false}={}) {
  const versions=['v1','v2'].filter(version=>version==='v1'||requireV2||existsSync(path.join(root,'data',version)));
  if(lstatSync(path.join(root,'data')).isSymbolicLink())throw Error('Symlink at data publication parent');
  // Validate every version before replacing any previously generated output.
  // Reject links (including dangling links) anywhere before reading JSON through them.
  const snapshots=versions.map(version=>({version,sourceFiles:fileInventory(path.join(root,'data',version)),data:readCatalogue(root,version)}));
  const errors=snapshots.flatMap(({version,data})=>validateCatalogue(data,{root,version}).map(error=>version+': '+error));
  if(preserveV1)errors.push(...v1BaselineErrors(root));
  if(errors.length)throw Error('Cannot publish invalid catalogue:\n'+errors.join('\n'));
  const plans=snapshots.map(({version,data,sourceFiles})=>{
    const files=publicationFiles(root,version,data);
    for(const file of files)if(!sourceFiles.includes(file))throw Error('Missing allowlisted publication file: '+version+'/'+file);
    for(const file of historicalPlaceholders)if(lstatSync(path.join(root,'data',version,file)).size!==0)throw Error('Historical placeholder must be empty: '+version+'/'+file);
    return {version,files};
  });
  const dest=path.resolve(root,'dist');
  rmSync(dest,{recursive:true,force:true});mkdirSync(dest,{recursive:true});
  for(const {version,files}of plans) {
    const base=path.join(root,'data',version),output=path.join(dest,version);
    mkdirSync(output,{recursive:true});
    for(const file of files) {
      const source=path.join(base,file),target=path.join(output,file);
      // A file-only copy never recreates directory links or preserves special entries.
      if(!lstatSync(source).isFile())throw Error('Publication source is not a regular file: '+source);
      mkdirSync(path.dirname(target),{recursive:true});
      copyFileSync(source,target,constants.COPYFILE_EXCL);
    }
  }
  writeFileSync(path.join(dest,'index.html'),'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RadioBee data</title><main><h1>RadioBee catalogue</h1><p>Candidate URLs do not establish playback availability or listening, recording or redistribution permission.</p><p><a href="./v1/index.json">Legacy API v1 — catalogue 1.9.0</a></p><p><a href="./v2/index.json">Metadata and navigation API v2 — catalogue 2.0.0</a></p></main></html>\n');
  if(preserveV1){const errors=v1BaselineErrors(root,'dist/v1');if(errors.length)throw Error(errors.join('\n'));}
  const expected=['index.html',...plans.flatMap(({version,files})=>files.map(file=>version+'/'+file))].sort();
  if(JSON.stringify(fileInventory(dest))!==JSON.stringify(expected))throw Error('Generated publication inventory differs from allowlists');
  console.log('Built '+versions.map(v=>'dist/'+v).join(' and ')+' with static publication allowlists.');
  return dest;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildStatic(projectRoot,{requireV2:true,preserveV1:true});
