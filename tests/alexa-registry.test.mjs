import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readCatalogue} from '../scripts/validate.mjs';
import {readAlexaRegistry,alexaRegistryErrors} from '../scripts/alexa-registry.mjs';
import {buildStatic} from '../scripts/build-static.mjs';

const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const data=()=>readCatalogue(root,'v2');
const registry=()=>readAlexaRegistry(root);
test('Alexa registry publishes 21 stable channels, with Murugan fixed at 1 and 2',()=>{
  const r=registry(),d=data();
  assert.equal(r.locale,'en-IN');
  assert.deepEqual(r.supportedBroadcastLanguages,['ta','en']);
  assert.equal(r.channels.length,21);
  assert.deepEqual(r.channels.slice(0,2).map(c=>[c.number,c.stationId]),[
    [1,'stage29-tamil-kadavul-murugan-fm'],
    [2,'stage39-mugugan-songs-fm'],
  ]);
  assert.deepEqual(alexaRegistryErrors(r,d),[]);
  assert.ok(!r.channels.some(c=>c.stationId==='stage39-raja-fm-sri-lanka-zeno'));
  assert.ok(r.channels.every(c=>!('url' in c)&&!('streamUrl' in c)));
});
test('Alexa validator rejects duplicate channels, ambiguous names and ineligible broadcasts',()=>{
  const d=data(),r=registry();
  r.channels[1].number=1;
  assert.ok(alexaRegistryErrors(r,d).some(e=>e.includes('number')));
  r.channels[1].number=2;
  r.channels[1].spokenNames.push(r.channels[0].spokenNames[0]);
  assert.ok(alexaRegistryErrors(r,d).some(e=>e.includes('ambiguous')));
  r.channels[1].spokenNames.pop();
  r.channels[1].stationId='stage39-raja-fm-sri-lanka-zeno';
  assert.ok(alexaRegistryErrors(r,d).some(e=>e.includes('exclusively Tamil or English')));
});
test('Alexa JSON is available at the GitHub Pages publication root, not copied into web v1',()=>{
  // npm run build also executes this code. This test validates the allowlisted output.
  const dir=buildStatic(root,{requireV2:true,preserveV1:true});
  const output=path.join(dir,'alexa/station-numbers.json');
  assert.ok(existsSync(output));
  assert.equal(readFileSync(output,'utf8'),readFileSync(path.join(root,'alexa/station-numbers.json'),'utf8'));
  assert.ok(!existsSync(path.join(dir,'v1/alexa/station-numbers.json')));
});
