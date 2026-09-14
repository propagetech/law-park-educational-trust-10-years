#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Builds every deliverable in the 30-photo cut from tools/shots.py.

  python3 build.py            write all deliverables
  python3 build.py --check    validate only, write nothing

Written:

  timeline-30-photos.json        the machine-readable cut
  01-english-transcript.md       the English narration, record-ready
  02-kannada-transcript.md       the Kannada narration, record-ready
  03-shot-timeline.md            the bilingual shot-by-shot timeline
  04-onscreen-headings.md        the foreground heading sheet, both languages
  05-english-subtitles.srt/.vtt
  06-kannada-subtitles.srt/.vtt
  sfx-placements.csv             one row per sound placement
  cue-sheet.csv                  the audio cue sheet, per shot

Nothing here is hand-edited. Change tools/shots.py and re-run.

The Kannada pace model is not invented here: it is read back out of the approved
Kannada cut. build.py measures seconds of speech per display cluster across all
43 lines of ../../kannada/tools/timeline.json and uses that constant to check
every Kannada line in this cut against its shot. See 08 section 2 in the Kannada
pack for why clusters and not words.
"""
import csv, json, os, re, sys, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.abspath(os.path.join(HERE, ".."))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
PHOTOS = os.path.join(REPO, "video/production/photo-pack-10-years/enhanced")
KANNADA_TIMELINE = os.path.join(HERE, "..", "..", "kannada", "tools", "timeline.json")

sys.path.insert(0, HERE)
from shots import (SHOTS, ACTS, BEDS, ACCENTS, SILENCE, TO_SOURCE,
                   FPS, TOTAL, WPM_EN, SFX_DIR)

CHECK = "--check" in sys.argv

# Minimum air after the narration ends, so no shot cuts on a closing consonant.
MIN_AIR = 0.25

# --------------------------------------------------------------------------
# Measurement
# --------------------------------------------------------------------------

# Kannada combining marks. A cluster begins on any character outside this set
# that is not the consonant half of a virama conjunct.
_MARKS = set(range(0x0CBC, 0x0CCE)) | {0x0C82, 0x0C83, 0x0CD5, 0x0CD6,
                                       0x200C, 0x200D}
_VIRAMA = 0x0CCD
DIGIT_WEIGHT = 3.25  # a year is spoken as number words, not as four glyphs


def clusters(text):
    """Display clusters, with digits weighted as spoken number words."""
    n = 0.0
    prev_virama = False
    for ch in text:
        cp = ord(ch)
        if ch.isspace():
            prev_virama = False
            continue
        if ch.isdigit():
            n += DIGIT_WEIGHT
            prev_virama = False
            continue
        if cp in _MARKS:
            prev_virama = (cp == _VIRAMA)
            continue
        if prev_virama:
            prev_virama = False
            continue
        if unicodedata.category(ch).startswith("P"):
            continue
        n += 1
        prev_virama = False
    return n


def words(text):
    return len([w for w in re.split(r"\s+", text.strip()) if w])


def en_speech(text):
    return words(text) * 60.0 / WPM_EN


def kn_rate():
    """Seconds of speech per display cluster, measured off the approved cut."""
    with open(KANNADA_TIMELINE, encoding="utf-8") as fh:
        rows = json.load(fh)
    cl = sum(clusters(r["narr"]) for r in rows if r.get("narr"))
    sp = sum(r["speech"] for r in rows if r.get("narr"))
    if cl <= 0:
        sys.exit("could not measure the Kannada pace from the approved cut")
    return sp / cl


KN_RATE = kn_rate()


def kn_speech(text):
    return clusters(text) * KN_RATE


def tc(sec):
    f = int(round(sec * FPS))
    return "%02d:%02d:%02d:%02d" % (f // (3600 * FPS), f // (60 * FPS) % 60,
                                    f // FPS % 60, f % FPS)


def stamp(sec, sep=","):
    ms = int(round(sec * 1000))
    return "%02d:%02d:%02d%s%03d" % (ms // 3600000, ms // 60000 % 60,
                                     ms // 1000 % 60, sep, ms % 1000)


# --------------------------------------------------------------------------
# The cut
# --------------------------------------------------------------------------

def build():
    act_titles = {a[0]: (a[1], a[2]) for a in ACTS}
    cut, t = [], 0.0
    for s in SHOTS:
        e_sp, k_sp = en_speech(s["vo_en"]), kn_speech(s["vo_kn"])
        row = dict(s)
        row.update(
            act_en=act_titles[s["act"]][0],
            act_kn=act_titles[s["act"]][1],
            photo_path="video/production/photo-pack-10-years/enhanced/" + s["photo"],
            t_in=round(t, 3), t_out=round(t + s["dur"], 3),
            tc_in=tc(t), tc_out=tc(t + s["dur"]),
            speech_en=round(e_sp, 2), speech_kn=round(k_sp, 2),
            air_en=round(s["dur"] - e_sp, 2), air_kn=round(s["dur"] - k_sp, 2),
            words_en=words(s["vo_en"]), clusters_kn=round(clusters(s["vo_kn"]), 1),
        )
        cut.append(row)
        t += s["dur"]
    return cut, t


def sound(cut):
    """Resolve every bed, accent and silence window to film time."""
    at = {r["sid"]: r["t_in"] for r in cut}
    out = []
    for b in BEDS:
        out.append(dict(b, kind="bed", t=round(at[b["shot"]] + b["offset"], 2),
                        tc=tc(at[b["shot"]] + b["offset"])))
    for a in ACCENTS:
        out.append(dict(a, kind="accent", t=round(at[a["shot"]] + a["offset"], 2),
                        tc=tc(at[a["shot"]] + a["offset"])))
    for s in SILENCE:
        out.append(dict(s, kind="silence", key="silence-" + s["shot"].lower(),
                        file="", level=None,
                        t=round(at[s["shot"]] + s["offset"], 2),
                        tc=tc(at[s["shot"]] + s["offset"]), note=s["reason"]))
    out.sort(key=lambda r: (r["t"], r["kind"]))
    return out


# --------------------------------------------------------------------------
# Validation. Everything here is a hard failure except the warnings block.
# --------------------------------------------------------------------------

def validate(cut, total, snd):
    errs, warns = [], []

    if abs(total - TOTAL) > 1e-6:
        errs.append("cut runs %.2fs, shots.py declares %.2fs" % (total, TOTAL))
    if round(total * FPS) != int(total * FPS):
        errs.append("cut does not land on a whole frame at %d fps" % FPS)

    seen_photo = {}
    for r in cut:
        p = os.path.join(PHOTOS, r["photo"])
        if not os.path.exists(p):
            errs.append("%s: photograph not found: %s" % (r["sid"], r["photo"]))
        seen_photo.setdefault(r["photo"], []).append(r["sid"])
        if r["air_en"] < MIN_AIR:
            errs.append("%s: English overruns, %.2fs speech in a %.1fs shot"
                        % (r["sid"], r["speech_en"], r["dur"]))
        if r["air_kn"] < MIN_AIR:
            errs.append("%s: Kannada overruns, %.2fs speech in a %.1fs shot"
                        % (r["sid"], r["speech_kn"], r["dur"]))
        if r["air_en"] > 5.5:
            warns.append("%s: %.2fs of English air. Intended, or a line missing?"
                         % (r["sid"], r["air_en"]))
        if r["air_kn"] > 5.5:
            warns.append("%s: %.2fs of Kannada air. Intended, or a line missing?"
                         % (r["sid"], r["air_kn"]))
        for field in ("head_en", "head_kn", "vo_en", "vo_kn", "note", "see"):
            if "—" in r[field] or "–" in r[field]:
                errs.append("%s: em or en dash in %s. House rule: neither."
                            % (r["sid"], field))

    for photo, sids in seen_photo.items():
        if len(sids) > 1:
            errs.append("photograph used twice, %s: %s" % (", ".join(sids), photo))

    have = {f for f in os.listdir(PHOTOS) if f.endswith(".png")}
    unused = sorted(have - set(seen_photo))
    if unused:
        warns.append("enhanced photographs not in the cut: " + ", ".join(unused))

    sids = [r["sid"] for r in cut]
    if len(set(sids)) != len(sids):
        errs.append("duplicate shot id")

    for r in snd:
        if r["kind"] == "silence":
            continue
        f = os.path.join(HERE, SFX_DIR, r["file"])
        if not os.path.exists(f):
            errs.append("%s: sound file not found: %s" % (r["key"], r["file"]))
        if r["level"] is not None and r["level"] > -12:
            errs.append("%s: %d dB is closer than 12 dB under the narration"
                        % (r["key"], r["level"]))

    # Nothing plays inside a written silence.
    windows = [(r["t"], r["t"] + r["dur"], r["shot"]) for r in snd
               if r["kind"] == "silence"]
    for r in snd:
        if r["kind"] != "accent":
            continue
        for a, b, shot in windows:
            if a <= r["t"] < b:
                errs.append("%s lands inside the %s silence window" % (r["key"], shot))

    n_accents = sum(1 for r in snd if r["kind"] == "accent")
    if n_accents > 32:
        errs.append("%d accents. The cap agreed with the Trust is 32." % n_accents)

    return errs, warns


# --------------------------------------------------------------------------
# Subtitles
# --------------------------------------------------------------------------

def _atoms(text, limit, measure):
    """Sentences, then any sentence too long for two subtitle lines is halved
    again at a word boundary, preferring a break after a comma."""
    parts = [p.strip() for p in re.split(r"(?<=[.?!])\s+", text.strip()) if p.strip()]
    out = []
    for p in parts:
        stack = [p]
        while stack:
            cur = stack.pop(0)
            if measure(cur) <= 2 * limit:
                out.append(cur)
                continue
            ws = cur.split()
            best, cut = None, None
            for i in range(1, len(ws)):
                a, b = " ".join(ws[:i]), " ".join(ws[i:])
                score = abs(measure(a) - measure(b))
                if a.endswith(","):
                    score -= limit * 0.5      # a comma is the better seam
                if best is None or score < best:
                    best, cut = score, (a, b)
            stack[:0] = [cut[0], cut[1]]
    return out


def split_cues(text, t_in, speech, lang):
    """One cue per sentence, or per half sentence when a sentence is too long
    for two lines. Each cue is timed in proportion to its own length."""
    limit = 42 if lang == "en" else 32
    measure = (lambda s: len(s)) if lang == "en" else clusters
    parts = _atoms(text, limit, measure)
    if not parts:
        return []
    tot = sum(measure(p) for p in parts) or 1
    cues, t = [], t_in
    for p in parts:
        d = speech * measure(p) / tot
        cues.append((t, t + d, p))
        t += d
    # Fold anything under the 1.8s floor into its neighbour.
    merged = []
    for a, b, txt in cues:
        if merged and b - a < 1.8:
            pa, _, ptxt = merged[-1]
            merged[-1] = (pa, b, ptxt + " " + txt)
        else:
            merged.append((a, b, txt))
    if len(merged) > 1 and merged[0][1] - merged[0][0] < 1.8:
        a, _, txt = merged.pop(0)
        b2, c2, t2 = merged[0]
        merged[0] = (a, c2, txt + " " + t2)
    return merged


def wrap(text, limit, lang):
    """Break into the fewest lines that all fit `limit`, as evenly as possible.
    Two lines wherever it can, three at most: past three a caption stops being
    readable at a glance and the cue should have been split instead.

    Break points are chosen by search, not greedily, because a greedy fill
    balances the first line at the cost of the last one."""
    from itertools import combinations
    measure = (lambda s: len(s)) if lang == "en" else clusters
    ws = text.split()
    if measure(text) <= limit or len(ws) == 1:
        return text

    def lines_for(cuts):
        out, prev = [], 0
        for c in list(cuts) + [len(ws)]:
            out.append(" ".join(ws[prev:c]))
            prev = c
        return out

    for n in (2, 3):
        if len(ws) < n:
            break
        best, best_lines = None, None
        for cuts in combinations(range(1, len(ws)), n - 1):
            ls = lines_for(cuts)
            m = [measure(l) for l in ls]
            if max(m) > limit:
                continue
            score = max(m) - min(m)          # the most even feasible break
            if best is None or score < best:
                best, best_lines = score, ls
        if best_lines:
            return "\n".join(best_lines)

    # Nothing fits in three lines. Return the most even three and let the
    # audit in build() report it rather than shipping it silently.
    cuts = (len(ws) // 3, 2 * len(ws) // 3)
    return "\n".join(lines_for(cuts))


def subtitles(cut, lang):
    key_vo = "vo_" + lang
    key_sp = "speech_" + lang
    limit = 42 if lang == "en" else 32
    cues = []
    for r in cut:
        for a, b, txt in split_cues(r[key_vo], r["t_in"], r[key_sp], lang):
            cues.append((a, b, wrap(txt, limit, lang)))
    return cues


def write_srt(path, cues):
    with open(path, "w", encoding="utf-8") as fh:
        for i, (a, b, txt) in enumerate(cues, 1):
            fh.write("%d\n%s --> %s\n%s\n\n" % (i, stamp(a), stamp(b), txt))


def write_vtt(path, cues):
    with open(path, "w", encoding="utf-8") as fh:
        fh.write("WEBVTT\n\n")
        for a, b, txt in cues:
            fh.write("%s --> %s\n%s\n\n" % (stamp(a, "."), stamp(b, "."), txt))


def audit_subs(cut):
    """Refuse to emit captions quietly: print `no violations`, or print every
    over-long line and every cue under the 1.8 s floor. Same discipline as
    make_srt.py in the Kannada pack."""
    bad = []
    for lang, limit in (("en", 42), ("kn", 32)):
        measure = (lambda s: len(s)) if lang == "en" else clusters
        for a, b, txt in subtitles(cut, lang):
            for line in txt.split("\n"):
                if measure(line) > limit:
                    bad.append("%s %s: line over %d, %r" % (lang, stamp(a), limit, line))
            if txt.count("\n") > 2:
                bad.append("%s %s: more than three lines" % (lang, stamp(a)))
            if b - a < 1.8:
                bad.append("%s %s: cue is %.2fs, under the 1.8s floor" % (lang, stamp(a), b - a))
    if bad:
        for x in bad:
            print("  subtitle: " + x)
    else:
        print("Subtitles: no violations.")
    return bad


# --------------------------------------------------------------------------
# Documents
# --------------------------------------------------------------------------

BANNER = ("<!-- GENERATED by tools/build.py from tools/shots.py. "
          "Edit shots.py and re-run. Do not hand-edit this file. -->")


def head_lines(h):
    return [x.strip() for x in h.split("//")]


def doc_transcript(cut, lang, path):
    en = lang == "en"
    title = ("01 · English narration · 30-photo cut" if en
             else "02 · ಕನ್ನಡ ನಿರೂಪಣೆ · 30 ಚಿತ್ರಗಳ ಆವೃತ್ತಿ")
    sub = ("Law Park Educational Trust · Ten Years · 2016 to 2026"
           if en else
           "ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ · ಹತ್ತು ವರ್ಷ · 2016 ರಿಂದ 2026")
    key_vo, key_sp, key_air = "vo_" + lang, "speech_" + lang, "air_" + lang
    tot_sp = sum(r[key_sp] for r in cut)

    L = [BANNER, "", "# " + title, "", "**" + sub + "**", "",
         ("1920x1080 · %d fps · **%s** · 30 photographs, no graphics cards."
          if en else
          "1920x1080 · %d fps · **%s** · 30 ಚಿತ್ರಗಳು, ಯಾವ ಗ್ರಾಫಿಕ್ಸ್ ಕಾರ್ಡ್ ಇಲ್ಲ.")
         % (FPS, tc(TOTAL)), ""]
    if en:
        L += ["The picture cut is identical in both languages. Every line below is "
              "written to the shot it sits on, so the Kannada read drops onto the same "
              "30 cuts without moving a frame.", "",
              "| | |", "|---|---|",
              "| Spoken words | **%d** |" % sum(r["words_en"] for r in cut),
              "| Pace | **%d wpm** |" % WPM_EN,
              "| Speech | %.1f s |" % tot_sp,
              "| Held picture, no narration | %.1f s |" % (TOTAL - tot_sp),
              "| **Total** | **%s** |" % tc(TOTAL), "",
              "`VO` is spoken. `HEADING` is the foreground text burned over the "
              "photograph and is never read aloud. Claim ids in square brackets point "
              "at `video/research/02-evidence-table.csv`.", ""]
    else:
        L += ["ಚಿತ್ರಗಳ ಕಟ್ ಎರಡೂ ಭಾಷೆಗಳಲ್ಲಿ ಒಂದೇ. ಇಂಗ್ಲಿಷ್ ಆವೃತ್ತಿಯ ಅದೇ 30 ಕಟ್‌ಗಳ ಮೇಲೆ ಈ ಓದು "
              "ಫ್ರೇಮ್ ಕದಲಿಸದೆ ಕೂರುತ್ತದೆ.", "",
              "| | |", "|---|---|",
              "| ಪ್ರದರ್ಶನ ಕ್ಲಸ್ಟರ್‌ಗಳು | **%d** |" % round(sum(r["clusters_kn"] for r in cut)),
              "| ಅಳೆದ ವೇಗ | **%.4f ಸೆ / ಕ್ಲಸ್ಟರ್** |" % KN_RATE,
              "| ಮಾತು | %.1f ಸೆ |" % tot_sp,
              "| ನಿರೂಪಣೆ ಇಲ್ಲದ ಚಿತ್ರ | %.1f ಸೆ |" % (TOTAL - tot_sp),
              "| **ಒಟ್ಟು** | **%s** |" % tc(TOTAL), "",
              "ಅವಧಿಯನ್ನು ಪದಗಳಿಂದಲ್ಲ, ಪ್ರದರ್ಶನ ಕ್ಲಸ್ಟರ್‌ಗಳಿಂದ ಲೆಕ್ಕ ಹಾಕಲಾಗಿದೆ. ಕಾರಣಕ್ಕೆ ಕನ್ನಡ "
              "ಪ್ಯಾಕ್‌ನ `08` ವಿಭಾಗ 2 ನೋಡಿ. ಪ್ರತಿ ಸಾಲಿನ ವೇಗವನ್ನು ಅನುಮೋದಿತ ಕನ್ನಡ ಕಟ್‌ನಿಂದಲೇ "
              "ಅಳೆದು ಪಡೆಯಲಾಗಿದೆ.", "",
              "`VO` ಎಂದರೆ ಓದುವ ಸಾಲು. `ಶೀರ್ಷಿಕೆ` ಎಂದರೆ ಚಿತ್ರದ ಮೇಲೆ ಮೂಡುವ ಪಠ್ಯ, ಅದನ್ನು "
              "ಓದಬಾರದು.", ""]
    L.append("---")

    act = None
    for r in cut:
        if r["act"] != act:
            act = r["act"]
            head = ("## Act %d · %s" % (act, r["act_en"]) if en
                    else "## ಭಾಗ %d · %s" % (act, r["act_kn"]))
            first = [x for x in cut if x["act"] == act]
            L += ["", head, "",
                  "`%s` %s `%s`" % (first[0]["tc_in"], "to" if en else "ರಿಂದ",
                                    first[-1]["tc_out"]), ""]
        L += ["### %s `%s` · %s" % (r["sid"], r["tc_in"], r["photo"]), ""]
        for i, ln in enumerate(head_lines(r["head_en"] if en else r["head_kn"])):
            L.append(("> **HEADING:** " if i == 0 else "> ") + ln
                     if en else
                     ("> **ಶೀರ್ಷಿಕೆ:** " if i == 0 else "> ") + ln)
            L.append(">")
        L += ["> **VO:** " + r[key_vo] + ("  " + r["claim"] if en and r["claim"] else ""),
              ""]
        if r[key_air] >= 1.0:
            L += [("*hold %.1f s, picture only*" % r[key_air]) if en else
                  ("*%.1f ಸೆ ಚಿತ್ರ ಮಾತ್ರ*" % r[key_air]), ""]

    L += ["", "---", ""]
    if en:
        L += ["## Recording notes", "",
              "- One take per act. Six acts, six takes, then assemble.",
              "- Read standing. The register is measured and warm, not announced.",
              "- Numbers are spoken as words: *a hundred and fifty*, *two hundred*, "
              "*three hundred*, *seventy-five per cent*.",
              "- **S03**, **S07 tail**, **S18 tail** and **S29** are written silences. "
              "Do not fill them, and do not let the read run into them.",
              "- Do not add a smile to `S26`. The line names children from "
              "HIV-affected families and single-parent families and it is read plainly.",
              "- No cumulative student, village or district total is stated anywhere "
              "in this film. Those figures conflict four ways across the repository. "
              "See `06` question 1.", ""]
    else:
        L += ["## ಧ್ವನಿಮುದ್ರಣ ಸೂಚನೆಗಳು", "",
              "- ಪ್ರತಿ ಭಾಗಕ್ಕೆ ಒಂದು ಟೇಕ್. ಆರು ಭಾಗ, ಆರು ಟೇಕ್.",
              "- ನಿಂತು ಓದಿ. ಧ್ವನಿ ಸಮಾಧಾನದ್ದು, ಘೋಷಣೆಯದ್ದಲ್ಲ.",
              "- ಸಂಖ್ಯೆಗಳನ್ನು ಪದಗಳಲ್ಲಿ ಓದಿ: *ನೂರೈವತ್ತು*, *ಇನ್ನೂರು*, *ಮುನ್ನೂರು*, "
              "*ಶೇಕಡಾ ಎಪ್ಪತ್ತೈದು*.",
              "- **S03**, **S07 ಕೊನೆ**, **S18 ಕೊನೆ** ಮತ್ತು **S29** ಉದ್ದೇಶಪೂರ್ವಕ ಮೌನಗಳು. "
              "ಅವನ್ನು ತುಂಬಬೇಡಿ.",
              "- `S26` ಸಾಲನ್ನು ನೇರವಾಗಿ ಓದಿ. ಅದು ಎಚ್.ಐ.ವಿ. ಬಾಧಿತ ಮತ್ತು ಒಂಟಿ ಪೋಷಕರ ಮಕ್ಕಳ "
              "ಬಗ್ಗೆ ಹೇಳುತ್ತದೆ.",
              "- ಒಟ್ಟು ವಿದ್ಯಾರ್ಥಿ, ಹಳ್ಳಿ ಅಥವಾ ಜಿಲ್ಲೆಗಳ ಸಂಖ್ಯೆಯನ್ನು ಈ ಚಿತ್ರ ಎಲ್ಲಿಯೂ "
              "ಹೇಳುವುದಿಲ್ಲ. ಆ ಅಂಕಿಗಳು ದಾಖಲೆಗಳಲ್ಲಿ ನಾಲ್ಕು ರೀತಿ ಭಿನ್ನವಾಗಿವೆ.", ""]

    write(path, "\n".join(L))


def doc_timeline(cut, snd, path):
    by_shot = {}
    for r in snd:
        by_shot.setdefault(r["shot"], []).append(r)

    L = [BANNER, "", "# 03 · Shot timeline · 30-photo cut", "",
         "**Law Park Educational Trust · Ten Years · 2016 to 2026**",
         "", "1920x1080 · %d fps · **%s** · 30 photographs from "
         "`photo-pack-10-years/enhanced/`." % (FPS, tc(TOTAL)), "",
         "Every shot is a full-bleed photograph with the heading composited over it. "
         "There are no graphics cards in this cut: the picture is never interrupted "
         "by a plate, and the text always sits on a photograph.", "",
         "| Act | Shots | In | Out | Run |", "|---|---|---|---|---|"]
    for n, en_t, kn_t in ACTS:
        rs = [r for r in cut if r["act"] == n]
        L.append("| **%d · %s** · %s | %s to %s | `%s` | `%s` | %.0f s |"
                 % (n, en_t, kn_t, rs[0]["sid"], rs[-1]["sid"],
                    rs[0]["tc_in"], rs[-1]["tc_out"],
                    sum(x["dur"] for x in rs)))
    L += ["", "---", ""]

    act = None
    for r in cut:
        if r["act"] != act:
            act = r["act"]
            L += ["", "## Act %d · %s · %s" % (act, r["act_en"], r["act_kn"]), ""]
        L += ["### %s `%s` to `%s` · %.0f s" % (r["sid"], r["tc_in"], r["tc_out"], r["dur"]),
              "",
              "**Photograph** `%s`  " % r["photo"],
              "*EDL shot* `%s`  " % r["kid"],
              "*In frame* %s" % r["see"], "",
              "| | |", "|---|---|",
              "| **Heading EN** | %s |" % " <br> ".join(head_lines(r["head_en"])),
              "| **Heading KN** | %s |" % " <br> ".join(head_lines(r["head_kn"])),
              "| Register | `%s` |" % r["role"],
              "| **VO EN** | %s |" % r["vo_en"],
              "| **VO KN** | %s |" % r["vo_kn"],
              "| Speech EN / air | %.2f s / %.2f s |" % (r["speech_en"], r["air_en"]),
              "| Speech KN / air | %.2f s / %.2f s |" % (r["speech_kn"], r["air_kn"]),
              "| Claim | %s |" % (r["claim"] or "not a claim line"),
              "| Consent | %s |" % r["consent"],
              ""]
        ev = by_shot.get(r["sid"], [])
        if ev:
            L += ["**Sound**", "",
                  "| At | Kind | Cue | Level | Note |", "|---|---|---|---|---|"]
            for e in ev:
                if e["kind"] == "silence":
                    L.append("| `%s` | **silence** | %.1f s, nothing but carved room tone "
                             "| silent | %s |" % (e["tc"], e["dur"], e["note"]))
                else:
                    L.append("| `%s` | %s | `%s` | %d dB under VO | %s |"
                             % (e["tc"], e["kind"], e["file"], e["level"], e["note"]))
            L.append("")
        L += ["**Direction.** " + r["note"], "", "---", ""]

    L += ["", "## Sound not yet in the library", "",
          "Three effects this cut wants and `../kannada/tools/sfx/` does not hold. "
          "Source them, archive the licence evidence on the day of download, add the "
          "row to `Kannada-sfx-licence-log.csv`, then place them.", "",
          "| Effect | Shot | Why | Search |", "|---|---|---|---|"]
    for name, shot, why, url in TO_SOURCE:
        L.append("| %s | `%s` | %s | [%s](%s) |" % (name, shot, why, "Pixabay", url))
    L += ["", "Until they are sourced, `S08` carries no accent, `S20` carries the zip "
          "alone, and `S30` resolves on the piano note.", ""]

    write(path, "\n".join(L))


def doc_headings(cut, path):
    L = [BANNER, "", "# 04 · Foreground headings · 30-photo cut", "",
         "Every heading in running order, both languages, ready to set. `//` is a "
         "line break inside the heading.", "",
         "**Type.** Headings sit in the lower third unless the direction says "
         "otherwise, inside the 90 percent title-safe box, on a soft dark scrim so "
         "the type clears WCAG 2.1 AA against the photograph it really sits on, not "
         "against an assumed background. Run `wcag_audit.py` from the Kannada pack "
         "against the rendered frames before picture lock.", "",
         "**Registers.** `title` and `end` are the display size, once each. `year` "
         "sets the numeral in the display face with the place beneath it. `fact` is "
         "one line of body at heading weight. `name` is a person. `quote` is the "
         "founder, in italic with the attribution a step down. `partners` is a stacked "
         "list at the smallest size in the film.", "",
         "| Shot | In | Register | English | ಕನ್ನಡ |",
         "|---|---|---|---|---|"]
    for r in cut:
        L.append("| `%s` | `%s` | `%s` | %s | %s |"
                 % (r["sid"], r["tc_in"], r["role"],
                    " <br> ".join(head_lines(r["head_en"])),
                    " <br> ".join(head_lines(r["head_kn"]))))
    L += ["", "---", "",
          "## Headings that need approval before they are burned in", "",
          "| Shot | Heading | Gate |", "|---|---|---|",
          "| `S26` | the four partner names | Written permission to display each "
          "partner's name and mark. `14` item 2.2. |",
          "| `S29` | Udayavani and the award line | Confirm the award date and the "
          "awarding body's name as it is to appear. Do not name presenting ministers. "
          "`06` question 3. |",
          "| `S04` | the founder quote | Confirm the wording as the founder wants it "
          "attributed. `MIS-02`. |", ""]
    write(path, "\n".join(L))


def csv_placements(snd, path):
    cols = ["key", "kind", "file", "shot", "at_tc", "at_s", "offset_s",
            "level_rel_narr_db", "solo_dbfs", "in_s", "dur_s", "fade_in",
            "fade_out", "note"]
    with open(path, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=cols)
        w.writeheader()
        for r in snd:
            w.writerow({
                "key": r["key"], "kind": r["kind"], "file": r.get("file", ""),
                "shot": r["shot"], "at_tc": r["tc"], "at_s": "%.2f" % r["t"],
                "offset_s": "%.2f" % r["offset"],
                "level_rel_narr_db": "" if r.get("level") is None else r["level"],
                "solo_dbfs": "" if r.get("solo") is None else r.get("solo", ""),
                "in_s": "%.2f" % r.get("in_s", 0.0),
                "dur_s": "%.2f" % r.get("dur", 0.0),
                "fade_in": "%.2f" % r.get("fade_in", 0.0),
                "fade_out": "%.2f" % r.get("fade_out", 0.0),
                "note": r["note"]})


def csv_cues(cut, snd, path):
    by_shot = {}
    for r in snd:
        by_shot.setdefault(r["shot"], []).append(r)
    cols = ["timecode", "seconds", "shot", "act", "photograph", "heading_en",
            "heading_kn", "vo_en", "vo_kn", "sfx_kind", "sfx_cue",
            "sfx_level_db_rel_narration", "sfx_fade", "consent", "notes"]
    with open(path, "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=cols)
        w.writeheader()
        for r in cut:
            base = {"timecode": r["tc_in"], "seconds": "%.2f" % r["t_in"],
                    "shot": r["sid"], "act": "%d · %s" % (r["act"], r["act_en"]),
                    "photograph": r["photo"],
                    "heading_en": " / ".join(head_lines(r["head_en"])),
                    "heading_kn": " / ".join(head_lines(r["head_kn"])),
                    "vo_en": r["vo_en"], "vo_kn": r["vo_kn"],
                    "consent": r["consent"], "notes": r["note"]}
            ev = by_shot.get(r["sid"], [])
            if not ev:
                w.writerow(dict(base, sfx_kind="", sfx_cue="",
                                sfx_level_db_rel_narration="", sfx_fade=""))
                continue
            for i, e in enumerate(ev):
                row = dict(base) if i == 0 else {
                    "timecode": e["tc"], "seconds": "%.2f" % e["t"],
                    "shot": r["sid"], "act": "%d · %s" % (r["act"], r["act_en"]),
                    "photograph": "", "heading_en": "", "heading_kn": "",
                    "vo_en": "", "vo_kn": "", "consent": "", "notes": ""}
                row.update(
                    sfx_kind=e["kind"],
                    sfx_cue=e.get("file") or "carved room tone, %.1f s" % e["dur"],
                    sfx_level_db_rel_narration=("silent" if e.get("level") is None
                                                else e["level"]),
                    sfx_fade="in %.2fs / out %.2fs" % (e.get("fade_in", 0.0),
                                                       e.get("fade_out", 0.0)))
                if i:
                    row["notes"] = e["note"]
                w.writerow(row)


def write(path, text):
    if not text.endswith("\n"):
        text += "\n"
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(text)
    print("  wrote %s" % os.path.relpath(path, OUT))


# --------------------------------------------------------------------------

def main():
    cut, total = build()
    snd = sound(cut)
    errs, warns = validate(cut, total, snd)

    for w in warns:
        print("warning: " + w)
    if errs:
        for e in errs:
            print("ERROR: " + e)
        sys.exit("%d error(s). Nothing written." % len(errs))

    print("30 shots, %s, %d beds, %d accents, %d written silences."
          % (tc(total),
             sum(1 for r in snd if r["kind"] == "bed"),
             sum(1 for r in snd if r["kind"] == "accent"),
             sum(1 for r in snd if r["kind"] == "silence")))
    print("Kannada pace measured off the approved cut: %.4f s per cluster." % KN_RATE)
    if audit_subs(cut):
        sys.exit("subtitle violations. Nothing written.")
    if CHECK:
        print("--check: nothing written.")
        return

    write(os.path.join(OUT, "timeline-30-photos.json"),
          json.dumps({"fps": FPS, "duration_s": total, "duration_tc": tc(total),
                      "shots": cut, "sound": snd,
                      "kannada_seconds_per_cluster": round(KN_RATE, 6)},
                     ensure_ascii=False, indent=2))
    doc_transcript(cut, "en", os.path.join(OUT, "01-english-transcript.md"))
    doc_transcript(cut, "kn", os.path.join(OUT, "02-kannada-transcript.md"))
    doc_timeline(cut, snd, os.path.join(OUT, "03-shot-timeline.md"))
    doc_headings(cut, os.path.join(OUT, "04-onscreen-headings.md"))
    for lang, stem in (("en", "05-english-subtitles"), ("kn", "06-kannada-subtitles")):
        cues = subtitles(cut, lang)
        write_srt(os.path.join(OUT, stem + ".srt"), cues)
        write_vtt(os.path.join(OUT, stem + ".vtt"), cues)
        print("  wrote %s.srt and .vtt, %d cues" % (stem, len(cues)))
    csv_placements(snd, os.path.join(OUT, "sfx-placements.csv"))
    print("  wrote sfx-placements.csv")
    csv_cues(cut, snd, os.path.join(OUT, "cue-sheet.csv"))
    print("  wrote cue-sheet.csv")


if __name__ == "__main__":
    main()
