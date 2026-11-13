# Curated Home stations (API v2)

The ordered 13-station Home selection is stored at
[`data/v2/home-stations.json`](../data/v2/home-stations.json) and published at
`https://actionanand.github.io/radio-bee-data/v2/home-stations.json`.

- `schemaVersion` is 2, `count` is the number of IDs, and `stationIds` is an
  ordered array of canonical v2 station IDs. The first ID is **Tamil Kadavul Murugan**.
- The other 12 IDs follow the requested Home display order, with the three existing
  `100%` stations retained at the end. **MINNALfm** and **SLBC Tamil National Service FM**
  are intentionally absent.
- The 240 canonical stations, streams, browse index, localized station names and
  directory filters remain unchanged. This file is a Home **subset**, not an inventory
  deletion, stream permission, or replacement for `stations.json`.
- The published selection is validated against canonical station IDs and included in
  the static build through an explicit allowlist entry.

## Client integration still required

The currently deployed `radio-bee` client does **not** fetch this file. It builds the
`/home` list from all catalogue stations and applies a name sort via `browseV2`.
Its v2 manifest parser rejects new `files` keys, so this sidecar file is intentionally
**not** referenced from `v2/index.json`.

To activate the requested visible Home behavior, the client must fetch
`home-stations.json` from the same catalogue base, validate its IDs against the
loaded canonical stations, render those 13 stations in the **array order** without
the alphabetical sort, and keep the full catalogue available in other directory
views. This requires a client change and deployment; publishing the sidecar alone
will not change the current live Home page.
