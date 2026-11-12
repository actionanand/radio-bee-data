# Stage 22 — Sanskrit and international language radio trials (v2.3.0)

## Scope

26 **new stream-bearing** radio station records: 2 dedicated Sanskrit-language Internet stations and 24 reviewed selections from the user's `Fmradio/fmradio.txt` playlist. 14 new country location records and new broadcast-language codes are introduced only where absent. The existing Tamil, English, Sanskrit and all older stations/streams are retained without mutation; v1 files untouched.

## Evidence and limits

- https://github.com/2009skvgamerz/Fmradio/blob/main/fmradio.txt lists 86 entries, including a repeated Lithuania block, HTTP-only streams, session-bound signed links and directory pages. These are excluded when no stable HTTPS endpoint exists.
- Sanskrit stations use additional HTTPS URLs separately listed in the public curated M3U repositories. They are online radio; no dedicated Sanskrit terrestrial FM frequency is asserted.
- All 26 candidates are **unverified**. A playlist link does **not** establish decoded playback, present station identity, complete on-air language classification, rights grant, browser compatibility or FM transmitter coverage. Codec guesses and language labels are provisional unless a publisher source supports them.
- Radio Browser's Sanskrit JSON endpoint could not be retrieved from this environment; do not treat this batch as an exhaustive or confirmed Radio Browser API export. Users can probe that service in WSL2 separately.
- New network entries are provisional single-station browse identities, not organizational ownership claims. Any claimed terrestrial FM delivery remains **candidate metadata**, not licensed-transmitter evidence.

## Station inventory

| Station | Country | Broadcast language (candidate) | HTTPS URL |
| --- | --- | --- | --- |
| Divyavani Sanskrit Radio | IN | sa | https://divyavani.radioca.st/stream |
| Radio Sanskrit Bharati | IN | sa | https://stream.zeno.fm/c0adewsyw8quv |
| Radio Paloma | DE | de | https://pool.radiopaloma.de/RADIOPALOMA.mp3 |
| Radio Norge | NO | no | https://live-bauerno.sharp-stream.com/radionorge_no_mp3 |
| RealRadio Ireland | IE | en | https://stream.zeno.fm/6g19fr9psnhvv |
| Nostalgia Finland | FI | fi | https://stream.bauermedia.fi/nostalgia/nostalgia_128.mp3 |
| SuomiPop | FI | fi | https://digitacdn.akamaized.net/hls/live/629243/radiosuomipop/master.m3u8 |
| Radio-R Lithuania | LT | ru | https://stream1.rusradio.lt/rrb128.mp3 |
| Znad Wilii | LT | pl | https://plays.zw.lt/zw128 |
| Pop FM Denmark | DK | da | https://live-bauerdk.sharp-stream.com/popfm128.mp3 |
| MyRock Denmark | DK | da | https://live-bauerdk.sharp-stream.com/myrock.mp3 |
| Radio Stad Den Haag | NL | nl | https://stream.radiostaddenhaag.com/stream/1/ |
| SLAM! Netherlands | NL | nl | https://25233.live.streamtheworld.com/SLAM_MP3_SC |
| Radio Kiss Kiss Italia | IT | it | https://ice06.fluidstream.net/KKItalia.aac |
| Exa FM Mexico | MX | es | https://27033.live.streamtheworld.com/XHEXA_SC |
| Sveriges Radio P1 | SE | sv | https://http-live.sr.se/p1-mp3-192 |
| Pirate Rock Sweden | SE | sv | https://stream.piraterock.se:8100/webradio |
| Radio dla Dorosłych | PL | pl | https://s3.slotex.pl:7586/stream |
| Radio Max Croatia | HR | hr | https://azuracast.novi-net.net/radio/8010/radiomax.aac |
| Nagham FM Egypt | EG | ar | https://ahmsamir.radioca.st/stream |
| Radio ROKS Ukraine | UA | uk | https://online.radioroks.ua/RadioROKS |
| Radio NRJ Ukraine | UA | uk | https://cast.radiogroup.com.ua/nrj |
| Radio Jamaica | JM | en | https://stream.zeno.fm/ebqnzkvyv9duv |
| Telemetro Radio Panama | PA | es | https://us-b4-p-e-zs14-audio.cdn.mdstrm.com/live-audio-aw/5eed1f402a71ff071938abc2 |
| 77H FM Guarujá SP | BR | pt | https://stream.zeno.fm/wc7imbfxq9cvv |
| Jazz Radio Blues France | FR | fr | https://jazzblues.ice.infomaniak.ch/jazzblues-high.mp3 |
