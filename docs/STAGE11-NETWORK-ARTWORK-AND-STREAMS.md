# Stage 11 — network artwork and alternative-stream review

Reviewed 9 November 2026 on feature/11-radio-browser-stream-audit. No client source, workflow, recording setting, existing stream rights status, station ID or network identity was changed. Nothing committed, pushed, merged or deployed.

## Inputs and decisions

Both local CSVs were parsed completely, not regenerated: 224 rows, 183 decoded, 13 failed and 28 skipped. The collector documentation, stream test guide, logo inventory and current data were read. Input SHA256 values: radio_browser_tamil.csv `ba37085a3276fb71da0455e50635d2e76aae1dffe165e9479d00da3461a8b5e0`; radio_browser_tamil_ffmpeg.csv `680accdf197a19586e2bd706006ec861e5f2673da3047cc547b46c324d553b43`. These identify supplied evidence, not a fresh availability check. Raw reports, audio and token-bearing URLs are not copied into public metadata.

### Accepted alternative

AIR Nagercoil keeps its original WavesPB URL first and adds `https://air.pc.cdn.bitgravity.com/air/live/pbaudio129/chunklist.m3u8` as stream `air-nagercoil-bitgravity-hls-trial` under the existing air-nagercoil card. Radio Browser UUID 28509e6b-a9be-4bda-afb5-1dc88e168d0d matches the supplied 4.99-second FFmpeg result. The user's current request independently confirms audible Tamil AIR Nagercoil identity. That is user listening testimony, not broadcaster authentication. Provenance source air-nagercoil-radio-browser-user-review-2026 records both inputs without private documents.

The alternative remains unverified with lastVerifiedAt null and rightsStatus unconfirmed. Its directListening policy is copied unchanged from the primary: needs-review, recording/redistribution unconfirmed. Playback evidence is not permission. No automatic promotion of any of the 183 decoded entries occurred. Catalogue 1.6.1, publishedOn 2026-11-09: 85 cards, 35 candidate-bearing stations, 50 discovery-only, 38 stream URLs, one historical verified stream, zero production-approved listening stations. Existing stream definitions and migrations are preserved.

A fresh, manual bounded HEAD check returned HTTP 200 and application/vnd.apple.mpegurl for both Nagercoil URLs. The original redirected over HTTPS to CloudFront; Bitgravity returned without a redirect. This is current reachability, not repeated decoding. The deployed networks.json returned HTTP 200, 41 networks and zero logo references, consistent with the fallback-only publication. See [sanitized endpoint observations](stage11/endpoint-health.json).

### Held alternatives

| Candidate | Supplied result | Decision |
| --- | --- | --- |
| AIR KODAI FM pbaudio051/chunklist; kodaifm pbaudio022/master | Both decoded 4.99s | Conflicting mounts/labels; no independent audible service mapping. Do not choose by name. |
| AIR Madurai FM pbaudio126/chunklist and playlist | Decoded 4.99s | Same mount, not two broadcasts; exact FM service identity needs corroboration. |
| AIR Madurai AM1269 pbaudio127 | Decoded 4.99s | AM and FM programmes are not automatically interchangeable. Hold. |
| AIT Tirunelveli / FM Rainbow Tirunelveli pbaudio062 | Both decoded 4.99s | Shared mount, different labels. Hold pending independent programme mapping. |
| Suryan Chennai crabdance /1, /2, /3 | HTTP, skipped | Conflicting directory labels and no secure canonical mapping. No scheme guessing. |
| Hello Chennai Openstream lead in guide | Prior browser trial described | Guide playback alone is insufficient new city identity evidence; not integrated here. |
| Sooriyan Sri Lanka :8006 | Decoded | Keep existing two alternatives; no current independent identity/use review for a third. Never assign to Indian Suryan. |
| Other decoded entries | Mixed directory identities | No bulk integration. Decoding, wrong countries/languages, proxy URLs, shared feeds and session links require individual editorial review. |

## Artwork

Approved network/station logos added: **zero**. All 41 networks and 85 station cards retain the RadioBee fallback. [Current inventory](stage11/network-artwork.json) covers playback and discovery children; historical counts in STATION-LOGOS.md are not the current catalogue count. No existing override was removed. Shared network identity already exists in networks.json and the client resolves station override → network logo → bundled RadioBee fallback. There is no reason to duplicate paths into station records or rewrite the working client.

The Python helper `scripts/collect-logo-candidates.py` reads the supplied CSV and maps only exact catalogue IDs with matching country, never brand names alone. It produced six unique favicon leads: Radio City one, Indian Suryan three, Akashvani directory image one and Mediacorp one. Five originals were downloaded to ignored `reports/logo-review/`; the Akashvani directory request failed. The CSV manifest records network ID, original URL, UUID, image-identity uncertainty, usage status and collection result. Publisher-domain association does not visually authenticate an image or grant reuse. All six remain unapproved, including the downloaded images. No candidate was resized, converted, cropped, hotlinked or published.

Run `python3 scripts/collect-logo-candidates.py` for an offline manifest, or add `--collect --limit 8` for opt-in review downloads using Linux Node on PATH. Output is confined to reports/. Downloads use the existing DNS-pinned HTTPS transport: ten-second deadline, at most five redirects, serial requests, 128 KiB byte ceiling (stricter than the publication limit), private destinations blocked, no requests/urllib bypass. SVG/HTML/unknown signatures are not saved. Failures remain in the manifest. Publication still requires authenticated identity, an acceptable reuse basis, PNG/WebP, maximum 512×512 and 256 KiB, and an editorial logoPath reference. Prasar Bharati's [published disclaimer](https://prasarbharati.gov.in/en/disclaimer/) does not establish the required RadioBee republication permission. A corporate Prasar Bharati image is not automatically Akashvani branding.

Akashvani children (regional, Rainbow, Gold, Vividh Bharati) share networkId akashvani; Indian Suryan uses suryan-in and Sri Lankan Sooriyan uses sooriyan-lk. Hello, Mirchi, Radio City, BIG, RED and the other networks retain their own identities. Networks without any approved asset omit logoPath. Network-path placement and exact static copying are tested for both station arrays using synthetic test artwork, never mistaken for approved broadcaster art.

## Existing client fallback

Reviewed player.service.ts, recovery-policy.ts, stream-eligibility.ts and station-artwork.ts. Eligible alternatives are ranked; a fresh eligible URL is tried before retrying a failed transient URL. Limits are three distinct URLs, two attempts per URL and six total attempts. Startup timeout is 20 seconds, rebuffer timeout 12 seconds, retry delay 500–750 ms. Cancellation, autoplay blocks and restricted use do not blindly advance sources. Pause/stop cancel timers and invalidate stale resolutions. Existing recovery tests cover primary success, primary failure with alternative success, all alternatives failing, and user pause/stop. No client regression requiring a source change was demonstrated.

Artwork resolves relative to the HTTPS data v1 base, not the application origin. Missing/corrupt assets fall back through shared network artwork to the bundled fallback, with remembered failures. Existing client artwork tests cover these paths. **Live deployed broadcaster-image loading cannot be claimed:** no approved image exists or was published. Static exact-copy tests and URL-resolution regressions are the available evidence. Physical Android and a fresh audible comparison of all AIR candidates remain manual follow-ups.

## Validation and changed files

Final exact results and the full working-tree inventory are recorded in [Stage 11 validation](stage11/VALIDATION.md). Pre-existing audit scripts, guides and __pycache__ remain untouched; raw CSVs and downloaded images stay ignored. No dependency reinstall or version changes were made. Network research remains manual-only and does not block ordinary CI/CD.
