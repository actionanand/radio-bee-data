# Stage 14 — Worldwide Tamil radio expansion (catalogue 1.9.0)

Review draft, 9 November 2026. Branch: `feature/14-global-tamil-radio-expansion`. Base: merged v1.8.1 master, `9191c539a991c769887b5427484126d657c01851`. Nothing committed, pushed, merged or deployed. The client and artwork are unchanged.

## Result and limits

**25 new publisher-associated listening trials**, with 25 new stable identities and one candidate each. All 25 completed bounded real audio decoding. No existing discovery record was promoted; all 46 remain available as metadata-only discovery. The 46 existing stream-bearing station objects, their 49 URLs, permissions, source records and network artwork references are unchanged.

The catalogue now has **117 identities: 71 stream-bearing and 46 discovery-only, 74 unique stream URLs, 71 networks and 20 countries**. Production-eligible stations remain **zero**. These are trial listening choices under the existing client contract, not newly authenticated broadcasters or permission-approved streams.

The 50+ addition target was **not met**. Research continued beyond 10 and 20 findings: 200 current Radio Browser records across 55 queries, the previous 224-record research inventory, 132 bounded publisher/configuration page observations, 27 country scopes, and 26 newly tested unique audio URLs. This investigates a pool exceeding 100 leads; it does **not** establish 100 independent broadcaster identities or exhaustive coverage of every town. The previous 224 live probes were not repeated.

Bulk Zeno discovery was stopped when a full terms review exposed an express restriction on systematic directory/database compilation without written permission. No bulk provider station data or new feed derived solely from that collection was published. SouthRadios and Vanavil restrictions, inaccessible official players, HTTP/IP-only sources and uncertain programme identity were also retained as blockers. Numerical targets did not override these conditions.

## Before and after

| Metric | v1.8.1 | v1.9.0 draft |
|---|---:|---:|
| Unique station identities | 92 | 117 |
| Newly introduced identities | — | 25 |
| Existing discovery promotions | — | 0 |
| Stream-bearing stations | 46 | 71 |
| Discovery-only stations | 46 | 46 |
| Unique stream URLs | 49 | 74 |
| Networks | 47 | 71 |
| Countries/territories represented | 14 | 20 |
| Technically verified stream flag | 1 | 1 |
| Technically unverified stream candidates (URLs) | 48 | 73 |
| New unverified trials | — | 25 |
| Production-eligible stations | 0 | 0 |
| Baseline user-confirmed Chrome identities (reused evidence) | 11 | 11, preserved |
| New controlled-browser sustained media + pause/restart | — | 1 |
| New controlled-browser media started, including sustained case | — | 2 |
| New publisher UI-only playback indication | — | 1; not a media-engine pass |
| New native Chrome / Android certifications | — | 0 / 0 |

Six newly represented countries are Bahrain, France, Ireland, Kuwait, Mauritius and Qatar. Geographic claims come from the reviewed publisher/context evidence, not stream hostnames. Ireland is explicitly publisher-declared and still needs independent geographic corroboration. JEIFM's Malaysia country is corroborated by independent directories, while the current publisher directly establishes the Tamil service and exact stream; direct publisher confirmation of geography remains a follow-up.

## Accepted trials

Exact stable URLs, source IDs, identity decisions, technical formats and evidence links are in [stations.json](stage14/stations.json), with a formula-safe [CSV](stage14/stations.csv). Every row has a corresponding publisher source in `data/v1/sources.json` and a completed decoder observation in [technical-checks.json](stage14/technical-checks.json).

| New station | Country | Format |
|---|---|---|
| Vaagai Tamil FM | Germany | MP3 |
| A9 Radio | Canada | MP3 |
| Amudham FM | India | AAC |
| mauRadio | Mauritius | MP3 |
| Theophony Tamil Christian Radio | India | HLS |
| JEIFM | Malaysia | MP3 |
| Amen FM | Canada | AAC |
| Live FM 107.2 | Bahrain | AAC |
| Quran in Tamil | Kuwait | MP3 |
| Sweety FM Tamil | India | MP3 |
| Hand of Jesus Tamil | India | MP3 |
| Vaanmalar FM | India | MP3 |
| Radio Suno Tamil | Qatar | AAC |
| Tamil Christian Radio | India | MP3 |
| Good News FM Tamil | Canada | MP3 |
| 3ZZZ 92.3FM | Australia | AAC |
| Radio 4EB 98.1 FM | Australia | MP3 |
| Radio 4EB Global | Australia | MP3 |
| 5EBI 103.1 FM | Australia | AAC |
| Namathu FM France | France | MP3 |
| Otran Vaanoli | Ireland (publisher-declared) | MP3 |
| Thuthi FM | Norway | MP3 |
| Radio Plus Indiz | Mauritius | MP3 |
| Time FM Toronto | Canada | MP3 |
| Inbathamil Oli | Australia | MP3 |

## Technical and browser results

The manual audit tested **26 unique new URLs in 27 endpoint audits**. All 26 eventually completed two seconds of decoding, but one was held from publication. The first 5EBI sample produced 30,432 PCM bytes (1.902 seconds) and a misleading MP3 signature hint; FFmpeg identified AAC. One retained bounded retry completed 32,000 bytes and confirmed AAC. The catalogue correctly uses `format: aac`. No historical observation was overwritten to hide that result.

Some servers reject HEAD with HTTP 400 or a nonstandard status line while bounded GET succeeds. HTTP 206 is a valid partial-audio response, not a failure. Reports preserve method-dependent results, actual MIME, signature hints, codec, CORS, redirects, byte budgets and decoder exit status. A successful HEAD or HTTP 200 alone never qualifies a candidate.

[Browser evidence](stage14/browser-checks.json) distinguishes:

- **Sweety FM Tamil:** the publisher's actual audio element reached `readyState: 4`, advanced to 113.49311 seconds with no media error, paused successfully, restarted at 49.657923 and advanced another 63.835187 seconds, then was paused/closed. Sustained browser media operation was observed; no human audible or station-announcement confirmation is claimed.
- **Theophony Tamil Christian Radio:** the publisher's HLS player advanced to 32.31118 seconds with `readyState: 4` and no media error. This is a startup/short browser-media result, not the full sustained/restart qualification.
- **Otran Vaanoli:** the publisher UI displayed playing, a 01:28 timer and changed track metadata. No DOM audio element was observable, so this is only a UI indication, not an independently observed media clock or decoder pass in that browser.
- Vaagai and Amen publisher controls were inspected but did not expose an observable playing audio element. No playback success is claimed from those controls. Other new candidates have no browser playback result.

These were controlled in-app browser observations, **not native Chrome certifications**. Native Chrome automation was security-restricted and no bypass was attempted. Android/native-HLS checks were unavailable. User testing in actual RadioBee Chrome and Android remains necessary for all 25 additions. No human listening or exact audible station ID was established by this task; documentary publisher-to-programme mapping is recorded separately.

Suno Tamil's publisher page still contains an HTTP StreamTheWorld link. Its exact same host/path HTTPS variant was tested independently and decoded; the published canonical candidate is HTTPS. This is the specifically named Tamil digital service, not Suno's Malayalam 91.7 FM channel. No FM frequency is invented.

## Programme identity and geography

Radio 4EB's FM and Global services have separate publisher station IDs, live URLs and Tamil schedules. They are two documented programmes, not bitrate duplicates. Tamil is scheduled on these otherwise multilingual services. 3ZZZ, 5EBI, Live FM Bahrain, mauRadio and Radio Plus Indiz are also honestly tagged/described as multilingual; listeners may hear other languages outside Tamil slots.

Only one Time FM Toronto candidate was added from the publisher-labelled Toronto player. The Montreal-labelled endpoint remains a comparison lead until distinct programme output and sustained playback can be established. Thuthi's low-bitrate URL and 3ZZZ's MP3 alternative are documented without extra station cards or additional catalogue URLs. Old A9 new-hits/old-hits mounts were not imported from directory records. No Indian Suryan URL was confused with Sri Lankan Sooriyan.

New Internet-only services have null FM frequencies. No city or local transmitter is inferred from a stream hostname or station brand. Existing regional FM programme identities and user-confirmed Stage 12/13 streams are preserved exactly.

## Held, failed and unfinished investigations

[All 46 discovery reviews](stage14/discovery-review.json) explicitly reuse the dated Stage 13 findings. This is not a claim that 46 individual endpoints were newly probed. Current broad directory and publisher research did not resolve the exact city feeds, permissions or source-association gaps for Hello regional stations, Indian Suryan, Mirchi, Radio City, BIG FM and the Kanyakumari/Nagercoil discovery listings. No network-wide stream was substituted onto their local cards.

Akashvani Thoothukudi stays discovery-only under the exact ID/name. Its previous 302-to-404 HLS endpoint is absent from playback metadata. The hotfix archive, migration and backlog records remain unchanged. No new Chrome replacement evidence was established, and the known broken URL was not unnecessarily re-probed.

[Held sources](stage14/held-sources.json) record:

- **Zeno:** current [terms](https://zeno.fm/terms/) prohibit systematic directory compilation without written permission and restrict automated extraction. Collection stopped after the initial 300-card listing and 39 detail responses; these local ignored results are not reproduced in the new reports. Zeno also explains that its [music agreements do not extend to third-party platforms](https://help.zeno.fm/en/article/do-i-need-a-music-license-7ckwl4/). This is not a retroactive change to any existing station's rights; separate review remains necessary.
- **SouthRadios:** its [terms](https://www.southradios.com/tcs) contain platform, third-party and intellectual-property restrictions. No decryption, app reverse engineering or platform bypass was attempted. Its own channels were not imported to meet a quota.
- **Vanavil:** existing research records an explicit third-party website/app permission requirement; no new permission was obtained and none of those channels was added.
- **Vanakkam Réunion Radio:** its exact publisher-linked URL decoded AAC. The reviewed evidence established Tamil cultural affiliation and a Bhakti Pâdalgal listing, but did not explicitly settle the live programme language/schedule. Cultural affiliation alone was insufficient; this feed remains research-only. Réunion was not added to the published countries.
- **OM Radio:** official player publishes an HTTP SAMCloud URL; a safe supported canonical HTTPS listening workflow was not established. The new research CLI rejected its non-allowlisted query before any audio audit. It was not silently upgraded or published.
- **MMI Catholic / Divine Wisdom:** published numeric-IP players remain outside the existing HTTPS hostname policy. No guessed hostname or TLS bypass was used.
- **Plenty Valley FM:** current exact publisher listening links were found, but retrieved Tamil schedule evidence was from 2021. Current Tamil scheduling remains a blocker. No repeat of its historical audit was performed.
- **SLBC:** official Tamil service pages were examined. No suitably established current HTTPS hostname-based feed emerged; old HTTP/IP-only and unassociated provider relays were not promoted. No other city's or language service was substituted.
- **Tamil Sun, TRT Tamil Olli, Vaanam, older German/French/Swedish leads and others:** local DNS, TLS, HTTP or timeout failures are recorded as page observations. Corrected domains were pursued where evidence existed (Namathu `.fr`, Inbathamil `.com`). No unsafe certificate bypass was used. An inaccessible page does not establish that a broadcaster or stream is globally down.

The [200-row JSON/CSV directory inventory](stage14/lead-inventory.json) remains research-only. Wrong or unsubstantiated Tamil matches, unsupported URLs, restricted-source leads, existing candidates and unreviewed identities are separately classified. None of its directory health claims is relabelled as Stage 14 decoding. Shared endpoint signals are in [duplicates.json](stage14/duplicates.json); they never trigger automatic merges.

[Coverage](stage14/coverage.json) records 27 country scopes and the requested Tamil Nadu, southern Kerala and Sri Lankan areas. Saudi Arabia, Oman, Sweden, Denmark, Netherlands, Italy and Réunion have no new qualifying addition in this review. These gaps are explicit; there is no claim of station absence or exhaustive town-by-town current research. Malayalam-only and unrelated Hindi results were not relabelled Tamil.

## Rights and client contract

Every addition retains `verificationStatus: unverified`, `lastVerifiedAt: null`, `rightsStatus: unconfirmed`, `directListening.status: needs-review`, and unconfirmed recording/redistribution. Source provenance, technical decoding, sustained browser operation, audible identity and permission are independent. No `permission-granted`, `allowed` or production approval was added.

The reviewed public player pages did not establish RadioBee-specific permission. Complete provider terms, publisher confirmations and jurisdiction-specific conditions remain pending; absence of an observed prohibition is not a licence. Respect later express restrictions, and obtain written decisions where required. No audio proxy, rebroadcast, recording facility, authentication bypass or geographic bypass was implemented.

The schema stays v1. Trial fields and MP3/AAC/HLS formats use the existing client contract. Six country labels have en/ta/sa parity, with Arabic, French, Bhojpuri and Mauritian Creole added as supported broadcast-language metadata. No existing translations were replaced.

Client compatibility issue retained for review: `streamLabel()` must not describe technical verification or these trial candidates as permission-approved/production-ready. The user's existing permissive trial configuration may expose candidates with their unverified status and restrictions intact. Restricted use must still block playback. The client checkout was not modified.

## Manual research procedure and safety limits

The new `scripts/research-tamil-expansion.mjs` is an explicitly invoked research runner. It does not edit catalogue data or editorial approval. It provides Unicode normalization that preserves Tamil combining marks, publisher/programme and URL deduplication, formula-safe CSV, sequential rate-limited probes, timestamped JSON checkpoints and fingerprint-matched resume. Old or unrelated reports are rejected rather than overwritten. Writes use exclusive, uniquely named temporary files and atomic rename after serialization.

```bash
# WSL2 Linux Node only in a Windows-shared workspace.
node scripts/research-tamil-expansion.mjs reports/my-reviewed-input.json reports/my-new-checkpoint.json
node scripts/research-tamil-expansion.mjs reports/my-reviewed-input.json reports/my-new-checkpoint.json --resume
```

Inputs are manually reviewed objects with `id`, `name`, `publisherId`, `url`, `sourceUrl` and optional country/programme metadata. The runner does not turn a directory dump into approved input. Resolve ownership, Tamil-language evidence, access/use restrictions and programme scope before probing. Preserve canonical publisher endpoints, not transient signed redirect URLs.

CLI page reads use a 10-second total deadline and 128 KiB body ceiling. Stream audits reuse `safe-https.mjs`/`audit-streams.mjs`: public DNS addresses are checked and pinned to the socket; mixed/private/reserved answers, local hosts, credentials and HTTPS downgrades are blocked on every hop and nested HLS resource. Redirects are limited to five per chain. One stream audit runs at a time with 350 ms inter-candidate spacing; page research also used bounded sequential jobs, at most two such research jobs overlapping. No automatic retry loops or CI probes were added.

A deep audio audit has a 35-second overall network deadline, at most two GET attempts within a shared 131,072-byte media budget, and bounded manifests/variant/segment fetching. HEAD/fallback health checks have separate small request budgets. The FFmpeg process receives only bounded bytes through `pipe:0`, never a third-party URL or HLS playlist; it has a five-second decoder deadline and requests two seconds of 8 kHz mono PCM, counted/discarded in memory. Decode success is not audible identity or full platform compatibility. CLI limits do not describe ordinary publisher browser page loading/listening: the separate browser checks used temporary playback buffers and were stopped by pausing/closing the tab.

No broadcast recordings, PCM files or binary test captures were saved. Reports retain diagnostic metadata only. Signed/transient query details, credentials, advertising configuration and session/analytics payloads are excluded/redacted. Research caches and command logs remain in ignored `reports/stage14/`. The user-excluded Stage 4 research files remain excluded and unchanged. Existing 224-row CSV evidence was not modified.

Network work is manual-only and absent from normal validation, tests, static build, CI and deployment. No dependency versions, lockfiles, installations or workflows changed.

## Regression verification

Final commands were executed with Ubuntu WSL2 Linux Node/npm; results are recorded in [verification.json](stage14/verification.json):

- `npm run validate`: passed.
- `npm test`: 117 passed, 0 failed, 0 skipped/cancelled/todo. This includes the existing Python offline regression checks invoked by the suite.
- `npm run build`: passed; research-only records are excluded from the static allowlist.
- `git diff --check`: passed.

An initial regression run caught the new test's overly strict HTTP 200 assertion for valid 206 partial audio; the corrected check accepts 200/206 and still requires actual complete decoding. The initial tool test also caught Unicode normalization dropping Tamil combining marks; the implementation was corrected. No network results were fabricated to make either test pass.

Added tests cover all original-object hashes, legacy streams/permissions and artwork references; exact counts and stable IDs; source/format/decoder associations; distinct programmes; locale and geography references; discovery/migration/backlog consistency; Thoothukudi quarantine; trial rights; metadata sanitization; static research exclusion; CSV formula injection; byte caps and cancellation; sequential execution; interruption checkpoint preservation; safe output paths and resume fingerprints. Dated Stage 12/13/hotfix assertions use a reconstructed baseline view, while Stage 14 independently checks the actual current data.

## Evidence index and remaining actions

The machine-readable files under [stage14/](stage14/) contain accepted stations, empty promotion inventory, technical/browser checks, all discovery reviews, directory leads, publisher observations, duplicates/alternatives, rejected/restricted sources, unavailable-page observations, country coverage and permission follow-ups. [baseline.json](stage14/baseline.json) preserves original IDs, hashes, manifest and locale values. Historical Stage 12/13/hotfix records were not rewritten.

Before production use: run actual RadioBee Chrome/Android sustained playback and restart checks; obtain reviewed publisher/provider direct-listening decisions; independently corroborate the flagged geography; resolve exact regional programme sources; obtain permission before any provider-restricted bulk collection; and confirm ambiguous-language or multi-feed services before publication. Availability can change after this dated sample.

The complete review inventory is [files-changed.json](stage14/files-changed.json). The old Stage 12 note and two helper scripts were already untracked at task start and are listed separately as untouched/excluded. All intended changes remain uncommitted.
