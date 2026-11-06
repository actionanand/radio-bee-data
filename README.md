# RadioBee Data

**Versioned, independent station catalogue for RadioBee** — *Stay tuned. Stay buzzing.*

This repository is intended to be published as static JSON and consumed by the [RadioBee Angular/Capacitor client](https://github.com/actionanand/radio-bee). It does **not** run a streaming server, mirror copyrighted radio broadcasts, or require a database, API key or hosting subscription for the JSON files.

> **Important first-release limitation:** This is a **curated discovery starter**, not a directory of production-ready playable stations. The seed currently contains **88 station/service entries, 18 networks, 89 geographic locations, and 10 HTTPS stream candidates — 1 technically verified stream, 0 production-eligible streams**. Many entries are explicitly marked `candidate` and need broadcaster-level confirmation. Do **not** enable production playback from `unverified` URLs. A valid station listing or FM frequency does not prove an independently playable Internet stream.

## What is included

```text
radio-bee-data/
├── data/v1/
│   ├── index.json              # Manifest, schema/catalog versions, counts
│   ├── networks.json           # Network identity; Indian Suryan != Sri Lankan Sooriyan
│   ├── stations.json           # Stable station IDs, regional affiliation, sources, stream leads
│   ├── locations.json          # Country → state/province → district → locality
│   ├── languages.json          # Spoken/broadcast language tags
│   ├── categories.json         # Genres and categories
│   ├── sources.json            # Editorial provenance
│   └── i18n/{en,ta,sa}.json    # English, Tamil and Sanskrit catalogue labels
├── scripts/
│   ├── validate.mjs            # JSON structure, IDs, references, locale parity
│   ├── build-static.mjs        # Publishable static site in dist/
│   └── check-streams.mjs       # Non-mutating reachability report
├── tests/catalog.test.mjs
├── schema/*.schema.json       # Published JSON Schemas for key records
├── docs/SCHEMA.md
├── docs/INTEGRATION.md
├── docs/EDITORIAL.md
└── .github/workflows/
    ├── validate-and-publish.yml
    └── stream-health.yml
```

## Quick start

Use Node.js **22+** (the workflows use Node 24.16.0). No third-party npm dependencies are needed.

```bash
npm ci
npm run validate
npm test
npm run build
```

The static site is built at `dist/`. Locally inspect `dist/v1/index.json`, `dist/v1/stations.json`, etc. The health checker requires actual network access; it is not part of offline CI validation:

```bash
npm run check:streams
npm run probe:streams # Bounded media inspection; optional existing FFmpeg, no installs
# Metadata reports: reports/stream-health.json and reports/stream-probes.json (ignored by Git).
```

A reachability check is **not** playback verification, broadcaster permission, reliable uptime, or proof a stream is associated with a claimed city.

## GitHub setup and publishing

1. Create a **new** GitHub repository named `radio-bee-data` under `actionanand`.
2. Extract the ZIP, open its `radio-bee-data/` folder, and copy **all contents including `.github` and `.gitignore`** into the new repository root.
3. Push to the new repository's default branch (`main` or `master`). Do not paste this content into the `radio-bee` client repository.
4. In the new data repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
5. Check **Actions → Validate and publish RadioBee catalogue**. Only validated default-branch commits deploy. Pull requests validate without deployment.
6. Your public URL will normally be:

```text
https://actionanand.github.io/radio-bee-data/v1/index.json
https://actionanand.github.io/radio-bee-data/v1/networks.json
https://actionanand.github.io/radio-bee-data/v1/stations.json
https://actionanand.github.io/radio-bee-data/v1/locations.json
https://actionanand.github.io/radio-bee-data/v1/i18n/en.json
https://actionanand.github.io/radio-bee-data/v1/i18n/ta.json
https://actionanand.github.io/radio-bee-data/v1/i18n/sa.json
```

These URLs are **expected URLs after you create, configure and deploy the new repository**; they are not guaranteed to be live yet.

The manual-only **stream-health** workflow checks the catalogue endpoints and uploads a JSON report artifact. It does not delete stations, flip stream statuses automatically, or distribute broadcast audio. Third-party radio APIs and broadcaster streams have independent availability and usage conditions.

## Data conventions

- **One canonical English metadata record per station**, with stable `id` and `networkId`. No duplicate station rows for Tamil/Sanskrit. Brand names remain brand names.
- `countryCode` is ISO 3166-1 alpha-2; `broadcastLanguages` are language tags such as `ta`, `ml`, `en`, `sa`. **UI language** is independent from broadcast language.
- `regionId`, `districtId` and `localityId` reference `locations.json`; leave a level `null` when it is not established.
- `listingStatus: "reviewed"` means the *listing metadata* has a cited source, **not** that its stream is verified. `candidate` means it needs editorial confirmation.
- `streams: []` is normal when only a website or FM frequency is known; never use a homepage as though it were direct audio.
- `stream.verificationStatus` governs technical stream verification separately. One stream passed desktop-browser playback; nine remain `unverified`. All permissions remain `unconfirmed`. Only a **recently verified** HTTPS stream with confirmed RadioBee use permission and applicable client checks should be enabled in production.
- `frequencyMHz` is `null` unless a cited FM frequency was available; terrestrial reception is not available through normal Android internet-stream playback.
- The Sri Lankan **Sooriyan FM** network ID (`sooriyan-lk`) is intentionally different from Indian **Suryan FM** (`suryan-in`).
- Regional network affiliation does not prove each city has its own unique stream. National channels are not duplicated for every city.

See the [Stage 3A playback investigation](docs/PLAYBACK-SOURCES.md), [schema](docs/SCHEMA.md), [editorial policy](docs/EDITORIAL.md) and [client integration](docs/INTEGRATION.md).

## Updating data

1. Add a broadcaster/network first (or reuse its stable network ID).
2. Add or reuse country/state/district/locality IDs, without inventing locations.
3. Add the station with a stable ID, original language tags, source IDs and `streams: []` if unverified.
4. Only add a direct stream URL if it is a real HTTPS audio/playlist endpoint, not a station website. Mark it `unverified` until technical and rights checks are completed.
5. Update `data/v1/index.json` counts (and `publishedOn` when releasing changes). Bump `catalogVersion` to communicate data edits; keep `schemaVersion=1` for compatible changes.
6. Run `npm run validate && npm test && npm run build` and open a pull request.

**Translation approach:** `en` is the authoritative fallback; `ta` and `sa` contain the same catalogue-label keys. Translators should review Sanskrit grammar before public launch. Proper station names and local place names fall back to canonical text unless approved localized aliases are added in a future compatible schema.

## Relationship to RadioBee builds

- RadioBee **client** repo: Web releases on `main-github`; Android APK/AAB on `main-android`.
- **This data repo**: static catalogue updates on its own `main` or `master`; entirely independent from client APK/AAB builds.
- Client changes should consume this JSON with a cached last-known-good fallback, schema validation and clear unverified-stream UI.

## Sources and rights

Editorial sources are stored in `data/v1/sources.json` and linked by station `sourceIds`. Initial entries use broadcaster pages, Prasar Bharati and radio-industry reporting where available; others are explicitly discovery candidates. Radio Browser is one possible future metadata *discovery* input, not a guaranteed production streaming service. Official sites and stream endpoints can change.

Code and original catalogue compilation are supplied under the MIT license. Third-party broadcaster names, logos, stream endpoints, music, brand marks and source content remain the property of their respective owners. **No broadcast, recording, rebroadcast or stream redistribution rights are granted by this repository.**

Stage 4: [regional catalogue and on-demand stream audit](docs/STAGE4-STREAM-AUDIT.md). No scheduled or deployment-time network probing.
