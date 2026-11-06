# Stage 6 — full-catalogue streaming discovery

Reviewed 6 November 2026. Catalogue **1.3.0**, schema v1. Exactly **88** stable station records, **26** candidate URLs across **25** stations (previously 10 across 9). One historical technical verification retained; no new verified flags or rights grants. Artwork and client checkout untouched.

## Exact station outcomes

| Category | Stations |
| --- | --- |
| in-app-playback-ready | 0 |
| browser-audible-awaiting-use-review | 1 |
| reachable-not-decoded | 24 |
| incorrect-station-identity | 0 |
| unavailable-down | 3 |
| no-known-stream | 60 |
| restricted-source | 0 |

These categories are mutually exclusive and total 88. Browser-audible-awaiting-use-review is **Sooriyan only, based on an explicitly historical user report from the Stage 4 handoff** (user heard approximately 20 seconds on 6 November; exact timestamp unknown). Stage 6 does not independently attest hearing it. The current official browser player advanced from 0.861944 to 8.584129 seconds, readyState 4, no error; the tab was closed. This verifies desktop playback progress, not current human audibility, correct programme content, Android or RadioBee integration. Every row separately exposes current audible playback as not-tested. Do not read the category count as a fresh listening certification.

Incorrect-station-identity requires independent proof, not merely a suspicious name/mount. Radio Browser's radiomirchibengaluru points to a RADIO_SUNO_MELODY_S06 mount; assignment is rejected pending evidence, but this conflict alone is not treated as confirmed wrong content. Thus it remains no-known-stream, with the rejected lead recorded. Restricted-source requires an express direct-app restriction; unresolved website/material terms are recorded as needs-review rather than automatically treating all public listening as banned.

## Deliverables and reproducibility

[All 88 station records: JSON](stage6/stations.json) and [CSV](stage6/stations.csv) include identity/network, source confidence, country/geography, language/genre, confirmed-or-null frequency, website/scope, existing and new candidates, additional/rejected leads, dated audit results, MIME/signatures, redirects/TLS, HLS segment results, codec/bitrate limitations, browser evidence, terms review and direct-listening blockers. They contain metadata only, no audio or expiring credentials. CSV quotes nested JSON fields to preserve detailed evidence. Both files are review artifacts, not automatic production approval lists.

Generate the report manually with Linux Node: `node scripts/stage6-inventory.mjs`. It reads existing reports/stage6-deep-audit.json, stage6-extra-audit.json, stage6-official-sites.json, stage6-radio-browser.json, stage6-air-channels.json and optional stage6-browser.json. Raw network observations remain ignored under reports/. Rebuilding without those inputs produces an explicitly untested inventory, not live tests. Deterministic unit tests use mocks/snapshots; this command is not in CI.

## Evidence-backed catalogue updates

Added 16 exact named Akashvani player mappings, with source air-stage6-player: Coimbatore (243), Madurai (247), Tiruchirapalli (250), Tirunelveli (252), Kodaikanal (246), Ooty (249), Tuticorin (254), Puducherry (216), Karaikal (215), Kochi (134), Calicut (135), Trissur (138), Kannur (132), Devikulam (131), Raagam (4), Vividh Bharati (1). Exact source URLs and channel names are in each matching JSON inventory row. Calicut/Kozhikode, Trissur/Thrissur and Tuticorin/Thoothukudi are place aliases; distinct Real FM/Rainbow/FM services were not silently substituted. Existing regional Tamil service was not copied into Chennai or other cities. General Chennai, Thiruvananthapuram, Hyderabad, Bengaluru, Mumbai, Malayalam and Vellore records without unambiguous service mapping retain no guessed feed.

The official Tuticorin mapping returned **404** during this investigation. It remains an explicitly unverified discovery candidate, not an available broadcast; refresh with broadcaster before use. The same applies to transient endpoint health generally. Website metadata now includes official broadcaster homepages for Mirchi, Radio City, BIG, RED, Club, SLBC, Indian Suryan and Shakthi, and the official AIR live-radio page. Network homepage is labelled network scope in the inventory; it does not confirm a particular seed city transmitter. Hello/Fever domains failed/refused or returned 503, so unconfirmed station website fields remain null. Existing confirmed frequencies and identities are unchanged. No stream/API URL was inserted as a website. Source provenance added for changed network website metadata.

Primary sources: [Akashvani live configuration](https://akashvani.gov.in/radio/live.php), [Mirchi](https://mirchi.in/), [Radio City](https://www.radiocity.in/), [BIG](https://www.bigfmindia.com/), [RED](https://www.redfmindia.in/), [Club](https://www.clubfm.in/). Radio City's and BIG's homepage MP3 references were programme clips/podcasts, not evidence of continuous city radio; they were not imported as live streams. Source absence in bounded homepage scanning is not proof no stream exists. City affiliation/language/genre on candidate seed rows remains editorial uncertainty, shown per row.

## Research coverage and manual checks

Read all prior Stage 4 documentation and reports, the local supplied research sidecar, existing sources, all 88 records and 18 networks. Retrieved the official AIR configuration (277 named mappings) and bounded metadata from the known broadcaster websites. Queried [Radio Browser](https://docs.radio-browser.info/) with descriptive RadioBee User-Agent for Nagercoil, Kumari, Annai, ASR, SLBC, Capital, Shakthi, Sooriyan, Luminous, Suryan, Hello FM, Mirchi, Radio City, BIG FM, Fever and Club FM; added country-filtered searches for priority unresolved services. Queries were bounded, and directory country/codec/availability claims were never automatically imported. No TamilRadios links were used. Authentication/query-bearing directory URLs were withheld instead of copied or stripped into guessed URLs. Search limits and inconsistent directory metadata mean this is not proof of exhaustive worldwide coverage or absence.

Expanded deep audit: **2026-11-06T16:26:02.320Z through 2026-11-06T16:27:21.736Z UTC**. 32 distinct catalogue/research endpoints, **28 reachable/playlist/segment-stage outcomes and 4 failures**, exit zero. Two later directory alternates were bounded-audited separately: historical Nagercoil alternate HLS and an SLBC Tamil-labelled Zeno mount. Both responded; neither association was independently confirmed or promoted to production. Nagercoil alternate is not a second city broadcast. SLBC's directory mount remains outside the production stream array because the official broadcaster connection is unconfirmed.

Failures: official Tuticorin HLS **HTTP 404**; old ASR HTTPS lead **HTTP 404**; Isai **getaddrinfo ENOTFOUND stream.tamilocean.com**; third-party Suryan Chennai **request timeout/aborted at transport deadline**. Star's lead returned media-like bytes but did not resolve owner/identity or use rights; not attached to a station simply because its host name matches. Existing Shakthi /index.html and /stream returned AAC-like data; exact legacy /stream attribution remains weaker than official-player provenance. Indian Suryan is kept distinct from Sri Lankan Sooriyan.

FFmpeg is unavailable in this WSL2 environment; no dependency was installed. Decoding is not-tested, not passed. MP3/AAC and HLS are byte/playlist observations. ICY bitrate is a server declaration, not measured fidelity; no throughput was called codec bitrate. HLS samples were bounded and discarded. No recordings, rebroadcasts, proxies, geofence/access-control bypass or stream keys were retained. Actual subjective audibility/programme identity needs an authorized human listening session. No claims of 88 playable stations or final global maximum are made.

## Listening-use contract for the separate client release

Optional stream.directListening = {status, reviewedAt, sourceId, notes, recording, redistribution}. Status is needs-review, restricted or allowed; recording/redistribution are independently unconfirmed, prohibited or permission-granted. All 26 current policies are **needs-review**; all recording/redistribution and legacy rightsStatus values remain **unconfirmed**. Technical verification, official association, direct end-user use and recording/rebroadcast grants are distinct decisions. Missing policy does not mean allowed. Allowed requires verified playback and official use-evidence provenance in validation, plus an editor's actual review of applicable terms; a generic official page is not substantive permission merely because it passes structural checks. A newer client's release guard must also check platform compatibility, identity, freshness, territories and any restrictions. directListeningReady is a narrow proposed eligibility predicate assuming validated/editor-approved data, not automatic authorization or a full client playback check.

[Prasar Bharati terms](https://prasarbharati.gov.in/en/terms-conditions/) restrict website material uses and redistribution/modification; stream-specific application of those conditions still needs review. [Suryan terms](https://www.suryanfm.in/terms-of-use/) and other broadcaster terms must be reviewed for the actual app context. Public Listen Live does not automatically authorize an independent app, but lack of a RadioBee-specific grant is not asserted to prohibit every form of personal direct listening. No policy is used to override express restrictions or grant recording rights. No commercial/government material is assumed public domain.

The stream schema adds only the optional object. Required seven legacy stream fields, stable IDs, v1 URLs, translation keys and old rights enums remain unchanged. Existing clients should continue their existing strict gate and ignore this optional field; new clients may adopt reviewed direct-listening policy only in their independently tested release. No client checkout was read/modified and no coordinated client release is claimed. The prior streamLabel issue remains: verified-but-needs-review must not say playable/available. Logo fields/assets are untouched. New optional metadata introduces no automatic data migration or approval transition.

## All-station review index

| Station ID | Broadcaster | Country | Language tags | Outcome | Catalogue candidates |
| --- | --- | --- | --- | --- | --- |
| air-nagercoil | Akashvani (All India Radio) | IN | ta,en | reachable-not-decoded | 1 |
| air-chennai | Akashvani (All India Radio) | IN | ta | no-known-stream | 0 |
| air-coimbatore | Akashvani (All India Radio) | IN | ta | reachable-not-decoded | 1 |
| air-madurai | Akashvani (All India Radio) | IN | ta | reachable-not-decoded | 1 |
| air-tiruchirappalli | Akashvani (All India Radio) | IN | ta | reachable-not-decoded | 1 |
| air-tirunelveli | Akashvani (All India Radio) | IN | ta | reachable-not-decoded | 1 |
| air-kodaikanal | Akashvani (All India Radio) | IN | ta | reachable-not-decoded | 1 |
| air-ooty | Akashvani (All India Radio) | IN | ta | reachable-not-decoded | 1 |
| air-thoothukudi | Akashvani (All India Radio) | IN | ta | unavailable-down | 1 |
| air-vellore | Akashvani (All India Radio) | IN | ta | no-known-stream | 0 |
| air-puducherry | Akashvani (All India Radio) | IN | ta | reachable-not-decoded | 1 |
| air-karaikal | Akashvani (All India Radio) | IN | ta | reachable-not-decoded | 1 |
| air-thiruvananthapuram | Akashvani (All India Radio) | IN | ml | no-known-stream | 0 |
| air-kochi | Akashvani (All India Radio) | IN | ml | reachable-not-decoded | 1 |
| air-kozhikode | Akashvani (All India Radio) | IN | ml | reachable-not-decoded | 1 |
| air-thrissur | Akashvani (All India Radio) | IN | ml | reachable-not-decoded | 1 |
| air-kannur | Akashvani (All India Radio) | IN | ml | reachable-not-decoded | 1 |
| air-devikulam | Akashvani (All India Radio) | IN | ml | reachable-not-decoded | 1 |
| air-bengaluru | Akashvani (All India Radio) | IN | kn | no-known-stream | 0 |
| air-hyderabad | Akashvani (All India Radio) | IN | te | no-known-stream | 0 |
| air-new-delhi | Akashvani (All India Radio) | IN | hi | no-known-stream | 0 |
| air-mumbai | Akashvani (All India Radio) | IN | mr | no-known-stream | 0 |
| air-tamil | Akashvani (All India Radio) | IN | ta,en | reachable-not-decoded | 1 |
| air-malayalam | Akashvani (All India Radio) | IN | ml | no-known-stream | 0 |
| air-vividh-bharati | Akashvani (All India Radio) | IN | hi | reachable-not-decoded | 1 |
| air-raagam | Akashvani (All India Radio) | IN |  | reachable-not-decoded | 1 |
| suryan-nagercoil | Suryan FM | IN | ta | no-known-stream | 0 |
| suryan-chennai | Suryan FM | IN | ta | unavailable-down | 0 |
| suryan-coimbatore | Suryan FM | IN | ta | no-known-stream | 0 |
| suryan-madurai | Suryan FM | IN | ta | no-known-stream | 0 |
| suryan-tiruchirappalli | Suryan FM | IN | ta | no-known-stream | 0 |
| suryan-tirunelveli | Suryan FM | IN | ta | no-known-stream | 0 |
| suryan-thoothukudi | Suryan FM | IN | ta | no-known-stream | 0 |
| suryan-puducherry | Suryan FM | IN | ta | no-known-stream | 0 |
| suryan-salem | Suryan FM | IN | ta | no-known-stream | 0 |
| hello-nagercoil | Hello FM | IN | ta | no-known-stream | 0 |
| hello-chennai | Hello FM | IN | ta | no-known-stream | 0 |
| hello-coimbatore | Hello FM | IN | ta | no-known-stream | 0 |
| hello-madurai | Hello FM | IN | ta | no-known-stream | 0 |
| hello-tiruchirappalli | Hello FM | IN | ta | no-known-stream | 0 |
| hello-tirunelveli | Hello FM | IN | ta | no-known-stream | 0 |
| hello-thoothukudi | Hello FM | IN | ta | no-known-stream | 0 |
| hello-salem | Hello FM | IN | ta | no-known-stream | 0 |
| hello-puducherry | Hello FM | IN | ta | no-known-stream | 0 |
| mirchi-chennai | Radio Mirchi | IN | ta | no-known-stream | 0 |
| mirchi-coimbatore | Radio Mirchi | IN | ta | no-known-stream | 0 |
| mirchi-madurai | Radio Mirchi | IN | ta | no-known-stream | 0 |
| mirchi-tiruchirappalli | Radio Mirchi | IN | ta | no-known-stream | 0 |
| mirchi-tirunelveli | Radio Mirchi | IN | ta | no-known-stream | 0 |
| mirchi-thiruvananthapuram | Radio Mirchi | IN | ml | no-known-stream | 0 |
| mirchi-bengaluru | Radio Mirchi | IN | kn | no-known-stream | 0 |
| mirchi-mumbai | Radio Mirchi | IN | hi | no-known-stream | 0 |
| mirchi-puducherry | Radio Mirchi | IN | ta | no-known-stream | 0 |
| radio-city-chennai | Radio City | IN | ta | no-known-stream | 0 |
| radio-city-coimbatore | Radio City | IN | ta | no-known-stream | 0 |
| radio-city-madurai | Radio City | IN | ta | no-known-stream | 0 |
| radio-city-bengaluru | Radio City | IN | kn | no-known-stream | 0 |
| radio-city-mumbai | Radio City | IN | hi | no-known-stream | 0 |
| radio-city-pune | Radio City | IN | mr | no-known-stream | 0 |
| red-erode | RED FM | IN | ta | no-known-stream | 0 |
| red-salem | RED FM | IN | ta | no-known-stream | 0 |
| red-vellore | RED FM | IN | ta | no-known-stream | 0 |
| red-thiruvananthapuram | RED FM | IN | ml | no-known-stream | 0 |
| red-new-delhi | RED FM | IN | hi | no-known-stream | 0 |
| big-chennai | BIG FM | IN | ta | no-known-stream | 0 |
| big-puducherry | BIG FM | IN | ta | no-known-stream | 0 |
| big-bengaluru | BIG FM | IN | kn | no-known-stream | 0 |
| big-mumbai | BIG FM | IN | hi | no-known-stream | 0 |
| big-thiruvananthapuram | BIG FM | IN | ml | no-known-stream | 0 |
| fever-chennai | Fever FM | IN | ta | no-known-stream | 0 |
| shakthi-colombo | Shakthi FM | LK | ta | no-known-stream | 0 |
| shakthi-jaffna | Shakthi FM | LK | ta | no-known-stream | 0 |
| sooriyan-srilanka | Sooriyan FM (Sri Lanka) | LK | ta | browser-audible-awaiting-use-review | 2 |
| vasantham-srilanka | Vasantham FM | LK | ta | reachable-not-decoded | 1 |
| slbc-thendral | Sri Lanka Broadcasting Corporation | LK | ta | no-known-stream | 0 |
| slbc-tamil-national | Sri Lanka Broadcasting Corporation | LK | ta | reachable-not-decoded | 0 |
| yaal-fm | Sri Lanka Broadcasting Corporation | LK | ta | no-known-stream | 0 |
| asr-kanyakumari | ASR Digital Radio | IN | ta | unavailable-down | 0 |
| annai-kuzhithurai | Annai FM | IN | ta | no-known-stream | 0 |
| kumari-tamil-kanyakumari | Kumari Tamil Media | IN | ta | no-known-stream | 0 |
| luminous-radio | Luminous Radio | IN | ta,ml | no-known-stream | 0 |
| shakthi-srilanka | Shakthi FM | LK | ta | reachable-not-decoded | 1 |
| air-chennai-rainbow | Akashvani (All India Radio) | IN | ta,en | reachable-not-decoded | 1 |
| luminous-radio-tamil | Luminous Radio | IN | ta | reachable-not-decoded | 1 |
| air-chennai-gold | Akashvani (All India Radio) | IN | ta,en | reachable-not-decoded | 1 |
| air-chennai-vividh-tamil | Akashvani (All India Radio) | IN | ta,en | reachable-not-decoded | 1 |
| capital-srilanka | Capital FM Sri Lanka | LK | ta | no-known-stream | 0 |
| club-thiruvananthapuram | Club FM | IN |  | no-known-stream | 0 |

## Remaining blockers and checks

Permissions/terms decisions, unavailable decoder, current human-audible identity tests, Android/Web integration, HLS encrypted/fMP4 initialization and sustained stability remain outstanding. Kanyakumari private/online services, SLBC secure official mappings, Capital, and private FM city chains largely lack independently supported HTTPS relays. Old HTTP/IP feeds were not upgraded by guesswork. Exact station metadata and source URLs in the JSON/CSV expose these gaps rather than hiding rows.

WSL2 Ubuntu 22.04, Linux Node 24.16.0 / npm 11.13.0: npm run validate passed; npm test **62 passed, 0 failed/cancelled/skipped/todo**; npm run build passed. Manual deep audit exited zero despite endpoint failures. CI/deployment workflows are unchanged: network audits remain workflow_dispatch-only, continue-on-error, and independent of static deployment. No dependencies installed, no client/artwork changes, no commit/push/merge.
