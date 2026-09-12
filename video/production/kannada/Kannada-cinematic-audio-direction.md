# Kannada cinematic audio direction

The audio design of the Kannada event film, as a five-act score with a limited
recurring effect palette. It upgrades music, sound design, pacing and mix. It
changes no fact, no image, no shot order, no approved Kannada line and no
consent restriction.

**Film on disk:** `00:05:57:22` = 357.88 s, 46 shots, 25 fps.
Timecodes here and in the cue sheet are generated from `tools/timeline.json`.

---

## STATUS. Two gates stand between this document and the film

Nothing below may be cut into a master until both are signed.

| Gate | Reads | Effect on this document |
|---|---|---|
| `07` item **5.1** | BLOCKING. A music licence covering public event screening, YouTube monetised or not, social media and website embedding, worldwide, in perpetuity | There is no music in this repository at all. The whole score below is a specification for a composer or a supplier, not a description of something that exists |
| `07` items **5.7** and **5.8** | "No sound effects. This film does not need them." 5.8 asks the Trust to reaffirm or amend it, and is unsigned | The 28 placements below are a proposal. `tools/sfx.py` and `tools/mix.py` both stamp their output UNAPPROVED and neither will write over a master |

The honest summary: **the picture is finished, the narration is finished, and the
soundtrack does not exist yet.** This document, the cue sheet and the music map
are what a composer and a re-recording mixer need in order to make it, and the
mix tooling is built and tested so that the day a licensed bed arrives the
deliverables are one command away.

---

## 1 · What "cinematic" means here, and what it does not

The film earns its scale from timing, texture, silence and contrast. Not from
level. Every one of the following was chosen against the alternative of simply
turning the music up.

| Element | What a basic NGO video does | What this film does |
|---|---|---|
| Music | One constant bed at one level | Five acts, an intensity curve that falls as often as it rises, and three complete music-outs |
| Effects | A whoosh on every photograph | 20 accents in 357.88 seconds, each tied to a story beat, over 8 ambience beds. Was 14 accents and no bed, which measured as a narration with nothing underneath it |
| Numbers | Orchestral swell on the total | `K22` and `K23` build **under** the numbers and are marked no swell |
| Hardship | Sad piano, slow push on a face | `K17` and `K34` reduce to a drone. `K34` has no photograph at all |
| The award | Fanfare | One gentle lift, then settle. No brass, no cymbal, no chime, no applause |
| The ending | Logo plus a trailer boom | A warm chord, one chime after the voice has finished, and 3 seconds of natural fade |

**Forbidden throughout**, carried forward from `07` section 11 and `14` item
5.4: any track with a vocal in any language, four-to-the-floor percussion,
corporate-inspirational piano-and-clap library music, devotional cadence, large
trailer impacts, EDM risers or drops, heroic brass, ticking clocks to represent
time, and any identifiable child voice in any ambience bed.

---

## 2 · The five acts, on the real timeline

| Act | Title | Timecode | Length | Shots | Intensity | Effects | Written silence |
|---|---|---|---|---|---|---|---|
| 1 | ಆರಂಭ, the child and the question | 00:00:00:00 to 00:00:36:10 | 36.4s | K01 to K06, 6 | 0 to 2 | 3 | 16.5s |
| 2 | 2016, one beginning | 00:00:36:10 to 00:01:19:17 | 43.2s | K07 to K13, 7 | 0 to 2 | 2 | 3.0s |
| 3 | ಒಂದು ದಶಕದ ಹಾದಿ, ten years of showing up | 00:01:19:17 to 00:02:44:13 | 84.9s | K14 to K25, 12 | 1 to 4 | 5 | 5.5s |
| 4 | ಕೆಲಸದ ಕ್ರಮ, method, care and community | 00:02:44:13 to 00:04:51:19 | 127.2s | K26 to K40, 15 | 0 to 3 | 2 | 7.0s |
| 5 | ಮುಂದಿನ ದಾರಿ, future and anniversary welcome | 00:04:51:19 to 00:05:57:22 | 46.1s | K41 to K46, 6 | 2 to 4 | 2 | 9.0s |

The acts fall on shot boundaries, so an act can be re-scored without touching
its neighbours. Per-shot cues, levels and the reasoning behind each are in
[`Kannada-cue-sheet.csv`](Kannada-cue-sheet.csv); the score itself is in
[`Kannada-music-map.md`](Kannada-music-map.md).

**Act 4 is the longest by a wide margin** and carries the two most sensitive
passages in the film. It is deliberately the least musical act: it opens by
removing the percussion, contains a complete music-out at `K27` and a drone-only
passage at `K34`, and only recovers warmth for the partners, the coverage and
the gratitude.

---

## 3 · Three moments the film is built around

### 3.1 The anniversary title, `K05` at 00:00:28:00

`GFX-01` reveals in three states: gold rule at +0.0s, logo and wordmark at
+0.6s, and `ಹತ್ತು ವರ್ಷ · 2016 ರಿಂದ 2026` at +1.6s. The audio follows the
graphic and not the cut.

```
+0.10s   warm tonal riser, resolving into the wordmark      -16 dB rel narration
+1.60s   soft low impact on the 2016 ರಿಂದ 2026 line         -20 dB rel narration
         music lifts a fifth, then resolves to one held bansuri note
+4.58s   K06. MUSIC OUT COMPLETELY for six seconds
```

Two events, sequential, never layered. The riser is over before the impact
starts, the impact is over 1.58 s before `K06`, and the gold-rule whoosh is
**not** here: it is at `K07`, on the organisation card, where a rule animates
without a title competing for the same two seconds.

### 3.2 One scholarship, `K12` at 00:01:14:08

```
ಚಿಕ್ಕಬಳ್ಳಾಪುರ.
ಒಂದು ಮಗು.
ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ.
```

**Silence.** No music, no effect, no ambience. The line lands on its own and the
card holds for 1.0 s after it. This is the moment most likely to be
"improved" by a low impact or a soft piano; both would make it smaller. The
preceding page turn at `K11` is the only sound near it, and it clears `K12` by
3.61 s.

### 3.3 The welcome, `K45` at 00:05:45:05

```
ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್‌ನ ಹತ್ತನೇ ವರ್ಷದ
ಸಂಭ್ರಮಕ್ಕೆ ನಿಮಗೆಲ್ಲರಿಗೂ ಆತ್ಮೀಯ ಸ್ವಾಗತ.
```

Music steps down 2 dB under this line and adds no new material. The narration
finishes at 00:05:30:22. **Then** the end card, the final warm chord, one gentle
chime at 00:05:32:22, and a natural fade to silence across the last 3 seconds.
Nothing sounds on top of the welcome, and nothing sounds after the fade.

---

## 4 · The effect palette

**20 accents and 8 ambience beds across 357.88 seconds.** This section used to
read "six sounds, 14 events" and to say that adding one means removing one,
because `11` section 3 capped the film at 14. That cap is withdrawn; the
instruction was to place every licensed file.

The count was never the problem. Fourteen accents at the level they were mixed
contributed between 0.00 and 0.19 dB each to the mix, and the film played as a
voice in a vacuum. What it was missing was a floor, not more events.

### 4.0 The beds

| Bed | Act | Runs | Level |
|---|---|---|---|
| Room tone | all of it | 0.00 to 357.88 | -20 under the local voice |
| Countryside morning | 1 | K01 to K06 | -15 |
| Countryside morning | 2 | K07 to K13 | -16 |
| Open field wind | 3 | K14 to K25 | -15 |
| Insects and birds field | 4 | K26 to K37 | -17 |
| Indian village ambience | 4, under the field work | K30 +60s | -21 |
| Tape-echo spring | into 5 | K38 +27s | -20 |
| Warm pad | 5 | K41 to K46 | -15 |

The village bed is cut only from 268.0s of its source file.
`tools/sfx_voicecheck.py` found clear speech at 65.5s, 202.0s and six other
points in it, and 268.0s begins the one 12.5s run in the calmest quartile. `14`
item 2.4 is absolute and a human still has to confirm that excerpt by ear.

### 4.0.1 The accents

| Class | Used | Where |
|---|---|---|
| Soft low impact | 2 | `K05` title line, `K23` ಮುನ್ನೂರು |
| Soft card landing | 1 | `K29` |
| Gentle airy whoosh | 3 | `K07` gold rule, `K15` act transition, `K35` partners card |
| Soft tonal riser or swell | 4 | `K05`, `K21` into MM Hills, `K30`, `K41` |
| Windy thud | 1 | `K28`, the act 4 turn |
| Archive and learning foley | 6 | `K11` page, `K17` rustle, `K18` book, `K22` zip, `K36` newspaper, `K44` zip |
| Single piano note | 1 | `K04`, the school-fee line |
| School bell | 1 | `K01`, distant, under picture with no narration |
| Applause | 1 | `K46`, the end card, after the voice has ended |

### 4.0.2 Levels, and the rule that was being misread

`14` item 8.7 says "music bed at least 12 dB below narration". It says nothing
about effects, and the point of it is that nothing competes with the voice
**while the voice is speaking**.

`sfx.py` used to apply it as one ceiling measured across the whole narration
stem. Speech in this read is -17.8 dBFS, so the ceiling sat at -29.8 dBFS and
every effect was held under it whether or not anyone was speaking. The school
bell that opens the film, alone in seven seconds of silence, came out at -36.4
dBFS.

Three rules now:

- **Under narration**, an accent sits at its stated level below the voice **in
  the window it occupies**. 13 to 21 dB, and the film's floor is 13.
- **In a silence**, it plays at a stated absolute level instead. The bell is
  -20 dBFS, the applause -26.
- **The effects bus**, not each effect, is what 8.7 is enforced on. Four sounds
  each 14 dB under the voice add up to 8 dB under it. The bus is ducked in 1.5
  second windows over up to four passes.

Integrated, the bus is **-32.7 dBFS against a narration at -17.8 dBFS, 14.9 dB
of headroom**, and the tightest 1.5s window anywhere is 12.20 dB.

### 4.1 Where the film refuses sound, and it is not negotiable

| Shot | Timecode | Rule |
|---|---|---|
| `K06` | 00:00:33:00 | Six seconds fully silent under the founder's quote. Room tone only |
| `K12` | 00:01:14:08 | Silence under ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. |
| `K27` | 00:03:05:07 | Music out completely under ಪೂರ್ತಿ ಅಲ್ಲ. Drone alone returns on the pause |
| `K34` | 00:03:57:23 | Drone and one held note. Nothing that could be read as sentiment |
| `K37` | 00:04:30:22 | One gentle lift for the award, then settle. No fanfare |
| `K43` | 00:05:29:20 | Lifts, but does not climax |

`tools/sfx.py` refuses to place anything in the first four and warns on the last
two. `tools/cue.py --check` fails if a cue is written into one, or if an
effect's fade-out crosses into one. `tools/mix.py` measures all four in the
built stems after every build and refuses to finish if any is above -70 dBFS.
Three tools enforce the same six rules, because a mix that breaks them still
renders and still sounds plausible.

### 4.2 Four changes made against the earlier effect set

| Change | Reason |
|---|---|
| Removed the whooshes at `K04` and `K10` | Both sat inside written pauses in the opening. Act 1 is 16.5 s of designed quiet out of 36.4 s, and a transition effect inside a pause spends the film's most valuable silence on decoration |
| Removed the page turn at `K26` | It was a paper-and-pencil proxy standing in for a sound that now has its own cue at `K21`, with a real pencil file to source |
| Removed the applause at `K46` | `11` section 1 warns that applause anywhere near the gratitude section reads as fanfare. The brief's own instruction is "once only, if at all", and the gentle chime does the same work without asking the audience to hear itself being congratulated |
| Moved the low tonal emphasis off `K27` and onto `K29` | The brief asks for a single low emphasis under the direct-payment line. `K27` is a complete music-out and `11` explicitly forbids a low impact there. `K29`, ನೇರವಾಗಿ ಶಾಲೆಗೇ ಸಲ್ಲುತ್ತದೆ. ಬೇರೆ ಯಾರ ಕೈಗೂ ಅಲ್ಲ., carries the same claim, is not a silence cue, and takes the emphasis as a **score event**: one low cello or bansuri tonic, not an effect |

### 4.3 Two placeholders and two gaps

| Item | State | What to do |
|---|---|---|
| `k05-impact`, `k23-impact` | The only impact file downloaded is `submority-boom-geomorphism-cinematic-trailer` | It is a trailer boom, which `11` rejects by name. It is in the mix at -20 and -18 dB so the placement can be judged, and it must be replaced with a warm documentary impact before picture lock |
| `k21-pencil` | Specified, not downloaded | [pencil writing](https://pixabay.com/sound-effects/search/pencil%20writing/). Clean short foley, no desk knock, no ASMR scratchiness |
| `k46-chime` | Specified, not downloaded | [gentle chime](https://pixabay.com/sound-effects/search/gentle%20chime/). Warm, non-electronic, must not sound like a phone notification. This is the last sound in the film |
| `k18-book` | Placed, using the page-turn file as a proxy | Audition a real [book](https://pixabay.com/sound-effects/search/book/) handling file for the library |

Every effect that reaches the edit needs its asset page captured as a PDF or
screenshot **on the day of download**, per `07` item 5.9. As of now, **all 14
rows in the licence log read NOT CAPTURED**, and every asset page URL in it was
reconstructed from a filename rather than verified against Pixabay. That is a
rights gap, not a formatting gap.

---

## 5 · Sensitive content, which the cinematic pass does not touch

`14` item 2.4 is BLOCKING: no narration, caption or onscreen text naming HIV
status, bereavement, disability, family violence or poverty appears over an
identifiable face. The edit already satisfies it by putting the hardest lines
over typographic cards. The audio must not undo that.

- **`K17`, 00:01:47:21, the 2020 relief poster.** Drone only. No sad piano, no
  swell, no added ambience. The poster names children who lost parents, and any
  music that comments on it is the film telling the audience how to feel.
- **`K34`, 00:03:57:23, 12.8 seconds, no photograph.** ಏಕ ಪೋಷಕರ ಮಕ್ಕಳು.
  ಎಚ್‌ಐವಿ ಇರುವ ಕುಟುಂಬಗಳ ಮಕ್ಕಳು. Drone and one held bansuri note, at -28 dB.
  No effect, no ambience change, no movement, and nothing that could be read as
  sentiment. This shot is a card with no image precisely so that these words
  never sit over a child's face, and a music cue that swells here re-creates the
  problem in the other medium.
- **No identifiable child voice anywhere**, in ambience or foreground. A
  classroom or schoolyard bed must be unintelligible room tone or it does not
  go in. The one bed cut from a file that contains speech, the village ambience,
  takes only the 12.5s window `tools/sfx_voicecheck.py` cleared, and a human
  still has to confirm that excerpt by ear.

---

## 6 · Mix and delivery, in one page

Full detail in [`Kannada-final-mix-checklist.md`](Kannada-final-mix-checklist.md).

| | |
|---|---|
| Narration | Always the most important element. Peaks no higher than -3 dBTP. Pauses in the approved script preserved exactly. De-essed carefully, never at the cost of Kannada consonants |
| Music | 12 to 18 dB below narration, further down under dense Kannada. Rises only where narration is absent. Sidechain ducking subtle enough not to pump |
| Effects | Behind narration, never between it and the listener. Low end reduced for the hall. No effect over the first or last consonant of a phrase |
| Event master | 48 kHz, 24-bit WAV, -23 LUFS integrated, -3 dBTP, high-passed at 65 Hz |
| Online master | 48 kHz, -16 LUFS integrated, -3 dBTP. -3 is stricter than the -1 dBTP an online master is usually allowed, satisfies `14` item 8.7, and costs nothing audible |

### Build it

```bash
cd tools
python3 cue.py                       # regenerate the cue sheet from the timeline
python3 log.py                       # regenerate the licence log, keeping human fields
python3 sfx.py --check               # validate placements against the silence cues
python3 mix.py --check               # measure every effect against the narration
python3 mix.py --calibrate           # build stems, masters, previews
python3 mix.py --music bed.wav       # the same, once a licensed bed exists
```

Everything is derived from `tools/timeline.json`, so a re-time costs one command
and not a re-typed cue sheet. This matters here: the film was re-timed twice
during the writing of these documents, from 00:05:36:01 to 00:05:37:22 and
then to 00:05:57:22 when the full ElevenLabs read landed, and every
timecode in `06` section 7 is between 2 and 33 seconds early because it was
written against the pre-build plan of 00:05:03:21. Use the cue sheet, not `06`
section 7, and re-run `cue.py` after any re-time.

---

## 7 · Related

- [`Kannada-cue-sheet.csv`](Kannada-cue-sheet.csv), 46 music cues and 28 effect events at generated timecodes
- [`Kannada-music-map.md`](Kannada-music-map.md), the score: palette, motif, intensity curve, what a composer must deliver
- [`Kannada-final-mix-checklist.md`](Kannada-final-mix-checklist.md), mix, master, QA and sign-off
- [`Kannada-sfx-licence-log.csv`](Kannada-sfx-licence-log.csv), the record of what shipped, and what is still NOT CAPTURED
- [`11-kannada-sound-design-and-sfx-sources.md`](11-kannada-sound-design-and-sfx-sources.md), effect sourcing and licence discipline
- [`06-kannada-edit-decision-list.md`](06-kannada-edit-decision-list.md) section 7, the original music cue sheet this extends
- [`07-final-rights-and-approval-checklist.md`](07-final-rights-and-approval-checklist.md) Part 5, the gates
- `video/research/07-bilingual-creative-brief.md` section 11, music direction
- `video/research/14-rights-consent-and-publishing-checklist.md` items 2.4, 5.1, 5.4, 8.7
