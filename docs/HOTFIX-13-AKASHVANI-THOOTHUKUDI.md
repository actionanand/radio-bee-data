# RadioBee v1.8.1 — Akashvani Thoothukudi unavailable stream

Prepared 9 November 2026 on `fix/13-akashvani-thoothukudi-playback`, from merged Stage 13 HEAD `0c4008b`. Changes are uncommitted for review. No client edits, commit, push, merge or deployment.

## Diagnosis and decision

**Akashvani Thoothukudi** (`air-thoothukudi`) is returned to **discovery-only**, with availability `temporarily-unavailable`. This is a currently unavailable upstream stream, not a demonstrated RadioBee client defect or a claim that the station has permanently closed.

Failing canonical URL:

`https://radio.wavespb.com/live/2e8cfad789dc692d/2e8cfad789dc692d.m3u8`

The user reproduced HTTP 302 → 404 in Chrome and WSL2 on 9 November 2026. A fresh manual request through the existing DNS-pinned safe HTTPS transport independently reproduced it at **2026-11-09T16:09:37.729Z**:

| Step | URL / response |
|---|---|
| Initial request | Canonical WavesPB URL above |
| Redirect | HTTP **302** to `https://d1tmej9eu7kw5c.cloudfront.net/2e8cfad789dc692d/2e8cfad789dc692d.m3u8` |
| Final response | HTTP **404**, `Content-Type: text/html` |
| HLS/segment/decoder action | No manifest was available; no segment fetch or decoder run was justified. |

The response is an HTTP failure instead of an HLS manifest. CORS, codec changes, a longer startup timeout or a different client engine cannot be assumed to fix this observed 404. No hls.js/client defect was established, and none is proposed. Availability may change again; this is dated evidence, not a permanent broadcaster outage diagnosis.

The successful two-second Stage 13 FFmpeg decode is retained as historical evidence. It established short decoding at that earlier time, not sustained Chrome playback or continued availability. It is not rewritten into a failure, nor used to override the user's later Chrome result.

## Official player / replacement investigation

The current [official Akashvani player](https://akashvani.gov.in/radio/live.php) still lists **Akashvani Tuticorin**, Tamil Nadu, separately from Akashvani Tirunelveli and FM Rainbow Tirunelveli. This supports the named broadcaster/service identity, not the availability of any arbitrary alternative feed. RadioBee retains the exact requested display name **Akashvani Thoothukudi**.

The existing Stage 6/13 exact mapping was channel **254, Akashvani Tuticorin**, to the now-failing WavesPB URL. Current bounded inspection did **not establish an identity-confirmed replacement HTTPS stream**:

* Official player page: HTTP 200 `text/html; charset=UTF-8`. A bounded suffix-Range request was ignored by the server (HTTP 200, no Content-Range), and the 128 KiB sample truncates before the Tamil Nadu entries. Current rendered-page inspection confirms the Tuticorin listing; it does not expose a replacement media URL.
* Official linked `https://akashvani.gov.in/radio/js/player.js`: HTTP 200 `text/javascript`, 9,884 bytes, no truncation. No replacement Tuticorin mapping was supplied by that script.
* The exact existing stream reproduced the 302 → 404 chain above.

This is a bounded review, not proof that no replacement exists anywhere. No city-specific URL was guessed, no Bitgravity channel number inferred and no Tirunelveli, Chennai, general Tamil or shared network programme substituted. No proxy, geographic bypass, authentication bypass or broadcaster restriction workaround was attempted.

No replacement was accepted, so there is no unconfirmed replacement to label resolved. The latest Chrome failure evidence is user-provided; fresh Chrome automation was not attempted after the preceding computer-use policy stopped access because it could not verify the current browser URL. This hotfix does not claim an automated Chrome playback success. Any future replacement requires an exact station mapping, current manifest/segment checks, real sustained browser playback and the user's playback confirmation before resolution is claimed.

## Exact catalogue changes

| Metric | 1.8.0 | 1.8.1 |
|---|---:|---:|
| Total station identities | 92 | 92 |
| Stream-bearing stations | 47 | 46 |
| Discovery-only stations | 45 | 46 |
| Stream URLs | 50 | 49 |
| Networks | 47 | 47 |
| Production-eligible stations | 0 | 0 |

* Removed only `air-thoothukudi` from `stations.json`; inserted its metadata into `discovery-stations.json` without a `streams` field.
* Preserved its ID, exact display name, network, country/location IDs, languages, genres, delivery/coverage, frequency, website, aliases and all prior source references. Added a dated technical-review source and current unavailability notes.
* Added `hotfix13-thoothukudi-404` to `sources.json`, documenting the user diagnosis and independent current HTTP check without granting permissions.
* Restored a null-target removed-playback entry in `station-migrations.json`, with the current failure reason. No favourite is redirected to an unrelated service; the metadata-only discovery identity is retained.
* Reintroduced a single backlog entry containing the **exact former 1.8.0 station object**, including its failing stream and unchanged rights/verification history, with a current 404 reason. The backlog's original 1.3.0 provenance header remains historical; this entry's later re-demotion is documented here and in its dated reason.
* Set catalogue version **1.8.1** and retained the current editorial date **2026-11-09**; reconciled all manifest counts.

Full former station data, the previous manifest, failure chain, current discovery/migration/backlog records and preservation hashes are in [the hotfix evidence archive](hotfix13/thoothukudi.json). The original Stage 13 promotion, two-second decode, inventory and user-playback JSON reports are unchanged. The Stage 13 Markdown report receives only a dated successor notice; its historical counts and conclusions are preserved.

EAST FM 102.7, Swiss Tamil Radio and Lotus FM remain active and are recorded here as **user-confirmed playing in Chrome**. Their station/stream objects are unchanged. All Stage 12 streams, including Hello FM Chennai and both AIR Nagercoil candidates, remain exact. Every other active/discovery station, pre-existing source, network, artwork and locale is preserved. No permissions were upgraded or playback-policy rule changed.

After a separately reviewed deployment and catalogue refresh, Akashvani Thoothukudi can remain visible in All stations as temporarily unavailable, without advertising its known-failing URL through playback metadata. This branch has not been deployed; the live application is unchanged by this work.

## Tests and verification

All Node/npm commands use existing **WSL2 Ubuntu Linux Node v24.16.0**. No Windows npm, dependency reinstall or version change. Network research was three serial, safe HTTPS requests, each limited to 10 seconds, 128 KiB and five validated redirects; no audio was downloaded or saved. Ordinary tests remain offline and CI/deployment gets no new network probes.

New deterministic regressions check the exact-name discovery record; absence of `air-thoothukudi` and the failed URL/hash from all active stream metadata; all expected v1.8.1 counts; exact preservation of the other 46 active station objects and all 45 unaffected discovery objects; source/network preservation; unchanged Stage 13 evidence; and one consistent null-target migration/backlog archive. Reintroducing the failed URL into playback metadata fails the hotfix test.

Stage 12 and Stage 13 dated assertions now use explicitly reconstructed historical views, while the new hotfix tests validate the **real current** catalogue. Historical reports are not edited to make the new counts appear to have applied earlier.

| Required command | Final result |
|---|---|
| `npm run validate` | Exit 0; references, streams, counts and en/ta/sa locale parity valid. |
| `npm test` | Exit 0; **103 tests, 103 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo**. |
| `npm run build` | Exit 0; static catalogue built. |
| `git diff --check` | Exit 0; no whitespace errors. |

## Changed files

Modified tracked files:

* `data/v1/discovery-stations.json`
* `data/v1/index.json`
* `data/v1/sources.json`
* `data/v1/station-migrations.json`
* `data/v1/stations.json`
* `docs/research/station-backlog.json`
* `docs/STAGE13-TAMIL-FM-NETWORK-EXPANSION.md`
* `tests/catalogue-history.mjs`
* `tests/discovery-integration.test.mjs`
* `tests/stage13-expansion.test.mjs`

New untracked hotfix files:

* `docs/HOTFIX-13-AKASHVANI-THOOTHUKUDI.md`
* `docs/hotfix13/thoothukudi.json`
* `tests/hotfix13-thoothukudi.test.mjs`

Three pre-existing untracked Stage 12 helper files remain untouched: `docs/README-HELLO-CHENNAI-STAGE12.md`, `scripts/apply-hello-chennai-stage12.py`, `scripts/fix-stage12-hello-chennai-migration.py`. Ignored `reports/hotfix13-*` scratch scripts/results are not publication artifacts or Git changes.

The data mitigation is ready for review. Stream service restoration remains blocked on an independently established replacement and confirmed sustained Chrome playback; no client fix or broadcaster permission has been invented.
