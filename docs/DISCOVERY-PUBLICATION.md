# Kanyakumari discovery expansion

> Historical 1.5.0 implementation snapshot. The subsequent user-authorized worldwide trial expansion is documented in [the current 1.6.0 review](WORLDWIDE-TAMIL.md). The metadata-only publication contract remains unchanged.

Prepared 8 November 2026 for review. Data branch: feature/10-kanyakumari-discovery, based on freshly fetched master. Client: existing feature/9-radio-playback-reliability retained because it contains relevant unmerged Stage 9 fixes. Those edits were snapshotted before this task; no existing player/recording implementation files were changed by this task. No commit, push, merge or deployment was performed.

## Implemented result

Catalogue **1.5.0**, schemaVersion **1** adds **41 metadata-only station records** in a separately validated/publicly built discovery-stations.json. The existing stations.json is byte-for-byte unchanged: **24 candidate-bearing stations, 26 URLs, one historical technical verification, zero stations with reviewed production listening approval**. Total discoverable count increases **24 → 65**; candidate-bearing count stays **24**; approved-listening count stays **0**. Of the metadata entries, 33 reuse archived IDs and eight are new identities (four local channels and four supported regional listings). All 64 legacy playback-removal entries and all archived evidence remain intact.

The client fetches the optional file atomically with the rest of the manifest, validates it, and exposes metadata cards through ordinary search, favourites, network grouping and country/state/district/locality/language filters. A discovery card has **no streams**, no enabled Play action, a localized availability label, and a reviewed official/provider link where available. 27 of 41 metadata cards have such links; the rest retain null instead of invented/unverified websites. Native proper names fall back to their canonical spelling; English, Tamil and Sanskrit control/status labels remain available. Existing themes and mobile styles use the current theme variables.

Discovery favourites retain the same station ID across later validated transitions into/out of the playback array. Duplicate IDs, names/aliases, bad references, stale counts and stream-bearing discovery payloads are rejected. A failed discovery fetch/validation leaves the last complete cached snapshot available. Legacy manifests/caches without the optional extension still load.

## Mandatory local stations

| Station / stable ID | Identity and status | Public website/provider fallback |
| --- | --- | --- |
| Suryan FM Nagercoil — suryan-nagercoil | no-direct-stream. FM frequency is verified by the cited launch report. Internet endpoint not verified. | https://www.suryanfm.in/ |
| Hello FM Nagercoil — hello-nagercoil | no-direct-stream. EDITORIAL TODO: independent primary evidence for a Hello FM Nagercoil transmitter is missing. Seed candidate only; no local frequency or Internet stream asserted. | None currently confirmed |
| Annai FM — annai-kuzhithurai | temporarily-unavailable. One Annai Internet programme, self-described origin Parakunnu near Kuzhithurai. Browser startup failed in Stage 9; current reusable direct source and use conditions pending. | https://zeno.fm/radio/annai-fm/ |
| ASR Digital Radio — asr-kanyakumari | temporarily-unavailable. ASR general programme at Thingalnagar/Neyyoor postal area. Separate Christian Samy channel shares ASR network; do not merge programmes. Earlier direct HTTPS source returns 404; listening/recording conditions unconfirmed. | https://radio.asrdmm.com/ |
| Kumari Tamil Media — kumari-tamil-kanyakumari | no-direct-stream. Documented district-associated Internet radio; precise origin remains unconfirmed. Former website fails DNS. No verified replacement official/provider link or direct feed. | None currently confirmed |
| Tamilosai FM — tamilosai-nagercoil | no-direct-stream. Distinct Tamil online station identified by matching directory/site references. Historical website fails DNS; current operator-controlled page, direct audio and permissions remain unconfirmed. Not BBC Tamilosai. | None currently confirmed |
| Isai Murasu FM — isai-murasu-nagercoil | no-direct-stream. Rotary News identifies Mohammed Askar as founder in Nagercoil and describes interviews. Directory religious labels conflict; neither Christian nor exclusively Islamic programming is asserted. No matching broadcaster-controlled website or direct feed confirmed. | None currently confirmed |
| Christian Samy FM — christian-samy-fm | temporarily-unavailable. Official ASR site names a distinct Christian devotional channel. Provider listing association supports discovery, not verified audio, independent ownership or app playback/recording permission. Current provider profile labels Tamil/Religious; bounded browser startup on 8 November returned media error 4. No session URL retained. | https://zeno.fm/radio/christian-samy-fm/ |
| ISKCON Nagercoil / Vaani Seva — iskcon-nagercoil | review-pending. Official institution/player association and short browser playback established. Programme language not inferred from generic directory Tamil label. No reviewed RadioBee direct-listening, recording or redistribution allowance yet. | https://www.iskconnagercoil.com/radio |

AIR Nagercoil, Akashvani Nagercoil and Kumari FM remain **one existing air-nagercoil card**, never metadata duplicates. All Sooriyan Sri Lanka identity fields and both existing stream URLs remain exact; Indian Suryan uses suryan-in, with no Sri Lankan feed assignments. The Nagercoil category contains the existing AIR card plus nine new metadata cards. Nanjil Radio is not added: current broadcaster identity and actual locality remain insufficiently established; prior research is retained.

## Identity reconciliation and provenance

[Rotary News, June 2024](https://rotarynewsonline.org/rotary-honours-three-social-trailblazers/) independently identifies Mohammed Askar as founder of Isai Murasu in Nagercoil and describes interviews. Directory religious labels conflict; metadata uses talk/general and does not assert Christian or exclusively Islamic programming. No similarly named organization or unproven stream was substituted. Current operator website/direct feed remains unconfirmed.

[ASR's official website](https://radio.asrdmm.com/) explicitly names a separate ASR Digital Christian Samy FM channel among its devotional services. It receives its own christian-samy-fm ID under the existing asr-digital network, distinct from asr-kanyakumari's general programme. The [provider profile](https://zeno.fm/radio/christian-samy-fm/) renders Tamil and Religious tags; ownership/control of the individual provider account is not independently authenticated. This establishes a defensible programme association, not an independent-company claim or playback permission.

Tamilosai's [myTuner profile](https://mytuner-radio.com/radio/tamilosai-fm-474068/) and [Nagercoil directory](https://streema.com/radios/Nagercoil) support its distinct Tamil/Nagercoil discovery identity. Its former broadcaster domain currently fails DNS; no verified replacement site or direct stream was invented. Annai's broadcaster-authored profile supports Parakunnu near Kuzhithurai, with Tamil/Malayalam tags. ASR retains Thingalnagar/Neyyoor postal-area identity. Kumari Tamil Media's unconfirmed city is cleared to null while district association is retained. ISKCON's official footer supplies Puliyurkurichi; programme language remains unknown instead of inferring Tamil from a directory.

Regional metadata includes Suryan's eleven requested cities; Hello's eleven supported/requested city listings; six Mirchi services (Thiruvananthapuram remains Kerala/Malayalam); three Radio City services; two BIG services; and the separately documented Akashvani Thoothukudi service with prior unavailable audio. Mirchi Puducherry and generic AIR/RED aliases lacking a defensible programme identity remain in research. New Suryan Erode/Vellore IDs follow current official branding; archived RED references are not silently reassigned without equivalence evidence. Unknown frequencies stay null, including Hello Nagercoil's reported-but-not-authoritatively-reconfirmed 91.1.

[Full 41-station inventory](expansion/discovery-stations.csv) gives source IDs, location references, language/category, availability, website and outstanding work. Source IDs resolve through public sources.json; original Stage 6/8/9 documentation remains intact.

## Stream checks and what is not approved

[Sanitized network evidence](expansion/stream-checks.json) records six supplied HTTPS endpoint checks: AIR Nagercoil manifest/segment success; Sooriyan MP3 transport success; ISKCON MP3 transport success; BIG-labelled Zeno MP3 transport success; Suryan timeout; ASR HTTP 404. Four passes and two failures are **transport/media observations**, not four approved or fully decoded stations. FFmpeg is unavailable; codec hints/ICY headers and HLS retrieval are not audible-programme proof. No radio recording/sample was saved.

Christian Samy's real provider startup returned media error 4; metadata reflects temporary unavailability. Tamilosai's domain failed DNS. Three bounded Radio Browser name queries for Tamilosai, Isai Murasu and Christian Samy returned empty arrays. The Isai station detail page presented an anti-bot challenge; it was not bypassed. No canonical reusable Annai endpoint was established from current evidence. Historical HTTP crabdance/gist endpoints remain unprobed by the HTTPS-only framework; schemes/ports were not guessed and no proxy used. TamilRadios automation remains stopped under its terms.

ISKCON is the strongest prospective new listening source: prior Stage 9 browser starts advanced to 3.415027s and 2.404790s; current MP3 transport also passed. Sustained/long-run playback, exact programme languages, Android/native behavior and applicable third-party conditions still require review. BIG's broadcaster identity remains unconfirmed; Suryan/ASR fail transport. **No new source has reviewed permission for RadioBee direct listening, recording or redistribution. Consequently no new direct URL was inserted into public playback arrays.** Research/test observations stay outside the publication allowlist.

The client's existing permissive verification/rights flags remain unchanged to preserve current Sooriyan behavior. They cannot enable discovery playback: the API forbids stream fields, the adapter always creates an empty in-memory array, eligibility explicitly refuses discovery records even if a caller injects streams, and the player resolves normal playback IDs only from the playback catalogue. Approved-listening counts describe editorial approval, not the legacy runtime flags or device reachability. Recording implementation/restrictions are unchanged.

## Review and release

The implementation and static build are local review artifacts. Live clients remain on deployed data until the user approves publication. The development seed is updated to the validated 65-station snapshot; production still fetches the remote manifest and never falls back to that seed. The additive API must be deployed consistently with its sources, networks, geography and manifest when approved. A future authorized stream restoration keeps the same ID, removes the discovery row, reconciles the playback-removal entry, and updates candidate/approval counts atomically.

Remaining manual work: review broadcaster/provider use conditions without inventing grants; establish canonical Tamilosai/Isai/Annai/ASR feeds; confirm Hello Nagercoil's current transmitter evidence; establish Nanjil identity/locality; verify sustained Chrome/Android playback and real programme identity. No dependency/lockfile or workflow settings changed.

See validation and complete task/pre-existing file inventories in [the review results](expansion/VALIDATION.md).

### Reproduce the local UI preview

The client includes `scripts/preview-discovery.mjs`: after a WSL2 Linux `npm run build -- --configuration development`, run `node scripts/preview-discovery.mjs` and open `http://localhost:4312`. It serves only the local client build on loopback and deliberately blocks remote connect requests, so the existing clearly labelled DEVELOPMENT SEED fallback shows the 65-station snapshot. It is a metadata/UI preview, not a radio proxy or live-listening test. Ctrl+C stops it. The ordinary production build retains the remote catalogue configuration and has no seed fallback.
