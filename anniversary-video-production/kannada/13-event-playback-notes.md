# 13 · Event playback notes · FALLBACK + pause SFX

**This is not the warm child cut.** Guardian consent (`07` item 1.1) is still
blank, so the picture uses `film.py --fallback`: 24 shots are replaced with
face-free stills. Audio carries the ElevenLabs Kannada narration and the 14-cue
SFX pack, the latter still under unsigned `07` 5.8.

Rebuilt 2026-09-09 against the ElevenLabs read. **The film is 20 seconds longer
than the previous master.** Anything downstream that quotes 00:05:37:22 is stale.

---

## File to play

| | |
|---|---|
| **Primary** | `anniversary-video-production/kannada/kannada-1080p-EVENT-master.mp4` |
| **SHA-256** | `f0f3cf28bf3eeb60938f644b346a522a4beb32c0ca56f3402099835d06b43cf0` |
| **Size** | ~83 MB |
| **Picture** | 1920x1080, H.264 High, yuv420p, 25 fps, full bt709 tags |
| **Audio** | AAC 320k, 48 kHz, stereo, **-23.0 LUFS** integrated, true peak **-10.7 dBTP** |
| **Duration** | **357.88 s** = **00:05:57:22** · **8947** video frames |
| **Subtitles** | Burned in (85 cues) |
| **Narration** | ElevenLabs `eleven_v3`, voice Sarah, per-scene stability bands |
| **Title tag** | `... EVENT MASTER (FALLBACK+SFX) 2026-09-09` |

Second copy on a different USB. Online preview, same picture and audio at
-16 LUFS: `08-kannada-elevenlabs-sfx-learning-mix.mp4`. Narration without
effects: `08-kannada-elevenlabs-preview.mp4`.

---

## How to play

1. Local file only. Never browser or Drive streaming.
2. 16:9 fullscreen, no player UI.
3. Test on the real PA before doors open. **-23 LUFS sounds quiet on a laptop
   and is correct for a hall.**
4. The film now runs **5 minutes 58 seconds**. Re-check the run of show.
5. Operator: _________________ · Standby: _________________

---

## Pause SFX, the 14 actually in this build

Generated from `tools/sfx/placements.csv`, not typed by hand. Timecodes are the
shot in-points in the current timeline.

| Shot | Shot in | Cue | Effect |
|---|---|---|---|
| `K01` | 00:00:00:00 | k01-bell | ACT 1 |
| `K05` | 00:00:28:00 | k05-riser | Warm tonal riser resolving into the wordmark reveal at K05 |
| `K05` | 00:00:28:00 | k05-impact | Soft low impact on the 2016 ರಿಂದ 2026 line |
| `K07` | 00:00:39:00 | k07-whoosh | ACT 2 |
| `K10` | 00:01:04:19 | k10-ambience | Village morning bed under the 2s pause before the 2016 ori |
| `K11` | 00:01:10:08 | k11-page | 2016 first school visit |
| `K15` | 00:01:32:02 | k15-whoosh | ACT 3 transition, into the 2s pause across the thin years |
| `K18` | 00:02:00:24 | k18-book | Library shelves |
| `K22` | 00:02:28:12 | k22-zip | Two hundred school bags at MM Hills |
| `K23` | 00:02:39:13 | k23-impact | Soft low land under ಮುನ್ನೂರು, then the 2 |
| `K35` | 00:04:10:11 | k35-whoosh | ACT 4 |
| `K36` | 00:04:18:15 | k36-page | Udayavani clipping, 19 June 2024 |
| `K41` | 00:05:09:07 | k41-riser | ACT 5 |
| `K46` | 00:05:50:22 | k46-roomtone | End card |

**Never on structural silence.** `sfx.py` refuses to build if a placement lands
in one, or merely runs over the cut into one:

| Left clean | Why |
|---|---|
| `K06` `K12` `K27` `K34` | `06` §7, `07` 5.6. The film's silences |

Verified on this build, measured across each shot's silent window:

| Cue | Window | RMS |
|---|---|---|
| `K06` | 33.08s to 38.88s | **-inf** |
| `K12` | 79.56s to 80.36s | **-inf** |
| `K27` | 191.30s to 193.10s | **-inf** |
| `K34` | 249.54s to 250.34s | **-inf** |

Normalisation is two-pass `loudnorm` with `linear=true`. Single-pass dynamic
normalisation would lift the noise floor inside those silences.

---

## Narration

Generated with `anniversary-video-production/kannada-voice`, not `tts_eleven.py`.
All 43 lines, 3,738 characters after the year rewrite, one file per shot id so a
single line can be re-recorded without touching the rest.

Years are spoken as Kannada number words with the correct sandhi
(`2016ರಲ್ಲಿ` becomes `ಎರಡು ಸಾವಿರದ ಹದಿನಾರರಲ್ಲಿ`). Cards and SRT keep the Arabic
numerals. The whole script was rendered in one pass at the same settings, so
there is no sandhi roughness left from a part-render.

**The voice is not verified for Kannada.** Sarah is an English premade voice.
`14` item 7.1 still needs a native Kannada speaker who is not the translator to
confirm the read, and `reports/pronunciation-and-pickups.md` in the kannada-voice
pack is what to hand them.

---

## Picture fallback, unchanged rule

24 blocked shots replaced with face-free stills:
`K02` `K03` `K11` `K13` to `K16` `K19` `K20` `K23` `K24` `K28` `K30` `K32` `K33`
`K36` `K38` to `K45`.

---

## K34 is blank on purpose, and that is not a fault

`00:03:57:23` to `00:04:10:11`, 12.52 seconds, carries no photograph and no card
type. Only a gold rule.

The line spoken over it names single-parent status, HIV in the family and
chronic illness. `14` item 2.4 and the storyboard make this absolute: **no
photograph, no face, no illustration of a child, and no card text while the
line is spoken.** Any image or on-screen label there would attach those
conditions to identifiable children. The partner list arrives at K35, after the
sentence has ended.

It is the only card in the film with no type of its own, and the longest.

**What was wrong** is that the 2160p master carried no captions at all, so those
12.5 seconds were literally empty on screen. The 1080p cuts burn the subtitle
in, so the words are there. The 2160p now carries a **soft Kannada subtitle
track** (`mov_text`, language `kan`) which stays toggleable for YouTube and is
visible to anyone reviewing the file locally. Turn subtitles on in the player.

**One length note.** The storyboard designed this shot at 10.72s. The
synthesised read is slower, so it now runs 12.52s: speech 11.52 plus a 1.0s
pause. Trimming that pause to 0 would bring it to 11.52s and is the only lever
that does not touch the consent rule. It needs a re-time and a re-render.

---

## Still open, Trust only

`07` **1.1**, **1.12**, **4.1**, **5.1**, **5.5**, **5.8**, Part 11.

Two of those bite on this file specifically:

- **1.1** is why the picture is the fallback. It is not a licence anyone can
  buy; it is written guardian consent, per child, naming the uses.
- **5.8** is why the SFX build is a learning mix. Production has been
  instructed to proceed with effects ahead of go-live pending that signature.
- **5.1** (music) is unrelated to this file: there is no music bed in it yet.

The ElevenLabs commercial licence is separate again, and outstanding: the
narration above was generated on a free plan, which carries no commercial
licence. See `anniversary-video-production/kannada-voice/reports/final-voice-recommendation.md`.
