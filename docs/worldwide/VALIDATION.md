# Worldwide implementation validation

Final review on 8 November 2026. Data branch: feature/10-kanyakumari-discovery. Client branch: feature/9-radio-playback-reliability. Existing feature/review work was preserved. No commit, staging, push, merge, dependency change or deployment was performed. This worldwide follow-up did not edit workflows; concurrent client review changed .github/workflows/pr-validation.yml to add deterministic contract/artifact checks, preserved and listed below.

## Results

All Node/npm commands used Ubuntu-22.04 WSL2 Linux Node v24.16.0; no dependency installation or version changes.

| Check | Exact result |
| --- | --- |
| Data: npm run validate | Passed |
| Data: npm test | 82 tests; 82 passed; 0 failed/cancelled/skipped/todo; 1161.688579 ms |
| Data: npm run build | Passed; 1.6.0 manifest, 85 discoverable, 35 candidates, 37 URLs, 50 metadata-only, 0 approved |
| Client: npm run lint | Passed; additional targeted ESLint passed after final label correction |
| Client: npm run typecheck | Passed, including after final label correction |
| Client: npm run test:ci | 24 files passed; 320 tests passed; 44.42s (transform 273.83s, setup 74.47s, import 301.57s, tests 13.30s, environment 235.26s) |
| Client: targeted worldwide/regional contract suites after final fixture refresh | 2 files passed; 16 tests passed; 27.42s (transform 38.96s, setup 3.70s, import 40.55s, tests 463ms, environment 7.65s) |
| Client: npm run build | Production build passed; 23.367 seconds |
| Client: npm run test:android-scripts | 14 tests; 14 passed; 0 failed/cancelled/skipped/todo; 1059.935497 ms |
| Client: PR/preview/playback/recording/integration script contracts | 9 tests; 9 passed; 0 failed/cancelled/skipped/todo; 236.483519 ms |
| Client: npm run build:gh -- --configuration=production | Pages production build passed; 20.939 seconds |
| Client: node scripts/check-web-artifact.mjs | Passed; 32 JS/JSON files checked, Pages base correct, no development seed or test catalogue bundled |
| Minimal development seed | Passed the actual client catalogue validator; zero playback records and one explicit offline UI example |
| Both: git diff --check | Passed |

The data repository has no separate lint/typecheck script. Tests remain deterministic and ordinary CI/CD does not probe the network. The real native audit runs were manual, serial and nonblocking for deployment. Their 15 endpoints produced 14 transport/media successes and one CTR24 404, not 14 verified/approved broadcasters. FFmpeg was unavailable. Browser checks are separately described in browser-checks.json.

Nonfatal production stylesheet warnings remain: station-card.scss 3.01 kB and station-browser.scss 3.67 kB exceed the 2 kB warning threshold, within the 4 kB error threshold. Physical Android device playback/build was not run; the Android result above covers script tests.

## App and evidence review

The actual production app was served on loopback against the built local dist/v1 JSON through the existing developer preview. It showed 85 cards, 50 metadata-only cards and 35 candidate Play controls, without development-seed fallback. All 20 worldwide additions were present. OLI 968 reached Playing in the normal RadioBee player and was stopped. Searching ATBC returned its single discovery card with no Play control. Desktop width was 1280 px, with scrollWidth also 1280. No live deployment changed.

Unverified candidates display a translated trial label. A technically verified stream with unconfirmed use conditions shows permission review rather than an unverified technical label; regression assertions cover English, Tamil and Sanskrit. Strict policy and explicit restricted use still block playback. Counts distinguish candidates from approved listening. Older regional favourites/transition, aliases, recovery, artwork, recording and Sooriyan tests also passed. The seed remains a tiny fictional development-only offline example; it is excluded from production assets. Worldwide data is fetched from the authoritative API, with generated test fixtures used only in tests.

All original 24 stations' stream arrays match Git HEAD exactly. Sooriyan's complete existing record and both alternatives match. AIR remains one ID. Station migrations and the archived backlog are unchanged. ISKCON had no legacy tombstone; it moves once from metadata to a candidate record with its existing ID, unconfirmed programme language and unresolved permission status.

The earlier test pass exposed historical-snapshot assumptions (fixed 41 metadata records, original 88-ID membership, and research-only ISKCON). These were updated to require explicit follow-up provenance, exact current counts and unchanged original streams. A regional fixture/count mismatch was corrected by regeneration from validated data and trial rendering assertions. The final checks above all pass.

## Remaining limitations

Ten new worldwide feeds and one Indian discovery feed decoded in short browser sessions. This does not certify sustained stability or independently heard Tamil speech. Worldwide Tamil association is supported by broadcaster descriptions; ISKCON language remains unknown. HLS media position is not a decoded-duration measurement. The native auditor enforces byte, time, redirect and DNS/SSRF protections. Ordinary browser live sessions were time-limited but do not have the native auditor's transferred-byte guarantee. No recording or broadcast sample was retained, exported or committed.

Every new candidate remains technically unverified, with unconfirmed rights and needs-review direct listening. IBC explicitly prohibits recording and redistribution; its published embed tools and restrictive site policy need app-use review. Public availability or user-requested trial access does not establish broadcaster permission. Zero production-approved listening stations remains accurate. No known express restriction is turned into a permission grant; the client continues to enforce restricted status.

Canada's exact CMR HD2/EAST/CTBC direct feeds, CTR's failed mount, ATBC's secure replacement, Athavan, RAAGA/SYOK, Swiss Tamil Radio and Tarana need further canonical-source/playback review. France TRT, SBS and shared New Zealand programme leads remain documented separately rather than fabricated as dedicated FM services. Source locations and service frequencies are limited to the cited evidence. Transmitter/regulatory detail and precise legal operator identity remain incomplete for some self-published services.

Publishing matching data/client changes still requires the user's release approval. The local production preview uses /home for a normal npm run build; /radio-bee/home applies to a build with that base path. No automatic recording, stream proxy, access bypass or CI network probing was added.

## Complete file inventories

The following is the entire current working tree, including prior expansion/Stage 9 work and concurrent review fixes. It is not all newly authored by the worldwide follow-up. Existing Stage 9 PNGs/results below predate this follow-up; no new media, secrets, raw page captures or temporary binary audio captures were introduced. Native test output and temporary helper scripts are ignored under reports/ and are not Git changes. Sanitized verification JSON in docs/worldwide is intentional public review evidence, excluded from the app API build.

### Data modified and untracked files

```text
M README.md
 M data/v1/index.json
 M data/v1/locations.json
 M data/v1/networks.json
 M data/v1/sources.json
 M data/v1/stations.json
 M docs/EDITORIAL.md
 M docs/INTEGRATION.md
 M docs/SCHEMA.md
 M schema/station.schema.json
 M scripts/build-static.mjs
 M scripts/validate.mjs
 M tests/internet-catalogue.test.mjs
 M tests/stage6.test.mjs
 M tests/stage9-research.test.mjs
?? data/v1/discovery-stations.json
?? docs/DISCOVERY-PUBLICATION.md
?? docs/WORLDWIDE-TAMIL.md
?? docs/expansion/VALIDATION.md
?? docs/expansion/discovery-provenance.json
?? docs/expansion/discovery-stations.csv
?? docs/expansion/stream-checks.json
?? docs/worldwide/VALIDATION.md
?? docs/worldwide/browser-checks.json
?? docs/worldwide/stations.csv
?? docs/worldwide/stations.json
?? docs/worldwide/stream-checks.json
?? schema/discovery-station.schema.json
?? scripts/discovery-catalogue.mjs
?? tests/discovery-catalogue.test.mjs
?? tests/discovery-integration.test.mjs
?? tests/worldwide-discovery.test.mjs
```

### Client modified and untracked files

```text
M .github/workflows/pr-validation.yml
 M angular.json
 M src/app/catalog/catalog.models.ts
 M src/app/catalog/catalog.service.ts
 M src/app/catalog/catalog.spec.ts
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
 M src/app/catalog/testing/published-1.3.fixture.ts
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
?? documentation/KANYAKUMARI-DISCOVERY.md
?? documentation/STAGE9-PLAYBACK-RELIABILITY.md
?? documentation/WORLDWIDE-TAMIL.md
?? documentation/integration-audit/results.json
?? documentation/integration-audit/setup-failure.json
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
?? scripts/check-web-artifact.mjs
?? scripts/generate-catalog-fixture.mjs
?? scripts/generate-worldwide-fixture.mjs
?? scripts/integration-contract.test.cjs
?? scripts/preview-discovery.mjs
?? scripts/verify-catalogue-integration.cjs
?? scripts/verify-stage9-playback.cjs
?? src/app/catalog/discovery-publication.spec.ts
?? src/app/catalog/testing/discovery-contract.fixture.ts
?? src/app/catalog/testing/worldwide-contract.fixture.ts
?? src/app/catalog/worldwide-publication.spec.ts
?? src/app/player/playback-failure.ts
?? src/app/player/recovery-policy.ts
?? src/app/player/recovery.spec.ts
```

### Client files touched by this worldwide follow-up

```text
documentation/WORLDWIDE-TAMIL.md
scripts/generate-worldwide-fixture.mjs
src/app/catalog/testing/worldwide-contract.fixture.ts
src/app/catalog/worldwide-publication.spec.ts
src/app/catalog/testing/discovery-contract.fixture.ts
src/app/catalog/discovery-publication.spec.ts
src/app/catalog/station-card.ts
src/app/catalog/station-card.html
src/app/catalog/station-card.scss
src/app/catalog/ui-extras.ts
src/assets/catalog-development-seed.json
```
