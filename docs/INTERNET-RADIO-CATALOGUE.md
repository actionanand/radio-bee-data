# Internet-only catalogue review — Stage 8

Reviewed 7 November 2026 on `feature/8-internet-radio-catalogue`, based on freshly fetched master `a3b030cda478e7c2dfbdbf22e35973e69ebac6bf`. Catalogue version **1.4.0**, schemaVersion **1**. This is a review draft, not a deployment. No client checkout was changed.

## Before and after

| Measure | Before (1.3.0) | Draft (1.4.0) |
| --- | ---: | ---: |
| Published station cards | 88 | 24 |
| Direct stream candidates | 26 | 26 |
| Historically technically verified streams | 1 | 1 |
| Production-eligible / approved direct-listening stations | 0 | 0 |
| Network identities | 18 | 18 |
| Geographic records | 89 | 89 |
| Non-published archived stations | 0 | 64 |
| Approved station/network artwork | 0 / 0 | 0 / 0 |

All 24 cards have direct HTTPS Internet candidates. This does not mean all 24 can play: current transport evidence, decoded playback, programme identity and permitted RadioBee use are separate questions. All 26 `rightsStatus` values remain `unconfirmed`; all direct-listening decisions remain `needs-review`. Vasantham's historical verification is retained, not refreshed by HTTP inspection.

## Removals, identity and favourites

[Full preserved records](research/station-backlog.json) contain all original fields for the 63 empty-stream stations and AIR Thoothukudi (its official candidate returned 404 again). This includes ASR, Annai, Kumari Tamil Media, Suryan, Hello, Mirchi, other terrestrial-only entries and Shakthi Colombo/Jaffna. These records are research, not listener-facing station cards. A future temporary failure does not automatically remove anything: audits remain non-mutating and manual.

The [88-row decision CSV](stage8/station-decisions.csv) accounts for every original ID. [Published migrations](../data/v1/station-migrations.json) contain all 64 removed IDs with **null** canonical targets. None is silently mapped to another programme. Retained IDs are unchanged. The network, location and source dictionaries remain intact for provenance and restoration; unused dictionary entries do not assert Internet broadcasts.

Shakthi retains one national Internet card, `shakthi-srilanka`, named **Shakthi FM Sri Lanka**. Colombo and Jaffna are terrestrial frequency listings without proven separate Internet broadcasts. Their equivalence to the national online programme is not independently established, so there are no automatic favourites aliases. Region/district/locality remain null for the national card. No city origin is invented.

Sooriyan's two URLs remain alternatives on one card. Shakthi's official-player URL is appended to its existing card. Indian Suryan and Sri Lankan Sooriyan remain distinct network identities. AIR local services retain their original IDs and distinct official player/channel mappings, as documented in [Stage 6](STAGE6-STREAM-DISCOVERY.md) and [its complete station inventory](stage6/stations.json); a shared CDN hostname is not a shared programme. Chennai Rainbow, Gold and Tamil Vividh Bharati remain separate named services. No other proven programme duplicates were found in the retained set. Different URL spellings can still conceal shared audio: no exhaustive live audio fingerprint comparison was possible, and programme review remains an editorial responsibility.

## Technical results and new source

The [metadata-only network log](stage8/stream-audit.json) records timestamps, request and final URLs, redirects, HTTP/MIME, CORS, signatures, HLS segment results and decoder limitations. It covers the 26 original URLs plus ASR's official endpoint and the additional Shakthi player URL. The [official-site review](stage8/source-review.json) records the six bounded website checks.

- Original catalogue: **25 successful bounded transport/media inspections; 1 failure (AIR Thoothukudi, HTTP 404)**. AIR Nagercoil's existing official URL redirected to CloudFront; its manifest and bounded HLS segment were retrieved. It was retained. No `pbaudio129` identity assumption or fallback was added.
- ASR's official homepage returned 200 and publishes `https://cast1.asurahosting.com/proxy/asrdigit/live`; the endpoint returned **404 on both GET attempts**. HEAD also encountered a protocol parse error. Its other published Zeno links were HTTP; no HTTPS addresses were guessed. ASR stays in research.
- The [Shakthi official website](https://shakthifm.com/) loads [its player script](https://shakthifm.com/scripts.js), whose `STREAM_URL` is `https://mbc.thestreamtech.com:8086/index.html`. Despite the path suffix, this returned **200, audio/aacp, an AAC byte signature, ICY name “Shakthi FM”, reported 64 kbps and CORS `*`**, without redirects. These observations support association with the broadcaster, not equivalence to a specific local FM transmitter or proof of audible output. It is added as `shakthi-official-player-candidate`, source `shakthi-player-stage8`, **unverified**, null `lastVerifiedAt`, rights unconfirmed, direct listening needs review. The original `/stream` endpoint is retained as an alternative.
- [Sooriyan's official player](https://www.sooriyanfm.lk/) still publishes the existing port-2020 URL. MIME labels in HTML do not override observed MP3 signatures. Both existing alternatives passed bounded transport inspection.
- [Annai's broadcaster-authored Zeno profile](https://zeno.fm/radio/annai-fm/) returned 200. It describes Parakunnu near Kuzhithurai and Tamil/Malayalam programming; no direct audio endpoint was established in this bounded review. A player page is not an audio URL, so no published card was restored. Confirm ownership, stream configuration, exact geography and use terms before restoration.
- [Kumari Tamil Media](https://radio.kumaritamil.com/) failed DNS resolution (`ENOTFOUND`). No invented replacement hostname or city feed was added.
- [Suryan's official site](https://www.suryanfm.in/) returned 200 but the bounded homepage review did not establish a direct HTTPS regional feed. Its [terms](https://www.suryanfm.in/terms-of-use/) do not establish a RadioBee-specific playback allowance. Do not reuse Sri Lankan Sooriyan as an Indian Suryan stream. Regional Suryan records remain in research.

No new local programme was established for Tenkasi, Thoothukudi, southern Kerala or other archived cities in this review. Prior evidence and the full archived records are retained for continued work; absence from publication does not assert that a broadcaster has no Internet service anywhere.

### Limits and interpretation

The existing safe HTTPS transport is retained: HTTPS only, public DNS addresses pinned to sockets, private/mixed DNS answers and local hostnames rejected, downgrade/unsafe redirects refused, TLS validation enabled, at most five redirects per request and one active request. Deep endpoint audits have a 35-second overall deadline, at most two GET attempts, a cumulative 128 KiB media budget and a bounded first HLS variant/segment; quick audits use a 12-second deadline. The HEAD/fallback check has its own bounded one-byte fallback. Encrypted/init-dependent HLS is explicitly flagged rather than fetching keys or bypassing access controls. Website research was separately bounded at 128 KiB per page. Audio bytes were held transiently in memory and discarded; no broadcasts, PCM or binary samples were saved.

**Current decoding: not tested (`ENOENT`, FFmpeg unavailable). Current Chrome/hls.js/native Android playback: not tested.** No dependencies or browser tools were installed. Browser access was unavailable in this session; historical dated observations in Stage 6 remain historical. Retrieved HLS segments, a CORS header and audio signatures do not establish audible playback, uninterrupted programmes, stability or Android compatibility. `counts.pass` in the audit is a transport/media diagnostic count, not editorial approval. Network results are snapshots and may vary by geography/CDN/time.

## Publication safeguards and compatibility

Published station schema now requires at least one stream. Runtime validation rejects empty streams, duplicate normalized names within a network, exact shared URLs across cards, duplicate URLs within a card, invalid references/counts and unsupported migration targets. Name/URL checks are safeguards, not automatic programme-identity research.

The builder explicitly copies approved v1 JSON files plus i18n/assets; `docs/research/` and arbitrary files placed under `data/v1/` are excluded. Automated tests inject fake research into the data directory to verify this boundary. Existing optional listening-policy and artwork checks remain active. No network probe was added to normal validation, tests, deployment or workflows; network failures remain nonblocking diagnostic outcomes.

Optional `files.stationMigrations` is additive. Clients unaware of it can still consume the retained v1 station model and IDs. Client favourites for removed IDs require an unavailable state until a proven replacement exists. The client `streamLabel()` must not describe technically verified streams as playable/available while use remains unconfirmed; see [integration guidance](INTEGRATION.md). No client release or use approval is implied.

## Artwork and remaining actions

Approved image files: **none**. Dimensions, attribution obligations and binary sizes: not applicable; **0 bytes**. All 24 stations use the existing client fallback. The [logo research inventory](STATION-LOGOS.md) records official candidates and missing redistribution grants. No broadcaster imagery was generated, hotlinked through `logoPath`, downloaded or relicensed by inference.

Before enabling production listening: establish reviewed direct-use conditions from credible broadcaster evidence, independently verify decoding and audible playback on Chrome/hls.js and native Android, confirm live identities where still uncertain, and repeat stability checks. Obtain suitable artwork licenses before adding assets. Continue ASR/Annai/Kumari/Suryan and regional research from the preserved backlog; never restore an empty or guessed endpoint merely to increase counts.

## Final checks

Final published-set quick audit: **26 transport/media passes, 0 failures, 0 unknown, 0 untested endpoints**, recorded in [the final metadata log](stage8/final-stream-audit.json). Quick HLS results mean a parsed manifest, not a segment/decoder test; use the earlier deep results for the bounded segment observations. These totals never change approval metadata.

Offline verification used WSL2 Ubuntu 22.04, Linux Node v24.16.0 and npm 11.13.0:

- `npm run validate`: passed, zero catalogue errors.
- `npm test`: **69 tests, 69 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo**; final run 945.732447 ms. Decoder successes printed by mocked unit tests are not live network decoding observations.
- `npm run build`: passed; static output contains only the explicit publication allowlist plus i18n/assets. Missing optional migration documents remain compatible when not advertised; an advertised missing document fails validation.
- Integrity review: all 64 archived original records match master exactly; 23 retained records match master exactly, with only the documented Shakthi edit on the remaining card. Existing retained stream approval/use metadata is unchanged.
- Changed files contain text JSON/Markdown/JavaScript/CSV only, with no audio/binary captures or detected private-key/token patterns. Reports contain public transport metadata, not audio. Ignored scratch reports and the two locally excluded research inputs are not part of the Git changes.

## Complete change inventory

Modified tracked files (16):

- `README.md`
- `data/v1/index.json`
- `data/v1/sources.json`
- `data/v1/stations.json`
- `docs/EDITORIAL.md`
- `docs/INTEGRATION.md`
- `docs/SCHEMA.md`
- `docs/STATION-LOGOS.md`
- `schema/station.schema.json`
- `scripts/audit-streams.mjs`
- `scripts/build-static.mjs`
- `scripts/stage6-inventory.mjs`
- `scripts/validate.mjs`
- `tests/catalog.test.mjs`
- `tests/stage6.test.mjs`
- `tests/stream-audit.test.mjs`

New untracked files prepared for review (9):

- `data/v1/station-migrations.json`
- `docs/INTERNET-RADIO-CATALOGUE.md`
- `docs/research/station-backlog.json`
- `docs/stage8/final-stream-audit.json`
- `docs/stage8/source-review.json`
- `docs/stage8/station-decisions.csv`
- `docs/stage8/stream-audit.json`
- `schema/station-migrations.schema.json`
- `tests/internet-catalogue.test.mjs`

No dependency, lockfile, workflow, artwork or client files changed. No commit, push, merge, deployment or GitHub settings change was performed.
