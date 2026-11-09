# Stage 11 validation and inventory

9 November 2026. Branch feature/11-radio-browser-stream-audit. All Node/npm commands ran in Ubuntu-22.04 WSL2 with Linux Node v24.16.0. No dependency installation/version changes, client source changes, workflow changes, commits, pushes, merges or deployment.

| Check | Result |
| --- | --- |
| Data npm run validate | Passed |
| Data npm test | 85 passed, 0 failed/cancelled/skipped/todo; 1106.445551 ms |
| Data npm run build | Passed; catalogue 1.6.1, 85 cards, 38 URLs |
| Client npm run lint | All files passed |
| Client npm run typecheck | Passed |
| Client npm run test:ci | 24 files, 322 tests passed; 92.70 seconds |
| Client npm run build | Passed; 26.004 seconds |
| Favicon collector | Six candidates, five downloaded into ignored reports/logo-review, zero approved |
| Input preservation | Both complete 224-row CSV SHA256 values unchanged |
| Stream preservation | Every original stream definition, rights/use policy and station ID unchanged; only Nagercoil secondary added |
| Other catalogue preservation | Networks, discovery records and migrations match HEAD exactly |
| Client preservation | Working tree clean after read-only review/checks |

Client build retains two nonfatal stylesheet warnings: station-card.scss 3.01 kB and station-browser.scss 3.67 kB, versus a 2 kB warning budget, within the 4 kB error limit. Existing recovery tests exercise primary success, ranked alternative selection, exhausted alternatives, eligibility restrictions, pause/stop cancellation and retry bounds. Existing artwork regressions exercise catalogue-origin paths, overrides, missing/corrupt artwork and remembered fallback. The new data regression checks a shared network reference for playback and discovery children and exact static copying with synthetic test art.

Manual HEAD checks: both Nagercoil manifests returned 200 application/vnd.apple.mpegurl. Primary redirects over HTTPS to CloudFront; secondary has no redirect. Deployed networks.json returned 200, 41 networks, zero logo references. These checks do not prove fresh decoding. Supplied FFmpeg 4.99s decoding and current user audible Nagercoil confirmation justify retaining the unverified secondary, not a permission or verification grant. The 224-stream audit was not repeated.

Limitations: no approved broadcaster image can be tested as a newly deployed local asset; all remain fallback. Five downloaded favicon originals still require visual identity, licence/use and size review before any publication. A publisher domain alone is insufficient. No physical Android playback, new long-duration decoding, or independent identity confirmation of the other AIR mounts was performed. Shared/conflicting Kodaikanal/Tirunelveli labels and distinct Madurai AM/FM programmes remain held. Recording/redistribution restrictions and all original rightsStatus values remain unchanged. No radio recording was downloaded or retained. Raw CSVs, image candidates and temporary diagnostics remain ignored, outside the static publication allowlist. Network failures do not affect CI.

## Complete working-tree inventory

Pre-existing untracked audit guides/scripts and __pycache__ are preserved and listed separately by Git status below. They were not created or modified by this implementation. No raw generated CSV/image review directory is staged or included in the static build.

```text
 M README.md
 M data/v1/index.json
 M data/v1/sources.json
 M data/v1/stations.json
 M docs/STATION-LOGOS.md
 M tests/discovery-integration.test.mjs
 M tests/logo-assets.test.mjs
?? docs/RADIO-BROWSER-TAMIL-AUDIT.md
?? docs/RadioBee_Stream_Test_Guide.md
?? docs/STAGE11-NETWORK-ARTWORK-AND-STREAMS.md
?? docs/stage11/VALIDATION.md
?? docs/stage11/endpoint-health.json
?? docs/stage11/network-artwork.json
?? scripts/__pycache__/radiobee_radio_browser_audit.cpython-311.pyc
?? scripts/collect-logo-candidates.py
?? scripts/fetch-logo-candidate.mjs
?? scripts/radiobee_ffmpeg_audit.py
?? scripts/radiobee_radio_browser_audit.py
?? tests/stage11-network-streams.test.mjs
```
