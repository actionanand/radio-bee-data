// Optional v2 display labels. Canonical names/IDs and playback never change here.
export function stationDisplayName(station, dictionaries, locale='en') {
  const label=dictionaries?.[locale]?.stationNames?.[station.id];
  return typeof label==='string'&&label.trim()?label:station.name;
}

export function stationNameErrors(data) {
  const errors=[],stations=new Map((data.stations??[]).map(station=>[station.id,station]));
  for(const locale of ['en','ta','sa']) {
    const names=data.i18n?.[locale]?.stationNames;
    if(names===undefined)continue; // Missing/partial dictionaries use canonical English.
    if(!names||typeof names!=='object'||Array.isArray(names)){errors.push(locale+': stationNames must be a dictionary');continue;}
    for(const [id,label]of Object.entries(names)) {
      const station=stations.get(id),fail=message=>errors.push(locale+': stationNames.'+id+': '+message);
      if(!station){fail('unknown or obsolete station ID');continue;}
      if(typeof label!=='string'||!label.trim()){fail('expected nonblank string');continue;}
      if(!label.isWellFormed()||/[\u0000-\u001f\u007f\ufffd]/u.test(label)||label!==label.normalize('NFC'))fail('invalid or non-NFC Unicode');
      if(label!==station.name){
        if(locale==='en')fail('English label must retain canonical name');
        if(locale==='ta'&&(!/\p{Script=Tamil}/u.test(label)||/\p{Script=Devanagari}/u.test(label)))fail('expected Tamil script or exact English fallback');
        if(locale==='sa'&&(!/\p{Script=Devanagari}/u.test(label)||/\p{Script=Tamil}/u.test(label)))fail('expected Devanagari or exact English fallback');
      }
      const numbers=value=>value.match(/\d+(?:\.\d+)?/g)??[];
      if(JSON.stringify(numbers(label))!==JSON.stringify(numbers(station.name)))fail('numerical identifiers changed');
      const brands=station.name.match(/(?<![A-Za-z0-9_.])(?=[A-Za-z0-9]*\d)(?=[A-Za-z0-9]*[A-Za-z])[A-Za-z0-9]+\b/g)??[];
      for(const brand of brands)if(!label.includes(brand))fail('alphanumeric brand identifier changed: '+brand);
    }
  }
  return errors;
}

// JSON.parse alone silently discards duplicate keys. Inspect valid JSON tokens
// before returning the object, decoding escaped keys before comparing them.
export function parseLocaleJson(text,label='locale') {
  const value=JSON.parse(text),tokens=text.match(/"(?:\\[\s\S]|[^"\\])*"|[{}\[\]:,]|[^\s"{}\[\]:,]+/g)??[];
  let index=0;
  const visit=path=>{
    const token=tokens[index++];
    if(token==='{'){
      const keys=new Set();
      while(tokens[index]!=='}'){
        const key=JSON.parse(tokens[index++]);
        if(keys.has(key))throw Error(label+': duplicate JSON key '+[...path,key].join('.'));
        keys.add(key);index++; // colon; syntax has already been checked by JSON.parse.
        visit([...path,key]);if(tokens[index]===',')index++;
      }
      index++;
    }else if(token==='['){
      while(tokens[index]!==']'){visit(path);if(tokens[index]===',')index++;}
      index++;
    }
  };
  visit([]);return value;
}
