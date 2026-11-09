| Metric | Baseline 1.7.0 | Stage 13: 1.8.0 | Difference |
|---|---:|---:|---:|
| Total distinct station identities | 92 | 92 | 0 |
| Stream-bearing stations | 43 | 47 | +4 |
| Discovery-only stations | 49 | 45 | -4 |
| Stream URLs | 46 | 50 | +4 |
| Networks | 47 | 47 | 0 |
| Production-eligible stations | 0 | 0 | 0 |
| Hello FM stream-bearing stations | 1 | 1 | 0 |
| Published network illustrations | 11 | 11 | 0 |
| New distinct identities added in Stage 13 | 0 | 0 | 0 |
| Existing discovery identities promoted | 0 | 4 | +4 |

# Stage 13 — Tamil FM network stream expansion

> Historical catalogue 1.8.0 report. The subsequent [v1.8.1 Thoothukudi hotfix](HOTFIX-13-AKASHVANI-THOOTHUKUDI.md) returns `air-thoothukudi` to discovery-only after a user-confirmed and independently reproduced 302 → 404 failure. The earlier successful probe and promotion evidence below remain unchanged; the other three promotions are retained.

Prepared 9 November 2026 on `feature/13-tamil-fm-network-expansion`. Fresh HTTPS fetch of remote master matched HEAD **`ac74c8dd4753c018f2387df5ea2957792879280e`**, the merged Stage 12 release. Actual baseline counts matched the user's 92 / 43 / 49 / 46 / 47 figures. Three pre-existing untracked Stage 12 helper files were preserved, not executed or rewritten. No commit, push, PR, merge, deployment, client change, dependency installation or artwork regeneration.

**Four defensible promotions implemented**, including a genuine Tamil Nadu restoration. This is **one below the lower target of five**, and six below ten. No extra identities were invented. Major private-network regional feeds remain unresolved; discovery listings were not filled with a shared Chennai feed or unrelated music channels merely to meet a quota.

## Implemented promotions

All four retain their stable station IDs, original network, geography, language/genre tags, aliases, frequency, website and prior source IDs. Only discovery-only fields were removed, stream/provenance added and notes dated. All streams remain **unverified**, with **unconfirmed rights** and **direct-listening review pending**. None grants recording or redistribution permission.

| Existing ID / station | Exact integrated stream URL | Format and current technical evidence | Publisher/programme association and scope |
|---|---|---|---|
| `air-thoothukudi` — Akashvani Thoothukudi | https://radio.wavespb.com/live/2e8cfad789dc692d/2e8cfad789dc692d.m3u8 | HLS carrying AAC; 2026-11-09 14:57:22 UTC. Manifest GET 206 `application/vnd.apple.mpegurl`, HTTPS CDN redirects, CORS `*`; unencrypted segment GET 206; 130,702 segment bytes, total 131,072 media bytes; two seconds decoded, FFmpeg exit 0. | Official [Akashvani player](https://akashvani.gov.in/radio/live.php), Stage 6 exact named channel **254, Akashvani Tuticorin**. Restores this city's programme, not Tirunelveli or another AIR feed. Exact archived stream object and stream ID `air-thoothukudi-stage6-hls` restored unchanged. |
| `east-fm-ca` — EAST FM 102.7 | https://centova.radioservers.biz/proxy/eastfmc1/stream | MP3; 14:50:02 UTC. GET 200 `audio/mpeg`, CORS `*`, 128 kbps input, 48 kHz stereo; two seconds decoded, exit 0. In-app browser player subsequently progressed **6.690075 seconds**, readyState 4, no media error. | Current [publisher root player](https://eastfm.ca/) explicitly embeds this exact `audioEl` URL and identifies EAST FM 102.7. Browser showed Toronto's **Netru Indru Naalai (Tamil), 09:00–12:00** schedule. Multilingual local FM service, not exclusively Tamil; not an unrelated east-coast station. |
| `swiss-tamil-radio-ch` — Swiss Tamil Radio | https://usa20.fastcast4u.com/swiss | MP3; 14:47:10 UTC. GET 200 `audio/mpeg`, CORS `*`, 128 kbps input, 44.1 kHz stereo; two seconds decoded, exit 0. In-app browser player progressed **3.880948 seconds**, readyState 4, no media error. | Current [publisher site](https://swisstamilradio.com/) `strData` names Swiss Tamil Radio and supplies the exact **usa20** endpoint. Historical directory **usa19** URL was not substituted. One Swiss online service, distinct from Thaalam and Akkini. |
| `lotus-fm-za` — Lotus FM | https://playerservices.streamtheworld.com/api/livestream-redirect/LOTUSFMAAC.aac | AAC; 14:54:13 UTC. HTTPS 302 to a `live.streamtheworld.com` delivery host; GET 206 `audio/aacp`, CORS `*`, 44.1 kHz stereo; two seconds decoded, exit 0. Browser/Android not tested. | Official [Lotus live player](https://www.lotusfm.co.za/lotusfm/live-player/) exposes base64-encoded plaintext JSON in `data-data`: nested station **Lotus Live Radio** explicitly specifies **LOTUSFMAAC.aac**. One South African multilingual service with scheduled Tamil content, not a 24-hour Tamil-only channel. |

Technical details are in [technical-checks.json](stage13/technical-checks.json); source notes, original discovery objects and restoration records are in [promotions.json](stage13/promotions.json). Four new source records use `stage13-<station-id>-player`. An `official` source kind describes the publisher URL association, **not** a publisher endorsement of RadioBee or an audible station-authentication result.

AIR limitation: the current official player page returned HTTP 200 but its first 128 KiB truncates before the Tamil Nadu listings. The exact named-channel mapping above is explicitly reused from [Stage 6](stage6/stations.json), not falsely described as freshly re-extracted. Current HLS transport/decoding was independently retested. The old 404 is historical evidence of instability, not a claim that the broadcaster permanently stopped streaming.

Lotus limitation: the widget's outer title still says **Motsweding Live**, while its nested station name and exact media URL both identify **Lotus** on the official Lotus player page. This template inconsistency is recorded. The homepage's separate `MOTSWEDINGAAC.aac` reference was rejected and never assigned to Lotus. No claim of independent spoken programme identification is made.

Stream metadata remains `verificationStatus: unverified`, `lastVerifiedAt: null`, `rightsStatus: unconfirmed`, `directListening.status: needs-review`, recording/redistribution `unconfirmed`. The historical AIR stream retains its original policy timestamp and source record; current health evidence is separate. No affirmative RadioBee-specific use allowance was established. Sustained continuity, stream-specific use terms and device compatibility still require review. Public listening controls and a successful decode do not authorize recording, redistribution or rebroadcasting; express restrictions must continue to be respected.

## Historical restoration and Stage 12 preservation

Only `air-thoothukudi` had historical removed-station/backlog records. Its obsolete `station-migrations.json` entry and `docs/research/station-backlog.json` entry were removed because the same ID is active again. Their **complete original records and positions**, including the 404 removal reason and exact stream object, are retained in `promotions.json`. Reconstruction tests reproduce the pre-change migration and backlog hashes exactly. The other three promotions had no removed/backlog entries to delete.

No active ID now appears in discovery, removed-station or archived backlog inventories. All **92 identities** are preserved; no aliases/favourites redirect to a different programme. No unused migration is invented. All other archival entries remain unchanged.

Every one of the **43 baseline station objects**, including all **46 baseline stream records**, is unchanged. This preserves AIR Nagercoil's two alternatives, Hello FM Chennai's Openstream URL and all seven Stage 12 additions exactly. Existing source objects, network JSON, locales and all eleven PNG files are hash-checked unchanged. The user's Chrome playback confirmation for the seven additions plus Hello Chennai is recorded separately in [user-playback.json](stage13/user-playback.json): **user-reported technical playback, duration unspecified; not broadcaster authentication or use permission**. No status was silently upgraded from that attestation.

## Review of all 49 discovery stations

The exhaustive, ordered station-by-station inventory is [discovery-review.json](stage13/discovery-review.json), including identity, geography, frequency, languages, original website, exact applicable candidate URLs, documentary sources, technical evidence and blockers. This is a documentary review of 49 records, not a claim of 49 successful live probes.

| Group | Reviewed | Promoted | Held |
|---|---:|---:|---:|
| Hello FM regional | 10 | 0 | 10 |
| Indian Suryan FM regional | 11 | 0 | 11 |
| Mirchi regional | 6 | 0 | 6 |
| Radio City regional | 3 | 0 | 3 |
| BIG FM regional | 2 | 0 | 2 |
| Other regional / worldwide discovery | 17 | 4 | 13 |
| **Total** | **49** | **4** | **45** |

### Hello FM — all ten remaining regional records held

`hello-nagercoil`, `hello-coimbatore`, `hello-madurai`, `hello-tiruchirappalli`, `hello-tirunelveli`, `hello-thoothukudi`, `hello-salem`, `hello-puducherry`, `hello-erode`, `hello-vellore`.

The official-domain lead `https://hellofm.in/` still refused HTTPS connections in this environment. Current Radio Browser's Hello FM result identifies **Ghana**, with `https://atunwadigital.streamguys1.com/hellofm` and a Peace FM homepage; it was rejected as unrelated. [Google Play `com.hellofm.radio`](https://play.google.com/store/apps/details?id=com.hellofm.radio) describes the **UK/Spanish-language Hello FM**, not Malar Publications. Searches of app/player references did not establish another authenticated Tamil regional stream. [Advertising-directory assertions of a Coimbatore app/player](https://smartads.in/services/radio/hello-fm-advertising-in-coimbatore) are leads without an exact authenticated endpoint, not proof of a feed.

The user-confirmed Chennai candidate `https://listen.openstream.co/4428/audio` remains **only under `hello-chennai`**. Its playback does not establish Nagercoil or another market, nor a network-wide relay. No regional frequency or city identity was inferred from a hostname. No second Hello endpoint was guessed or automatically added.

### Indian Suryan FM — all eleven regional records held

`suryan-nagercoil`, `suryan-chennai`, `suryan-coimbatore`, `suryan-madurai`, `suryan-tiruchirappalli`, `suryan-tirunelveli`, `suryan-thoothukudi`, `suryan-puducherry`, `suryan-salem`, `suryan-erode`, `suryan-vellore`.

Current [official About page](https://www.suryanfm.in/about-us/) remains reachable and identifies the terrestrial network; it did not establish city-specific Internet streams. Current selected Radio Browser searches return Chennai-labelled **HTTP** `http://radios.crabdance.com:8002/1`, `/2`, `/3`, previously cross-labelled between Hello and Suryan. These were not probed over HTTP, silently upgraded, proxied or spread across regional cards. The supplied historical `https://tamil.crabdance.com:8002/2` lead was already transport/identity-inconclusive in [Stage 9](stage9/SURYAN-REGIONAL-STREAMS.md); no fresh authentication resolved it.

[Broadcaster terms](https://www.suryanfm.in/terms-of-use/) were consulted; personal website access is not a general RadioBee direct-playback/redistribution licence. Current local/regional Internet mapping and use conditions remain blockers. Existing Nagercoil metadata is preserved. **Indian Suryan and Sri Lankan Sooriyan remain separate networks; all Sooriyan streams are unchanged.**

### Mirchi, Radio City and BIG FM — eleven regional records held

| IDs | Findings / blocker |
|---|---|
| `mirchi-chennai`, `mirchi-coimbatore`, `mirchi-madurai`, `mirchi-tiruchirappalli`, `mirchi-tirunelveli`, `mirchi-thiruvananthapuram` | Current [help centre](https://mirchi.in/helpcenter) exposes the ListenLive SDK; its linked `https://mirchi.in/radio` returned 404. SDK code, stories and playlists are not regional radio endpoints. Existing Club Mirchi **Mumbai** HLS and Uber Bollywood relay evidence is reused, not relabelled as Tamil city output. The Thiruvananthapuram service is not automatically a Tamil Nagercoil programme. |
| `radio-city-chennai`, `radio-city-coimbatore`, `radio-city-madurai` | Current [official site](https://www.radiocity.in/) publishes on-demand Hubhopper podcasts. These are not continuous local simulcasts. Historical Radio City Tamil web radio is a separate service; Chennai's `http://radios.crabdance.com:8002/5` remains an insecure, insufficiently authenticated lead. No Coimbatore/Madurai copy invented. |
| `big-chennai`, `big-puducherry` | Current [official site](https://www.bigfmindia.com/) exposes dated interviews/shows as MP3 files, not authenticated city radio. Radio Browser's `https://stream.zeno.fm/r2gn1pgm4qruv` has only a generic BIG/Tamil label and no publisher homepage. Prior decoding was reused; no new probe was justified before broadcaster/programme identity is established. |

No third-party app or directory label was treated as publisher authentication. No link was copied from TamilRadios. No DRM, login, geographic or access-control restriction was bypassed.

### Other seventeen records — four promoted, thirteen held

| ID | Outcome / exact relevant evidence |
|---|---|
| `air-thoothukudi` | **Promoted**; exact archived official channel restored after current manifest, segment and decoder success. |
| `east-fm-ca` | **Promoted**; current publisher **root** embeds the working stream, unlike its older `/main/` page. |
| `swiss-tamil-radio-ch` | **Promoted**; exact current publisher **usa20** configuration and bounded decode; no historical usa19 substitution. |
| `lotus-fm-za` | **Promoted**; exact nested official Lotus player entry and AAC decode, retaining template inconsistency and multilingual schedule limitations. |
| `annai-kuzhithurai` | Provider profile reachable; bounded HTML truncated before useful player settings, generic embed supplied no stream. Prior query-bearing Zeno startup failed with media error 4. No guessed query-stripped URL published. |
| `asr-kanyakumari` | Current publisher still references `https://cast1.asurahosting.com/proxy/asrdigit/live`; deep check timed out. Its separate HTTP Hindu/Christian/Muslim/Samy channels are not substitutes for the ASR general programme. |
| `christian-samy-fm` | Publisher specifically labels `http://stream.zeno.fm/zdyrvhfkeg8uv` ASR DIGITAL CHRISTIAN SAMY FM. An independently checked same-mount HTTPS request returned **401**. Not promoted, no authentication bypass; original HTTP source not fetched. |
| `kumari-tamil-kanyakumari` | Prior local identity/website research retained; no currently established operator-controlled endpoint to test. No claim the broadcaster closed. |
| `tamilosai-nagercoil` | Historical site/operator and direct stream unresolved; no substitution with BBC Tamilosai. |
| `isai-murasu-nagercoil` | Prior Rotary identity evidence retained; no authenticated live player established. No religious genre or live source inferred from directory labels. |
| `athavan-uk` | Official page reachable but bounded HTML truncated before useful player settings; historical Voscast source HTTP. No secure canonical endpoint established. |
| `cmr-tamil-ca` | About page timed out; reused Stage 12 root investigation found demo `josh_pan.mp3` and multilingual main-channel material. Neither is evidence for separate Tamil HD2. |
| `ctbc-ca` | Official homepage timed out; selected Radio Browser search had no matching result. Canonical secure source unresolved. |
| `ctr-ca` | Publisher fallback `https://stream.ctr24.com/live` returned **404**. Page explicitly references `https://ctr24-backend.vercel.app/api/settings`; current public settings provide **`http://198.27.66.225:8498/stream`**. HTTP numeric-IP source rejected without probing, proxying or inventing HTTPS. |
| `atbc-au` | Official site/about supports Tamil community identity, but bounded HTML truncates before a reviewed direct feed. Old HTTP player remains unresolved. Its scheduled CTR relay is not grounds to assign CTR's feed as ATBC. |
| `raaga-my` | Directory UUID `9cea9ca8-d69e-41fc-9031-9ebc751dcdf9` publishes `https://n06.rcs.revma.com/1ut6qwtbv4uvv`; **two seconds AAC decoded**. Official site/now-playing API identifies Raaga programming, but no exact primary-to-opaque-mount mapping was established. ICY name repeats only the opaque mount. **Held despite decoding**; not counted as an authentic promotion. |
| `tarana-tamil-nz` | Official rova page explicitly identifies Tarana Tamil, `radioApiStationId: 24-7-taranatamil`. Public configuration inspection did not resolve a direct media URL; large `_app` chunk truncated. No invented CDN URL, main Hindi Tarana substitution or access bypass. |

## Evidence and network checks

Reused Stage 6 named AIR mappings, Stage 9 major-network/local investigations, Stage 12 source/player work and the historical Radio Browser CSVs. Thirteen small selected current Radio Browser queries are recorded in [directory-leads.json](stage13/directory-leads.json); empty results are not proof that a broadcaster has no stream. Current bounded page statuses and truncation/errors are in [source-observations.json](stage13/source-observations.json). Only relevant new/failing candidates were probed; **the 224-feed audit was not repeated**.

Eight distinct candidate endpoints received deep checks: **five complete two-second decoder successes** (AIR Thoothukudi, Swiss Tamil Radio, EAST FM, Lotus FM and held Raaga), **three unsuccessful endpoints** (CTR fallback 404, Christian Samy HTTPS 401, ASR timeout). Four of the five decoded endpoints had sufficient documented publisher/programme association for trial integration. This is not eight stations added or five approved-use services.

Existing `safe-https.mjs` protections remain unchanged: HTTPS/TLS validation, public DNS destinations pinned to connections, redirect validation and private/non-global destination exclusion. Deep network deadline **35 seconds**; each transport request at most **10 seconds**, at most **five redirects**, serial requests, **128 KiB aggregate media budget per audit**. HEAD/fallback diagnostics are separately bounded. Decoder accepts only bounded in-memory bytes via **pipe**, limits output to **two seconds**, and has a separate **five-second process deadline**; the 35-second figure is not falsely presented as an end-to-end decoder deadline. HLS segment requests use the same safe transport. No keys, DRM workarounds, unauthorized proxies or unrestricted URL-fed FFmpeg.

Swiss and EAST were additionally checked through their actual publisher controls in the **available in-app browser**, not installed Chrome. Media currentTime advanced, paused was false, readyState was 4 and media error was null. Both players were stopped and the temporary tab closed. These observations establish brief browser decoding/progress, **not human-attested audibility, spoken station identity, Android compatibility or sustained continuity**. Ordinary browser buffering is separate from the audit's 128 KiB byte ceiling. Installed Chrome is not exposed by this session's browser inventory; Android/native HLS was unavailable. AIR and Lotus browser playback remain not-tested.

No broadcast audio, PCM captures or copyrighted recording files were saved. Only scalar technical evidence is public; raw page/configuration scratch files remain ignored under `reports/stage13-*`. Public WordPress nonces, advertising identifiers and query-bearing delivery URLs are excluded from published evidence. No network operation was added to normal tests, CI or deployment.

Historical CSV SHA-256 values remain unchanged:

* `reports/radio_browser_tamil.csv`: `ba37085a3276fb71da0455e50635d2e76aae1dffe165e9479d00da3461a8b5e0`
* `reports/radio_browser_tamil_ffmpeg.csv`: `680accdf197a19586e2bd706006ec861e5f2673da3047cc547b46c324d553b43`

## Compatibility, tests and review limitations

Schema v1, MP3/AAC/HLS formats and client playback contract are unchanged. No client checkout edits or playback-policy changes. After a separately reviewed deployment, the catalogue can expose four additional trial cards under an existing permissive trial configuration; **47 stream-bearing records does not guarantee 47 playing stations**, and all production-use permission counts remain zero. No live site or release was changed.

Regression tests check all 49 review identities, exact 92-ID preservation, all 43 baseline station objects/46 streams, old source and network objects, locale and PNG hashes, correct regional metadata, URL uniqueness, provenance, permissions, restoration reconstruction and manifest counts. Stage 12's dated assertions use an explicitly reconstructed pre-Stage-13 view; Stage 13 independently validates the real current catalogue. Older provenance tests now recognize the explicit Stage 13 inventory, and the shared network artwork fixture uses Hello, which still has children in both arrays after the last AIR discovery record was restored.

Final required checks run through existing **WSL2 Ubuntu Linux Node v24.16.0**:

| Check | Result |
|---|---|
| `npm run validate` | Exit 0; catalogue references, streams, manifest counts and en/ta/sa locale parity valid. |
| `npm test` | Exit 0; **100 tests, 100 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo**. Includes existing offline transport, DNS/SSRF, Python audit-preservation and CSV-formula regressions. |
| `npm run build` | Exit 0; static catalogue built with existing artwork. |
| `git diff --check` | Exit 0; no whitespace errors. |

Remaining blockers: major-network regional feed authentication and scope, current stable secure sources for failed/insecure services, fresh independent spoken identification, longer continuity/browser/Android HLS checks, broadcaster use-condition review and a reviewed deployment. A good Raaga decode alone cannot close its mapping gap. No claim that unresolved networks never offer Internet streams.

## Complete file inventory

Eleven tracked files modified by Stage 13:

* `data/v1/discovery-stations.json`
* `data/v1/index.json`
* `data/v1/sources.json`
* `data/v1/station-migrations.json`
* `data/v1/stations.json`
* `docs/research/station-backlog.json`
* `tests/discovery-integration.test.mjs`
* `tests/internet-catalogue.test.mjs`
* `tests/logo-assets.test.mjs`
* `tests/stage12-expansion.test.mjs`
* `tests/stage6.test.mjs`

Ten new untracked Stage 13 files:

* `docs/STAGE13-TAMIL-FM-NETWORK-EXPANSION.md`
* `docs/stage13/baseline.json`
* `docs/stage13/directory-leads.json`
* `docs/stage13/discovery-review.json`
* `docs/stage13/promotions.json`
* `docs/stage13/source-observations.json`
* `docs/stage13/technical-checks.json`
* `docs/stage13/user-playback.json`
* `tests/catalogue-history.mjs`
* `tests/stage13-expansion.test.mjs`

Three pre-existing untracked files retained untouched, not part of these fixes:

* `docs/README-HELLO-CHENNAI-STAGE12.md`
* `scripts/apply-hello-chennai-stage12.py`
* `scripts/fix-stage12-hello-chennai-migration.py`

All work remains uncommitted for review. No workflows, dependencies, client files, network records or artwork files were modified.
