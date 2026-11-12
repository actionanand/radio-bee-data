# Stage 31 — Tamil and English live TV-news audio (v2.9.0)

User-requested follow-up to Stage 30. Existing two News7 Tamil and Polimer News candidates remain unchanged. This adds 17 other distinct Tamil/English news channels, all named according to the iptv-org India playlist (not automatically authenticated against broadcaster owners). [GitHub Actions #43311926400](https://github.com/actionanand/radio-bee-data/actions/runs/43311926400) tested 25 candidate HTTPS HLS playlists: 20 audio-decode passes representing 17 distinct channels; failed and redundant URLs were excluded.

**All 17 streams have H.264 video and AAC audio.** FFmpeg decoded six seconds of audio; this is NOT an actual RadioBee audio-only HTMLAudioElement/hls.js browser or Android playback pass, not a promise of ongoing uptime and not a rights/recording/rebroadcast approval. Maintain `verificationStatus=unverified`, `rightsStatus=unconfirmed`, direct-listening `needs-review` and unknown recording/redistribution permission. No new discovery-only cards. No TV video hosted or restreamed.

| Station | Language | HLS URL |
|---|---|---|
| News18 Tamil Nadu — TV News Audio | ta | https://n18syndication.akamaized.net/bpk-tv/News18_Tamil_Nadu_NW18_MOB/output01/master.m3u8 |
| Thanthi TV — TV News Audio | ta | https://streams.tangotv.in/THANTHITV/ORIGIN/index.m3u8 |
| Puthiya Thalaimurai — TV News Audio | ta | https://cdn.pishow.tv/ott/live/1261/master.m3u8 |
| News Tamil 24x7 — TV News Audio | ta | https://vglivessai.akamaized.net/ptnr-yupptv/title-News_Tamil/sg/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/bc657abd-5bf5-4526-9038-d42bbb9ca249/index.m3u8 |
| Sathiyam TV — TV News Audio | ta | https://mumt07.tangotv.in/zHjX9OFlSATHIYAMTV/index.m3u8 |
| Kalaignar Seithigal — TV News Audio | ta | https://raw.githubusercontent.com/amazeyourself/adaptive-streams/refs/heads/main/streams/in/YuppTV/KalaignarSeithigal.m3u8 |
| Tamil Janam — TV News Audio | ta | https://mumt01.tangotv.in/O5aw8Zn3JANAMTVTAMIL/index.m3u8 |
| CNN-News18 — TV News Audio | en | https://n18syndication.akamaized.net/bpk-tv/CNN_News18_NW18_MOB/output01/master.m3u8 |
| India Today — TV News Audio | en | https://indiatodaylive.akamaized.net/hls/live/2014320/indiatoday/indiatodaylive/playlist.m3u8 |
| NDTV 24x7 — TV News Audio | en | https://ndtv24x7elemarchana.akamaized.net/hls/live/2003678/ndtv24x7/master.m3u8 |
| NDTV Profit — TV News Audio | en | https://ndtvprofit.akamaized.net/hls/live/2107404/ndtvprofit/master_1.m3u8 |
| WION — TV News Audio | en | https://d7x8z4yuq42qn.cloudfront.net/index_1.m3u8 |
| Republic TV — TV News Audio | en | https://samsung-republictv.amagi.tv/ts-ap-s1-n1/playlist/samsungin-republictv-samsungindia/playlist.m3u8 |
| DD India — TV News Audio | en | https://mumbai-edge.smartplaytv.in/DDIndia/index.m3u8 |
| CNBC TV18 — TV News Audio | en | https://n18syndication.akamaized.net/bpk-tv/CNBC_TV18_NW18_MOB/output01/index.m3u8 |
| Mirror Now — TV News Audio | en | https://dai.google.com/linear/hls/event/ClPOullTQky5vGPf7fMZ8g/master.m3u8 |
| NewsX — TV News Audio | en | https://cdn.pishow.tv/ott/live/1765/master.m3u8 |

Excluded: Zee Tamil News (audio probe failed), Times Now and ET Now (403), initial NewsX (timeout; alternate passed), and duplicate alternate feeds. Resulting v2.9.0 totals: **244 station entries, 248 stream URLs, zero discovery-only**. All existing records preserved; v1 unchanged.
