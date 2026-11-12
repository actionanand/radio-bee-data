#!/usr/bin/env python3
"""Stage 29 metadata-only research: never add untested audio URLs to catalogue."""
import concurrent.futures, html, json, re, urllib.request, urllib.error, urllib.parse
from pathlib import Path
pages=json.loads(Path('docs/stage29/target-pages.json').read_text())
rx=re.compile(r'https?:?(?:\\?/\\?/|//)[^\s\"\'<>\\]+',re.I)
exts=re.compile(r'\\.(?:mp3|aac|m3u8|pls|m3u)(?:[?&/]|$)|(?:stream|listen|icecast|shoutcast|radioca\\.st|zeno\\.fm|radiojar|openstream|listenon\\.in|radio\\.co)',re.I)
def inspect(slug):
 url='https://www.tamilradios.com/'+slug
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36','Accept':'text/html,application/xhtml+xml'})
 try:
  with urllib.request.urlopen(req,timeout=18) as response:
   data=response.read(1300000).decode('utf-8','replace');status=response.status;final=response.url
  # raw text, HTML-escaped attributes, and JS escaped strings
  sources=[data,html.unescape(data),data.replace('\\/','/')]
  matches=[]
  for source in sources:
   for found in rx.findall(source):
    val=html.unescape(found).strip('\\"\\';,})]')
    val=val.replace('\\/','/')
    if val.startswith('http') and exts.search(val) and not any(t in val.lower() for t in ('tamilradios.com/', 'google', 'facebook', 'twitter','fonts.', 'wordpress.', 'wp-content', 'w3.org', 'schema.org')):
     if val not in matches:matches.append(val)
  context=[]
  for mat in list(re.finditer(r'<audio|<source|<iframe|howler|jwplayer|audio_url|stream_url|radio_url|playerSrc|listen\\.',data,re.I))[:12]:
   context.append(re.sub(r'\\s+',' ',data[max(0,mat.start()-75):mat.start()+200])[:270])
  return {'slug':slug,'page':url,'status':status,'size':len(data),'title':(re.search(r'<title[^>]*>(.*?)</title>',data,re.I|re.S).group(1) if re.search(r'<title[^>]*>(.*?)</title>',data,re.I|re.S) else '')[:80],'urls':matches[:25],'context':context[:7],'final':final}
 except Exception as e:return {'slug':slug,'page':url,'status':'ERROR','error':str(e)[:180],'urls':[],'context':[]}
with concurrent.futures.ThreadPoolExecutor(max_workers=9) as pool:result=list(pool.map(inspect,pages))
Path('docs/stage29/discovery-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\\n')
for x in result:
 print('STAGE29_DISCOVERY',json.dumps({'slug':x['slug'],'status':x['status'],'size':x.get('size',0),'urls':x['urls'][:12],'context':x['context'][:2]},ensure_ascii=False),flush=True)
print('STAGE29_TOTAL',len(result),'FOUND_URLS',sum(bool(x['urls']) for x in result),flush=True)
