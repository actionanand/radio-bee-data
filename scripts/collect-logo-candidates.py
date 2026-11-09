"""Review-only favicon collector. No catalogue writes or automatic artwork approval.

Run with Linux Python from repository root. Network access is opt-in and uses
the repository's DNS-pinned HTTPS transport, not urllib/requests redirects.
"""
import argparse
import csv
import hashlib
import json
from pathlib import Path
import subprocess
from research_safety import spreadsheet_row
from urllib.parse import urlsplit


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', default='reports/radio_browser_tamil.csv')
    parser.add_argument('--output', default='reports/logo-review')
    parser.add_argument('--collect', action='store_true')
    parser.add_argument('--limit', type=int, default=8)
    args = parser.parse_args()
    if not 0 <= args.limit <= 20:
        parser.error('limit must be 0..20')
    out = Path(args.output).resolve()
    review_root = Path('reports').resolve()
    if not out.is_relative_to(review_root):
        parser.error('output must remain inside ignored reports/')
    networks = {n['id']: n for n in json.loads(Path('data/v1/networks.json').read_text())}
    stations = {s['id']: s for name in ['stations', 'discovery-stations']
                for s in json.loads(Path(f'data/v1/{name}.json').read_text())}
    rows, seen = [], set()
    with open(args.input, encoding='utf-8-sig', newline='') as file:
        for row in csv.DictReader(file):
            station = stations.get(row.get('radiobee_id', ''))
            if not station or row['countrycode'] != station['countryCode']:
                continue  # Never map by brand name alone, e.g. Canadian RED FM.
            url = row.get('favicon', '').strip()
            parsed = urlsplit(url)
            if parsed.scheme != 'https' or parsed.query or parsed.fragment or parsed.username or parsed.password:
                continue
            key = (station['networkId'], url)
            if key in seen:
                continue
            seen.add(key)
            official = urlsplit(networks[key[0]].get('website') or '').hostname
            host = parsed.hostname
            associated = bool(official and host and
                              host.removeprefix('www.') == official.removeprefix('www.'))
            rows.append(dict(network_id=key[0], source_url=url,
                             station_uuid=row['stationuuid'],
                             identity_confidence='publisher-domain; image-unconfirmed' if associated else 'directory-only; image-unconfirmed',
                             usage_status='unconfirmed; do-not-publish', local_file='',
                             collection_status='not-collected'))
    rows.sort(key=lambda r: ('publisher-domain' not in r['identity_confidence'], r['network_id'], r['source_url']))
    out.mkdir(parents=True, exist_ok=True)
    for row in rows[:args.limit] if args.collect else []:
        try:
            result = subprocess.run(['node', 'scripts/fetch-logo-candidate.mjs', row['source_url']],
                                    capture_output=True, timeout=15, check=True)
            data = result.stdout
            # Retain originals for review, never normalize or execute SVG content.
            suffix = '.png' if data.startswith(b'\x89PNG\r\n\x1a\n') else '.jpg' if data.startswith(b'\xff\xd8\xff') else '.webp' if data[:4] == b'RIFF' and data[8:12] == b'WEBP' else None
            if not suffix:
                raise ValueError('unsupported image signature; no file saved')
            name = row['network_id'] + '-' + hashlib.sha256(data).hexdigest()[:16] + suffix
            (out / name).write_bytes(data)
            row.update(local_file=name, collection_status='downloaded-for-review; not-approved')
        except (subprocess.SubprocessError, ValueError) as error:
            row['collection_status'] = type(error).__name__ + '; not-approved'
    with (out / 'manifest.csv').open('w', encoding='utf-8', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=['network_id', 'source_url', 'station_uuid', 'identity_confidence', 'usage_status', 'local_file', 'collection_status'])
        writer.writeheader()
        writer.writerows(spreadsheet_row(row) for row in rows)
    print(json.dumps({'candidates': len(rows), 'downloaded': sum(bool(r['local_file']) for r in rows), 'approved': 0}))


if __name__ == '__main__':
    main()
