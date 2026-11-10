import {readFileSync,readdirSync,existsSync,lstatSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';

export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
export function fileInventory(directory) {
  const walk=(dir,prefix='')=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
    const name=prefix+entry.name;
    if(entry.isSymbolicLink())throw Error('Symlink in published tree: '+name);
    if(entry.isDirectory())return walk(path.join(dir,entry.name),name+'/');
    if(!entry.isFile())throw Error('Non-regular file in published tree: '+name);
    return [name];
  });
  const stat=lstatSync(directory);
  if(stat.isSymbolicLink())throw Error('Symlink at publication root: '+directory);
  if(!stat.isDirectory())throw Error('Publication root is not a directory: '+directory);
  return walk(directory).sort();
}

// Freeze the approved legacy surface, including localization and artwork bytes.
// Read this independent evidence file, never derive expected hashes from current data.
export function v1BaselineErrors(root,subdirectory='data/v1') {
  try {
    const evidence=path.join(root,'docs/stage15/v1-production-baseline.json');
    if(!existsSync(evidence))return ['v1 production baseline evidence is missing'];
    const baseline=JSON.parse(readFileSync(evidence,'utf8')),base=path.join(root,subdirectory),errors=[];
    if(baseline.catalogVersion!=='1.9.0'||baseline.schemaVersion!==1||baseline.baseCommit!=='d32b32c703256e042aa4b2f17dd5823528a8fa59')errors.push('Invalid v1 production baseline identity');
    const files=fileInventory(base);
    if(JSON.stringify(files)!==JSON.stringify(Object.keys(baseline.files).sort()))errors.push('v1 file inventory differs from production baseline');
    for(const [file,expected]of Object.entries(baseline.files))if(!files.includes(file)||sha256(readFileSync(path.join(base,file)))!==expected)errors.push('v1 bytes differ from production baseline: '+file);
    return errors;
  }catch(error){return ['Cannot verify v1 production baseline: '+error.message];}
}
