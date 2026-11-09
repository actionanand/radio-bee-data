#!/usr/bin/env python3
"""Decode-check every Radio Browser candidate from an existing RadioBee CSV.

Research-only. Does not modify the RadioBee published catalogue.
Requires Linux Node and explicit --reviewed-bounded-samples. Network resources
are fetched by safe-https.mjs; FFmpeg receives only bounded in-memory samples.
No direct-URL FFmpeg mode is available. Use OS isolation for additional decoder
containment; this is not a claim that protocol whitelists sandbox native code.
"""
import argparse
import csv
import ipaddress
import re
import shutil
import subprocess
import os
import tempfile
from collections import Counter
from research_safety import safe_request, spreadsheet_row, spreadsheet_cell
from pathlib import Path
from urllib.parse import urlsplit


def safe_https(url):
    """Syntax triage only; never used as proof of SSRF safety."""
    if any(c.isspace() or ord(c) < 32 or ord(c) == 127 for c in url):
        return False
    try:
        p = urlsplit(url)
        if p.scheme != 'https' or not p.hostname or p.username or p.password:
            return False
        host = p.hostname.rstrip('.').lower()
        if '.' not in host or host.endswith(('.local', '.localhost', '.internal', '.lan', '.onion', '.home', '.invalid')):
            return False
        try:
            ipaddress.ip_address(host)
            return False  # Untrusted directory URLs: reject IP literals.
        except ValueError:
            return True
    except ValueError:
        return False


def decode_seconds(stdout):
    # FFmpeg 4.x emits 'out_time_ms' measured in microseconds.
    vals = [int(v) for v in re.findall(r'^out_time_ms=(\d+)\s*$', stdout, re.M)]
    if vals:
        return max(vals) / 1_000_000
    # Compatibility fallback for FFmpeg versions using clock timestamps.
    vals = re.findall(r'^out_time=(\d+):(\d+):(\d+(?:\.\d+)?)\s*$', stdout, re.M)
    return max((int(h)*3600 + int(m)*60 + float(s) for h,m,s in vals), default=0.0)


def test_one(row, seconds, timeout, reviewed=False):
    result = dict(row)
    result.update(ffmpeg_status='blocked-review-required', decoded_seconds='0.00',
                  ffmpeg_note='No network decoding without --reviewed-bounded-samples; direct URL FFmpeg is disabled')
    if not reviewed:
        return result
    if seconds != 2:
        raise ValueError('Reviewed workflow decodes at most a fixed two-second sample')
    if not safe_https((row.get('stream_url') or '').strip()):
        result.update(ffmpeg_status='skipped-not-public-https', ffmpeg_note='Syntax rejected; syntax acceptance alone never authorizes network access')
        return result
    try:
        sample = safe_request('decode', row['stream_url'], timeout=timeout)
        result.update(ffmpeg_status=sample['status'], decoded_seconds=f"{sample['seconds']:.2f}",
                      ffmpeg_note=sample['note'])
    except (subprocess.SubprocessError, OSError, ValueError, KeyError):
        result.update(ffmpeg_status='safe-workflow-error', ffmpeg_note='Bounded workflow failed; no direct URL fallback')
    return result


def write_report(path, fields, results, overwrite=False):
    """Publish a complete same-directory temporary file; never open destination w.

    A hard link gives atomic no-clobber publication when overwrite is forbidden.
    Explicit replacements use os.replace; unsupported filesystems fail closed.
    """
    path = Path(path)
    if not results:
        raise ValueError('Refusing to publish an empty audit')
    if os.path.lexists(path) and not overwrite:
        raise FileExistsError(f'Report exists: {path}; use --overwrite explicitly')
    if overwrite and any(row.get('ffmpeg_status') not in ('decoded', 'short-audio') for row in results):
        raise ValueError('Refusing replacement after failed, rejected or incomplete decoding; use a new output path without --overwrite for diagnostics')
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode='w', newline='', encoding='utf-8',
                                         dir=path.parent, prefix='.'+path.name+'.',
                                         suffix='.tmp', delete=False) as file:
            temporary = Path(file.name)
            writer = csv.DictWriter(file, fieldnames=fields)
            writer.writerow({key: spreadsheet_cell(key) for key in fields})
            writer.writerows(spreadsheet_row(row) for row in results)
            file.flush()
            os.fsync(file.fileno())
        if overwrite:
            os.replace(temporary, path)
        else:
            os.link(temporary, path)  # Atomic create-if-absent, including races.
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--input', default='reports/radio_browser_tamil.csv')
    p.add_argument('--output', default='reports/radio_browser_tamil_bounded.csv')
    p.add_argument('--overwrite', action='store_true', help='Explicitly replace an existing report, only after successful complete decoding')
    p.add_argument('--seconds', type=int, default=2)
    p.add_argument('--timeout', type=int, default=45)
    p.add_argument('--workers', type=int, default=1)
    p.add_argument('--limit', type=int, default=0, help='0 = all rows; 20 = test first 20 rows')
    p.add_argument('--reviewed-bounded-samples', action='store_true', help='Opt in to safe transport + bounded memory samples, never FFmpeg URL inputs')
    args = p.parse_args()
    if not args.reviewed_bounded_samples:
        p.error('Direct URL FFmpeg audits are disabled. Review the bounded-sample workflow and explicitly pass --reviewed-bounded-samples; no output was written.')
    if args.reviewed_bounded_samples and not shutil.which('ffmpeg'):
        p.error('FFmpeg not found (sudo apt install ffmpeg)')
    if args.seconds != 2 or not 5 <= args.timeout <= 45 or args.workers != 1 or args.limit < 0:
        p.error('Reviewed samples: seconds=2, timeout 5..45, workers=1, limit >=0')
    path = Path(args.output)
    if path.resolve() == Path(args.input).resolve():
        p.error('Input and output must be different files')
    if os.path.lexists(path) and not args.overwrite:
        p.error('Output already exists; choose a new path or explicitly pass --overwrite. No requests made.')
    with open(args.input, newline='', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    if not rows or 'stream_url' not in rows[0]:
        p.error('Input CSV is empty or missing stream_url column')
    # Preserve every directory record in the result (including unsafe/untested URLs).
    chosen = rows if args.limit == 0 else rows[:args.limit]
    results = [test_one(row, args.seconds, args.timeout, args.reviewed_bounded_samples) for row in chosen]
    fields = list(dict.fromkeys([*rows[0].keys(), 'ffmpeg_status', 'decoded_seconds', 'ffmpeg_note']))
    write_report(path, fields, results, overwrite=args.overwrite)
    print('\n' + str(dict(Counter(row['ffmpeg_status'] for row in results))))
    print('Report:', path)
    print('Decoded means audio bytes decoded for a short period; it does NOT confirm the named station or rights.')


if __name__ == '__main__':
    main()
