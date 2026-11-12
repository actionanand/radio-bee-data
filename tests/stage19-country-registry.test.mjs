import test from 'node:test';
import assert from 'node:assert/strict';
import {readCatalogue, validateCatalogue} from '../scripts/validate.mjs';

test('v2 manifest includes countries referenced by networks and locations even when there is no playable station',()=>{
  const d=readCatalogue(undefined,'v2');
  const countries=new Set(d.index.countries);
  assert.equal(d.index.catalogVersion,'2.7.1');
  assert.ok(!d.stations.some(station=>station.countryCode==='NZ'));
  assert.ok(d.networks.some(network=>network.countryCodes.includes('NZ')));
  assert.ok(d.locations.some(location=>location.countryCode==='NZ'));
  for(const network of d.networks)
    for(const country of network.countryCodes)
      assert.ok(countries.has(country),network.id+' references missing country '+country);
  for(const location of d.locations)
    assert.ok(countries.has(location.countryCode),location.id+' references missing country '+location.countryCode);
  for(const station of [...d.stations,...d.discoveryStations])
    assert.ok(countries.has(station.countryCode),station.id+' references missing country '+station.countryCode);
  assert.deepEqual(validateCatalogue(d,{version:'v2'}),[]);
});

test('v2 validator rejects a country registry omission even when no station is published there',()=>{
  const d=readCatalogue(undefined,'v2');
  d.index.countries=d.index.countries.filter(country=>country!=='NZ');
  assert.ok(validateCatalogue(d,{version:'v2'}).some(error=>error.includes('v2 manifest country inventory')));
});

test('country registry fix does not republish no-stream FM listings',()=>{
  const d=readCatalogue(undefined,'v2');
  assert.equal(d.stations.length,144);
  assert.equal(d.discoveryStations.length,0);
  assert.equal(d.stations.filter(station=>station.delivery==='fm').length,56);
  assert.ok(d.stations.every(station=>station.streams.length>0));
  assert.equal(d.index.counts.streams,148);
});
