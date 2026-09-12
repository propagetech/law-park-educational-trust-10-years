#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Writes the clean photographic plates for a Runway image-to-video pass.

  cd video/production/kannada/tools
  python3 runway_plates.py              1920x1080 into runway-plates/
  python3 runway_plates.py --scale 2    3840x2160 into runway-plates@2x/

WHY THIS EXISTS AND NOT `film.py --stills`
`--stills` writes the composited frame: crop, push, lower third, subtitle. A
plate handed to an image-to-video model must carry none of that. The model
re-renders every pixel it is given, so a burned-in Kannada lower third comes
back as Kannada-shaped noise, and a push baked into the plate fights the move
the model is being asked to add. What is wanted is the cropped photograph and
nothing else, at rest, at frame size.

WHY ONLY THIRTEEN OF THE THIRTY-SEVEN PHOTOGRAPHIC SHOTS
Uploading a plate sends it to a third party. Every shot whose consent field in
timeline.json carries `[C]`, `BLOCKING`, or the word `children` is refused here
rather than written and labelled, because a directory of blocked plates is an
upload waiting to happen. The gate is `07` sections 2 and 3; when a release is
signed, widen ALLOW_CONSENT below and re-run. Nothing in this script decides
anything: it reads the same timeline.json and the same crop geometry the film
itself is cut from.
"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)                      # film.py reads timeline.json relative to cwd
sys.path.insert(0, HERE)

import film                          # import-safe: everything is under main()
from PIL import Image

SCALE = film.SCALE
OUT = "runway-plates" if SCALE == 1 else f"runway-plates@{SCALE}x"

# A plate may be written only if its consent string opens with one of these AND
# carries neither marker. An allow-list, not a deny-list: "ADULTS ONLY - four
# volunteers, no children" must pass and "ADULTS AND SOME CHILDREN" must not,
# and no keyword scan gets that pair right.
ALLOW_CONSENT = ("CLEAR", "ADULTS ONLY", "TRUSTEE LIKENESS")
DENY = re.compile(r"\[C\]|BLOCKING", re.I)


def cleared(sh):
    c = sh.get("consent", "")
    return c.startswith(ALLOW_CONSENT) and not DENY.search(c)


def plate(path, box):
    """The cropped 16:9 photograph at frame size, at rest, nothing composited."""
    im = film.cover(film.src(path), box)
    return im.resize((film.W, film.H), Image.LANCZOS)


def main():
    os.makedirs(OUT, exist_ok=True)
    written, refused = [], []
    for sh in film.TL:
        sid = sh["sid"]
        g = film.G[sid]
        mode = g["mode"]
        if mode == "gfx":
            continue                 # a card is already a render; gfx/ has it
        if not cleared(sh):
            refused.append(sid)
            continue
        if mode == "collage":
            for i, tile in enumerate(g["tiles"], 1):
                name = f"{sid}_t{i}"
                plate(tile[0], tile[1]).save(f"{OUT}/{name}.png")
                written.append(name)
        elif mode == "chain":
            for i, part in enumerate(g["parts"], 1):
                name = f"{sid}_p{i}"
                plate(part[0], part[1]).save(f"{OUT}/{name}.png")
                written.append(name)
        else:                        # full, card, panel: one photographic source
            plate(sh["path"], g.get("box")).save(f"{OUT}/{sid}.png")
            written.append(sid)

    print(f"{len(written)} plates at {film.W}x{film.H} in {OUT}/")
    print("  " + " ".join(written))
    print(f"{len(refused)} refused, consent not cleared for upload:")
    print("  " + " ".join(refused))


if __name__ == "__main__":
    main()
