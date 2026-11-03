import test from 'node:test';
import assert from 'node:assert/strict';
import { readCatalogue, validateCatalogue, validHttps } from '../scripts/validate.mjs';
import { checkStream } from '../scripts/check-streams.mjs';

const data = readCatalogue();
const cloned = () => structuredClone(data);
test('initial catalogue passes every cross-reference and localization check', () => {
  assert.deepEqual(validateCatalogue(data), []);
  assert.ok(data.stations.length >= 75);
  assert.ok(data.networks.some(n => n.id === 'suryan-in'));
  assert.ok(data.networks.some(n => n.id === 'sooriyan-lk'));
  assert.notEqual(data.networks.find(n => n.id === 'suryan-in').id, data.networks.find(n => n.id === 'sooriyan-lk').id);
});
test('station ID duplicates are refused', () => {
  const d = cloned(); d.stations.push(structuredClone(d.stations[0]));
  assert.ok(validateCatalogue(d).some(x => x.includes('Duplicate stations')));
});
test('network and location hierarchy mismatches are refused', () => {
  const d = cloned(); d.stations[0].networkId = 'sooriyan-lk';
  assert.ok(validateCatalogue(d).some(x => x.includes('network/country mismatch')));
  const d2 = cloned(); d2.stations[0].localityId='lk-wp-colombo-colombo';
  assert.ok(validateCatalogue(d2).some(x => x.includes('locality/district mismatch') || x.includes('bad localityId')));
});
test('unreviewed streams cannot be labeled verified without evidence timestamp', () => {
  const d=cloned(); const s=d.stations.find(s => s.streams.length);
  s.streams[0].verificationStatus='verified';
  assert.ok(validateCatalogue(d).some(x => x.includes('verified stream needs timestamp')));
});
test('only HTTPS non-local stream URLs are accepted', () => {
  assert.ok(validHttps('https://radio.example.com:8000/stream?key=abc'));
  for(const url of ['http://radio.example.com/audio','file:///etc/passwd','https://127.0.0.1/','https://localhost/','https://example.local/live','https://user:pass@example.com/live'])
    assert.equal(validHttps(url),false,url);
});
test('locale key parity is enforced', () => {
  const d=cloned(); delete d.i18n.ta.catalog.networks;
  assert.ok(validateCatalogue(d).some(x=>x.includes('ta: missing catalog.networks')));
});
test('manifest counts cannot become stale', () => {
  const d=cloned(); d.index.counts.stations-=1;
  assert.ok(validateCatalogue(d).some(x=>x.includes('index count stations')));
});
test('health checker reports reachability but does not promote status', async () => {
  const requested=[];
  const fake = async (_url,opts) => {requested.push(opts.method); return {status:200,url:'https://radio.example.com/stream',headers:new Headers({'content-type':'audio/mpeg'}),body:null};};
  const value=await checkStream('https://radio.example.com/stream',{fetcher:fake,timeoutMs:100});
  assert.equal(value.outcome,'reachable');
  assert.deepEqual(requested,['HEAD']);
});
test('HEAD rejected falls back to ranged GET', async () => {
  const methods=[];
  const fake = async (_url,opts) => {methods.push(opts.method);return {status:opts.method==='HEAD'?405:206,url:'https://radio.example.com/stream',headers:new Headers(),body:null};};
  const r=await checkStream('https://radio.example.com/stream',{fetcher:fake,timeoutMs:100});
  assert.equal(r.outcome,'reachable');assert.deepEqual(methods,['HEAD','GET']);
});
