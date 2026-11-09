# RadioBee — Quick Audio Stream Test (Chrome Console)

Use this page to **briefly test a candidate radio audio URL** before deciding whether to investigate it for the RadioBee data catalogue.

**Important:** Paste the **entire code block in Step 1**, not just a `play()` command. This test does **not** need `radioBeeProbe`, extensions, dependencies, or any earlier setup. It uses the same `new Audio(url)` technique that successfully played Hello FM Chennai.

## 1. Copy, paste, and listen (automatically stops after 8 seconds)

1. Open a web page in Chrome and press **F12 → Console**.
2. Replace `url`, `station`, and `seconds` in the code below as needed.
3. Copy and paste the **complete** block below and press **Enter**. Audio starts immediately if Chrome can play it.
4. Listen for a few seconds. The script stops automatically **8 seconds after the `playing` event** (or after the duration you choose).

```javascript
(() => {
  // EDIT THESE THREE VALUES FOR EACH TEST.
  const url = 'https://listen.openstream.co/4428/audio';
  const station = 'Hello FM Chennai';
  const seconds = 8;

  // Stop a previous test started with this script.
  if (window.radioBeeAudio) {
    window.radioBeeAudio.pause();
  }
  if (window.radioBeeStopTimer) {
    clearTimeout(window.radioBeeStopTimer);
  }

  // Standard browser Audio: same approach as the proven Hello FM test.
  const audio = new Audio(url);
  window.radioBeeAudio = audio;
  let started = false;

  audio.addEventListener('playing', () => {
    if (started) return;
    started = true;
    console.log(`[RadioBee] PLAYING: ${station}`, url);
    window.radioBeeStopTimer = setTimeout(() => {
      audio.pause();
      console.log(`[RadioBee] AUTO-STOP after ${seconds}s: ${station}`);
    }, seconds * 1000);
  });

  audio.addEventListener('error', () => {
    console.error(`[RadioBee] AUDIO ERROR: ${station}`, audio.error);
  });

  audio.play().catch(error => {
    console.error(`[RadioBee] COULD NOT START: ${station}`, error);
  });
})();
```

**Expected success:** Chrome logs `[RadioBee] PLAYING: Hello FM Chennai` and you hear audio, followed by `[RadioBee] AUTO-STOP after 8s`. Hearing even a short burst of sound is useful for a **technical trial**. It does *not* by itself prove the stream belongs to the intended station.

## 2. Stop immediately (copy this one line)

At any time after running Step 1, paste:

```javascript
window.radioBeeAudio.pause(); clearTimeout(window.radioBeeStopTimer);
```

**If you are stopping the earlier original example** that used `const audio = new Audio(...)`, instead run:

```javascript
audio.pause();
```

The two snippets use different variable names. You do **not** need to enter `radioBeeProbe.stop()`.

## 3. Test another URL

Run the *whole Step 1 block again* with new values, for example:

```javascript
const url = 'https://example.org/live.mp3';
const station = 'Station under test';
const seconds = 5;
```

Those three lines are **values to replace inside Step 1**, not a standalone playback test. No reload is needed; the previous player is paused when Step 1 is executed again.

### Quick one-off version (manually stop)

If you want the absolute simplest test, paste this entire block instead:

```javascript
const audio = new Audio('https://listen.openstream.co/4428/audio');

audio.addEventListener('playing', () =>
  console.log('Hello FM candidate: playing')
);

audio.addEventListener('error', () =>
  console.error('Playback error:', audio.error)
);

audio.play().catch(console.error);
```

Then paste `audio.pause();` to stop. This is the **exact approach previously confirmed working**. If `const audio` was already declared in the same Console session, refresh the page before pasting this version again, or use Step 1, which avoids redeclaration errors.

## 4. `.m3u`, `.m3u8`, MP3 and AAC — what to test

| Link format | Testing method | Notes |
| --- | --- | --- |
| `.mp3`, `.aac`, extensionless `/audio`, `/stream`, `/live` | Paste the URL into Step 1 | A URL's extension alone does not guarantee its content type. |
| `.m3u` playlist | Open/download the text playlist, locate its real HTTP(S) stream URL, then test that URL using Step 1 | `.m3u` is usually a *list of URLs*, not the audio itself. |
| `.pls` playlist | Open the text playlist, locate `File1=...`, and test that URL using Step 1 | It may contain multiple alternatives. |
| `.m3u8` HLS playlist | Test in VLC or in RadioBee's HLS.js-enabled player | Chrome's plain `new Audio()` may not support HLS even if the stream is valid. Safari and some other browsers support native HLS. |

**Optional playlist inspection**, when the source allows cross-origin fetching:

```javascript
fetch('https://example.org/station.m3u')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  })
  .then(text => console.log(text))
  .catch(error => console.error('Could not read playlist:', error));
```

If this reports a CORS error, it **does not prove the playlist is dead**. Open the playlist in a new tab, use VLC (Media → Open Network Stream), or download it and inspect the text locally. Do not bypass authentication, DRM, or other access restrictions.

## 5. How to record results

For each trial, capture:

| Field | Example |
| --- | --- |
| Station believed to be playing | Hello FM Chennai 106.4 |
| Candidate stream URL | `https://listen.openstream.co/4428/audio` |
| Date and test environment | YYYY-MM-DD, Chrome on Windows |
| Result | `playing`, `error`, `blocked`, `no audio`, or `not tested` |
| Heard for | 3–8 seconds (or longer if you choose) |
| Station identity | Heard station ID/jingle; unconfirmed if not heard |
| Follow-up | Keep as unverified trial candidate, investigate, or reject |

**Interpretation:** `playing` means the HTML audio element began playing. Confirm that you actually hear sound and that its content matches the expected broadcaster. A 3–8-second play-and-stop test is sufficient for initial *playback triage*, not for proof of long-term availability, station identity, or permission to redistribute/record the feed.

## Troubleshooting

- **`radioBeeProbe is not defined`** — This guide no longer uses `radioBeeProbe`. Paste the complete Step 1 block.
- **`Cannot read properties of undefined (reading 'play')`** — Don't run a method against an uninitialized object. Paste the complete Step 1 block.
- **`NotAllowedError`** — Chrome may require a user interaction; click the page and run Step 1 again.
- **`AUDIO ERROR` or `COULD NOT START`** — The endpoint may be down, unsupported, blocked by policy, or returning something other than audio. Check Chrome's Network tab.
- **No audible sound despite `playing`** — Check output volume, sound device, muted tab, and whether the stream is silent. Do not classify the station identity as confirmed.
- **HLS `.m3u8` fails here** — Use VLC or RadioBee's HLS.js playback path; this Console test is intentionally dependency-free.

**Repository location:** `radio-bee-data/docs/RadioBee_Stream_Test_Guide.md`
