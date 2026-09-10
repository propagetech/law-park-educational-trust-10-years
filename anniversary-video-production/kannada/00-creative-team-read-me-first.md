# 00 · Read me first · for the creative team

You are holding the whole pack for the Law Park Educational Trust 10-year Kannada
welcome film: every document, every build script, and the 34 photographs the cut
is made from. There is no code repository to ask for. This is all of it.

---

## 1 · The video you were shown is a reference, not a render

**[V3 Kannada 2160p review](https://youtu.be/IQMH4r-9tcs)** exists so that pacing,
shot order, on-screen Kannada and the placement of sound can be judged. It is not
a finished film. Nobody should publish it, re-post it, or hand it to a printer, a
sponsor or a news desk.

What is temporary in it:

| In the reference cut | Why it is not final |
|---|---|
| The narration | A synthetic ElevenLabs Kannada read. No human narrator is cast. `02` is the audition instrument |
| Music | There is none, because no licence has been cleared. `14` item 5.1 is BLOCKING |
| Sound effects | 14 cues, an audition sitting under an unsigned Trust decision, `07` item 5.8. Two are placeholder files |
| Several photographs | Stand-ins, because the picture uses the consent fallback |
| The grade | One pass only. Exposure and white balance still jump between 2016 and 2025 |

Nothing in it is cleared for public screening. Every gate in
[`07-final-rights-and-approval-checklist.md`](07-final-rights-and-approval-checklist.md)
still stands.

**Do not cut from the YouTube stream.** It is a re-compression of a re-compression.
Work from the files in this pack.

---

## 2 · If you do not like the cut, make your own

That is the expected outcome, not a failure. The reference cut is one reading of
the brief. You have everything you need to throw it away and plan the film your
own way:

- **The facts are settled and sourced.** [`01-source-of-truth.md`](../../anniversary-video-research/01-source-of-truth.md)
  and [`02-evidence-table.csv`](../../anniversary-video-research/02-evidence-table.csv)
  back every claim. Do not invent a number that is not in there.
- **The words are approved.** [`01-kannada-final-script.md`](01-kannada-final-script.md)
  is the approved Kannada narration and
  [`04-kannada-onscreen-text.md`](04-kannada-onscreen-text.md) is every on-screen
  string exactly as it appears. Changing either needs trustee sign-off.
- **The brief holds even if the cut does not.** [`07-bilingual-creative-brief.md`](../../anniversary-video-research/07-bilingual-creative-brief.md)
  carries tone, typography and the words that are never used.
- **Consent decides what you may show.** [`04-media-inventory.csv`](../../anniversary-video-research/04-media-inventory.csv)
  gives the status of every photograph. A still marked blocked stays out of any
  cut, yours included.

Inside those four constraints, the structure, the shot order, the graphics
language and the sound are yours to redesign.

---

## 3 · If you want to re-cut this one instead

Three files first:

1. **[`tools/timeline.json`](tools/timeline.json)** is the timing source of truth.
   46 shots with in and out points, durations, narration, holds, pauses, crop
   windows, motion, transitions, consent status and the music cue for every one.
   Every other document and every render is derived from it.
2. **[`06-kannada-edit-decision-list.md`](06-kannada-edit-decision-list.md)** is
   the same cut as a plain-text EDL, so the film can be rebuilt in five years
   without a project file.
3. **[`Kannada-cue-sheet.csv`](Kannada-cue-sheet.csv)** is the audio: 46 music
   cues and 28 effect events.

If you re-time anything, re-derive rather than re-type. Run `python3 cue.py` and
`python3 cue.py --audit-docs` afterwards. The film has already moved twice and
hand-typed timecodes went stale within the hour.

---

## 4 · Rebuilding the film from this pack

Unzip anywhere. The scripts find their own way from where they sit, so the
folder layout inside the zip has to stay as it is. You need Python 3, ffmpeg and
Playwright. About 13 minutes on a recent laptop.

```
cd anniversary-video-production/kannada/tools

python3 gfx.py ../05-kannada-subtitles.srt --scale 2
python3 film.py silent.mp4
python3 stem.py <VOICE_ID>          # needs your own ElevenLabs key, or skip and drop in a human read
python3 sfx.py --strict             # needs the effect files, see the licence log
python3 mix.py --calibrate
python3 master.py                   # 4K review master
python3 master.py --check           # what still blocks a release
```

`master.py --release` is the only path to a publishable file, and it refuses to
run while any of the five gates is open.

[`tools/README.md`](tools/README.md) says what every script does and in what
order. What is not in the pack, because all of it is reproducible:

| Missing | Rebuild it with |
|---|---|
| Every `.mp4` | `python3 film.py`, then `master.py` |
| `tools/gfx/`, the cards | `python3 gfx.py ../05-kannada-subtitles.srt --scale 2` |
| `tools/stills/`, the crops | `python3 film.py` makes them on the way through |
| The narration `.wav` | `python3 stem.py <VOICE_ID>` |
| Stems, masters, previews | `python3 mix.py --calibrate` |
| The effect `.mp3` files | Download from the URLs in [`Kannada-sfx-licence-log.csv`](Kannada-sfx-licence-log.csv) |
| The music bed | **Does not exist.** See [`Kannada-music-map.md`](Kannada-music-map.md), section 6 |

---

## 5 · Where to send notes

The hand-off page is the single door for this project:
**https://journey.lawparkeducationaltrust.org/anniversary-video-production/kannada/team-handoff**

It carries the player, the trustee feedback form, the role briefs, the shot list
with per-shot consent status, and the download links that brought you here. Send
notes and questions back through it, not by editing files in this pack.
