#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Screens an ambience file for human voice before it goes anywhere near the cut.

  python3 sfx_voicecheck.py sfx/some-ambience.mp3
  python3 sfx_voicecheck.py sfx/some-ambience.mp3 --window 0.5 --need 2.0

WHY THIS EXISTS
`14` item 2.4 forbids any identifiable voice in this film, children's above all,
and the consent register is built on that. A "village ambience" or "schoolyard"
bed is exactly where one hides: the file is minutes long, the offending second
is somewhere in the middle, and nobody listens past the first twenty seconds
before dropping it into the timeline.

WHAT IT DOES AND DOES NOT TELL YOU
This is a screen, not a verdict. It scores each window on three things that
together look like speech and rarely coincide otherwise:

  band    energy in 300 to 3400 Hz as a share of the total. Speech lives there;
          wind and rumble do not, and birdsong sits mostly above it
  tonal   spectral flatness inverted. Voiced speech is harmonic, so it is far
          from flat; wind, rain and hiss are close to flat
  mod     envelope modulation at 3 to 8 Hz, the syllable rate. This is the one
          that separates speech from a steady tonal hum

A window scoring high on all three is very likely a voice. A LOW score is not a
guarantee of safety: a distant single shout is short enough to average away. The
output ends with the quietest, least speech-like stretches so a human can
audition a shortlist instead of the whole file, but a human still has to listen.
"""
import argparse, subprocess, sys, wave, struct
import numpy as np

SR = 16000


def decode(path):
    p = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-ar", str(SR), "-ac", "1",
         "-f", "wav", "-"], capture_output=True)
    if p.returncode:
        sys.exit(f"ffmpeg cannot read {path}\n{p.stderr.decode()[:300]}")
    import io
    w = wave.open(io.BytesIO(p.stdout))
    n = w.getnframes()
    x = np.frombuffer(w.readframes(n), dtype="<i2").astype(np.float64) / 32768.0
    return x


def analyse(x, win):
    hop = int(SR * win)
    nwin = len(x) // hop
    freqs = np.fft.rfftfreq(hop, 1 / SR)
    band = (freqs >= 300) & (freqs <= 3400)
    out = []
    for i in range(nwin):
        seg = x[i * hop:(i + 1) * hop]
        rms = float(np.sqrt(np.mean(seg ** 2))) + 1e-12
        spec = np.abs(np.fft.rfft(seg * np.hanning(len(seg)))) + 1e-12
        power = spec ** 2
        band_ratio = float(power[band].sum() / power.sum())
        # spectral flatness: geometric over arithmetic mean
        flat = float(np.exp(np.mean(np.log(power))) / np.mean(power))
        tonal = 1.0 - flat
        # syllable-rate modulation of the envelope
        env = np.abs(seg)
        k = max(1, int(SR * 0.01))
        env = np.convolve(env, np.ones(k) / k, mode="same")
        env = env - env.mean()
        espec = np.abs(np.fft.rfft(env * np.hanning(len(env))))
        efreq = np.fft.rfftfreq(len(env), 1 / SR)
        syl = (efreq >= 3) & (efreq <= 8)
        mod = float(espec[syl].sum() / (espec.sum() + 1e-12))
        out.append((i * win, rms, band_ratio, tonal, mod))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file")
    ap.add_argument("--window", type=float, default=0.5)
    ap.add_argument("--need", type=float, default=2.0,
                    help="length of clean excerpt you are looking for")
    ap.add_argument("--top", type=int, default=8)
    a = ap.parse_args()

    x = decode(a.file)
    rows = analyse(x, a.window)
    if not rows:
        sys.exit("file too short to analyse")

    band = np.array([r[2] for r in rows])
    tonal = np.array([r[3] for r in rows])
    mod = np.array([r[4] for r in rows])
    rms = np.array([r[1] for r in rows])

    def z(v):
        s = v.std() or 1.0
        return (v - v.mean()) / s

    score = z(band) + z(tonal) + z(mod)

    print(f"\n{a.file}")
    print(f"  {len(rows)} windows of {a.window}s over {len(x)/SR:.1f}s")
    print(f"  band 300-3400Hz  mean {band.mean():.2f}  max {band.max():.2f}")
    print(f"  tonality         mean {tonal.mean():.3f}  max {tonal.max():.3f}")
    print(f"  3-8Hz modulation mean {mod.mean():.3f}  max {mod.max():.3f}")

    order = np.argsort(-score)[:a.top]
    print(f"\n  most speech-like windows (audition these first):")
    print(f"    {'at':>8} {'score':>6} {'band':>6} {'tonal':>6} {'mod':>6} {'dBFS':>7}")
    for i in sorted(order):
        t, r, b, tn, m = rows[i]
        print(f"    {t:8.1f} {score[i]:6.2f} {b:6.2f} {tn:6.3f} {m:6.3f} "
              f"{20*np.log10(r+1e-12):7.1f}")

    # Longest run of below-median-score windows, for a safe excerpt.
    need = int(np.ceil(a.need / a.window))
    thr = np.percentile(score, 25)
    best, run, start = (0, 0), 0, 0
    for i, s in enumerate(score):
        if s <= thr:
            if run == 0:
                start = i
            run += 1
            if run > best[0]:
                best = (run, start)
        else:
            run = 0
    if best[0] >= need:
        t0 = best[1] * a.window
        print(f"\n  quietest, least speech-like run: {best[0]*a.window:.1f}s "
              f"from {t0:.1f}s")
        print(f"  a {a.need:.1f}s excerpt could take in_s={t0 + 0.2:.2f}")
    else:
        print(f"\n  no run of {a.need:.1f}s sits in the calmest quartile. "
              f"This file is busy throughout.")

    print(f"\n  A LOW SCORE IS NOT CLEARANCE. `14` item 2.4 is absolute, and a "
          f"single distant\n  shout averages away in a {a.window}s window. A "
          f"human must listen to the excerpt\n  that actually ships.\n")


if __name__ == "__main__":
    main()
