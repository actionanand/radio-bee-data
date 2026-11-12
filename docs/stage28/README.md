# Stage 28 — Fix radio playback codec metadata (v2.7.1)

The v2.7.0 catalogue declared 18 FFmpeg-decoded audio streams as `format: "unknown"`. RadioBee's shared `streamEligibility` policy accepts only `mp3`, `aac`, and `hls`, so those streams showed "Listening unavailable" and no Play button even when the HTTPS URL existed.

GitHub Actions [codec probe #43301779868](https://github.com/actionanand/radio-bee-data/actions/runs/43301779868) used FFprobe on the exact 18 HTTPS URLs and returned `codec_name=mp3` for **all 18**.

This patch changes only the 18 individual `format` fields in `stations.json`, updates the catalogue and browse-index version to **2.7.1**, and adds regression tests. It preserves **all 144 station IDs, 148 stream URLs, language tags, network references, direct-listening, recording and redistribution rights, and v1 files**. In particular, do not append `utm_source=chatgpt.com` to the Exclusively Michael Jackson URL; this is a nonessential tracking query parameter.

Passing FFprobe/FFmpeg does **not** itself establish Chrome/Android actual playback, station identity, sustained availability or streaming authorization. Policy checks for rights and verification are unchanged.

| Corrected station ID | Verified codec |
|---|---|
| hello-telugu-in | MP3 |
| radio-malayalam-in | MP3 |
| bol-punjabi-radio-in | MP3 |
| radio-mast-marathi-in | MP3 |
| freefm-uae-sinhala-ae | MP3 |
| radio-amr-kannada-in | MP3 |
| kannada-hits-in | MP3 |
| hindi-gold-radio-in | MP3 |
| radio-mirchi-dubai-ae | MP3 |
| radio-quarantine-kolkata-in | MP3 |
| exclusively-michael-jackson-ae | MP3 |
| exclusively-justin-bieber-ae | MP3 |
| exclusively-shakira-ae | MP3 |
| exclusively-one-direction-ae | MP3 |
| exclusively-adele-ae | MP3 |
| exclusively-ed-sheeran-ae | MP3 |
| exclusively-queen-ae | MP3 |
| exclusively-westlife-ae | MP3 |
