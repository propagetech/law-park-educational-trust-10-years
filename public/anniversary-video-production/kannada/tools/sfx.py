#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mixes sound effects into the narration stem, under the rules `11` sets out.

  python3 sfx.py --check          validate placements, mix nothing
  python3 sfx.py                  build the learning mix
  python3 sfx.py --strict         also fail on the advisory warnings

Effect files go in sfx/. Placements go in sfx/placements.csv, one row per
placement:

  file,shot,offset_s,gain_db,in_s,dur_s,fade_in,fade_out,note
  page-turn.mp3,K11,0.3,-18,0,0,0,0,under the 2016 origin card

`in_s`, `dur_s`, `fade_in` and `fade_out` are optional and trim one excerpt out
of a longer file, so a 26-second applause bed does not need pre-cutting into a
second file that the licence log would then fail to describe.

`offset_s` is measured from that shot's t_in, so placements survive a re-time.

WHY THIS REFUSES THINGS
`06` section 7 designs this film's audio around deliberate silences, and an
effect dropped into one of them breaks the cut without breaking the render. The
edit would look and sound plausible and be wrong, which is the same class of
failure as the subtitle cache in gfx.py. So the silence cues are enforced here
rather than left to whoever runs the mix.

STATUS
`07` item 5.7 still reads "No sound effects. This film does not need them", and
5.8, the row asking the Trust to reaffirm or amend it, is unsigned. This script
therefore names its output a LEARNING mix and never writes over the narration
stem or any master. Nothing it produces is a deliverable.
"""
import argparse
import csv
import json
import math
import os
import struct
import subprocess
import sys
import tempfile
import wave

SR = 48000
HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.dirname(HERE)
SFXDIR = "sfx"
PLACEMENTS = os.path.join(SFXDIR, "placements.csv")
LOG = os.path.join(PACK, "Kannada-sfx-licence-log.csv")

# `06` section 7 and `07` 5.6. Nothing may be placed inside these at all.
FORBIDDEN = {
    "K06": "six seconds fully silent under the founder's quote",
    "K12": "silence under ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ.",
    "K27": "music out completely under ಪೂರ್ತಿ ಅಲ್ಲ.",
    "K34": "nothing that could be read as sentiment",
}
# Allowed but almost always wrong. Advisory unless --strict.
DISCOURAGED = {
    "K37": "the award shot is marked no fanfare",
    "K43": "this shot lifts but must not climax",
}
MAX_EFFECTS = 14          # `11` section 3
HEADROOM_DB = 12.0        # `14` item 8.7, effects at least 12 dB under narration


def die(msg):
    sys.exit(f"refusing to build.\n{msg}")


def decode(path, tmp, in_s=0.0, dur_s=None, fin=0.0, fout=0.0):
    """Decode to 48k mono, optionally taking one excerpt with fades.

    Most library effects are far longer than the moment they are used for: a
    26-second applause bed or a 21-second bag handle. Trimming here rather than
    pre-cutting new files keeps one file on disk per licence-log row, so the
    log still describes what shipped.
    """
    out = os.path.join(tmp, "e.wav")
    cmd = ["ffmpeg", "-v", "error", "-y"]
    if in_s:
        cmd += ["-ss", f"{in_s:.3f}"]
    if dur_s:
        cmd += ["-t", f"{dur_s:.3f}"]
    cmd += ["-i", path, "-ar", str(SR), "-ac", "1"]
    af = []
    if fin:
        af.append(f"afade=t=in:st=0:d={fin:.3f}")
    if fout and dur_s:
        af.append(f"afade=t=out:st={max(0, dur_s - fout):.3f}:d={fout:.3f}")
    if af:
        cmd += ["-af", ",".join(af)]
    cmd += ["-c:a", "pcm_s16le", out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        die(f"ffmpeg cannot read {path}\n{r.stderr.strip()[:400]}")
    w = wave.open(out)
    n = w.getnframes()
    s = struct.unpack("<%dh" % n, w.readframes(n))
    w.close()
    if not n:
        die(f"{path}: the in_s/dur_s excerpt is empty")
    return list(s)


def probe(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                        "format=duration", "-of", "csv=p=0", path],
                       capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        die(f"ffprobe cannot read a duration from {path}")


def num(row, key, default=0.0):
    v = (row.get(key) or "").strip()
    return float(v) if v else default


def rms(seq):
    return math.sqrt(sum(v * v for v in seq) / len(seq)) if seq else 0.0


def logged_files():
    if not os.path.exists(LOG):
        return set()
    with open(LOG, encoding="utf-8") as f:
        return {r["edit_file_name"].strip() for r in csv.DictReader(f)
                if r.get("edit_file_name", "").strip()}


def main():
    os.chdir(HERE)
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--strict", action="store_true")
    ap.add_argument("--vo", default=None,
                    help="narration stem (default: the newest vo_eleven stem)")
    a = ap.parse_args()

    if not os.path.exists(PLACEMENTS):
        die(f"no {PLACEMENTS}\n"
            f"  put effect files in {SFXDIR}/ and list them, one per row:\n"
            f"  file,shot,offset_s,gain_db,note")

    tl = {s["sid"]: s for s in json.load(open("timeline.json", encoding="utf-8"))}
    total = max(s["t_out"] for s in tl.values())

    vo = a.vo
    if not vo:
        cand = [os.path.join("vo_eleven", d, "narration.wav")
                for d in sorted(os.listdir("vo_eleven"))
                if os.path.exists(os.path.join("vo_eleven", d, "narration.wav"))]
        if not cand:
            die("no narration stem found. Run: python3 stem.py <VOICE_ID>")
        vo = cand[-1]

    rows = [r for r in csv.DictReader(open(PLACEMENTS, encoding="utf-8"))
            if r.get("file", "").strip()]
    if not rows:
        die(f"{PLACEMENTS} has no placements")

    # ---------------------------------------------------------------- validate
    errs, warns = [], []
    if len(rows) > MAX_EFFECTS:
        errs.append(f"{len(rows)} placements. `11` section 3 caps the film at "
                    f"{MAX_EFFECTS}; past that the sound design is decoration")

    known = logged_files()
    for i, r in enumerate(rows, 2):
        f = r["file"].strip()
        p = os.path.join(SFXDIR, f)
        sid = r["shot"].strip()
        if not os.path.exists(p):
            errs.append(f"row {i}: {p} does not exist")
        if sid not in tl:
            errs.append(f"row {i}: {sid} is not a shot in timeline.json")
            continue
        if sid in FORBIDDEN:
            errs.append(f"row {i}: {sid} is a silence cue, {FORBIDDEN[sid]}. "
                        f"`06` section 7")
        if sid in DISCOURAGED:
            (errs if a.strict else warns).append(
                f"row {i}: {sid}, {DISCOURAGED[sid]}")
        if f not in known:
            warns.append(f"row {i}: {f} has no row in "
                         f"Kannada-sfx-licence-log.csv. `07` item 5.9")
        try:
            off = float(r["offset_s"])
            float(r["gain_db"])
        except (TypeError, ValueError):
            errs.append(f"row {i}: offset_s and gain_db must be numbers")
            continue
        if off < 0 or tl[sid]["t_in"] + off > tl[sid]["t_out"]:
            errs.append(f"row {i}: offset {off}s falls outside {sid} "
                        f"({tl[sid]['t_out'] - tl[sid]['t_in']:.2f}s long)")
            continue

        # An effect that STARTS legally can still run over the cut into a
        # silence cue. A riser on the title card reaching into K06 is the
        # obvious case, and it would never show up as a bad start time.
        if os.path.exists(p):
            length = num(r, "dur_s") or probe(p) - num(r, "in_s")
            t0 = tl[sid]["t_in"] + off
            t1 = t0 + length
            for fsid, why in FORBIDDEN.items():
                f0, f1 = tl[fsid]["t_in"], tl[fsid]["t_out"]
                if t0 < f1 and t1 > f0:
                    errs.append(
                        f"row {i}: runs {t0:.2f}s to {t1:.2f}s and bleeds into "
                        f"{fsid} ({f0:.2f}s to {f1:.2f}s), {why}. "
                        f"Shorten it with dur_s, or move it")

    if errs:
        die("\n".join("  " + e for e in errs))
    for w in warns:
        print(f"  warning: {w}")

    print(f"\n{len(rows)} placements, narration stem {vo}")
    if a.check:
        print("placements are valid. --check builds nothing.")
        return

    # ---------------------------------------------------------------- mix
    w = wave.open(vo)
    n = w.getnframes()
    track = list(struct.unpack("<%dh" % n, w.readframes(n)))
    w.close()
    narration_rms = rms([v for v in track if v])
    ceiling = narration_rms * (10 ** (-HEADROOM_DB / 20))

    with tempfile.TemporaryDirectory() as tmp:
        for r in rows:
            sid = r["shot"].strip()
            at = tl[sid]["t_in"] + float(r["offset_s"])
            gain = 10 ** (float(r["gain_db"]) / 20)
            s = [v * gain for v in decode(
                os.path.join(SFXDIR, r["file"].strip()), tmp,
                num(r, "in_s"), num(r, "dur_s") or None,
                num(r, "fade_in"), num(r, "fade_out"))]
            got = rms(s)
            if got > ceiling:
                cut = 20 * math.log10(ceiling / got) if got else 0
                s = [v * (ceiling / got) for v in s]
                print(f"  {r['file']}: {cut:+.1f} dB applied to hold "
                      f"{HEADROOM_DB:.0f} dB under narration")
            i0 = int(round(at * SR))
            for k, v in enumerate(s):
                j = i0 + k
                if j < len(track):
                    track[j] = max(-32768, min(32767, int(track[j] + v)))
            print(f"  {sid} +{float(r['offset_s']):.2f}s  {r['file']}")

    out = os.path.join(os.path.dirname(vo), "narration_plus_sfx_LEARNING.wav")
    o = wave.open(out, "w")
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR)
    o.writeframes(struct.pack("<%dh" % len(track), *track))
    o.close()
    print(f"\nwrote {out}  ({len(track)/SR:.2f}s)")
    print("\n  LEARNING MIX. `07` item 5.7 still forbids sound effects and 5.8 is\n"
          "  unsigned. This is not a deliverable and no master was touched.")
    # silent.mp4 predates the last re-time. The event master is rebuilt with
    # the picture, so it is the only video here guaranteed to be 337.88s.
    print(f"\n  mux a preview:\n"
          f"    ffmpeg -i ../kannada-1080p-EVENT-master.mp4 -i {out} \\\n"
          f"      -map 0:v -map 1:a -c:v copy \\\n"
          f"      -af loudnorm=I=-16:TP=-3.0:LRA=11 -c:a aac -b:a 192k \\\n"
          f"      -ar 48000 -ac 1 -shortest ../08-kannada-sfx-learning-mix.mp4")


if __name__ == "__main__":
    main()
