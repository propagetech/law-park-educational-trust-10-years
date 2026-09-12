#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Measures the contrast of every piece of Kannada in the cut, on the real frames.

  python3 wcag_audit.py                  audit stills/ against gfx/
  python3 wcag_audit.py --scale 2        audit stills@2x/ against gfx@2x/

WHY THIS IS MEASURED AND NOT REASONED ABOUT
A palette can be checked on paper: NAVY on CREAM is 15.77:1, GOLD on NAVY is
6.01:1, and every pair this film uses passes AA that way. That check missed two
real failures, both of which came from a colour meeting something the palette
does not describe.

  The K31 and K32 programme labels were navy Kannada with nothing behind them.
  On a flat cream card that was 15.77:1. When those shots became full-bleed
  photography the same type was sitting on a photograph, and on the pale
  stationery plate it was close to invisible. Nothing about the palette changed.

  The logo is not one colour. 45.1 percent of its opaque pixels are #301010 and
  19.0 percent are #201010, which against NAVY are 1.04:1 and 1.10:1. Three
  quarters of the mark was invisible on the title card while the two colours
  anyone would have thought to check, white and gold, passed easily.

So this reads the rendered frames. For every text pixel it finds the background
the text is actually sitting on, in that frame, and reports the ratio.

`14` item 8.6 asks for WCAG 2.1 AA. Everything here is large text by the WCAG
definition, 24px and up at 1080p, so the threshold is 3.0:1; 4.5:1 is reported
too because most of this film clears it and anything that does not is worth a
look.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter

SCALE = int(sys.argv[sys.argv.index("--scale") + 1]) if "--scale" in sys.argv else 1
STILLS = "stills" if SCALE == 1 else f"stills@{SCALE}x"
GFXDIR = "gfx" if SCALE == 1 else f"gfx@{SCALE}x"

# The ink colours gfx.py sets. A pixel close to one of these, and opaque, is type.
INKS = {"white": (255, 255, 255), "gold": (201, 144, 62),
        "gold-light": (224, 176, 106), "navy": (28, 28, 46),
        "cream": (250, 248, 243)}
AA_LARGE, AA_NORMAL = 3.0, 4.5


def lum(c):
    c = np.asarray(c, dtype=float) / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


def cr(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = np.maximum(la, lb), np.minimum(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def classify(mask, scale=1):
    """type, rule or fill.

    Only one of the three has to pass a contrast threshold. WCAG 1.4.3 is about
    text; a scrim IS the background and cannot be measured against itself, and a
    3px gold divider is decoration, exempt under 1.4.1 and outside 1.4.11 since
    it carries no information the type does not.

    A colour match alone cannot tell them apart, which is why the first version
    of this reported the K15 lower-third scrim as navy type at 1.96:1 and the
    cream card grounds as cream type at 15.77:1. Shape can: type is thin and
    scattered and fills little of its own bounding box, a rule is a handful of
    rows at nearly 100 percent fill, and a scrim is a large solid block.
    """
    ys, xs = np.nonzero(mask)
    if len(ys) == 0:
        return "fill"
    h = ys.max() - ys.min() + 1
    w = xs.max() - xs.min() + 1
    fill = len(ys) / float(h * w)
    if h <= 10 * scale and fill > 0.75:
        return "rule"
    # Fill ratio alone separates a scrim from type, and by a wide margin: the
    # subtitle plates measure 0.86 to 0.90 of their own bounding box and the
    # Kannada inside them 0.15 to 0.19. An area threshold does not: SUB_042's
    # plate is 320x114, which slipped under a 40000px cut-off and was reported
    # as navy type at 1.28:1 against the navy card behind it, while the white
    # Kannada actually sitting on it measured 16.7:1 and was correct.
    if fill > 0.50 and h > 12 * scale:
        return "fill"
    return "type"


def audit_overlay(still, ov_path, tol=26, ring=9, scale=1):
    """Contrast of each ink in one overlay, against what it really sits on."""
    ov = np.asarray(Image.open(ov_path).convert("RGBA")).astype(float)
    rgb, a = ov[..., :3], ov[..., 3]
    out = []
    for name, ink in INKS.items():
        text = (a > 200) & (np.linalg.norm(rgb - np.array(ink), axis=-1) < tol)
        if text.sum() < 400:            # too few pixels to be type
            continue
        kind = classify(text, scale)
        if kind != "type":
            continue
        # The background is the ring immediately around the glyphs, taken from
        # the FINAL frame, so a scrim counts and a photograph counts, whichever
        # is really there.
        m = Image.fromarray((text * 255).astype(np.uint8))
        grown = np.asarray(m.filter(ImageFilter.MaxFilter(ring))) > 127
        halo = grown & ~text
        if halo.sum() < 200:
            continue
        bg = np.median(still[halo], axis=0)
        out.append((name, ink, bg, float(cr(np.array(ink, float), bg)),
                    int(text.sum())))
    return out


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    tl = json.load(open("timeline.json", encoding="utf-8"))
    import film                                   # for G and OV, one source of truth
    rows, worst = [], []
    # Each overlay is composited at FULL alpha over its own shot's picture, and
    # not read off stills/, which film.py renders at 0.55 of each shot. For a
    # lower third that enters at 1.0s and leaves at 6.0s of a 10.16s shot, 0.55
    # lands at 5.59s, in the middle of the exit fade: K08's second line measured
    # 4.26:1 there and is 6.6:1 while it is actually up. Auditing a fade tells
    # you about the fade.
    for sh in tl:
        sid = sh["sid"]
        names = [n for n, _ in film.G[sid].get("states", [])]
        names += [o["g"] for o in film.OV.get(sid, [])]
        for n in names:
            gp = f"{GFXDIR}/{n}.png"
            if not os.path.exists(gp):
                continue
            base = film.clean(sh, sh["dur"] * 0.55).convert("RGBA")
            ov = Image.open(gp).convert("RGBA")
            still = np.asarray(
                Image.alpha_composite(base, ov).convert("RGB")).astype(float)
            for ink, col, bg, ratio, px in audit_overlay(still, gp, scale=SCALE):
                rows.append((sid, n, ink, ratio, px, bg))
                if ratio < AA_NORMAL:
                    worst.append((sid, n, ink, ratio, bg))

    # The burned-in subtitles, which are not in G or OV: film.py composites them
    # against whatever shot happens to be under them at that second. They are the
    # only Kannada in the film whose background is not chosen for it, so they are
    # the ones most worth measuring, and K17's poster is a near-white plate.
    for j, c in enumerate(film.SUBS):
        gp = f"{GFXDIR}/SUB_{j:03d}.png"
        if not os.path.exists(gp):
            continue
        t = (c["start"] + c["end"]) / 2.0
        sh = next((x for x in tl if x["t_in"] <= t < x["t_out"]), None)
        if sh is None:
            continue
        base = film.clean(sh, t - sh["t_in"]).convert("RGBA")
        ov = Image.open(gp).convert("RGBA")
        still = np.asarray(
            Image.alpha_composite(base, ov).convert("RGB")).astype(float)
        for ink, col, bg, ratio, px in audit_overlay(still, gp, scale=SCALE):
            rows.append((sh["sid"], f"SUB_{j:03d}", ink, ratio, px, bg))

    print(f"{len(rows)} text runs measured on {STILLS}/ at "
          f"{'1920x1080' if SCALE == 1 else '3840x2160'}\n")
    print(f"{'shot':6}{'graphic':16}{'ink':12}{'ratio':>8}  {'AA':4} background")
    for sid, n, ink, ratio, px, bg in sorted(rows, key=lambda r: r[3]):
        tag = "FAIL" if ratio < AA_LARGE else ("aa" if ratio < AA_NORMAL else "AA")
        print(f"{sid:6}{n[:15]:16}{ink:12}{ratio:8.2f}  {tag:4} "
              f"#{int(bg[0]):02x}{int(bg[1]):02x}{int(bg[2]):02x}")
    fails = [r for r in rows if r[3] < AA_LARGE]
    print(f"\n{len(fails)} below AA-large 3.0:1, "
          f"{len([r for r in rows if r[3] < AA_NORMAL])} below 4.5:1")

    bad_safe = title_safe()
    bad_time = subtitle_timing()
    if fails or bad_safe or bad_time:
        sys.exit(1)


def title_safe():
    """Every glyph inside the 90 percent box, for projector overscan.

    Measured on the type, not on the plate: a full-bleed navy card reaches the
    frame edge by design and a lower-third scrim spans the full width on
    purpose, so measuring plates reports 53 false failures and hides the one
    real one. Rows that are more than half filled are dropped first, because a
    gold divider is a rule and shares the type's colour.
    """
    import glob
    mx, my = int(1920 * SCALE * 0.05), int(1080 * SCALE * 0.05)
    bad, tot = [], 0
    for p in sorted(glob.glob(f"{GFXDIR}/*.png")):
        a = np.asarray(Image.open(p).convert("RGBA")).astype(float)
        rgb, al = a[..., :3], a[..., 3]
        for name, ink in INKS.items():
            m = (al > 200) & (np.linalg.norm(rgb - np.array(ink), axis=-1) < 26)
            if m.sum() < 400 or classify(m, SCALE) != "type":
                continue
            m = m.copy()
            m[(m.sum(1) / float(m.shape[1])) > 0.5, :] = False
            if m.sum() < 300:
                continue
            tot += 1
            ys, xs = np.nonzero(m)
            W, H = a.shape[1], a.shape[0]
            if (xs.min() < mx or W - 1 - xs.max() < mx
                    or ys.min() < my or H - 1 - ys.max() < my):
                bad.append((os.path.basename(p)[:-4], name, int(xs.min()),
                            int(W - 1 - xs.max()), int(ys.min()),
                            int(H - 1 - ys.max())))
    print(f"\ntitle safe: {tot} runs of type against the 90% box "
          f"({mx}px sides, {my}px top and bottom), {len(bad)} outside")
    for n, i, l, r, t, b in bad:
        print(f"  OUTSIDE {n:16}{i:12} left {l} right {r} top {t} bottom {b}")
    return bad


def subtitle_timing():
    """Reading speed and duration, against the Netflix Kannada timed-text guide.

    17 characters per second for adults, and a floor of 5/6 of a second. Both
    are about whether a viewer can finish the line, which is the same question
    the contrast check asks and belongs in the same place.
    """
    subs = json.load(open("subs.json", encoding="utf-8"))
    MAXCPS, MINDUR = 17.0, 5 / 6.0
    bad = []
    cps = []
    for i, c in enumerate(subs):
        n = len(" ".join(c["lines"]).replace(" ", ""))
        d = c["end"] - c["start"]
        v = n / d if d > 0 else 999
        cps.append(v)
        if v > MAXCPS:
            bad.append(f"cue {i}: {v:.1f} cps, over {MAXCPS}")
        if d < MINDUR:
            bad.append(f"cue {i}: {d:.2f}s, under {MINDUR:.2f}s")
    for a, b in zip(subs, subs[1:]):
        if b["start"] < a["end"] - 1e-6:
            bad.append(f"cues overlap at {a['end']:.3f}s")
    cps.sort()
    d = sorted(c["end"] - c["start"] for c in subs)
    print(f"\nsubtitles: {len(subs)} cues, {cps[len(cps)//2]:.1f} cps median, "
          f"{cps[-1]:.1f} max (guide {MAXCPS}); shortest {d[0]:.2f}s "
          f"(floor {MINDUR:.2f}s); {len(bad)} problems")
    for b in bad[:10]:
        print(f"  {b}")
    return bad


if __name__ == "__main__":
    main()
