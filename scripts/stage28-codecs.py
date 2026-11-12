#!/usr/bin/env python3
import concurrent.futures, json, subprocess
from pathlib import Path
rows=json.loads(Path('docs/stage28/codec-candidates.json').read_text())
def inspect(item):
 cmd=['ffprobe','-v','error','-rw_timeout','9000000','-show_entries','stream=codec_name,codec_type','-of','json',item['url']]
 try:
  p=subprocess.run(cmd,capture_output=True,text=True,timeout=23)
  dat=json.loads(p.stdout) if p.returncode==0 else {}
  codecs=[x['codec_name'] for x in dat.get('streams',[]) if x.get('codec_type')=='audio']
  return {'id':item['id'],'url':item['url'],'codec':codecs,'result':'PASS' if codecs else 'FAIL','error':p.stderr[-170:]}
 except (OSError,subprocess.TimeoutExpired,ValueError) as e:return {'id':item['id'],'url':item['url'],'codec':[],'result':'ERROR','error':str(e)[:200]}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
 result=list(pool.map(inspect,rows))
for r in result:print('STAGE28_CODEC '+json.dumps(r),flush=True)
print('STAGE28_TOTAL',len(result),'DETECTED',sum(bool(r['codec']) for r in result),flush=True)
