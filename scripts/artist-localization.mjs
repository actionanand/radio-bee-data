import {stationNameErrors} from './station-localization.mjs';
export function artistNameErrors(data) {
  const adapted={stations:data.artists??[],i18n:Object.fromEntries(Object.entries(data.i18n??{}).map(([locale,value])=>[locale,{stationNames:value.artistNames}]))};
  const errors=stationNameErrors(adapted).map(e=>e.replaceAll('stationNames','artistNames').replaceAll('station ID','artist ID'));
  for(const locale of ['ta','sa']) {
    const names=data.i18n?.[locale]?.artistNames;
    if(names===undefined){
      const [,minor,patch]=(data.index?.catalogVersion??'2.0.0').split('.').map(Number);
      if(minor>8||(minor===8&&patch>=6))errors.push(locale+': missing artistNames dictionary');
      continue; // Older catalogue versions remain valid.
    }
    for(const artist of data.artists??[])if(!Object.hasOwn(names??{},artist.id))errors.push(`${locale}: missing artistNames.${artist.id}`);
  }
  return errors;
}
