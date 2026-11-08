# Editorial review and streaming policy

1. **Distinguish evidence.** `reviewed` means the listing has source support; it does not mean a stream is live. `candidate` means presence, locality, language, frequency, current branding or stream identity still requires review. Use `sourceIds` for every reviewed entry.
2. **Do not fabricate local services.** Many FM networks carry a shared online feed. Preserve one network identity, and separate market stations only when market existence is sourced. Never claim a national stream originates from Nagercoil, Chennai, Jaffna, etc. solely because listeners there can receive it.
3. **Separate Indian Suryan from Sri Lankan Sooriyan.** These are different `networkId` values. Do not normalize transliteration into one network.
4. **Prefer broadcaster-origin sources** for station existence, language, frequency and stream endpoints. Radio directories or Radio Browser records are leads and may have stale/wrong metadata.
5. **Verify direct streams manually** by checking actual audio/playlist bytes, codec, stability over time, redirects, Android Media3 playback, Web CORS where relevant, HLS behavior and HTTPS. A `HEAD`/small `GET` can only establish reachability, not real decoding or local provenance.
6. **Respect ownership and permission.** Do not republish station logos, album art or audio without rights. An open URL is not permission to record, redistribute or rebroadcast. For a production service, review terms and permitted embedding/linking, especially commercial broadcaster streams.
7. **Review language tags** instead of inferring Tamil simply from an audience's city/state. For Sanskrit, only tag broadcast language `sa` where Sanskrit spoken content is independently established. Sanskrit interface translation has no bearing on station language.
8. **Failure is not deletion.** A transient timeout, geofence, maintenance, redirect or rate limit must not erase a station. Weekly health reports are artifacts for human review; do not automatically commit status transitions.
9. **Record provenance and review time.** Update source notes, add official direct stream source URL, `lastVerifiedAt`, actual permission proof outside public data if necessary, and update editorial `catalogVersion` before deployment.
10. **Don't leak private data.** No listener accounts, GPS coordinates, contact details, analytics identifiers, tracking pixels or API secrets belong in this public JSON repository.

## Historical starter-data review status

The initial 81 entries are a browsing/reference seed. The official Akashvani service and terrestrial station listings, the reported August 2026 Suryan Nagercoil launch, and Shakthi/Sooriyan official sites provide evidence for selected listings. Most other network-city combinations are **discovery candidates** and deliberately contain no direct stream URL. Stage 3A investigated the three legacy leads and added official endpoint candidates. Catalogue 1.1.0 has eight stream records: Vasantham passed a short desktop-browser playback test, while seven remain unverified. All eight retain `rightsStatus: unconfirmed`; none is production-eligible. See [PLAYBACK-SOURCES.md](PLAYBACK-SOURCES.md) for source-specific findings, permission blockers and client limitations. This cautious approach enables safe iterative curation without misleading users.

Helpful discovery reference: https://docs.radio-browser.info/ . The API requests a descriptive User-Agent, its stations have globally stable `stationuuid` fields, and availability/data correctness are not guaranteed. If importing from it in a future phase, preserve source identifiers and verify each result before publishing as confirmed.

## Current Internet-only publication (1.4.0)

Publish only stations with a genuine direct HTTPS Internet candidate. Preserve empty-stream or unusable records in the non-published research backlog, retaining all fields and stable IDs for restoration. Routine network failures remain non-mutating diagnostics; removals require editorial review. Stage 8 excludes the already-known AIR Thoothukudi 404 after retest; this is not an automated deletion rule. Keep regional services separate when official player mappings identify distinct services; never infer equivalence from a network name. See [Stage 8 decisions](INTERNET-RADIO-CATALOGUE.md).


## Metadata-only discovery extension (1.5.0)

The separate discovery publication permits cited metadata for documented stations without direct audio. It never permits research URLs, stream arrays or an implied listening grant. Keep unsupported identities in research. The existing non-empty-stream rule continues to govern stations.json. Metadata availability, technical verification, source identity, direct listening, recording and redistribution remain separate decisions. See [the publication contract and expansion review](DISCOVERY-PUBLICATION.md).

Worldwide follow-up (1.6.0): the user authorized in-app trial listening for sources with short real browser decoding even while editorial verification and use review remain incomplete. Keep those streams unverified, retain unconfirmed rights and needs-review use status, document source identity and test limitations, and honor express restrictions. Trial access is separate from production approval and recording/redistribution grants. Metadata-only rows still forbid streams. See [worldwide evidence](WORLDWIDE-TAMIL.md).
