#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Composites the Kannada cut frame by frame and pipes it to ffmpeg.

  python3 film.py out.mp4                 full render, 00:05:36:01, 1920x1080
  python3 film.py out.mp4 --stills        one PNG per shot, no video
  python3 film.py out.mp4 --range 60 75   render only 60s to 75s
  python3 film.py out.mp4 --scale 2       3840x2160 master (see below)
  python3 film.py out.mp4 --no-subs       omit the burned-in Kannada subtitles
  python3 film.py out.mp4 --fallback      Part 12 consent fallback (face-free stills)

Photography is composited by PIL. All Kannada text comes from the pre-rendered
Chrome PNGs in gfx/ (see gfx.py); PIL is never asked to draw Kannada.

--fallback keeps the full narration timing and swaps every consent-blocked or
Udayavani shot for a face-free still from 07 / 14 Part 12. Timing does not move.
Use it when 07 item 1.1 is unsigned; do not use it as a waiver of the gate.

--scale N multiplies the output frame and every output-space measurement by N.
Crop boxes in G are native source-file pixels and are NOT scaled; `push` values
are ratios and are not scaled either. At --scale 2 the graphics are read from
gfx@2x/, which gfx.py must have rendered first at device_scale_factor=2, so all
Kannada type is natively crisp rather than upscaled. The photography cannot be:
no source photograph in this library reaches 3840px, so at scale 2 the stills
are Lanczos-enlarged. See 08-kannada-animatic-notes.md section 9.

--no-subs is the right choice for a YouTube master: upload
05-kannada-subtitles.srt as a caption track instead of burning pixels in, so the
captions stay toggleable, searchable and translatable.
"""
import json, os, subprocess, sys
from PIL import Image

REPO = "/Users/chetan/Downloads/jeevitha/law-park-educational-trust-10-years"

def _arg(flag, cast, default):
    if flag in sys.argv:
        return cast(sys.argv[sys.argv.index(flag) + 1])
    return default

SCALE = _arg("--scale", int, 1)
if SCALE < 1:
    sys.exit("--scale must be 1 or more")
BURN_SUBS = "--no-subs" not in sys.argv
FALLBACK = "--fallback" in sys.argv
GFXDIR = "gfx" if SCALE == 1 else f"gfx@{SCALE}x"

# Face-free stills named in 07 Part 12 / 14 Part 12. Portrait sources use the
# whole frame and cover() centre-crops to 16:9. Snack packets are cropped past
# the commercial mark that got neighbouring assets rejected.
FALLBACK_POOL = [
    ("assets/images/timeline/2024-car-trunk-filled-with-school-bags.jpg", None),
    ("assets/images/timeline/2024-car-trunk-filled-with-books-and-supplies.jpg", None),
    ("assets/images/timeline/2022-library-bookshelves.jpg", None),
    ("assets/images/timeline/2022-library-donation-poster.jpg", (0, 0, 1406, 900)),
    ("assets/images/timeline/2024-school-supply-kit-on-floor.jpg", None),
    ("assets/images/timeline/2025-stationery-and-snacks-arranged.jpg", None),
    ("assets/images/timeline/2024-snack-packets-for-distribution.jpg", (0, 0, 720, 720)),
    ("assets/images/timeline/2025-saraswati-primary-school-sign.jpg", (0, 90, 1215, 774)),
    ("assets/images/timeline/2025-government-primary-school-sign.jpg", (0, 0, 1215, 684)),
    ("assets/images/awards/framed-bharat-shiksha-ratan-award-certificate.jpg", None),
    ("assets/images/timeline/2020-pandemic-relief-announcement-poster.jpg", None),
]


def _needs_fallback(sh):
    c = (sh.get("consent") or "").upper()
    if "BLOCKING" in c or "[C]" in c or "COPYRIGHT" in c:
        return True
    if "SOME CHILDREN" in c:
        return True
    return False


def apply_fallback():
    """Replace blocked photography in place. Duration and narration stay put."""
    dropped = []
    i = 0
    for sh in TL:
        if not _needs_fallback(sh):
            continue
        path, box = FALLBACK_POOL[i % len(FALLBACK_POOL)]
        i += 1
        dropped.append((sh["sid"], sh.get("path", ""), path))
        sh["path"] = path
        G[sh["sid"]] = dict(mode="full", box=box, push=(1.0, 1.02),
                            _dur=sh["dur"])
        OV.pop(sh["sid"], None)
    print("FALLBACK: replaced %d blocked shots; duration unchanged at %.2fs"
          % (len(dropped), TL[-1]["t_out"]))
    for sid, old, new in dropped:
        print("  %s  dropped %s" % (sid, os.path.basename(old) or "(none)"))
        print("       -> %s" % os.path.basename(new))
    return dropped

def o(px):
    """Scale an output-space measurement. Source-space crops never use this."""
    return int(round(px * SCALE))

W, H, FPS = o(1920), o(1080), 25
NAVY, CREAM, BLACK = (28, 28, 46), (250, 248, 243), (0, 0, 0)

TL = json.load(open("timeline.json", encoding="utf-8"))
SUBS = json.load(open("subs.json", encoding="utf-8"))

# ---------------------------------------------------------------- geometry
# mode: full  = crop box fills the frame (cover)
#       card  = photo placed on a ground, native or fitted, no enlargement
#       gfx   = graphics only
#       chain = several photographs with internal dissolves
#       panel = photo right, Kannada gloss panel left
# box:  crop window on the native file, None = whole file
# push: (z_start, z_end); wait = seconds held before the move starts
G = {
 "K01": dict(mode="full", box=(0, 0, 1215, 684),      push=(1.0, 1.03), wait=3.0),
 "K02": dict(mode="full", box=None,                    push=(1.0, 1.03)),
 "K03": dict(mode="full", box=(0, 430, 1446, 1243),   push=(1.0, 1.0)),
 "K04": dict(mode="full", box=(0, 0, 1215, 684),      push=(1.0, 1.0)),
 "K05": dict(mode="gfx", states=[("K05_0", 0.0), ("K05_1", 0.6), ("K05_2", 1.6)]),
 "K06": dict(mode="gfx", states=[("K06", 0.0)], fade_in=0.8),
 "K07": dict(mode="gfx", states=[("K07", 0.0)]),
 "K08": dict(mode="card", ground=NAVY, fit=("w", 1280), push=(1.0, 1.02),
             box=(40, 0, 1280, 853)),
 "K09": dict(mode="card", ground=NAVY, fit=("w", 853),  push=(1.0, 1.0)),
 "K10": dict(mode="full", box=(0, 90, 1215, 774),     push=(1.0, 1.0)),
 "K11": dict(mode="card", ground=CREAM, fit=("h", 900), align="left", push=(1.0, 1.0)),
 "K12": dict(mode="gfx", states=[("K12_0", 0.0), ("K12_1", 1.2)]),
 "K13": dict(mode="full", box=None,                    push=(1.0, 1.04)),
 "K14": dict(mode="full", box=(0, 150, 1600, 1050),   push=(1.0, 1.0)),
 "K15": dict(mode="chain", parts=[
                ("assets/images/timeline/2018-classroom-presentation-session.jpg",
                 (0, 170, 1600, 1070)),
                ("assets/images/timeline/2019-community-group-photo-outdoors.jpg", None)],
             push=(1.0, 1.02), xfade=0.64),
 "K16": dict(mode="full", box=(0, 200, 1600, 1100),   push=(1.0, 1.0)),
 "K17": dict(mode="panel", fit=("h", 900), push=(1.0, 1.0),
             states=[("GLOSS_K17_0", 0.0), ("GLOSS_K17_1", 2.6), ("GLOSS_K17_2", 5.4)]),
 "K18": dict(mode="full", box=None,                    push=(1.0, 1.04)),
 "K19": dict(mode="full", box=None,                    push=(1.0, 1.0)),
 "K20": dict(mode="full", box=(0, 180, 1600, 1080),   push=(1.0, 1.0)),
 "K21": dict(mode="full", box=(0, 120, 1280, 840),    push=(1.0, 1.03)),
 "K22": dict(mode="full", box=(0, 620, 1446, 1433),   push=(1.0, 1.03), wait=2.0),
 "K23": dict(mode="full", box=(0, 180, 1920, 1260),   push=(1.0, 1.03), wait=2.9),
 "K24": dict(mode="full", box=(0, 200, 1600, 1100),   push=(1.0, 1.0)),
 "K25": dict(mode="full", box=(60, 180, 960, 686),    push=(1.0, 1.0)),
 "K26": dict(mode="full", box=(200, 560, 1080, 1055), push=(1.0, 1.0)),
 "K27": dict(mode="gfx", states=[("K27", 0.0)]),
 "K28": dict(mode="full", box=None,                    push=(1.0, 1.0)),
 "K29": dict(mode="gfx", states=[("K29", 0.0)]),
 "K30": dict(mode="full", box=None,                    push=(1.0, 1.0)),
 "K31": dict(mode="card", ground=CREAM, fit=("h", 820), align="left", push=(1.0, 1.0)),
 "K32": dict(mode="card", ground=CREAM, fit=("h", 880), align="left", push=(1.0, 1.0)),
 "K33": dict(mode="full", box=(0, 150, 1600, 1050),   push=(1.0, 1.0)),
 "K34": dict(mode="gfx", states=[("K34", 0.0)]),
 "K35": dict(mode="gfx", states=[("K35_0", 0.0), ("K35_1", 0.9), ("K35_2", 1.8),
                                  ("K35_3", 2.7), ("K35_4", 3.6)]),
 "K36": dict(mode="card", ground=NAVY, box=(0, 0, 513, 662), fit=("h", 660),
             push=(1.0, 1.42)),
 "K37": dict(mode="card", ground=NAVY, box=(700, 40, 1370, 872), fit=("h", 840),
             align="right", push=(1.0, 1.0)),
 "K38": dict(mode="card", ground=CREAM, fit=("w", 941), push=(1.0, 1.0)),
 "K39": dict(mode="full", box=(0, 150, 1600, 1050),   push=(1.0, 1.0)),
 "K40": dict(mode="full", box=(0, 190, 1600, 1090),   push=(1.0, 1.0)),
 "K41": dict(mode="full", box=None,                    push=(1.0, 1.03)),
 "K42": dict(mode="full", box=(0, 200, 1920, 1280),   push=(1.0, 1.03), wait=2.0),
 "K43": dict(mode="full", box=None,                    push=(1.04, 1.0)),
 "K44": dict(mode="full", box=(0, 180, 1920, 1260),   push=(1.0, 1.03), wait=2.0),
 "K45": dict(mode="full", box=(0, 180, 1920, 1260),   push=(1.03, 1.06)),
 "K46": dict(mode="gfx", states=[("K46_0", 0.0), ("K46_1", 0.9), ("K46_2", 1.9),
                                  ("K46_3", 3.0)]),
}

# ---------------------------------------------------------------- overlays
# t_in / t_out are seconds from the shot's own start. t_out None = shot end.
OV = {
 "K08": [dict(g="LT_K08", t_in=1.0, t_out=6.0, fade=0.5)],
 "K09": [dict(g="LT_K09", t_in=1.0, t_out=6.0, fade=0.5)],
 "K11": [dict(g="YR_K11", t_in=0.4, fade=0.4)],
 "K13": [dict(g="LT_K13", t_in=1.4, fade=0.4)],
 "K14": [dict(g="YR_K14", t_in=0.3, fade=0.4)],
 "K15": [dict(g="LT_K15", t_in=0.6, t_out=5.0, fade=0.5)],
 "K18": [dict(g="YR_K18", t_in=0.3, fade=0.4)],
 "K20": [dict(g="YR_K20", t_in=0.3, fade=0.4)],
 "K21": [dict(g="LT_K21", t_in=1.0, fade=0.4)],
 "K22": [dict(g="YR_K22", t_in=0.5, fade=0.4)],
 "K23": [dict(g="YR_K23", t_in=0.4, fade=0.4)],
 "K26": [dict(g="STEP_K26_1", t_in=1.6, t_out=3.1, fade=0.3),
         dict(g="STEP_K26_2", t_in=3.1, t_out=4.6, fade=0.0),
         dict(g="STEP_K26_3", t_in=4.6, t_out=6.1, fade=0.0),
         dict(g="STEP_K26_4", t_in=6.1, fade=0.0)],
 "K31": [dict(g="RP_K31_1", t_in=0.5, t_out=2.6, fade=0.4),
         dict(g="RP_K31_2", t_in=2.6, t_out=4.6, fade=0.0),
         dict(g="RP_K31_3", t_in=4.6, fade=0.0)],
 "K32": [dict(g="RP_K32_1", t_in=0.4, t_out=3.0, fade=0.4),
         dict(g="RP_K32_2", t_in=3.0, t_out=5.4, fade=0.0),
         dict(g="RP_K32_3", t_in=5.4, fade=0.0)],
 "K33": [dict(g="LT_K33", t_in=0.3, fade=0.3)],
 "K36": [dict(g="LT_K36", t_in=0.8, fade=0.4)],
 "K37": [dict(g="LT_K37", t_in=0.5, fade=0.4)],
 "K38": [dict(g="LT_K38", t_in=2.4, fade=0.5)],
 "K39": [dict(g="LT_K39", t_in=0.6, fade=0.4)],
 "K40": [dict(g="LT_K40", t_in=0.3, fade=0.4)],
}

# ---------------------------------------------------------------- loading
_src, _gfx = {}, {}

def src(path):
    if path not in _src:
        im = Image.open(os.path.join(REPO, path))
        _src[path] = im.convert("RGB")
    return _src[path]

def gfx(name):
    if name not in _gfx:
        _gfx[name] = Image.open(f"{GFXDIR}/{name}.png").convert("RGBA")
    return _gfx[name]

def cover(im, box, aspect=W / H):
    """Crop to `box`, then centre-crop that to the target aspect."""
    if box:
        im = im.crop(box)
    w, h = im.size
    if w / h > aspect:
        nw = int(round(h * aspect)); x = (w - nw) // 2
        im = im.crop((x, 0, x + nw, h))
    else:
        nh = int(round(w / aspect)); y = (h - nh) // 2
        im = im.crop((0, y, w, y + nh))
    return im

def zoomed(im, z):
    """Centre-crop `im` by 1/z and resize to the full frame."""
    w, h = im.size
    vw, vh = int(round(w / z)), int(round(h / z))
    x, y = (w - vw) // 2, (h - vh) // 2
    return im.crop((x, y, x + vw, y + vh)).resize((W, H), Image.LANCZOS)

def ease(u):
    return u * u * (3 - 2 * u)          # smoothstep, matches a 400ms ease-out feel

def zoom_at(g, u):
    z0, z1 = g.get("push", (1.0, 1.0))
    wait = g.get("wait", 0.0)
    dur = g["_dur"]
    if wait > 0 and dur > wait:
        u = 0.0 if u * dur < wait else (u * dur - wait) / (dur - wait)
    return z0 + (z1 - z0) * ease(max(0.0, min(1.0, u)))

# pre-built 16:9 plates, so each frame is one crop plus one resize
_plate = {}

def plate(sh):
    sid = sh["sid"]
    if sid in _plate:
        return _plate[sid]
    g = G[sid]
    if g["mode"] == "chain":
        v = [cover(src(p), b) for p, b in g["parts"]]
    else:
        v = cover(src(sh["path"]), g.get("box"))
    _plate[sid] = v
    return v

_cardplate = {}

def card_frame(sh, u):
    """Photo placed on a ground at native or fitted size. No enlargement."""
    sid = sh["sid"]
    g = G[sid]
    if sid not in _cardplate:
        im = src(sh["path"])
        if g.get("box"):
            im = im.crop(g["box"])
        kind, px = g["fit"]
        px = o(px)                      # fit is measured in output pixels
        w, h = im.size
        s = px / w if kind == "w" else px / h
        im = im.resize((max(1, int(round(w * s))), max(1, int(round(h * s)))), Image.LANCZOS)
        _cardplate[sid] = im
    ph = _cardplate[sid]
    z = zoom_at(g, u)
    if abs(z - 1.0) > 1e-3:
        pw, phh = ph.size
        ph = ph.resize((int(round(pw * z)), int(round(phh * z))), Image.LANCZOS)
    base = Image.new("RGB", (W, H), g.get("ground", NAVY))
    pw, phh = ph.size
    align = g.get("align", "center")
    if align == "left":
        x = o(130)
    elif align == "right":
        x = W - o(150) - pw
    else:
        x = (W - pw) // 2
    y = (H - phh) // 2
    base.paste(ph, (x, y), None)
    return base

def gfx_state(g, t):
    name = g["states"][0][0]
    for n, at in g["states"]:
        if t + 1e-9 >= at:
            name = n
    return name

def clean(sh, t):
    """The shot's picture at t seconds from its own start, before overlays."""
    sid, g = sh["sid"], G[sh["sid"]]
    dur = g["_dur"]
    u = 0.0 if dur <= 0 else t / dur
    if g["mode"] == "gfx":
        im = gfx(gfx_state(g, t))
        base = Image.new("RGB", (W, H), BLACK)
        if g.get("fade_in"):
            a = min(1.0, t / g["fade_in"])
            im = Image.blend(Image.new("RGBA", (W, H), (28, 28, 46, 255)), im, a)
        base.paste(im.convert("RGB"), (0, 0))
        return base
    if g["mode"] == "card":
        return card_frame(sh, u)
    if g["mode"] == "panel":
        base = card_frame(sh, u)
        base = Image.new("RGB", (W, H), NAVY)
        ph = _cardplate[sid]
        base.paste(ph, (W - o(150) - ph.size[0], (H - ph.size[1]) // 2))
        ov = gfx(gfx_state(g, t))
        base = Image.alpha_composite(base.convert("RGBA"), ov).convert("RGB")
        return base
    if g["mode"] == "chain":
        parts = plate(sh)
        xf = g.get("xfade", 0.6)
        seg = dur / len(parts)
        i = min(len(parts) - 1, int(t / seg))
        lt = t - i * seg
        z = zoom_at(g, u)
        cur = zoomed(parts[i], z)
        if i > 0 and lt < xf:
            prev = zoomed(parts[i - 1], z)
            cur = Image.blend(prev, cur, lt / xf)
        return cur
    return zoomed(plate(sh), zoom_at(g, u))

def with_overlays(sh, t, img):
    out = img.convert("RGBA")
    for o in OV.get(sh["sid"], []):
        t_in = o["t_in"]; t_out = o.get("t_out", G[sh["sid"]]["_dur"] + 1)
        if t < t_in or t > t_out:
            continue
        f = o.get("fade", 0.0)
        a = 1.0
        if f > 0:
            a = min(a, (t - t_in) / f)
            a = min(a, max(0.0, (t_out - t) / 0.5))
        a = max(0.0, min(1.0, a))
        if a <= 0:
            continue
        ov = gfx(o["g"])
        if a < 1.0:
            ov = ov.copy()
            ov.putalpha(ov.getchannel("A").point(lambda v: int(v * a)))
        out = Image.alpha_composite(out, ov)
    return out.convert("RGB")

# ---------------------------------------------------------------- timeline index
for sh in TL:
    G[sh["sid"]]["_dur"] = sh["dur"]

if FALLBACK:
    apply_fallback()

def trans_frames(sh):
    s = (sh.get("trans") or "").lower()
    if "no cut" in s:
        return 0, None
    n = 0
    for tok in s.replace(",", " ").split():
        if tok.endswith("f") and tok[:-1].isdigit():
            n = int(tok[:-1])
    if "fade from black" in s:
        return n, "black"
    if "dissolve" in s:
        return n, "prev"
    return 0, None

def frame(fi):
    t = fi / FPS
    i = 0
    for k, sh in enumerate(TL):
        if sh["t_in"] - 1e-9 <= t < sh["t_out"] - 1e-9:
            i = k; break
    else:
        i = len(TL) - 1
    sh = TL[i]
    lt = t - sh["t_in"]
    img = with_overlays(sh, lt, clean(sh, lt))
    nf, kind = trans_frames(sh)
    if nf and lt * FPS < nf:
        a = (lt * FPS) / nf
        if kind == "black":
            img = Image.blend(Image.new("RGB", (W, H), BLACK), img, a)
        elif kind == "prev" and i > 0:
            p = TL[i - 1]
            pd = G[p["sid"]]["_dur"]
            if G[p["sid"]]["mode"] == "gfx" and G[sh["sid"]]["mode"] == "gfx":
                # Card to card: dip through the shared ground. Cross-dissolving two
                # typographic cards overlays two blocks of Kannada and reads as mush.
                ground = Image.new("RGB", (W, H), NAVY)
                if a < 0.5:
                    under = with_overlays(p, pd, clean(p, pd))
                    img = Image.blend(under, ground, a * 2)
                else:
                    img = Image.blend(ground, img, (a - 0.5) * 2)
            else:
                under = with_overlays(p, pd + lt, clean(p, min(pd, pd + lt)))
                img = Image.blend(under, img, a)
    # burned-in Kannada subtitle, preview only. A YouTube master uses --no-subs
    # and carries 05-kannada-subtitles.srt as a real caption track instead.
    if BURN_SUBS:
        for j, c in enumerate(SUBS):
            if c["start"] <= t < c["end"]:
                img = Image.alpha_composite(img.convert("RGBA"),
                                            gfx(f"SUB_{j:03d}")).convert("RGB")
                break
    return img

# ---------------------------------------------------------------- drive
def _positional(argv, valued=("--scale", "--range")):
    """argv minus flags and their values. --range takes two values."""
    out, skip = [], 0
    for a in argv:
        if skip:
            skip -= 1
            continue
        if a in valued:
            skip = 2 if a == "--range" else 1
            continue
        if a.startswith("--"):
            continue
        out.append(a)
    return out

def main():
    pos = _positional(sys.argv[1:])
    if not pos:
        sys.exit("usage: film.py OUT.mp4 [--scale N] [--no-subs] "
                 "[--fallback] [--stills] [--range A B]")
    out = pos[0]
    total = int(round(TL[-1]["t_out"] * FPS))
    if "--stills" in sys.argv:
        sd = "stills" if SCALE == 1 else f"stills@{SCALE}x"
        os.makedirs(sd, exist_ok=True)
        for sh in TL:
            t = sh["dur"] * 0.55
            frame(int(round((sh["t_in"] + t) * FPS))).save(f"{sd}/{sh['sid']}.png")
        print(f"stills written: {len(TL)} at {W}x{H} in {sd}/")
        return
    a, b = 0, total
    if "--range" in sys.argv:
        k = sys.argv.index("--range")
        a = int(float(sys.argv[k + 1]) * FPS); b = int(float(sys.argv[k + 2]) * FPS)
    crf = "18" if SCALE == 1 else "15"      # master carries headroom for YouTube
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
           "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-", "-an",
          "-c:v", "libx264", "-preset", "slow", "-crf", crf,
          "-profile:v", "high", "-level", "5.1",
          "-pix_fmt", "yuv420p", "-movflags", "+faststart",
          "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
          "-color_range", "tv",
          "-x264-params", "colorprim=bt709:transfer=bt709:colormatrix=bt709",
          out]
    print(f"render {W}x{H} @ {FPS}fps, gfx from {GFXDIR}/, "
          f"subs {'burned in' if BURN_SUBS else 'omitted'}, crf {crf}")
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for fi in range(a, b):
        p.stdin.write(frame(fi).tobytes())
        if (fi - a) % 250 == 0:
            print(f"  {fi - a}/{b - a}  {fi / FPS:6.1f}s", flush=True)
    p.stdin.close()
    if p.wait() != 0:
        sys.exit("ffmpeg failed")
    print("wrote", out)

if __name__ == "__main__":
    main()
