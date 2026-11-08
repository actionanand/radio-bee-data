# Worldwide Tamil discovery and unverified trial listening

Reviewed 8 November 2026. This follow-up implements the user's request to gather worldwide Tamil stations and expose playable unverified sources for in-app trial listening, including Indian services. It supersedes the earlier rule against adding any unapproved candidate to the permissive client. It does **not** grant broadcaster permission, verification, recording or redistribution rights. No commit, push, merge or deployment was performed.

Catalogue **1.6.0**, schemaVersion **1** contains **85 discoverable stations**, **35 stations with stream candidates / 37 URLs**, **50 metadata-only stations**, **one historical verified stream**, and **zero production-approved listening stations**. This adds **20 stations from 12 countries** to the previous 65-station expansion. Ten worldwide stations and the already-listed ISKCON Nagercoil now have short browser-decoded **unverified trial** feeds. All original 24 stations' stream arrays, including AIR Nagercoil and both Sooriyan alternatives, remain unchanged. ISKCON moves from discovery to playback under the same ID; it had no legacy removal tombstone, so migrations remain unchanged.

## Countries and stations added

Country counts: United Kingdom 2; Canada 4; United States 2; Australia 1; Singapore 1; United Arab Emirates 1; Malaysia 2; Switzerland 3; Germany 1; Norway 1; New Zealand 1; South Africa 1. The combined catalogue covers 14 countries including India and Sri Lanka. Country/state references and manifest totals are validated. A worldwide audience does not create a station in every receiving country.

| Country | Station | App availability after approved release | Provenance |
| --- | --- | --- | --- |
| United Kingdom | IBC Tamil Radio | Trial stream | [world-ibc-tamil-uk-2026](https://radio.ibctamil.com/about) |
| United Kingdom | Athavan Radio UK | Discovery / website | [world-athavan-uk-2026](https://athavanradio.com/uk/) |
| Canada | CMR Tamil HD2 | Discovery / website | [world-cmr-tamil-ca-2026](https://cmr24.net/about-us/) |
| Canada | EAST FM 102.7 | Discovery / website | [world-east-fm-ca-2026](https://eastfm.ca/main/schedule.php) |
| Canada | Canadian Tamil Broadcasting Corporation | Discovery / website | [world-ctbc-ca-2026](https://www.ctbc.com/) |
| Canada | Canadian Tamil Radio (CTR24) | Discovery / website | [world-ctr-ca-2026](https://ctr24.com/) |
| United States | Beats Radio Tamil | Trial stream | [world-beats-radio-us-2026](https://www.beats-radio.com/) |
| United States | American Tamil Radio | Trial stream | [world-american-tamil-radio-us-2026](https://www.tamilmedia.org/) |
| Australia | Australian Tamil Broadcasting Corporation | Discovery / website | [world-atbc-au-2026](https://www.atbc.net.au/) |
| Singapore | OLI 968 | Trial stream | [world-oli-968-sg-2026](https://data.melisten.sg/radio/oli-968) |
| United Arab Emirates | 89.4 Tamil FM | Trial stream | [world-tamil-894-ae-2026](https://tamil894fm.com/about-us/) |
| Malaysia | MINNALfm | Trial stream | [world-minnal-my-2026](https://radio.rtm.gov.my/station/minnalfm) |
| Malaysia | RAAGA Malaysia | Discovery / website | [world-raaga-my-2026](https://media2.fishtank.my/media/astroradio/assets/brand-profile/2025/2026/raaga-brand-profile-2026.pdf) |
| Switzerland | Thaalam Radio Switzerland | Trial stream | [world-thaalam-ch-2026](https://www.thaalam.ch/about-us) |
| Switzerland | Akkini FM | Trial stream | [world-akkini-ch-2026](https://akkini.fm/) |
| Switzerland | Swiss Tamil Radio | Discovery / website | [world-swiss-tamil-radio-ch-2026](https://swisstamilradio.com/) |
| Germany | European Tamil Radio | Trial stream | [world-etr-de-2026](https://etr.fm/imprint) |
| Norway | Tamil Murasam Norway | Trial stream | [world-tamil-murasam-no-2026](https://tamilmurasam.com/) |
| New Zealand | Tarana Tamil | Discovery / website | [world-tarana-tamil-nz-2026](https://www.rova.nz/radio/tarana-tamil) |
| South Africa | Lotus FM | Discovery / website | [world-lotus-fm-za-2026](https://www.lotusfm.co.za/lotusfm/shows/in-isai-mazhai/) |

Full identities, notes, delivery, frequencies and source references are in [JSON](worldwide/stations.json) and [CSV](worldwide/stations.csv). These are editorial inventories, not app APIs. Playback records use stations.json; stream-free cards use discovery-stations.json. The static allowlist excludes these research/verification reports.

## Delivery and identity decisions

IBC, ATBC, CMR Tamil HD2, Thaalam, Akkini, European Tamil Radio, Tamil Murasam and Tarana Tamil are represented by their online programmes; DAB/HD distribution or an FM brand is not invented analogue FM. CMR's Tamil HD2 is distinct from its multilingual 101.3 analogue main programme: neither a main-channel feed nor the bundled josh_pan.mp3 demo was copied. EAST FM 102.7 and Lotus FM include scheduled Tamil programming rather than uninterrupted Tamil-only output. Lotus's own In Isai Mazhai page confirms Tamil presentation. Its website template exposes a MOTSWEDING player, which is another SABC station and was excluded. No duplicate city feeds or foreign aliases of Indian stations were created.

OLI uses broadcaster-described 96.8 branding/frequency, EAST 102.7 and Dubai Tamil 89.4 retain their descriptive frequency. Minnal/RAAGA have multiple regional frequencies and no nationwide single-frequency assertion. Exact transmitter location and legal licensee of 89.4 remain unresolved. ETR's imprint supports Hamm, Germany; Swiss primary sites support their country and, where explicit, Zurich contact region. Primary sources identify US Beats Radio and American Tamil Media's California organization; no Beats studio city was guessed. Canadian CTBC and CTR remain distinct and current website/operator details still need review. Canonical proper names fall back to English where translations are not supplied; UI controls/statuses retain English, Tamil and Sanskrit.

## Playback evidence and limits

[Network diagnostics](worldwide/stream-checks.json) cover 15 URLs: 14 transport/media successes and one failed CTR24 URL (404). MP3, AAC and HLS results are reported separately. FFmpeg is unavailable, so native decoding is not claimed. [Browser observations](worldwide/browser-checks.json) record actual media-element decoding/progress for ten worldwide stations, ISKCON and existing AIR Nagercoil. Beats is AAC despite its extensionless URL. American Tamil Radio's secure live source is explicitly published by its linked player; its HTTPS scheme was not guessed from an old HTTP lead.

Short decoding is sufficient to **retain an unverified trial candidate**, as requested, but is not sustained stability or independent spoken-language identification. HLS media positions are not necessarily decoded duration because playback can start at a live-window offset. Official programme descriptions support the worldwide Tamil tags. ISKCON's language remains unknown rather than inferred from its Tamil Nadu location. Native audit limits remain strict and serial; browser live tests use short sessions but do not have the auditor's byte guarantee. Audio was neither recorded nor retained. There is no proxy, geobypass, token reuse or access-control bypass.

ATBC's official HTTP-only linked player failed in the browser; no secure replacement was invented. RAAGA's authorized SYOK page could be read through web research but the bounded native request returned 403; no bypass attempted. Canadian CMR's exact HD2 stream and EAST/CTBC's canonical live endpoints remain unresolved. CTR's current published mount returns 404. Athavan, Swiss Tamil Radio and Tarana retain official/provider navigation pending a usable direct feed. This is a sourced first worldwide expansion, not an exhaustive directory of every Tamil programme.

Further leads retained outside published station metadata: TRT Tamil Olli France (directory/satellite identity, current official HTTPS site failed); SBS Tamil Australia (scheduled programmes on shared multilingual services, not a fabricated continuous Tamil feed); New Zealand Sangam/Melisai programmes on shared Planet FM; Inbathamil Oli (current official site/operator verification incomplete). No copies of IBC's global feed are made for countries in its audience list. No TamilRadios scraping or bot challenge bypass was used.

## In-app policy and release

New candidate streams keep verificationStatus unverified, lastVerifiedAt null, rightsStatus unconfirmed and directListening needs-review. The existing user-authorized permissive runtime can offer trial Play; strict rights/verification settings still block it, and explicit restricted status always blocks playback. Discovery cards remain stream-free under every policy. The app labels unverified stream cards **Unverified trial stream**, translated into Tamil and Sanskrit. Trial availability never increases the approved-listening counter.

IBC's official page supplies stream/embed tools while its user policy restricts copying, archiving, redistribution and third-party framing. This tension requires app-use review; no permission is inferred. Its recording and redistribution are explicitly prohibited in metadata. Other use conditions remain unconfirmed; existing recording consent/restriction behavior is unchanged. Do not frame broadcaster pages, rehost audio or treat public listening as a rebroadcast licence.

The app's normal country filter and combined discovery view display all 85 after the matching catalogue is released. Generated contract fixtures come from validated data, never hand-authored independent station lists. The development seed contains only a tiny fictional offline UI example and is excluded from production assets. Local built-data preview exercises the production app against the actual local dist/v1 JSON without relaying audio. It displayed 85 cards, and OLI 968 reached Playing through the normal app player before being stopped. No deployed data/client has been changed: user approval is still required for release.

See [final validation and complete file inventories](worldwide/VALIDATION.md) for exact checks and limitations. Earlier expansion reports describe their 1.5.0 snapshot; these 1.6.0 counts and trial policy are the current follow-up.
