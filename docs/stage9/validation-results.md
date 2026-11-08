# Stage 9 validation results

Completed **8 November 2026** on `feature/9-tamil-fm-stream-discovery`. Node/npm ran only through WSL2 Ubuntu 22.04 using Linux Node v24.16.0 and npm 11.13.0; `process.platform` reported `linux`. No dependencies were installed, updated or reinstalled.

| Command / review | Exact outcome |
| --- | --- |
| `npm run validate` | Passed; zero catalogue errors. |
| `npm test` | **72 tests, 72 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo**; final run 527.482272 ms. |
| `npm run build` | Passed; static output generated from the existing explicit allowlist. |
| `git diff --check` | Passed, no whitespace errors. |
| Catalogue/backlog/schema/tooling/dependency/workflow diff | Empty. Catalogue stays v1.4.0: 24 stations, 26 streams; all 64 removal entries remain unchanged. |
| Research integrity | Unique case/candidate/source IDs; source/candidate references and reported counters reconcile; existing archived identity/geography references are preserved as legacy fields. |
| Publication separation | Pending research URLs are absent from published stream arrays; existing AIR control is explicitly exempt as an unchanged prior entry. Static build excludes real docs/stage9 files. |
| Sensitive/binary content review | Changed files are Markdown/JSON/CSV/JavaScript text only; no detected credentials, private-key patterns, signed/session playback URLs, encrypted player blobs or audio/binary captures. |

The three new deterministic tests cover report counters/references, archived identity and pending-candidate separation, and exclusion of the real research directory from the static build. Ordinary tests use existing mocks/snapshots and local research data; none requires a successful external network connection. A future legitimately approved publication must reconcile its research decision rather than bypass these safeguards. No restoration was performed, so no new synthetic restoration path or migration code was necessary; existing migration regressions continue to pass.

## Live checks — separate from automated tests

All eight primary HTTPS checks used the existing bounded deep-audit framework: seven research candidates plus the existing AIR Nagercoil control. There were **four successful transport/media outcomes and four failures** in that set. Only three of the passes are new research candidates; AIR remains an existing control. This is not a count of approved playback stations.

Four later independent endpoint checks repeated ISKCON/BIG transport success, ASR 404 and Suryan timeout. The second exact Club Mirchi HLS variant was also separately checked and returned 404; both published 64/96 kbps variants therefore failed in this environment. These additional checks are evidence under the same candidate records, not additional station cards. Nine HTTP-only leads were recorded without probing/upgrading; one Annai query-bearing browser request was withheld. Kumari's DNS failure is a separate broadcaster-site observation, not an extra direct-stream endpoint.

Browser evidence: the in-app browser's official ISKCON player progressed in two fresh starts (3.415027s / readyState 4; 2.404790s / readyState 3), with no media error. Annai's official Zeno player produced media error 4. This verifies short decoded-playback progress for **one research candidate**, not human audibility, actual programme language, sustained uptime, Chrome-product compatibility, Android/native HLS or RadioBee permission. Native FFmpeg decoding remained **not tested / ENOENT**, not a successful decode. Tabs were closed; no recording was saved. Native probes have strict byte budgets; browser resource bytes were not measurable through the available UI API.

Complete sanitized metadata is in [stream-evidence.json](stream-evidence.json), with page failures/truncation in [source-observations.json](source-observations.json). Network outcomes never changed approval metadata. TamilRadios automation stopped when its terms' prohibition was read; encrypted directory configurations and authenticated metadata helpers were not bypassed.

## Complete changed-file list

Modified tracked file (1):

- `README.md`

New untracked files prepared for review (12):

- `docs/stage9/TAMIL-FM-DISCOVERY.md`
- `docs/stage9/KANYAKUMARI-STATIONS.md`
- `docs/stage9/SURYAN-REGIONAL-STREAMS.md`
- `docs/stage9/MAJOR-NETWORKS.md`
- `docs/stage9/station-discovery.csv`
- `docs/stage9/station-discovery.json`
- `docs/stage9/stream-evidence.json`
- `docs/stage9/source-observations.json`
- `docs/stage9/duplicate-review.json`
- `docs/stage9/publication-decisions.md`
- `docs/stage9/validation-results.md`
- `tests/stage9-research.test.mjs`

Ignored scratch inputs/results under reports/stage9 are not part of the Git changes. The two earlier locally excluded research inputs remain excluded. No client file, dependency/lockfile, GitHub workflow/setting, artwork, published JSON, migration or schema was modified. No commit, push, merge or deployment was performed.

## Remaining review tasks

- Establish applicable third-party direct-listening conditions with each broadcaster; keep recording/redistribution separate. No outreach was sent automatically.
- Prioritize ISKCON: confirm languages/origin, stable long-run playback and actual Chrome/Android/native behavior before proposing one station card.
- Obtain canonical Annai/ASR sources through broadcaster/provider evidence, resolve Annai startup/ASR 404, and verify Kumari's current domain without guessing or decrypting protected configuration.
- Confirm current Hello Nagercoil 91.1 from authoritative evidence and reconcile Suryan's newer Nagercoil launch/older city lists; request explicit city-player mappings.
- Resolve BIG and Uber/Mirchi identities and source ownership; never treat their byte signatures as programme proof.
- Investigate crabdance timeout/certificate failures under ordinary trusted network/browser conditions without disabling TLS or geographic/access controls.
- Seek written permission for any further automated TamilRadios investigation. No claim of exhaustive directory coverage or absence of official streams is made.
- Review client production gates before any catalogue addition; current checkout flags can expose unapproved streams despite needs-review metadata.
