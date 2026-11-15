# V2-only radio stream discovery — 15 November 2026

This change imports **23 distinct candidate audio services** into V2. The original 240 station records and 245 streams are retained. The client and all `data/v1` files remain unchanged.

## Import conditions

Captured via the user's Playwright browser network run, from the supplied public directory pages. These are stream **candidates**, not verified broadcaster-authorized playback. Each uses `verificationStatus: unverified`, `rightsStatus: unconfirmed`, and `directListening.status: needs-review`; recording and redistribution are unconfirmed. Stable HTTPS HLS playlist or public redirect endpoints were preferred. Signed, short-lived Surfernetwork tokens and HLS audio segments were excluded.

## Imported entries

| Language / group | Stations |
| --- | --- |
| English | Al Jazeera English **audio-only** |
| Hindi | Akashvani Agra; Kadak FM UAE |
| Odia | Akashvani Jeypore |
| Marathi | Radio Sugar 90.8; MGM Radio 90.8; Radio Uday 89.6 |
| Malayalam | Akashvani Alappuzha; Ananthapuri FM; Kozhikode Real FM |
| Bengali | FM Gold Kolkata; Gitanjali Radio; Akashvani World Service Bangla; Akashvani Siliguri; Nityananda Janavani |
| Gujarati | Akashvani Bhuj; Akashvani Surat |
| Kannada | Suno Kannada; Sakkath Radio; Namm Radio India, Europe, Gulf and USA |

The four Namm Radio feeds share the same `namm-radio` network and genre image but retain their different stream URLs. Akashvani stations reuse the existing `akashvani` network artwork. All other new stations reuse data-hosted V2 genre illustrations; they are not official station logos.

## Explicit exclusions

- **Aaj Tak News:** excluded entirely. Browser capture showed a video HLS playlist; no audio extracted or imported.
- **Generic RED FM and Mirchi pages:** no distinct region/language feed proven. Existing Mirchi Chennai, Mirchi Dubai, and RED FM Canada remain unchanged. These brands should not be duplicated solely based on the directory's language grouping.
- **Radio City 91.1 / Akashvani Kozhikode, Kochi, Thrissur and Kannur:** captured audio URLs already occur in V2.
- **FM 24 90.8:** shares `mgmradio.m3u8` with MGM Radio; publish MGM once only.
- **132 other pages without captured stream candidates:** not imported as playable audio.
- **Suno Kannada:** directory labels Kannada, but technical endpoint says `RADIO_SUNO_MELODY_S06_SC`; programming identity needs independent review.

## Sources and further verification

Every added record references an individual `stage38-source-*` entry in `data/v2/sources.json` giving its directory page and date of browser capture. Additional broadcaster context: https://nammradio.com/ , https://www.admn.ae/en/brand/4197620/kadak-fm , https://olivesuno.com/ , https://akashvani.gov.in/radio/live.php , https://www.aljazeera.com/audio/live/ . Stream availability in other countries, codec compatibility, broadcaster identity and listening rights remain unconfirmed.
