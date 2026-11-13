import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalogue,validateCatalogue} from '../scripts/validate.mjs';
import {buildStatic} from '../scripts/build-static.mjs';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const wanted=["stage29-tamil-kadavul-murugan-fm","air-nagercoil","suryan-chennai","air-chennai-rainbow","sooriyan-srilanka","shakthi-srilanka","oli-968-sg","ibc-tamil-uk","tamil-894-ae","american-tamil-radio-us","stage29-100-love-radio","stage29-100-new-songs","stage29-100-sad-songs"];
const names=["Tamil Kadavul Murugan","Akashvani Nagercoil","Suryan FM Chennai","Akashvani FM Rainbow Chennai","Sooriyan FM Sri Lanka","Shakthi FM Sri Lanka","OLI 968","IBC Tamil Radio","89.4 Tamil FM","American Tamil Radio","100% Love Radio","100% New Songs","100% Sad Songs"];

test('Home contains exactly the 13 requested stations in editorial order',()=>{
  const catalogue=readCatalogue(root,'v2');
  const home=catalogue.homeStations;
  assert.equal(home.schemaVersion,2);
  assert.equal(home.count,13);
  assert.deepEqual(home.stationIds,wanted);
  assert.equal(home.stationIds[0],'stage29-tamil-kadavul-murugan-fm');
  const byId=new Map(catalogue.stations.map(s=>[s.id,s]));
  assert.deepEqual(home.stationIds.map(id=>byId.get(id)?.name),names);
  assert.ok(home.stationIds.every(id=>byId.get(id).streams.length>0));
  assert.ok(!home.stationIds.includes('minnal-my'));
  assert.ok(!home.stationIds.includes('slbc-tamil-national-service'));
  assert.equal(catalogue.stations.length,240,'other stations must remain in catalogue');
  assert.deepEqual(validateCatalogue(catalogue,{root,version:'v2'}),[]);
});

test('Home selection rejects unknown and duplicate IDs',()=>{
  const catalogue=readCatalogue(root,'v2');
  for(const bad of ['unknown-station',catalogue.homeStations.stationIds[0]]) {
    const value={...catalogue,homeStations:{...catalogue.homeStations,stationIds:[...catalogue.homeStations.stationIds.slice(0,-1),bad]}};
    assert.ok(validateCatalogue(value,{root,version:'v2'}).some(message=>message.includes('home-stations')));
  }
});

test('Home selection is included in the allowlisted v2 public build',()=>{
  const published=buildStatic(root,{requireV2:true,preserveV1:true});
  const file='v2/home-stations.json';
  assert.deepEqual(
    JSON.parse(readFileSync(path.join(published,file),'utf8')),
    JSON.parse(readFileSync(path.join(root,'data',file),'utf8')),
  );
});
