# Kannada final mix checklist

Mix, master, quality-test and sign-off for the Kannada event film. Work down it
in order. Nothing here overrides `07-final-rights-and-approval-checklist.md`,
which is the approval record; this is the engineering record.

**Film:** `00:05:57:22` = 357.88 s, 46 shots, 25 fps, 1920x1080.

---

## Part 0 · The two gates, before anything else

| # | Item | State | Owner | Date |
|---|---|---|---|---|
| 0.1 | **BLOCKING.** `07` item 5.1, music licence covering public event screening, YouTube monetised or not, social media and website embedding, worldwide, in perpetuity | **OPEN.** No music exists in this repository at all | | |
| 0.2 | **BLOCKING.** `07` item 5.8, the Trust either reaffirms "no sound effects" or amends it to "sound effects permitted under the limits in `11`" | **UNSIGNED.** 14 effects are specified and 12 are cut into a learning mix only | | |
| 0.3 | `07` item 5.5, narrator release signed, covering all listed uses | | | |
| 0.4 | `07` item 5.9, every effect's asset page captured as PDF or screenshot on the day of download | **NOT DONE.** All 14 rows in the licence log read NOT CAPTURED, and every asset URL in it was reconstructed from a filename rather than verified | | |

**Until 0.1 and 0.2 are signed there is no final mix to make.** Everything below
is ready to run the day they are.

---

## Part 1 · Conform

| # | Item | Check |
|---|---|---|
| 1.1 | Picture and timeline agree | `tools/mix.py` compares `kannada-1080p-EVENT-master.mp4` against `tools/timeline.json` and warns if they differ by more than 0.08 s. The film has been re-timed twice, `00:05:36:01` to `00:05:37:22` to `00:05:57:22` |
| 1.2 | Narration stem rebuilt against **this** render | `python3 stem.py <VOICE_ID>`. Run only after `build_timeline.py --from-audio`, or every line after the first drift sits wrong |
| 1.3 | Cue sheet regenerated | `python3 cue.py`. Never hand-edit `Kannada-cue-sheet.csv` |
| 1.4 | Hand-typed timecodes in the audio documents still true | `python3 cue.py --audit-docs`. Checks every shot-and-timecode pair in the three markdown files against the timeline |
| 1.5 | Licence log regenerated, human fields preserved | `python3 log.py` |
| 1.6 | Effect placements valid | `python3 sfx.py --check`, then `python3 sfx.py --strict` |
| 1.7 | Every stem and master exactly 357.88 s | `mix.py` refuses to finish otherwise |
| 1.8 | `06` section 7 **is not** the cue sheet | Its timecodes were written against the pre-build plan of `00:05:03:21` and are between 2 and 33 seconds early. Use `Kannada-cue-sheet.csv` |

---

## Part 2 · Narration

The Kannada voice is the most important element in the film at every moment.

| # | Item | Target |
|---|---|---|
| 2.1 | Peak | No higher than **-3 dBTP**. `14` item 8.7. `stem.py` normalises to exactly this |
| 2.2 | Tone | Natural, close, warm. Do not over-compress. No broadcast-loud voice-over sheen |
| 2.3 | Sibilance | De-ess carefully and locally. Kannada retroflex and aspirated consonants carry meaning, and a broad de-esser will soften ಷ, ಶ, ಸ, ಠ, ಥ until words change |
| 2.4 | Pauses | Every pause in the approved script survives. 41.0 s of the film is written holds and pauses, and they are the pacing |
| 2.5 | Line placement | Each line starts at its shot's `t_in`. Verify no line bleeds over a cut: `stem.py` reports overruns by name |
| 2.6 | Breaths | Kept, reduced, not removed. A read with no breaths is a read with no person in it |
| 2.7 | Intelligibility | Every consonant at the start and end of a phrase audible with music and effects in. Test at 2.3 below the narration, not in solo |

---

## Part 3 · Music

| # | Item | Target |
|---|---|---|
| 3.1 | Level | **12 to 18 dB below narration**, and further down under dense Kannada. `14` item 8.7 sets 12 dB as the ceiling, not the target |
| 3.2 | Rises only where narration is absent | The intensity curve in `Kannada-music-map.md` section 4 |
| 3.3 | Ducking | Sidechain subtle enough that it never pumps. If the ducking is audible as an effect, ride the bed by hand instead |
| 3.4 | **`K06`, 00:00:33:00, six seconds fully silent** | Room tone only, under the founder's quote. `07` item 5.6 |
| 3.5 | **`K12`, 00:01:14:08, silence** | Under ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ., plus 1.0 s of hold after the line |
| 3.6 | **`K27`, 00:03:05:07, music out completely** | Under ಪೂರ್ತಿ ಅಲ್ಲ. Drone alone returns on the 2 s pause at -30 dB |
| 3.7 | **`K34`, 00:03:57:23, drone and one held note** | 12.8 s over a card with no photograph. Nothing that could be read as sentiment |
| 3.8 | **`K37`, 00:04:30:22, no fanfare** | One gentle lift for the award, then settle |
| 3.9 | **`K43`, 00:05:29:20, no climax** | Lifts and stops lifting. No added percussion, no cymbal, no key change, no octave doubling |
| 3.10 | No swell on the numbers | `K22` and `K23`. `14` item 5.4 |
| 3.11 | No vocals in any language | `07` item 5.4 |
| 3.12 | End | Final warm chord, then a natural fade to silence across the last 3 s. No boom, no hard cut after the logo |

**A mix engineer will instinctively fill 3.4 through 3.9.** `mix.py` measures the
first four in the built stems after every build and refuses to finish if any is
above -70 dBFS. `sfx.py` refuses to place an effect in them. `cue.py --check`
fails if a cue is written into one or if a fade-out crosses into one.

---

## Part 4 · Effects and ambience

| # | Item | Target |
|---|---|---|
| 4.1 | Count | **14 events maximum** across 357.88 s. `11` section 3. Currently 12 placed, 2 pending download |
| 4.2 | Class caps | No more than 3 low impacts (2 used), 4 whooshes (3 used), 1 school bell (1 used), 1 applause (0 used) |
| 4.3 | Levels | -14 dB to -22 dB relative to the narration's speech RMS. `mix.py` derives each gain by measurement from the level in `sfx/placements.csv` and prints what it achieved |
| 4.4 | Position | Behind the narration, never between it and the listener |
| 4.5 | Consonants | No effect over the first or last consonant of a Kannada phrase |
| 4.6 | Low end | Reduced for the hall. The event master is high-passed at 65 Hz |
| 4.7 | High end | No harsh high-frequency effects. Four minutes of airy whoosh is tiring in an auditorium |
| 4.8 | No layering | Two transition effects never overlap. At `K05` the riser finishes before the impact begins |
| 4.9 | **No identifiable child voice** | In any ambience bed, foreground or background. `14` item 2.4. A classroom or schoolyard bed must be unintelligible room tone or it does not go in |
| 4.10 | Nothing in the silence cues | `K06`, `K12`, `K27`, `K34`. Enforced in three tools |
| 4.11 | Replace both placeholder impacts | `k05-impact` and `k23-impact` currently use a trailer-class boom, which `11` rejects by name |
| 4.12 | Download the two pending effects | `k21-pencil` and `k46-chime`. The chime is the last sound in the film |

---

## Part 5 · Masters

| # | Deliverable | Spec |
|---|---|---|
| 5.1 | Event master | 48 kHz, **24-bit WAV**, **-23 LUFS** integrated, true peak **-3 dBTP**, high-passed at 65 Hz. Controlled dynamics for auditorium playback |
| 5.2 | Online master | 48 kHz, 24-bit WAV, **-16 LUFS** integrated, true peak **-3 dBTP**, full range |
| 5.3 | Loudness method | Two-pass `loudnorm`, linear. One pass only estimates, and an event master 2 LU off gets ridden by hand from the desk on the night |
| 5.4 | Peak ceiling | -3 dBTP satisfies `14` item 8.7 and is stricter than the -1 dBTP an online master is usually allowed. It costs nothing audible at these loudnesses and leaves the hall headroom |
| 5.5 | Sub-bass | The event master does not need the bottom two octaves and a hall rig will turn them into mud |

### Stems, at the same 357.88 s and the same start

| # | Stem | State |
|---|---|---|
| 5.6 | Dialogue, Kannada | **BUILT.** `tools/mix/stem-1-dialogue-kn.wav` |
| 5.7 | Music | **NOT BUILT.** Nothing to build it from. `mix.py --music bed.wav` builds it the day a licensed bed exists |
| 5.8 | Effects and ambience | **BUILT, UNAPPROVED.** `tools/mix/stem-3-sfx-ambience-UNAPPROVED.wav` |

### Previews

| # | Preview | Window | Proves |
|---|---|---|---|
| 5.9 | Title card, 10 s | 00:00:25:00 | The riser, the low impact on the `ಹತ್ತು ವರ್ಷ · 2016 ರಿಂದ 2026` line, and that the six seconds of silence after it survive |
| 5.10 | Opening, 30 s | 00:00:00:00 | How quietly the film starts, and how little sits under the first Kannada lines |
| 5.11 | Journey, 30 s | 00:02:15:00 | The 2016 to 2025 build: the bag zip, the peak at ಮುನ್ನೂರು, and the 2.5 s hold that is not filled |
| 5.12 | Closing, 30 s | 00:05:07:22 | The lift that does not climax, the welcome line clear of everything, and the fade to silence |

All four are cut from the online master, so what they prove about balance is
what the audience will hear. Mux any of them to picture with the command
`mix.py` prints at the end of a run.

---

## Part 6 · Quality test

Play the **event master** in all five. The narrator must be understandable in
every one, and the three silence cues must read as intentional rather than as a
dropout.

| # | System | Listen for |
|---|---|---|
| 6.1 | Headphones | Sibilance, breath edits, effect placement, the noise floor inside `K06` |
| 6.2 | Laptop speakers | Kannada consonants surviving with no low end at all |
| 6.3 | Phone speaker | Whether the drone disappears entirely, and whether the film still holds together when it does |
| 6.4 | Living-room speaker | Music-to-narration balance at normal domestic level |
| 6.5 | Event PA or auditorium | Intelligibility from the back row, low-end build-up, and whether the 65 Hz high-pass is enough. If a hall test is impossible before the day, arrive early and run 5.9 through 5.12 through the actual rig |

| # | Item | Check |
|---|---|---|
| 6.6 | The three cues that carry the film | `K06` silence, the `K27` drop under ಪೂರ್ತಿ ಅಲ್ಲ., and `K43` not climaxing. Listen for these first, on every system |
| 6.7 | Subtitles against the mix | `05-kannada-subtitles.srt` and `.vtt` still match the read |
| 6.8 | No effect masks a phrase edge | Walk the 14 events against the narration, not against silence |
| 6.9 | Sensitive passages | `K17` and `K34`. If either has acquired anything that comments emotionally, remove it |

---

## Part 7 · Sign-off

| # | Item | Owner | Date |
|---|---|---|---|
| 7.1 | Music licence certificate, track title, composer, licence number recorded and credited. `07` item 5.2 | | |
| 7.2 | If commissioned, written assignment or licence from the musician. `07` item 5.3 | | |
| 7.3 | Effect licence evidence captured for all 14 rows, and `Kannada-sfx-licence-log.csv` complete. `07` item 5.9 | | |
| 7.4 | Silence cues verified in the delivered master by a second pair of ears | | |
| 7.5 | Trustee approval of the final mix | | |
| 7.6 | Event master and online master archived to both archive locations with the project file. `07` Part 10 | | |
| 7.7 | Credits updated with composer, musician and sound. `13-credits-and-acknowledgements.md` | | |

---

## Part 8 · Commands

```bash
cd anniversary-video-production/kannada/tools

python3 cue.py --check          # cue table against the timeline and placements
python3 cue.py                  # regenerate ../Kannada-cue-sheet.csv
python3 cue.py --audit-docs     # hand-typed timecodes in the markdown
python3 log.py                  # regenerate ../Kannada-sfx-licence-log.csv
python3 sfx.py --strict         # placements against the silence cues
python3 mix.py --check          # measure every effect against the narration
python3 mix.py --calibrate      # build stems, masters, previews
python3 mix.py --music bed.wav  # the same, with a licensed bed
```

---

## Related

- [`Kannada-cinematic-audio-direction.md`](Kannada-cinematic-audio-direction.md), the direction and the gates
- [`Kannada-music-map.md`](Kannada-music-map.md), the score
- [`Kannada-cue-sheet.csv`](Kannada-cue-sheet.csv), every cue at a generated timecode
- [`Kannada-sfx-licence-log.csv`](Kannada-sfx-licence-log.csv), what shipped and what is NOT CAPTURED
- [`07-final-rights-and-approval-checklist.md`](07-final-rights-and-approval-checklist.md), the approval record
- [`13-event-playback-notes.md`](13-event-playback-notes.md), the night itself
