#!/usr/bin/env python3
"""Stage 29: bounded HTML research; never publish unverified stream links."""
import concurrent.futures
import html
import json
import re
import urllib.request
from pathlib import Path

pages = json.loads(Path("docs/stage29/target-pages.json").read_text(encoding="utf-8"))
link_pattern = re.compile(r'''https?://[^\s"'<>\\]+''', re.I)
looks_audio = re.compile(r'''(?:\.(?:mp3|aac|m3u8|m3u|pls)(?:\?|/|$)|(?:/stream|/listen|icecast|shoutcast|zeno\.fm|radioca\.st|radiojar|openstream|listenon\.in|radio\.co))''', re.I)
ignore_domains = ("tamilradios.com", "google.com", "facebook.com", "twitter.com", "fonts.", "w3.org", "schema.org")

def inspect(slug):
    url = "https://www.tamilradios.com/" + slug
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
    })
    try:
        with urllib.request.urlopen(req, timeout=17) as response:
            body = response.read(1000000).decode("utf-8", "replace")
            status, final = response.status, response.url
        versions = [body, html.unescape(body), body.replace("\\/", "/")]
        urls = []
        for version in versions:
            for found in link_pattern.findall(version):
                value = html.unescape(found).replace("\\/", "/").rstrip("',;)}]")
                if looks_audio.search(value) and not any(domain in value.lower() for domain in ignore_domains) and value not in urls:
                    urls.append(value)
        context = []
        for match in list(re.finditer(r"<audio|<source|<iframe|howler|jwplayer|audio_url|stream_url|radio_url|playerSrc", body, re.I))[:8]:
            context.append(re.sub(r"\s+", " ", body[max(0, match.start()-60):match.start()+175])[:240])
        title = re.search(r"<title[^>]*>(.*?)</title>", body, re.I | re.S)
        return {"slug": slug, "page": url, "status": status, "final": final,
                "title": html.unescape(title.group(1))[:100] if title else "",
                "size": len(body), "urls": urls[:30], "context": context}
    except Exception as error:
        return {"slug": slug, "page": url, "status": "ERROR", "error": str(error)[:180], "urls": [], "context": []}

with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    result = list(pool.map(inspect, pages))
Path("docs/stage29/discovery-result.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
for row in result:
    print("STAGE29_DISCOVERY " + json.dumps({"slug": row["slug"], "status": row["status"], "title": row.get("title", ""), "urls": row["urls"][:15], "context": row["context"][:2]}, ensure_ascii=False), flush=True)
print("STAGE29_TOTAL", len(result), "FOUND_URLS", sum(bool(row["urls"]) for row in result), flush=True)
