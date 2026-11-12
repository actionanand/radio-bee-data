# Stage 33 — Direct-stream candidates only

Stage 33's 12 discovery-only stations have been removed from the **published v2 station catalogues** because RadioBee must only list stations that have direct audio URL candidates.

- Published stream-bearing stations: **240** (239 unchanged prior candidates + one RED FM Calgary candidate)
- Direct HTTPS stream URL candidates: **244**
- Discovery-only stations: **0**
- Stream verification and in-app playback **not established** by this change; the one new Calgary stream remains `unverified`.
- No TV-news channels were introduced.

## Research leads — NOT published as stations or streams

These are historical or directory-listed URLs supplied by the user or found in web directories. Some use insecure HTTP, may be inactive, may be a playlist, or may be incorrectly attributed. No city-specific Suryan stream is established.

- **Radio Beat Retro:** `http://5.63.151.52:7142/stream`
- **Radio Beat Malayalam:** `http://malayalam.radiobeat.in`
- **Tamil Comedy Radio:** `http://tamilcomedy.gomaly.com:7010`
- **Southradios Tamil Lite:** `http://212.83.138.48:8348/;`
- **Suryan FM 93.5 (unspecified city):** `https://tamil.crabdance.com:8002/2`
- **Mirchi 98.3 (city/origin unconfirmed):** `http://peridot.streamguys.com:7150/Mirchi`
- **RED FM Calgary CKYR (HTTP):** `http://14013.live.streamtheworld.com/CKYRFM_SC`
- **RED FM Calgary CKYR (HTTPS candidate):** `https://ice10.securenetsystems.net/CKYR`
- **RED FM Calgary CKYR (playlist, not direct stream):** `http://playerservices.streamtheworld.com/pls/CKYRFM.pls`

The 12 removed discoveries were: Suryan FM Madurai; Suryan FM Puducherry; Suryan FM Tirunelveli; Suryan FM Tiruchirappalli; Suryan FM Coimbatore; Radio Beat Retro; Radio Beat Malayalam; Tamil Comedy Radio; Southradios Tamil Lite Radio; Radio Mirchi Delhi 98.3; Red FM Delhi 93.5; Mirchi FM Fiji (FBC).

A station should only return to `data/v2/stations.json` when a non-duplicate HTTPS direct stream candidate has been credibly associated with its exact identity. Discovery-only records must not be added. Existing candidates are not guaranteed playable until actual FFprobe/FFmpeg and client tests succeed.
