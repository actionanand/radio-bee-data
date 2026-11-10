# RadioBee dual-version API and Stage 16 integration

Prepared 2026-11-10 on `feature/15-catalogue-metadata-navigation`. This is a local
review draft, not a deployment announcement. No client repository was modified.

| API root | Source | Generated snapshot | Schema | Catalogue |
| --- | --- | --- | ---: | --- |
| `/v1/` | data/v1 | dist/v1 | 1 | 1.9.0 |
| `/v2/` | data/v2 | dist/v2 | 2 | 2.0.0 |

V1 is restored byte-for-byte from merged master
`d32b32c703256e042aa4b2f17dd5823528a8fa59`. All 25 JSON, localization, image and
placeholder files are frozen; not just the manifest. Its existing schemas remain
under schema/. The enriched Stage 15 draft was previously labelled 1.10.0 but was
not published. Its metadata and assets now live in v2, with schemas in schema/v2/.
Only the manifest and generated browse-index release markers changed in migration.

Both APIs contain the same 117 station identities, 71 stream-bearing stations,
46 discovery-only stations, 74 stream URLs and 71 networks. All stream objects,
permissions, migrations, artwork content and station/network IDs are preserved.
Thoothukudi remains discovery-only. V2 adds the complete enriched location/language
profiles, operating-organization relationships, content themes and browse facets.
See [the detailed field contract and research](STAGE15-METADATA-NAVIGATION-API.md).

## Exact v2 snapshot contract

Start with `index.json`, which has `schemaVersion: 2`, `catalogVersion: "2.0.0"`,
`publishedOn: "2026-11-10"`, `defaultLocale: "en"`, locales en/ta/sa, countries,
counts, files, localizationRoot and disclaimer. The JSON Schema is
[schema/v2/index.schema.json](../schema/v2/index.schema.json).

The complete generated snapshot has these manifest references, all relative to
the same `/v2/` base:

| Manifest key | Filename |
| --- | --- |
| files.stations | stations.json |
| files.discoveryStations | discovery-stations.json |
| files.locations | locations.json |
| files.languages | languages.json |
| files.categories | categories.json |
| files.networks | networks.json |
| files.sources | sources.json |
| files.stationMigrations | station-migrations.json |
| files.broadcasters | broadcasters.json |
| files.programmeThemes | programme-themes.json |
| files.browseIndex | browse-index.json |

`localizationRoot` is `i18n/`; append each declared locale and `.json`. Artwork paths
are relative to the v2 root, so resolve `logoPath` against `/v2/`, never against v1
or the application route. Each version has its own identical artwork bytes.
No absolute API root, access token or runtime server is needed in the payload.

Stations, discovery stations, networks, locations, languages, categories, sources,
broadcasters and programme themes are arrays. The manifest and browse index are
objects with schemaVersion 2/catalogVersion 2.0.0. The station-migrations object
retains its **independent document-format version 1**, with unchanged `removed`
records; this does not make it a v1 catalogue snapshot. Locale JSON remains its
original dictionary format. Each object type is documented by the v2 schemas and
the cross-file validator; there is no blanket assertion that every JSON file has
a top-level schemaVersion field.

Broadcaster, programme-theme and browse-index manifest entries are optional in the
general v2 schema for future compatible consumers. All three are advertised and
present in this release. Advertised references must resolve. A network referencing
a broadcaster needs the registry and sourced relationship. The browse index is
deterministically derived from canonical records and carries its own version markers.
Its stream-bearing counts are neither playback approval nor current reachability.

## Loading, cache safety and fallback

For Stage 16 local work, read the **actual generated dist/v2/** files. Angular tests
can inject the existing catalogue transport with these complete files; browser tests
can serve/intercept the same files at a local same-origin test base. Do not rewrite
the production endpoint or manufacture v2 by changing a v1 manifest number.

The eventual deployed base is `https://actionanand.github.io/radio-bee-data/v2/`.
Its availability has not been established by this local build. Existing production
Web and Android clients must keep `/v1/` until the reviewed data deployment and new
client release are ready. This task does not publish either repository.

A v2 loader should:

1. Require schemaVersion 2 and supported manifest shape; resolve allowlisted relative
   references against the same version base, rejecting traversal and foreign-version
   references. Load canonical arrays and all advertised optional files/locales.
2. Validate identities, sources, stream contracts, geography, language/category/theme
   references, organization relationships, counts and localization before replacing
   the current snapshot. Re-read the manifest to detect a release changing mid-load.
3. Store a whole validated snapshot using a key such as
   `radiobee.catalog.v2:<base-url>`, separate from all v1 cache keys. Never mix arrays,
   rewrite a cached schemaVersion or label older data as v2. Keep the healthy v2
   cache on refresh failure and explicitly identify last-known-good mode.
4. Treat an absent optional browse index as a canonical-v2 fallback. If a retrieved
   optional index is stale/malformed, discard it and derive facets from validated
   canonical data; do not silently accept unvalidated advertised canonical files.
   The data build is stricter and rejects a stale generated index before publication.
5. If no healthy v2 exists, show a clear failure or explicitly separate legacy mode
   with its original v1 parser. Do not pass v1 through the v2 validator.

The [Stage 15 contract](STAGE15-METADATA-NAVIGATION-API.md) defines ancestry traversal,
namespaced grouping keys, AND filter intersections, unique station membership,
deterministic sorting and incomplete multilingual metadata. Missing districts do
not block city → region → country ancestry. Language selection must never select
another stream, infer current on-air language, alter favorites or interrupt audio.
Playback decisions remain in the client's existing eligibility service.

## Build and verification

Use Linux Node.js through WSL2; do not reinstall dependencies or run Windows npm.

```sh
npm run generate:browse
npm run validate
npm test
npm run build
git diff --check
```

`generate:browse` writes **only data/v2/browse-index.json**, through a validated
temporary-file replacement. `validate` requires both APIs, checks version/folder
agreement and compares all v1 bytes against the independent merged-master checksum
inventory. `build` validates both before replacing output and generates dist/v1 and
dist/v2 together; it rechecks the generated v1 against the same baseline. Publication
uses fixed filename allowlists, not arbitrary manifest values or research directories.
Localization copies are limited to `i18n/en.json`, `i18n/ta.json` and `i18n/sa.json`.
Artwork is selected only from validated canonical station/network `logoPath`
references, deduplicated and sorted. The two explicit historical placeholders
`assets/logos/networks/.gitkeep` and `assets/logos/stations/.gitkeep` are retained
in both APIs and must be empty. No i18n/assets directory is copied recursively.
Unreferenced regular files are excluded; source-tree symlinks (even unreferenced,
internal or dangling links), linked source roots and non-regular entries are
rejected before output replacement. The resulting file inventory must exactly
match the publication plan. For the current snapshot this remains 25 v1 files,
28 v2 files and the root index.html, totaling 54 files.
The programmatic build helper still supports v1-only legacy fixtures; the production
CLI requires both APIs and enforces the frozen v1 baseline.

### Offline Draft 2020-12 schema review

The five copied v2 station/discovery/stream/network/location schemas omit their
legacy `$id` fields. Relative references must resolve from each schema's **actual
retrieval URI within schema/v2/**. Register JSON objects under those explicit local
file URIs (for example `ajv.addSchema(schema, retrievalUri)`); do not compile an
anonymous object and guess filesystem siblings after a different `$id` changes
the base. V1 resource identifiers and schemas remain unchanged.

The deterministic reference tests resolve resources using retrieval URIs and every
applicable `$id`, including nested resources, rather than filesystem concatenation.
Negative coverage restores the old legacy `$id` and requires resolution to fail.

For full instance validation, the separate manual review command uses an already
installed Ajv 8 / ajv-formats installation, without installing dependencies:

```sh
node scripts/validate-v2-json-schemas.mjs \
  --validator-package ../radio-bee/package.json \
  --report docs/stage15/schema-validation.json \
  --reviewed-on 2026-11-11
```

The supplied package is used only to locate existing validator modules; the client
is not modified. No validator is downloaded and no network schema loader is
configured. All 11 resources are registered by local file URI. This review validates
the actual v2 station, discovery, location, network, broadcaster, browse-index and
programme-theme records, plus manifest, migrations and standalone streams: **410
record validations, zero errors**, with formats checked. See
[schema-validation.json](stage15/schema-validation.json) for counts, validator
versions and source/schema hashes. Ordinary validation/tests remain dependency-free;
this full Draft check is an explicit additional review command.

Evidence: [v1-production-baseline.json](stage15/v1-production-baseline.json),
[enriched-snapshot.json](stage15/enriched-snapshot.json),
[dual-version-verification.json](stage15/dual-version-verification.json),
[validation.json](stage15/validation.json),
[published-files.json](stage15/published-files.json) and
[changed-files.json](stage15/changed-files.json).

Tests cover full enriched-snapshot preservation, all 25 original v1 file hashes,
both version manifests and their resolved outputs, schema-reference resolution,
version isolation, independent v2 artwork validation, corrupt/missing v2 rejection,
previous-output preservation on validation failure, browse generation never touching
v1, metadata/filter/sort semantics and exclusion of helper/research files.
Publication-hardening fixtures inject extra locale files, backup files, unreferenced
images and nested research content; none appears in output. Further fixtures reject
symlinks at source roots, directories, canonical JSON, locale/image/placeholder paths
and unreferenced entries, preserving existing output on rejection. Every referenced
v2 image still resolves within `/v2/` and has identical source/output bytes.

Before release, review the complete diff, deploy data only with explicit approval,
then verify HTTPS/CORS, both version manifests, every referenced JSON/image/locale and
Web/Android consumption. Local deterministic tests do not establish deployed CORS,
sustained station playback, Android behavior or broadcaster permission. Existing
metadata evidence gaps and stream restrictions remain documented and unchanged.
