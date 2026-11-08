# Kanyakumari station discovery

Reviewed **8 November 2026**. One existing published local service remains unchanged. One new broadcaster-associated Internet programme produced short browser playback progress but has no confirmed RadioBee use allowance. No new catalogue card is approved.

| Broadcaster | Local identity evidence | Internet result | Decision |
| --- | --- | --- | --- |
| Akashvani Nagercoil / Kumari FM | Existing official named service; stable `air-nagercoil` | Original official HLS again redirected to HTTPS CloudFront; manifest and bounded first segment retrieved | Retain original URL and ID. No duplicate AIR/Kumari/101.0 card or status/rights promotion. Client player-engine investigation remains separate. |
| Suryan FM Nagercoil | Dated 18 August 2026 trade launch report for 91.9; broadcaster-branded launch post corroborates locality/frequency | Supplied network-labelled crabdance URL timed out in two sessions; no Nagercoil player mapping | Keep `suryan-nagercoil` archived. March regulator snapshot predates launch; does not refute it. |
| Hello FM Nagercoil | Specialist/secondary references report 91.1; current broadcaster/regulator confirmation remains missing | Official-domain HTTPS refused; no distinct Nagercoil feed | Keep `hello-nagercoil` archived, confirmed frequency still null. Never assign Chennai 106.4 to Nagercoil. |
| Annai FM | Broadcaster-authored Zeno page places Tamil/Malayalam Internet programme at Parakunnu near Kuzhithurai; Radio India corroborates | Current profile-linked annai-fm.mdn.live page reached. Zeno browser startup returned media error 4; its query-bearing URL withheld | Group C. Preserve `annai-kuzhithurai`; one programme, two nearby place descriptors. Obtain canonical endpoint and resolve playback/use review. |
| ASR Digital Radio | Broadcaster domain; directory lists Monday Market/Neyyoor postal area | Earlier official cast HTTPS URL still 404 in both sessions. Current bounded page publishes four HTTP Zeno mounts; none upgraded by guess | Group C. Preserve `asr-kanyakumari`; do not invent Nagercoil urban studio or Kanyakumari-town feed. |
| Kumari Tamil Media | Historical broadcaster domain and directory connection | `radio.kumaritamil.com` again ENOTFOUND; directory still points there | Group C. Preserve `kumari-tamil-kanyakumari`; no verified domain move or live endpoint. DNS failure does not establish permanent closure. |
| ISKCON Nagercoil / Vaani Seva | Official services and radio pages plus official footer place institution at Puliyurkurichi, Kanyakumari | Official `https://iskconnagercoil.com/webdio`: MP3 signature, HTTP 200, matching ICY name, CORS *, reported 128 kbps; two short browser starts progressed | Group B. No published ID or new network created. Request applicable third-party use review, verify languages and sustained Chrome/native Android playback. |
| Nanjil Radio | Search-indexed owner-style launch post advertises Tamil/English channels | No reusable source established; full page unavailable | Group C lead only. Subreddit membership and brand name do not establish Kanyakumari origin. |

The Radio India player configurations for Annai, ASR and Kumari contain encrypted URL fields. They were identified as such, not decrypted. Authenticated metadata helpers were not called. No encrypted blobs, session URLs, cookies or tokens are copied into the deliverables.

## Locality coverage

| Requested locality | Finding in this review |
| --- | --- |
| Nagercoil | Existing AIR; Suryan/Hello FM evidence/leads; ISKCON regional institution association, without claiming every studio is inside city boundaries. |
| Kanyakumari town | No distinct town-origin Internet programme established; district branding is not town origin. |
| Kuzhithurai | Annai describes Parakunnu nearby; one service, no extra Kuzhithurai simulcast. |
| Parakunnu | Annai's self-described programme origin; Tamil/Malayalam, not Tamil-only by assumption. |
| Neyyoor | ASR directory postal area; Monday Market evidence retained as a location lead. |
| Marthandam | No independently identified distinct local Internet programme established in the bounded searches. |
| Thuckalay | No separately established Internet programme. Do not infer a new station from nearby Puliyurkurichi institution. |
| Colachel | No independently identified distinct local Internet programme established in this review. |
| Puliyurkurichi | ISKCON official footer supplies the local institution address; exact broadcast-production origin still merits broadcaster confirmation. |

No locality rows create station cards. The report does not claim an exhaustive census of every district broadcaster. Nearby Kerala Tamil listening (including existing Luminous Tamil) remains separate; its unassigned catalogue origin was not rewritten as Kanyakumari or Thiruvananthapuram.

## Next actions

1. Ask ISKCON for reviewed permission/use conditions for RadioBee end-user playback, separately covering recording and redistribution; confirm programme languages and production location. No messages were sent.
2. Ask Annai for a canonical non-expiring HTTPS source and investigate its player error; retain the Parakunnu/Kuzhithurai relationship accurately.
3. Ask ASR for its current HTTPS player source and whether the four HTTP mounts represent alternatives or different programmes. Retest the old cast source only when evidence changes.
4. Confirm current Hello 91.1 and Suryan 91.9 transmitter details through broadcaster/regulator evidence; request city-specific online mapping rather than assuming a Chennai feed applies.
5. Seek Kumari's current broadcaster domain via an authenticated broadcaster statement; do not construct a replacement hostname.
6. Continue additional local leads only with programme and origin evidence. Resolve technical, use and client-production-gate issues before any public addition.

Source URLs, dates, detailed safe-probe diagnostics and next actions are recorded in [stream evidence](stream-evidence.json), [city inventory](station-discovery.csv), [source observations](source-observations.json) and [Suryan review](SURYAN-REGIONAL-STREAMS.md).
