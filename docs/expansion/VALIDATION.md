# Implementation validation and changed-file inventory

> Historical 1.5.0 implementation snapshot. Current 1.6.0 counts, trial-listening policy and results: [worldwide review](../WORLDWIDE-TAMIL.md) and [validation](../worldwide/VALIDATION.md).

Reviewed 8 November 2026. No commits, pushes, merges or deployments were performed. No dependencies, lockfiles, artwork or workflows were changed by this task.

## Delivered result

Catalogue v1.5.0 has 65 discoverable stations: 24 existing playback-candidate records and 41 metadata-only records. There are 26 existing stream URLs and zero stations with reviewed production listening approval. All nine mandatory local discovery candidates are included. AIR Nagercoil remains one record; Sooriyan Sri Lanka retains both URLs. Original playback records and station migrations are unchanged. Research URLs cannot enter the metadata publication or be enabled by permissive playback flags.

## Exact automated results

All Node/npm commands ran in Ubuntu-22.04 WSL2 using Linux Node v24.16.0 and npm 11.13.0. Dependencies were not reinstalled.

| Repository | Command | Result |
| --- | --- | --- |
| Data | `npm run validate` | Passed |
| Data | `npm test` | 77 tests; 77 passed; 0 failed, cancelled, skipped or todo; 681.208965 ms |
| Data | `npm run build` | Passed; discovery published, research excluded |
| Client | `npm run lint` | All files pass lint |
| Client | `npm run typecheck` | Passed |
| Client | `npm run test:ci` | 23 test files passed; 314 tests passed; 36.64 s |
| Client | `npm run build` | Production build passed; 21.344 s |
| Client | `npm run test:android-scripts` | 14 tests; 14 passed; 0 failed, cancelled, skipped or todo; 984.472306 ms |
| Client | `node --check scripts/preview-discovery.mjs` | Passed |
| Both | `git diff --check` | Passed |

The data repository has no separate lint/typecheck script. Schema validation and deterministic Node tests cover its contract. Client production build warnings remain: station-card.scss 3.04 kB and station-browser.scss 3.67 kB exceed the 2 kB warning threshold, within the 4 kB error limit. The browser stylesheet was not changed by this task.

Regression tests cover optional/legacy manifests, invalid metadata and unsafe website URLs, alias/ID deduplication, regional mapping/filtering, atomic cache refresh, favourite identity across publication transitions, migrations, three-language metadata rendering, forged stream rejection under permissive flags, and preserved Sooriyan alternative streams with mock-engine loading. Mock-engine success is not an audible network test.

## Manual verification and remaining limits

The local development preview displayed 65 stations. Kanyakumari showed one AIR record and nine mandatory metadata cards: AIR retained its existing Play action; the nine metadata cards had no Play action. English, Tamil and Sanskrit controls/statuses and dark theme were visually reviewed. At 390 x 844, document scrollWidth and clientWidth were both 390: no horizontal overflow. Desktop layout was reviewed. The preview used the explicitly labelled development seed and was stopped after review. Reproduction commands are in the main report and client documentation; the live deployed client is unchanged.

Six bounded HTTPS checks produced four transport/media successes (AIR, Sooriyan, ISKCON and BIG-labelled Zeno) and two failures (Suryan timeout, ASR 404). These are not four new playable stations. Christian Samy's provider startup failed with media error 4. No canonical reusable Annai feed was established. Three bounded Radio Browser searches returned empty results. Historical HTTP leads were not upgraded by guessing; bot/session restrictions were not bypassed. Sanitized observations are in stream-checks.json. No broadcast recording or binary audio capture was saved.

FFmpeg was unavailable. Sustained new-stream decoding, repeated audible programme identity and Android/native-device playback remain unverified. Historical short ISKCON browser progress is identified as historical. Direct listening, recording and redistribution conditions remain separate unresolved reviews. No permission grants or new public playback URLs were added. Hello Nagercoil remains a requested archived candidate without primary transmitter confirmation; no frequency is asserted. Tamilosai, Isai Murasu and Kumari lack currently confirmed official websites. Nanjil remains research-only because identity/locality evidence is insufficient.

Legacy permissive playback configuration remains unchanged to preserve existing behavior. Zero approved-listening stations is an editorial count, not a claim that every legacy Play action is disabled. Discovery entries cannot use that permissive route. Publishing requires the matching manifest, discovery file, sources, networks and geography. Live acceptance requires a separately approved release. No physical Android build/device test or live deployment was performed.

## Preservation and file inventories

Data branch: feature/10-kanyakumari-discovery, based on freshly fetched master. Client branch: feature/9-radio-playback-reliability, retained under the request's exception for relevant unmerged work. The client initially had 13 modified tracked files plus untracked Stage 9 work. Eleven non-overlapping tracked diffs were compared exactly with the initial snapshot; both shared station-card files retain pending/reconnecting changes. Existing player/recording implementation files and prior screenshots/results were not changed by this task. Original data station/migration/backlog JSON and all pre-existing source/network/location records were checked for preservation.

The complete modified/untracked inventories follow, including pre-existing client work. Nothing is staged. M means modified; ?? means untracked. Ignored build outputs, local probe logs and the initial preservation snapshot are not publication artifacts. Listed Stage 9 screenshots/results predate this task; no new media/binaries were introduced.

### Data working tree (18 files)

```text
M README.md
 M data/v1/index.json
 M data/v1/locations.json
 M data/v1/networks.json
 M data/v1/sources.json
 M docs/EDITORIAL.md
 M docs/INTEGRATION.md
 M docs/SCHEMA.md
 M scripts/build-static.mjs
 M scripts/validate.mjs
?? data/v1/discovery-stations.json
?? docs/DISCOVERY-PUBLICATION.md
?? docs/expansion/discovery-stations.csv
?? docs/expansion/stream-checks.json
?? schema/discovery-station.schema.json
?? scripts/discovery-catalogue.mjs
?? tests/discovery-catalogue.test.mjs
?? docs/expansion/VALIDATION.md
```

### Client files changed by this task (17 files)

```text
src/app/catalog/catalog.models.ts
src/app/catalog/catalog.service.ts
src/app/catalog/catalog.validation.ts
src/app/catalog/station-browser.ts
src/app/catalog/station-details.service.ts
src/app/catalog/station-card.ts
src/app/catalog/station-card.html
src/app/catalog/station-card.scss
src/app/catalog/station-browser.html
src/app/catalog/station-details-content.ts
src/app/catalog/stream-eligibility.ts
src/app/catalog/ui-extras.ts
src/assets/catalog-development-seed.json
tsconfig.json
src/app/catalog/discovery-publication.spec.ts
documentation/KANYAKUMARI-DISCOVERY.md
scripts/preview-discovery.mjs
```

### Complete client working tree (including preserved Stage 9 work)

```text
M src/app/catalog/catalog.models.ts
 M src/app/catalog/catalog.service.ts
 M src/app/catalog/catalog.ui.ts
 M src/app/catalog/catalog.validation.ts
 M src/app/catalog/station-browser.html
 M src/app/catalog/station-browser.ts
 M src/app/catalog/station-card.html
 M src/app/catalog/station-card.scss
 M src/app/catalog/station-card.ts
 M src/app/catalog/station-details-content.ts
 M src/app/catalog/station-details.service.ts
 M src/app/catalog/stream-eligibility.ts
 M src/app/catalog/ui-extras.ts
 M src/app/home/radio-illustration.html
 M src/app/player/configurable-player.spec.ts
 M src/app/player/hls-player.spec.ts
 M src/app/player/media-engine.spec.ts
 M src/app/player/media-engine.ts
 M src/app/player/player.html
 M src/app/player/player.service.spec.ts
 M src/app/player/player.service.ts
 M src/app/recording/recording.service.ts
 M src/app/recording/recording.spec.ts
 M src/assets/catalog-development-seed.json
 M tsconfig.json
?? documentation/KANYAKUMARI-DISCOVERY.md
?? documentation/STAGE9-PLAYBACK-RELIABILITY.md
?? documentation/stage9/Dark-English.png
?? documentation/stage9/Dark-संस्कृतम्.png
?? documentation/stage9/Dark-தமிழ்.png
?? documentation/stage9/Light-English.png
?? documentation/stage9/Light-संस्कृतम्.png
?? documentation/stage9/Light-தமிழ்.png
?? documentation/stage9/disabled/results.json
?? documentation/stage9/persistent-error.png
?? documentation/stage9/reconnecting-English.png
?? documentation/stage9/reconnecting-தமிழ்.png
?? documentation/stage9/recording/results.json
?? documentation/stage9/recovery-ui/reconnecting-en.png
?? documentation/stage9/recovery-ui/reconnecting-sa.png
?? documentation/stage9/recovery-ui/reconnecting-ta.png
?? documentation/stage9/recovery-ui/results.json
?? documentation/stage9/results.json
?? scripts/preview-discovery.mjs
?? scripts/verify-stage9-playback.cjs
?? src/app/catalog/discovery-publication.spec.ts
?? src/app/player/playback-failure.ts
?? src/app/player/recovery-policy.ts
?? src/app/player/recovery.spec.ts
```
