# 13 · Event playback notes · FALLBACK + pause SFX

**This is not the warm child cut.** Guardian consent (`07` item 1.1) was blank
when this file was built. Picture uses `film.py --fallback`. Audio now carries
the 14-cue pause SFX pack (still under unsigned `07` 5.8 — Trust decision).

---

## File to play

| | |
|---|---|
| **Primary** | `anniversary-video-production/kannada/kannada-1080p-EVENT-master.mp4` |
| **SHA-256** | `90344b11788eab83536ff082a4ad694dacdba9ccc81168645c93c99c3ac01807` |
| **Size** | ~80 MB |
| **Picture** | 1920×1080, H.264 High, yuv420p, 25 fps, CRF 18, full bt709 tags |
| **Audio** | AAC 320k, 48 kHz, stereo, **−23.00 LUFS** / peak ≤ −3 dBTP; narration + 14 SFX |
| **Duration** | **337.88 s** · **8447** video frames |
| **Subtitles** | Burned in (**84** cues) |
| **Title** | `… EVENT MASTER (FALLBACK+SFX) 2026-09-09` |

Second copy on a different USB. Online preview with the same picture+SFX at −16 LUFS:
`08-kannada-sfx-learning-mix.mp4`.

---

## How to play

1. Local file only — never browser / Drive streaming.
2. 16:9 fullscreen, no player UI.
3. Test on the real PA before doors open (−23 LUFS sounds quiet on a laptop).
4. Operator: _________________ · Standby: _________________

---

## Pause SFX (14 cues — cap in `sfx.py`)

Placed on designed pauses / accents. **Never** on structural silence:

| Forbidden (left clean) | Why |
|---|---|
| `K06` `K12` `K27` `K34` | `06` §7 / `07` 5.6 — the film’s silences |

| Shot | Effect |
|---|---|
| K01 | distant school bell |
| K04 | whoosh into post-line pause |
| K05 | tonal riser into title (clear of K06) |
| K07 | whoosh on organisation card |
| K10 | whoosh under 2 s village hold |
| K11 | page turn (2016) |
| K15 | whoosh into thin-years pause |
| K18 | page turn (library / books proxy) |
| K22 | backpack |
| K23 | soft boom under ಮುನ್ನೂರು, then hold stays clean |
| K26 | page turn (form / paper proxy) |
| K35 | whoosh partners card |
| K36 | page turn (clipping) |
| K46 | low applause on end card |

Pixabay browser download of new pencil/paper assets did not land on disk; existing
library files were reused and logged in `08-pixabay-sfx-licence-log.csv`.

---

## Year / number pronunciation (ElevenLabs)

`tts_eleven.py` now rewrites years to Kannada number words with correct sandhi
(e.g. `2016ರಲ್ಲಿ` → `ಎರಡು ಸಾವಿರದ ಹದಿನಾರರಲ್ಲಿ`) for TTS only. Cards / SRT stay
Arabic numerals.

**Free-tier quota hit (9957 / 10000 chars).** Correct sandhi re-renders landed for
`K11` `K14` `K16` `K18` `K20`. `K22` `K23` `K36` `K37` still use the earlier
Kannada-year render (slight sandhi roughness). Re-run when quota resets or after
a paid plan:

```bash
cd tools
python3 tts_eleven.py --render XrExE9yKIg1WjnnlVkGX --only K22 K23 K36 K37
python3 build_timeline.py timeline.json --from-audio vo_eleven/XrExE9yKIg1WjnnlVkGX/durations.json
python3 stem.py XrExE9yKIg1WjnnlVkGX && python3 sfx.py
# then remux event master
```

---

## Picture fallback (unchanged rule)

24 blocked shots replaced with face-free stills. Same drop list as before
(`K02` `K03` `K11` `K13`–`K16` `K19` `K20` `K23` `K24` `K28` `K30` `K32` `K33`
`K36` `K38`–`K45`).

---

## Quick verify on this build

| Check | Result |
|---|---|
| Decode | clean |
| Loudness | **−23.00 LUFS** integrated |
| Duration / frames | **337.88 s** / **8447** |
| `K06` silence | mean **−91.0 dB**, max **−84.3 dB** |

---

## Still open (Trust only)

`07` **1.1**, **1.12**, **4.1**, **5.1**, **5.5**, **5.8** (SFX amendment), Part 11.
