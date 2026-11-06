# Stage 4 regional catalogue and manual quality audit

Catalogue 1.2.0, published 2026-11-06: 88 listings, 18 networks, 10 candidates; one historical technical verification and zero production approvals. Schema v1 unchanged. All rights unconfirmed. No client/Android changes.

## Catalogue work

Added distinct official Akashvani FM Gold Chennai (channel 241) and VB Tamil Chennai (242), using exact broadcaster-published HLS mappings; neither was copied into another city. Added Capital FM Sri Lanka as a network listing with no guessed endpoint, and Club FM Thiruvananthapuram from MIB row 351 with no inferred language tags. Corrected/sourced six Chennai and three Thiruvananthapuram private-FM frequencies from the official 30 March 2026 operational table. Terrestrial frequency evidence is not streaming permission. Preserved all existing station IDs including yaal-fm; SLBC menu corroborates Thendral/Thamil Sevai/Yaal identities, but secure streams and programme details remain TODOs. Official Suryan navigation supplies city provenance; Indian Suryan and Sri Lankan Sooriyan remain separate networks. Hello Nagercoil is explicitly unsubstantiated; other unreviewed seed FM-market entries carry editorial TODOs. Languages not independently established remain seed/candidate metadata; Club FM has an empty language array. No geography/translation keys were added; English/Tamil/Sanskrit UI key parity remains valid and station names use canonical fallback.

Official references: [Akashvani](https://akashvani.gov.in/radio/live.php), [MIB operational table](https://mib.gov.in/sites/default/files/2026-03/390_operationalchannels_as-pn-30032026.pdf), [Suryan cities](https://www.suryanfm.in/about-us/), [SLBC](https://slbc.lk/), [Capital](https://capitalfm.lk/). Capital direct browsing encountered 526; its indexed official page supplies identity only. Star official about-page returned 429; a stream/server name alone cannot establish ownership. Isai identity remains unconfirmed. Neither Star nor Isai was silently imported into production JSON.

## Every concrete URL tested (deep audit)

Run: 2026-11-06T08:25:34.561Z through 2026-11-06T08:26:33.367Z, UTC. The fourteen supplied leads deduplicate against catalogue URLs; two newly sourced Chennai URLs bring the distinct tested set to sixteen. P0 leads were tested first. Previously reported browser playback is retained as historical/user-reported evidence only, not a new browser or human identity test.

| Region | Station | Requested URL | Checked at UTC | Result | ICY declared kbps | Decode | Failure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Kanyakumari | air-nagercoil | https://radio.wavespb.com/live/10c64309264eb009/10c64309264eb009.m3u8 | 2026-11-06T08:25:34.562Z | segments-retrieved | unknown | not-tested | none |
| Sri Lanka Tamil | sooriyan-srilanka | https://radio.lotustechnologieslk.net:2020/stream/sooriyanfmgarden | 2026-11-06T08:25:36.276Z | http-reachable | 128 | not-tested | none |
| Sri Lanka Tamil | vasantham-srilanka | https://cp12.serverse.com/proxy/vasanthamfm?mp=/stream | 2026-11-06T08:25:40.384Z | http-reachable | 128 | not-tested | none |
| Chennai/Tamil Nadu | air-tamil | https://radio.wavespb.com/live/d533f2af4f49bd6f/d533f2af4f49bd6f.m3u8 | 2026-11-06T08:25:42.818Z | segments-retrieved | unknown | not-tested | none |
| Sri Lanka Tamil | sooriyan-srilanka | https://radio.lotustechnologieslk.net:8006/ | 2026-11-06T08:25:43.910Z | http-reachable | 128 | not-tested | none |
| Sri Lanka Tamil | shakthi-srilanka | https://mbc.thestreamtech.com:8086/stream | 2026-11-06T08:25:47.479Z | http-reachable | 64 | not-tested | none |
| Chennai/Tamil Nadu | air-chennai-rainbow | https://radio.wavespb.com/live/b20ff2fc0bb34b3d/b20ff2fc0bb34b3d.m3u8 | 2026-11-06T08:25:50.641Z | segments-retrieved | unknown | not-tested | none |
| Kerala/Tamil digital | luminous-radio-tamil | https://patmos.cdnstream.com/proxy/luminousradiotamil/?mp=/stream | 2026-11-06T08:25:51.919Z | http-reachable | 128 | not-tested | none |
| Chennai/Tamil Nadu | air-chennai-gold | https://radio.wavespb.com/live/84ad819b3f45dc08/84ad819b3f45dc08.m3u8 | 2026-11-06T08:25:58.368Z | segments-retrieved | unknown | not-tested | none |
| Chennai/Tamil Nadu | air-chennai-vividh-tamil | https://radio.wavespb.com/live/f893db91dedcb4ab/f893db91dedcb4ab.m3u8 | 2026-11-06T08:25:59.503Z | segments-retrieved | unknown | not-tested | none |
| Sri Lanka Tamil | shakthi-srilanka | https://mbc.thestreamtech.com:8086/index.html | 2026-11-06T08:26:00.709Z | http-reachable | 64 | not-tested | none |
| Sri Lanka Tamil | new-star-fm-srilanka | https://stream.starfm.lk:12025/stream | 2026-11-06T08:26:03.797Z | http-reachable | 320 | not-tested | none |
| Sri Lanka Tamil | new-isai-fm-tamil | https://stream.tamilocean.com/isailive/ | 2026-11-06T08:26:05.870Z | down | unknown | not tested | getaddrinfo ENOTFOUND stream.tamilocean.com |
| Tamil Nadu/Chennai public | air-tamil | https://air.pc.cdn.bitgravity.com/air/live/pbaudio025/playlist.m3u8 | 2026-11-06T08:26:05.929Z | segments-retrieved | unknown | not-tested | none |
| Chennai private | suryan-chennai | https://tamil.crabdance.com:8002/2 | 2026-11-06T08:26:07.411Z | down | unknown | not tested | The operation was aborted |
| Kanyakumari | asr-kanyakumari | https://cast1.asurahosting.com/proxy/asrdigit/live | 2026-11-06T08:26:30.441Z | down | unknown | not tested | HTTP 404 |

13 rows passed a reachability/playlist/segment stage, three failed; this is not thirteen playable stations. Six HLS URLs yielded bounded segments, including the alternate AIR Tamil directory lead. Decoder attempts returned ENOENT: FFmpeg unavailable, no install performed. Codec/sample-rate/channel-count and measured bitrate remain unknown. MP3/AAC labels are signature hints, not decoding proof. ICY 64/128/320 kbps values are server declarations; neither observed network throughput nor playlist BANDWIDTH is measured codec bitrate. No subjective quality ranking or audio retention. Shakthi /index.html returned AAC-like media in this run rather than HTML; identity and rights remain unconfirmed. Failures are transient observations, not deletion grounds. Suryan's aborted request reflects the transport deadline; not an identity or rights decision.

## Commands and reports

Run Linux Node/npm through WSL2 in this shared Windows workspace. No dependencies added, reinstalled or upgraded.

```sh
npm run audit:streams -- --scope=all --mode=quick
npm run audit:streams -- --scope=kanyakumari --mode=deep
npm run audit:streams -- --scope=srilanka-tamil --include-leads
npm run audit:streams -- --scope=trivandrum-tamil
npm run audit:streams -- --scope=chennai
npm run audit:streams -- --station=air-nagercoil --mode=deep
npm run audit:streams:report
```

Scopes select catalogue geography/language, not imagined feed origins. Luminous Tamil is relevant to Kerala Tamil listeners without an asserted city origin. Adjacent Malayalam services stay separate. Unknown scope/station or missing requested sidecar is an explicit setup error. Research files remain locally excluded and are not required by normal CI or hosted manual runs. --include-leads explicitly reads the local sidecar and deduplicates station + exact normalized URL; cross-station shared URLs are flagged, not assumed local programmes.

Reports: reports/stream-audit.json, .md and .csv (all ignored by Git). Quick-with-leads and deep-with-leads snapshots are reports/stream-audit-quick-leads.* and reports/stream-audit-deep-leads.*. The default files hold the last quick catalogue audit. CSV cells escape spreadsheet-formula prefixes. JSON keeps redirect/TLS/CORS/ICY/latency/attempt details and separate declared/estimated bitrate fields. Continuity is byte-arrival span, not decoded audio duration. Current browser playback and audible identity remain not-tested. Partial snapshots are written after each endpoint; SIGINT/SIGTERM stops after the bounded current endpoint and lists remaining endpoints as not-tested.

## Bounds and operational limits

Existing native HTTPS TLS/SNI and public-unicast DNS pinning, private-IP/local-host rejection and per-hop validation remain in force. One active network socket, at most five redirects per request; each transport request has a ten-second cap. Quick endpoint deadline twelve seconds; deep thirty-five seconds across HEAD, optional retry and HLS traversal, plus at most five seconds for decoder processing. One 128 KiB application-body budget shared by GET retries, master, one selected variant and one sample segment; HEAD/fallback separately consumes at most one byte. Physical TCP/TLS buffering/overhead can exceed sampled-byte counts. No cookie/auth scraping, proxy bypass, recording, forwarding, audio file or key download. Encrypted HLS and initialization-dependent fMP4 are identified but deliberately not decoded; nested master variants, alternate audio rendition selection and sustained playback require manual review. Variant selection uses the first published variant; no best-quality claim. Retry stops on rate-limit/service-unavailable HTTP 429/503; other deep initial-GET failures allow one retry. Native public-address selection and geo/VPN/routing may cause false negatives. Probe injection hooks are trusted test dependencies, not untrusted CLI input.

## CI/CD and validation

The former weekly schedule is removed. Stream-health is workflow_dispatch only, with scope and mode choices. Its audit step uses continue-on-error: true and uploads metadata reports with if: always(). A station failure returns a report row and CLI exit zero. Invalid arguments/setup may exit nonzero. Normal npm run ci and validate-and-publish remain offline structural checks; production deployment has no dependency on the manual network job. Deterministic tests use synthetic in-memory media and mocks, never real broadcasts.

Validation/build passed with WSL2 Linux Node 24.16.0, npm 11.13.0. Final npm test: 46 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo. Validation, build and report renderer exited zero. Both required quick audit and explicit deep audit completed with exit zero despite the three lead failures. No verification or rights fields were modified by reports.

## Remaining editorial work

No new Internet feeds established for Suryan Nagercoil, Annai Kuzhithurai, ASR, Kumari Tamil Media, Hello Nagercoil, SLBC Thendral/Tamil National/Yaal, Capital, private Chennai chains or adjacent Kerala commercial stations. Each is kept as a listing/TODO instead of receiving an invented URL. Obtain broadcaster-authored HTTPS endpoints and actual programme/identity evidence; resolve ASR 404, Kumari prior DNS failure, Isai DNS failure, Suryan timeout and Star attribution. AIR Nagercoil frequency 101 is not imported solely from the research title. VB MALAYALAM/Ananthapuri naming is still insufficient for a new city-specific mapping. Permissions, decoder support, actual Web/Android playback, HLS key/init support, geoblocking, long-term stability and the Stage 3B rights-aware streamLabel client fix remain outstanding. No emails, commits, pushes or merges performed.
