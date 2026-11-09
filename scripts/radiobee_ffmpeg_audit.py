#!/usr/bin/env python3
"""Decode-check every Radio Browser candidate from an existing RadioBee CSV.

Research-only. Does not modify the RadioBee published catalogue.
Uses Python stdlib + locally installed FFmpeg 4.4+.
"""
import argparse
import csv
import ipaddress
import re
import shutil
import subprocess
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlsplit


def safe_https(url):
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


def test_one(row, seconds, timeout):
    result = dict(row)
    url = (result.get('stream_url') or '').strip()
    result.update(ffmpeg_status='', decoded_seconds='0.00', ffmpeg_note='')
    if not safe_https(url):
        result.update(ffmpeg_status='skipped-not-public-https', ffmpeg_note='Not tested (HTTP, IP address, or unsafe/missing host)')
        return result
    cmd = ['ffmpeg', '-nostdin', '-hide_banner', '-loglevel', 'error',
           '-rw_timeout', '12000000', '-i', url, '-map', '0:a:0', '-vn',
           '-t', str(seconds), '-f', 'null', '-', '-progress', 'pipe:1', '-nostats']
    try:
        p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                           text=True, errors='replace', timeout=timeout, check=False)
        duration = decode_seconds(p.stdout)
        result['decoded_seconds'] = f'{duration:.2f}'
        details = (p.stderr or '').strip().replace('\n', ' | ')[:300]
        if p.returncode and duration < 1:
            result['ffmpeg_status'] = 'failed'
        elif p.returncode:
            result['ffmpeg_status'] = 'partial-error'
        elif duration >= 2:
            result['ffmpeg_status'] = 'decoded'
        elif duration > 0:
            result['ffmpeg_status'] = 'short-audio'
        else:
            result['ffmpeg_status'] = 'no-audio-confirmed'
        result['ffmpeg_note'] = details or f'Exit {p.returncode}; decoding is not station identity confirmation'
    except subprocess.TimeoutExpired:
        result.update(ffmpeg_status='timeout', ffmpeg_note=f'Exceeded {timeout}s total')
    except OSError as exc:
        result.update(ffmpeg_status='tool-error', ffmpeg_note=str(exc)[:300])
    return result


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--input', default='reports/radio_browser_tamil.csv')
    p.add_argument('--output', default='reports/radio_browser_tamil_ffmpeg.csv')
    p.add_argument('--seconds', type=int, default=5)
    p.add_argument('--timeout', type=int, default=30)
    p.add_argument('--workers', type=int, default=4)
    p.add_argument('--limit', type=int, default=0, help='0 = all rows; 20 = test first 20 rows')
    args = p.parse_args()
    if not shutil.which('ffmpeg'):
        p.error('FFmpeg not found (sudo apt install ffmpeg)')
    if not 1 <= args.seconds <= 30 or not 5 <= args.timeout <= 120 or not 1 <= args.workers <= 8 or args.limit < 0:
        p.error('Seconds 1..30, timeout 5..120, workers 1..8, limit >=0')
    with open(args.input, newline='', encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    if not rows or 'stream_url' not in rows[0]:
        p.error('Input CSV is empty or missing stream_url column')
    # Preserve every directory record in the result (including unsafe/untested URLs).
    chosen = rows if args.limit == 0 else rows[:args.limit]
    results = [None] * len(chosen)
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        tasks = {executor.submit(test_one, row, args.seconds, args.timeout): i for i, row in enumerate(chosen)}
        complete = 0
        for task in as_completed(tasks):
            i = tasks[task]
            results[i] = task.result()
            complete += 1
            row = results[i]
            print(f"[{complete}/{len(chosen)}] {row.get('name','')[:32]:32} {row['ffmpeg_status']:24} {row['decoded_seconds']}s", flush=True)
    fields = list(dict.fromkeys([*rows[0].keys(), 'ffmpeg_status', 'decoded_seconds', 'ffmpeg_note']))
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(results)
    print('\n' + str(dict(Counter(row['ffmpeg_status'] for row in results))))
    print('Report:', path)
    print('Decoded means audio bytes decoded for a short period; it does NOT confirm the named station or rights.')


if __name__ == '__main__':
    main()
