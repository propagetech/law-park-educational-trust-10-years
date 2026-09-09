#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Re-muxes the four deliverables onto the audio that is on disk now.

  python3 rebuild_deliverables.py

The picture has not changed, so this does not re-render it: it re-encodes only
the audio and stream-copies the video, which is the difference between four
minutes and forty. Run film.py or master.py instead if the picture moved.

WHY LINEAR NORMALISATION, EVERY TIME
Single-pass loudnorm is dynamic. It lifts gain through quiet passages, and this
film's quiet passages are the point of it: K06, K12, K27 and K34 are written
silences (`06` section 7) and a normaliser that fills them with lifted noise
floor produces a master that is wrong in the one way nobody catches in a
listening room but everybody catches in a hall. Each output below is measured
first and then given a single fixed gain.
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.dirname(HERE)
VOICE = "vo_eleven/EXAVITQu4vr4xnSDxMaL"

# (output, picture, audio, LUFS, dBTP, extra ffmpeg args)
OUTPUTS = [
    ("kannada-1080p-EVENT-master.mp4", "silent.mp4",
     f"{VOICE}/narration_plus_sfx_LEARNING.wav", -23, -3.0, []),
    ("08-kannada-elevenlabs-sfx-learning-mix.mp4", "silent.mp4",
     f"{VOICE}/narration_plus_sfx_LEARNING.wav", -16, -3.0, []),
    ("08-kannada-elevenlabs-preview.mp4", "silent.mp4",
     f"{VOICE}/narration.wav", -16, -3.0, []),
    ("kannada-2160p-review.mp4", "picture-2160p.mp4",
     f"{VOICE}/narration_plus_sfx_LEARNING.wav", -14, -1.5,
     ["-i", os.path.join(PACK, "05-kannada-subtitles.srt"),
      "-map", "2:s", "-c:s", "mov_text", "-metadata:s:s:0", "language=kan"]),
]


def duration(path):
    return float(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", path], capture_output=True, text=True).stdout.strip())


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"failed: {' '.join(cmd[:8])}...\n{r.stderr.strip()[-800:]}")
    return r


def measure(path, I, TP):
    """One measurement pass, so the second pass can apply a fixed gain."""
    err = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", path,
         "-af", f"loudnorm=I={I}:TP={TP}:LRA=11:print_format=json",
         "-f", "null", "-"], capture_output=True, text=True).stderr
    return json.loads(err[err.rindex("{"):err.rindex("}") + 1])


def main():
    os.chdir(HERE)
    for name, pic, aud, I, TP, extra in OUTPUTS:
        out = os.path.join(PACK, name)
        for need in (pic, aud):
            if not os.path.exists(need):
                sys.exit(f"missing {need}")
        print(f"\n{name}")
        m = measure(aud, I, TP)
        print(f"  {os.path.basename(aud)} measures {m['input_i']} LUFS, "
              f"{m['input_tp']} dBTP -> {I} LUFS")
        af = (f"loudnorm=I={I}:TP={TP}:LRA=11"
              f":measured_I={m['input_i']}:measured_TP={m['input_tp']}"
              f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}"
              ":linear=true")
        run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
             "-i", pic, "-i", aud] + extra[:2] +
            ["-map", "0:v", "-map", "1:a"] + extra[2:] +
            ["-c:v", "copy", "-af", af,
             "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-ac", "2",
             # -t, not -shortest.
             #
             # -shortest bounds the output by the SHORTEST input, and a subtitle
             # stream ends at its last cue. 05-kannada-subtitles.srt runs out at
             # 350.88s because the end card carries no narration to caption, so
             # the 2160p master came out 350.88s and lost its whole seven-second
             # end card: the logo, the wordmark, the site and the phone number.
             # It was 357.88s long, it was valid, and nothing failed.
             #
             # The picture's own duration is the only correct bound, so it is
             # measured and passed explicitly.
             "-t", f"{duration(pic):.3f}", "-movflags", "+faststart",
             "-metadata", "title=Law Park Educational Trust, ten years, Kannada "
                          "(REVIEW COPY, NOT FOR RELEASE)", out])
        print(f"  wrote {out}  ({os.path.getsize(out) / 1e6:.0f} MB)")


if __name__ == "__main__":
    main()
