import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readCatalogue, validateCatalogue } from './validate.mjs';
export function buildStatic(root=path.resolve(fileURLToPath(new URL('..',import.meta.url)))) {
const errors=validateCatalogue(readCatalogue(root),{root});
if(errors.length) throw new Error(`Cannot publish invalid catalogue:\n${errors.join('\n')}`);
const dest=path.join(root,'dist');
rmSync(dest,{recursive:true,force:true}); mkdirSync(dest,{recursive:true});
// Explicit publication boundary: no arbitrary research/backlog files are copied.
mkdirSync(path.join(dest,'v1'),{recursive:true});
for(const file of ['index.json','stations.json','networks.json','sources.json','locations.json','languages.json','categories.json'])
  cpSync(path.join(root,'data/v1',file),path.join(dest,'v1',file));
if(existsSync(path.join(root,'data/v1/station-migrations.json')))cpSync(path.join(root,'data/v1/station-migrations.json'),path.join(dest,'v1/station-migrations.json'));
for(const dir of ['i18n','assets'])cpSync(path.join(root,'data/v1',dir),path.join(dest,'v1',dir),{recursive:true});
writeFileSync(path.join(dest,'index.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RadioBee data</title><main><h1>RadioBee catalogue</h1><p>Static, versioned Internet radio candidates. Technical verification does not establish permission for RadioBee playback; use conditions require separate review.</p><p><a href="./v1/index.json">Catalogue manifest (v1)</a></p><p><a href="./v1/stations.json">Stations</a> · <a href="./v1/networks.json">Networks</a> · <a href="./v1/locations.json">Locations</a></p></main></html>\n`);
console.log('Built dist/v1 and dist/index.html for static hosting.');
return dest;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url))buildStatic();
