# Integrating this catalogue into the RadioBee Angular + Capacitor client

Use this as a reference for implementing client-side `RadioDataService`. This repo does **not** modify the client application.

## Proposed data base URL

For GitHub Pages, after the data repository is deployed:

```text
https://actionanand.github.io/radio-bee-data/v1/
```

The client repo remains independent: its web build on `main-github` and Android build on `main-android` should both fetch the same static JSON. Use environment-based base URLs with an optional offline bundled snapshot, not a hard-coded stream API key.

## Loading strategy

1. Fetch `index.json` using HTTPS; read `schemaVersion` and `catalogVersion`. The client must refuse unsupported major schema versions.
2. Fetch `networks.json`, `stations.json`, `locations.json`, `languages.json`, `categories.json` and the selected `i18n/<locale>.json`.
3. Validate each payload and cross-references, then swap the entire cached snapshot atomically. An incomplete download must never replace a healthy cached catalogue.
4. Save a last-known-good snapshot in appropriate app storage and use it after network failures. Show the last successful update time. The bundle may include a small emergency snapshot for first launch offline.
5. Use ETags or appropriate cache-control where available; reload data on explicit user refresh or a reasonable background interval rather than per-screen.
6. UI language is independent of `broadcastLanguages`. Tamil UI should not hide Malayalam stations unless the user selected Tamil broadcast filtering.
7. Group by `networkId`; sort networks and child stations by localized labels/canonical name as appropriate.
8. Implement location filters using the parent references in `locations.json`: country → state/province → district → locality. A `null` locality means unspecified; do not infer the listener's district from their network IP.
9. Only show an enabled Play action for streams **independently approved for production use**. In this initial seed, there are **zero** verified streams; show explanatory disabled states or station websites as external links, not fake Play buttons.
10. Web playback uses HTML audio/hls.js as suitable; Android playback should use an audio-background-capable Media3 bridge. HTTPS, stream codec, geoblocking and CORS can still cause failures. Handle errors without silently deleting stations.

## Example: filtering a loaded catalogue

```ts
const filtered = stations.filter(s =>
  (countryCode === null || s.countryCode === countryCode) &&
  (regionId === null || s.regionId === regionId) &&
  (districtId === null || s.districtId === districtId) &&
  (localityId === null || s.localityId === localityId) &&
  (broadcastLanguage === null || s.broadcastLanguages.includes(broadcastLanguage))
);
const grouped = Map.groupBy(filtered, station => station.networkId);
```

This example intentionally does not make regional services magically local: when a city is selected, national and region-wide services must be shown in a **separate global/network section** if desired, rather than mislabelled as city-based stations.

## Locale handling

The data bundle has `en`, `ta`, `sa`. The RadioBee client may continue using its own `@ngx-translate/core` JSON for application-wide UI. To avoid key collisions, these bundles use a `catalog` namespace and a separate `categories` namespace. Keep English as a fallback; Sanskrit text is an initial translation that benefits from proofreading.

## Caching/versioning

- Compatible editorial edits increment `catalogVersion`, keep `schemaVersion: 1`.
- Breaking field changes should be published at `/v2/` with a new schema before client migration.
- Test GitHub Pages CORS, HTTPS and static-host cache behavior from both the Web app origin and Android WebView.
- Do not make startup block indefinitely on the data host; an offline seed or last-known-good catalogue should remain available.
