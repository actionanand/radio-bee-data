# Stage 15 metadata and navigation API — API v2, catalogue 2.0.0

Review date: 2026-11-10. Branch: `feature/15-catalogue-metadata-navigation`.
Baseline: merged master `d32b32c703256e042aa4b2f17dd5823528a8fa59`, catalogue 1.9.0.
The enriched draft was initially prepared as 1.10.0/schema 1. Before publication,
the user requested a proper dual-version API: legacy data/v1 is restored exactly
to merged-master catalogue 1.9.0, while the full enriched snapshot is retained in
data/v2 with schemaVersion 2 and catalogue 2.0.0. No 1.10.0 release is claimed.

This is an uncommitted data-only review draft. The client, artwork, stream objects,
availability, permission decisions and historical research are unchanged.

| Inventory | Frozen v1 / 1.9.0 | New v2 / 2.0.0 |
| --- | ---: | ---: |
| Distinct station identities | 117 | 117 |
| Stream-bearing stations | 71 | 71 |
| Discovery-only stations | 46 | 46 |
| Stream URLs | 74 | 74 |
| Networks | 71 | 71 |
| Represented countries | 20 | 20 |
| Canonical location records | 117 | 131 |
| Documented language codes | 14 | 61 |
| Separate broadcaster records | absent | 10 |
| Programme-content themes | absent | 4 |

All stream objects are checked against baseline hashes, including direct-listening,
verification, recording and redistribution metadata. Thoothukudi remains discovery-only.
No new station, stream, frequency, playback approval or rights grant was introduced.

## Review evidence and completeness

All 117 records were reviewed against their existing metadata and source notes;
targeted publisher/official sources support the corrections below. This is not a
claim that 117 publishers were freshly contacted or that every inherited field was
independently confirmed. Uncertain records retain their known metadata and disclose
the gap. There were no stream probes or audio recordings in this stage.

The complete machine-readable review is in:

- [stations.json](stage15/stations.json) and [stations.csv](stage15/stations.csv):
  117 identities, before/after geography and languages, categories, broadcaster,
  evidence, confidence and remaining uncertainty. CSV protects spreadsheet-dangerous
  text; JSON and canonical identities are unchanged by that escaping.
- [metadata-audit.json](stage15/metadata-audit.json): 328 ordered field-level changes
  with previous presence/value, new value, source IDs, evidence type, date and
  uncertainty; also evidence for the 14 new location nodes. Repeated edits replay in
  order. Organization changes identify the network rather than inventing a station.
- [geography.json](stage15/geography.json): coverage, all country/state/district/locality
  counts and memberships, direct memberships and the 20 corrected station locations.
- [languages.json](stage15/languages.json): every station's language profile, schedules
  and unique language/classification facet membership.
- [groupings.json](stage15/groupings.json): all network, broadcaster, genre and theme
  memberships, plus unmapped organizations and devotional-theme gaps.
- [summary.json](stage15/summary.json), [baseline.json](stage15/baseline.json): exact
  totals, original record/stream hashes and historical-file hashes. Tests reverse the
  journal to verify the original records, then replay it against the live catalogue.
- [published-files.json](stage15/published-files.json): exact 54-file static output.
- [changed-files.json](stage15/changed-files.json): complete working-tree inventory,
  separating Stage 15 changes from the four excluded pre-existing files (three Stage 12 helpers and scripts/find_stream_url.py).
- [validation.json](stage15/validation.json): final command outcomes and test counts.

### Geography corrections

Geography describes a documented station/programme base, not transmitter footprint,
the listener's location, stream-host IP geography or a claim of a unique local feed.
All 117 retain countries; 90 have regions, 64 districts and 75 localities. These sets
overlap and do not sum to 117. A locality may have a region parent without a district.
Twenty-seven stations have country only. Missing levels are `null`, never placeholder
places. The retained Malaysia attribution for JEI FM and Ireland attribution for
Otran Vaanoli are explicitly low confidence; finer locations remain unset.

Twenty location refinements use publisher sources, with official administrative
corroboration where needed:

| Station(s) | Established detail; limitation |
| --- | --- |
| AR Radio Kerala | Existing Thrissur district in Kerala; no invented locality/studio/frequency |
| EAST FM; Good News Tamil | Scarborough, Ontario; base does not imply exclusive coverage |
| A9; Time FM Toronto; CMR Tamil; CTR | Toronto, Ontario; no Montreal substitution |
| Amen FM | Published Oshawa, Ontario base |
| 3ZZZ | Melbourne, Victoria |
| 4EB FM; 4EB Global | Brisbane, Queensland; separate existing programmes retained |
| 5EBI | Adelaide, South Australia |
| Inbathamil Oli; ATBC | Sydney, NSW; no directory studio address or transmitter-site substitution |
| Lotus FM | KwaZulu-Natal only; no city invented |
| Theophony Tamil | Existing Bengaluru locality/district hierarchy reused |
| Sweety FM | Arakkonam, Ranipet district; not obsolete Vellore attribution |
| Hand of Jesus Tamil | Coonoor, Nilgiris district |
| Vaanmalar; Tamil Christian Radio | Existing Chennai city/district hierarchy |

AR's [publisher page](https://arradiokerala.blogspot.com/) explicitly identifies
Thrissur, Kerala, India and Malayalam/Tamil/Hindi. A bounded publisher-HTML check
corroborated the user report; no audio or private address was retained. Source
`stage15-ar-publisher` is separate from `stage15-ar-user-report`.
[Ranipet district administration](https://ranipet.nic.in/) corroborates Arakkonam's
current district. Other corrections reuse the named Stage 14 publisher context where
appropriate; this reuse is explicit in each change record. Country/base uncertainty
in inherited records remains a follow-up task, not silently upgraded certainty.

### Languages and schedules

| Classification | All | Stream-bearing | Discovery-only |
| --- | ---: | ---: | ---: |
| Multilingual | 19 | 18 | 1 |
| Single-language | 11 | 11 | 0 |
| Unknown | 87 | 42 | 45 |

One known language is not enough to infer exclusivity. Dedicated Tamil services with
publisher support are classified single-language but retain partial coverage to
acknowledge incidental announcements or unidentified material. Empty language arrays
remain unknown, including Raagam and ISKCON; institution/genre is not language proof.

Five language lists were expanded from explicit publisher programme labels:

- [EAST FM weekly schedule](https://eastfm.ca/main/schedule.php): 14 named languages.
- [Lotus FM official profile](https://www.lotusfm.co.za/lotusfm/about-motsweding-fm/):
  English primary plus Tamil, Urdu, Hindi, Telugu and Gujarati shows. The legacy URL
  slug says Motsweding, but the page title/body describe Lotus. No audio was changed.
- [3ZZZ shows](https://www.3zzz.com.au/shows/): 37 documented language codes; inactive
  Cambodian/Coptic entries and ambiguous nationality-only labels excluded.
- [4EB Global digital guide](https://www.4eb.org.au/guide/digital/): 15 named language
  codes; “Music” and ambiguous “Fiji-Indian” labels are not converted into languages.
- [5EBI publisher](https://www.5ebi.com.au/): 32 documented language codes; nationality
  and cultural-group labels are not automatically mapped to languages.

AR, Aural, Live FM Bahrain, mauRadio and Radio Plus Indiz retain previously documented
language arrays. Radio 4EB FM remains partial with its two documented tags: Global's
language inventory is not copied onto FM. Time FM Toronto is known multilingual
from its publisher's “Multilingual Show”, but only Tamil has been individually
identified. Its profile can therefore be multilingual with one canonical language.
No primary language is inferred from array order. Coverage `complete` is limited to
explicit publisher-declared language sets (AR, Lotus, mauRadio), not live monitoring.

Five optional schedule entries cover EAST's Tamil weekdays, 3ZZZ Tamil Thursday,
4EB FM's two Tamil slots and 4EB Global's five-day Tamil slot. Schedule fields are
documented below. The 4EB Tamil page includes a historical committee date: these are
reviewed publisher statements, not a guarantee that the schedule is still operating.
No schedule implies the current audible language or playback readiness. Recheck with
the broadcaster before presenting a “now playing” or current programme claim.

The 47 new language codes name documented languages; they do not add 47 stations.
English-name fallbacks are used for Harari/Hmong native labels pending proofreading.
Filipino (`fil`) and Tagalog (`tl`) preserve distinct publisher labels. No unsupported
Sanskrit programme was inferred from devotional branding. Locale labels in English,
Tamil and Sanskrit retain key parity; translations still benefit from human review.

### Broadcasters and genres

Ten networks have sourced operating-organization relationships; the other 61 remain
unmapped at organization level and still group by their original networks. This does
not assert ultimate corporate ownership, licensing rights for RadioBee, or equivalent
programmes. Sources are attached to both the registry and network relationship.

| Existing network | Documented organization |
| --- | --- |
| Akashvani | Prasar Bharati |
| Suryan FM India | Sun TV Network Limited |
| Hello FM | Malar Publications Limited |
| Mirchi | Entertainment Network (India) Limited |
| Radio City | Music Broadcast Limited |
| BIG FM | Reliance Broadcast Network Limited |
| Sooriyan Sri Lanka | Asia Broadcasting Corporation |
| Vasantham | Independent Television Network Limited |
| SABC | South African Broadcasting Corporation |
| 4EB | Ethnic Broadcasting Association of Queensland Limited |

Indian commercial operator names come from the official MIB February 2026 operational
FM register (`stage15-mib-licensees`), not assumed ultimate owners after acquisitions.
Prasar Bharati, Sooriyan, Lotus and 4EB publisher pages and the Sri Lankan ministry's
ITN/Vasantham report provide the other relationships. The ITN website returned 403;
the government report supplies documentary association, not fresh player access.
Indian Suryan and Sri Lankan Sooriyan remain distinct networks and organizations.

All existing broad genres are retained. Twelve stations receive programme-content
themes: Christian devotional, Hindu devotional, Islamic religious and/or Tamil
devotional music, supported by existing publisher descriptions. Theme counts overlap;
the exact memberships are in groupings.json. These describe content, never listeners'
religion, ownership or permissions. ISKCON's specific theme remains unset without
sufficient programme-content evidence. Broad genre completeness and devotional-theme
gaps remain explicit; a single scheduled devotional show does not classify an entire
general/music station as exclusively devotional.

## Separate API v2 contract

The v2 manifest has `schemaVersion: 2`, `catalogVersion: "2.0.0"` and
`publishedOn: "2026-11-10"`. All paths below are relative to `/v2/`.
The frozen `/v1/` manifest remains schema 1 / catalogue 1.9.0 / 2026-11-09.
Existing fields, IDs, arrays and stream contracts retain their meanings. New optional
manifest entries are `files.broadcasters`, `files.programmeThemes`, `files.browseIndex`.
They point to `broadcasters.json`, `programme-themes.json`, `browse-index.json`.
All three are present in this complete v2 snapshot. Schemas are in schema/v2/;
schema/ keeps the original v1 contracts. The station-migrations document retains
its independent format version 1 and identical removal records in both APIs;
this is not a v1 catalogue snapshot. The v2 browse index has schemaVersion 2.

Station and discovery records may add:

- `geographyEvidence`: `confidence` (high/medium/low/unknown), `evidenceType`
  (publisher/official/directory-corroborated/user-corroborated/legacy-catalogue/unknown),
  `sourceIds`, `reviewedOn`, `notes`. Confidence does not change canonical membership.
- `languageProfile`: `classification` (single-language/multilingual/unknown),
  `programmingPattern` (continuous/mixed/scheduled/unknown), `coverage`
  (complete/partial/unknown), nullable `primaryLanguage`, `sourceIds`, `reviewedOn`,
  `notes`, optional `schedules`. `broadcastLanguages` remains authoritative.
- `programmeThemeIds`: optional references to programme-themes.json. They supplement
  broad `genres`; current themes require devotional membership and editorial evidence.

Each schedule has `id`, `title`, `languages`, `days` (ISO 1=Monday … 7=Sunday),
`startLocal`, `endLocal` (24-hour HH:mm), IANA `timeZone`, `sourceIds`, `reviewedOn`.
An end earlier than start denotes the next local day; equal start/end is invalid.
Languages must be documented on the station. Sources must be reviewed publisher or
official records included in the language profile. The validator checks references,
shape and time zones; editorial review must establish that source content supports
the actual claim. It cannot authenticate a broadcaster from a source ID alone.

Networks may add `broadcasterId`, `broadcasterSourceIds`, `broadcasterRelationship`
(public-broadcaster/licensed-operator/publisher-operator); all three are required
together. Broadcaster records have `id`, `name`, `aliases`, `website`, `sourceIds`,
`reviewedOn`, `notes`. Theme records have `id`, `name`, `description`.

The JSON Schemas document these fields and strict object shapes. The dependency-free
validator also enforces cross-file references, geography, profile consistency,
schedules, unique memberships and generated-index equality. It is not a general
JSON Schema engine or a substitute for source-content review.

## Breadcrumbs, index and stable navigation keys

Resolve the deepest known `localityId ?? districtId ?? regionId ?? lower(countryCode)`
against locations.json; follow `parentId` to the country and reverse. Prepend a
localized virtual World/All Countries item, then append the station if desired.
Reject missing references, foreign country nodes, cycles and conflicting explicit
station ancestors. Skip absent levels. Country IDs are lowercase location IDs;
country filter codes remain uppercase. Use IDs, not names, to disambiguate namesakes.
Examples: `in → in-tn → in-tn-kanyakumari → in-tn-kanyakumari-nagercoil`,
`in → in-kl → in-kl-thrissur`, `ca → ca-on → ca-on-toronto`.

Locations retain types country/state/district/locality. A locality may have a country,
state or district parent; any known ancestors must match the station's explicit
fields. Existing Chennai district and city IDs remain distinct and connected.

Run `npm run generate:browse` after canonical changes. The pure helper in
scripts/catalogue-navigation.mjs builds an index with no network, runtime backend or
editorial mutations. Generation validates the whole candidate snapshot before writing
through an exclusive temporary file and atomic replacement. Validation/build reject
a stale index; build does not silently regenerate it.

Index fields are `schemaVersion`, `catalogVersion`, `countScope`, `totals`,
`stationIds`, `facets`, `availability`. Facets cover countries, locations, languages,
languageClassifications, networks, broadcasters, genres and themes. Each row exposes
`id`, `name`, stable namespaced `key`, sorted unique `stationIds`, and `counts`
`{all, streamBearing, discoveryOnly}`. Location facets also expose type, country,
parentId, childIds and directStationIds; their main counts include descendants.
Network facets expose aliases, countryCodes and nullable broadcasterId. Broadcasters
expose aliases, sourceIds and networkIds; language facets include nativeName.

Counts include both inventories. Alternate streams never create extra memberships.
Language, genre, location-ancestor and theme counts overlap and must not be summed
as a unique total. Empty canonical facets can have zero counts. “Stream-bearing”
means an entry has candidate URLs; it is **not** “playable”, “approved” or “available
now”. Playback and use review retain the existing client contract.

Keys such as `location:ca-on-toronto`, `language:ta`, `network:akashvani` and
`broadcaster:prasar-bharati` are grouping identifiers, not a new routing system.
Do not materialize every possible filter combination or duplicate station metadata.

## Future client integration: filters, sorting and fallback

Load index.json and canonical files as one catalogue-version snapshot. If an optional
index is absent, unavailable, malformed or has another catalogVersion, ignore it and
derive memberships from canonical data. A missing optional broadcaster registry means
network-only grouping; missing profiles mean unknown classification. Do not infer
single-language, primary language, a missing district or broadcaster from a name.
Existing consumers keep requesting `/v1/` and retain their original contract.
A v1 parser must not accept v2 or relabel a cached v1 snapshot as v2. Use separate
cache keys, parser versions and whole-snapshot replacement for the new client.
No client change is included in this branch.

The offline `selectStations(data, filters)` reference implementation documents scalar
filters: countryCode, regionId, districtId, localityId, language, networkId,
broadcasterId, genre, theme, availability (all/stream-bearing/discovery-only),
multilingual (boolean), and sort. Cross-facet selections use AND; membership inside
a station's language/genre arrays uses containment. `multilingual: true` means the
explicit classification; false excludes multilingual and includes unknown records.
Omitting it includes all. Unknown valid-shaped IDs yield empty results; unknown filter
fields/types throw. A future multi-select UI must explicitly choose union/intersection
semantics within each facet rather than guessing a different API rule.

Country includes all stations of that country, regardless of finer metadata. Region,
district and locality match their exact established ancestor IDs and types, never
network coverage. Broadcaster filtering follows network.broadcasterId. Combine sets,
then deduplicate by station ID, then sort. Empty results remain empty. For example:

```js
selectStations(data, {language:'ta', countryCode:'IN', regionId:'in-tn',
  districtId:'in-tn-kanyakumari', genre:'devotional'});
selectStations(data, {language:'hi', countryCode:'IN', regionId:'in-kl', multilingual:true});
selectStations(data, {countryCode:'CA', multilingual:true, genre:'music'});
selectStations(data, {networkId:'akashvani', regionId:'in-tn', availability:'stream-bearing'});
```

Sort keys: name (default), country, region, district, network, broadcaster, language,
genre, availability. Country/location/network/organization sorts use canonical names.
Language uses the selected language, otherwise the documented primary; never the
first array item. Genre uses the selected category, otherwise the alphabetically
first canonical genre name. Availability uses the literal classification. Compare
NFKC-normalized lowercase strings by deterministic UTF-16 lexical order, missing
values last, then raw stable station ID. This is reproducible catalogue ordering,
not locale collation, popularity or listener ranking. The helper never mutates input.

## Validation and remaining limitations

Publication hardening keeps deterministic filename allowlists for JSON, exactly
three reviewed locale files, validated canonically referenced artwork and the two
empty historical `.gitkeep` entries. Neither i18n nor assets is copied recursively.
Unreferenced regular files are excluded; symlinks and non-regular source entries
are rejected before output replacement. Both versions retain their exact approved
file inventory, including byte-identical v1 artwork and placeholders. Regression
fixtures cover extra/nested localization and assets, linked roots/directories/files,
internal/dangling/unreferenced links and precise v2 image resolution.

The final schema-resource correction removes the five legacy v2 `$id` values and
uses explicit local retrieval URIs. Reference tests account for `$id` scope, with
legacy-ID and nested-ID regression fixtures. Full offline Ajv Draft 2020-12 review
validated 410 cases across 11 schema resources with formats enabled, zero errors
and no network loader; [schema-validation.json](stage15/schema-validation.json)
records exact group counts and hashes. No v1 schemas or catalogue data changed.

Final checks: validation passed; **166 tests passed** (0 failed, 0 skipped);
the dual-version static build and `git diff --check` passed. Both generated manifests
exist with schema/catalogue versions 1/1.9.0 and 2/2.0.0 respectively. All 25 v1
files were compared directly against merged-master Git blobs; all 28 enriched v2
files were preserved, with only release markers changed in the two versioned objects.
See [the dual-version proof](stage15/dual-version-verification.json) and
[client integration contract](API-V2.md). The complete Git inventory lists
74 changed/new Stage 15 files; the four old helper files are locally excluded.

See validation.json for the final WSL2 Linux command results and exact test counts;
no dependency versions or installs changed. Tests cover stream/history preservation,
journal replay, geography and skipped levels, classifications and schedules, sourced
operator relationships, themes, deterministic facets/filter intersections/sorts,
optional fallback, invalid/stale index rejection, atomic generation failure preservation,
locale parity and static publication boundaries. Stage 14 tests now read the genuine frozen v1; earlier dated views continue
their original reconstruction. Stage 15 independently checks current preservation.

Remaining work: publisher confirmation of inherited/low-confidence geography; fuller
language inventories for partial/unknown profiles; current schedule confirmation;
organization evidence for 61 networks; broader genre/theme review; language-label and
locale proofreading. Metadata confidence is documentary, not broadcaster authentication.
No new sustained browser/Android checks or use permissions were obtained or required
for this metadata-only change. All existing listening restrictions remain applicable.
The UI work and deployment review remain later stages.
