#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Builds the 2160p (3840x2160) delivery master of the Kannada cut.

  python3 master.py --check                    report the publishing gates, build nothing
  python3 master.py                            4K review master, scratch narration
  python3 master.py --vo path/to/narration.wav 4K master with the human narration
  python3 master.py --vo ... --release         the YouTube upload master

Why 4K at all, when no source photograph reaches 3840px
-------------------------------------------------------
Two honest reasons, and one thing this does NOT buy.

1. The Kannada type is genuinely 4K. Every card, lower third and gloss panel is
   re-rendered by Chrome at device_scale_factor=2 (gfx.py --scale 2), so glyph
   curves and conjuncts are drawn at the target resolution instead of being
   enlarged. 16 of the 46 shots are card or photo-card shots, and type is where
   softness is most visible, so this is a real gain.

2. YouTube allocates a better codec and a higher bitrate to a 2160p upload than
   to a 1080p one. A viewer watching at 1080p sees YouTube's downscale of the
   4K transcode, which holds together better than YouTube's 1080p transcode of
   a 1080p upload. This is the main reason to deliver 4K here.

It does NOT buy real photographic detail. The largest still in the library is
1920x1446 and 29 of the 34 unique files are under 1920px, so at 2160p the
photography is Lanczos-enlarged between roughly 2x and 4x. Judge the master on
type crispness and on YouTube's delivered quality, not on photographic sharpness.

Publishing gates
----------------
--release refuses to run unless every gate below is explicitly waived with
--waive, because uploading to YouTube is public release and this film is not
cleared for it. See 07-final-rights-and-approval-checklist.md.
"""
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.dirname(HERE)

SCRATCH_VO = "vo/scratch_narration.wav"

# Each gate is a real blocker recorded in the production documents. The count of
# consent-blocked shots is read from timeline.json rather than hard-coded.
GATES = [
    ("narration",
     "The narration is the macOS 'say' scratch track, not a human Kannada voice.",
     "02-kannada-voice-audition-plan.md"),
    ("consent",
     "{n} of 46 shots carry unresolved guardian or partner consent.",
     "07-final-rights-and-approval-checklist.md"),
    ("copyright",
     "K36 is an Udayavani newspaper clipping. Third-party copyright, no written permission on file.",
     "anniversary-video-research/14-rights-consent-and-publishing-checklist.md"),
    ("music",
     "No music licence cleared for event plus YouTube plus web.",
     "07-final-rights-and-approval-checklist.md"),
    ("credits",
     "End-roll names are not spelling-verified and consent to be named is not recorded.",
     "anniversary-video-research/13-credits-and-acknowledgements.md"),
]


def blocked_shot_count():
    tl = json.load(open(os.path.join(HERE, "timeline.json"), encoding="utf-8"))
    n = 0
    for s in tl:
        c = (s.get("consent") or "").upper()
        if "BLOCKING" in c or "COPYRIGHT" in c:
            n += 1
    return n


def report_gates():
    n = blocked_shot_count()
    print("Publishing gates for a public YouTube release\n")
    for key, msg, doc in GATES:
        print(f"  [ ] {key:10s} {msg.format(n=n)}")
        print(f"      {doc}")
    print("\nAll five are open. This film is not cleared for public release.")
    print("A 4K review master is still useful and is what this script builds by")
    print("default. Pass --release only when the Trust has signed every gate off.")


def run(cmd, **kw):
    print("  $", " ".join(str(c) for c in cmd), flush=True)
    r = subprocess.run(cmd, **kw)
    if r.returncode != 0:
        sys.exit(f"failed: {' '.join(str(c) for c in cmd)}")


def arg(flag, default=None):
    if flag in sys.argv:
        i = sys.argv.index(flag)
        if i + 1 < len(sys.argv) and not sys.argv[i + 1].startswith("--"):
            return sys.argv[i + 1]
        return True
    return default


def main():
    os.chdir(HERE)

    if "--check" in sys.argv:
        report_gates()
        return

    release = "--release" in sys.argv
    waive = "--waive" in sys.argv
    vo = arg("--vo", SCRATCH_VO)
    keep_picture = "--keep-picture" in sys.argv

    if release and not waive:
        report_gates()
        sys.exit("\nrefusing --release: pass --waive only when every gate above is "
                 "signed off by the Trust, and record who signed it.")

    if vo == SCRATCH_VO and release:
        sys.exit("refusing --release with the scratch narration. Supply the human "
                 "read with --vo path/to/narration.wav.")

    if not os.path.exists(vo):
        sys.exit(f"narration not found: {vo}\n"
                 f"run vo.py for the scratch track, or pass --vo with the human WAV.")

    for need, how in [("gfx@2x", "python3 gfx.py ../05-kannada-subtitles.srt --scale 2"),
                      ("subs.json", "python3 gfx.py ../05-kannada-subtitles.srt"),
                      ("timeline.json", "python3 build_timeline.py timeline.json")]:
        if not os.path.exists(need):
            sys.exit(f"missing {need}\n  build it with: {how}")

    scratch = (vo == SCRATCH_VO)
    stem = "kannada-2160p" + ("-review-scratch-vo" if scratch else
                              ("-youtube-master" if release else "-review"))
    picture = "picture-2160p.mp4"
    out = os.path.join(PACK, f"{stem}.mp4")

    # 1. picture. Subtitles are never burned into a 4K master: YouTube takes
    #    05-kannada-subtitles.srt as a caption track, which stays toggleable,
    #    searchable and machine-translatable, and costs no pixels.
    print("\n1/2  picture, 3840x2160, no burned-in subtitles")
    if keep_picture and os.path.exists(picture):
        print(f"  reusing {picture}")
    else:
        run([sys.executable, "film.py", picture, "--scale", "2", "--no-subs"])

    # 2. mux and encode to YouTube's recommended shape.
    #    -14 LUFS is YouTube's own normalisation target, so mastering to it means
    #    YouTube leaves the level alone. The animatic used -16 for hall playback.
    print("\n2/2  mux narration and encode")
    run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
         "-i", picture, "-i", vo,
         "-map", "0:v", "-map", "1:a",
         "-c:v", "copy",
         "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
         "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-ac", "2",
         "-shortest", "-movflags", "+faststart",
         "-metadata", f"title=Law Park Educational Trust, ten years, Kannada"
                      f"{'' if release else ' (REVIEW COPY, NOT FOR RELEASE)'}",
         out])

    size = os.path.getsize(out) / 1e6
    print(f"\nwrote {out}  ({size:.0f} MB)")

    if scratch:
        print("\n  This carries the SCRATCH narration. Internal review only.")
        print("  Do not upload it. Re-run with --vo once the human read lands.")
    if not release:
        print("\n  Not a release master. Run --check to see the open gates.")
    print("\n  Upload the captions separately: 05-kannada-subtitles.srt")


if __name__ == "__main__":
    main()
