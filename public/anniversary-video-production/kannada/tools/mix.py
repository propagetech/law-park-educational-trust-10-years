#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Builds the audio deliverables for the Kannada event film: three stems, two
masters and four previews.

  python3 mix.py --check                 report what it can build, build nothing
  python3 mix.py                         build everything it can
  python3 mix.py --music bed.wav         include the music stem and bed
  python3 mix.py --vo path/narration.wav choose the narration stem
  python3 mix.py --calibrate             write the derived gains back to
                                         sfx/placements.csv for sfx.py

Output goes to mix/. Timings come from timeline.json, effects from
sfx/placements.csv, so a re-time costs one command and not a re-typed cue sheet.

WHAT IT REFUSES TO PRETEND
There is no music in this repository. `07` section 11 says so and `07` item 5.1
is a blocking, unsigned licence gate. Without --music this writes no music stem
and stamps NOMUSIC into the master filenames, because a five-minute film mixed
without its score is a reference, not a master. `07` item 5.7 still forbids
sound effects and 5.8 is unsigned, so the effect stem and anything containing it
is stamped UNAPPROVED for the same reason sfx.py names its output a learning mix.

LEVELS
Narration owns the film. sfx/placements.csv states the level each effect should
sit at RELATIVE TO THE NARRATION, in `level_rel_narr_db`, which is the same unit
the cue sheet and the licence log use. This measures the narration's own speech
RMS and each trimmed, faded excerpt, then derives the gain that lands the effect
on its stated level. Nothing is guessed and nothing is carried over from an
earlier audition of a different excerpt.

`14` item 8.7 sets 12 dB under narration as a CEILING, not a target. Asking for
-14 and getting -12 for everything would flatten a designed range of -14 to -22
into one level, which is how sound design turns into wallpaper, so the ceiling
only ever pulls an effect down and never pushes one up. `gain_db` remains in the
CSV as a derived cache for sfx.py: --calibrate rewrites it.

Masters are two-pass loudnorm: event -23 LUFS, online -16 LUFS, both with a
true-peak ceiling of -3 dBTP. -3 satisfies `14` item 8.7 and is stricter than
the -1 dBTP an online master is usually allowed, which costs nothing audible at
these loudnesses and leaves the hall some headroom.
"""
import argparse
import csv
import json
import os
import re
import shutil
import subprocess
import sys

SR = 48000
HEADROOM_DB = 12.0     # `14` item 8.7
TP_DBTP = -3.0         # `14` item 8.7
EVENT_LUFS = -23.0     # `06` section 1
ONLINE_LUFS = -16.0    # `06` section 1
HERE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = "mix"

# `06` section 7, `07` items 5.6 and 5.10. Nothing may sound inside these, and
# a mix engineer will instinctively fill all four. Verified after every build.
SILENT = {
    "K06": "six seconds fully silent under the founder's quote",
    "K12": "no music, no effect under ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ.",
    "K27": "no music, no effect under ಪೂರ್ತಿ ಅಲ್ಲ.",
    "K34": "nothing that could be read as sentiment",
}

# Previews. Each is a window on the finished mix, named for what it proves.
PREVIEWS = [
    ("preview-1-title-card", "K05", -0.84, 10.0,
     "the riser, the low impact on 2016 ರಿಂದ 2026, and the six seconds of "
     "silence that follow"),
    ("preview-2-opening", "K01", 0.0, 30.0,
     "how quietly the film starts and how little is under the first lines"),
    ("preview-3-journey", "K22", -4.14, 30.0,
     "the 2016 to 2025 build: the bag zip, the peak at munnooru, and the "
     "2.5 second hold that is not filled"),
    ("preview-4-closing", "K46", -23.0, 30.0,
     "the lift that does not climax, the welcome line, and the fade to silence"),
]


def die(msg):
    sys.exit(f"refusing to build.\n{msg}")


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode:
        die(f"{' '.join(cmd[:6])} ...\n{r.stderr.strip()[-1200:]}")
    return r


def num(row, key, default=0.0):
    v = (row.get(key) or "").strip()
    return float(v) if v else default


def rms_db(path, pre=""):
    """Overall RMS in dBFS, after an optional filter chain."""
    af = (pre + "," if pre else "") + "astats=metadata=1:reset=0"
    r = subprocess.run(["ffmpeg", "-v", "info", "-i", path, "-af", af,
                        "-f", "null", "-"], capture_output=True, text=True)
    m = re.findall(r"RMS level dB:\s*(-?[\d.]+|-inf)", r.stderr)
    if not m:
        die(f"cannot measure RMS of {path}\n{r.stderr.strip()[-600:]}")
    v = m[-1]
    return float("-inf") if v == "-inf" else float(v)


def speech_rms_db(path):
    """The narration's RMS with its silences removed.

    Overall RMS across the whole stem would be dragged down by 24 seconds of
    deliberate silence and 17 seconds of written pauses, and every effect would
    then be set against a level the narration never actually plays at.
    """
    return rms_db(path, "silenceremove=stop_periods=-1:stop_duration=0.2:"
                        "stop_threshold=-50dB")


def effect_chain(r, idx, gain_db):
    """One placement, as an ffmpeg filter chain ending in a labelled stream."""
    in_s, dur_s = num(r, "in_s"), num(r, "dur_s")
    fin, fout = num(r, "fade_in"), num(r, "fade_out")
    f = [f"aformat=sample_fmts=fltp:sample_rates={SR}:channel_layouts=mono"]
    if in_s or dur_s:
        f.append(f"atrim=start={in_s:.3f}" +
                 (f":end={in_s + dur_s:.3f}" if dur_s else "") + ",asetpts=N/SR/TB")
    if fin:
        f.append(f"afade=t=in:st=0:d={fin:.3f}")
    if fout and dur_s:
        f.append(f"afade=t=out:st={max(0.0, dur_s - fout):.3f}:d={fout:.3f}")
    f.append(f"volume={gain_db:.2f}dB")
    return f"[{idx}:a]" + ",".join(f) + f"[e{idx}]"


def loudnorm(src, dst, lufs, label):
    """Two pass. One pass loudnorm only estimates, and an event master that is
    2 LU off is an event master that gets ridden by hand from the desk."""
    r = subprocess.run(
        ["ffmpeg", "-v", "info", "-i", src, "-af",
         f"loudnorm=I={lufs}:TP={TP_DBTP}:LRA=11:print_format=json",
         "-f", "null", "-"], capture_output=True, text=True)
    m = re.search(r"\{[^{}]*input_i[^{}]*\}", r.stderr, re.S)
    if not m:
        die(f"loudnorm pass 1 gave no measurement for {src}")
    d = json.loads(m.group(0))
    run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af",
         f"loudnorm=I={lufs}:TP={TP_DBTP}:LRA=11"
         f":measured_I={d['input_i']}:measured_TP={d['input_tp']}"
         f":measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}"
         f":offset={d['target_offset']}:linear=true",
         "-ar", str(SR), "-c:a", "pcm_s24le", dst])
    print(f"  {label:34} in {float(d['input_i']):7.2f} LUFS  "
          f"tp {float(d['input_tp']):6.2f}  ->  {lufs:.0f} LUFS / {TP_DBTP} dBTP")


def main():
    os.chdir(HERE)
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--vo", default=None)
    ap.add_argument("--music", default=None)
    ap.add_argument("--calibrate", action="store_true",
                    help="write the derived gains into placements.csv gain_db")
    a = ap.parse_args()

    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            die(f"{tool} is not on PATH")

    tl = json.load(open("timeline.json", encoding="utf-8"))
    by = {s["sid"]: s for s in tl}
    total = tl[-1]["t_out"]

    vo = a.vo
    if not vo:
        cand = [os.path.join("vo_eleven", d, "narration.wav")
                for d in sorted(os.listdir("vo_eleven"))
                if os.path.exists(os.path.join("vo_eleven", d, "narration.wav"))]
        if not cand:
            die("no narration stem. Run: python3 stem.py <VOICE_ID>")
        vo = cand[-1]
    if a.music and not os.path.exists(a.music):
        die(f"no such music bed: {a.music}")

    with open("sfx/placements.csv", encoding="utf-8") as f:
        rd = csv.DictReader(f)
        cols = rd.fieldnames
        rows = [r for r in rd if r.get("file", "").strip()]
    if "level_rel_narr_db" not in (cols or []):
        die("sfx/placements.csv has no level_rel_narr_db column. That column is "
            "the level each effect sits at relative to the narration, and it is "
            "what the cue sheet and the licence log record")
    for r in rows:
        p = os.path.join("sfx", r["file"].strip())
        if not os.path.exists(p):
            die(f"{p} does not exist")
        if r["shot"].strip() not in by:
            die(f"{r['shot']} is not a shot in timeline.json")

    # The picture on disk must be the picture these timecodes describe.
    pic = os.path.join("..", "kannada-1080p-EVENT-master.mp4")
    stale = ""
    if os.path.exists(pic):
        d = float(run(["ffprobe", "-v", "error", "-show_entries",
                       "format=duration", "-of", "csv=p=0", pic]).stdout.strip())
        if abs(d - total) > 0.08:
            stale = (f"kannada-1080p-EVENT-master.mp4 is {d:.2f}s and "
                     f"timeline.json is {total:.2f}s. Re-render the picture "
                     f"before this audio is cut to it")

    print(f"narration stem   {vo}")
    print(f"music bed        {a.music or 'NONE. `07` 5.1 is a blocking, unsigned licence gate'}")
    print(f"effects          {len(rows)} placements from sfx/placements.csv")
    print(f"film             {tl[-1]['tc_out']} = {total:.2f}s")
    if stale:
        print(f"\n  WARNING: {stale}")

    narr = speech_rms_db(vo)
    ceiling = narr - HEADROOM_DB
    print(f"\nnarration speech RMS {narr:.2f} dBFS, so every effect must sit at "
          f"or below {ceiling:.2f} dBFS")

    # ------------------------------------------------------- measure and correct
    gains, table = {}, []
    for i, r in enumerate(rows):
        p = os.path.join("sfx", r["file"].strip())
        want = float(r["level_rel_narr_db"])
        if want > -HEADROOM_DB:
            die(f"row {i + 2}: {r['shot']} asks for {want:+.1f} dB relative to "
                f"narration. `14` item 8.7 allows no closer than "
                f"{-HEADROOM_DB:+.0f} dB")
        raw = rms_db(p, effect_chain(r, 0, 0.0)
                     .replace("[0:a]", "").replace("[e0]", ""))
        gain = (narr + want) - raw
        got = raw + gain
        if got > ceiling:                      # cannot happen while want <= -12
            gain += ceiling - got
            got = ceiling
        gains[i] = gain
        table.append((r["shot"].strip(), r["file"].strip()[:38], want,
                      raw, gain, got))
    print(f"\n{'shot':5} {'file':38} {'asked':>7} {'excerpt':>9} "
          f"{'gain':>7} {'achieved':>9}")
    for sid, f, want, raw, gain, got in table:
        print(f"{sid:5} {f:38} {want:+6.1f}  {raw:8.2f}  {gain:+6.1f}  "
              f"{got - narr:+8.2f}")
    print("  asked and achieved are dB relative to the narration's speech RMS. "
          "excerpt is the raw file at unity.")

    if a.calibrate:
        for i, r in enumerate(rows):
            r["gain_db"] = f"{gains[i]:+.2f}"
        with open("sfx/placements.csv", "w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=cols)
            w.writeheader()
            w.writerows(rows)
        print("\nwrote the derived gains back to sfx/placements.csv so "
              "sfx.py --check and its learning mix agree with this one.")

    if a.check:
        print("\n--check. Nothing was written.")
        return

    os.makedirs(OUTDIR, exist_ok=True)

    # ------------------------------------------------------------------- stems
    print("\nstems")
    dial = f"{OUTDIR}/stem-1-dialogue-kn.wav"
    run(["ffmpeg", "-v", "error", "-y", "-i", vo, "-af",
         f"aformat=sample_fmts=fltp:sample_rates={SR}:channel_layouts=mono,apad",
         "-t", f"{total:.3f}", "-c:a", "pcm_s24le", dial])
    print(f"  {dial}")

    music = None
    if a.music:
        music = f"{OUTDIR}/stem-2-music.wav"
        run(["ffmpeg", "-v", "error", "-y", "-i", a.music, "-af",
             f"aformat=sample_fmts=fltp:sample_rates={SR}:channel_layouts=mono,apad",
             "-t", f"{total:.3f}", "-c:a", "pcm_s24le", music])
        print(f"  {music}")
    else:
        print("  stem-2-music.wav  NOT BUILT. No music exists to mix")

    sfx = f"{OUTDIR}/stem-3-sfx-ambience-UNAPPROVED.wav"
    cmd = ["ffmpeg", "-v", "error", "-y"]
    for r in rows:
        cmd += ["-i", os.path.join("sfx", r["file"].strip())]
    chains, labels = [], []
    for i, r in enumerate(rows):
        at = by[r["shot"].strip()]["t_in"] + float(r["offset_s"])
        chains.append(effect_chain(r, i, gains[i]).replace(
            f"[e{i}]", f",adelay={int(round(at * 1000))}[e{i}]"))
        labels.append(f"[e{i}]")
    chains.append("".join(labels) + f"amix=inputs={len(rows)}:normalize=0,"
                  f"apad[out]")
    run(cmd + ["-filter_complex", ";".join(chains), "-map", "[out]",
               "-t", f"{total:.3f}", "-ar", str(SR), "-c:a", "pcm_s24le", sfx])
    print(f"  {sfx}")

    # ----------------------------------------------------------------- masters
    beds = [dial, sfx] + ([music] if music else [])
    tag = "" if music else "-NOMUSIC"
    pre = f"{OUTDIR}/.sum.wav"
    cmd = ["ffmpeg", "-v", "error", "-y"]
    for b in beds:
        cmd += ["-i", b]
    run(cmd + ["-filter_complex",
               f"{''.join(f'[{i}:a]' for i in range(len(beds)))}"
               f"amix=inputs={len(beds)}:normalize=0[out]",
               "-map", "[out]", "-ar", str(SR), "-c:a", "pcm_s24le", pre])

    print("\nmasters")
    event = f"{OUTDIR}/master-event-23lufs{tag}-UNAPPROVED.wav"
    online = f"{OUTDIR}/master-online-16lufs{tag}-UNAPPROVED.wav"
    # The hall does not need the bottom two octaves and a projector rig will
    # turn them into mud. `11` section 1, reduce low bass for auditorium.
    hp = f"{OUTDIR}/.sum-hp.wav"
    run(["ffmpeg", "-v", "error", "-y", "-i", pre, "-af",
         "highpass=f=65:poles=2", "-c:a", "pcm_s24le", hp])
    loudnorm(hp, event, EVENT_LUFS, "event, high-passed at 65 Hz")
    loudnorm(pre, online, ONLINE_LUFS, "online, full range")

    # ---------------------------------------------------------------- previews
    print("\npreviews, cut from the online master")
    for name, sid, off, dur, why in PREVIEWS:
        t0 = max(0.0, by[sid]["t_in"] + off)
        dst = f"{OUTDIR}/{name}-{int(dur)}s{tag}-UNAPPROVED.wav"
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t0:.3f}", "-t",
             f"{dur:.3f}", "-i", online, "-af",
             f"afade=t=in:st=0:d=0.05,afade=t=out:st={dur - 0.15:.3f}:d=0.15",
             "-c:a", "pcm_s24le", dst])
        print(f"  {os.path.basename(dst):52} {t0:7.2f}s  {why}")

    # -------------------------------------------------- the silence cues survive
    print("\nsilence cues, measured in the built stems")
    bad = []
    for sid, why in SILENT.items():
        sh, out = by[sid], []
        for label, path in [("sfx", sfx)] + ([("music", music)] if music else []):
            lvl = rms_db(path, f"atrim={sh['t_in']:.3f}:{sh['t_out']:.3f}")
            out.append(f"{label} {'silent' if lvl == float('-inf') else f'{lvl:.1f} dBFS'}")
            if lvl != float("-inf") and lvl > -70.0:
                bad.append(f"{sid}: the {label} stem is at {lvl:.1f} dBFS "
                           f"inside a cue that must be silent. {why}")
        print(f"  {sid} {sh['tc_in']} to {sh['tc_out']}  " + ",  ".join(out)
              + f"   {why}")
    if bad:
        die("\n".join("  " + b for b in bad) +
            "\n\n  `06` section 7 designs this film around these four. "
            "Fix the placement, not the check.")

    lens = {}
    for f in sorted(os.listdir(OUTDIR)):
        if f.endswith(".wav") and not f.startswith("."):
            lens[f] = float(run(["ffprobe", "-v", "error", "-show_entries",
                                 "format=duration", "-of", "csv=p=0",
                                 os.path.join(OUTDIR, f)]).stdout.strip())
    off = {f: d for f, d in lens.items()
           if not f.startswith("preview") and abs(d - total) > 0.02}
    if off:
        die("these are not the same length as the picture "
            f"({total:.2f}s):\n" +
            "\n".join(f"  {f}  {d:.2f}s" for f, d in off.items()))
    print(f"\nevery stem and master is {total:.2f}s, the length of the picture")

    os.remove(pre)
    os.remove(hp)
    print(f"\nwrote {OUTDIR}/")
    if not music:
        print("\n  NOMUSIC. `07` item 5.1, the music licence, is blocking and\n"
              "  unsigned, and no bed exists. These are reference mixes for\n"
              "  balance and intelligibility, not deliverables.")
    print("  UNAPPROVED. `07` item 5.7 forbids sound effects and 5.8 is unsigned.")
    if stale:
        print(f"\n  WARNING: {stale}")
    print("\n  mux a preview to picture:\n"
          f"    ffmpeg -ss <t0> -t <dur> -i ../kannada-1080p-EVENT-master.mp4 \\\n"
          f"      -i {OUTDIR}/<preview>.wav -map 0:v -map 1:a -c:v libx264 \\\n"
          f"      -crf 18 -c:a aac -b:a 192k -shortest <out>.mp4")


if __name__ == "__main__":
    main()
