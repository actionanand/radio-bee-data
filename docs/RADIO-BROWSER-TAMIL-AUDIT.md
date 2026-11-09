# RadioBee: Finding Tamil radio stream candidates from Radio Browser

## Purpose

Find *candidate* direct audio stream URLs for Tamil Nadu, Puducherry, Kanyakumari/Nagercoil, and worldwide Tamil programmes. This is **research only**; it does not modify RadioBee's published catalogue, add Play buttons, import logos, or grant permission to listen/record/rebroadcast.

Primary API URL:

<https://de1.api.radio-browser.info/json/stations/bylanguage/tamil?hidebroken=true>

Radio Browser returns station names, `stationuuid`, `url`, `url_resolved`, `favicon`, `homepage`, `codec`, `bitrate`, `hls`, `lastcheckok`, `lastchecktime_iso8601`, country/state and language. `lastcheckok: 1` means a directory checker considered the stream reachable; it is **not** confirmation that a Chrome or Android user can play it, or that it broadcasts the station advertised.

## Use the Python collector (recommended)

From the **radio-bee-data** repository root, copy `radiobee_radio_browser_audit.py` into `scripts/`, then:

```bash
# Use WSL2 Linux Node on PATH (existing repository runtime); requests is not used.
node -p 'process.platform'  # must print linux

# Primary Tamil API plus supplementary Tamil tag, TN / Puducherry state,
# and regional/name searches. Matches exact names to ./data/v1/.
python3 scripts/radiobee_radio_browser_audit.py --out reports/radio_browser_tamil

# Only query the exact user-supplied Tamil-language endpoint
python3 scripts/radiobee_radio_browser_audit.py --language-only --out reports/radio_browser_tamil_simple

# Optional: limited HTTP checks of first 20 HTTPS leads, NOT audio decoding
python3 scripts/radiobee_radio_browser_audit.py --probe --probe-limit 20 --out reports/radio_browser_tamil_checked
```

Four files are created for each prefix:

| File | Contents |
| --- | --- |
| `.csv` | All candidate rows, including `favicon`, original/resolved URLs, codec, HLS, country/state, checked time and RadioBee match |
| `_priority.csv` | Local/station-brand and existing *discovery-only* matches to inspect first |
| `.json` | Same normalized research data for further processing |
| `.m3u` | HTTPS-only candidate playlist for VLC; one entry per unique URL, includes optional `tvg-logo` |

The script **does not discard rows whose probe fails**. A failed request may reflect geo-blocking, a user-agent requirement, an expired CDN link, or a temporarily unavailable server. Rows with non-HTTPS URLs remain in CSV, but are omitted from the HTTPS playlist since RadioBee's catalogue validator requires HTTPS stream URLs.

**Important:** When different station names share one `stream_url`, check `url_shared_by`. Do not assign the same feed to Chennai, Nagercoil, Tirunelveli or other station identities without verifying their actual programming. Directory city tags can be wrong. Likewise, a name-only match to an existing RadioBee ID is a *suggestion*, not proof of station identity.

## Quick check directly in Chrome Console (no setup function)

Try on the RadioBee site or any regular website. Chrome may block cross-origin requests, in which case use the Python collector above. Paste the **entire block**:

```javascript
(async () => {
  const url = 'https://de1.api.radio-browser.info/json/stations/bylanguage/tamil?hidebroken=true';
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API returned HTTP ${response.status}`);
    const all = await response.json();
    const targets = /suryan|hello fm|mirchi|red fm|annai|tamilosai|isai murasu|christian samy|nagercoil|kanyakumari/i;
    const rows = all
      .filter(s => targets.test(s.name || ''))
      .map(s => ({
        name: s.name,
        country: s.countrycode,
        state: s.state,
        stream: s.url_resolved || s.url,
        favicon: s.favicon,
        codec: s.codec,
        hls: !!s.hls,
        lastcheckok: s.lastcheckok,
        lastcheck: s.lastchecktime_iso8601
      }));
    console.log(`Radio Browser records: ${all.length}; targeted names: ${rows.length}`);
    console.table(rows);
  } catch (error) {
    console.error('API fetch failed (possibly CORS or server failure). Run the Python collector.', error);
  }
})();
```

## Short listening test for one candidate URL

Use Chrome Console. Replace URL, label and duration. Paste the *whole block*. It stops automatically after eight seconds of actual playback, or call `window.radioBeeAudio.pause()` manually.

```javascript
(() => {
  const url = 'https://listen.openstream.co/4428/audio';
  const label = 'Hello FM Chennai candidate';
  const seconds = 8;
  if (window.radioBeeAudio) window.radioBeeAudio.pause();
  if (window.radioBeeTimer) clearTimeout(window.radioBeeTimer);
  window.radioBeeTimer = null;
  const audio = new Audio(url);
  window.radioBeeAudio = audio;
  let started = false;
  audio.addEventListener('playing', () => {
    if (started) return;
    started = true;
    console.log(`${label}: playing`);
    window.radioBeeTimer = setTimeout(() => {
      audio.pause();
      window.radioBeeTimer = null;
      console.log(`${label}: auto-stopped`);
    }, seconds * 1000);
  });
  audio.addEventListener('error', () => console.error(`${label}: error`, audio.error));
  audio.play().catch(console.error);
})();
```

> For `.m3u8` HLS, Chrome's `new Audio()` alone may not work; use VLC or RadioBee's `hls.js`-enabled player. Receiving playlist bytes is not the same as decoding audio segments.

## What to record before promoting a station

- Exact station/programme identity heard (e.g. Chennai versus another city), source provider and date/time.
- Direct URL (`url_resolved` preferred), any redirect or expiring token, format (`mp3`, `aac`, `hls`), HTTPS and browser/Android behavior.
- Did audio decode for a few seconds? Was the same identity confirmed by station announcements? Could URL be a generic national simulcast?
- Original Radio Browser station UUID, record of its recent online check, station homepage and favicon **as provenance only**.
- Check the broadcaster's use conditions; trial listening is not permission to record or redistribute.

**RadioBee artwork restriction:** The API's `favicon` URL is *not* a valid client `logoPath` by itself. RadioBee currently accepts vetted local PNG/WebP files at `data/v1/assets/logos/stations/<slug>.png|webp` or `data/v1/assets/logos/networks/<slug>.png|webp`, with a 512-pixel and 256 KiB validation limit. Inspect the image and provenance, then import an approved local asset; never paste an arbitrary external favicon URL into the catalogue.

**Publication warning:** New direct audio candidates should be reviewed in a separate branch and PR. Do not bulk-import directory rows or reuse different city identities for the same feed. Discovery-only restoration also requires synchronizing station migration records, manifest counts, provenance and tests.
