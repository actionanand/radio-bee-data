# Stage 19 — v2 country reference registry compatibility hotfix

The RadioBee client rejects v2.1.0 with `Invalid v2 catalogue: network country` because the index manifest excluded NZ (no playable NZ stations), while unchanged network and location registries retained NZ references. The client checks that every referenced network and location country occurs in `index.countries`.

v2.1.1 keeps `index.countries` equal to the sorted union of network `countryCodes`, location `countryCode`, and station `countryCode` references. No NZ station is added, and no metadata-only record is reintroduced to active `discovery-stations.json`.

No stream URLs, rights statuses, program metadata, locations, networks, v1 files, or browse memberships change. The five listener-mapped Chennai stations remain trial candidates. The v2 browse index release marker advances to 2.1.1; tests enforce the cross-registry country contract and preserve the station-only-with-stream rule.

The RadioBee client can fetch the corrected data using its existing `/v2/` endpoint and `cache: no-store`; it does not need code changes. The Pages deployment must finish before users refresh.
