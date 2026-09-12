#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Assembles the per-line ElevenLabs MP3s into one timeline-aligned narration WAV.

  python3 stem.py <VOICE_ID>          # writes vo_eleven/<VOICE_ID>/narration.wav
  python3 stem.py                     # lists the voice directories it can see

This is the missing link between tts_eleven.py, which writes one MP3 per line,
and master.py --vo, which wants a single WAV. vo.py already does the same job
for the macOS scratch track; this is its ElevenLabs counterpart.

WHY A SCRIPT AND NOT THE HEREDOC IN 09 SECTION 6
That heredoc picks its voice with sorted(glob("vo_eleven/*/durations.json"))[-1].
Any sibling directory sorting after the real one wins silently: an audition
backup, a second voice, a stray VOICE_ID_HERE. It would then build a stem from
five lines out of forty-three and still print success. The voice is named here
instead, because a narration track that is quietly 90 percent silence is exactly
the kind of failure `14` item 7.8 is about.

PLACEMENT
Each line starts at its shot's t_in, so pauses and holds stay silent. Run this
only AFTER build_timeline.py --from-audio, or the shots still carry the
predicted allocations and every line after the first drift will sit wrong.
Narration peaks at -3 dBTP, per `07` section 10 and `14` item 8.7.
"""
import glob
import json
import math
import os
import struct
import subprocess
import sys
import tempfile
import wave

SR = 48000
PEAK_DBTP = -3.0
HERE = os.path.dirname(os.path.abspath(__file__))


def die(msg):
    sys.exit(msg)


def voice_dirs():
    return sorted(os.path.dirname(p)
                  for p in glob.glob("vo_eleven/*/durations.json"))


def main():
    os.chdir(HERE)

    if len(sys.argv) < 2:
        print(__doc__.strip().split("\n\n")[0])
        print("\nvoice directories with a durations.json:")
        for d in voice_dirs():
            n = len(glob.glob(os.path.join(d, "*.mp3")))
            print(f"  {os.path.basename(d):40} {n:3d} lines")
        print("\nName one:  python3 stem.py <VOICE_ID>")
        return

    voice = sys.argv[1].strip("/")
    d = os.path.join("vo_eleven", os.path.basename(voice))
    if not os.path.isdir(d):
        die(f"no such voice directory: {d}\n"
            f"run: python3 stem.py     to list what is there")

    tl = json.load(open("timeline.json", encoding="utf-8"))
    total = tl[-1]["t_out"]
    track = [0] * int(math.ceil(total * SR) + SR)

    # Every shot carrying narration must have an MP3. A missing line is a hole
    # in the read, not something to skip quietly.
    want = [s for s in tl if s["narr"].strip()]
    missing = [s["sid"] for s in want
               if not os.path.exists(os.path.join(d, s["sid"] + ".mp3"))]
    if missing:
        die(f"{len(missing)} narration lines have no MP3 in {d}:\n"
            f"  {' '.join(missing)}\n"
            f"render them first: python3 tts_eleven.py --render {voice}")

    placed, overruns = 0, []
    with tempfile.TemporaryDirectory() as tmp:
        one = os.path.join(tmp, "line.wav")
        for sh in want:
            src = os.path.join(d, sh["sid"] + ".mp3")
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src,
                            "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", one],
                           check=True)
            w = wave.open(one)
            n = w.getnframes()
            s = struct.unpack("<%dh" % n, w.readframes(n))
            w.close()

            # A line longer than its shot bleeds over the cut into the next one.
            # After --from-audio this should not happen; if it does, the timeline
            # was not re-derived against THIS render.
            spoken = n / SR
            if spoken > sh["speech"] + 0.02:
                overruns.append((sh["sid"], sh["speech"], spoken))

            at = int(round(sh["t_in"] * SR))
            for i, v in enumerate(s):
                j = at + i
                if j < len(track):
                    track[j] += v
            placed += 1

    peak = max(1, max(abs(v) for v in track))
    gain = (10 ** (PEAK_DBTP / 20)) * 32767 / peak
    track = [max(-32768, min(32767, int(v * gain))) for v in track]

    out = os.path.join(d, "narration.wav")
    w = wave.open(out, "w")
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(struct.pack("<%dh" % len(track), *track))
    w.close()

    print(f"placed {placed} lines over {len(track)/SR:.2f}s, peak {PEAK_DBTP:+.1f} dBTP")
    print(f"wrote {out}")
    if overruns:
        print(f"\n  {len(overruns)} lines run past their shot and bleed over the cut:")
        for sid, alloc, spoken in overruns:
            print(f"    {sid}  shot speech {alloc:5.2f}s   spoken {spoken:5.2f}s")
        print("  re-derive against this render:\n"
              f"    python3 build_timeline.py timeline.json --from-audio {d}/durations.json")


if __name__ == "__main__":
    main()
