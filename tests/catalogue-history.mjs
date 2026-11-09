import {readFileSync} from 'node:fs';
import {readCatalogue} from '../scripts/validate.mjs';
const read=name=>JSON.parse(readFileSync(new URL('../docs/stage13/'+name,import.meta.url)));

// Stage 12's dated assertions still test its original catalogue view. Stage 13
// separately checks every current record, counts, and these restoration backups.
export function readStage12Catalogue(){
 const data=readCatalogue(),promotions=read('promotions.json'),ids=new Set(promotions.map(p=>p.stationId));
 data.stations=data.stations.filter(s=>!ids.has(s.id));
 for(const p of [...promotions].sort((a,b)=>a.previousDiscoveryIndex-b.previousDiscoveryIndex))
  data.discoveryStations.splice(p.previousDiscoveryIndex,0,structuredClone(p.previousDiscoveryRecord));
 for(const p of promotions.filter(p=>p.previousMigrationRecord).sort((a,b)=>a.previousMigrationIndex-b.previousMigrationIndex))
  data.stationMigrations.removed.splice(p.previousMigrationIndex,0,structuredClone(p.previousMigrationRecord));
 data.index=read('baseline.json').index;
 return data;
}
