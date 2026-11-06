# Station and network logos

Researched 6 November 2026. Catalogue v1.2.0, schemaVersion 1. This additive optional metadata change leaves every station, network, frequency, stream URL, verification status and rights status unchanged. No client code was modified.

## Approved artwork inventory

**Station logos: 0; network logos: 0; shared-network coverage: 0; fallback: all 88 stations.** No broadcaster binary was approved or published. Included filenames, dimensions, formats, sizes and attribution obligations: none/not applicable (total published artwork bytes 0). Empty .gitkeep placeholders establish the stations/ and networks/ directories; they are not artwork. The client fallback must already be bundled by the client; no replacement branding was generated.

## Candidate research — not approved assets

The table records official website image references, not visually authenticated/relicensed artwork. Original asset URLs are provenance links only, never hotlinked through logoPath. No candidate image was normalized, decoded, padded or published; candidate dimensions and file sizes were therefore not measured. Do not infer an asset's identity solely from an img alt label. A site may include parent-company, product, event or programme graphics. Neither a live URL nor website attribution supplies redistribution permission.

| Official site | HTTP/result | Candidate original asset URL | Documentary image label | Usage outcome |
| --- | --- | --- | --- | --- |
| [https://prasarbharati.gov.in/en/copyright-policy/](https://prasarbharati.gov.in/en/copyright-policy/) | 200 | https://prasarbharati.gov.in/wp-content/uploads/2024/03/Logo.png | Prasar Bharati | Held: no redistribution grant established |
| [https://www.suryanfm.in/](https://www.suryanfm.in/) | 200 | https://www.suryanfm.in/wp-content/uploads/2018/10/Header-icon.jpg | Suryan FM | Held: no redistribution grant established |
| [https://www.sooriyanfm.lk/](https://www.sooriyanfm.lk/) | 200 | https://www.sooriyanfm.lk/images/logo.png | Sooriyan FM | Held: no redistribution grant established |
| [https://shakthifm.com/](https://shakthifm.com/) | 200 | https://shakthifm.com/images/shakthi-fm-logo.webp | Shakthi FM | Held: no redistribution grant established |
| [https://www.vasanthamfm.lk/](https://www.vasanthamfm.lk/) | 200 | https://www.vasanthamfm.lk/assets/vasantham-fm.svg | Vasantham FM | Held: no redistribution grant established |
| [https://slbc.lk/](https://slbc.lk/) | 200 | https://slbc.lk/images/top-logo.png | kodeforest | Held: no redistribution grant established |
| [https://capitalfm.lk/](https://capitalfm.lk/) | 526 | Not established | Identity requires visual review | Held: no redistribution grant established |
| [https://www.luminousradio.com/](https://www.luminousradio.com/) | 200 | https://www.luminousradio.com/wp-content/uploads/2025/04/lr-logo.png | Luminous Radio | Held: no redistribution grant established |
| [https://radio.asrdmm.com/](https://radio.asrdmm.com/) | 200 | Not established | Identity requires visual review | Held: no redistribution grant established |
| [https://zeno.fm/radio/annai-fm/](https://zeno.fm/radio/annai-fm/) | 200 | Not established | Identity requires visual review | Held: no redistribution grant established |
| [https://radio.kumaritamil.com/](https://radio.kumaritamil.com/) | ENOTFOUND | Not established | Identity requires visual review | Held: no redistribution grant established |
| [https://hellofm.in/](https://hellofm.in/) | ECONNREFUSED | Not established | Identity requires visual review | Held: no redistribution grant established |
| [https://mirchi.in/](https://mirchi.in/) | 200 | https://a10.gaanacdn.com/images/section/logo_1724226700.svg | Mirchi Plus | Held: no redistribution grant established |
| [https://www.radiocity.in/](https://www.radiocity.in/) | 200 | https://www.radiocity.in/rc-new/images/shortslogo.png | Identity requires visual review | Held: no redistribution grant established |
| [https://bigfmindia.com/](https://bigfmindia.com/) | 200 | https://www.bigfmindia.com/wp-content/themes/big-fm/assets/images/logo.png | logo | Held: no redistribution grant established |
| [https://www.fever.fm/](https://www.fever.fm/) | 503 | Not established | Identity requires visual review | Held: no redistribution grant established |
| [https://clubfm.in/](https://clubfm.in/) | 200 | Not established | Identity requires visual review | Held: no redistribution grant established |

Suryan-in is the Indian Sun network; sooriyan-lk is the Sri Lankan broadcaster. Their assets must never be interchanged. Prasar Bharati's corporate header logo is not automatically an Akashvani, FM Rainbow, FM Gold or Vividh Bharati logo. SLBC corporate branding is not independently confirmed Yaal service branding. Mirchi Plus is not automatically a terrestrial Mirchi station badge. Vasantham's candidate is SVG, which is intentionally unsupported by this catalogue; authorized conversion and visual review would be needed.

## Usage review and next actions

[Prasar Bharati copyright policy](https://prasarbharati.gov.in/en/copyright-policy/) limits use to personal/educational contexts and restricts alteration and distribution; no RadioBee logo-republication basis established. [Suryan terms](https://www.suryanfm.in/terms-of-use/) must be reviewed for the intended thumbnail redistribution, rather than assuming a public logo is reusable. Sooriyan, Shakthi, Vasantham and SLBC pages carry rights-reserved notices; Luminous carries copyright attribution. None of those notices grants RadioBee republication. ASR's separate website terms also require review. No explicit broadcaster permission or suitably scoped brand licence was obtained for any candidate. Other fetched pages did not establish a usable grant; this is uncertainty, not a legal conclusion that every use is prohibited. No contacts or permission requests were sent.

ASR/Annai/Club pages yielded no clearly identified logo in the bounded image scan; this is not proof they have none. Annai's Zeno page is a lead requiring broadcaster ownership confirmation. Kumari DNS failed; Hello's candidate domain refused connection; Fever returned 503; Capital returned 526. Alternate official domains/media-kit links remain research TODOs. Do not substitute an aggregator image or a guessed file path. All candidates await visual identity review and applicable licence/permission; service-specific Akashvani and Yaal artwork await separate sourcing.

After approval, record ID, source website, exact original asset URL, reviewed date, retained local filename, original/output dimensions, format, byte size, identity evidence, attribution, licence/use basis and limitations here. Keep private authorizations outside public JSON. Use one shared network file wherever appropriate. Export PNG/WebP without cropping or distortion, with transparent padding only when permitted by the branding rules. Review the exported image visually at mobile size before adding its path. Do not alter restricted artwork merely to fit the size cap.

## Optional contract and client integration

Both station.schema.json and network.schema.json accept an optional string logoPath. It is not required and must be omitted, rather than null/empty, when unapproved or unavailable. Supported paths are strictly assets/logos/stations/<lowercase-slug>.png|webp or assets/logos/networks/<lowercase-slug>.png|webp, relative to the fetched v1/ base URL. No full URL, leading slash, query, fragment, percent escapes, backslash, traversal or unsupported extension is accepted. Referenced files must exist and be regular portable files; symlink components are rejected. Size is 1–262144 bytes, with width/height each 1–512 pixels. Headers must match PNG or a supported WebP VP8/VP8L/VP8X container. Header inspection is structural, not a full raster-decoder or visual branding check; those remain editorial requirements before inclusion.

The client resolves station.logoPath first, otherwise its network.logoPath, otherwise its locally bundled RadioBee fallback. Resolve relative to the catalogue v1 base (not the app origin), handle image-load errors with fallback, and do not infer stream playback permission from logo availability. A single network image must not be copied to every child station row. This repository documents that priority; it does not change client behavior.

The existing recursive static copy publishes assets under dist/v1/assets/logos/. Build validation runs against the selected root before copying. Tests exercise exact byte copying and retained JSON paths with synthetic temporary one-pixel PNGs; no broadcaster or generated stand-in logo is committed. All legacy JSON without logos remains valid. No catalogue version/count bump is needed because no station/network content or artwork references were changed; schemas retain v1.

## Awaiting suitable artwork (complete coverage inventory)

Every following ID has no logoPath; all network children therefore currently use client fallback:

- **akashvani** (29 listings): air-nagercoil, air-chennai, air-coimbatore, air-madurai, air-tiruchirappalli, air-tirunelveli, air-kodaikanal, air-ooty, air-thoothukudi, air-vellore, air-puducherry, air-karaikal, air-thiruvananthapuram, air-kochi, air-kozhikode, air-thrissur, air-kannur, air-devikulam, air-bengaluru, air-hyderabad, air-new-delhi, air-mumbai, air-tamil, air-malayalam, air-vividh-bharati, air-raagam, air-chennai-rainbow, air-chennai-gold, air-chennai-vividh-tamil.
- **suryan-in** (9 listings): suryan-nagercoil, suryan-chennai, suryan-coimbatore, suryan-madurai, suryan-tiruchirappalli, suryan-tirunelveli, suryan-thoothukudi, suryan-puducherry, suryan-salem.
- **hello-fm** (9 listings): hello-nagercoil, hello-chennai, hello-coimbatore, hello-madurai, hello-tiruchirappalli, hello-tirunelveli, hello-thoothukudi, hello-salem, hello-puducherry.
- **mirchi** (9 listings): mirchi-chennai, mirchi-coimbatore, mirchi-madurai, mirchi-tiruchirappalli, mirchi-tirunelveli, mirchi-thiruvananthapuram, mirchi-bengaluru, mirchi-mumbai, mirchi-puducherry.
- **radio-city** (6 listings): radio-city-chennai, radio-city-coimbatore, radio-city-madurai, radio-city-bengaluru, radio-city-mumbai, radio-city-pune.
- **red-fm** (5 listings): red-erode, red-salem, red-vellore, red-thiruvananthapuram, red-new-delhi.
- **big-fm** (5 listings): big-chennai, big-puducherry, big-bengaluru, big-mumbai, big-thiruvananthapuram.
- **fever-fm** (1 listings): fever-chennai.
- **shakthi-lk** (3 listings): shakthi-colombo, shakthi-jaffna, shakthi-srilanka.
- **sooriyan-lk** (1 listings): sooriyan-srilanka.
- **vasantham-lk** (1 listings): vasantham-srilanka.
- **slbc** (3 listings): slbc-thendral, slbc-tamil-national, yaal-fm.
- **asr-digital** (1 listings): asr-kanyakumari.
- **annai-fm** (1 listings): annai-kuzhithurai.
- **kumari-tamil** (1 listings): kumari-tamil-kanyakumari.
- **luminous-radio** (2 listings): luminous-radio, luminous-radio-tamil.
- **capital-lk** (1 listings): capital-srilanka.
- **club-fm** (1 listings): club-thiruvananthapuram.

## Validation

Run npm run validate, npm test and npm run build through WSL2 Linux Node. Logo checks are included in ordinary validation, without live network access or new dependencies. The deterministic tests cover station/network optional properties, missing/unsafe references, header/dimension/size limits, symlink escape, legacy data and exact static copying. No streams were probed for this artwork task. Final results are reported in the delivery.
