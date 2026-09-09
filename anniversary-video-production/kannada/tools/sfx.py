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
MAX_EFFECTS = 32          # `11` section 3 capped this at 14. Raised on the
                          # Trust's instruction to place every licensed file.
HEADROOM_DB = 12.0        # `14` item 8.7, effects at least 12 dB under narration

# WHY THE HEADROOM IS MEASURED LOCALLY AND NOT OVER THE WHOLE FILM
# `14` item 8.7 reads "music bed at least 12 dB below narration". It says
# nothing about effects, and the point of it is that nothing may compete with
# the voice WHILE THE VOICE IS SPEAKING.
#
# This script used to read it as a global ceiling: one RMS taken across the
# entire narration stem, every effect held under that. The result measured as
# an inaudible sound design. The narration's speech RMS is -17.8 dBFS, so the
# ceiling sat at -29.8 dBFS and the school bell that opens the film, alone in
# seven seconds of silence with no voice anywhere near it, was pulled down to
# -36 dBFS. Eleven of the fourteen effects contributed between 0.00 and 0.19 dB
# to the mix. They were placed, they were correct, and nobody could hear them.
#
# The ceiling is now taken over the window each effect actually occupies. Under
# narration the rule bites exactly as before, against the voice that is really
# there. In a silence it does not bite at all, and the effect plays at
# SOLO_TARGET instead of ducking under a voice that is not speaking.
# Where the threshold sits, and why it is not lower. The narration stem is not
# digitally silent between lines: the ElevenLabs render leaves a floor around
# -35 to -41 dBFS, while spoken Kannada in this read sits at -15 to -18 dBFS.
# A threshold of -45 dBFS classified that floor as speech, so the bell at K01,
# the whoosh at K15 and the applause at K46 all ducked 16 to 20 dB beneath a
# voice that was not there and came out at -53 to -57 dBFS. -28 dBFS sits in
# the gap between the two populations with about 7 dB of margin on each side.
SPEECH_FLOOR_DBFS = -28.0   # a window quieter than this carries no voice to duck under
SOLO_ACCENT_DBFS = -22.0    # an accent alone in a silence, unless solo_dbfs says otherwise
SOLO_BED_DBFS = -30.0       # an ambience bed alone in a silence
BED_SPLIT_FADE = 0.40       # fade either side of a silence cue carved out of a bed


def die(msg):
    sys.exit(f"refusing to build.\n{msg}")


def decode(path, tmp, in_s=0.0, dur_s=None, fin=0.0, fout=0.0,
           loop=False, win_s=None):
    """Decode to 48k mono, optionally taking one excerpt with fades.

    Most library effects are far longer than the moment they are used for: a
    26-second applause bed or a 21-second bag handle. Trimming here rather than
    pre-cutting new files keeps one file on disk per licence-log row, so the
    log still describes what shipped.

    `loop` tiles the excerpt until it reaches `dur_s`, which is how a 27-second
    wind recording covers a 90-second act. `win_s` bounds the part of the source
    the tile is cut from, and that is not a convenience: the village ambience
    carries human speech everywhere except one 12.5-second window, so the bed
    has to be built from that window and nothing else (`14` item 2.4).

    ffmpeg's own -stream_loop is not used. Combined with an input -ss it does
    not honour the output duration, and a bed that quietly runs long or short
    is exactly the class of error this pack keeps trying to design out.
    """
    out = os.path.join(tmp, "e.wav")
    take = win_s if (loop and win_s) else dur_s
    cmd = ["ffmpeg", "-v", "error", "-y"]
    if in_s:
        cmd += ["-ss", f"{in_s:.3f}"]
    if take:
        cmd += ["-t", f"{take:.3f}"]
    cmd += ["-i", path, "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        die(f"ffmpeg cannot read {path}\n{r.stderr.strip()[:400]}")
    w = wave.open(out)
    n = w.getnframes()
    s = list(struct.unpack("<%dh" % n, w.readframes(n)))
    w.close()
    if not n:
        die(f"{path}: the in_s/dur_s excerpt is empty")

    if loop and dur_s:
        s = tile(s, int(round(dur_s * SR)))
    if fin:
        f = min(int(fin * SR), len(s))
        for k in range(f):
            s[k] *= k / f
    if fout:
        f = min(int(fout * SR), len(s))
        for k in range(f):
            s[len(s) - 1 - k] *= k / f
    return s


def tile(src, want, xfade_s=0.6):
    """Repeat `src` up to `want` samples, crossfading each seam.

    A hard butt-join in a wind or insect bed reads as a click and then as a
    loop, which is worse than no bed at all. The crossfade costs the seam
    length per repeat and makes the repetition hard to place by ear.
    """
    if len(src) >= want:
        return src[:want]
    x = min(int(xfade_s * SR), len(src) // 3)
    out = list(src)
    while len(out) < want:
        head = out[-x:] if x else []
        body = list(src)
        for k in range(x):
            a = (x - k) / x
            body[k] = head[k] * a + body[k] * (1 - a)
        out = out[:len(out) - x] + body
    return out[:want]


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


def dbfs(v):
    return 20 * math.log10(v / 32768.0) if v > 0 else -120.0


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
        # Never sorted(...)[-1]. stem.py's docstring explains why and this
        # script had the same bug: any sibling directory sorting later wins
        # silently, including an audition backup or a literal VOICE_ID_HERE.
        # The mix would then be built against the wrong read and still succeed.
        if len(cand) > 1:
            die("more than one narration stem exists, so this will not guess:\n"
                + "\n".join(f"    {c}" for c in cand)
                + "\n  Name one:  python3 sfx.py --vo <path/to/narration.wav>")
        vo = cand[0]

    # Whichever stem is used, its length must match the timeline it is being
    # mixed against. A stem from before a re-time is the same failure as
    # picking the wrong directory, and it is invisible in the output.
    # stem.py allocates ceil(total * SR) + SR samples, so a correct stem runs
    # about one second longer than the timeline. Anything shorter than the
    # timeline, or more than two seconds over, is a stem from another cut.
    stem_len = probe(vo)
    if stem_len < total - 0.5 or stem_len > total + 2.0:
        die(f"{vo} is {stem_len:.2f}s but timeline.json runs {total:.2f}s.\n"
            f"  A current stem runs {total:.2f}s to {total + 1.0:.2f}s. This one "
            f"is from another cut, so every placement below would sit against "
            f"the wrong read.\n"
            f"  Rebuild it:  python3 stem.py <VOICE_ID>")

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
        # A bed is anchored to the shot it starts on and then runs across the
        # act. Only its start has to sit inside that shot.

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
                    # A bed runs for a whole act and will always cross one of
                    # these. The mix carves the cue out of it with a fade either
                    # side, so the cue stays silent and the bed stays a bed. An
                    # accent has no such defence and is still refused.
                    if (r.get("kind") or "accent").strip().lower() == "bed":
                        warns.append(
                            f"row {i}: bed crosses {fsid} ({f0:.2f}s to "
                            f"{f1:.2f}s), {why}. The mix will carve it out "
                            f"with a {BED_SPLIT_FADE:.2f}s fade either side")
                        continue
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
    print(f"narration speech RMS {dbfs(narration_rms):.1f} dBFS over the whole "
          f"film. Each effect is levelled against the window it occupies, not "
          f"against this.\n")

    # The four silence cues, as sample ranges, so a bed can be carved around them.
    holes = [(int(tl[k]["t_in"] * SR), int(tl[k]["t_out"] * SR))
             for k in FORBIDDEN if k in tl]

    # Effects are summed onto their own bus, not straight into the narration.
    # Levelling each effect against the voice on its own is not enough once
    # several of them overlap: a riser, an impact, a room-tone floor and an act
    # bed can each sit 14 dB under the voice and still add up to 8 dB under it,
    # which is over the line `14` item 8.7 draws. The bus is what the rule
    # applies to, so the rule is enforced on the bus, after everything is on it.
    fx = [0.0] * len(track)

    print(f"{'shot':5} {'kind':6} {'at':>7} {'len':>6} {'voice':>8} "
          f"{'effect':>8} {'under':>7}  file")
    with tempfile.TemporaryDirectory() as tmp:
        for r in rows:
            sid = r["shot"].strip()
            at = tl[sid]["t_in"] + float(r["offset_s"])
            kind = (r.get("kind") or "accent").strip().lower() or "accent"
            # gain_db is NOT read here. It is mix.py's derived column and this
            # script computes its own target below, so multiplying by it and
            # then rescaling would cancel exactly. Leaving the multiply in
            # implied the column still drove something.
            s = [v for v in decode(
                os.path.join(SFXDIR, r["file"].strip()), tmp,
                num(r, "in_s"), num(r, "dur_s") or None,
                num(r, "fade_in"), num(r, "fade_out"),
                loop=(kind == "bed"), win_s=num(r, "win_s") or None)]
            i0 = int(round(at * SR))

            # ---------------------------------------------- level, locally
            # The voice in the window this effect actually covers, not the
            # voice averaged over the whole film.
            local = rms([v for v in track[i0:i0 + len(s)]])
            got = rms(s)
            if dbfs(local) > SPEECH_FLOOR_DBFS:
                want = local * (10 ** (float(r["level_rel_narr_db"]) / 20))
                law = f"{float(r['level_rel_narr_db']):+.0f} under voice"
            else:
                solo = num(r, "solo_dbfs") or (
                    SOLO_BED_DBFS if kind == "bed" else SOLO_ACCENT_DBFS)
                want = 32768.0 * (10 ** (solo / 20))
                law = f"solo {solo:+.0f}"
            if got:
                s = [v * (want / got) for v in s]

            # ---------------------------------------------- carve the silences
            # A bed is minutes long and will cross a silence cue. Rather than
            # refuse the build, take the cue out of the bed with a fade either
            # side, so K06/K12/K27/K34 stay as silent as the edit designs them.
            carved = 0
            if kind == "bed":
                f = int(BED_SPLIT_FADE * SR)
                for h0, h1 in holes:
                    a0, a1 = max(i0, h0), min(i0 + len(s), h1)
                    if a0 >= a1:
                        continue
                    carved += 1
                    for j in range(a0, a1):
                        s[j - i0] = 0.0
                    for k in range(f):                       # fade down into it
                        j = a0 - f + k
                        if i0 <= j < i0 + len(s):
                            s[j - i0] *= (f - k) / f
                    for k in range(f):                       # fade up out of it
                        j = a1 + k
                        if i0 <= j < i0 + len(s):
                            s[j - i0] *= k / f

            for k, v in enumerate(s):
                j = i0 + k
                if j < len(fx):
                    fx[j] += v
            print(f"{sid:5} {kind:6} {at:7.2f} {len(s)/SR:6.2f} "
                  f"{dbfs(local):8.1f} {dbfs(rms(s)):8.1f} {law:>7}  "
                  f"{r['file'][:40]}"
                  + (f"   [{carved} silence cue carved]" if carved else ""))

    # ------------------------------------------------- hold the bus under 8.7
    # Walked in 1.5 second windows on a 0.5 second hop. The window length is the
    # point: `14` item 8.7 is a rule about a BED, an integrated level, and read
    # at 200 ms it becomes a rule about peaks instead. Measured that way the bus
    # ran 16.7 dB over at its worst and the correction that follows would have
    # flattened every page turn and impact back to where this rebuild found
    # them. At 1.5 seconds a sustained bed still registers in full and a 0.3
    # second transient averages down to roughly what it contributes, which is
    # what the rule is actually asking about.
    W = int(1.500 * SR)
    hop = int(0.500 * SR)
    # Half a dB of margin, and up to four passes. One pass does not converge:
    # the envelope is smoothed and interpolated, so the ramp either side of a
    # correction still lands a little over, and the next pass sees the bus it
    # actually produced rather than the one it started from.
    lim = 10 ** (-(HEADROOM_DB + 0.5) / 20)
    floor = 32768.0 * (10 ** (SPEECH_FLOOR_DBFS / 20))
    first_over, first_worst = 0, 0.0
    for _pass in range(4):
        env = [1.0] * (len(fx) // hop + 2)
        over, worst = 0, 0.0
        for wi in range(len(env)):
            i0 = wi * hop
            seg = fx[i0:i0 + W]
            if not seg:
                continue
            vr = rms(track[i0:i0 + W])
            fr = rms(seg)
            if vr > floor and fr > vr * lim:
                env[wi] = (vr * lim) / fr
                over += 1
                worst = max(worst, -20 * math.log10(env[wi]))
        if _pass == 0:
            first_over, first_worst = over, worst
        if not over:
            break
        for wi in range(1, len(env)):                # min across the overlap
            env[wi - 1] = min(env[wi - 1], env[wi])
        sm = max(1, int(1.000 * SR) // hop)
        sme = [min(env[max(0, wi - sm):wi + sm + 1]) for wi in range(len(env))]
        for j in range(len(fx)):
            wi = j / hop
            k = int(wi)
            t = wi - k
            fx[j] *= sme[k] * (1 - t) + sme[min(k + 1, len(sme) - 1)] * t
    # Measured again after the last correction was applied. Reporting `over`
    # from the loop would report the state before that pass landed.
    left, tight = 0, 99.0
    for wi in range(len(fx) // hop):
        i0 = wi * hop
        vr, fr = rms(track[i0:i0 + W]), rms(fx[i0:i0 + W])
        if vr > floor and fr > 0:
            head = 20 * math.log10(vr / fr)
            tight = min(tight, head)
            if head < HEADROOM_DB:
                left += 1
    if first_over:
        print(f"\n  {first_over} windows had the effects bus closer than "
              f"{HEADROOM_DB:.0f} dB to the voice, worst {first_worst:.1f} dB "
              f"over. Ducked over {_pass + 1} pass(es). "
              + (f"Tightest is now {tight:.2f} dB, so the bus is under "
                 f"`14` 8.7 everywhere" if not left
                 else f"{left} windows remain over, tightest {tight:.2f} dB"))

    for j in range(len(track)):
        track[j] = max(-32768, min(32767, int(track[j] + fx[j])))

    out = os.path.join(os.path.dirname(vo), "narration_plus_sfx_LEARNING.wav")
    o = wave.open(out, "w")
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR)
    o.writeframes(struct.pack("<%dh" % len(track), *track))
    o.close()
    print(f"\nwrote {out}  ({len(track)/SR:.2f}s)")

    # The effects on their own. Nobody can judge a sound design by listening for
    # it under a voice, and the difference between "placed" and "audible" is the
    # whole reason this rebuild happened.
    fxout = os.path.join(os.path.dirname(vo), "effects_bus_LEARNING.wav")
    o = wave.open(fxout, "w")
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR)
    o.writeframes(struct.pack("<%dh" % len(fx),
                              *[max(-32768, min(32767, int(v))) for v in fx]))
    o.close()
    print(f"wrote {fxout}  (the sound design alone, no narration)")
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
