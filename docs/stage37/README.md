# Stage 37: artist-name localization

Catalogue v2.8.6 adds `artistNames` keyed by canonical artist ID to Tamil and Sanskrit localization files. Both locales cover all 31 artists with local-script transliterations. Canonical English names remain authoritative; English names and aliases are unchanged. These display labels do not change station grouping or playback authorization.

The validator checks known IDs, complete coverage, nonblank NFC text and correct script through the shared localization contract. The existing raw JSON parser rejects duplicate keys, including escaped-equivalent duplicates. Missing dictionaries are supported for older releases; v2.8.6 and later require both dictionaries. The English dictionary is not duplicated.

Regression tests cover missing keys/dictionaries, blank and unknown keys, duplicate JSON keys and older-version compatibility. SHA-256 baselines preserve all canonical station records (240 stations and 245 stream URLs), all 31 artist records/aliases, and both existing station-name dictionaries. Existing Stage 36/v1 preservation checks remain active. Historical tests pinned to the previous patch version were updated consistently; their inventory/identity assertions remain.

The manifest and generated browse index both use v2.8.6. The dual-version static build publishes both v1 and v2 with the existing allowlists. No radio endpoints, rights, membership or canonical names were edited.

Verification: data validation, 203 tests and dual-version static build passed; client 555 tests, targeted fallback tests, lint, typecheck and production build passed. Chrome checked 12 desktop/mobile × en/ta/sa × light/dark states against the actual built v2.8.6 output with zero Axe violations; localized facet titles and cross-locale search passed. Screenshots were inspected. Three pre-existing client stylesheet budget warnings remain; no budgets changed. No public deployment or physical Android validation is claimed.
