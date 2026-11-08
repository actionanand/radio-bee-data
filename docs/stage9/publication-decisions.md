# Stage 9 publication decisions

Reviewed **8 November 2026**. **No catalogue publication changes are justified yet.** `catalogVersion` remains **1.4.0**, `publishedOn` remains **2026-11-07**, schemaVersion remains **1**. All 24 published IDs, 26 stream records, 64 tombstones, source records, geographic metadata, logos and translations remain byte-for-byte unchanged.

## Three research evidence groups

| Group | Research candidate records | Decision |
| --- | ---: | --- |
| A — confirmed for new publication | 0 | No candidate meets every technical, identity, security and applicable use requirement. |
| B — technically promising, pending review | 3 | ISKCON official endpoint, directory BIG FM Tamil and Uber-branded Mirchi-labelled endpoint remain outside publication. |
| C — failed, insecure or insufficient evidence | 14 | Four failed HTTPS checks, one withheld Annai browser-startup lead and nine HTTP-only leads remain research. |

An existing AIR Nagercoil endpoint is a separate control, not a new Group A approval. Service-case groups in station-discovery.json include existing records and historical provenance; the table above counts the 17 non-published endpoint/withheld-lead records, not every city reviewed. No source has been silently promoted to `permission-granted`, `allowed` or `verified`.

## Per-candidate decisions

| Candidate | Technical / identity result | Reason to hold |
| --- | --- | --- |
| ISKCON Nagercoil / Vaani Seva | Official player, matching ICY name, repeated MP3 transport pass and two short HTMLAudio playback starts | No RadioBee third-party-use grant established; languages, sustained continuity and Chrome/Android still need review. Strongest next candidate. |
| BIG FM Tamil Zeno | Two bounded MP3 transport passes, reported 64 kbps, ICY label | Directory/ICY naming is not broadcaster control or Chennai FM equivalence; no browser/FFmpeg decode or use approval. |
| Uber / bollywoodnow | MP3-like bytes, CORS *, reported 128 kbps | Multiple Mirchi names share this external branded feed; Tamil/city/broadcaster identity and use authority unconfirmed. |
| Supplied Suryan tamil.crabdance URL | Timed out twice | No working transport, city identity, broadcaster association or reviewed direct-use allowance. |
| radios.crabdance HTTPS alternate | Node TLS chain validation failed | No certificate bypass; regional programme/relay authority unconfirmed. This is an environment observation, not a universal certificate verdict. |
| ASR cast HTTPS | 404 in both independent sessions | Stale endpoint; no guessed replacements or upgrades of official HTTP links. |
| Club Mirchi directory HLS | HLS parsed; downstream request 404 | Playlist alone is not audio; digital-service identity is not Tamil city FM, and use conditions remain unreviewed. |
| Annai current official browser lead | Media error 4; query-bearing request URL withheld | Need canonical stable source, restored playback, and provider/broadcaster-use review. |
| Five historical commercial HTTP leads | Not probed under HTTPS-only policy | No guessed scheme changes or third-party proxy reuse. Includes cross-labelled crabdance and English Chennai Live. |
| Four ASR HTTP Zeno mounts | Observed in official HTML, not upgraded or probed | Programme relationships and HTTPS equivalents must come from broadcaster/provider evidence. Four URLs do not imply four new station cards. |

Kumari's domain ENOTFOUND is recorded separately from failed direct endpoint counts; it does not prove the station closed. Ghana Hello FM and other foreign-name matches were rejected as identity mismatches, not treated as Tamil station downtime. Finite official website podcasts were rejected as live stream candidates.

## Client compatibility and why research stays out of data/v1

Read-only review of `C:/AR_Files/code/radio-bee/src/environments/environment.prod.ts` found:

```ts
AllowUnverified: true,
CheckVerificationStatus: false,
CheckRightsStatus: false,
```

The corresponding `src/app/catalog/stream-eligibility.ts` checks verification and rights only when their flags are enabled; `restricted` is handled separately. This snapshot supports the user's warning: `needs-review` alone cannot be relied on to hide a newly added URL in the current production configuration. These are checkout observations, not verification of every deployed build. No client files were changed, and no stream was inserted merely because it worked in a directory/browser.

Source terms were reviewed where found. Suryan has restrictive content/use/deep-linking provisions; Zeno provider access does not establish a broadcaster grant; no ISKCON, BIG, ASR or Mirchi third-party-use allowance was established. Missing/unclear terms are not permission, nor are they automatically a finding of permanent prohibition. Recording and redistribution remain distinct and unconfirmed.

The static builder's explicit allowlist excludes docs/stage9 and arbitrary research files under data/v1. Normal validation/tests/build remain offline. No workflow, dependency, lockfile, stream security check or deployment configuration was modified.

## Stable IDs and restoration

Keep all Stage 8 archived records intact. A future authorized restoration should reuse its existing ID (for example annai-kuzhithurai or asr-kanyakumari), reconcile its removal entry, validate references/counts and version the actual publication edit. Candidate discovery alone does not change migrations. New ISKCON/Vaani Seva would need one reviewed station identity and suitable metadata; no duplicate name cards or inferred local feeds should be created.

No client repository edit, commit, push, merge, deployment, recording, streaming proxy or copied-audio repository was performed.
