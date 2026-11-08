import test from "node:test";
import assert from "node:assert/strict";
import {
  readFileSync,
  cpSync,
  mkdtempSync,
  mkdirSync,
  rmSync,
  existsSync,
} from "node:fs";
import path from "node:path";
import os from "node:os";
import { readCatalogue, validateCatalogue } from "../scripts/validate.mjs";
import { buildStatic } from "../scripts/build-static.mjs";
const get = () => readCatalogue();
test("discovery publication contains the nine local services and accurate separate counts", () => {
  const d = get();
  assert.deepEqual(validateCatalogue(d), []);
  for (const id of [
    "tamilosai-nagercoil",
    "isai-murasu-nagercoil",
    "christian-samy-fm",
    "annai-kuzhithurai",
    "asr-kanyakumari",
    "kumari-tamil-kanyakumari",
    "iskcon-nagercoil",
    "suryan-nagercoil",
    "hello-nagercoil",
  ])
    assert.ok(
      [...d.stations, ...d.discoveryStations].some(
        (s) => s.id === id && s.districtId === "in-tn-kanyakumari",
      ),
      id,
    );
  assert.equal(
    d.index.counts.discoverableStations,
    d.stations.length + d.discoveryStations.length,
  );
  assert.equal(d.index.counts.stationsWithStreamCandidates, d.stations.length);
  assert.equal(d.index.counts.productionEligibleStations, 0);
  assert.ok(d.discoveryStations.every((s) => !Object.hasOwn(s, "streams")));
});
test("discovery rejects research fields, unsafe website links, aliases and stale counts", () => {
  for (const mutate of [
    (d) => delete d.stations[0].streams,
    (d) => (d.discoveryStations[0].streams = []),
    (d) => (d.discoveryStations[0].url = "https://example.org/live"),
    (d) => (d.discoveryStations[0].website = "https://foo.localhost/"),
    (d) => (d.discoveryStations[0].website = "https://example.org/audio.mp3"),
    (d) => (d.discoveryStations[0].sourceIds = []),
    (d) => d.index.counts.discoverableStations++,
  ]) {
    const d = get();
    mutate(d);
    assert.ok(validateCatalogue(d).length);
  }
  const d = get();
  Object.assign(d.discoveryStations[0], {
    networkId: "akashvani",
    name: "Kumari FM",
    aliases: [],
  });
  assert.ok(
    validateCatalogue(d).some((e) => e.includes("duplicate programme alias")),
  );
  const schema = JSON.parse(
    readFileSync(new URL("../schema/station.schema.json", import.meta.url)),
  );
  assert.equal(schema.properties.streams.minItems, 1);
  const invalid = get();
  invalid.stations[0].streams = [];
  assert.ok(
    validateCatalogue(invalid).some((e) => e.includes("requires at least one")),
  );
});
test("programme identities stay separate and Sooriyan alternatives remain exact", () => {
  const d = get(),
    historical = JSON.parse(
      readFileSync(new URL("../docs/stage6/stations.json", import.meta.url)),
    );
  const s = d.stations.find((s) => s.id === "sooriyan-srilanka"),
    old = historical.stations.find((s) => s.stationId === "sooriyan-srilanka");
  assert.deepEqual(s.streams, old.existingAndAddedCandidates);
  assert.equal(
    d.discoveryStations.some(
      (s) => s.id === "air-nagercoil" || s.id === "sooriyan-srilanka",
    ),
    false,
  );
  assert.equal(
    d.discoveryStations.find((s) => s.id === "christian-samy-fm").networkId,
    "asr-digital",
  );
  assert.deepEqual(
    d.discoveryStations.find((s) => s.id === "isai-murasu-nagercoil").genres,
    ["talk", "general"],
  );
  assert.equal(
    d.discoveryStations.find((s) => s.id === "suryan-nagercoil").networkId,
    "suryan-in",
  );
  assert.equal(
    d.discoveryStations.find((s) => s.id === "hello-nagercoil").frequencyMHz,
    null,
  );
});
test("metadata-only restoration preserves ID and null playback removal until actual stream restoration", () => {
  const d = get(),
    row = d.discoveryStations.find((s) => s.id === "asr-kanyakumari");
  assert.ok(
    d.stationMigrations.removed.some(
      (m) => m.oldId === row.id && m.canonicalId === null,
    ),
  );
  const { aliases, availability, reviewedOn, websiteKind, ...metadata } = row;
  void aliases;
  void availability;
  void reviewedOn;
  void websiteKind;
  d.discoveryStations = d.discoveryStations.filter((s) => s.id !== row.id);
  d.stations.push({
    ...metadata,
    streams: [
      {
        id: "unit-restoration",
        url: "https://fixture.example/live",
        format: "mp3",
        verificationStatus: "unverified",
        lastVerifiedAt: null,
        sourceId: metadata.sourceIds[0],
        rightsStatus: "unconfirmed",
      },
    ],
  });
  d.index.counts.discoveryStations--;
  d.index.counts.stations++;
  d.index.counts.streams++;
  d.index.counts.stationsWithStreamCandidates++;
  assert.ok(validateCatalogue(d).some((e) => e.includes("removed station ID")));
  d.stationMigrations.removed = d.stationMigrations.removed.filter(
    (m) => m.oldId !== row.id,
  );
  assert.deepEqual(validateCatalogue(d), []);
});
test("static allowlist publishes only the reviewed discovery API and keeps research excluded", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "radio-discovery-"));
  try {
    mkdirSync(path.join(root, "data"));
    cpSync(new URL("../data/v1", import.meta.url), path.join(root, "data/v1"), {
      recursive: true,
    });
    mkdirSync(path.join(root, "docs"));
    cpSync(
      new URL("../docs/stage9", import.meta.url),
      path.join(root, "docs/stage9"),
      { recursive: true },
    );
    const dest = buildStatic(root);
    assert.ok(existsSync(path.join(dest, "v1/discovery-stations.json")));
    assert.equal(existsSync(path.join(dest, "docs")), false);
    assert.equal(existsSync(path.join(dest, "v1/research")), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
