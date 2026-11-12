# Stage 27 — Dedicated artist-radio streams (v2.7.0)

GitHub Actions [research probe #43300320633](https://github.com/actionanand/radio-bee-data/actions/runs/43300320633) tested 13 candidate HTTPS streams on 2026-11-13. **9 decoded successfully** with FFmpeg for six seconds. The four Tamil composer/actor/singer candidate URLs timed out and remain research-only. No non-playing/discovery-only cards were added.

| Station | Country (provisional) | URL | CI probe |
|---|---|---|---|
| 80s80s Michael Jackson | DE | https://streams.80s80s.de/mj/mp3-128/streams.80s80s.de/ | PASS (6s FFmpeg) |
| Exclusively Michael Jackson | AE | https://streaming.exclusive.radio/er-app/michaeljackson/icecast.audio | PASS (6s FFmpeg) |
| Exclusively Justin Bieber | AE | https://streaming.exclusive.radio/er-app/justinbieber/icecast.audio | PASS (6s FFmpeg) |
| Exclusively Shakira | AE | https://streaming.exclusive.radio/er-app/shakira/icecast.audio | PASS (6s FFmpeg) |
| Exclusively One Direction | AE | https://streaming.exclusive.radio/er-app/onedirection/icecast.audio | PASS (6s FFmpeg) |
| Exclusively Adele | AE | https://streaming.exclusive.radio/er-app/adele/icecast.audio | PASS (6s FFmpeg) |
| Exclusively Ed Sheeran | AE | https://streaming.exclusive.radio/er-app/edsheeran/icecast.audio | PASS (6s FFmpeg) |
| Exclusively Queen | AE | https://streaming.exclusive.radio/er-app/queen/icecast.audio | PASS (6s FFmpeg) |
| Exclusively Westlife | AE | https://streaming.exclusive.radio/er-app/westlife/icecast.audio | PASS (6s FFmpeg) |

Candidates not included: Ilaiyaraaja Radio, A. R. Rahman Radio, Kamal Haasan Hits, SPB Hits — attempted URLs timed out. Further Tamil-specific streams and Shah Rukh Khan dedicated streams require source and audio verification before publication. Avoid inventing artist-branded stations from generic Hindi/Tamil music streams.

All nine new streams remain `verificationStatus=unverified`, `rightsStatus=unconfirmed` and `directListening.status=needs-review`. Audio decoding is technical evidence, not a rights grant, guaranteed uptime, or an Android/Web playback pass. Prior Stage 26 language additions are preserved. Total v2.7.0: **144 stream-bearing stations, 148 URLs, 0 discovery-only**. No v1 changes.
