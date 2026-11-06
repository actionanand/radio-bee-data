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

A reduced example:

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

**Listing ≠ playable stream.** `streams: []` means no suitable direct endpoint has been entered. A reviewed listing can still have zero verified streams.

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

## Translations

`data/v1/i18n/en.json`, `ta.json` and `sa.json` have exactly the same nested keys. They translate **catalogue UI labels, categories and selected place names**, not the canonical station records. English is the fallback; client UI selection is separate from broadcast language filtering. The native language names in `languages.json` can be displayed without translation keys.

## Validation

`npm run validate` checks unique IDs, network relations, country and location hierarchy, categories, language tags, stream URL safety, provenance, counts and translation key parity. The included JSON Schema file documents one station record for external consumers; this repository's dependency-free Node validator provides structural and cross-file validation (not a full general-purpose JSON Schema engine).
