import {readFileSync} from 'node:fs';
import {readCatalogue} from '../scripts/validate.mjs';
const read=name=>JSON.parse(readFileSync(new URL('../docs/stage13/'+name,import.meta.url)));
const hotfix=()=>JSON.parse(readFileSync(new URL('../docs/hotfix13/thoothukudi.json',import.meta.url)));

// v1 now preserves the genuine dated Stage 14 snapshot.
export function readStage14Catalogue(){return readCatalogue();}

// Reconstruct the dated 1.8.1 view by excluding Stage 14 additions. The new
// Stage 14 tests independently hash every original record in the live data.
export function readStage13HotfixCatalogue(){
 const data=readStage14Catalogue(),baseline=JSON.parse(readFileSync(new URL('../docs/stage14/baseline.json',import.meta.url)));
 for(const [key,ids]of Object.entries(baseline.ids))data[key]=data[key].filter(row=>ids.includes(row.id??row.code));
 data.index=structuredClone(baseline.index);data.i18n=structuredClone(baseline.i18n);
 return data;
}

// Keep dated Stage 13 assertions intact; Stage 14 checks the live quarantine.
export function readStage13Catalogue(){
 const data=readStage13HotfixCatalogue(),saved=hotfix(),id=saved.stationId;
 if(data.stations.some(s=>s.id===id)||data.discoveryStations.filter(s=>s.id===id).length!==1)
  throw Error('Expected the hotfix discovery-only Thoothukudi record');
 data.stations.splice(saved.previousStationIndex,0,structuredClone(saved.previousStationRecord));
 data.discoveryStations=data.discoveryStations.filter(s=>s.id!==id);
 data.stationMigrations.removed=data.stationMigrations.removed.filter(m=>m.oldId!==id);
 data.index=structuredClone(saved.previousIndex);
 return data;
}
export function readStage13Backlog(){
 const backlog=JSON.parse(readFileSync(new URL('../docs/research/station-backlog.json',import.meta.url)));
 backlog.stations=backlog.stations.filter(r=>r.station.id!==hotfix().stationId);
 return backlog;
}

// Stage 12's dated assertions still test its original catalogue view. Stage 13
// separately checks every current record, counts, and these restoration backups.
export function readStage12Catalogue(){
 const data=readStage13Catalogue(),promotions=read('promotions.json'),ids=new Set(promotions.map(p=>p.stationId));
 data.stations=data.stations.filter(s=>!ids.has(s.id));
 for(const p of [...promotions].sort((a,b)=>a.previousDiscoveryIndex-b.previousDiscoveryIndex))
  data.discoveryStations.splice(p.previousDiscoveryIndex,0,structuredClone(p.previousDiscoveryRecord));
 for(const p of promotions.filter(p=>p.previousMigrationRecord).sort((a,b)=>a.previousMigrationIndex-b.previousMigrationIndex))
  data.stationMigrations.removed.splice(p.previousMigrationIndex,0,structuredClone(p.previousMigrationRecord));
 data.index=read('baseline.json').index;
 return data;
}
