#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Reports how hard every shot's photography is being enlarged, and how much of
each frame is actually photograph.

  python3 frame_audit.py             at 1920x1080
  python3 frame_audit.py --scale 2   at 3840x2160

WHY BOTH NUMBERS
The pack used to trade one against the other without saying so. A card shot
never enlarged its photograph, which read as careful, and left up to 79.5
percent of the frame as flat colour. A full-bleed shot fills the frame and pays
for it in enlargement. Neither number alone tells you whether a shot is right.

`push` counts. A shot that ends at 1.42x zoom is enlarging its source by 1.42x
MORE than its start frame does, and the worst frame is the one to judge.

Rough reading of the enlargement column, on a 1080p master:
  under 1.5x   no visible cost
  1.5 to 2.2x  soft on inspection, fine at playback
  over 2.5x    visibly soft; a collage tile of the same source would be sharper
"""
import json, os, sys
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import film


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    tl = json.load(open("timeline.json", encoding="utf-8"))
    W, H = film.W, film.H
    rows = []
    for sh in tl:
        sid, g = sh["sid"], film.G[sh["sid"]]
        mode = g["mode"]
        if mode == "gfx":
            continue
        z = max(g.get("push", (1.0, 1.0)))
        if mode == "collage":
            cols = g.get("cols", len(g["tiles"]))
            rowsn = (len(g["tiles"]) + cols - 1) // cols
            cw, ch = W / cols, H / rowsn
            worst, which = 0.0, ""
            for t in g["tiles"]:
                im = film.cover(film.src(t[0]), t[1], aspect=cw / ch)
                s = cw / im.size[0] * z
                if s > worst:
                    worst, which = s, os.path.basename(t[0])[:34]
            rows.append((sid, mode, worst, 100.0, which))
        elif mode == "panel":
            pw = film.o(g.get("panel_w", 760))
            im = film.cover(film.src(sh["path"]), g.get("box"),
                            aspect=(W - pw) / H)
            rows.append((sid, mode, (W - pw) / im.size[0] * z, 100.0,
                         os.path.basename(sh["path"])[:34]))
        elif mode == "card":
            im = film.src(sh["path"])
            if g.get("box"):
                im = im.crop(g["box"])
            kind, px = g["fit"]
            s = film.o(px) / (im.size[0] if kind == "w" else im.size[1])
            pw, ph = im.size[0] * s * z, im.size[1] * s * z
            rows.append((sid, mode, s * z, pw * ph / (W * H) * 100,
                         os.path.basename(sh["path"])[:34]))
        elif mode == "chain":
            worst, which = 0.0, ""
            for p, box in g["parts"]:
                im = film.cover(film.src(p), box)
                if W / im.size[0] * z > worst:
                    worst, which = W / im.size[0] * z, os.path.basename(p)[:34]
            rows.append((sid, mode, worst, 100.0, which))
        else:
            im = film.cover(film.src(sh["path"]), g.get("box"))
            rows.append((sid, mode, W / im.size[0] * z, 100.0,
                         os.path.basename(sh["path"])[:34]))

    print(f"{len(rows)} photographic shots at {W}x{H}\n")
    print(f"{'shot':6}{'mode':9}{'worst enlarge':>14}{'frame used':>12}  source")
    for sid, mode, s, fill, f in sorted(rows, key=lambda r: -r[2]):
        flag = "  <-- over 2.5x" if s > 2.5 else ("  <-- soft" if s > 2.2 else "")
        print(f"{sid:6}{mode:9}{s:13.2f}x{fill:11.0f}%  {f}{flag}")
    hard = [r for r in rows if r[2] > 2.5]
    empty = [r for r in rows if r[3] < 95]
    print(f"\n{len(hard)} shots over 2.5x, {len(empty)} not filling the frame")


if __name__ == "__main__":
    main()
