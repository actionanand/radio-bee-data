#!/usr/bin/env python3
"""Bounded diagnostics on direct HTTPS candidate audio sources. Does not publish."""
import concurrent.futures, json, subprocess
from pathlib import Path
rows = json.loads(Path("docs/stage29/audio-candidates.json").read_text(encoding="utf-8"))
def check(row):
    url = row["url"]
    cmd = ["ffmpeg", "-hide_banner", "-nostdin", "-loglevel", "error",
           "-rw_timeout", "12000000", "-i", url, "-t", "7", "-vn", "-f", "null", "-"]
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=32)
        if proc.returncode:
            return {**row, "result":"FAIL", "error":proc.stderr[-220:]}
        probe = subprocess.run(["ffprobe","-v","error","-rw_timeout","12000000","-show_entries",
                                "stream=codec_name,codec_type","-of","json",url],
                               capture_output=True,text=True,timeout=25)
        info = json.loads(probe.stdout) if probe.returncode == 0 else {}
        codecs=[s.get("codec_name") for s in info.get("streams",[]) if s.get("codec_type")=="audio"]
        videos=[s.get("codec_name") for s in info.get("streams",[]) if s.get("codec_type")=="video"]
        if videos:
            return {**row,"result":"VIDEO","codecs":codecs,"video":videos}
        return {**row, "result":"PASS" if codecs else "NO_CODEC", "codecs":codecs}
    except (subprocess.TimeoutExpired,OSError,ValueError) as error:
        return {**row, "result":"TIMEOUT", "error":str(error)[:180]}
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
    result=list(pool.map(check,rows))
Path("docs/stage29/audio-probe-results.json").write_text(json.dumps(result,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
for row in result:
    print("STAGE29_AUDIO "+json.dumps({k:row.get(k) for k in ("slug","name","url","result","codecs","video","error") if k in row},ensure_ascii=False),flush=True)
print("STAGE29_PROBE_TOTAL",len(result),"PASS",sum(x["result"]=="PASS" for x in result),flush=True)
