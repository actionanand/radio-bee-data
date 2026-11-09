| Metric | Before | After | Difference |
|---|---:|---:|---:|
| New distinct station identities in this stage | 0 | 7 | +7 |
| Total discoverable stations | 85 | 92 | +7 |
| Stream-bearing stations | 35 | 43 | +8 |
| Discovery-only stations | 50 | 49 | -1 |
| Stream URLs | 38 | 46 | +8 |
| Hello FM stream-bearing stations | 0 | 1 | +1 |
| Published network artwork | 0 | 11 | +11 |
| Published station artwork | 0 | 0 | 0 |
| Discovery-only stations promoted | 0 | 1 | +1 |
| Networks | 41 | 47 | +6 |
| Production-eligible stations | 0 | 0 | 0 |

# Stage 12 — Tamil radio expansion and original artwork

Prepared 9 November 2026. Catalogue **1.7.0**, schemaVersion **1**. Branch `feature/12-tamil-radio-expansion-artwork`, based on freshly fetched remote master `74653a9ce983e48c5fee9f9e042bc77c5a95115c`. Clean baseline verified before implementation; Stage 11 history retained. Changes are intentionally uncommitted for review. No push, PR, merge, deployment or client modification.

**Partial target achievement:** seven new stream-bearing identities against a goal of ten (shortfall three); one promotion against a goal of five (shortfall four). These are actual published-array changes, not counts of decoded research rows. All seven are **unverified trial candidates**, not approved-use or browser-audible verified services. No claim of an exhaustive worldwide search or maximum possible catalogue is made.

## Accepted services and exact endpoints

All checks below used the existing manual deep audit through Linux Node in WSL2. All seven returned `audio/mpeg`, passed MP3 signature/codec checks, and produced **32,000 PCM bytes = two seconds at the audit's 8 kHz mono s16 output**, with FFmpeg exit 0. Input was bounded media bytes piped to FFmpeg, never a URL. This proves short decoding, not sustained playback, audible broadcaster identification or a licence. Check timestamps, input codec characteristics, CORS, redirects and evidence are preserved in [machine-readable inventory](stage12/stations.json). All seven had no HTTP redirects in these checks.

| New ID / name | Exact stream URL | Evidence / geography | Technical result |
|---|---|---|---|
| `shiva-tattvam` — Shiva Tattvam | https://radio.shaivam.org/listen/shiva-tattvam/radio.mp3 | [Official Tamil discourse channel](https://shaivam.org/radio-shiva-tattvam/); [official app channel descriptions](https://shaivam.org/about-shaivam/shaivam-mobile-app-features/); same publisher stream domain. India from matching historical Radio Browser UUID, no city claimed. | 2026-11-09 13:14:14 UTC; GET 206; MP3 128 kbps, 44.1 kHz stereo; two seconds decoded. CORS absent. |
| `thiruneriya-thamizhosai` — Thiruneriya Thamizhosai | https://radio.shaivam.org/listen/thiruneriya-thamizhosai/radio.mp3 | [Official 24/7 Tamil music channel](https://www.shaivam.org/radio-thiruneriya-thamizhosai/), separately distinguished from the discourse service. India from matching historical Radio Browser UUID; no city claimed. | 13:14:19 UTC; GET 206; MP3; two seconds decoded. CORS absent. |
| `star-fm-srilanka` — Star FM Sri Lanka | https://stream.starfm.lk:12025/stream | [Publisher's Live Radio page](https://www.starfm.lk/) embeds this exact endpoint, publishes Tamil content and Sri Lankan identity/contact. Online service; no terrestrial frequency, city or affiliation with unrelated Star brands inferred. | 13:14:24 UTC; GET 200; MP3; two seconds decoded; CORS `*`. |
| `boom-tamil` — Boom Tamil | https://streaming.boomtamil.com/toronto | [Publisher website](https://www.boomtamil.com/) player chunk `/_next/static/chunks/15m-mp9ye5nby.js` publishes lowercase `/toronto`. Historical Radio Browser Canada/Ontario attribution corroborated by publisher Toronto mount/Canadian coverage. No studio locality or unique FM city broadcast claimed. | 13:17:12 UTC; GET 200; MP3 192 kbps; two seconds decoded; CORS `*`. |
| `tamil-panpalai` — Tamil Panpalai | https://tamilpanpalai.radioca.st/stream | [Publisher player configuration](https://tamilpanpalai.com/assets/js/player.js) lists this universal service plus ANZ/AFR variants; only one identity added. [Matching India directory listing](https://radioindia.org/tamil-panpalai-india/) corroborates country. Precise Madurai attribution deliberately omitted. | 13:17:13 UTC; GET 200; MP3; two seconds decoded; CORS `*`. |
| `aural-radio` — Aural Radio Kerala | https://live.auralradiokerala.in/auralradio/mp3 | [Publisher configuration](https://www.auralradiokerala.in/js/player.js) publishes exact endpoint. [Linked publisher Zeno profile](https://zeno.fm/radio/auralradiokerala/) identifies India and Malayalam/Tamil/Hindi. Multilingual, not Tamil-only; Kerala association, no city inferred. | 13:17:18 UTC; GET 200; MP3; two seconds decoded; CORS `*`. |
| `ar-radio` — AR Radio Kerala | https://eu8.fastcast4u.com/proxy/arradio/stream | [Publisher LISTEN LIVE widget](https://arradiokerala.blogspot.com/) publishes exact endpoint. [Matching directory](https://spinnradio.com/station/ar-radio) corroborates Kerala/India and Hindi/Malayalam/Tamil. Tamil inclusion has directory support; sampled programme language was not independently heard. | 13:19:17 UTC; GET 200; MP3; two seconds decoded; CORS `*`. |

Each stream uses a unique `<station-id>-mp3-trial` ID. Source records `stage12-<station-id>` attribute publisher identity/endpoint evidence; separate `stage12-<station-id>-metadata` sources identify secondary geography/language evidence where applicable. New entries have null frequency/district/locality, online delivery and global Internet coverage. This does not imply global availability or local FM coverage. The two Shaivam programmes share one network, with distinct mounts and editorial purposes. No duplicate city cards or alternative mounts counted as new services.

**All seven:** `verificationStatus: unverified`, `lastVerifiedAt: null`, `rightsStatus: unconfirmed`, `directListening.status: needs-review`, recording and redistribution `unconfirmed`. Public publisher players establish association, not RadioBee permission. No express RadioBee-specific allowance located; stream-specific terms still require review. No permission status was upgraded. Original 35 station objects, all 38 previous stream records, the other 49 discovery objects and all three locales remain unchanged; the restored hello-chennai historical migration and backlog entries have been reconciled; hello-chennai was deliberately promoted while keeping its stable ID, checked against the baseline snapshot. AIR Nagercoil's primary and Bitgravity alternative remain exact.

## Hello FM and promotions

The **baseline has eleven Hello FM discovery entries**. Exactly one, `hello-chennai`, is now promoted under its existing ID. The remaining ten stay discovery-only:

| Existing ID | Outcome |
|---|---|
| `hello-nagercoil` | Held: no authenticated local Internet feed; no invented local frequency or Openstream assignment. |
| `hello-chennai` | **Promoted to stream-bearing trial**: Openstream 4428 AAC, user-reported Chennai identity, independently authenticated broadcaster mapping and permission still unconfirmed. |
| `hello-coimbatore` | Held: no independently established matching regional endpoint. |
| `hello-madurai` | Held: no independently established matching regional endpoint. |
| `hello-tiruchirappalli` | Held: no independently established matching regional endpoint. |
| `hello-tirunelveli` | Held: no independently established matching regional endpoint. |
| `hello-thoothukudi` | Held: no independently established matching regional endpoint. |
| `hello-salem` | Held: no independently established matching regional endpoint. |
| `hello-puducherry` | Held: no independently established matching regional endpoint. |
| `hello-erode` | Held: no independently established matching regional endpoint. |
| `hello-vellore` | Held: no independently established matching regional endpoint. |

`https://hellofm.in/` and `https://www.hellofm.in/` both failed with connection refused to their publicly resolved HTTPS destination in this environment. Official site/app/player discovery and directory/search leads did not supply an authenticated broadcaster-to-Openstream mapping or a reliable regional assignment. No official website field was filled with an unconfirmed URL. Same-name Hello stations in Ghana, Japan and the UK are unrelated leads, not Tamil service evidence.

`https://listen.openstream.co/4428/audio` **did** follow a safe HTTPS 302 to an Openstream delivery host, return HTTP 200 `audio/aacp`, and decode two seconds of AAC at 13:14:28 UTC. CORS was absent. Its dynamic query-bearing resolved URL is intentionally not copied into public data/reports. A 2023 Chennai stream community report associates collection 4428 with Hello FM; the user expressly identified this feed as Chennai-only. This supports a cautious **unverified Chennai-only trial** under the existing `hello-chennai` ID, not a verified broadcaster mapping or use authorization. No other Hello FM city is assigned this URL. Source evidence is recorded in `sources.json` and [the promotion review](stage12/hello-chennai.json). Browser/Android playback is still untested.

Other potential promotions revisited: [EAST FM](https://eastfm.ca/main/) official site confirms multilingual Toronto service but this bounded player inspection did not establish a direct endpoint; [CMR](https://cmr24.net/) exposes a demo `josh_pan.mp3` and multilingual main-channel material, not evidence for the dedicated Tamil HD2 feed; [ATBC](https://www.atbc.net.au/) website is reachable, but a matching secure direct feed remains unresolved. Their existing IDs and discovery metadata remain intact. Existing regional backlog evidence was reused rather than recasting previously failed city feeds as new radios.

## Other rejected/held candidates

| Candidate | URL / evidence | Decision |
|---|---|---|
| Vanavil network services | [Official site](https://vanavilfm.com/) | Expressly prohibits third-party website/app use without permission. Excluded, including apparent easy quota-filling music variants. No decoding success overrides this restriction. |
| Universal Health Radio Tamil | `https://radio.universalhealthradio.org/uhr-ta.mp3`; [current publisher site](https://universalhealthradio.org/) | Current site describes device speech synthesis rather than streamed audio. Historical URL not treated as a current authenticated station. |
| Kalai FM | `https://stream.zenolive.com/2vghnwshsqzuv.aac`; historical `http://kalaifm.in/` lead | Current HTTPS hostname fails DNS; current publisher/identity and use review unresolved. No new feed added on the old decode alone. |
| AR Radio historical alternative | `https://free.rcast.net/200660` | Current bounded request HTTP 403. Not added; exact publisher Fastcast endpoint independently decoded and integrated instead. |
| Boom Tamil capitalized mount | `https://streaming.boomtamil.com/Toronto` | Decoded MP3, but publisher configuration specifies lowercase `/toronto`. Only the exact published lowercase endpoint is integrated. No redundant alternative or second identity. |
| Tamil Panpalai regional mounts | `https://tamilpanpalai.radioca.st/afr`, `https://tamilpanpalai.radioca.st/anz` | Published configuration leads only; no independent schedule/identity/playback review. Not separately added or counted. |
| Radio Gilli UAE | [Official programme site](https://www.radiogilli.com/home.html), [identity](https://www.radiogilli.com/about-us.html) | Tamil/UAE broadcaster identity supported; bounded site/configuration inspection did not establish a reviewed direct endpoint. Held outside published additions. |
| Other AIR local/FM alternatives | Historical directory leads | No new official channel mapping established in this stage; do not equate an AM programme with a differently named city FM service. Existing AIR records retained. |

The historical 224-row CSVs were read as discovery leads, not rerun or copied into publication. SHA-256 remained byte-for-byte:

* `reports/radio_browser_tamil.csv`: `ba37085a3276fb71da0455e50635d2e76aae1dffe165e9479d00da3461a8b5e0`
* `reports/radio_browser_tamil_ffmpeg.csv`: `680accdf197a19586e2bd706006ec861e5f2673da3047cc547b46c324d553b43`

## Artwork actually added

**Eleven original unbranded RadioBee illustrations; zero official broadcaster logos.** Existing Stage 11 favicon/media-kit reviews did not establish a reusable publication basis. No public image or broadcaster trademark was copied or imitated. Each illustration depicts the same original receiver geometry with a distinct editorial palette. It is generic radio imagery, not an authentic network badge. MIT usage basis; source design/generator retained in `scripts/create-radio-artwork.ps1`. No font, external photo, AI asset or dependency download is required.

All assets are transparent-padded **512 × 512 PNG**, local under `assets/logos/networks/`, **335,236 bytes combined**, each below 256 KiB. See [per-asset inventory](stage12/artwork.json), including dimensions, exact bytes, palettes, generator and usage basis.

| Network | Filename | Bytes | Type / basis |
|---|---|---:|---|
| Akashvani | `akashvani-radio.png` | 30209 | Original unbranded / MIT |
| Hello FM | `hello-fm-radio.png` | 31335 | Original unbranded / MIT |
| Suryan India | `suryan-in-radio.png` | 30460 | Original unbranded / MIT |
| Sooriyan Sri Lanka | `sooriyan-lk-radio.png` | 30628 | Original unbranded / MIT |
| Mirchi | `mirchi-radio.png` | 29837 | Original unbranded / MIT |
| Radio City | `radio-city-radio.png` | 30666 | Original unbranded / MIT |
| BIG FM | `big-fm-radio.png` | 30952 | Original unbranded / MIT |
| RED FM | `red-fm-radio.png` | 30350 | Original unbranded / MIT |
| Shaivam | `shaivam-radio.png` | 30286 | Original unbranded / MIT |
| Star FM Sri Lanka | `star-fm-lk-radio.png` | 31087 | Original unbranded / MIT |
| Boom Tamil | `boom-tamil-radio.png` | 29426 | Original unbranded / MIT |

One shared `network.logoPath` per illustration; no redundant station overrides. **59 of 92 cards** resolve network illustrations after publication; remaining 33 retain client fallback. Suryan India and Sooriyan Sri Lanka remain separate networks, identities and image files. Artwork grants no playback permission.

All eleven images were fully decoded with System.Drawing, traversing every pixel; deterministic tests also inflate and reconstruct every PNG scanline, checking alpha padding and opaque centre pixels. The receiver design was visually inspected at full size, with essential shapes safely inside the circular framing; palettes reuse identical framing. Actual mobile-device visual testing remains a review action.

## Client compatibility and actual visibility

Read-only review of the existing sibling client's `catalog.models.ts`, `stream-eligibility.ts`, `station-artwork.ts` and production environment confirms the additive v1 model and station → network → fallback artwork priority. Exact paths resolve below `https://actionanand.github.io/radio-bee-data/v1/`, not the app origin. The tests verify built bytes at those same paths.

With the inspected client trial configuration (`AllowUnverified: true`, verification/rights checks disabled by existing client configuration), supported MP3/player capability can admit the seven additional trial cards to Listen now. **43 stream-bearing is not a guarantee of 43 playing stations.** A strict permission configuration admits none of the seven. Expressly restricted sources remain excluded. No client setting or playback rule was changed to inflate counts.

After a reviewed deployment and refresh, All stations can show **92** records and **59** cards can use new imagery. This feature branch is not deployed; the live app/data site remains unchanged by this work. No claim that the live site already shows these additions.

Actual Chrome playback was attempted through the available browser automation entry point, which returned **“Browser is not available: chrome”**. Therefore all seven browser and Android playback fields remain **not-tested**. CORS absence on Shaivam requires player-specific review; wildcard CORS on other feeds still is not audible playback proof. No workaround, new browser installation, geo bypass or security relaxation was used. Client compatibility was reviewed against source contracts, not a deployed end-to-end release.

## Security, preservation and validation

Manual requests retained public-DNS pinning, HTTPS/TLS verification, per-hop redirect checks including HLS child policy, 5-redirect limit, serial candidate processing, bounded timeouts and 128 KiB media budget per deep audit. FFmpeg received bytes only, was time-limited and emitted at most two seconds of PCM to memory. No broadcast recordings or binary test captures were saved. No Stage 11 transport, FFmpeg or CSV-escaping protection changed; no automatic network probe was added to tests/CI/deployment. The only new binaries are the original PNG illustrations.

Ignored local diagnostic files stay under `reports/stage12-*`; only sanitized scalar technical evidence is in `docs/stage12/stations.json`. Dynamic resolved query URLs and raw CSVs are not public artifacts. Build allowlist and tests exclude research/docs/reports from `dist`. Dependencies, workflows, schemas, locations, language IDs, artwork rights of existing brands and all baseline stream policies are unchanged.

Final checks used **WSL2 Ubuntu Linux Node v24.16.0**, with existing installed dependencies:

| Command / check | Result |
|---|---|
| `npm run validate` | Exit 0; catalogue references, streams, counts and en/ta/sa locale parity valid. |
| `npm test` | Original Stage 12 run: **93 passed** before the Hello Chennai promotion. **Full test rerun required** after this follow-up; the new regression test increases the suite size. |
| `npm run build` | Exit 0; static `dist/v1` and landing page built. |
| `git diff --check` | Exit 0; no whitespace errors. |
| Original PNG raster decode | All 11 decoded; full-pixel traversal and deterministic scanline reconstruction passed. |
| Historical CSV preservation | Both SHA-256 values above unchanged. |

The first test pass exposed an assertion based on the request's nine Hello entries; actual data contains eleven. The assertion was corrected to eleven. A subsequent whitespace check exposed mixed CRLF endings on changed test lines; these were normalized. Final results above are after corrections, not the failed intermediate runs.

### Complete modified and untracked file inventory

Ten modified tracked files:

* `data/v1/index.json`
* `data/v1/networks.json`
* `data/v1/sources.json`
* `data/v1/stations.json`
* `docs/STATION-LOGOS.md`
* `tests/discovery-integration.test.mjs`
* `tests/internet-catalogue.test.mjs`
* `tests/stage11-network-streams.test.mjs`
* `tests/stage6.test.mjs`
* `tests/worldwide-discovery.test.mjs`

Seventeen new untracked files for review:

* `data/v1/assets/logos/networks/akashvani-radio.png`
* `data/v1/assets/logos/networks/big-fm-radio.png`
* `data/v1/assets/logos/networks/boom-tamil-radio.png`
* `data/v1/assets/logos/networks/hello-fm-radio.png`
* `data/v1/assets/logos/networks/mirchi-radio.png`
* `data/v1/assets/logos/networks/radio-city-radio.png`
* `data/v1/assets/logos/networks/red-fm-radio.png`
* `data/v1/assets/logos/networks/shaivam-radio.png`
* `data/v1/assets/logos/networks/sooriyan-lk-radio.png`
* `data/v1/assets/logos/networks/star-fm-lk-radio.png`
* `data/v1/assets/logos/networks/suryan-in-radio.png`
* `docs/STAGE12-TAMIL-RADIO-EXPANSION.md`
* `docs/stage12/artwork.json`
* `docs/stage12/baseline.json`
* `docs/stage12/stations.json`
* `scripts/create-radio-artwork.ps1`
* `tests/stage12-expansion.test.mjs`

Ignored `reports/stage12-*` scratch scripts, public-page diagnostics and test transcripts are local research, not Git changes or deployment artifacts. Historical excluded research remains excluded.

### Remaining review actions

1. Verify real browser/Android playback and longer continuity for all seven; confirm spoken identity/programme language where needed, especially the multilingual Kerala services.
2. Review stream-specific direct-listening terms with the publishers. Recording and redistribution remain unconfirmed; no approved-use station was added.
3. Confirm the current Hello Chennai on-air identity, client playback and use restrictions before claiming this trial verified or approved; do not assign this Openstream URL to another Hello city without matching evidence.
4. Resolve three further distinct services and five legitimate promotions to meet the aspirational targets; restricted or unidentified feeds cannot fill the gap.
5. Review the original artwork at actual mobile card sizes and distinguish generic illustrations from official broadcaster logos in any editorial description.
6. Review and authorize a later commit/publication separately. No live-site results or client release were validated in this data-only task.


### Stage 12 follow-up — Chennai Hello FM trial (9 November 2026)

Promoted the **existing** `hello-chennai` metadata-only record (not a new station).
The broadcaster is listed by India's March 2026 MIB inventory as Hello FM Chennai 106.4 MHz.
A 2023 comment in a Chennai FM streaming list associates Openstream `4428` with Hello FM,
and the user independently identifies the stable `https://listen.openstream.co/4428/audio`
URL as Chennai-only. The original Stage 12 report documents a safe HTTPS redirect,
HTTP 200 `audio/aacp`, and two seconds of AAC decoding. This follow-up does not
claim an additional live playback test or authenticated broadcaster feed.
The endpoint is published **unverified**, `rightsStatus: unconfirmed`,
`directListening: needs-review`, recording and redistribution unconfirmed.
The other ten Hello FM discovery IDs and every prior stream are unchanged.

Counts after this promotion: **92 total = 43 stream-bearing + 49 discovery-only**,
**46 stream URLs**, **11 original generic network illustrations**. Seven genuinely new
station identities, one existing station promotion, and zero newly approved-use stations.
Run `npm run validate`, `npm test`, and `npm run build` against the full working tree
before committing; browser and Android playback remain to be tested.


### Hello Chennai restoration bookkeeping correction

The old `hello-chennai` entry was removed from `data/v1/station-migrations.json` and `docs/research/station-backlog.json` because the same ID is active again in `stations.json`. Its original historical entries and positions are preserved under `docs/stage12/hello-chennai.json` for provenance and baseline-reconstruction tests. No other archived station entry was changed. The stream remains an unverified Chennai-only trial with unconfirmed rights.
