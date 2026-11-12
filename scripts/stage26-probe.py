#!/usr/bin/env python3
"""Read-only bounded FFmpeg diagnostics; do not publish these candidates automatically."""
import concurrent.futures, json, subprocess
from pathlib import Path

candidates = json.loads(Path("docs/stage26/candidates.json").read_text())
def check(item):
    cmd = ["ffmpeg", "-hide_banner", "-nostdin", "-loglevel", "error", "-rw_timeout", "10000000", "-i", item["url"], "-t", "6", "-vn", "-f", "null", "-"]
    try:
        p = subprocess.run(cmd, text=True, capture_output=True, timeout=27)
        return {"name": item["name"], "language": item["language"], "country": item["country"], "url": item["url"], "result": "PASS" if p.returncode == 0 else "FAIL", "error": p.stderr[-220:]}
    except subprocess.TimeoutExpired:
        return {"name": item["name"], "language": item["language"], "country": item["country"], "url": item["url"], "result": "TIMEOUT", "error": "27s timeout"}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
    results = list(executor.map(check, candidates))
for row in results:
    print("STAGE26_PROBE "+json.dumps(row, ensure_ascii=False), flush=True)
print(f"STAGE26_TOTAL {len(results)} PASS {sum(r['result']=='PASS' for r in results)}", flush=True)
