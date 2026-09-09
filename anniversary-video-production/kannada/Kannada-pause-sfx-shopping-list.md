# Kannada · pause-by-pause sound effect shopping list

Every pause and hold in the film, what it is sitting on, and a Pixabay search
term for it. Source: [pixabay.com/sound-effects](https://pixabay.com/sound-effects/),
which `11` nominates.

Generated against `tools/timeline.json` after the re-time to the ElevenLabs
read, so the timecodes below are the current ones. The film is now
**00:05:57:22**.

---

## STATUS, 2026-09-09 · what was downloaded and what was placed

Twelve files were downloaded with licence evidence for eleven of the cues below.
**Two were placed and two existing files were replaced**, which puts the film at
exactly the 14-effect cap. Five files are on disk, licensed and unplaced.

### Placed

| Cue | Shot | File | Excerpt |
|---|---|---|---|
| `k10-ambience` | K10 | dbsound Countryside morning sounds | `in_s 7.70`, 2.20s |
| `k46-roomtone` | K46 | kai_audio Bedroom Room Tone | `in_s 9.20`, 6.60s |

### Replaced, at no cost to the cap

Both impact cues moved off the trailer-class placeholder onto
**Universfield, Cinematic Low Hit**, 2.38s. `k05-impact` and `k23-impact`.

### Downloaded, licensed, NOT placed

The cap is the reason, not the files. Order of addition if the Trust raises it:
**K17**, then **K44**, then **K26**.

| Cue | File | Why it is waiting |
|---|---|---|
| K17 paper rustle | spinopel-paper-rustle-345748 | Cap. Also the third page-ish sound after `k11-page` and `k36-page` |
| K44 bag zip | mrstokes302-backpack-zipper-585349 | Cap. Also the second zip after `k22-zip` |
| K26 village ambience | ranjit_foley-indian-village-ambience-219221 | **Cap, and a `14` 2.4 risk.** See below |
| K04 piano note | freesound_community-1-note-piano-104171 | Cap. `11` says this beat belongs to the score, not an effect |
| K42 warm pad | gigidelaromusic-warm-pad-fragment-short-450964 | Cap, and `k41-riser` already lifts one shot earlier. Pixabay marks it AI generated |

### Three findings from vetting the files

**The village ambience contains human voices.** `tools/sfx_voicecheck.py` was
written for this and found clear speech at 65.5s, 202.0s and six other points
across the 293-second file: a 0.79 speech-band ratio with 0.32 syllable-rate
modulation is a person talking. `14` item 2.4 is absolute. The only stretch in
the calmest quartile runs 12.5s from 268.0s, so if K26 is ever placed it must
excerpt from there and a human must still confirm it by ear.

**The K46 stinger is Content ID Registered.** Pixabay labels
`grumpynora-pleasing-5-sec-edit-stinger-467228` that way. On a film the Trust
will publish, that invites a YouTube claim. Room tone was chosen instead: its
speech-band energy measures 0.00, so it carries no voice at all.

**`k10-ambience-licence-evidence.jpg` documents the wrong file.** It shows
dbsound *Insects Birds Field*, which the selection notes had already excluded,
not *Countryside morning sounds* which was placed. The correct evidence is
`licence-evidence/K10_countryside-morning-birds_licence.jpg`, and that is what
the licence log cites. Both were checked against the Pixabay pages they show.

### Licence log

Four rows in `Kannada-sfx-licence-log.csv` now carry real evidence paths and a
verified licence status, closing `07` item 5.9 for those four. **The other
twelve rows still read NOT CAPTURED.**

`07` item 5.7 still forbids sound effects and 5.8 is still unsigned, so the
output remains `narration_plus_sfx_LEARNING.wav` and
`08-kannada-elevenlabs-sfx-learning-mix.mp4`. Neither is a deliverable.

---

## Read this before you download anything

**Three things constrain this, and none of them is my preference.**

**1. Sound effects are not approved for this film.** `07` Part 5 item **5.7**
reads "No sound effects. This film does not need them", and 5.8, the row asking
the Trust to reaffirm or amend it, is unsigned. `tools/sfx.py` therefore only
ever writes `narration_plus_sfx_LEARNING.wav` and refuses to touch a master.
Nothing below is a deliverable until 5.7 is withdrawn or amended.

**2. Four of the pauses are silence cues where nothing may be placed.** These
are not preferences either. `sfx.py` refuses to build if a placement lands in
one, and refuses if an effect merely *bleeds into* one. The edit is built around
them.

**3. The film is capped at 14 effects** (`11` section 3), and
`tools/sfx/placements.csv` already holds **12**. So there are **2 slots free**,
not 18.

That last one is the real constraint on "one for every pause". 18 pauses cannot
each get an effect without either raising the cap or removing existing
placements, and `11` is explicit that past 14 "the sound design is decoration".

**Better value than filling pauses:** two of the 12 existing placements are
marked `PLACEHOLDER, trailer-class file` in `placements.csv`. Replacing those
costs zero slots and fixes something already known to be wrong. Section 3.

---

## 1 · The four pauses that must stay silent

Do not buy anything for these. There is no keyword to look for.

| Shot | Pause | Timecode | What it is | Authority |
|---|---|---|---|---|
| **K06** | 6.0s hold | 00:00:33:00 | The founder's quote card. The longest silent card in the film. No narration, no photograph. Room tone only | `06` §7, `07` 5.6 |
| **K12** | 1.0s hold | 00:01:14:08 | Under ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. | `06` §7 |
| **K27** | 2.0s pause | 00:03:05:07 | The 75 percent line, ಪೂರ್ತಿ ಅಲ್ಲ. The quietest frame in the film. Music out completely | `06` §7, `07` 5.6 |
| **K34** | 1.0s pause | 00:03:57:23 | The children who are hardest to reach. Nothing that could be read as sentiment | `14` 2.4 |

And one more to leave alone:

| **K37** | 2.0s pause | 00:04:30:22 | The award. Marked **no fanfare**. `sfx.py` warns on it and fails under `--strict` | `06` §7 |

## 2 · The two I would actually spend the slots on

### Slot 1 · K10, 2.0s pause at 00:01:04:19

A weathered village school board, immediately before the 2016 origin story. The
longest available pause outside the end card, and the one place a bed of
ambience does real work: it puts the audience in a Karnataka village before the
narration says the trust's name.

```
Pixabay search:  rural village morning ambience birds
Alternatives:    countryside morning birds distant
                 light wind field ambience
```

**Reject anything with an audible human voice**, and children's voices
absolutely: `14` item 2.4 and the consent register. A classroom or schoolyard
bed has to be unintelligible room tone or it does not go in. Look for 20 seconds
or more so `in_s` and `dur_s` can take a clean 2 second excerpt without a bird
call cut in half.

### Slot 2 · K46, 7.0s hold at 00:05:50:22, the end card

**You may already have this one.** `tools/sfx/vvqne-applause-383901.mp3` is
sitting in the folder, downloaded and unplaced.

`11` section 1 is specific: applause "if it is used at all it belongs under the
end card, low, and never under speech." K46 is the end card, it carries no
narration, and it is 7 seconds long. That is the one sanctioned home for
applause in this film, and using the file already on disk costs no new licence
trail.

```
If you would rather something softer than applause:
Pixabay search:  warm room tone soft ambience
                 gentle outro swell soft
```

Keep it low. It is the resolution of a film about children's schooling, not a
curtain call.

## 3 · Two replacements that cost no slots

Both existing impact placements use the same file, and `placements.csv` flags it
twice as wrong:

> `submority-boom-geomorphism-cinematic-trailer-sound-effects-123876.mp3`
> "PLACEHOLDER, trailer-class file"

A trailer boom is the wrong class of sound for this film, and the brief's "must
not sound like" list includes a loud movie-trailer voice for the same reason.
Replacing it fixes two placements at once.

| Cue | Shot | Timecode | What it needs |
|---|---|---|---|
| `k05-impact` | K05 | 00:00:28:00 | A soft low landing on the 2016 ರಿಂದ 2026 line |
| `k23-impact` | K23 | 00:02:39:13 | A soft low landing under ಮುನ್ನೂರು, and the 2.5s hold after it must stay clean |

```
Pixabay search:  soft cinematic low boom subtle
Alternatives:    deep soft impact minimal reverb
                 low tonal hit clean short
```

**Short decay matters more than weight.** `sfx.py` fails the build if an effect
runs over the cut into a silence cue, and K23's boom sits 2.5 seconds before a
hold. Prefer a file under 2 seconds, or plan to trim it with `dur_s`.

## 4 · The remaining pauses, and why I am not spending a slot on them

Keywords included, since you asked for one per pause. Each row says what it
would cost you.

| Shot | Pause | Timecode | Pixabay search | Why not |
|---|---|---|---|---|
| K03 | 1.0s | 00:00:15:16 | *none* | Two children laughing in close-up, the film's one moment of undirected joy. The shot note says "let the laugh sit still". A child voice is forbidden outright, and anything else replaces a real moment with a manufactured one |
| K04 | 2.0s | 00:00:19:21 | `single soft piano note` | The school-fee line, under the dignity rule. If anything goes here it should be the score, not an effect. Leave it to the composer |
| K17 | 1.0s | 00:01:47:21 | `paper rustle single sheet` | Fits the one-page COVID announcement well, but `k11-page` and `k36-page` are already page turns. A third makes the page turn a tic |
| K26 | 1.0s | 00:02:56:07 | `distant village ambience no voices` | A private conversation with children and parents. Any bed risks an intelligible voice, which `14` 2.4 forbids. Not worth the risk for 1 second |
| K42 | 1.0s | 00:05:21:01 | `soft warm string swell` | `k41-riser` already lifts into this section one shot earlier. A second lift flattens the first |
| K44 | 1.0s | 00:05:38:07 | `school bag zip single` | Good match for the classroom of children with bags, but `k22-zip` already used a backpack at MM Hills. Repetition again |

If the Trust raises the cap, my order of addition would be **K17**, then
**K44**, then **K26**.

## 5 · What to do once you have downloaded one

**Keep the Pixabay filename.** The convention in `tools/sfx/` is
`uploader-title-id.mp3`, and the licence log reconstructs the Pixabay URL from
it. Renaming breaks that trail.

1. Save into `anniversary-video-production/kannada/tools/sfx/`.
2. Tell me the filename and which cue it is for. I will add the
   `tools/sfx/placements.csv` row, pick `offset_s`, `gain_db`, `in_s`, `dur_s`
   and the fades, and run `python3 sfx.py --check` before mixing.
3. Capture the licence evidence **on the day you download it**. The existing log
   has `NOT CAPTURED` in `licence_status_on_download_date` and
   `licence_evidence_file` for all 12 rows, and `07` item 5.9 wants that closed.
   A saved screenshot or PDF of the Pixabay licence panel is enough.

The licence log columns are:

```
cue_key, status, asset_title, uploader, pixabay_page_url, download_date,
licence_status_on_download_date, licence_evidence_file, edit_file_name, shot,
timecode_in, offset_s, excerpt_in_s, duration_s, level_db_rel_narration,
gain_db_applied, fade_in_s, fade_out_s, approved_by, notes
```

## 6 · Level, so nothing here fights the Kannada

`14` item 8.7 and `sfx.py` both enforce this: effects sit at least **12 dB under
the narration**, and `sfx.py` will pull a file down automatically and tell you
it did. Online master `-16 LUFS`, event master `-23 LUFS`, peaks no higher than
`-3 dBTP`.

Effects sit at or below the music, never between the narration and the listener.

## 7 · Also unplaced in the folder

Downloaded, unused, and worth knowing about before you buy anything new:

| File | Thought |
|---|---|
| `vvqne-applause-383901.mp3` | Section 2, slot 2. The end card |
| `audiopapkin-riser-hit-sfx-001-289802.mp3` | A riser-plus-hit. Could serve `k05-impact` if the hit is soft enough. Audition before downloading anything |
| `soundreality-riser-wildfire-285209.mp3` and three duplicates | Four copies of one file. The duplicates are download artefacts and should be deleted; "wildfire" is the wrong register for this film |
