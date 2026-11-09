import test from "node:test";
import assert from "node:assert/strict";
import { readCatalogue, validateCatalogue } from "../scripts/validate.mjs";
test("published discovery inventory reconciles regional metadata and worldwide trial candidates", () => {
  const d = readCatalogue();
  assert.equal(d.discoveryStations.length, 46);
  assert.equal(d.stations.length, 71);
  assert.equal(d.stations.flatMap((s) => s.streams).length, 74);
  const air = d.stations.find((s) => s.id === "air-nagercoil");
  assert.ok(air.aliases.includes("Kumari FM"));
  assert.equal(
    d.discoveryStations.find((s) => s.id === "suryan-nagercoil").frequencyMHz,
    null,
  );
  const hello = d.discoveryStations.find((s) => s.id === "hello-nagercoil");
  assert.equal(hello.availability, "review-pending");
  assert.equal(hello.frequencyMHz, null);
  assert.ok(hello.sourceIds.includes("hello-nagercoil-expansion-2025"));
  assert.ok(d.stations.every((s) => !s.notes?.includes("nullStage")));
  assert.deepEqual(validateCatalogue(d), []);
});
test("station aliases are validated from metadata rather than a client-maintained name list", () => {
  const d = readCatalogue();
  d.stations[0].aliases = [""];
  assert.ok(validateCatalogue(d).length);
});
