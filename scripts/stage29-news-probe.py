#!/usr/bin/env python3
import json,subprocess,concurrent.futures
from pathlib import Path
items=json.loads(Path("docs/stage29/news-video-candidates.json").read_text())
def check(item):
 url=item["url"]
 result={**item}
 try:
  cmd=["ffprobe","-v","error","-rw_timeout","12000000","-show_entries","stream=codec_name,codec_type","-of","json",url]
  p=subprocess.run(cmd,capture_output=True,text=True,timeout=26)
  result["codecs"]=[{k:v.get(k) for k in ("codec_name","codec_type")} for v in json.loads(p.stdout).get("streams",[])] if p.returncode==0 else []
  command=["ffmpeg","-hide_banner","-nostdin","-loglevel","error","-rw_timeout","12000000","-i",url,"-t","6","-map","0:a:0","-vn","-f","null","-"]
  d=subprocess.run(command,capture_output=True,text=True,timeout=36)
  result["audio_result"]="PASS" if d.returncode==0 else "FAIL"
  result["error"]=d.stderr[-270:]
 except (ValueError,OSError,subprocess.TimeoutExpired) as error:result["audio_result"]="ERROR";result["error"]=str(error)[:270]
 return result
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(check,items))
for x in results:print("STAGE29_NEWS "+json.dumps(x,ensure_ascii=False),flush=True)
print("STAGE29_NEWS_TOTAL",len(results),"PASS",sum(x["audio_result"]=="PASS" for x in results),flush=True)
