#!/usr/bin/env python3
"""Research-only Radio Browser Tamil station candidate collector.

Never edits RadioBee catalogue, station IDs, logos, or playback permissions.
Run in radio-bee-data root (optional catalogue matching), or any directory.
Uses Radio Browser's bylanguage/tamil endpoint first.
"""
from __future__ import annotations

import argparse
import csv
import ipaddress
import json
import re
import sys
import subprocess
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

from research_safety import safe_request, spreadsheet_row, spreadsheet_cell
import base64
from urllib.parse import urlencode

HOSTS = (
    "de1.api.radio-browser.info",
    "de2.api.radio-browser.info",
    "fi1.api.radio-browser.info",
    "nl1.api.radio-browser.info",
)
HEADERS = {"User-Agent": "RadioBeeResearch/1.1 (candidate audit; no audio recording)", "Accept": "application/json"}
LOCAL_NAMES = (
    "nagercoil", "kanyakumari", "kanniyakumari", "kuzhithurai",
    "annai", "tamilosai", "isai murasu", "christian samy", "asr digital",
    "hello fm", "suryan", "mirchi", "red fm", "radio city",
    "big fm", "rainbow", "coimbatore", "tirunelveli", "tuticorin",
    "thoothukudi", "madurai", "chennai", "trichy", "tiruchirappalli",
    "salem", "vellore", "erode", "kodaikanal",
)
SEARCH_TERMS = (
    "suryan", "hello fm", "mirchi", "red fm", "radio city", "big fm",
    "nagercoil", "kanyakumari", "annai", "tamilosai", "isai murasu", "christian samy", "asr digital",
)
REVIEW_TERMS = (
    "suryan", "hello", "mirchi", "red fm", "nagercoil", "kanyakumari",
    "annai", "tamilosai", "isai murasu", "christian samy", "asr digital",
)
TN_STATES = ("tamil nadu", "tamilnadu", "puducherry", "pondicherry")
CSV_FIELDS = [
    "name", "region", "countrycode", "country", "state", "language", "tags", "stationuuid",
    "stream_url", "original_url", "https_ready", "favicon", "homepage", "codec", "bitrate",
    "hls", "lastcheckok", "lastchecktime_iso8601", "votes", "url_shared_by", "radiobee_id",
    "radiobee_status", "discovery_queries", "probe_status", "probe_note",
]


def fetch(hosts: list[str], path: str, params: dict) -> list[dict]:
    last = None
    for host in hosts:
        try:
            rows = []
            requested = min(int(params.get("limit", 500)), 500)
            for offset in range(0, requested, 25):
                query = dict(params, limit=min(25, requested-offset), offset=offset)
                value = safe_request('api', f"https://{host}{path}?{urlencode(query)}")
                if not isinstance(value, list):
                    raise ValueError("expected JSON station array")
                rows.extend(value)
                if len(value) < query['limit']:
                    return rows
            raise ValueError("500-row safety ceiling reached; narrow the query or use saved JSON")
        except (subprocess.SubprocessError, OSError, ValueError) as exc:
            last = type(exc).__name__
    raise RuntimeError(f"No mirror returned a complete bounded query for {path}: {last}")


def jobs(wide: bool) -> list[tuple[str, str, dict]]:
    # User-supplied endpoint is always the first, and no automatically approved URLs are inferred.
    result = [("tamil-language", "/json/stations/bylanguage/tamil", {"hidebroken": "true", "limit": 10000})]
    if wide:
        result.append(("tamil-tag", "/json/stations/search", {"tag": "tamil", "hidebroken": "true", "limit": 10000}))
        for state in ("Tamil Nadu", "Puducherry"):
            result.append((f"state:{state}", "/json/stations/search", {"countrycode": "IN", "state": state, "hidebroken": "true", "limit": 10000}))
        for term in SEARCH_TERMS:
            result.append((f"name:{term}", "/json/stations/search", {"countrycode": "IN", "name": term, "hidebroken": "true", "limit": 500}))
    return result


def region(st: dict) -> str:
    cc = str(st.get("countrycode") or "").upper()
    state = str(st.get("state") or "").casefold()
    name = str(st.get("name") or "").casefold()
    if cc == "IN":
        if any(k in state for k in TN_STATES):
            return "India / Tamil Nadu or Puducherry"
        if any(k in name for k in LOCAL_NAMES):
            return "India / possible Tamil Nadu (name only)"
        return "India / other or unknown state"
    if cc:
        return str(st.get("country") or cc)
    return "Unknown country"


def candidate_id(st: dict) -> str:
    return str(st.get("stationuuid") or f"{st.get('name')}|{st.get('url_resolved') or st.get('url')}")


def pick_url(st: dict) -> str:
    return str(st.get("url_resolved") or st.get("url") or "").strip()


def is_public_https(url: str) -> bool:
    """Syntax triage only; DNS/redirect safety is enforced by the Node transport."""
    if any(c.isspace() or ord(c) < 32 or ord(c) == 127 for c in url):
        return False
    try:
        p = urlparse(url)
        if p.scheme != "https" or not p.hostname or p.username or p.password:
            return False
        host = p.hostname.rstrip(".").lower()
        if "." not in host or host == "localhost" or host.endswith((".local", ".localhost", ".internal", ".onion", ".home", ".home.arpa", ".lan", ".invalid")):
            return False
        try:
            # Do not issue probe requests against IP literals from untrusted directory results.
            ipaddress.ip_address(host)
            return False
        except ValueError:
            return True
    except ValueError:
        return False


def normalize(st: dict, queries: set[str]) -> dict:
    url = pick_url(st)
    return {
        "name": str(st.get("name") or "").strip(),
        "region": region(st),
        "countrycode": str(st.get("countrycode") or "").upper(),
        "country": str(st.get("country") or ""),
        "state": str(st.get("state") or ""),
        "language": str(st.get("language") or ""),
        "tags": str(st.get("tags") or ""),
        "stationuuid": str(st.get("stationuuid") or ""),
        "stream_url": url,
        "original_url": str(st.get("url") or ""),
        "https_ready": is_public_https(url),
        "favicon": str(st.get("favicon") or "").strip(),
        "homepage": str(st.get("homepage") or "").strip(),
        "codec": str(st.get("codec") or ""),
        "bitrate": st.get("bitrate") or 0,
        "hls": bool(st.get("hls")),
        "lastcheckok": st.get("lastcheckok") in (1, True, "1"),
        "lastchecktime_iso8601": str(st.get("lastchecktime_iso8601") or ""),
        "votes": st.get("votes") or 0,
        "url_shared_by": 0,
        "radiobee_id": "",
        "radiobee_status": "not-compared",
        "discovery_queries": ", ".join(sorted(queries)),
        "probe_status": "not-tested",
        "probe_note": "",
    }


def catalog_lookup(root: Path) -> dict[str, list[tuple[str, str]]]:
    path = root / "data" / "v1"
    out: dict[str, list[tuple[str, str]]] = {}
    for file, state in (("stations.json", "stream-listed"), ("discovery-stations.json", "discovery-only")):
        p = path / file
        if not p.exists():
            continue
        try:
            records = json.loads(p.read_text(encoding="utf-8"))
            for st in records:
                for name in [st.get("name"), *(st.get("aliases") or [])]:
                    key = str(name or "").strip().casefold()
                    if key:
                        out.setdefault(key, []).append((st["id"], state))
        except (OSError, ValueError, KeyError) as exc:
            print(f"WARNING: can't compare {p}: {exc}", file=sys.stderr)
    return out


def probe(row: dict) -> tuple[str, str]:
    url = row["stream_url"]
    if not is_public_https(url):
        return "skipped", "Not public HTTPS (manual review required)"
    try:
        sample = safe_request('probe', url)
        data = base64.b64decode(sample['bytes'], validate=True)
        ct = sample['contentType'].lower()
        if not data:
            return 'empty', 'No bytes in bounded sample'
        if 'html' in ct or data.lstrip().lower().startswith((b'<!doctype html', b'<html')):
            return 'html', 'Not direct audio'
        if data.startswith((b'#EXTM3U', b'[playlist]')) or 'mpegurl' in ct:
            return 'playlist', 'Playlist only; nested resources not fetched by this probe'
        if 'audio/' in ct or data.startswith((b'ID3', b'OggS', b'fLaC')) or (len(data)>1 and data[0]==255 and data[1]&224==224):
            return 'audio-bytes', 'Bounded audio-like bytes; no decoder/identity approval'
        return 'bytes-unclassified', 'Bounded response; format unconfirmed'
    except (subprocess.SubprocessError, OSError, ValueError, KeyError):
        return 'network-error', 'Safe transport rejected or failed; no unsafe fallback'


def export(rows: list[dict], prefix: Path) -> None:
    prefix.parent.mkdir(parents=True, exist_ok=True)
    def csv_write(filename: str, data: list[dict]):
        with open(filename, "w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=CSV_FIELDS, extrasaction="ignore")
            w.writerow({key: spreadsheet_cell(key) for key in CSV_FIELDS})
            w.writerows(spreadsheet_row(row) for row in data)
    csv_write(str(prefix) + ".csv", rows)
    review = [r for r in rows if r["radiobee_status"] == "discovery-only" or any(term in r["name"].casefold() for term in REVIEW_TERMS)]
    csv_write(str(prefix) + "_priority.csv", review)
    with open(str(prefix) + ".json", "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
        f.write("\n")
    seen = set()
    with open(str(prefix) + ".m3u", "w", encoding="utf-8") as f:
        f.write("#EXTM3U\n")
        for r in rows:
            url = r["stream_url"]
            if not r["https_ready"] or url in seen:
                continue
            seen.add(url)
            clean = lambda v: str(v).replace('"', "'").replace("\n", " ").replace("\r", " ")
            f.write(f'#EXTINF:-1 tvg-logo="{clean(r["favicon"])}" group-title="{clean(r["region"])}",{clean(r["name"])}\n{url}\n')
    print(f"Exported {len(rows)} directory records, {len(review)} priority rows; files: {prefix}.csv, {prefix}_priority.csv, {prefix}.json, {prefix}.m3u")


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--out", default="radio_browser_tamil", help="Output path prefix")
    p.add_argument("--input", help="Optional saved JSON list (no Radio Browser network required)")
    p.add_argument("--language-only", action="store_true", help="Only request the exact Tamil-language endpoint")
    p.add_argument("--catalog-root", default=".", help="RadioBee data repo root for exact-name matching")
    p.add_argument("--probe", action="store_true", help="OPTIONAL short HTTP probe; never proves audible audio")
    p.add_argument("--probe-limit", type=int, default=30, help="Maximum public HTTPS candidates to probe (default 30)")
    args = p.parse_args()
    collected: dict[str, tuple[dict, set[str]]] = {}
    if args.input:
        try:
            raw = json.loads(Path(args.input).read_text(encoding="utf-8"))
            if not isinstance(raw, list):
                raise ValueError("input must be JSON list")
        except (OSError, ValueError) as exc:
            print(f"ERROR: {exc}", file=sys.stderr)
            return 1
        tasks = [("saved-input", raw)]
    else:
        requests_jobs = jobs(not args.language_only)
        tasks = []
        # Primary Tamil query is attempted first, even if supplemental queries fail.
        for name, path, params in requests_jobs[:1]:
            try:
                arr = fetch(list(HOSTS), path, params)
                tasks.append((name, arr))
                print(f"{name}: {len(arr)} records")
            except RuntimeError as exc:
                print(f"WARNING: {exc}", file=sys.stderr)
        remaining = requests_jobs[1:]
        for name, path, params in remaining:
            try:
                values = fetch(list(HOSTS), path, params)
                tasks.append((name, values))
            except RuntimeError as exc:
                print(f"WARNING: {name}: {exc}", file=sys.stderr)
    for name, arr in tasks:
        for st in arr:
            if not isinstance(st, dict) or not st.get("name") or not pick_url(st):
                continue
            if st.get("lastcheckok") not in (1, True, "1"):
                continue
            key = candidate_id(st)
            if key in collected:
                collected[key][1].add(name)
            else:
                collected[key] = (st, {name})
    if not collected:
        print("No online-flagged stations retrieved. API unavailable, no results, or stale metadata; no verification performed.", file=sys.stderr)
        return 2
    rows = [normalize(st, sources) for st, sources in collected.values()]
    lookup = catalog_lookup(Path(args.catalog_root))
    for r in rows:
        found = lookup.get(r["name"].casefold(), [])
        # Don't infer location identity from station names alone; multiple matches are ambiguous.
        if len(set(found)) == 1:
            r["radiobee_id"], r["radiobee_status"] = found[0]
        elif found:
            r["radiobee_status"] = "ambiguous-name"
        else:
            r["radiobee_status"] = "not-in-repo-by-name" if lookup else "not-compared"
    shared = Counter(r["stream_url"] for r in rows)
    for r in rows:
        r["url_shared_by"] = shared[r["stream_url"]]
    rows.sort(key=lambda r: (0 if r["radiobee_status"] == "discovery-only" else 1,
                             0 if any(term in r["name"].casefold() for term in REVIEW_TERMS) else 1,
                             0 if r["region"] == "India / Tamil Nadu or Puducherry" else 1,
                             -int(r["votes"] or 0), r["name"].casefold()))
    if args.probe:
        count = 0
        for r in rows:
            if count >= max(0, args.probe_limit):
                break
            if not r["https_ready"]:
                continue
            count += 1
            r["probe_status"], r["probe_note"] = probe(r)
            print(f"probe {count}/{args.probe_limit}: {r['name']} -> {r['probe_status']}")
    export(rows, Path(args.out))
    print("Top candidates (directory claims only; confirm by listening):")
    for r in rows[:25]:
        print(f"  {r['name'][:36]:36} {r['radiobee_status'][:15]:15} {'HTTPS' if r['https_ready'] else 'non-HTTPS':9} {r['stream_url']}")
    print("Note: favicon is untrusted directory metadata; RadioBee requires approved local PNG/WebP logoPath assets.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
