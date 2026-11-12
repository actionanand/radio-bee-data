# Suryan Chennai primary and fallback trials

RadioBee's catalogue order is the initial priority; the existing client handles bounded distinct-URL fallback and may adapt order to in-session outcomes.

1. **Primary trial** `https://tamil.crabdance.com:8002/2` — third-party directory lists this as Suryan FM 93.5; user reports no audio before 06:00 IST on 13 November 2026. Chennai-specific identification and codec are not established; `mp3` is provisional pending decoding.
2. **Fallback** `https://radios.crabdance.com:8002/2` — previously identified by user as the Suryan Chennai stream. Existing catalogue stream object and provenance are preserved.

Both URLs are distinct. Both remain **unverified**, rights `unconfirmed`, directListening `needs-review`; recording/redistribution unconfirmed. A working browser listener test is not a broadcaster grant or a complete Web/Android compatibility result. The first stream's failure must lead to the second candidate, not create a new station or a discovery-only row.

The player selects eligible candidates with session-local outcome ranking and attempts up to three distinct URLs, with buffering watchdog; no app code change required. Failed primary may take up to 20 seconds to trigger bounded fallback under existing watchdog. Avoid reporting either stream as permanently healthy or as five other regional Suryan streams.
