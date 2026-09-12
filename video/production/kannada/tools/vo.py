#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Builds a SCRATCH Kannada narration track for the animatic.

Voice: Soumya (kn_IN), the macOS system Kannada voice. This is a temp track for
judging pace and sync, NOT the film's narration. 02 governs casting, and 14 item
5.5 requires a signed narrator release before any real narration is used.

Each line is fitted to the exact speech allocation its shot already has in
timeline.json, by iterating the `say` rate until the rendered duration matches.
Picture never moves to accommodate audio.
"""
import json, math, os, subprocess, sys, wave, struct

SR = 48000
VOICE = "Soumya"
TL = json.load(open("timeline.json", encoding="utf-8"))
os.makedirs("vo", exist_ok=True)

def dur(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", path], capture_output=True, text=True)
    return float(out.stdout.strip())

def render(text, rate, aiff):
    subprocess.run(["say", "-v", VOICE, "-r", str(int(round(rate))), "-o", aiff, text],
                   check=True)
    return dur(aiff)

def fit(text, target, tag):
    """Choose a `say` rate so the line lands within ~1.5% of its allocation."""
    aiff, rate = f"vo/{tag}.aiff", 150.0
    d = render(text, rate, aiff)
    for _ in range(6):
        if abs(d - target) / target < 0.015:
            break
        rate = max(60.0, min(400.0, rate * d / target))
        d = render(text, rate, aiff)
    wav = f"vo/{tag}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", aiff, "-ar", str(SR),
                    "-ac", "1", "-c:a", "pcm_s16le", wav], check=True)
    return wav, d, rate

# ---------------------------------------------------------------- render lines
total = TL[-1]["t_out"]
track = [0] * int(math.ceil(total * SR) + SR)
rows = []
for sh in TL:
    if not sh["narr"].strip():
        continue
    tag = sh["sid"]
    wav, d, rate = fit(sh["narr"], sh["speech"], tag)
    w = wave.open(wav); n = w.getnframes()
    s = struct.unpack("<%dh" % n, w.readframes(n)); w.close()
    at = int(round(sh["t_in"] * SR))
    for i, v in enumerate(s):
        j = at + i
        if j < len(track):
            track[j] += v
    rows.append((tag, sh["words"], sh["speech"], d, rate))
    print(f"  {tag:4} {sh['words']:3d}w  target {sh['speech']:5.2f}s  "
          f"got {d:5.2f}s  rate {rate:5.1f}", flush=True)

# ---------------------------------------------------------------- normalise
peak = max(1, max(abs(v) for v in track))
# narration peaks at -3 dBTP, per 07 section 10 and 14 item 8.7
gain = (10 ** (-3.0 / 20)) * 32767 / peak
track = [max(-32768, min(32767, int(v * gain))) for v in track]

out = "vo/scratch_narration.wav"
w = wave.open(out, "w"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes(struct.pack("<%dh" % len(track), *track)); w.close()
print("\nwrote", out, "%.2fs" % (len(track) / SR))
rr = [r[4] for r in rows]
print("rate range %.0f to %.0f  (median %.0f)" % (min(rr), max(rr), sorted(rr)[len(rr)//2]))
worst = max(rows, key=lambda r: abs(r[3] - r[2]) / r[2])
print("worst fit: %s target %.2f got %.2f (%.1f%%)" % (
    worst[0], worst[2], worst[3], 100 * abs(worst[3] - worst[2]) / worst[2]))
json.dump([{"sid": r[0], "words": r[1], "target": r[2], "got": r[3], "rate": r[4]}
           for r in rows], open("vo/fit.json", "w"), indent=1)
