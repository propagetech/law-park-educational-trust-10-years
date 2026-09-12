# 11 · Kannada sound design · effect sources and licence discipline

Discovery and licence guidance for sound effects in the Kannada cut. Pixabay is
the nominated source. This document does not clear anything: it tells you what
to look for, where the film refuses sound, and what to record so the Trust has a
production file it can defend later.

---

## STATUS. This document contradicts an approved decision

`07` Part 5 item **5.7** currently reads:

> No sound effects. This film does not need them.

That decision stands until the Trust revises it. Nothing in this document
overrides it, and no effect should be cut into the film while 5.7 is unrevised.

**The 14-event cap in section 3 is withdrawn.** It was set on the judgement that
past 14 "the sound design is decoration". The Trust's instruction was to place
every licensed file, so `tools/sfx.py` now allows 32 and the film holds 28
placements plus 8 ambience beds. Two files are still held out and both reasons
are recorded in `Kannada-pause-sfx-shopping-list.md`: the Submority trailer boom
is the wrong register, and the Grumpynora stinger is Content ID Registered.

Section 1 below, where the film refuses sound, is untouched and still governs.
So is the never-any-identifiable-child-voice rule, which is why the village
ambience is cut only from the one 12.5s window `tools/sfx_voicecheck.py` cleared.

**Superseded in part.** The proposal in this document has been worked up into a
five-act score and a palette at generated timecodes:

| Document | What it owns |
|---|---|
| [`Kannada-cinematic-audio-direction.md`](Kannada-cinematic-audio-direction.md) | The direction, the palette, the caps, the removals and the gates |
| [`Kannada-cue-sheet.csv`](Kannada-cue-sheet.csv) | 46 music cues and 28 effect events, generated from `timeline.json` |
| [`Kannada-music-map.md`](Kannada-music-map.md) | The score: palette, motif, intensity curve, composer deliverables |
| [`Kannada-final-mix-checklist.md`](Kannada-final-mix-checklist.md) | Mix, master, quality test and sign-off |

**Sections 1 and 4 below still govern.** Section 2 remains the sourcing table
and section 3 the shopping list, but the cue sheet, not section 2, is the record
of what is actually placed and at what level.
Treat everything below as a **proposal plus a sourcing plan**, ready to execute
the moment 5.7 is either withdrawn or amended to "sound effects permitted under
the limits in `11`".

Two consequences worth being clear about:

1. The music gate (`07` 5.1) is BLOCKING and open. Sound effects are a separate
   licence class from the music bed, and adding them adds a second licence trail
   to the same open gate rather than helping close it.
2. `06` section 7 already specifies the audio design of this film in detail, as
   a music cue sheet with deliberate silences. Sound effects were left out of it
   on purpose, not by omission.

---

## 1 · Where this film refuses sound

Read this before the source tables. These are not preferences, they are cues the
edit is built around, and an effect placed in any of them breaks the cut.

| Shot | Rule | Authority |
|---|---|---|
| `K06` | **Six seconds fully silent** under the founder's quote. Room tone only | `06` §7, `07` 5.6 |
| `K12` | **Silence** under ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. | `06` §7 |
| `K27` | **Music out completely** under ಪೂರ್ತಿ ಅಲ್ಲ. Drone returns only on the pause | `06` §7, `07` 5.6 |
| `K34` | Drone and one held note. **Nothing that could be read as sentiment.** No photograph, no face, no text | `06` §7, `14` 2.4 |
| `K37` | One gentle lift for the award, then settle. **No fanfare** | `06` §7 |
| `K43` | Lifts but **does not climax** | `06` §7, `07` 5.6 |

**Three suggestions in the source table below land directly on these cues and
must not be taken literally:**

- A low boom on the **75% card** is `K27`, a complete music-out. Put the boom on
  the `K05` title or the `2016 · 2026` line instead.
- A cinematic impact on the **award card** is `K37`, marked *no fanfare*.
- Applause in the **award section** is `K37` and `K38`. Applause under a Kannada
  narration line about gratitude reads as fanfare. If it is used at all it
  belongs under the end card, low, and never under speech.

Two further constraints that apply everywhere:

- **Never any identifiable child voice**, in ambience or foreground. `14` item
  2.4 and the consent register. Classroom and schoolyard beds must be
  unintelligible room tone or they do not go in.
- **Level.** Online -16 LUFS, event -23 LUFS, peaks no higher than -3 dBTP, and
  music at least 12 dB below narration (`14` 8.7). Effects sit at or below the
  music, never between the narration and the listener.

---

## 2 · Pixabay sources

Download two or three alternatives per category and audition them against the
real Kannada narration, not against silence. Effect quality and loudness vary
considerably between uploads.

| Effect | Use in this film | Search | What to choose |
|---|---|---|---|
| Soft cinematic boom | `K05` main title, ten-year reveal, closing logo | [cinematic boom](https://pixabay.com/sound-effects/search/cinematic%20boom/) | Short, warm, low, roughly 1 to 2 seconds. No trailer "BRAAAM" |
| Low sub boom | Under the `2016 · 2026` line only. **Not** `K27` | [sub boom](https://pixabay.com/sound-effects/search/sub%20boom/) | Round, controlled low end, no distortion. Reduce bass for the hall |
| Cinematic impact | At most one restrained accent, on the title. **Not** `K37` | [cinematic impact](https://pixabay.com/sound-effects/search/cinematic%20impact/) | "Soft impact", "documentary hit", "warm impact". Two or three times in the whole film at most |
| Gentle airy whoosh | Gold-rule animation, title transitions, selected year cards | [whoosh](https://pixabay.com/sound-effects/search/whoosh/) | Light and airy, no sharp high-frequency hiss |
| Cinematic whoosh | Act transitions only | [whoosh cinematic](https://pixabay.com/sound-effects/search/whoosh%20cinematic/) | Never between every photo |
| Wind whoosh | Slow visual movement, "journey continues" transitions | [wind whoosh](https://pixabay.com/sound-effects/search/wind%20whoosh/) | Soft movement, not storm or horror wind |
| Gentle echoing whoosh | Refined transition for title cards or logo reveal | [gentle & echoing whoosh](https://pixabay.com/sound-effects/gentle-amp-echoing-whoosh-sound-effect-451056/) | Audition very low. Reject if it sounds digital |
| Soft riser | Into the main title or the future section. **Not** the award | [riser](https://pixabay.com/sound-effects/search/riser/) | 1 to 2 second tonal riser, not an EDM build |
| Tonal swell | Archival past into present, or into the closing | [ambient swell](https://pixabay.com/sound-effects/search/ambient%20swell/) | Warm pads. No suspense or horror texture |
| Page turn | `K11` 2016 origin, archival documents, `K36` clipping | [page turn](https://pixabay.com/sound-effects/search/page%20turn/) | Dry, natural, single page, 0.5 to 1.5 seconds |
| Page flip | One "history turning" moment on a timeline card | [page flip](https://pixabay.com/sound-effects/search/page%20flip/) | Once. Not repeatedly |
| Paper rustle | Push-in on a document, certificate or `K36` clipping | [paper rustle](https://pixabay.com/sound-effects/search/paper%20rustle/) | Low in the mix, especially under narration |
| Pencil writing | Library, classroom, guidance, scholarship beats | [pencil writing](https://pixabay.com/sound-effects/search/pencil%20writing/) | Short clean foley. No desk knocks, no ASMR scratchiness |
| Pen on paper | Alternate notebook or form texture | [pen on paper](https://pixabay.com/sound-effects/search/pen%20on%20paper/) | Background texture, never a transition |
| School bell | Opening ambience, or one school timeline beat | [school bell](https://pixabay.com/sound-effects/search/school-bell/) | Distant and natural, 1 to 2 seconds. Not a classroom alarm |
| Old school bell | Nostalgic archive feel, if the image earns it | [old school bell](https://pixabay.com/sound-effects/search/old%20school%20bell/) | Only if authentic to the picture |
| Backpack zipper | School-bag distribution sequence | [backpack](https://pixabay.com/sound-effects/search/backpack/) | Under a close-up of a bag only |
| Open backpack | Alternate bag-opening visual | [open backpack](https://pixabay.com/sound-effects/search/open%20backpack/) | Brief fabric-and-zip. No bag drops |
| Books | Library shelves, books shared, reading | [book](https://pixabay.com/sound-effects/search/book/) | Page movement, book on table, soft shelf interaction |
| Classroom ambience | Library and classroom stills, short pauses | [classroom ambience](https://pixabay.com/sound-effects/search/classroom%20ambience/) | Very low, non-identifiable room tone. **No intelligible child dialogue** |
| Schoolyard ambience | Exterior school shots | [schoolyard ambience](https://pixabay.com/sound-effects/search/schoolyard%20ambience/) | Only if it matches the image and carries **no identifiable voices** |
| Gentle chime | End-card resolution, gratitude card | [gentle chime](https://pixabay.com/sound-effects/search/gentle%20chime/) | One soft warm non-electronic chime. Must resolve the film, not sound like a phone notification |
| Hand bell | Optional softer bell for title or closing | [hand bell](https://pixabay.com/sound-effects/search/hand-bell/) | Small and warm. Not temple-style, not harsh metallic |
| Soft applause | End card only, low. **Not** under `K37` speech | [applause](https://pixabay.com/sound-effects/search/applause/) | Small room, polite. Not a stadium |
| Light claps | Short acknowledgement behind the gratitude card | [clapper](https://pixabay.com/sound-effects/search/clapper/) | Subtle. No rhythmic clapping under narration |
| Footsteps | Field-visit or school-arrival visuals | [footsteps](https://pixabay.com/sound-effects/search/footsteps/) | Match the surface in the image |
| Car drive / door close | Field-trip or supplies sequence | [car ambience](https://pixabay.com/sound-effects/search/car%20ambience/) | Faint realism only. No loud engines |

These are search pages, not pinned assets. Pixabay results change over time, so
the licence log below, not this table, is the record of what actually shipped.

---

## 3 · The minimal pack

For a five-minute film, download only these ten first:

1. One warm soft boom
2. One gentle airy whoosh
3. One short tonal riser
4. One page turn
5. One pencil writing
6. One distant school bell
7. One backpack zipper
8. One light paper rustle
9. One small-room applause
10. One gentle end-card chime

**Eight to fourteen intentional effects in the whole film.** Not one per photo
transition. The film is 46 shots long; if the count climbs past fourteen, the
sound design has become decoration and `07` 5.7 was right.

---

## 4 · Licence discipline

Pixabay presents its sound effects as royalty-free and freely downloadable, but
the terms that matter are the ones live on the asset page **on the day you
download it**, and Pixabay's licence has changed before. Do not rely on a search
page or on this document as evidence of a licence.

For every effect that reaches the edit, archive on the day of download:

- A screenshot or PDF of the asset page including the visible licence text
- The exact asset title and the uploader name
- The original asset page URL, not the search URL
- The download date
- The file name as used in the edit
- The shot and timecode where it is used

Record the same fields in `Kannada-sfx-licence-log.csv`, which sits beside
this document. One row per effect per placement. The log is a `07` Part 10
archive item: it goes to both archive locations with the project file.

---

## 5 · Block to paste into an agent prompt

```text
PIXABAY SOUND-EFFECT SOURCES

Use Pixabay only as a discovery/download source. Before final export, record:
- Exact Pixabay asset title
- Creator/uploader
- Download date
- Original Pixabay page URL
- Licence status captured on the download date
- File name used in edit
- Scene/timecode where used

Recommended Pixabay searches:

Soft title boom:      https://pixabay.com/sound-effects/search/cinematic%20boom/
Low boom:             https://pixabay.com/sound-effects/search/sub%20boom/
Cinematic impact:     https://pixabay.com/sound-effects/search/cinematic%20impact/
Gentle whoosh:        https://pixabay.com/sound-effects/search/whoosh/
Cinematic whoosh:     https://pixabay.com/sound-effects/search/whoosh%20cinematic/
Wind whoosh:          https://pixabay.com/sound-effects/search/wind%20whoosh/
Soft riser:           https://pixabay.com/sound-effects/search/riser/
Ambient swell:        https://pixabay.com/sound-effects/search/ambient%20swell/
Page turn:            https://pixabay.com/sound-effects/search/page%20turn/
Paper rustle:         https://pixabay.com/sound-effects/search/paper%20rustle/
Pencil writing:       https://pixabay.com/sound-effects/search/pencil%20writing/
School bell:          https://pixabay.com/sound-effects/search/school-bell/
Backpack zipper:      https://pixabay.com/sound-effects/search/backpack/
Book handling:        https://pixabay.com/sound-effects/search/book/
Classroom ambience:   https://pixabay.com/sound-effects/search/classroom%20ambience/
Schoolyard ambience:  https://pixabay.com/sound-effects/search/schoolyard%20ambience/
Gentle chime:         https://pixabay.com/sound-effects/search/gentle%20chime/
Soft applause:        https://pixabay.com/sound-effects/search/applause/
Footsteps:            https://pixabay.com/sound-effects/search/footsteps/
Car ambience:         https://pixabay.com/sound-effects/search/car%20ambience/

SELECTION RULES
- Download 2-3 alternatives per sound category.
- Audition every effect against the final Kannada narration, not against silence.
- Keep only one cohesive sound family.
- Avoid trailer booms, aggressive risers, loud applause, EDM sounds, app-like
  notification chimes, horror ambience, or artificial child sounds.
- Never use an identifiable child voice in any ambience bed.
- Music and effects stay at least 12 dB below narration. Peaks no higher than
  -3 dBTP. Online -16 LUFS, event -23 LUFS.
- Use no more than 8-14 intentional effects in the full 5-minute Kannada film.
- Place NOTHING in the silence cues: K06, K12, K27, K34, K37 (no fanfare),
  K43 (no climax).
- Maintain the licence log at:
  video/production/kannada/Kannada-sfx-licence-log.csv

BLOCKED UNTIL 07 ITEM 5.7 IS REVISED
07 Part 5 item 5.7 currently reads "No sound effects. This film does not need
them." Do not cut any effect into the film until the Trust withdraws or amends
that item. See 11 section STATUS.
```

---

## 6 · Tooling

Pixabay sits behind a Cloudflare bot challenge, so downloads cannot be scripted
and must come from a browser. Everything after the download is automated:

```bash
# 1. drop the files in tools/sfx/, then run log.py to add their rows
# 2. list placements in tools/sfx/placements.csv, one row per placement:
#      key,file,shot,offset_s,level_rel_narr_db,gain_db,in_s,dur_s,fade_in,fade_out,note
#      k11-page,turn-a-page.mp3,K11,0.15,-14,,0,0,0,0,the 2016 origin card
python3 sfx.py --check          # validate, mix nothing
python3 sfx.py                  # build the learning mix
python3 sfx.py --strict         # also fail on K37 and K43
python3 mix.py --check          # measure every effect against the narration
python3 mix.py --calibrate      # build the stems, masters and previews
python3 cue.py                  # regenerate the cue sheet
python3 log.py                  # regenerate the licence log
```

`level_rel_narr_db` is the level the effect sits at **relative to the
narration's own speech RMS**, and it is the unit the cue sheet and the licence
log use. `gain_db` is derived from it by measurement: `mix.py --calibrate`
writes it back, so `sfx.py` and `mix.py` cannot disagree. Do not set `gain_db`
by hand.

`key` joins the placement to its row in the cue sheet and the licence log.

`offset_s` is measured from the shot's `t_in`, so placements survive a re-time.
`sfx.py` enforces section 1 of this document in code: the four silence cues are
hard failures, `K37` and `K43` warn, the 14-effect cap is enforced, and anything
louder than 12 dB under the narration is pulled down to that ceiling.

## 7 · Related

- [`Kannada-cinematic-audio-direction.md`](Kannada-cinematic-audio-direction.md), which supersedes the proposal above
- [`Kannada-cue-sheet.csv`](Kannada-cue-sheet.csv), the record of what is placed and at what level
- `06` section 7, the music cue sheet this must not fight, whose timecodes predate the build
- `07` Part 5, music and audio approvals, including the open 5.7
- `14` items 2.4, 5.1, 5.4, 8.7 in `video/research/`
- `Kannada-sfx-licence-log.csv`, the record of what actually shipped
