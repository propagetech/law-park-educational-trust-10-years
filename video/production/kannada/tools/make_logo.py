#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Recovers a 976x833 transparent logo from the repository's purple lockup.

  python3 make_logo.py            writes tools/logo-hires.png

WHY THIS EXISTS
The repository ships logo.png at 300x257 with an alpha channel, and
logo-purple.png at 976x833 with a flat purple ground and no alpha. gfx.py draws
the mark at 238 CSS pixels, which at --scale 2 is 476 device pixels, so the
300px file was the one element in a 4K master being enlarged while every Kannada
glyph beside it was drawn natively by Chrome at the target resolution.

The two files are the same artwork. Composite logo.png over the purple ground
and it matches logo-purple.png to a mean of 3.8 out of 255, which is JPEG-class
noise, not a different drawing. So the resolution is already in the repository;
it is just behind a purple rectangle.

HOW THE KEY WORKS
Each pixel of the purple file is fg*a + bg*(1-a) for an unknown fg and a. One
equation, two unknowns, so something has to supply one of them. The foreground
COLOUR does: this mark is flat regions of four colours, so logo.png upscaled is
a perfectly good reference for what colour a pixel is, even though it is a poor
reference for where the edge falls. Alpha is then the pixel's distance from the
purple ground as a fraction of that reference colour's distance, and it is
computed from the 976px pixels, which is where the sharpness comes from. The
colour is unmixed back out afterwards so no purple fringe survives on the edges.
"""
import os, sys
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
OUT = os.path.join(HERE, "logo-hires.png")


def main():
    lo = Image.open(os.path.join(REPO, "logo.png")).convert("RGBA")
    pu = Image.open(os.path.join(REPO, "logo-purple.png")).convert("RGB")
    W, H = pu.size
    n = np.asarray(pu).astype(float)

    # The ground, read off the four corners rather than hard-coded.
    c = np.concatenate([n[:20, :20].reshape(-1, 3), n[:20, -20:].reshape(-1, 3),
                        n[-20:, :20].reshape(-1, 3), n[-20:, -20:].reshape(-1, 3)])
    bg = c.mean(0)

    ref = np.asarray(lo.resize((W, H), Image.LANCZOS)).astype(float)
    fg_ref, a_ref = ref[..., :3], ref[..., 3] / 255.0
    fg_ref = np.where(a_ref[..., None] > 0.15, fg_ref, bg)

    den = np.linalg.norm(fg_ref - bg, axis=-1)
    num = np.linalg.norm(n - bg, axis=-1)
    # den <= 8 means the reference colour is itself indistinguishable from the
    # ground, so there is nothing to key and the pixel is transparent.
    a = np.clip(np.where(den > 8, num / np.maximum(den, 1e-6), 0.0), 0, 1)

    a3 = np.maximum(a, 1e-3)[..., None]
    fg = np.clip((n - bg * (1 - a3)) / a3, 0, 255)
    fg = np.where(a[..., None] > 0.02, fg, fg_ref)

    Image.fromarray(np.dstack([fg, a * 255]).astype(np.uint8), "RGBA").save(OUT)
    print(f"wrote {OUT}  {W}x{H}, ground {bg.round(1)}, "
          f"{(a > 0.5).mean() * 100:.1f}% opaque")
    print(f"  logo.png is {lo.size[0]}x{lo.size[1]}, so this is "
          f"{W / lo.size[0]:.2f}x the linear resolution")


if __name__ == "__main__":
    main()
