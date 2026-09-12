#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Builds the cinematic audio cue sheet from timeline.json.

  python3 cue.py              writes ../Kannada-cue-sheet.csv
  python3 cue.py --check      validate the cue table against the timeline only
  python3 cue.py --audit-docs check every shot-and-timecode pair written by hand
                              in the audio markdown against timeline.json

WHY THIS IS GENERATED
`06` section 7 was written against the pre-build plan, which ran 00:05:03:21.
The film that actually rendered runs 00:05:36:01, because build_timeline.py
--from-audio re-derived every shot against the real ElevenLabs read. Every
music timecode in `06` section 7 is therefore between 2 and 33 seconds early.
A hand-typed cue sheet would inherit that drift and hand it to a composer.
This joins the cue table below to timeline.json, so the timecodes are the
timecodes of the film on disk and survive the next re-time.

WHAT IS AUTHORITY AND WHAT IS NOT
timeline.json owns the timecodes, the shot order, the narration and the holds.
MUSIC and SFX below own the audio intent, and every level, silence and refusal
in them traces to `06` section 7, `07` Part 5, `11` section 1 or `14` item 8.7.
Nothing here may add a cue inside a silence cue: --check fails if it does.
"""
import argparse
import csv
import json
import os
import re
import sys

PLACEMENTS = os.path.join("sfx", "placements.csv")

HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.dirname(HERE)
OUT = os.path.join(PACK, "Kannada-cue-sheet.csv")
FPS = 25

# `06` section 7, `07` items 5.6 and 5.10. No cue of any kind inside these.
SILENT = {
    "K06": "six seconds fully silent under the founder's quote",
    "K12": "silence under ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ.",
    "K27": "music out completely under ಪೂರ್ತಿ ಅಲ್ಲ.",
    "K34": "drone and one held note, nothing that could be read as sentiment",
}

ACTS = [
    ("1", "ಆರಂಭ · the child and the question", "K01", "K06"),
    ("2", "2016 · one beginning", "K07", "K13"),
    ("3", "ಒಂದು ದಶಕದ ಹಾದಿ · ten years of showing up", "K14", "K25"),
    ("4", "ಕೆಲಸದ ಕ್ರಮ · method, care and community", "K26", "K40"),
    ("5", "ಮುಂದಿನ ದಾರಿ · future and anniversary welcome", "K41", "K46"),
]

# shot: (intensity, level_db_rel_narration, fade, cue)
# Intensity is a 1 to 5 scale. This film never reaches 5, by design: `06`
# section 7 refuses a climax at K43, so nothing before it may claim one either.
MUSIC = {
 "K01": (1, "-30 rising to -24", "in 4.0s from silence",
   "Low near-static drone. Solo bansuri enters on one breath, no phrase yet"),
 "K02": (2, "-26", "-",
   "Bansuri states the four-note motif for the first time, unaccompanied"),
 "K03": (1, "-28", "-",
   "Motif stops mid-phrase. Drone alone under ಬುದ್ಧಿ ಇದೆ / ಹಂಬಲ ಇದೆ"),
 "K04": (1, "-26", "-",
   "Melody out. Drone alone under the school-fee line, then the 2s pause"),
 "K05": (2, "-24", "out 0.8s",
   "Drone lifts a fifth under the title, resolves to a single held bansuri note"),
 "K06": (0, "silent", "out complete by {t_in}",
   "MUSIC OUT COMPLETELY. Room tone only, six seconds, under the founder's quote"),
 "K07": (2, "-26", "in 1.2s",
   "Bansuri returns, same motif, warmer register"),
 "K08": (2, "-26", "-",
   "One low cello note enters under the founder. Felt piano, single notes, sparse"),
 "K09": (2, "-26", "-",
   "Cello holds. Piano answers the bansuri motif once, an octave down"),
 "K10": (1, "-28", "out 1.5s",
   "Thins to drone across the 2s pause. Piano out"),
 "K11": (2, "-27", "in 0.8s",
   "Felt piano alone, three notes, no drone swell. The archive beat"),
 "K12": (0, "silent", "out complete by {t_in}",
   "SILENCE. The line lands on its own, then 1.0s hold before the cut"),
 "K13": (1, "-30", "in 2.0s",
   "Drone alone returns, very low. No melody under the steel plates line"),
 "K14": (3, "-24", "in 1.5s",
   "ACT 3. Melody enters properly for the first time. Bansuri and piano together"),
 "K15": (3, "-24", "-",
   "Motif repeats with a small variation each year. Cello counter-line enters"),
 "K16": (1, "-28", "out 2.0s",
   "Falls away to a single held note for 2020"),
 "K17": (1, "-28", "-",
   "Drone only through the relief poster. No sad piano, no swell, nothing added"),
 "K18": (3, "-24", "in 1.5s",
   "Melody returns warmer for the libraries. Piano takes the motif"),
 "K19": (3, "-24", "-", "Strings enter as a soft bed under the books"),
 "K20": (3, "-23", "-", "Bansuri and strings together as the reach widens"),
 "K21": (3, "-23", "-",
   "Motif holds steady. No lift under the career-guidance line"),
 "K22": (4, "-22", "-",
   "Builds, restrained. Soft frame drum enters for the first and only time. "
   "NO SWELL ON THE NUMBERS"),
 "K23": (4, "-20", "-",
   "The film's highest point. Warm land under ಮುನ್ನೂರು, then holds through the "
   "2.5s silence without filling it"),
 "K24": (2, "-26", "out 1.0s",
   "Percussion out. Thins to a single bansuri line"),
 "K25": (2, "-26", "-", "One line only, unhurried, into the method section"),
 "K26": (2, "-26", "-",
   "ACT 4. Rhythmic movement gone. Warm cello, quiet piano, soft drone"),
 "K27": (0, "silent, then -30", "out complete by {t_in}, in 3.0s on the pause",
   "MUSIC OUT COMPLETELY under ಪೂರ್ತಿ ಅಲ್ಲ. Drone alone returns on the 2s pause"),
 "K28": (1, "-28", "-", "Drone only under the family's share"),
 "K29": (2, "-26", "in 1.0s",
   "Bansuri returns softly. ONE low tonal emphasis, cello or bansuri tonic, "
   "under ಬೇರೆ ಯಾರ ಕೈಗೂ ಅಲ್ಲ. Score event, not an effect"),
 "K30": (2, "-25", "-", "Piano and cello, low and close, no lift"),
 "K31": (3, "-24", "-", "Tempo lifts slightly for the programmes"),
 "K32": (3, "-24", "-", "Motif in the piano, bansuri answering"),
 "K33": (3, "-24", "out 1.5s", "Holds, then begins to withdraw before the card"),
 "K34": (1, "-28", "in 2.0s",
   "RESTRAINED. Drone and one held bansuri note. Nothing that could be read as "
   "sentiment. No piano, no strings, no movement, no effect, no ambience change"),
 "K35": (3, "-25", "in 1.5s", "Warmer under the partners card. Strings return"),
 "K36": (3, "-25", "-", "Holds. No swell under the newspaper clipping"),
 "K37": (3, "-22", "-",
   "ONE gentle lift for the award, then settle. NO FANFARE, no brass, no cymbal, "
   "no chime, no applause"),
 "K38": (3, "-22", "in 2.0s",
   "Piano or nylon guitar enters for the first time. The gratitude section"),
 "K39": (3, "-22", "-", "Strings warm underneath. Bansuri rests"),
 "K40": (3, "-22", "-", "Motif returns in the piano, quietly, under the parents"),
 "K41": (4, "-20", "-",
   "ACT 5. Opens up. Piano and bansuri together. Low pulse returns as forward "
   "movement, not as rhythm"),
 "K42": (3, "-21", "-", "Holds open. One rising interval, not a modulation"),
 "K43": (4, "-20", "-",
   "Lifts, but DOES NOT CLIMAX. No added percussion, no cymbal, no key change, "
   "no octave doubling"),
 "K44": (3, "-22", "-", "Resolves, unhurried"),
 "K45": (2, "-24", "-",
   "Steps down 2 dB under the welcome line so the narrator is central. "
   "Sustain only, no new material"),
 "K46": (2, "to silent", "out 3.0s natural",
   "Final warm chord across the end card, then a natural fade to silence over "
   "2 to 3 seconds. No boom, no hard cut after the logo"),
}

# key, shot, cue, source, note. The key joins to sfx/placements.csv, which owns
# the offset, the level relative to narration and the fades: mix.py derives the
# gain from that level by measurement, so a level typed here as well would be a
# second version of the truth. A row with no placement is PENDING and carries
# its own intended offset, level and fades in `pending`.
#
# 28 placements: 20 accents and 8 ambience beds. `11` section 3 capped the film
# at 14 accents and no bed, and that cap is withdrawn on the Trust's instruction
# to place every licensed file. The counts that used to justify each slot are
# gone with it; what is left is that each row still has to say why it is here.
#
# The beds are the change that matters. Fourteen point effects in 357.88 seconds
# left the narration with nothing underneath it, and each one measured 0.00 to
# 0.19 dB of contribution against the voice. Across the 28 gaps between lines
# the film went from -60.5 dBFS to -38.2 dBFS once the beds were in.
SFX = [
 # ---------------------------------------------------------------- beds
 ("bed-film-roomtone", "K01", "Neutral room tone, the floor under the whole film",
  "https://pixabay.com/sound-effects/household-bedroom-room-tone-446021/",
  "kai_audio Bedroom Room Tone, tiled across all 357.88s. Speech-band energy "
  "measures 0.00, so it carries no voice at all. Carved automatically at K06, "
  "K12, K27 and K34 with a 0.40s fade either side, so the written silences stay "
  "a true -120 dBFS", None),
 ("bed-act1-morning", "K01", "Village morning under act 1",
  "https://pixabay.com/sound-effects/nature-countryside-morning-sounds-246032/",
  "dbsound Countryside morning sounds. Puts the audience in a Karnataka village "
  "before the narration names the trust, which is what the single 2.2s spot at "
  "K10 used to attempt in isolation", None),
 ("bed-act2-village", "K07", "The same morning, lower, under act 2",
  "https://pixabay.com/sound-effects/nature-countryside-morning-sounds-246032/",
  "2016, the origin story. Deliberately the same recording as act 1 and 3 dB "
  "further down, so the beginning stays in the same place as the opening", None),
 ("bed-act3-field", "K14", "Open field wind under act 3",
  "https://pixabay.com/sound-effects/nature-open-field-winds-summer-ambience-64761/",
  "Ten years of showing up. sfx_voicecheck.py puts its 3-8Hz modulation at 0.151 "
  "peak, no syllable rate anywhere, so this is wind and not people", None),
 ("bed-act4-insects", "K26", "Insects and birds under act 4",
  "https://pixabay.com/sound-effects/nature-insects-birds-field-596099/",
  "Method and care. Excerpt taken from 100s, clear of the 89-97s stretch where "
  "the speech band rises; modulation there is 0.05-0.10, which is tonal insects "
  "rather than syllables, but the excerpt avoids it anyway", None),
 ("bed-act4-village", "K30", "Indian village ambience under the field work",
  "https://pixabay.com/sound-effects/indian-village-ambience-219221/",
  "CUT ONLY FROM 268.0s, and this is not a preference. sfx_voicecheck.py found "
  "clear speech at 65.5s, 202.0s and six other points in this file; 268.0s "
  "begins the one 12.5s run in the calmest quartile. `14` item 2.4 is absolute "
  "and a human must still confirm the shipped excerpt by ear", None),
 ("bed-act5-spring", "K38", "Tonal lift under gratitude and coverage",
  "https://pixabay.com/sound-effects/spring-is-coming-25sec-596343/",
  "Sits below the pad it hands over to, and resolves into act 5", None),
 ("bed-act5-pad", "K41", "Warm pad across act 5 and the end card",
  "https://pixabay.com/sound-effects/warm-pad-fragment-short-450964/",
  "The K42 swell the shopping list asked for, spread across the act instead of "
  "spent on one shot. Pixabay marks this file AI generated", None),
 # ---------------------------------------------------------------- accents
 ("k01-bell", "K01", "Distant school bell, once in the film",
  "https://pixabay.com/sound-effects/school-bell-199584/",
  "Under picture with no narration. The only bell in the film, and one of four "
  "effects that play at a stated solo level because there is no voice to duck "
  "beneath: -20 dBFS", None),
 ("k04-piano", "K04", "One piano note on the school-fee line",
  "https://pixabay.com/sound-effects/1-note-piano-104171/",
  "Under the dignity rule, into the 2s pause. `11` wanted this beat to belong "
  "to the score; there is no score, so it goes here. Solo -24 dBFS", None),
 ("k05-riser", "K05", "Soft warm tonal riser into the title",
  "https://pixabay.com/sound-effects/dreamy-cinematic-riser-523158/",
  "Resolves into the wordmark reveal at K05 +0.6s, before the subtitle at +1.6s",
  None),
 ("k05-impact", "K05", "Soft warm low impact on the 2016 ರಿಂದ 2026 line",
  "https://pixabay.com/sound-effects/cinematic-low-hit-291095/",
  "Universfield Cinematic Low Hit, 2.38s. Replaced the trailer-class "
  "placeholder `11` rejected by name. `11` puts the low impact on this line "
  "and nowhere near K27. Impact 1 of 2", None),
 ("k07-whoosh", "K07", "Gentle airy whoosh on the gold rule",
  "https://pixabay.com/sound-effects/gentle-amp-echoing-whoosh-sound-effect-451056/",
  "Whoosh 1 of 3. On the rule, not on the cut", None),
 ("k11-page", "K11", "Single page turn, archival",
  "https://pixabay.com/sound-effects/turn-a-page-336933/",
  "The 2016 first school visit. Dry, one page. The loudest accent in the film "
  "relative to the voice at -13, because it is the only one carrying a story "
  "beat on its own", None),
 ("k15-whoosh", "K15", "Gentle airy whoosh into the 2s pause",
  "https://pixabay.com/sound-effects/gentle-amp-echoing-whoosh-sound-effect-451056/",
  "Whoosh 2 of 3. The act 2 into act 3 transition, under no narration, so it "
  "plays at a solo -23 dBFS", None),
 ("k17-rustle", "K17", "Paper rustle on the one-page announcement",
  "https://pixabay.com/sound-effects/paper-rustle-345748/",
  "The COVID relief poster. `11` held this back as a third page-ish sound after "
  "K11 and K36; at 2.6s of rustle rather than a turn it does not read as a "
  "third page turn", None),
 ("k18-book", "K18", "Book handled, shelf",
  "https://pixabay.com/sound-effects/turn-a-page-336933/",
  "Library. The page turn stands in as the book proxy until a real book file "
  "is auditioned: https://pixabay.com/sound-effects/search/book/", None),
 ("k21-riser", "K21", "Low swell into the MM Hills reveal",
  "https://pixabay.com/sound-effects/riser-hit-sfx-001-289802/",
  "The riser-plus-hit `11` section 7 said to audition before buying anything "
  "new. Kept under the whoosh family in level so it reads as a swell and not "
  "as a trailer cue", None),
 ("k22-zip", "K22", "School bag zip",
  "https://pixabay.com/sound-effects/backpack-34942/",
  "Two hundred school bags at MM Hills. Under a bag close-up only", None),
 ("k23-impact", "K23", "Soft warm low land under ಮುನ್ನೂರು",
  "https://pixabay.com/sound-effects/cinematic-low-hit-291095/",
  "Universfield Cinematic Low Hit, trimmed to 1.40s. Lands on the number, then "
  "the 2.5s hold after it stays clean. Impact 2 of 2", None),
 ("k28-thud", "K28", "One soft windy landing on the act 4 turn",
  "https://pixabay.com/sound-effects/hit-windy-thud-399086/",
  "Act 4 opens by removing the percussion, so the turn gets one landing and "
  "nothing else", None),
 ("k29-card", "K29", "Soft landing on the card reveal",
  "https://pixabay.com/sound-effects/electronic-impact-soft-10019/",
  "Chosen over the low hit so that the film's two impacts stay its only two",
  None),
 ("k30-swell", "K30", "Low swell under the field work",
  "https://pixabay.com/sound-effects/riser-wildfire-285209/",
  "`11` rejected this file as the wrong register at full level. At -20 under "
  "the voice and cut from its tail it reads as air rather than fire, and it is "
  "the first accent to cut if it announces itself", None),
 ("k35-whoosh", "K35", "Gentle airy whoosh on the partners card",
  "https://pixabay.com/sound-effects/gentle-amp-echoing-whoosh-sound-effect-451056/",
  "Whoosh 3 of 3. Lower than K07 because this card is denser", None),
 ("k36-page", "K36", "Single page turn, newspaper",
  "https://pixabay.com/sound-effects/turn-a-page-336933/",
  "The Udayavani clipping, 19 June 2024", None),
 ("k41-riser", "K41", "Soft warm riser into the future section",
  "https://pixabay.com/sound-effects/dreamy-cinematic-riser-523158/",
  "A different, quieter excerpt of the K05 riser. The first effect to cut if "
  "it fights the line", None),
 ("k44-zip", "K44", "School bag zip, the classroom",
  "https://pixabay.com/sound-effects/backpack-zipper-sfx-mrstokes302-585349/",
  "A different zip from K22, so the pair does not read as one sound used twice",
  None),
 ("k46-applause", "K46", "Soft applause under the end card",
  "https://pixabay.com/sound-effects/applause-383901/",
  "`11` section 1 gives applause exactly one home in this film: under the end "
  "card, low, and never under speech. This is it. Solo -26 dBFS, and it is the "
  "resolution of a film about children's schooling, not a curtain call", None),
]

COLS = ["timecode", "seconds", "shot", "act", "visual_scene", "narration_line",
        "music_cue", "music_intensity_1_5", "music_level_db_rel_narration",
        "music_fade", "sfx_cue", "sfx_source", "sfx_level_db_rel_narration",
        "sfx_fade", "notes"]


def tc(t):
    f = int(round(t * FPS))
    return "%02d:%02d:%02d:%02d" % (f // (3600 * FPS), f // (60 * FPS) % 60,
                                    f // FPS % 60, f % FPS)


def scene(sh):
    if sh["kind"] == "CARD" or not sh["path"]:
        label = re.sub(r"\s+", " ", (sh["osd"] or "typographic card")).strip()
        return f"CARD {sh['asset']} · {label[:70]}"
    name = os.path.basename(sh["path"]).rsplit(".", 1)[0].replace("-", " ")
    return f"{sh['kind']} {sh['asset']} · {name}"


# Markdown prose cannot be generated, so the timecodes in it are typed by hand
# and go stale on the next re-time. Three had already drifted by the time this
# check was written, which is the whole argument for having it.
DOCS = ["Kannada-cinematic-audio-direction.md", "Kannada-music-map.md",
        "Kannada-final-mix-checklist.md"]
SHOT = re.compile(r"`(K\d\d)`")
TCODE = re.compile(r"\b(\d\d:\d\d:\d\d:\d\d)\b")


def audit_docs(tl):
    """Every timecode on a line must be the in or out point of some shot named
    on that same line. Line-scoped rather than nearest-pair, because prose
    writes ranges: "K41 to K44 | 00:04:51:19" is K41's in point and correct."""
    by = {s["sid"]: s for s in tl}
    # The film's own head and tail are boundaries, not per-shot claims: a line
    # saying a bed starts at 00:00:00:00 is not asserting anything about a shot.
    always = {tl[0]["tc_in"], tl[-1]["tc_out"]}
    bad, seen = [], 0
    for name in DOCS:
        path = os.path.join(PACK, name)
        if not os.path.exists(path):
            bad.append(f"{name} does not exist")
            continue
        for n, line in enumerate(open(path, encoding="utf-8"), 1):
            sids = SHOT.findall(line)
            codes = TCODE.findall(line)
            if not sids or not codes:
                continue
            unknown = [x for x in sids if x not in by]
            if unknown:
                bad.append(f"{name}:{n} cites {', '.join(unknown)}, not shots")
                continue
            ok = ({by[x]["tc_in"] for x in sids} |
                  {by[x]["tc_out"] for x in sids} | always)
            for got in codes:
                seen += 1
                if got not in ok:
                    bad.append(f"{name}:{n} pairs {got} with "
                               f"{', '.join(sids)}, whose in and out points "
                               f"are {', '.join(sorted(ok))}")
    if bad:
        return ("hand-typed timecodes disagree with timeline.json:\n" +
                "\n".join("  " + b for b in bad) +
                f"\n\n  {seen} pairs checked. Fix the prose, not the timeline.")
    print(f"{seen} shot-and-timecode pairs across {len(DOCS)} documents agree "
          f"with timeline.json")
    return None


def main():
    os.chdir(HERE)
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--audit-docs", action="store_true")
    a = ap.parse_args()

    tl = json.load(open("timeline.json", encoding="utf-8"))
    if a.audit_docs:
        sys.exit(audit_docs(tl))
    by = {s["sid"]: s for s in tl}
    act_of = {}
    for name, title, first, last in ACTS:
        run = False
        for s in tl:
            if s["sid"] == first:
                run = True
            if run:
                act_of[s["sid"]] = f"{name} · {title}"
            if s["sid"] == last:
                run = False

    errs = []
    for sid in MUSIC:
        if sid not in by:
            errs.append(f"MUSIC has {sid}, which is not a shot in timeline.json")
    for sid in by:
        if sid not in MUSIC:
            errs.append(f"{sid} has no MUSIC row")
        if sid not in act_of:
            errs.append(f"{sid} falls outside every act in ACTS")
    # Join to the placements the mixer actually reads. A cue with no placement
    # is pending a download; a placement with no cue would ship unwritten.
    placed = {r["key"]: r for r in
              csv.DictReader(open(PLACEMENTS, encoding="utf-8"))
              if r.get("key", "").strip()}
    events = []
    for key, sid, cue, src, note, pending in SFX:
        if key in placed and pending:
            errs.append(f"{key} is placed in {PLACEMENTS} and still marked "
                        f"pending here")
        if key not in placed and not pending:
            errs.append(f"{key} has no row in {PLACEMENTS} and no pending "
                        f"offset, level and fades to fall back on")
            continue
        if key in placed:
            r = placed[key]
            if r["shot"].strip() != sid:
                errs.append(f"{key} is {sid} here and {r['shot']} in "
                            f"{PLACEMENTS}")
            off = float(r["offset_s"])
            lvl = f"{float(r['level_rel_narr_db']):+.0f}"
            fin, fout = float(r["fade_in"] or 0), float(r["fade_out"] or 0)
            fade = " / ".join(
                ([f"in {fin:.2f}s"] if fin else []) +
                ([f"out {fout:.2f}s"] if fout else [])) or "-"
            state = "placed"
        else:
            off, lv, fade = pending
            lvl = f"{lv:+.0f}"
            state = "PENDING DOWNLOAD"
        events.append((key, sid, off, cue, src, lvl, fade, note, state))
        if sid in SILENT:
            errs.append(f"SFX {key} sits in {sid}, a silence cue: {SILENT[sid]}")
        if sid in by and not (0 <= off <= by[sid]["dur"]):
            errs.append(f"SFX {key} at {sid} +{off}s falls outside the shot "
                        f"({by[sid]['dur']:.2f}s long)")
    for key in placed:
        if key not in {e[0] for e in SFX}:
            errs.append(f"{PLACEMENTS} places {key}, which has no cue row here")
    # `11` section 3 capped this at 14 and the cap is withdrawn; sfx.py holds the
    # ceiling now, at MAX_EFFECTS, and this only has to agree with it rather than
    # keep a second copy of the number.
    import sfx as _sfx
    if len(SFX) > _sfx.MAX_EFFECTS:
        errs.append(f"{len(SFX)} SFX events, over sfx.py's ceiling of "
                    f"{_sfx.MAX_EFFECTS}")

    # An effect that starts legally can still run over the cut into a silence
    # cue, and a re-time moves every boundary. sfx.py proves this for what is
    # placed; this proves it for what is only specified, using the fade-out as
    # the tail length when no file exists yet to measure.
    margins = []
    for key, sid, off, cue, src, lvl, fade, note, state in events:
        if sid not in by:
            continue
        tail = max([float(m) for m in re.findall(r"out ([\d.]+)s", fade)] or [0.0])
        t1 = by[sid]["t_in"] + off + tail
        nxt = [by[k] for k in SILENT if by[k]["t_in"] >= by[sid]["t_in"]]
        nxt = min(nxt, key=lambda x: x["t_in"]) if nxt else None
        if nxt and t1 > nxt["t_in"]:
            errs.append(f"SFX {key} at {sid} +{off}s runs to {t1:.2f}s and "
                        f"crosses into {nxt['sid']} at {nxt['t_in']:.2f}s: "
                        f"{SILENT[nxt['sid']]}")
        elif nxt:
            margins.append((sid, nxt["sid"], nxt["t_in"] - t1))
    if errs:
        sys.exit("cue table does not agree with the timeline:\n" +
                 "\n".join("  " + e for e in errs))

    rows = []
    for s in tl:
        sid = s["sid"]
        inten, level, fade, cue = MUSIC[sid]
        rows.append({
            "timecode": s["tc_in"], "seconds": f"{s['t_in']:.2f}", "shot": sid,
            "act": act_of[sid], "visual_scene": scene(s),
            "narration_line": re.sub(r"\s+", " ", s["narr"]).strip() or
                              ("(no narration, %.1fs hold)" % s["hold"]
                               if s["hold"] else "(no narration)"),
            "music_cue": cue, "music_intensity_1_5": inten,
            "music_level_db_rel_narration": level,
            # A fade written as a bare number goes stale the moment the film is
            # re-timed, and this film has already moved 1.84s once.
            "music_fade": fade.format(t_in=f"{s['t_in']:.2f}s"),
            "sfx_cue": "", "sfx_source": "", "sfx_level_db_rel_narration": "",
            "sfx_fade": "",
            "notes": SILENT.get(sid, "") or
                     (f"{s['pause']:.1f}s pause written into this shot"
                      if s["pause"] else ""),
        })
    for key, sid, off, cue, src, lvl, fade, note, state in events:
        s = by[sid]
        t = s["t_in"] + off
        rows.append({
            "timecode": tc(t), "seconds": f"{t:.2f}", "shot": sid,
            "act": act_of[sid], "visual_scene": scene(s),
            "narration_line": re.sub(r"\s+", " ", s["narr"]).strip() or
                              "(no narration)",
            "music_cue": "", "music_intensity_1_5": "",
            "music_level_db_rel_narration": "", "music_fade": "",
            "sfx_cue": cue, "sfx_source": src,
            "sfx_level_db_rel_narration": lvl, "sfx_fade": fade,
            "notes": f"[{state}] {note}",
        })
    rows.sort(key=lambda r: (float(r["seconds"]), 0 if r["music_cue"] else 1))

    if a.check:
        pend = [e[0] for e in events if e[8] != "placed"]
        print(f"cue table agrees with timeline.json and {PLACEMENTS}: "
              f"{len(MUSIC)} music cues, {len(events)} SFX events "
              f"({len(events) - len(pend)} placed, {len(pend)} pending"
              + (": " + ", ".join(pend) if pend else "") + f"), {len(rows)} rows.")
        print(f"film {tl[-1]['tc_out']} = {tl[-1]['t_out']:.2f}s")
        print("\nclearance to the next silence cue:")
        for sid, nsid, m in margins:
            print(f"  {sid:4} tail clears {nsid} by {m:7.2f}s")
        return

    with open(OUT, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=COLS)
        w.writeheader()
        w.writerows(rows)
    pend = [e[0] for e in events if e[8] != "placed"]
    print(f"wrote {OUT}")
    print(f"  {len(MUSIC)} music cues, {len(events)} SFX events, "
          f"{len(rows)} rows")
    print(f"  film {tl[-1]['tc_out']} = {tl[-1]['t_out']:.2f}s")
    if pend:
        print(f"  {len(pend)} effects specified but not yet downloaded: "
              + ", ".join(pend))


if __name__ == "__main__":
    main()
