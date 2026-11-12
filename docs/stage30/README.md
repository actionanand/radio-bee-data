# Stage 30 — Correctly identified Tamil television news audio (v2.8.1)

User requested that the two TV news channels from TamilRadios not be discarded merely because the pages were misnamed. Their HLS stream URLs are reproduced as audio candidates with corrected broadcaster labels:

| Station | Stream | Provenance |
|---|---|---|
| News7 Tamil — TV News Audio | https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/news7_nim_https/240122/news7/playlist.m3u8 | https://www.tamilradios.com/sun-news-live (misleading Sun News page title; playlist itself identifies News7) |
| Polimer News — TV News Audio | https://yuppmedtaorire.akamaized.net/v1/master/a0d007312bfd99c47f76b77ae26b1ccdaae76cb1/polimernews_nim_https/110322/polimernews/playlist.m3u8 | https://www.tamilradios.com/polimer-news-live |

[GitHub Actions audio probe run 43310487366](https://github.com/actionanand/radio-bee-data/actions/runs/43310487366) detected both H.264 video and AAC audio in each mixed TV-news HLS playlist, and FFmpeg decoded six seconds of both audio tracks. The feed may change over time. This establishes technical audio availability during the test, **not** guaranteed playback via RadioBee's HTMLAudioElement/hls.js audio-only engine. Browser and Android device playback must be tested before claiming that these streams always play.

Added two stream-bearing, `hls` formatted, `news`-genre trial stations. All flags remain `verificationStatus: unverified`, `rightsStatus: unconfirmed` and direct listening/recording/redistribution permissions not approved. Prior 225 stations and 229 URLs are untouched. Total: **227 stations, 231 URLs, zero discovery-only entries**. No v1 changes and no licence claims. This is catalogue metadata and direct links only; no TV video is embedded or restreamed.
