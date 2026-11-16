import test from 'node:test';
import assert from 'node:assert/strict';
import { readCatalogue } from '../scripts/validate.mjs';

const internalLanguage = /(?:usage rights|rights (?:are|is)|pending|unverified|verification|third-party listening permissions|independent checks|independent review|stream.{0,35}candidate|review-pending|permission-granted|needs-review|corroborating playlist|audio decoding)/i;

test('all published V2 station descriptions are reader-facing and omit internal review metadata', () => {
  const data = readCatalogue(undefined, 'v2');
  for (const station of data.stations) {
    assert.ok(station.about?.length >= 65, station.id + ': description is missing or too short');
    assert.doesNotMatch(station.about, internalLanguage, station.id);
  }
  assert.equal(data.stations.find(s => s.id === 'stage39-mugugan-songs-fm')?.about,
    'Mugugan Songs FM is a Tamil devotional music station featuring songs dedicated to Lord Murugan.');
  // Editorial cleanup does not modify technical eligibility or evidence.
  const mugugan = data.stations.find(s => s.id === 'stage39-mugugan-songs-fm');
  assert.equal(mugugan?.streams[0]?.directListening?.status, 'needs-review');
  assert.equal(mugugan?.streams[0]?.rightsStatus, 'unconfirmed');
});
