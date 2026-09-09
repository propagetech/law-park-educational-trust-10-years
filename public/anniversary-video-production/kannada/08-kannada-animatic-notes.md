# 08 · ಪ್ರಾಥಮಿಕ ಚಿತ್ರ · The Kannada Animatic

**[`08-kannada-animatic-preview.mp4`](08-kannada-animatic-preview.mp4)**
1920x1080 · 25 fps · H.264 · **00:05:03:21** · 7,596 frames · AAC mono 48 kHz · -16.0 LUFS · true peak -3.0 dBTP · 105 MB

The whole film, cut to picture, from the real repository photographs and the real Kannada script, **with a scratch Kannada narration so you can hear it.**

---

## 1 · What this is, and what it is not

**It is:** every one of the 46 shots in [`03`](03-kannada-storyboard.md), at the exact durations in [`06`](06-kannada-edit-decision-list.md), with every crop, push, dissolve, card, lower third and year card built as specified; the Kannada subtitles from [`05`](05-kannada-subtitles.srt) burned in; and a **scratch narration** reading the approved script in Kannada.

**It is not the master, on three counts.**

| Missing | Why | What it means for you |
|---|---|---|
| **The real voice** | The narration you hear is **Soumya (kn_IN), the macOS system Kannada voice.** It is a temp track. No voice is cast; [`02`](02-kannada-voice-audition-plan.md) is the audition instrument and nothing has been auditioned | Judge **pacing, sync and whether the pauses land.** Do not judge warmth, weight or performance: a system TTS voice has none, and `02` section 1 argues for a human narrator on exactly those grounds |
| **Music** | No licence exists, and `14` item 5.1 is BLOCKING | The three cues that carry the film (`K06` in silence, the drop-out under ಪೂರ್ತಿ ಅಲ್ಲ., `K43` refusing to climax) cannot be judged from this file. The narration sits alone |
| **Grade** | One pass on the shared visual master, after picture lock | Exposure and white balance still jump between 2016 and 2025. `06` section 8 |

**Nothing in it is cleared for release.** Every consent gate in [`07`](07-final-rights-and-approval-checklist.md) still stands, and the scratch voice has no release either. This is an internal review file.

> **The scratch track is not the narration and must not become it.** `14` item 5.5 requires a signed narrator release, `14` item 7.1 requires a native Kannada speaker to read the script aloud, and `02` section 7 requires trustee approval of a voice sample before the full script is recorded. None of that is satisfied by a system voice. When the real narration arrives, drop the stem in; **the picture does not move.**

## 2 · What the audio proved: the timing model was wrong

This is the most useful thing the render produced, and it changed the film.

The original timing gave each line **words / 105 × 60** seconds. Asking one voice to hit those allocations exposed it immediately: to stay in sync it needed rates from **74 to 322**: sprinting some lines, crawling through others. Nineteen lines overran their whole shot.

The cause is that **word count is a poor proxy for duration in Kannada.** `ವಿದ್ಯಾರ್ಥಿವೇತನ` is one word and six syllables; a five-word line can take longer to say than a twelve-word one. Measured across all 43 narration lines:

| Predictor | Mean error | Lines more than 20% out |
|---|---|---|
| Words | 16.0% | 13 of 43 |
| Syllables (approx) | 11.9% | 8 of 43 |
| **Display clusters** | **9.2%** | **3 of 43** |

So the film is now timed on **display clusters**, with the total still set by the brief's pace. Then a second correction: digits are written in one character and spoken in several. `2016` is four characters and `ಎರಡು ಸಾವಿರದ ಹದಿನಾರು`, thirteen clusters, in the mouth, because `09` section 3.4 has years spoken as Kannada number words. Weighting each digit at 3.25 clusters fixed the eight year lines, which had been the worst-fitting in the film.

| Model | Rate range the voice needed | Worst-fitting line |
|---|---|---|
| Words | 74 to 322 | 7.4% out |
| Clusters | 150 to 265 | 6.9% out |
| **Clusters + digit weighting** | **146 to 239** | **3.8% out** |

**What changed in the film:** the total is identical, 00:05:03:21, and the overall pace is still 105 wpm. Only the share-out between lines moved, and only 5 shots by more than a second. `K37` gained 1.0 s, `K18` 1.0 s, `K36` 1.0 s, `K14` 1.0 s; `K42`, `K29` and `K35` gave time back. Every timecode in `01`, `03`, `04`, `05` and `06` was re-derived, not hand-edited.

**What it means for the human recording session:** the per-line allocations in `01` are now realistic, so the narrator can read at one steady pace and stay in sync. Under the old model they could not have.

## 3 · How the Kannada was rendered, and why it matters

Kannada needs complex-script shaping: conjuncts join and vowel signs reorder around their base consonant. A renderer without shaping produces text that looks almost right and is wrong, and it fails silently. That is the exact failure `14` item 7.8 warns about.

On this machine:

- **ffmpeg 8.1.2 has no `drawtext` and no `libass`.** It cannot draw text here at all, only encode.
- **Pillow 11.2.1 has no Raqm** (`features.check('raqm')` is `False`). Asking PIL to draw Kannada would have broken every conjunct in the film without raising an error.

So **all Kannada is rendered by headless Chrome**, which shapes through HarfBuzz, screenshotted to RGBA PNGs, and composited by PIL. PIL never draws a Kannada glyph. **Do not move Kannada text rendering into PIL or ffmpeg**, on this machine or any other, without checking for shaping support first.

**One substitution to approve.** The spec calls for **Noto Serif Kannada 700** on display titles. It is not installed here; **Noto Sans Kannada 700** is, and it is the fallback `07` section 9 itself nominates. Playfair Display *is* installed, so every Latin numeral is on-spec. Install the serif and re-render the cards before the graded master; the layouts will not move.

## 4 · Six things the build changed

Defects that reading the documents did not surface. All six are corrected in `01`, `03`, `04` and `06`.

1. **The timing model.** Section 2 above. The largest of the six.
2. **`K15` was a three-image chain ending on `A160`, and `K16` is also `A160`.** The same photograph would have run continuously across the `K15`/`K16` cut and read as a duplicate. The chain is now two images.
3. **Every lower third collided with its own subtitle.** At the specified 96 px from frame bottom, the founder's name, four year cards and three gratitude cards were all crossed by the caption band. Lower thirds now sit at 250 px. `04` section 2b.
4. **The title card cross-dissolved into the quote card**, laying two blocks of Kannada over each other for a full second. Card-to-card now dips through the shared navy: the outgoing text fades to ground, then the incoming text fades up.
5. **`K31` and `K32` had their labels as full-width lower thirds**, crossing the photograph they were labelling. They are now the stacked right-hand panels the storyboard actually specified.
6. **The logo would not load.** Set from a string, the page has an `about:blank` origin and a `file://` image is blocked, so it rendered as a broken-image icon. Inlined as a data URI.

## 5 · What was verified on this render

| Check | Result |
|---|---|
| Duration against the timeline | 7,596 frames, 303.84 s. **Exact match** |
| Audio length against picture | 303.84 s. **Exact match**, no drift, no tail |
| **Every designed silence is silent** | `K01`, `K06` and `K46` measured in their real windows: **-99 dB rms**, all three |
| **Every marked pause and hold falls quiet** | All 14 of them measured at their shot tails: **-99 dB rms**, all 14 |
| Narration present where it should be | `K02`, `K07`, `K12`, `K27`, `K34` all measured at -15 to -16 dB rms |
| Loudness | **-16.0 LUFS integrated, true peak -3.0 dBTP.** On spec for the online master, `14` item 8.7 |
| Kannada shaping on every card | Inspected at full resolution. ಸಂಭ್ರಮ, ಗ್ರಂಥಾಲಯ, ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು, ವಿದ್ಯಾರ್ಥಿವೇತನ, ಜ್ಞಾನಕುಟೀರ all correct. **No tofu, no broken conjuncts, no dropped vowel signs** |
| Kannada never letterspaced, uppercased, or below 44 px | Enforced in `tools/gfx.py` |
| No cut shorter than 4 frames | Shortest shot `K24` is 71 frames |
| `K34` carries no photograph, no face, no child illustration, and no text while the line runs | Navy field, one gold rule. **Verified in the render** |
| `K26` shows the hands-and-form crop only, no face | Verified |
| No UPI ID, no payment QR, no bank detail in any frame | Verified |
| No commercial mark in any frame | Verified. `A188`, `A200`, `A202`, `A166` are not in the build, and `A230` is cropped past its banner |
| No cumulative student, village or district total, spoken or on screen | Verified |
| No minister name, no "one of 25" | Verified |
| Subtitles inside title-safe, never colliding with a lower third | Verified across all 80 cues |
| Colour | Rec. 709 primaries, transfer and matrix tagged |

## 6 · What to listen for, in order

Watch it once through without stopping. Then these ten moments.

| Jump to | Shot | What to judge |
|---|---|---|
| `00:00:00` | `K01` | Seven seconds of a Kannada school board before a word is spoken. Too long? It is meant to be slightly too long |
| `00:29:19` | `K06` | Six seconds, no voice at all, the founder's line alone on screen. **The longest silence in the film** |
| `01:07:17` | `K12` | ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. Three sentences, three full stops, no lift. Does typography beat the photograph it replaced? |
| `01:35:00` | `K17` | The English poster with a Kannada gloss. Does a Kannada-only viewer get everything? |
| `02:17:12` | `K23` | ಮುನ್ನೂರು, then 2.5 seconds of held silence on the best photograph in the library |
| `02:39:02` | `K27` | The 75 card, and ಪೂರ್ತಿ ಅಲ್ಲ. **This is the film's turn.** Two words, then two seconds of nothing |
| `03:22:13` | `K34` | Eleven seconds of navy while single-parent status, HIV and chronic illness are spoken. Does the restraint hold, or read as a fault? |
| `03:40:09` | `K36` | The Udayavani clipping. Can you read the headline? If not, the high-resolution scan is not optional |
| `04:39:14` | `K43` | The forward promise. **Needs trustee approval before any real recording**, `14` item 6.9 |
| `04:46:08` | `K44` and `K45` | 10 seconds, one shot, no cut, no text, through to ಆತ್ಮೀಯ ಸ್ವಾಗತ |

**Listen for the seven pending line variants too** (`01` section 6). This scratch read uses the recommended option in every case, including `ಎಚ್‌ಐವಿ ಇರುವ` rather than `ಪೀಡಿತ`, and `ಬಂದು ನಿಂತಿದೆ` rather than the two alternatives. Hearing them aloud is exactly what `14` item 7.2 asks for.

## 7 · Three things a viewer will notice that are not defects

- **The voice is flat.** It is a system TTS voice. Flatness is its limit, not the script's. `02` section 1 is the argument for a human narrator, and this file is the best evidence for it.
- **There is no music.** 41 seconds of the film are *designed* silence and will stay silent. The rest currently has narration over nothing.
- **The logo reads dark on navy.** The mark's hands are deep brown and the only files are 300 px. Legible but quiet at `K05` and `K46`. `05` section 6 rank 1 already asks for a 2000 px transparent PNG and a vector original; **add a light or reversed variant to that request.**

## 8 · Rebuilding it

```bash
cd anniversary-video-production/kannada/tools
python3 build_timeline.py timeline.json          # timing + consent register
python3 make_srt.py timeline.json ../05-kannada-subtitles.srt
python3 gfx.py ../05-kannada-subtitles.srt       # 133 Kannada graphics, via Chrome
python3 vo.py                                    # scratch narration, fitted per line
python3 film.py silent.mp4                       # 7,596 frames, ~3.5 min
```

then mux:

```bash
ffmpeg -i silent.mp4 -i vo/scratch_narration.wav -map 0:v -map 1:a -c:v copy -af "loudnorm=I=-16:TP=-3.0:LRA=11" -c:a aac -b:a 192k -ar 48000 -ac 1 -shortest -movflags +faststart ../08-kannada-animatic-preview.mp4
```

Requires `ffmpeg`, Pillow, Playwright with Chromium, and the macOS `say` command with the Kannada voice Soumya installed.

**If a narration line changes:** edit `build_timeline.py`, then re-run the whole chain. Every timecode in `01`, `03`, `04`, `05` and `06` derives from `timeline.json`. **Do not hand-edit timecodes in five documents.**

---

## 9 · The 2160p master, and what 4K does and does not buy

`tools/master.py` builds a 3840x2160 delivery master. It is worth doing, but for
one honest reason and not the obvious one.

### What is genuinely 4K

The Kannada type. `gfx.py --scale 2` re-renders all 133 graphics in Chrome at
`device_scale_factor=2`, so glyph curves, conjuncts, rules and the logo edge are
drawn at 3840x2160 rather than enlarged from 1080p. The CSS layout is unchanged
at 1920x1080 CSS pixels, so no card was re-designed to get this. Sixteen of the
46 shots are card or photo-card shots, and type is where softness reads first,
so this is a real and visible gain.

### What is not

The photography. Measured across the 34 unique source files:

| Longest edge | Files |
|---|---|
| 3840px or more | 0 |
| 2560 to 3839 | 0 |
| 1920 to 2559 | 5 |
| 1280 to 1919 | 22 |
| under 1280 | 7 |

The largest asset is 1920x1446. Twenty-nine of 34 are under 1920px. The 1080p
cut already enlarges many shots, and at 2160p those factors double: K38
(941x529) is enlarged about 4x, K26 about 4.4x, and the best case, the five true
1920px files, exactly 2x. Lanczos is doing the work and doing it well, but no
resampler invents detail that was never photographed.

**So do not judge the 4K master on photographic sharpness.** Judge it on type
crispness, and on what YouTube delivers.

### Why deliver 4K anyway

YouTube allocates a better codec and a materially higher bitrate to a 2160p
upload than to a 1080p one. A viewer watching at 1080p receives YouTube's
downscale of the 4K transcode, which holds together better than YouTube's 1080p
transcode of a 1080p upload, particularly on the slow pushes and the dissolves,
which is exactly where a low-bitrate transcode blocks up. That is the main
reason this master exists.

If the Trust later commissions re-scans or re-shoots of the key stills at native
4K, the pipeline needs no change: drop the higher-resolution files in place, keep
the same crop boxes in `film.py` (they are native source pixels), and re-run.

### Two deliberate differences from the animatic

1. **No burned-in subtitles.** `film.py --no-subs`. Upload
   `05-kannada-subtitles.srt` as a YouTube caption track instead: it stays
   toggleable, searchable, and machine-translatable, and it costs no pixels. The
   burned-in captions in the animatic exist only so a reviewer on a phone can
   follow the Kannada without touching a menu.
2. **Audio mastered to -14 LUFS**, not the -16 used for hall playback. -14 LUFS
   is YouTube's own normalisation target, so mastering to it means YouTube
   leaves the level alone rather than pulling it down.

### The gates

`python3 master.py --check` prints them. All five are open as of this writing:
scratch narration, 22 consent-blocked shots, the Udayavani clipping on K36, no
music licence, and unverified end-roll names. `--release` refuses to build while
any of them is unwaived, and refuses outright while the narration is the scratch
track. **A YouTube upload is public release.** The master this script builds by
default is an internal review copy and is named to say so.
