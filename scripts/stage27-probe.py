#!/usr/bin/env python3
"""Non-publishing, bounded audio-decode checks for artist-focused online radio."""
import concurrent.futures, json, subprocess
from pathlib import Path
rows=json.loads(Path("docs/stage27/artist-candidates.json").read_text())
def check(item):
 cmd=["ffmpeg","-hide_banner","-nostdin","-loglevel","error","-rw_timeout","10000000","-i",item["url"],"-t","6","-vn","-f","null","-"]
 try:
  p=subprocess.run(cmd,text=True,capture_output=True,timeout=27)
  return {**item,"result":"PASS" if p.returncode==0 else "FAIL","error":p.stderr[-250:]}
 except (subprocess.TimeoutExpired, OSError) as e:
  return {**item,"result":"TIMEOUT_OR_ERROR","error":str(e)[:250]}
with concurrent.futures.ThreadPoolExecutor(max_workers=7) as pool:
 results=list(pool.map(check,rows))
for row in results:print("STAGE27_PROBE "+json.dumps(row,ensure_ascii=False),flush=True)
print("STAGE27_TOTAL",len(results),"PASS",sum(r["result"]=="PASS" for r in results),flush=True)
