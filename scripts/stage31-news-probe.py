#!/usr/bin/env python3
"""Research only. Decode each candidate audio and inspect HLS audio/video codecs."""
import concurrent.futures
import json
import subprocess
from pathlib import Path
rows=json.loads(Path("docs/stage31/news-candidates.json").read_text(encoding="utf-8"))
def probe(row):
    result={**row}
    try:
        p=subprocess.run(["ffprobe","-v","error","-rw_timeout","10000000","-show_entries","stream=codec_name,codec_type","-of","json",row["url"]],capture_output=True,text=True,timeout=27)
        result["tracks"]=json.loads(p.stdout).get("streams",[]) if p.returncode==0 else []
        d=subprocess.run(["ffmpeg","-hide_banner","-nostdin","-loglevel","error","-rw_timeout","10000000","-i",row["url"],"-t","6","-map","0:a:0","-vn","-f","null","-"],capture_output=True,text=True,timeout=33)
        result["result"]="PASS" if d.returncode==0 and any(x.get("codec_type")=="audio" for x in result["tracks"]) else "FAIL"
        result["error"]=d.stderr[-250:]
    except (OSError, ValueError, subprocess.TimeoutExpired) as e:
        result["result"]="ERROR"
        result["tracks"]=[]
        result["error"]=str(e)[:210]
    return result
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
    output=list(pool.map(probe,rows))
for row in output:
    print("STAGE31_NEWS "+json.dumps({"name":row["name"],"language":row["language"],"url":row["url"],"result":row["result"],"tracks":row.get("tracks",[]),"error":row.get("error","")},ensure_ascii=False),flush=True)
print("STAGE31_TOTAL",len(output),"PASS",sum(x["result"]=="PASS" for x in output),flush=True)
