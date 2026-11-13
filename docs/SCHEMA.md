# RadioBee catalogue contract (v1)

Root files are plain JSON arrays unless noted. The manifest, `data/v1/index.json`, is an object. This makes the data easy to load through Angular `HttpClient` without an SDK or database.

## Index / compatibility

`schemaVersion: 1` determines the compatibility of structures; incompatible changes belong in `data/v2/`. `catalogVersion: "1.0.0"` is an editorial version for content updates and may increment without changing the schema. `publishedOn` is the edit/release date, not a station health-check timestamp. `files` are relative to `v1/`. Counts are validated at build time.

## Network

```json
{
  "id": "suryan-in",
  "name": "Suryan FM",
  "aliases": ["Suryan FM India"],
  "countryCodes": ["IN"],
  "kind": "broadcaster",
  "website": null
}
```

`networkId` gives a station its network grouping. `network.kind` is `public`, `broadcaster` or `online`.

## Location

```json
{ "id": "in", "name": "India", "type": "country", "parentId": null, "countryCode": "IN" }
{ "id": "in-tn", "name": "Tamil Nadu", "type": "state", "parentId": "in", "countryCode": "IN" }
{ "id": "in-tn-kanyakumari", "name": "Kanyakumari", "type": "district", "parentId": "in-tn", "countryCode": "IN" }
{ "id": "in-tn-kanyakumari-nagercoil", "name": "Nagercoil", "type": "locality", "parentId": "in-tn-kanyakumari", "countryCode": "IN" }
```

The `state` type includes provinces and union territories, even where a country's legal terms differ. No geographic coordinates are asserted. Null station hierarchy levels mean unknown/unassigned, not every city in the country.

## Station

Historical research-only example (this empty-stream record is excluded from publication):

```json
{
  "id": "suryan-nagercoil",
  "name": "Suryan FM Nagercoil",
  "networkId": "suryan-in",
  "countryCode": "IN",
  "regionId": "in-tn",
  "districtId": "in-tn-kanyakumari",
  "localityId": "in-tn-kanyakumari-nagercoil",
  "broadcastLanguages": ["ta"],
  "genres": ["music"],
  "delivery": "fm",
  "coverage": "local",
  "listingStatus": "reviewed",
  "frequencyMHz": 91.9,
  "website": null,
  "sourceIds": ["suryan-nagercoil-2026"],
  "streams": [],
  "notes": "FM service exists; city-specific internet stream not confirmed."
}
```

Stations may be locally affiliated FM broadcasters, regional radio services, or network-level online channels. `delivery` is `fm`, `am` or `online`; do not confuse this with ability to play in the Android app. `coverage` describes editorial grouping (`local`, `regional`, `national`, `global`), not a measured radio propagation footprint. `listingStatus` is `candidate` or `reviewed`.

**Listing ≠ playable stream.** Published stations must have at least one direct Internet candidate (`streams.minItems: 1`), but may have zero verified or approved streams. Empty-stream records belong only in the non-published backlog. `delivery: fm` describes broadcaster heritage and does not disqualify a valid Internet feed.

## Stream candidate

```json
{
  "id": "shakthi-candidate",
  "url": "https://mbc.thestreamtech.com:8086/stream",
  "format": "unknown",
  "verificationStatus": "unverified",
  "lastVerifiedAt": null,
  "sourceId": "initial-directory-candidates",
  "rightsStatus": "unconfirmed"
}
```

`format`: `mp3`, `aac`, `hls`, `unknown`. `verificationStatus`: `unverified`, `verified`, `unavailable`. `rightsStatus`: `unconfirmed`, `permission-granted`. HTTPS is required in this first contract. For `verified`, set a real ISO timestamp after a playback test. This still **does not** confirm rights or future uptime. An HTTP status 200 from a site homepage is **not** an audio stream test. If broadcaster authorization cannot be confirmed, mark `rightsStatus: "unconfirmed"` and hold release/publication pending review.

Do **not** auto-upgrade a stream based solely on the `check:streams` reachability report; manually verify real playback and the intended locality. Do not promote a `verified` stream after a routine weekly HEAD request. A station stream shared across markets is not proof of multiple independent local broadcasts.

## Optional artwork (v1 additive extension)

Station and network records may omit `logoPath` or provide a relative local
`assets/logos/stations/<slug>.png|webp` or
`assets/logos/networks/<slug>.png|webp` path. Null and external URLs are invalid.
Referenced regular files must exist, remain inside the artwork tree without
symlinks, have matching image headers, be at most 512 pixels per side and 256 KiB.
Resolve paths against the catalogue v1 base URL. Client selection is station
artwork, shared network artwork, then bundled fallback. Artwork does not grant
audio playback rights. See [logo provenance and approval policy](STATION-LOGOS.md).

## Optional direct-listening review (Stage 6)

Stream records may include `directListening` with `status` (`needs-review`,
`restricted`, `allowed`), `reviewedAt`, `sourceId`, a public review rationale in
`notes`, and separate `recording` / `redistribution` permission states. All
current decisions are needs-review. Legacy `rightsStatus` retains its meaning
and is never automatically upgraded. Existing consumers can ignore the object;
absence never grants direct-app eligibility. See
[Stage 6 contract and evidence](STAGE6-STREAM-DISCOVERY.md).

## Translations

`data/v1/i18n/en.json`, `ta.json` and `sa.json` have exactly the same nested keys. They translate **catalogue UI labels, categories and selected place names**, not the canonical station records. English is the fallback; client UI selection is separate from broadcast language filtering. The native language names in `languages.json` can be displayed without translation keys.

## Validation

`npm run validate` checks unique IDs, network relations, country and location hierarchy, categories, language tags, stream URL safety, provenance, counts and translation key parity. The included JSON Schema file documents one station record for external consumers; this repository's dependency-free Node validator provides structural and cross-file validation (not a full general-purpose JSON Schema engine).

## Internet-only publication and migrations (catalogue 1.4.0)

The v1 record shape and retained IDs are unchanged. One card represents one distinct programme; alternate URLs belong in its streams array. Exact shared URLs across station cards and duplicate normalized network/programme names are rejected. These guards cannot recognize every alias or two different URLs carrying identical audio; editorial identity review remains required.

Optional manifest key `files.stationMigrations` points to `station-migrations.json`, an additive document with `schemaVersion: 1` and `removed` entries `{oldId, canonicalId, sourceId, reason}`. A non-null replacement needs an existing canonical station and a source proving programme equivalence. `canonicalId: null` means unavailable, with no automatic favourite reassignment. All 64 current removals have null targets. Legacy clients can ignore this file.

Full removed records are in `docs/research/station-backlog.json`, outside static publication. The static builder copies an explicit file allowlist plus i18n and approved assets. Sources, networks and geography may include unreferenced research identities; they are not station cards. See [review and migration report](INTERNET-RADIO-CATALOGUE.md).


## Metadata-only discovery extension (1.5.0)

The optional files.discoveryStations points to discovery-stations.json, a separate metadata-only array using schema/discovery-station.schema.json. It forbids streams and unknown fields; adds aliases, availability, reviewedOn and websiteKind to station identity/geo/language/provenance metadata. Availability is no-direct-stream (no suitable listed URL), temporarily-unavailable (observed access/player failure) or review-pending (technical/use review outstanding), never an authorization grant. stations.json still requires non-empty stream arrays. Added counts: discoveryStations, discoverableStations, stationsWithStreamCandidates and productionEligibleStations; legacy stations/streams counts keep their original meanings. See [the publication contract and expansion review](DISCOVERY-PUBLICATION.md).

## Separate metadata/navigation API v2 (catalogue 2.0.0)

The legacy data/v1 files and schema/ contracts are restored unchanged to catalogue
1.9.0/schema 1. The enriched data is exclusively in data/v2 with schemaVersion 2,
catalogVersion 2.0.0 and corresponding schemas under schema/v2/. It supports
geographyEvidence, languageProfile, programmeThemeIds, flexible locality ancestors,
network-to-broadcaster relationships and a deterministic browse index.

Manifest extensions files.broadcasters, files.programmeThemes and files.browseIndex
resolve inside the same version root. Both versions include all required artwork
and localization. The migration document retains its independent format version 1;
the v2 browse index carries schemaVersion 2. No stream or permission model changed.

See [API v2 integration](API-V2.md) and [Stage 15 evidence and field contract](STAGE15-METADATA-NAVIGATION-API.md).

## Optional station display names (catalogue 2.8.5)

V2 locale dictionaries may include `stationNames`, a flat map from active canonical
station ID to a nonblank display string. Tamil and Sanskrit values use their target
script or the exact canonical English fallback. Each locale can omit this section
or individual entries; consumers then use `station.name`. It is independent of
UI-label key parity and broadcast-language metadata. The loader rejects duplicate
JSON keys and the validator checks IDs, Unicode and numerical brand preservation.
No station schema or v1 payload changes. See [Stage 36](STAGE36-STATION-NAME-LOCALIZATION.md).
