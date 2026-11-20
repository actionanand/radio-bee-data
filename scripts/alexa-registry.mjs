import {readFileSync, lstatSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const projectRoot=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const idPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const validSpokenName=name=>typeof name==='string' && /^[a-z0-9 .'-]+$/i.test(name) &&
  name===name.trim() && name.length>=3 && name.length<=100;
export const alexaRegistryFile='alexa/station-numbers.json';

export function readAlexaRegistry(root=projectRoot) {
  const file=path.join(root,alexaRegistryFile);
  if(!lstatSync(file).isFile())throw Error('Alexa registry must be a regular file');
  return JSON.parse(readFileSync(file,'utf8'));
}

export function alexaRegistryErrors(registry,data) {
  const errors=[];
  if(!registry || typeof registry!=='object' || Array.isArray(registry))return ['Alexa registry must be an object'];
  if(JSON.stringify(Object.keys(registry).sort())!==
    JSON.stringify(['schemaVersion','locale','supportedBroadcastLanguages','channels'].sort()))
    errors.push('Alexa registry has unexpected or missing root keys');
  if(registry.schemaVersion!==1 || registry.locale!=='en-IN' ||
    JSON.stringify(registry.supportedBroadcastLanguages)!==JSON.stringify(['ta','en']))
    errors.push('Alexa registry must use schema v1, en-IN voice and Tamil/English broadcasts');
  if(!Array.isArray(registry.channels)||!registry.channels.length)return [...errors,'Alexa channels must be a nonempty array'];
  const stations=new Map((data?.stations??[]).map(station=>[station.id,station]));
  const numbers=new Set(),ids=new Set(),spokenNames=new Map();
  let lastNumber=0;
  for(const [index,channel]of registry.channels.entries()){
    const prefix='Alexa channels['+index+']';
    if(!channel || typeof channel!=='object' || Array.isArray(channel)) {errors.push(prefix+' invalid');continue;}
    if(JSON.stringify(Object.keys(channel).sort())!==
      JSON.stringify(['number','stationId','spokenNames'].sort()))errors.push(prefix+' invalid fields');
    if(!Number.isSafeInteger(channel.number)||channel.number<1||channel.number>9999 ||
      channel.number<=lastNumber||numbers.has(channel.number))errors.push(prefix+' number must be unique and ascending');
    else lastNumber=channel.number;
    numbers.add(channel.number);
    if(typeof channel.stationId!=='string'||!idPattern.test(channel.stationId)||
      ids.has(channel.stationId))errors.push(prefix+' invalid or duplicate station ID');
    ids.add(channel.stationId);
    const station=stations.get(channel.stationId);
    if(!station)errors.push(prefix+' missing catalogue station '+channel.stationId);
    else if(!Array.isArray(station.broadcastLanguages)||!station.broadcastLanguages.length||
      station.broadcastLanguages.some(lang=>!['ta','en'].includes(lang)))
      errors.push(prefix+' station is not exclusively Tamil or English');
    if(!Array.isArray(channel.spokenNames)||!channel.spokenNames.length||
      channel.spokenNames.some(name=>!validSpokenName(name)))errors.push(prefix+' invalid spoken names');
    else for(const name of channel.spokenNames){
      const key=name.toLowerCase().replace(/\s+/g,' ');
      if(spokenNames.has(key))errors.push(prefix+' ambiguous spoken name '+name+' (channel '+spokenNames.get(key)+')');
      spokenNames.set(key,channel.number);
    }
  }
  for(const [number,id]of [[1,'stage29-tamil-kadavul-murugan-fm'],[2,'stage39-mugugan-songs-fm']]){
    if(registry.channels.find(x=>x?.number===number)?.stationId!==id)
      errors.push('Permanent Murugan channel '+number+' must remain '+id);
  }
  if(data?.homeStations?.stationIds){
    for(const id of data.homeStations.stationIds){
      const station=stations.get(id);
      if(station && station.broadcastLanguages.length && station.broadcastLanguages.every(lang=>['ta','en'].includes(lang)) && !ids.has(id))
        errors.push('Eligible home station is missing from Alexa channels: '+id);
    }
  }
  return errors;
}

export function validateAlexaRegistry(root=projectRoot,data){
  try{return alexaRegistryErrors(readAlexaRegistry(root),data);}
  catch(error){return ['Cannot load Alexa channel registry: '+error.message];}
}
