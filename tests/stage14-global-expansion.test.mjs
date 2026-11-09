import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,mkdirSync,cpSync,writeFileSync,existsSync,rmSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';import os from 'node:os';
import {readCatalogue,validateCatalogue,validHttps} from '../scripts/validate.mjs';
import {buildStatic} from '../scripts/build-static.mjs';
import {normalizedName} from '../scripts/research-tamil-expansion.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const baseline=read('docs/stage14/baseline.json'),rows=read('docs/stage14/stations.json'),summary=read('docs/stage14/summary.json');
const hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
test('Stage 14 preserves every 1.8.1 record, stream, permission, network and historical migration',()=>{
 const d=readCatalogue();assert.equal(baseline.baseCommit,'9191c539a991c769887b5427484126d657c01851');
 for(const [key,records]of Object.entries(baseline.hashes))for(const[id,expected]of Object.entries(records))assert.equal(hash(d[key].find(r=>(r.id??r.code)===id)),expected,key+'/'+id);
 assert.equal(hash(d.stationMigrations),baseline.migrationHash);
 for(const [locale,old]of Object.entries(baseline.i18n))for(const [section,values]of Object.entries(old))for(const[key,value]of Object.entries(values))assert.equal(d.i18n[locale][section][key],value,locale+'/'+section+'/'+key);
});
test('Stage 14 manifest reconciles 25 new identities, 71 stream stations and 74 unique URLs',()=>{
 const d=readCatalogue(),all=[...d.stations,...d.discoveryStations],streams=d.stations.flatMap(s=>s.streams);
 assert.equal(d.index.catalogVersion,'1.9.0');assert.equal(d.index.publishedOn,'2026-11-09');assert.equal(rows.length,25);assert.equal(d.stations.length,71);assert.equal(d.discoveryStations.length,46);assert.equal(all.length,117);assert.equal(d.networks.length,71);assert.equal(d.locations.length,117);assert.equal(d.index.countries.length,20);
 assert.equal(new Set(all.map(s=>s.id)).size,117);assert.equal(new Set(streams.map(x=>x.id)).size,74);assert.equal(new Set(streams.map(x=>new URL(x.url).href)).size,74);
 for(const [key,value]of Object.entries(summary.after))assert.equal(key==='countries'?d.index.countries.length:d.index.counts[key],value,key);
 assert.equal(summary.promotions,0);assert.equal(summary.alternativeStreamsAdded,0);assert.equal(summary.newStationIdentities,25);assert.deepEqual(validateCatalogue(d),[]);
});
test('each Stage 14 trial has independent publisher mapping and complete decoder evidence without permission promotion',()=>{
 const d=readCatalogue(),checks=read('docs/stage14/technical-checks.json').results,programmes=new Set();
 for(const r of rows){const s=d.stations.find(s=>s.id===r.id),x=s.streams[0],check=checks.findLast(c=>c.id===r.id);
 assert.ok(!baseline.ids.stations.includes(s.id)&&!baseline.ids.discoveryStations.includes(s.id));assert.equal(r.publication,'unverified-trial');assert.equal(s.streams.length,1);assert.equal(x.url,r.url);assert.equal(x.sourceId,r.sourceId);assert.ok(s.sourceIds.includes(r.sourceId));assert.equal(d.sources.find(src=>src.id===r.sourceId).url,r.sourceUrl);assert.ok(r.evidenceLinks.every(validHttps));
 const key=normalizedName(s.networkId)+'|'+normalizedName(r.programme);assert.ok(!programmes.has(key));programmes.add(key);
 assert.equal(check.requestUrl,x.url);assert.ok([200,206].includes(check.httpStatus));assert.equal(check.sampleDecodeResult,'decoded');assert.equal(check.decoding.exitCode,0);assert.equal(check.decoding.completeTwoSeconds,true);assert.equal(check.decoding.pcmBytes,32000);assert.ok(check.sampledBytes<=131072);assert.equal(check.tls,'validated');assert.equal(x.format,check.format);assert.equal(x.format==='hls'?'aac':x.format,check.codec);
 assert.ok(validHttps(x.url));assert.ok(!/zeno|surfernetwork|2e8cfad789dc692d/.test(x.url));assert.equal(x.verificationStatus,'unverified');assert.equal(x.lastVerifiedAt,null);assert.equal(x.rightsStatus,'unconfirmed');assert.equal(x.directListening.status,'needs-review');assert.equal(x.directListening.recording,'unconfirmed');assert.equal(x.directListening.redistribution,'unconfirmed');assert.equal(s.logoPath,undefined);assert.equal(d.networks.find(n=>n.id===s.networkId).logoPath,undefined);
 }
 assert.equal(d.index.counts.verifiedStreams,1);assert.equal(d.index.counts.productionEligibleStations,0);
});
test('multilingual services and distinct 4EB programmes retain exact player and schedule provenance',()=>{
 const d=readCatalogue(),fm=d.stations.find(s=>s.id==='4eb-fm-au'),global=d.stations.find(s=>s.id==='4eb-global-au');assert.equal(fm.networkId,global.networkId);assert.notEqual(fm.streams[0].url,global.streams[0].url);assert.equal(fm.frequencyMHz,98.1);assert.equal(global.frequencyMHz,null);assert.equal(global.delivery,'online');
 assert.ok(rows.find(r=>r.id===fm.id).sourceUrl.endsWith('station=1'));assert.ok(rows.find(r=>r.id===global.id).sourceUrl.endsWith('station=2'));assert.match(global.notes,/separate Tamil Oli Global schedule/);
 for(const id of ['mauradio-mu','live-fm-bh','3zzz-au','4eb-fm-au','4eb-global-au','5ebi-au','radio-plus-indiz-mu']){const s=d.stations.find(s=>s.id===id);assert.ok(s.broadcastLanguages.includes('ta'));assert.ok(s.broadcastLanguages.length>1);assert.match(s.notes,/multilingual/i);}
 assert.equal(d.stations.find(s=>s.id==='5ebi-au').streams[0].format,'aac');assert.equal(d.stations.find(s=>s.id==='suno-tamil-qa').frequencyMHz,null);assert.match(d.stations.find(s=>s.id==='suno-tamil-qa').streams[0].url,/RADIO_SUNO_TAMIL_S01AAC/);
 assert.equal(d.stations.filter(s=>s.networkId==='time-fm').length,1);assert.equal(d.stations.filter(s=>s.networkId==='tamil-christian-media').length,1);
});
test('new geography and language references preserve locale parity without fabricated local transmitters',()=>{
 const d=readCatalogue();for(const code of summary.newCountries){assert.ok(d.index.countries.includes(code));assert.ok(d.locations.some(l=>l.countryCode===code&&l.type==='country'));for(const locale of ['en','ta','sa'])assert.ok(d.i18n[locale].countries[code]);}
 for(const s of d.stations.filter(s=>rows.some(r=>r.id===s.id))){assert.equal(s.localityId,null);assert.equal(s.districtId,null);for(const code of s.broadcastLanguages)assert.ok(d.languages.some(l=>l.code===code));if(s.delivery==='online')assert.equal(s.frequencyMHz,null);}
 for(const code of ['fr','ar','mfe','bho'])assert.ok(d.languages.some(l=>l.code===code));assert.deepEqual(Object.keys(d.i18n.en.countries).sort(),Object.keys(d.i18n.ta.countries).sort());assert.deepEqual(Object.keys(d.i18n.en.countries).sort(),Object.keys(d.i18n.sa.countries).sort());
});
test('all 46 discovery records and historical backlog remain consistent with the Thoothukudi quarantine',()=>{
 const d=readCatalogue(),review=read('docs/stage14/discovery-review.json'),backlog=read('docs/research/station-backlog.json'),hotfix=read('docs/hotfix13/thoothukudi.json');assert.equal(review.stations.length,46);assert.deepEqual(review.stations.map(r=>r.stationId).sort(),d.discoveryStations.map(s=>s.id).sort());assert.ok(review.stations.every(r=>r.promoted===false));assert.deepEqual(read('docs/stage14/promotions.json'),[]);
 const active=new Set(d.stations.map(s=>s.id));assert.ok(d.stationMigrations.removed.every(r=>!active.has(r.oldId)));assert.ok(backlog.stations.every(r=>!active.has(r.station.id)));assert.ok(d.discoveryStations.every(s=>!active.has(s.id)));assert.ok(!active.has('air-thoothukudi'));assert.equal(d.discoveryStations.find(s=>s.id==='air-thoothukudi').name,'Akashvani Thoothukudi');assert.ok(!JSON.stringify(d.stations).includes(hotfix.failingUrl));
});
test('research reports distinguish decoding, observable browser media, UI-only indications and rights',()=>{
 const browser=read('docs/stage14/browser-checks.json'),checks=read('docs/stage14/technical-checks.json').results,rights=read('docs/stage14/rights-review.json');assert.equal(browser.results.length,25);assert.equal(browser.baselineUserChromeConfirmed.length,11);assert.equal(new Set(checks.map(c=>c.requestUrl)).size,26);assert.equal(checks.length,27);assert.equal(rights.stations.length,25);assert.ok(rights.stations.every(r=>r.rightsStatus==='unconfirmed'&&r.directListening==='needs-review'));
 assert.equal(browser.results.filter(r=>r.result==='media-clock-over-60s-with-pause-restart').length,1);assert.equal(browser.results.find(r=>r.stationId==='sweety-fm-in').mediaReadyState,4);assert.equal(browser.results.find(r=>r.stationId==='theophony-tamil-in').mediaClockSeconds,32.31118);assert.equal(browser.results.find(r=>r.stationId==='otran-vaanoli-ie').mediaClockSeconds,null);assert.ok(browser.results.every(r=>r.humanAudibleConfirmation===false));
 assert.equal(read('docs/stage14/lead-inventory.json').stations.length,200);assert.equal(read('docs/stage14/coverage.json').countryScope,27);assert.ok(!rows.some(r=>r.id==='vanakkam-reunion-re'));assert.equal(read('docs/stage14/held-sources.json').decodedButHeld.length,1);
 for(const file of ['stations.json','technical-checks.json','publisher-review.json','lead-inventory.json','alternatives.json'])assert.doesNotMatch(readFileSync(new URL('../docs/stage14/'+file,import.meta.url),'utf8'),/eyJ[a-zA-Z0-9_-]+\.eyJ|[?&](?:zt|zs|access_token|auth_token)=|BEGIN PRIVATE KEY|sentryDsn/);
});
test('Stage 14 evidence and directory leads stay outside the static publication allowlist',()=>{
 const root=mkdtempSync(path.join(os.tmpdir(),'radiobee-stage14-'));
 try{mkdirSync(path.join(root,'data'));cpSync(new URL('../data/v1',import.meta.url),path.join(root,'data/v1'),{recursive:true});mkdirSync(path.join(root,'docs/stage14'),{recursive:true});writeFileSync(path.join(root,'docs/stage14/lead-inventory.json'),'{}');writeFileSync(path.join(root,'data/v1/stage14.json'),'{}');const dest=buildStatic(root);assert.equal(existsSync(path.join(dest,'docs')),false);assert.equal(existsSync(path.join(dest,'v1/stage14.json')),false);assert.equal(JSON.parse(readFileSync(path.join(dest,'v1/stations.json'))).length,71);}finally{rmSync(root,{recursive:true,force:true});}
});
