# Stage 33 — Streema, Suryan cities, Radio Beat, Mirchi and RED FM

Added **12 discovery-only, correctly named radio stations** (not playable), plus **one new unverified HTTPS AAC direct-stream candidate** for CKYR RED FM Calgary. Retained all existing 239 playable-candidate stations and 243 stream URLs. All additions have sourceIds and independent locations where known.

## Discovery-only (no direct HTTPS audio validated)

- Suryan FM Madurai (IN) — stage33-suryan-madurai
- Suryan FM Puducherry (IN) — stage33-suryan-puducherry
- Suryan FM Tirunelveli (IN) — stage33-suryan-tirunelveli
- Suryan FM Tiruchirappalli (IN) — stage33-suryan-tiruchirappalli
- Suryan FM Coimbatore (IN) — stage33-suryan-coimbatore
- Radio Beat Retro (IN) — stage33-beat-retro
- Radio Beat Malayalam (IN) — stage33-beat-malayalam
- Tamil Comedy Radio (IN) — stage33-tamil-comedy-radio
- Southradios Tamil Lite Radio (IN) — stage33-southradios-tamil-lite
- Radio Mirchi Delhi 98.3 (IN) — stage33-mirchi-delhi
- Red FM Delhi 93.5 (IN) — stage33-red-delhi
- Mirchi FM Fiji (FBC) (FJ) — stage33-fbc-mirchi-fiji

## Direct stream candidate

- RED FM Calgary 106.7 (CKYR), Canada: `https://ice10.securenetsystems.net/CKYR` (directory-listed AAC, not FFmpeg confirmed). The supplied `http://14013.live.streamtheworld.com/CKYRFM_SC` and `http://playerservices.streamtheworld.com/pls/CKYRFM.pls` refer to that **same CKYR station**, not independent stations.

## Exclusions and identity protection

- `http://peridot.streamguys.com:7150/Mirchi` refers to **FBC Mirchi FM Fiji**, not Indian Radio Mirchi. It is HTTP-only, so store identity as discovery only; do not change the scheme speculatively.
- RadioIndia's Mirchi 98.3 directory does not demonstrate a Delhi-specific direct stream; Chennai remains unchanged in the existing catalogue.
- Five Suryan regional stations have separate identities but no unique, confirmed city-specific internet streams; do not reuse Chennai's stream.
- No TV news stations reintroduced. No rights/recording/rebroadcast permissions asserted.
