// Optional offline review command. Supply an already installed Ajv 8 package;
// never install dependencies or retrieve schema resources from the network.
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {parseArgs} from 'node:util';

const projectRoot=fileURLToPath(new URL('..',import.meta.url));
const hash=file=>createHash('sha256').update(readFileSync(file)).digest('hex');
export function validateV2JsonSchemas({root=projectRoot,validatorPackage,reviewedOn}) {
  if(!validatorPackage)throw Error('Supply --validator-package for an existing Ajv 8 installation; no installation is automatic.');
  const require=createRequire(path.resolve(validatorPackage));
  const {default:Ajv2020}=require('ajv/dist/2020.js');
  const addFormats=require('ajv-formats');
  const engineVersion=require('ajv/package.json').version;
  if(!engineVersion.startsWith('8.'))throw Error('Ajv 8 with Draft 2020-12 support is required');
  const ajv=new Ajv2020({strict:true,allowUnionTypes:true,allErrors:true,validateFormats:true});
  addFormats(ajv);
  const directory=path.join(root,'schema/v2');
  const schemas=readdirSync(directory).filter(file=>file.endsWith('.schema.json')).sort();
  for(const file of schemas){
    const location=path.join(directory,file),schema=JSON.parse(readFileSync(location));
    if(schema.$schema!=='https://json-schema.org/draft/2020-12/schema')throw Error('Wrong schema dialect: '+file);
    if(!ajv.validateSchema(schema))throw Error('Invalid schema '+file+': '+ajv.errorsText());
    ajv.addSchema(schema,pathToFileURL(location).href);
  }
  // Compile every resource, including definitions, using its retrieval URI.
  // Synchronous compilation has no loadSchema callback or HTTP fallback.
  for(const file of schemas)ajv.getSchema(pathToFileURL(path.join(directory,file)).href);
  const cases=[
    ['stations','stations.json','station.schema.json',true],
    ['discoveryStations','discovery-stations.json','discovery-station.schema.json',true],
    ['locations','locations.json','location.schema.json',true],
    ['networks','networks.json','network.schema.json',true],
    ['broadcasters','broadcasters.json','broadcaster.schema.json',true],
    ['browseIndex','browse-index.json','browse-index.schema.json',false],
    ['programmeThemes','programme-themes.json','programme-theme.schema.json',true],
    ['manifest','index.json','index.schema.json',false],
    ['stationMigrations','station-migrations.json','station-migrations.schema.json',false],
    ['streams','stations.json','stream.schema.json',true],
  ];
  const results=[],errors=[];
  for(const [name,file,schema,array]of cases){
    const document=JSON.parse(readFileSync(path.join(root,'data/v2',file)));
    const records=name==='streams'?document.flatMap(station=>station.streams):array?document:[document];
    if(!Array.isArray(records))throw Error('Expected array: '+file);
    const validate=ajv.getSchema(pathToFileURL(path.join(directory,schema)).href);
    for(const [index,record]of records.entries())if(!validate(record))errors.push({group:name,index,id:record?.id??null,errors:structuredClone(validate.errors)});
    results.push({group:name,file,schema,records:records.length});
  }
  return {reviewedOn,catalogVersion:'2.0.0',schemaVersion:2,draft:'2020-12',
    engine:{name:'Ajv',version:engineVersion,formatsVersion:require('ajv-formats/package.json').version},
    resolution:'Explicit local file retrieval URIs; $id-aware Ajv resource resolution; no network loader',
    externalNetworkRequests:0,formatAssertions:true,schemas:schemas.map(file=>({file,sha256:hash(path.join(directory,file))})),
    dataFiles:[...new Set(cases.map(([,file])=>file))].sort().map(file=>({file,sha256:hash(path.join(root,'data/v2',file))})),
    results,totalRecords:results.reduce((sum,row)=>sum+row.records,0),valid:errors.length===0,errors};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try {
    const {values}=parseArgs({options:{'validator-package':{type:'string'},'report':{type:'string'},'reviewed-on':{type:'string'}}});
    const report=validateV2JsonSchemas({validatorPackage:values['validator-package'],reviewedOn:values['reviewed-on']});
    if(values.report)writeFileSync(values.report,JSON.stringify(report,null,2)+'\n');
    console.log(`Draft 2020-12: ${report.totalRecords} records, ${report.schemas.length} local resources; ${report.errors.length} errors.`);
    if(!report.valid)process.exitCode=1;
  }catch(error){console.error(error.message);process.exitCode=1;}
}
