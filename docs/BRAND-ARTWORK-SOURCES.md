# V2 real radio artwork — editorial source index

This release intentionally replaces placeholder radio-device art with **remote station-brand image references**. No third-party image bytes are copied into the GitHub repository. The URLs are used as nominative station identifications; embedding permissions, hotlinking policies, changes to image content and reliability should be checked before a long-term commercial release.

**Visual verification:** On 2026-11-15, the 11 retained URLs returned image bytes from GitHub Actions and their content was inspected; each showed the named radio/network branding. The dropped Hello FM URL failed DNS and was not published.

**Source ranking:** broadcaster-origin image; broadcaster's hosted social/stream profile; reputable radio catalogue showing the named broadcaster. Do not use a logo for another broadcaster, even when the station names sound similar.

| Network ID | Published image URL | Brand identification source |
| --- | --- | --- |
| akashvani | https://i1.sndcdn.com/artworks-000070154341-a8vv1u-t1080x1080.jpg | Akashvani logo shown in Prasar Bharati material; SoundCloud archival artwork |
| suryan-in | https://i1.sndcdn.com/avatars-000025578244-qwg44s-t1080x1080.jpg | Suryan FM / Sun Group brand shown in its publisher material |
| sooriyan-lk | https://i1.sndcdn.com/artworks-000316796985-286oxn-t1080x1080.jpg | Sri Lankan Sooriyan FM identity; **not Indian Suryan FM** |
| shakthi-lk | https://static-media.streema.com/media/cache/6f/e8/6fe824a5bafdb456311cd0d6e395be16.jpg | Streema Shakthi FM (Sri Lanka) listing |
| mediacorp | https://onecms-res.cloudinary.com/image/upload/v1678108773/mediacorp/mel/image/2023-03/oli-968_0.png | Mediacorp meLISTEN official OLI 968 image; currently used only by this station |
| ibc-tamil | https://cdn-profiles.tunein.com/s55338/images/logog.png?t=159604 | TuneIn IBC Tamil listing |
| tamil-894 | https://static-media.streema.com/media/cache/7b/64/7b64f6555f853d1aecda2c0c2236fd67.jpg | Streema Dubai Tamil 89.4 FM |
| american-tamil-media | https://www.americantamilradio.com/assets/img/radiologo.png | American Tamil Radio website |
| mirchi | https://static.tuneyou.com/images/logos/500_500/46/12946/RadioMirchi98.3FM.jpg | TuneYou Radio Mirchi 98.3 listing |
| radio-city | https://exchange4media.gumlet.io/news-photo/145723-radiocity.jpg | exchange4media Radio City brand news image |
| red-fm | https://djhonz7dexnot.cloudfront.net/66d76b302bbb6373116e9ea4957bd02a1daa8b7b.jpg | Pocket FM RED FM 93.5 programme image |

Hello FM is temporarily left without artwork because its previous image hostname failed DNS during the live audit on 2026-11-15.

The four Featured Radios without verifiable publisher artwork (Tamil Kadavul Murugan; 100% Love Radio; 100% New Songs; 100% Sad Songs) keep the standard RadioBee fallback. Remaining unsupported networks also keep fallback.

**Risk and testing:** remote images can disappear, hotlink protection can block them, or the publisher may update its brand. The app only accepts curated HTTPS raster URLs from reviewed hosts; on network/image error it falls back. Confirm on a real device before merge. Do not interpret a public web image as a grant to redistribute it. If redistribution permission is obtained, migrate to locally hosted, optimized WebP files with attribution where required. New logos should receive direct publisher review.

## Incremental expansion — 2026-11-15

- **KEXP 90.3 FM**: KEXP's own official press page provides the primary logo; image URL `https://www.kexp.org/media/filer_public_thumbnails/filer_public/4f/52/4f52b5aa-bd93-4fe7-ab94-2d3258a3804c/kexp_primarylogo_black.png__300x356_q85_crop_subsampling-2_upscale.png`. Official source: https://www.kexp.org/about/press/
- **WNYC 93.9 FM**: WNYC's wordmark from Wikimedia Commons (original WNYC source, protected as trademark); image URL `https://upload.wikimedia.org/wikipedia/commons/e/ec/WNYC_logo.png`. Evidence: https://commons.wikimedia.org/wiki/File:WNYC_logo.png
- Unverified stations are tracked in `docs/ARTWORK-MISSING-V2.md`; no speculative images are assigned.

- **WQXR 105.9 FM**: station logo displayed on its TuneIn radio profile. https://tunein.com/radio/WQXR-FM-1059-s27729/
- **RAAGA Malaysia**: Astro Radio RAAGA Astro Radio's RAAGA logo mirrored by the FreemediaMY radio directory. https://github.com/FreemediaMY/FreemediaMY/blob/main/FreewatchMY

- **Vasantham FM Sri Lanka**: distinct Vasantham FM logo from its indexed brand assets and station website; brand reference https://brandfetch.com/vasanthamfm.lk (logo URL `https://cdn.brandfetch.io/id7dYvpMT-/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1767766219614`).
- **Radio 4EB** (98.1 FM and Global Digital): shared 4EB mark from Community Broadcasting Association of Australia, https://www.cbaa.org.au/community-broadcasting/community-radio-dab-directory .
- **MINNALfm**: official RTM Klik radio station artwork, https://rtmklik.rtm.gov.my/radio/nasional/32964 .
- **Lotus FM**: official broadcaster SABC+ station logo image, https://sabc-plus.com/radio/show/238067/Lotus-FM-Stories--GBV-Stories .

## Public HTTPS provider icons and station-specific themed artwork (2026-11-15)

RadioBee now supports externally hosted HTTPS images, including images published within radio-bee-data, known radio station directory images, query-based image services, and appropriately identified Wikimedia Commons imagery. No third-party binary images are included in the app or catalogue. External content may be blocked, unavailable, or inaccurate; RadioBee has a runtime fallback.

The new network images below use Google's publicly hosted favicon lookup for the matching publisher domain. These are **publisher-domain icon candidates**, not individually verified full-size logos; a default website favicon may differ from a station's logo. These are not guaranteed to be high resolution. Replace them with station-specific image URLs when better images are located.

| Network ID | Publisher-domain favicon source |
| --- | --- |
| `hello-fm` | `hellofm.in` |
| `big-fm` | `bigfmindia.com` |
| `slbc` | `slbc.lk` |
| `asr-digital` | `radio.asrdmm.com` |
| `annai-fm` | `zeno.fm` |
| `kumari-tamil` | `radio.kumaritamil.com` |
| `luminous-radio` | `luminousradio.com` |
| `capital-lk` | `capitalfm.lk` |
| `club-fm` | `clubfm.in` |
| `iskcon-nagercoil` | `iskconnagercoil.com` |
| `athavan` | `athavanradio.com` |
| `cmr` | `cmr24.net` |
| `east-fm` | `eastfm.ca` |
| `ctbc` | `ctbc.com` |
| `canadian-tamil-radio` | `ctr24.com` |
| `beats-radio` | `beats-radio.com` |
| `atbc` | `atbc.net.au` |
| `thaalam-media` | `thaalam.ch` |
| `akkini` | `akkini.fm` |
| `swiss-tamil-radio` | `swisstamilradio.com` |
| `european-tamils-union` | `etr.fm` |
| `tamil-murasam` | `tamilmurasam.com` |
| `tarana` | `rova.nz` |
| `shaivam` | `shaivam.org` |
| `star-fm-lk` | `starfm.lk` |
| `boom-tamil` | `boomtamil.com` |
| `tamil-panpalai` | `tamilpanpalai.com` |
| `aural-radio` | `auralradiokerala.in` |
| `vaagai-tamil` | `vtfm.net` |
| `a9-media` | `a9radio.com` |
| `amudham` | `amudhamfm.com` |
| `mauritius-global-diaspora` | `mauradio.com` |
| `theophony` | `theophony.org` |
| `jeifm` | `jeifm.com` |
| `amen-fm` | `amenfm.com` |
| `live-fm` | `livefm.bh` |
| `sweety-fm` | `sweetyfm.com` |
| `christian-media-india` | `vaanmalarfm.in` |
| `olive-suno` | `suno.qa` |
| `voice-of-gospel` | `tamilchristianradio.org` |
| `christvision-media` | `goodnewsfm.org` |
| `3zzz` | `3zzz.com.au` |
| `5ebi` | `5ebi.com.au` |
| `namathu-fm` | `namathufm.fr` |
| `otran-vaanoli` | `otranvaanoli.com` |
| `tamil-christian-media` | `thuthi.fm` |
| `radio-plus` | `radioplus.mu` |
| `time-fm` | `timefm.ca` |
| `inbathamil-oli` | `inbathamil.com` |

Station-specific photos:
- `80s80s-michael-jackson-de`: Michael Jackson Wikimedia Commons file; artist photo — https://commons.wikimedia.org/wiki/Special:FilePath/Michael_Jackson_in_1988.jpg
- `exclusively-michael-jackson-ae`: Michael Jackson Wikimedia Commons file; artist photo — https://commons.wikimedia.org/wiki/Special:FilePath/Michael_Jackson_in_1988.jpg
- `stage29-ilayaraja-voice-fm`: Ilaiyaraaja Wikimedia Commons artist portrait — https://commons.wikimedia.org/wiki/Special:FilePath/Ilaiyaraaja_at_Merku_Thodarchi_Malai_Press_Meet_(cropped).jpg
- `stage29-maestro-hits`: Ilaiyaraaja portrait for Maestro themed radio — https://commons.wikimedia.org/wiki/Special:FilePath/Ilaiyaraaja_at_Merku_Thodarchi_Malai_Press_Meet_(cropped).jpg
- `stage29-tamil-kadavul-murugan-fm`: Lord Murugan Batu Caves Wikimedia Commons artwork; thematic photo — https://commons.wikimedia.org/wiki/Special:FilePath/20190821_Lord_Murugan_statue-1.jpg

**MGR & Sivaji joint photograph:** CineUlagam published a photo depicting both actors at the Bakkiyaraj wedding; we link the publisher's image rather than copying it to the repository. Source: https://cineulagam.com/article/mgr-and-sivaji-at-bakkiyaraj-marriage-1655809347 . Other artist and devotional stations without suitable sourced photos keep a station-specific generated image or the app fallback. Other artist and devotional stations without a suitable source retain the app fallback. Image licensing and reuse terms depend on individual image sources.


### Additional sourced portraits (link-only)

- `ilayaraja-radio`: https://commons.wikimedia.org/wiki/Special:FilePath/Ilaiyaraaja%20at%20Merku%20Thodarchi%20Malai%20Press%20Meet%20(cropped).jpg
- `80s80s-michael-jackson-de`: https://commons.wikimedia.org/wiki/Special:FilePath/Michael%20Jackson%20in%201988.jpg
- `exclusively-michael-jackson-ae`: https://commons.wikimedia.org/wiki/Special:FilePath/Michael%20Jackson%20in%201988.jpg
- `exclusively-queen-ae`: https://commons.wikimedia.org/wiki/Special:FilePath/Queen%20-%20Freddie%20Mercury.jpg
- `stage29-mgr-sivaji-radio`: https://cdn.ibcstack.com/article/9823579d-1b30-4f21-a5c0-8aa949ce7905/22-62b1a543a3fa2.webp
- `stage29-spb-online-radio`: https://commons.wikimedia.org/wiki/Special:FilePath/S.%20P.%20Balasubrahmanyam%20in%202013%20(cropped).JPG
- `stage29-harris-jayaraj-radio`: https://commons.wikimedia.org/wiki/Special:FilePath/Harris%20Jayaraj%20at%20Gethu%20Audio%20Launch%20(cropped).jpg
- `stage29-ks-chitra-radio`: https://commons.wikimedia.org/wiki/Special:FilePath/K%20s%20chithra.jpg
- `stage29-kj-yesudas-radio`: https://commons.wikimedia.org/wiki/Special:FilePath/Yesudas%20K.J.jpg
- `stage29-s-janaki-radio`: https://commons.wikimedia.org/wiki/Special:FilePath/S%20Janaki%20in%20Pune%2C%20India%202007%20cropped.jpg
- `stage29-spb-old-hits-fm`: https://commons.wikimedia.org/wiki/Special:FilePath/S.%20P.%20Balasubrahmanyam%20in%202013%20(cropped).JPG
- `stage29-ilayaraja-voice-fm`: https://commons.wikimedia.org/wiki/Special:FilePath/Ilaiyaraaja%20at%20Merku%20Thodarchi%20Malai%20Press%20Meet%20(cropped).jpg
- `stage29-santhosh-narayanan-radio`: https://commons.wikimedia.org/wiki/Special:FilePath/Santhosh%20Narayanan%20-%20WIki%20profile.jpg
- `stage29-arrahman-classic`: https://commons.wikimedia.org/wiki/Special:FilePath/AR%20Rahman.jpg
- `stage29-makkal-thilagam-mgr`: https://commons.wikimedia.org/wiki/Special:FilePath/MGR%20(cropped).jpg
- `stage29-maestro-hits`: https://commons.wikimedia.org/wiki/Special:FilePath/Ilaiyaraaja%20at%20Merku%20Thodarchi%20Malai%20Press%20Meet%20(cropped).jpg
- `stage29-arrahman-classic-hits`: https://commons.wikimedia.org/wiki/Special:FilePath/AR%20Rahman.jpg
- `stage29-rajini-radio`: https://commons.wikimedia.org/wiki/Special:FilePath/Rajinikanth%20in%202019.jpg
- `stage29-tamil-kadavul-murugan-fm`: https://commons.wikimedia.org/wiki/Special:FilePath/20190821%20Lord%20Murugan%20statue-1.jpg

Wikimedia sources have individual licenses and attribution requirements. The joint MGR/Sivaji image remains subject to its publisher's copyright and hotlink policy; embedding is not a license to redistribute.


### Remote image audit corrections

The GitHub Actions live image audit reported HTTP 404 for these publisher-domain favicon candidates. They were removed to avoid showing broken icons: `hello-fm`, `kumari-tamil`, `capital-lk`, `canadian-tamil-radio`, `atbc`, `european-tamils-union`, `tamil-murasam`, `star-fm-lk`, `christian-media-india`, `namathu-fm`, `inbathamil-oli`. The generic provider favicons for `annai-fm` and `tarana` were also removed because they did not faithfully identify a radio brand.

Artist/thematic external links are *not* guaranteed to resolve: they remain candidate references until individually checked. They may fall back at runtime.

## Image ownership and switching between data-repo files and external URLs

**Single source of truth:** `actionanand/radio-bee-data`, under `data/v2/`. No station, artist, or devotional image files belong in the `radio-bee` app repository. The app implements only generic URL resolution, image loading and a built-in offline-safe fallback.

For a file hosted by RadioBee data, upload a real PNG or WebP at `data/v2/assets/logos/stations/<slug>.png` (or `networks/<slug>.webp`). Keep images <=512×512 and <=256 KiB. Set only `logoPath`, for example:

```json
"logoPath": "assets/logos/stations/example-radio.webp"
```

For a third-party image, set only `logoUrl`, for example:

```json
"logoUrl": "https://publisher.example.org/images/example-radio.png"
```

To switch **remote → data-hosted**, upload the PNG/WebP to the data repository, remove `logoUrl` from that station or network record and add `logoPath`. To switch **data-hosted → remote**, remove `logoPath` and add `logoUrl`. The data publisher includes referenced local image files in GitHub Pages at `https://actionanand.github.io/radio-bee-data/v2/<logoPath>`. Station-specific artwork overrides network artwork; use a network image for multiple stations only when their actual branding is shared.

Both fields are optional. If both are supplied, remote `logoUrl` takes priority, so prefer using one at a time. All edits should be committed and deployed in `radio-bee-data` only; no `radio-bee` rebuild is required once its universal HTTPS image-support PR is merged and deployed. Query strings, alternative image hosts, and image file extensions are permitted for external HTTPS image URLs; local `logoPath` remains strictly limited to audited in-repository PNG/WebP assets.

A source domain is not evidence of image fidelity. Preserve image attribution and mark generic site favicons as provisional, rather than claiming they are authentic station logos. Images failing to load use RadioBee's standard fallback.


## Complete V2 illustration coverage (2026-11-15)

All 240 published V2 stations have image references following the expansion documented in `docs/ARTWORK-MISSING-V2.md`. For 150 stations with no usable station-brand photo or favicon, RadioBee's own themed, station-labeled SVG editorial covers are stored **only in radio-bee-data** under `data/v2/assets/artwork/stations/` and published by the data site. These are not broadcaster-owned logos. They are static restricted SVG (no script, embedded HTML, CSS, event handlers, or remote references), audited by `scripts/logo-assets.mjs`, and can be replaced at any time by a data-hosted PNG/WebP or any public HTTPS image URL without updating the client. If a remote image fails, the app's standard fallback still applies.


### Remote photo fallback and audited source URLs

The catalogue now maintains a data-hosted, station-specific editorial cover for each of the 19 external artist or devotional photo references. If a third-party image returns an error (including Wikimedia 429 rate limiting), RadioBee tries that data-hosted cover before its final generic fallback. The Ilaiyaraaja and Murugan URLs use directly identified Wikimedia Commons media objects rather than unvalidated `Special:FilePath` guesses. External photo failures are recorded in CI as warnings; nonfunctioning network image links still fail the artwork audit.


## Shared artist and genre artwork (2026-11-15)

All shared assets reside exclusively in `radio-bee-data/data/v2/assets/artwork/artists/` and `.../genres/`. Artist and genre artwork are clearly labelled original RadioBee editorial images, **not authenticated photographs or logos**. They are referenced via `logoPath`; public HTTPS Wikimedia Commons artist photos use `logoUrl` when a file has been identified. Failed external photos revert to the shared data-hosted artist image. The app never hosts these files.

Artist station fallback assignments (34): `ilayaraja-radio` → `ilaiyaraaja`, `exclusively-backstreet-boys-ae` → `backstreet-boys`, `exclusively-taylor-swift-ae` → `taylor-swift`, `80s80s-michael-jackson-de` → `michael-jackson`, `exclusively-michael-jackson-ae` → `michael-jackson`, `exclusively-justin-bieber-ae` → `justin-bieber`, `exclusively-shakira-ae` → `shakira`, `exclusively-one-direction-ae` → `one-direction`, `exclusively-adele-ae` → `adele`, `exclusively-ed-sheeran-ae` → `ed-sheeran`, `exclusively-queen-ae` → `queen`, `exclusively-westlife-ae` → `westlife`, `stage29-spb-online-radio` → `s-p-balasubrahmanyam`, `stage29-harris-jayaraj-radio` → `harris-jayaraj`, `stage29-ks-chitra-radio` → `k-s-chithra`, `stage29-deva-radio` → `deva`, `stage29-kj-yesudas-radio` → `k-j-yesudas`, `stage29-tms-radio` → `t-m-soundararajan`, `stage29-s-janaki-radio` → `s-janaki`, `stage29-mano-radio` → `mano`, `stage29-spb-old-hits-fm` → `s-p-balasubrahmanyam`, `stage29-ilayaraja-voice-fm` → `ilaiyaraaja`, `stage29-santhosh-narayanan-radio` → `santhosh-narayanan`, `stage29-arrahman-classic` → `a-r-rahman`, `stage29-makkal-thilagam-mgr` → `m-g-ramachandran`, `stage29-ms-viswanathan-hits` → `m-s-viswanathan`, `stage29-simbu-hits` → `silambarasan`, `stage29-yuvan-shankar-raja-ysr` → `yuvan-shankar-raja`, `stage29-arrahman-classic-hits` → `a-r-rahman`, `stage29-rajini-radio` → `rajinikanth`, `stage29-na-muthukumar-hits` → `na-muthukumar`, `stage29-imman-radio` → `d-imman`, `stage29-thaman-hits` → `s-thaman`, `stage29-jp-chandrababu-hits` → `j-p-chandrababu`.

Devotional station fallback assignments (24): `quran-tamil-kw` (islamic-religious), `hand-of-jesus-tamil-in` (christian-devotional), `vaanmalar-fm-in` (christian-devotional), `mahakatha-radio-in` (devotional), `shaiva-lahari-in` (devotional), `stage29-shaivam-radio` (devotional), `stage29-ayngaran-radio` (devotional), `stage29-aadhi-sivan-fm` (devotional), `stage29-om-sakthi-fm` (devotional), `stage29-ss-devotional-radio` (devotional), `stage29-guru-raghavendra-radio` (devotional), `stage29-vishnu-fm` (devotional), `stage29-saranam-ayyappa-fm` (devotional), `stage29-sai-fm-radio` (devotional), `stage29-aanmeega-sudar` (devotional), `stage29-sivasubramaniyam-ayyappan-songs-fm` (devotional), `stage29-sree-kurumba-fm` (devotional), `stage29-dharisanam-fm` (devotional), `stage29-singampunari-fm` (devotional), `stage29-kandhakapookkal-radio` (devotional), `stage32-bhakti-sangeet` (devotional), `stage32-sgpc-gurbani` (devotional), `stage32-malayalam-bhakthi` (devotional), `stage32-dnyaneshwari` (devotional).

Specific photo sources:
- justin-bieber: [Wikimedia Commons file](https://commons.wikimedia.org/wiki/File:Justin_Bieber.jpg) — Justin Bieber.jpg
- shakira: [Wikimedia Commons file](https://commons.wikimedia.org/wiki/File:Shakira.JPG) — Shakira.JPG
- taylor-swift: [Wikimedia Commons file](https://commons.wikimedia.org/wiki/File:Taylor_Swift_The_Eras_Tour_Evermore_Era_Set_(53108839157).jpg) — Taylor Swift The Eras Tour Evermore Era Set (53108839157).jpg
- westlife: [Wikimedia Commons file](https://commons.wikimedia.org/wiki/File:Westlife_2011.jpg) — Westlife 2011.jpg
- one-direction: [Wikimedia Commons file](https://commons.wikimedia.org/wiki/File:One_Direction_ARIA_Awards_2014.jpg) — One Direction ARIA Awards 2014.jpg
- d-imman: [Wikimedia Commons file](https://commons.wikimedia.org/wiki/File:Imman_composer.jpg) — Imman composer.jpg
- Lord Murugan (front-facing portrait candidate): [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lord_Murugan_statue.jpg). The `hindu-devotional` data-hosted fallback is retained.

Krishna FM (id `stage29-krishna-fm`) retains its existing neutral, named editorial cover. Only a directory identity and test stream are known; an independent programme schedule proving devotional programming has not been established. Its devotional tag is therefore provisional and must be reviewed, rather than treated as evidence for a Krishna deity photo.

Hello FM Chennai now has a station-specific brand image from [Streema's Hello FM Chennai 106.4 listing](https://streema.com/radios/Hello_FM), hosted at `https://static-media.streema.com/media/cache/26/3e/263e52f18d89f544c3aad303411a9e71.jpg`. This is a directory-hosted image, not a guaranteed current official logo; its original data-hosted `hello-chennai.svg` remains the runtime fallback.

To swap images later, change `logoUrl` or `logoPath` in this data repository; no app changes are needed.
