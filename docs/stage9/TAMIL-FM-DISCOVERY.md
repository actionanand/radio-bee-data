# Stage 9 — Tamil FM discovery

Reviewed **8 November 2026** (Asia/Calcutta) on `feature/9-tamil-fm-stream-discovery`. This is non-published research. Catalogue **1.4.0 / schemaVersion 1 remains unchanged: 24 stations, 26 streams, 64 removal entries**. No stream, source, geography, migration, artwork or client changes are approved by this report. No commit/push/merge/deployment performed.

## Exact outcomes

| Measure | Count |
| --- | ---: |
| Broadcasters/brands investigated (including insufficiently identified leads) | 14 |
| Service/place investigation cases | 54 |
| Place-specific cases reviewed, not a count of confirmed active local broadcasts | 51 |
| Primary research HTTPS candidates assessed, including supplied/historical leads | 7 |
| Additional insecure HTTP URLs recorded, not probed/upgraded | 9 |
| Additional query-bearing Annai browser lead, URL withheld | 1 |
| Existing AIR Nagercoil endpoint control | 1 |
| Research HTTPS endpoints returning audio-like bytes | 3 |
| Research candidates with browser decoded-playback progress | 1 |
| FFmpeg sample decodes / human-audibility attestations | 0 / 0 |
| Research endpoints associated with an official current player | 2 |
| Of those, currently responsive with playback progress | 1 |
| New publication-eligible additions (Group A) | 0 |
| Technically promising research candidates pending identity/use review (Group B) | 3 |
| Failed/insecure/insufficient research candidate records (Group C) | 14 |
| Failed research HTTPS checks | 4 |
| Extra browser startup failure / broadcaster-domain DNS failure | 1 / 1 |
| Exact duplicate directory rows not imported | 5 |
| Published station cards removed or added | 0 / 0 |

The **17 research candidate records** comprise seven HTTPS URLs, nine HTTP leads and one withheld Annai URL. The existing AIR control is separate. None of these counts claims seven newly discovered stations: several URLs came from the request or prior investigations. Failed endpoints are observations in this environment, not proof that a broadcaster has permanently closed. Source association means official-player evidence; it is not human identification of an announcement or full live programme. No human listening claim is made.

## Deliverables

- [54 service/place cases — CSV](station-discovery.csv) and [structured JSON](station-discovery.json): stable archived/published IDs when they exist, broadcaster/network, place, supported/claimed metadata, group/status, source references, observation date, candidate references and next action. A null stationId is research only, not a new published identity.
- [Stream evidence and exact counters](stream-evidence.json): original sources, sanitized candidate URLs, redirect/status/MIME/signature/CORS/first-byte/bitrate/segment/decoder results, repeat connections and browser observations.
- [Source request observations](source-observations.json): dates, failures and truncation limits, without copied website bodies, encrypted configuration blobs or audio.
- [Suryan by city](SURYAN-REGIONAL-STREAMS.md), [major networks including Hello/Mirchi](MAJOR-NETWORKS.md), [Kanyakumari discoveries](KANYAKUMARI-STATIONS.md), [duplicate decisions](duplicate-review.json), [publication decisions](publication-decisions.md), [validation](validation-results.md).

## Strongest new finding

[ISKCON Nagercoil's official radio page](https://www.iskconnagercoil.com/radio) identifies Vaani Seva and exposes `https://iskconnagercoil.com/webdio`. The safe probe returned HTTP 200, audio/mpeg, an MP3 signature, ICY ISKCON Nagercoil Radio, reported 128 kbps and CORS *. A later connection repeated the transport result. Two fresh in-app-browser HTMLAudio starts advanced from zero to **3.415027 seconds (readyState 4)** and **2.404790 seconds (readyState 3)**, paused false, no media error. The footer identifies Puliyurkurichi in Kanyakumari district. The official programme page is identity evidence; Tamil-only content is not established by the directory's Tamil label. **No third-party RadioBee use, recording or redistribution grant was established. It remains Group B outside published data.**

The BIG FM Tamil Zeno lead also returned MP3-like audio twice, but ICY naming and a directory label do not prove BIG broadcaster control or a Chennai simulcast. The reachable Uber-branded endpoint appears under multiple Mirchi directory names and has no confirmed Mirchi/Tamil city association. Both remain Group B.

## Research boundaries and technical limits

Read the required Stage 6/8 sources, complete current JSON/catalogue/backlog and existing schemas/validator/builder/probes before research. The 64 archived records remain intact: 63 originally lacked direct URLs and AIR Thoothukudi had an official candidate returning 404. They are not restored just because directories have play buttons. Research legacyDistrictId/legacyLocalityId preserve old references only: they are not freshly confirmed programme origin. In particular, archived Kumari Nagercoil and Annai Kuzhithurai locality IDs must not override the current unknown-locality / nearby-Parakunnu evidence. Prior verified/use metadata, all retained IDs and every null migration target remain unchanged.

Public-page inspection used the existing DNS-pinned HTTPS transport: at most **128 KiB and 10 seconds per request, five redirects and one active request**; requests were sequential. Endpoint deep audits used **35 seconds per endpoint, cumulative 128 KiB media input, at most two primary GET attempts and one bounded HLS variant/segment**. Later repeat trials use fresh endpoint budgets, not unlimited downloads. HEAD checks and one-byte fallback remain bounded. TLS/private-address/local-hostname protections were retained; no insecure certificate bypass, guessed HTTP-to-HTTPS upgrade, account/cipher decryption, geolocation change, new proxy or relay was used.

No FFmpeg executable is installed in WSL2 or on the Windows PATH; native probe decode outcomes explicitly say not-tested/ENOENT. No dependencies were installed. Browser tests used the available **ChatGPT in-app browser**, not independently identified Chrome product or Android/native HLS. Player tabs were closed after short startup checks; browser transfer bytes were not measurable through the available UI API, so the 128 KiB bound applies to native probes, not a falsely claimed browser byte cap. Browser playback and advertisements can request extra resources; trials were ended through tab closure. Two brief starts do not prove sustained stability, actual language or audibility. No recording or audio/binary sample was saved.

Bounded HTML can truncate before dynamically loaded configuration. No endpoint found in a homepage prefix does not establish that no official stream exists. Radio Browser was queried ten times by bounded names and four times with India filters (limits 12/20 rows), not exhaustively copied. Country, city, codec and lastcheck claims were treated as leads; Ghana Hello FM, foreign RED/Mirchi and inconsistent-country records were excluded.

## TamilRadios limitation

Popular listings, the live and AIR category pages, supplied Hello/Mirchi pages and named Suryan/City/BIG listings were reviewed in initial bounded/search-rendered discovery. Its [terms](https://www.tamilradios.com/terms) expressly prohibit automated access without written consent. **Further automated requests and player/network inspection stopped on reading that clause.** No direct stream URLs were copied from this portal. No search-result play button, directory assertion, playlist or website MP3 podcast was treated as publication authority. Obtain written access permission or perform a permitted manual review before continuing there.

## Publication gate

The client production environment was inspected read-only: `AllowUnverified: true`, `CheckVerificationStatus: false`, `CheckRightsStatus: false`; its eligibility function conditionally skips the corresponding gates. Therefore `needs-review` alone would not safely hide a newly published URL. All research stays in docs/stage9; no version bump is warranted without an actual catalogue edit. No client files were modified.

Before any addition: establish stable broadcaster-controlled source and correct programme/place, review applicable direct-listening terms separately from recording/redistribution, verify Chrome and Android/native compatibility and continuity, then reconcile an archived ID/removal only if restoration is justified. Do not assume the existing permissive client enforces editorial metadata.
