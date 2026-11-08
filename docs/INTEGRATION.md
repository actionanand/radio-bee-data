# Integrating this catalogue into the RadioBee Angular + Capacitor client

Use this as a reference for implementing client-side `RadioDataService`. This repo does **not** modify the client application.

Stage 6 adds optional `stream.directListening` for a future client release.
It separates reviewed direct end-user listening conditions from legacy
`rightsStatus` and from recording/redistribution permissions. All current
policies are `needs-review`, so none enables playback. Old consumers should
retain their existing conservative gate; new consumers must adopt the
[documented Stage 6 review contract](STAGE6-STREAM-DISCOVERY.md) explicitly,
validate data, and check technical freshness, identity and platform support.
The optional field is not itself a migration or a completed client integration.

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
9. Only show an enabled Play action for streams **independently approved for production use**. In catalogue 1.4.0 there is **one technically verified stream and zero production-eligible streams**. All rights remain unconfirmed. Require both `verificationStatus: "verified"` and `rightsStatus: "permission-granted"`, plus applicable client checks; show explanatory disabled states or station websites as external links while blocked. See [playback investigation](PLAYBACK-SOURCES.md).
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

## Stage 3B: rights-aware stream labels

The client `streamLabel()` must use the same approval predicate as the Play
button and playback handler. A technically `verified` stream with
`rightsStatus: "unconfirmed"` must not be labelled **playable**, **available**,
**ready** or equivalent. Vasantham in catalogue 1.1.0 is the regression case:
show **Playback permission pending** and keep Play disabled. Technical success
alone must never enable playback through a label, fallback stream or direct URL.

| Technical status | Rights | Client result |
| --- | --- | --- |
| verified | unconfirmed | Playback permission pending; disabled |
| unverified | either | Verification pending; disabled |
| unavailable | either | Unavailable; disabled |
| verified | permission-granted | Eligible for applicable Web/Android checks; enable only if those pass |

Stage 3B must cover these combinations in `streamLabel()`, button state and
playback-handler tests. The client implementation is outside this data-repo
change; this is an outstanding compatibility issue, not a completed client fix.

## Locale handling

The data bundle has `en`, `ta`, `sa`. The RadioBee client may continue using its own `@ngx-translate/core` JSON for application-wide UI. To avoid key collisions, these bundles use a `catalog` namespace and a separate `categories` namespace. Keep English as a fallback; Sanskrit text is an initial translation that benefits from proofreading.

## Caching/versioning

- Compatible editorial edits increment `catalogVersion`, keep `schemaVersion: 1`.
- Breaking field changes should be published at `/v2/` with a new schema before client migration.
- Test GitHub Pages CORS, HTTPS and static-host cache behavior from both the Web app origin and Android WebView.
- Do not make startup block indefinitely on the data host; an offline seed or last-known-good catalogue should remain available.

## Internet-only catalogue migration (1.4.0)

Load the optional `files.stationMigrations` document when supported. Retained IDs remain stable. For a removed favourite, follow `canonicalId` only when non-null and validated; null means unavailable and must not select another city or network service. Keep the saved ID for possible future restoration. The non-published backlog is editorial research and must not be fetched by the client. Current counts are in the manifest, not a fixed 88-station assumption.

Stage 3B/Stage 8 compatibility issue: `streamLabel()` must not equate technical verification with reviewed use permission. Current `rightsStatus` values remain `unconfirmed`; strict production approval remains zero. In the 1.6.0 follow-up, the user explicitly authorized trial listening to playable unverified candidates through the client's existing permissive configuration. The client identifies unverified trial streams, while strict policy and explicit `restricted` use status still block playback. This is neither a permission grant nor a change to recording/redistribution restrictions. See [the worldwide follow-up](WORLDWIDE-TAMIL.md).


## Metadata-only discovery extension (1.5.0)

Fetch the optional discovery payload as part of the same atomic snapshot. Validate against the strict metadata contract before adapting it for display with empty streams. Check station IDs in both arrays before applying legacy playback-removal mappings: metadata-only reappearance does not reassign a favourite or grant a playback target. A true playback restoration removes its metadata-only row and reconciles its old removal entry. Unknown extension manifests remain compatible with older clients, which show only playback-candidate records. See [the publication contract and expansion review](DISCOVERY-PUBLICATION.md).
