# Stage 36 — station-name localization

Prepared 2026-11-13 on `feature/36-station-name-localization-v2` from master
`4a93371798bf9d353c516fcb436d0f9514e15a4b`. The revised request names Stage 36;
its closing Stage 35 branch reference is superseded by that revised branch.
Catalogue 2.8.4 → **2.8.5**, schema version 2 unchanged.

All **240** canonical station identities were reviewed. Both target dictionaries
have exactly 240 stable-ID keys. Each contains **224 local-script labels** and
**16 exact English fallbacks**. No station objects are duplicated in locales;
English `stations.json` names remain the authoritative fallback. The 245 stream
URLs and all canonical metadata, permissions, artist/network associations, language
profiles, artwork and v1 files are unchanged. The browse index changes only its
catalogue-version marker; memberships and navigation remain identical.

## Display-label contract

`data/v2/i18n/ta.json` and `sa.json` add an optional flat `stationNames` dictionary:

```json
{"stationNames":{"air-nagercoil":"ஆகாஷவாணி நாகர்கோவில்"}}
```

Look up `locales[uiLocale]?.stationNames?.[station.id]`, falling back to the
station's canonical `name` when the dictionary or entry is absent. The data-only
reference helper is `stationDisplayName` in scripts/station-localization.mjs.
Do not use UI localization to change broadcast languages, identity, sorting/grouping
keys, favorite IDs, artist identity, stream selection or playback eligibility.
No client code is modified. Existing flat string-dictionary consumers can ignore
the optional section. English locale remains unchanged; no duplicate English-name
registry is required.

Station-name coverage can be partial in the general compatible contract. This
release's tests require complete 240-ID coverage. Other UI-label sections retain
the existing English/Tamil/Sanskrit parity checks. Station-name keys are separately
validated against active canonical IDs; unknown/obsolete IDs, blank/non-string
values, malformed/non-NFC Unicode, wrong target scripts and changed numbers are
rejected. Exact English fallback values are permitted. Number-bearing brand tags
such as `80s80s`, `A9`, `3ZZZ` and `2K` remain intact; frequencies and numerical
identifiers are not added, removed or translated into other digits.

The v2 locale loader also rejects duplicate raw JSON keys, including escaped
equivalents, before JSON.parse can silently collapse them. Missing labels still
fall back to canonical English. V1 data and localization are unchanged.

## Linguistic decisions and remaining review

Local labels are editorial display transliterations/localizations, **not asserted
official broadcaster translations**. Proper brand/artist names are retained or
transliterated rather than translated for their meanings. Familiar geographic
names and descriptive qualifiers use local equivalents. All native-script values
use NFC Unicode. The entire Sanskrit set can benefit from native-language
proofreading; technical Unicode validation does not certify linguistic spelling.

Sixteen names remain exact English in both dictionaries where publisher-preferred
local spelling or pronunciation is uncertain:

- Aural Radio Kerala; mauRadio; JEIFM; Otran Vaanoli.
- Radio Norge; SuomiPop; Znad Wilii; Radio Stad Den Haag.
- Sveriges Radio P1; Radio dla Dorosłych; Nagham FM Egypt; 77H FM Guarujá SP.
- Vaalai FM; Sree Kurumba FM; Kanal Music; Kandhakapookkal Radio.

See [the complete station-by-station review](stage36/station-name-review.json) for
all 240 English/Tamil/Sanskrit labels, per-locale modes and specific review reasons.
Ambiguous Tamil names are deliberately not assigned a guessed word or meaning.
No source or use-permission approval is implied by localizing a name.

## Verification and delivery

[baseline.json](stage36/baseline.json) captures protected source-file hashes,
unchanged pre-existing locale sections and the original browse-index content.
Regression tests verify all 240 records, artist associations, 245 stream URLs and
all playback metadata by complete file hashes. They exercise missing-entry fallback,
unknown IDs, scripts/Unicode, numeral/brand preservation, duplicate JSON keys and
publication of both APIs through the existing allowlists.

Run through WSL2 Linux Node.js:

```sh
npm run validate
npm test
npm run build
git diff --check
```

Exact command results are in [verification.json](stage36/verification.json);
the full changed-file inventory is in [changed-files.json](stage36/changed-files.json).
Historical tests' current-version assertions move to 2.8.5 without weakening their
station, stream, permission, grouping or publication checks. No dependencies are
installed or updated and no network stream audits are performed.

The user authorized a local commit and normal push attempt on the revised existing
feature branch after successful validation. Push results and the resulting commit
SHA are reported separately; authentication failure must retain the local commit.
No automatic merge is authorized.
