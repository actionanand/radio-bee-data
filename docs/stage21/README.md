# Stage 21 — New radio and artist/hits user-captured trials (v2.2.0)

The user's 12 November 2026 WSL2 Playwright player-request logs supplied URLs for 17 **new stream-bearing** station identities. No 17 URLs are declared verified: every stream has verificationStatus=unverified, rightsStatus=unconfirmed, directListening.status=needs-review, recording and redistribution unconfirmed. Some streams may fail in the browser, and network click capture is not proof of sustained playback or operator permission.

- 17 new stream-bearing records (including historically archived RAAGA Malaysia, restored under its canonical ID); total 92 stations and 96 stream URLs. The five previously imported Chennai FM broadcasts are untouched.
- Separate identities: `thaalam-in` (India, Melo's /stream/471 **directory relay**, no codec/playback confirmation) and existing `thaalam-ch` (Switzerland, unchanged Airtime URL). There is no cross-country stream replacement.
- Previously published same-URL leads (Amudham FM and Namathu FM France) were not duplicated. Other existing Akashvani, Mirchi, Suryan, Hello FM and Vasantham streams were not duplicated.
- Deferred: AIR Thoothukudi previously produced HTTP 404; AIR Madurai PC may be a distinct programme and is not copied to Akashvani Madurai; generic Radio Mirchi Openstream feed lacks city association; unconfirmed TRT Tamil Oli geography/other Melo relay URLs require separate review.
- Names using FM do not alone prove an FM transmitter. Where only Internet player evidence exists, delivery remains online and frequencyMHz null. Region/country metadata for new third-party listings remains provisional and must be confirmed with the station.
- Each station source points to the particular listing page observed in the user's Playwright run; temporary signed Openstream, HLS segments and generic site navigation are not published as station streams.

## Added station identities and discovered source URLs

- `pollachi-fm` — Pollachi FM: https://themelo.in/stream/502 (relay, unconfirmed direct audio)
- `inbam-fm` — Inbam FM: https://stream.radio.co/sf55ced545/listen (unverified browser request)
- `kodai-city-fm` — Kodai City FM: https://listen.openstream.co/6812/audio (unverified browser request)
- `radio-beat-love` — Radio Beat Love: https://listen.openstream.co/5770/audio (unverified browser request)
- `radio-beat-extra` — Radio Beat Extra: https://listen.openstream.co/4172/audio (unverified browser request)
- `air-dharmapuri` — Akashvani Dharmapuri: https://radio.wavespb.com/live/36378083c1be092b/36378083c1be092b.m3u8 (unverified browser request)
- `vaanam-fm-hd` — Vaanam FM HD: https://fra-ranger01.dedicateware.com:8008/stream (unverified browser request)
- `tamil-80s-hits` — 80s Tamil Hits: https://stream.zeno.fm/48w230kx8vzuv.aac (unverified browser request)
- `amr-radio-ca` — AMR Radio: https://radio.amrlive.ca/listen/tamilfm/radio.mp3 (unverified browser request)
- `thaalam-in` — Thaalam FM India: https://themelo.in/stream/471 (relay, unconfirmed direct audio)
- `slbc-tamil-national-service` — SLBC Tamil National Service FM: https://node-13.zeno.fm/xekhrn4zetzuv (unverified browser request)
- `ilangai-vaanoli` — Ilangai Vaanoli: https://ilangaivaanoli1.out.airtime.pro/ilangaivaanoli1_a (unverified browser request)
- `ilayaraja-radio` — Ilaiyaraaja Radio: https://stream.zenolive.com/pwm9y3eud5zuv.aac (unverified browser request)
- `kumbakonam-city-fm` — Kumbakonam City FM: https://stream.zeno.fm/hrao59mmrtiuv (unverified browser request)
- `ada-ceylon-fm` — ADA Ceylon FM: https://stream.zeno.fm/c32gn1eas2zuv (unverified browser request)
- `vellore-city-fm` — Vellore City FM: https://stream.zeno.fm/g2ehl29dhriuv (unverified browser request)
- `raaga-my` — RAAGA Malaysia: https://listen.openstream.co/7044/audio (unverified browser request)
