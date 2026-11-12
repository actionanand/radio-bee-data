# Stage 26 — Indian regional radio playback trials (v2.6.0)

Research started from merged Stage 24/25 catalogue v2.5.0. The [33 sourced candidate records](./candidates.json) were probed in GitHub Actions job [43299436023](https://github.com/actionanand/radio-bee-data/actions/runs/43299436023), using FFmpeg to decode six seconds of audio per HTTPS URL. **Ten passed**, and 23 failed or timed out. This is limited audio-decoding evidence, not a promise of enduring availability, official broadcaster identity or RadioBee Android/Web playback.

Only the ten FFmpeg-passed URLs are added to stream-bearing `stations.json`. Failed candidates stay research-only; **zero discovery-only stations** in published catalogue. All new playback URLs remain `verificationStatus=unverified`, `rightsStatus=unconfirmed`, and `directListening.status=needs-review`. Recording and redistribution are unconfirmed. No legacy stations/URLs or v1 files are changed.

| Station | Country (provisional) | Language | Decoded HTTPS stream |
|---|---|---|---|
| Hello Telugu | IN | te | https://listen.radioking.com/radio/503281/stream/560701 |
| Radio Malayalam | IN | ml | https://radiomalayalamfm.com/radio/8000/radio.mp3 |
| Bol Punjabi Radio | IN | pa | https://bolpunjabi-ekamsoftware.radioca.st//stream |
| Radio Mast Marathi | IN | mr | https://stream.zeno.fm/8fqvoovoiwtuv |
| Free FM — UAE Sinhala Radio | AE | si | https://stream.zeno.fm/n7u7aog5og6vv |
| Radio AMR Kannada | IN | kn | https://stream.zenolive.com/7g8axtgtsg0uv |
| Kannada Hits | IN | kn | https://stream.zeno.fm/68snnbug8rhvv |
| Hindi Gold Radio | IN | hi | https://azuracast.vibesounds.in:8010/radio.mp3 |
| Radio Mirchi Dubai (directory listing) | AE | hi | https://eu8.fastcast4u.com/proxy/clyedupq/stream |
| Radio Quarantine Kolkata | IN | bn | https://stream.zeno.fm/krk4kw830tzuv |

Language coverage from this batch: Kannada (2), Telugu (1), Malayalam (1), Hindi (2), Punjabi (1), Marathi (1), Bengali (1), Sinhala (1). No tested working Odia, Gujarati or Assamese URL in this batch. Radio Mirchi's Dubai identity and UAE Sinhala country attribution need further editorial confirmation; do not assert an Indian broadcaster relationship.

New catalogue totals: 135 stream-bearing stations, 139 URLs, 0 discovery entries. Counts do not claim all 135 stations are decoder-verified.
