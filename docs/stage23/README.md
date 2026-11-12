# Stage 23 — Sanskrit Radio Browser discovery expansion (v2.4.0)

User-reported 8-second FFmpeg decode success on six streams, 2026-11-13. No independent browser/Android verification or rights clearance. Source: https://de1.api.radio-browser.info/json/stations/bylanguage/sanskrit?hidebroken=true

Two HTTPS candidates were added to playback trial catalogue; four HTTP-only Radio Sai endpoints were added as **metadata-only discovery**. No HTTP streaming URLs were inserted into the HTTPS-only v2 stream schema. Radio Sai stream display names are explicitly provisional because directory labels may conflict with broadcaster station identities.

| Station | Record | URL | Status |
|---|---|---|---|
| Mahakatha Radio | Trial stream | https://mahakatharadio.com/api/station/live.mp3 | User FFmpeg pass; identity/rights not approved |
| Shaiva Lahari | Trial stream | https://radio.shaivam.org/listen/shaiva-lahari/radio.mp3 | User FFmpeg pass; identity/rights not approved |
| Radio Sai — 8006 (directory: Gayathri Mantra) | Discovery only | http://stream.radiosai.net:8006/ | User FFmpeg pass; identity/rights not approved |
| Radio Sai — 8004 (directory: Sai Gayathri) | Discovery only | http://stream.radiosai.net:8004/ | User FFmpeg pass; identity/rights not approved |
| Radio Sai — 8012 (directory: Shiva Panchakshari) | Discovery only | http://stream.radiosai.net:8012/ | User FFmpeg pass; identity/rights not approved |
| Radio Sai — 8010 (directory: Vedam) | Discovery only | http://stream.radiosai.net:8010/ | User FFmpeg pass; identity/rights not approved |

Prior 118 stations and 122 stream URLs remain unchanged. New totals: 120 stream-bearing stations, 4 discovery-only, 124 stations visible, 124 stream URLs. Catalog version 2.4.0. No v1 modifications. Sanskrit Radio Bharati and Divyavani were already present and were not duplicated.
