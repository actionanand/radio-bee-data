# Stage 18: Five Chennai FM trial streams (v2.1.0)

User identified five distinct Chennai programmes by ear on 12 November 2026:

| FM station | Frequency | Candidate URL |
| --- | --- | --- |
| Radio Mirchi Chennai | 98.3 | https://radios.crabdance.com:8002/1 |
| Suryan FM Chennai | 93.5 | https://radios.crabdance.com:8002/2 |
| Hello FM Chennai | 106.4 | https://radios.crabdance.com:8002/3 |
| BIG FM Chennai | 92.7 | https://radios.crabdance.com:8002/4 |
| Radio City Chennai | 91.1 | https://radios.crabdance.com:8002/5 |

Four station IDs move from discovery to stream-bearing; Hello FM retains its Openstream alternative. All five new URLs remain unverified, use rights unconfirmed and direct listening review pending. WSL2 strict TLS verification rejected their host's missing intermediate certificate. This is not proof of reliable browser playback or permission to record/redistribute.

Active v2 now contains 75 stream-bearing stations, including 33 FM stations, and no discovery-only records. The 46 original nonplayable discovery records (34 FM and 12 online) are archived unchanged in held-discovery-stations.json. Without a station-specific stream, artist/hits listings are not exposed as playable. No regional streams invented, v1 files unchanged.

The archived pre-import-v2-snapshot.json allows historical Stage 15 tests to target their original v2.0.0 data. Current v2.1.0 behaviour is covered in tests/stage18-fm-trials.test.mjs.
