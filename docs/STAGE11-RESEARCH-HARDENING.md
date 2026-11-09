# Stage 11 research-tool hardening

The committed Stage 11 integration is preserved. These uncommitted corrections affect research tools, their tests and documentation only. No live 224-stream audit was run, and no catalogue, identity, artwork, stream permission, recording setting or client implementation was changed.

## Network boundaries

Both Python audit tools previously relied on URL syntax checks. The collector's requests library could resolve a public-looking hostname to a private address and follow API redirects without the repository policy. Direct FFmpeg URL inputs could fetch redirects, HLS variants, segments, keys and other referenced resources independently of Python. Protocol allowlists alone would not establish DNS/redirect safety or sandbox native decoder code.

All research HTTP operations now use research-network.mjs through research_safety.py. There is no requests/urllib or direct-URL FFmpeg fallback. The bridge uses safe-https.mjs and fetchHttps: public-unicast DNS checks pinned to the actual socket, TLS validation, unsafe/private destination rejection on each redirect, maximum five redirects, ten-second request deadline, capped headers and bounded bodies. Collector probes read at most 2 KiB and do not follow nested media. API pages are at most 25 rows / 128 KiB; queries stop with an explicit error at 500 rows rather than silently presenting a truncated complete result. Calls are serial. Larger research sets require narrower queries or saved JSON. A rejected or oversized response fails closed. A syntactically accepted https_ready field remains a directory triage flag, not DNS safety or playback proof. Exported M3U files are untrusted research leads for manual review, not safe decoder inputs.

The FFmpeg CLI refuses to run without --reviewed-bounded-samples, before writing any report. In this explicitly selected workflow, the existing bounded auditEndpoint fetches manifests and eligible unencrypted segments via safe HTTPS. Encrypted or initialization-dependent HLS remains unsupported, not bypassed. At most 128 KiB total media input is sampled, with the existing 35-second audit deadline. Only a bounded memory buffer enters decodeSample through pipe:0; FFmpeg never receives the remote URL or a playlist to retrieve. Its existing two-second output and five-second decoder deadline apply; Python also enforces a 5–45 second process deadline. Workers must be one. Legacy arbitrary-duration/parallel URL decoding is intentionally unavailable.

Example, only after reviewing the source and accepting this bounded workflow:

```bash
node -p 'process.platform' # linux
python3 scripts/radiobee_ffmpeg_audit.py --reviewed-bounded-samples --limit 1 --seconds 2 --workers 1 --output reports/reviewed-sample.csv
```

This is a safe reviewed-input path, not a claim of full FFmpeg sandboxing. Native decoder vulnerabilities are outside hostname/protocol policy. Use a maintained FFmpeg in an OS-isolated, network-denied worker for additional containment. There is no flag that re-enables arbitrary network URLs in FFmpeg. Missing Linux Node, unsafe DNS, rejected redirects, unsupported HLS or tool errors never trigger a less-safe fallback. New bounded two-second results must not be compared as if they reproduce the historical 4.99-second audit.

### Historical-report preservation correction

The bounded workflow now defaults to `reports/radio_browser_tamil_bounded.csv`, **not** the historical `reports/radio_browser_tamil_ffmpeg.csv`. An existing output (including a dangling symlink) is rejected before requests unless `--overwrite` is explicitly supplied. The same resolved input/output path is rejected even with that flag. Prefer a fresh output path for each research run; do not overwrite the historical 224-record evidence.

All rows are collected before publication. A complete CSV is written to a uniquely named temporary file in the destination directory, flushed, fsynced and closed. With `--overwrite`, `os.replace` atomically replaces the destination only after successful complete results. Failed, rejected, incomplete or partial-error decoding refuses replacement and leaves saved results intact. For a diagnostic report containing such outcomes, choose a new output path without `--overwrite`. Empty audits are refused.

Without `--overwrite`, atomic hard-link publication creates the destination only if absent. This also protects against another process creating a report between the early existence check and publication. No check-then-replace race can overwrite it. Temporary files are removed on ordinary success/error paths; serialization, write or replacement failures preserve existing destination bytes. Filesystems without the necessary hard-link/atomic-replacement support fail closed, without a non-atomic fallback. An abrupt process kill may leave a temporary file; atomic visibility is not a guarantee of crash durability on every filesystem. Concurrent explicitly authorized overwrite runs may replace one another; use distinct output paths when preserving each run.

No transport, decoder or CSV-formula protection was relaxed. Offline tests additionally cover the distinct default, early overwrite refusal without requests, explicit replacement of a complete CSV, failed/rejected requests with `--overwrite`, invalid arguments, input/output aliases, empty results, disk/replacement errors, temporary-file cleanup and a concurrent destination-creation race.

## Spreadsheet exports

The shared spreadsheet_cell/row helpers prefix spreadsheet-dangerous strings with an apostrophe: leading =, +, -, @, including whitespace/BOM/control-character prefixes, plus leading tab/CR/LF. CSV quoting alone is not treated as protection. Full and priority Radio Browser CSVs, arbitrary FFmpeg CSV fields/headers and the review-only logo manifest use the helper. Numeric values remain numeric. Source dictionaries, catalogue identities and structured JSON research output are not mutated. The apostrophe is a CSV display safeguard; downstream consumers should prefer original JSON for exact research identities.

The quick-test guide footer now correctly names docs/RadioBee_Stream_Test_Guide.md. No browser playback logic was changed.

## Offline regression coverage

New tests exercise malicious CSV values and headers, whitespace/BOM/control prefixes, descriptions/tags/diagnostics, unchanged JSON and source dictionaries, API pagination, failed transport with no fallback, default decoder refusal without output overwrite, and the corrected guide path. Node tests cover private/local redirect destinations, unexpected 304 responses, public-looking nested HLS hosts resolving privately before decoding, and bounded segment buffers reaching a mocked decoder. Existing safe transport and pipe-decoder tests supply broader DNS/redirect/resource-bound coverage. No test makes live radio requests.

Exact required validation results and preservation checks are recorded in the final review below.

## Final review — 9 November 2026

- `npm run validate`: passed.
- `npm test`: **90 tests passed, zero failed/cancelled/skipped/todo**, 977.366769 ms. One Node test invokes 14 Python unittest cases, including seven report-preservation cases; these are not counted as extra Node tests.
- `npm run build`: passed, static output generated.
- `git diff --check`: passed.
- `git merge-base --is-ancestor d4fadc8 HEAD`: passed; the committed implementation remains in branch history. No commits were created or rewritten.
- `git diff --exit-code -- data/v1`: passed. Both AIR Nagercoil URLs, fallback metadata, 38 stream URLs, all 85 station identities, Suryan/Sooriyan network separation, every rights/use status and logo reference remain byte-for-byte unchanged from HEAD.

All Node commands used Ubuntu-22.04 WSL2 Linux Node v24.16.0. No dependencies were installed/reinstalled or versions changed. No live API collection, favicon downloads or radio probes were run during this hardening. The sibling client was not changed. All fixes remain uncommitted for review; nothing pushed, merged or deployed.

The historical CSV SHA256 remains `680accdf197a19586e2bd706006ec861e5f2673da3047cc547b46c324d553b43`; the original Radio Browser CSV SHA256 remains `ba37085a3276fb71da0455e50635d2e76aae1dffe165e9479d00da3461a8b5e0`. Pre-existing hardening changes and index state are preserved; no staging or commit commands were run. This final correction changes only radiobee_ffmpeg_audit.py, research_tools_checks.py and this documentation file; the remaining files below belong to the preceding hardening work.

Remaining limitations: the safe workflow supports short samples rather than full live playback, and deliberately does not support every HLS variant, encryption or initialization pattern. Directory queries over the bounded ceiling fail explicitly and require narrower queries/saved input. Exported original JSON/M3U research data remains untrusted and must not be treated as approved catalogue metadata or passed to an unrestricted decoder. This change does not provide OS isolation of FFmpeg, certify its native parsers, establish audible identity or grant any use permission. Network-denied OS isolation remains advisable for decoder containment beyond this reviewed-input workflow.

Complete modified/untracked file set for these fixes:

```text
docs/RADIO-BROWSER-TAMIL-AUDIT.md
docs/RadioBee_Stream_Test_Guide.md
docs/STAGE11-RESEARCH-HARDENING.md
scripts/collect-logo-candidates.py
scripts/radiobee_ffmpeg_audit.py
scripts/radiobee_radio_browser_audit.py
scripts/research-network.mjs
scripts/research_safety.py
tests/research-tools.test.mjs
tests/research_tools_checks.py
```
