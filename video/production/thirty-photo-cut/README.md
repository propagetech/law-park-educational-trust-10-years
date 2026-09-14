# 30-photo cut · Law Park Educational Trust · Ten Years

A second cut of the anniversary film, built on one rule: **every shot is a
full-bleed photograph with the heading composited over it.** No graphics cards,
no plates, no interruption. Thirty photographs, thirty headings, one timeline
that both languages share.

```
1920x1080 · 25 fps · 00:05:00:00 · 7,500 frames
30 shots from photo-pack-10-years/enhanced/ · all 30 files, each used once
8 ambience beds · 19 effect accents · 4 written silences
English 523 words at 140 wpm · Kannada 1,253 display clusters
```

The picture cut is identical in both languages. Every Kannada line is written to
the same shot length as its English counterpart, so one render carries either
narration without moving a frame.

---

## What is here

| File | What it is |
|---|---|
| [`01-english-transcript.md`](01-english-transcript.md) | The English narration, record-ready, act by act |
| [`02-kannada-transcript.md`](02-kannada-transcript.md) | The Kannada narration, record-ready, act by act |
| [`03-shot-timeline.md`](03-shot-timeline.md) | The shot-by-shot timeline: photograph, what is in frame, both headings, both narrations, sound, consent, direction |
| [`04-onscreen-headings.md`](04-onscreen-headings.md) | Every foreground heading in running order, both languages, with the type direction and the approval gates |
| [`05-english-subtitles.srt`](05-english-subtitles.srt) / `.vtt` | 55 cues |
| [`06-kannada-subtitles.srt`](06-kannada-subtitles.srt) / `.vtt` | 54 cues |
| [`sfx-placements.csv`](sfx-placements.csv) | One row per bed, accent and silence, with level and fades |
| [`cue-sheet.csv`](cue-sheet.csv) | The audio cue sheet joined to the picture |
| [`timeline-30-photos.json`](timeline-30-photos.json) | The machine-readable cut, for the renderer |
| `tools/shots.py` | **The source.** One entry per shot |
| `tools/build.py` | Generates everything above |
| `tools/preview.py` | Renders the cut as a browsable HTML review page |

## Rebuilding

```bash
python3 tools/build.py --check   # validate, write nothing
python3 tools/build.py           # write every deliverable
```

## The review page

Neither the transcripts nor the timeline show what the film actually looks like,
so `preview.py` renders the cut as an HTML page: every shot as its real 16:9
crop with the heading composited over it, an English and Kannada toggle, and the
sound events, consent state and direction beside each frame. It is the fastest
way to judge whether a heading sits well on its photograph.

```bash
python3 tools/preview.py preview                            # index.html plus img/
python3 tools/preview.py ten-years-thirty-frames.html --inline   # one file, 4 MB
```

The folder form is the one to host, or to open from a checkout. The `--inline`
form embeds every frame as a data URI, so it is a single file that can be
emailed to a trustee or opened from a USB stick with nothing beside it. Both are
complete HTML documents; `--fragment` drops the document shell for publishing
the same page as an Artifact, where the host supplies its own.

Neither output is committed. They are regenerated from the photo pack in a few
seconds, and `.gitignore` in this folder keeps 5 MB of JPEG out of the history,
the same rule the Kannada pack applies to video.

The only thing the page needs from the network is the Google Fonts stylesheet
for Playfair Display, IBM Plex and Noto Sans Kannada. Offline it falls back to
system faces and stays readable, Kannada included.

Nothing in this folder is hand-edited. Change `tools/shots.py` and re-run, and
the timeline, both transcripts, both caption sets, the heading sheet and both
CSVs move together. This is the same discipline as the Kannada pack: if a
narration line changes, re-derive, do not edit the timecode in six documents.

`build.py` refuses to write when any of these fail:

- the cut does not total 300.00 s, or does not land on a whole frame
- a photograph is missing, or is used in two shots
- either narration overruns its shot, leaving under 0.25 s of air
- an em dash or an en dash appears anywhere
- a sound effect lands inside a written silence, or sits closer than 12 dB under the narration
- a subtitle line is over 42 characters in English or 32 display clusters in Kannada, or a cue is under 1.8 s

## How the two languages are kept on one cut

English is written to **140 wpm**, the pace the English script sets.

Kannada is not measured in words. Kannada word length varies enormously, and a
five-word line can take longer to say than a twelve-word one, so duration is
measured in **display clusters** with digits weighted at 3.25 clusters each,
because a year is spoken as number words. That model is not invented here:
`build.py` reads all 43 narration lines out of the approved Kannada cut
(`../kannada/tools/timeline.json`), measures seconds of speech per cluster
across them, and uses that measured constant to check every line in this cut.
It currently measures **0.1914 s per cluster**. See section 2 of
`../kannada/08-kannada-animatic-notes.md` for the evidence behind clusters.

Kannada runs denser than English here: 239.7 s of speech against 224.1 s in the
same 300 s. Shot lengths were set to the Kannada read, so the English narration
has a little more air on most shots. That is the right way round for an event
hall.

---

## The shape of the film

| Act | Shots | Run | What it does |
|---|---|---|---|
| 1 · The walk to school | S01 to S04 | 36 s | The school, the bag, the fee, the promise. The title and the founder quote sit here |
| 2 · How it started | S05 to S09 | 51 s | Two founders, the 2016 visit, 150 steel plates, 2017 |
| 3 · A decade of showing up | S10 to S16 | 67 s | 2018 to 2023. The ordinary years, the pandemic, the libraries, career guidance, the wider map |
| 4 · The way the work is done | S17 to S21 | 51 s | The method, the 75 per cent, what goes in a bag, M.M. Hills |
| 5 · The widening circle | S22 to S26 | 48 s | H.D. Kote, the classroom, the play, the partners |
| 6 · Gratitude, and the next ten | S27 to S30 | 47 s | Volunteers, donors, recognition, the welcome |

## Sound

The palette is the one already licensed and logged for the Kannada cut, in
`../kannada/tools/sfx/`. Nothing new is introduced, and every level is expressed
the way the house cue sheet expresses it: dB relative to the narration's own
speech RMS, never closer than 12 dB under the voice.

**Four written silences**, and `build.py` fails the build if an effect lands in
one:

| Shot | Window | Voice | Why |
|---|---|---|---|
| `S03` | 1.4 s | out | The film's premise, *a school fee decides*, lands dry |
| `S07` | 1.9 s | out | *One child. One scholarship.* is left to stand alone |
| `S18` | 1.5 s | running | The score drops out under *Not all of it*. The 25 per cent the family pays is the point of the sentence |
| `S29` | 11.0 s | running | **No fanfare** under the award. One soft lift on the heading, then nothing builds |

Three effects the cut wants and the library does not hold are listed at the foot
of `03-shot-timeline.md`. Source them, archive the licence evidence on the day of
download, add the row to `../kannada/Kannada-sfx-licence-log.csv`, then place
them. Until then `S08` carries no accent and `S30` resolves on a piano note.

---

## Open gates. Read before rendering

1. **Consent.** 24 of the 30 shots are marked BLOCKING in the register carried
   forward from the approved cut. `S03`, `S24` and `S26` are the critical ones:
   a close-up of two identifiable children, a classroom of about thirty-five,
   and a frame over which a health-status claim is spoken. `07` item 1.1 and
   `14` Part 12 govern. This cut has no face-free fallback pool yet; the Kannada
   pack's `film.py --fallback` is the pattern to copy if one is needed.
2. **Partner names.** The `S26` heading lists four partners. Written permission
   to display each name and mark is still required: `14` item 2.2.
3. **Award line.** The `S29` heading states the award, the date and the awarding
   body. Confirm the wording, and do not name presenting ministers: `06` Q3.
4. **Founder quote.** Confirm the `S04` wording as the founder wants it
   attributed.
5. **Enhanced renders.** These are AI cleanups of phone frames. A trustee
   face-check is required before picture lock, and `S01` and `S02` both carry
   Kannada board lettering that must be verified on the enhanced render. If any
   face drifts, grade the original in the NLE instead: the originals rebuild
   from `assets/` with `node video/scripts/sync-photo-pack.mjs`.
6. **Third-party marks.** `S15` carries a project mark on the guidance chart,
   `S19` carries brand packaging, and `S28` carries a third-party school name on
   a banner. Crop or clear all three before picture lock.

## What this cut deliberately does not say

No cumulative student, village or district total appears anywhere, in narration
or in a heading. Those figures conflict four ways across the repository. See
`../../research/06-fact-check-and-trustee-questions.md` question 1.

Three photographs in the wider pack are text-critical and were deliberately not
AI-enhanced: the 2020 relief poster, the Udayavani clipping and the award
certificate. They are therefore not in `enhanced/` and not in this cut. The
pandemic beat rides on the 2021 crowd photograph with a heading that names both
years, and the recognition beat is carried as text over a school. If the Trust
wants the documents themselves on screen, take the un-enhanced originals from
the pack root and re-derive.

## Relationship to the Kannada cut

This does not replace `../kannada/`. That cut is 46 shots, mixes photographs
with 138 rendered Kannada graphics cards, runs 00:05:36:01, and is the approved
event master. This is a shorter, photograph-only alternative built to a single
presentation rule, sharing its photo pack, its sound library, its consent
register, its claim ids and its pace model.
