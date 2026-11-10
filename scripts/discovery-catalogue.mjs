// Metadata-only publication: never adapt this validator by manufacturing streams.
import {stationGeographyErrors} from './metadata-validation.mjs';
export const discoveryFields = [
  "id",
  "name",
  "networkId",
  "countryCode",
  "regionId",
  "districtId",
  "localityId",
  "broadcastLanguages",
  "genres",
  "delivery",
  "coverage",
  "listingStatus",
  "frequencyMHz",
  "website",
  "sourceIds",
  "notes",
  "aliases",
  "availability",
  "reviewedOn",
  "websiteKind",
];
export function discoveryErrors(data, validHttps) {
  if (
    !["sources", "locations", "networks", "languages", "categories"].every(
      (k) => Array.isArray(data[k]),
    )
  )
    return [];
  const errors = [],
    rows = data.discoveryStations ?? [],
    published = data.stations ?? [],
    sources = new Set(data.sources.map((s) => s.id)),
    locations = new Map(data.locations.map((l) => [l.id, l])),
    networks = new Map(data.networks.map((n) => [n.id, n])),
    languages = new Set(data.languages.map((l) => l.code)),
    genres = new Set(data.categories.map((c) => c.id));
  if (!Array.isArray(rows)) return ["discoveryStations must be an array"];
  const ids = new Set(published.map((s) => s.id)),
    names = new Map();
  const key = (network, name) =>
    network + "|" + name.normalize("NFKC").trim().toLowerCase();
  for (const s of published) {
    names.set(key(s.networkId, s.name), s.id);
    for (const alias of Array.isArray(s.aliases) ? s.aliases : [])
      names.set(key(s.networkId, alias), s.id);
  }
  for (const row of rows) {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      errors.push("Invalid discovery station");
      continue;
    }
    const fail = (m) => errors.push(`Discovery ${row.id}: ${m}`),
      text = (v) => typeof v === "string" && !!v.trim();
    if (
      Object.keys(row).some((k) => !(data.index?.schemaVersion===2?[...discoveryFields,'languageProfile','geographyEvidence','programmeThemeIds']:discoveryFields).includes(k)) ||
      discoveryFields.some((k) => !Object.hasOwn(row, k))
    )
      fail("metadata fields invalid; stream/URL extensions are forbidden");
    if (
      !text(row.id) ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.id) ||
      ids.has(row.id)
    )
      fail("duplicate/invalid station ID");
    ids.add(row.id);
    if (
      !text(row.name) ||
      !networks.get(row.networkId)?.countryCodes.includes(row.countryCode)
    )
      fail("invalid identity/network/country");
    const aliases = Array.isArray(row.aliases) ? row.aliases : [];
    if (
      !Array.isArray(row.aliases) ||
      aliases.some((a) => !text(a)) ||
      new Set(aliases).size !== aliases.length
    )
      fail("invalid aliases");
    for (const name of [row.name, ...aliases].filter(text)) {
      const k = key(row.networkId, name),
        owner = names.get(k);
      if (owner && owner !== row.id) fail("duplicate programme alias");
      names.set(k, row.id);
    }
    if(data.index?.schemaVersion===2)for(const message of stationGeographyErrors(row,data.locations))fail('invalid geographic hierarchy: '+message);
    else {
      let parent=row.countryCode?.toLowerCase();
      for(const [field,type]of [['regionId','state'],['districtId','district'],['localityId','locality']]) {
        if(row[field]!==null){const l=locations.get(row[field]);if(!l||l.type!==type||l.countryCode!==row.countryCode||l.parentId!==parent)fail('invalid geographic hierarchy');}
        parent=row[field];
      }
    }
    for (const [field, known, nonempty] of [
      ["broadcastLanguages", languages, false],
      ["genres", genres, true],
      ["sourceIds", sources, true],
    ])
      if (
        !Array.isArray(row[field]) ||
        (nonempty && !row[field].length) ||
        new Set(row[field]).size !== row[field].length ||
        row[field].some((x) => !known.has(x))
      )
        fail("invalid " + field);
    if (
      !["fm", "am", "online"].includes(row.delivery) ||
      !["local", "regional", "national", "global"].includes(row.coverage) ||
      !["candidate", "reviewed"].includes(row.listingStatus)
    )
      fail("invalid metadata enums");
    if (
      row.frequencyMHz !== null &&
      (!Number.isFinite(row.frequencyMHz) ||
        row.frequencyMHz < 65 ||
        row.frequencyMHz > 110 ||
        row.delivery !== "fm")
    )
      fail("invalid descriptive frequency");
    if (row.notes !== null && !text(row.notes)) fail("invalid notes");
    if (
      ![
        "no-direct-stream",
        "temporarily-unavailable",
        "review-pending",
      ].includes(row.availability)
    )
      fail("invalid availability");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(row.reviewedOn ?? "") ||
      !Number.isFinite(Date.parse(row.reviewedOn))
    )
      fail("invalid review date");
    if (row.website === null) {
      if (row.websiteKind !== null) fail("website kind without website");
    } else if (
      !validHttps(row.website) ||
      !["official", "provider"].includes(row.websiteKind)
    )
      fail("invalid website/provider link");
    else {
      const url = new URL(row.website);
      if (
        url.search ||
        /\.(mp3|m3u8|aac)(\/|$)/i.test(url.pathname) ||
        /\/(api|proxy|webdio)(\/|$)/i.test(url.pathname)
      )
        fail("website cannot be a media/API/research URL");
    }
  }
  const counts = data.index?.counts,
    advertised = data.index?.files?.discoveryStations;
  if (
    advertised !== undefined &&
    (advertised !== "discovery-stations.json" || !data.discoveryStations)
  )
    errors.push("Invalid discovery manifest reference");
  if (rows.length && !advertised)
    errors.push("Discovery publication requires manifest reference");
  if (advertised !== undefined) {
    const all = [...published, ...rows];
    const eligible = (s) =>
      Array.isArray(s.streams) &&
      s.streams.some(
        (x) =>
          x.verificationStatus === "verified" &&
          x.rightsStatus === "permission-granted" &&
          (!x.directListening || x.directListening.status === "allowed"),
      );
    for (const [k, n] of Object.entries({
      discoveryStations: rows.length,
      discoverableStations: all.length,
      stationsWithStreamCandidates: published.filter(
        (s) => Array.isArray(s.streams) && s.streams.length,
      ).length,
      productionEligibleStations: published.filter(eligible).length,
    }))
      if (counts?.[k] !== n) errors.push("index count " + k + " is stale");
  }
  return errors;
}
