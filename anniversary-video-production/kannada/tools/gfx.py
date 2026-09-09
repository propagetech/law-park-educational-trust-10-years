#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Renders every Kannada graphic for the LPET Kannada cut as a PNG, using headless
Chrome so that Kannada is shaped by HarfBuzz. PIL on this machine has no Raqm,
so PIL must never be asked to draw Kannada: it would break conjuncts silently,
which is exactly the failure 14 item 7.8 warns about.

Output: gfx/<name>.png, 1920x1080, RGBA (transparent where the shot needs it).

  python3 gfx.py ../05-kannada-subtitles.srt              1920x1080 into gfx/
  python3 gfx.py ../05-kannada-subtitles.srt --scale 2    3840x2160 into gfx@2x/

--scale only raises Chrome's device_scale_factor. The CSS layout stays 1920x1080
CSS pixels, so nothing in BASE or any card needs touching, and every glyph, rule
and logo edge is rendered natively at the higher resolution rather than enlarged.
This is the one part of a 4K master that gains real detail; see film.py.
"""
import hashlib, json, os, sys
from playwright.sync_api import sync_playwright

def _arg(flag, cast, default):
    if flag in sys.argv:
        return cast(sys.argv[sys.argv.index(flag) + 1])
    return default

SCALE = _arg("--scale", int, 1)
if SCALE < 1:
    sys.exit("--scale must be 1 or more")

OUT = "gfx" if SCALE == 1 else f"gfx@{SCALE}x"
os.makedirs(OUT, exist_ok=True)

NAVY   = "#1c1c2e"
CREAM  = "#faf8f3"
GOLD   = "#c9903e"
GOLDL  = "#e0b06a"
WHITE  = "#ffffff"

# Noto Serif Kannada is not installed on this machine. Noto Sans Kannada is,
# and it is the substitution 07 section 9 itself nominates ("Fallback if a
# single family is preferred across both languages"). Flagged in the render notes.
KN  = "'Noto Sans Kannada'"
LAT = "'Playfair Display'"
SANS = "'Noto Sans','Helvetica Neue',sans-serif"

BASE = f"""
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1920px;height:1080px;overflow:hidden}}
body{{font-family:{KN};-webkit-font-smoothing:antialiased}}
.frame{{position:absolute;inset:0}}
.navy{{background:{NAVY}}}
.cream{{background:{CREAM}}}
.pad{{padding:0 150px}}                       /* inside 90% title safe */
.rule{{height:3px;background:{GOLD};width:220px}}
.kn700{{font-family:{KN};font-weight:700}}
.kn600{{font-family:{KN};font-weight:600}}
.kn500{{font-family:{KN};font-weight:500}}
.lat{{font-family:{LAT};font-weight:900}}
.stack{{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center}}
.lt{{position:absolute;left:0;right:0;bottom:250px}}
.ltbar{{background:rgba(28,28,46,.92);padding:34px 150px 38px;display:inline-block;min-width:60%}}
.ltrule{{height:3px;background:{GOLD};width:100%}}
"""

CARDS = {}

def card(name, body, extra=""):
    CARDS[name] = f"<!doctype html><meta charset='utf-8'><style>{BASE}{extra}</style>{body}"

# ---------------------------------------------------------------- K05 title
# three progressive states: rule only, rule + wordmark, full
# The logo must be inlined as a data URI: set_content() gives the page an
# about:blank origin, so a file:// <img> is blocked and renders as a broken icon.
import base64
# logo-hires.png, not the repository's logo.png.
#
# logo.png is 300x257. At --scale 2 a 268 CSS px logo is 536 device pixels, so
# the mark was the one element in a 4K master being enlarged while every glyph
# around it was drawn natively. logo-purple.png is the same artwork at 976x833
# on a flat purple ground: composited back over that ground, logo.png matches it
# to a mean of 3.8/255, which is the same file. tools/make_logo.py keys the
# purple out and leaves a 976px transparent mark, so nothing here is enlarged.
_LOGO_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                          "logo-hires.png")
if not os.path.exists(_LOGO_PATH):
    sys.exit(f"missing {_LOGO_PATH}\n  build it with: python3 make_logo.py")
LOGO = "data:image/png;base64," + base64.b64encode(open(_LOGO_PATH, "rb").read()).decode()

# THE LOGO MAY NOT SIT DIRECTLY ON NAVY
# Measured on logo.png: 45.1 percent of its opaque pixels are #301010, 19.0
# percent #201010 and 5.9 percent #202010. Against NAVY those are 1.04:1, 1.10:1
# and 1.02:1. Three quarters of the mark, including the whole trunk, both hands
# and the graduation cap, was invisible on the title card and the end card; only
# the green arcs read, at 5.49:1. The same pixels are 16.4:1 and 17.3:1 on cream.
#
# So on a dark ground the mark gets its own cream plate. That is the ordinary
# answer for a brand mark drawn for light backgrounds, it keeps the real colours
# rather than knocking the mark out to one flat tone, and it is measurable.
def logo_on_dark(width, extra=""):
    pad = round(width * 0.17)
    return (f'<div style="display:inline-block;background:{CREAM};'
            f'border-radius:{round(width * 0.035)}px;padding:{pad}px {pad}px;'
            f'line-height:0;{extra}">'
            f'<img src="{LOGO}" style="width:{width}px;height:auto;display:block"></div>')

for i, (show_mark, show_sub) in enumerate([(0, 0), (1, 0), (1, 1)]):
    card(f"K05_{i}", f"""
<div class="frame navy"></div>
<div class="stack pad">
  <div style="margin-bottom:44px;opacity:{1 if show_mark else 0}">
       {logo_on_dark(238)}</div>
  <div class="rule" style="width:{220 if show_mark else 90}px;margin-bottom:40px;
       transition:none"></div>
  <div class="kn700" style="font-size:96px;line-height:1.5;color:{WHITE};
       opacity:{1 if show_mark else 0};transform:translateY({0 if show_mark else 20}px)">
       ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್</div>
  <div class="kn600" style="font-size:52px;line-height:1.55;color:{GOLDL};margin-top:26px;
       opacity:{1 if show_sub else 0}">ಹತ್ತು ವರ್ಷ · 2016 ರಿಂದ 2026</div>
</div>""")

# ---------------------------------------------------------------- K06 founder quote
card("K06", f"""
<div class="frame navy"></div>
<div class="stack pad">
  <div class="kn700" style="font-size:72px;line-height:1.55;color:{WHITE};max-width:1450px">
    &ldquo;ಶಿಕ್ಷಣದ ವಿಷಯದಲ್ಲಿ ಯಾವ ಮಗುವೂ<br>ಹಿಂದೆ ಉಳಿಯಬಾರದು.&rdquo;</div>
  <div class="rule" style="margin:50px 0 30px"></div>
  <div class="kn500" style="font-size:44px;line-height:1.6;color:{GOLDL}">
    ಚಾರುಲತಾ&nbsp;ಎಂ.&nbsp;ಆರ್., ಸಂಸ್ಥಾಪಕರು</div>
</div>""")

# ---------------------------------------------------------------- K07 organisation
card("K07", f"""
<div class="frame cream"></div>
<div class="stack" style="align-items:center">
  <img src="{LOGO}" style="width:250px;height:auto;margin-bottom:40px">
  <div class="rule" style="margin-bottom:40px"></div>
  <div class="kn600" style="font-size:56px;line-height:1.55;color:{NAVY};text-align:center">
    ನೋಂದಾಯಿತ ಶೈಕ್ಷಣಿಕ ಟ್ರಸ್ಟ್</div>
  <div class="kn500" style="font-size:44px;line-height:1.6;color:{NAVY};opacity:.75;margin-top:22px">
    ಎಚ್.ಎಸ್.ಆರ್. ಲೇಔಟ್, ಬೆಂಗಳೂರು</div>
</div>""")

# ---------------------------------------------------------------- K12 one child
for i, n in enumerate([1, 2]):
    card(f"K12_{i}", f"""
<div class="frame navy"></div>
<div class="stack pad">
  <div class="kn700" style="font-size:84px;line-height:1.5;color:{WHITE}">ಒಂದು ಮಗು.</div>
  <div class="rule" style="margin:34px 0"></div>
  <div class="kn700" style="font-size:84px;line-height:1.5;color:{WHITE};
       opacity:{1 if n == 2 else 0}">ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ.</div>
</div>""")

# ---------------------------------------------------------------- K27 the 75 per cent
card("K27", f"""
<div class="frame navy"></div>
<div class="stack pad">
  <div style="display:flex;align-items:baseline;gap:28px">
    <div class="kn700" style="font-size:72px;color:{WHITE}">ಶೇಕಡ</div>
    <div class="lat" style="font-size:220px;line-height:.9;color:{GOLD}">75</div>
    <div class="kn700" style="font-size:72px;color:{WHITE}">ರವರೆಗೆ</div>
  </div>
  <div class="rule" style="margin:44px 0 34px;width:320px"></div>
  <div class="kn600" style="font-size:56px;line-height:1.55;color:{GOLDL}">
    ಶಾಲಾ ಶುಲ್ಕ, ನೇರವಾಗಿ ಶಾಲೆಗೆ</div>
</div>""")

# ---------------------------------------------------------------- K29 direct to school
card("K29", f"""
<div class="frame cream"></div>
<div class="stack" style="align-items:center">
  <div class="rule" style="margin-bottom:44px"></div>
  <div class="kn700" style="font-size:76px;line-height:1.5;color:{NAVY};text-align:center">
    ನೇರವಾಗಿ ಶಾಲೆಗೆ.<br>ಬೇರೆ ಯಾರ ಕೈಗೂ ಅಲ್ಲ.</div>
</div>""")

# ---------------------------------------------------------------- K34 hardest to reach
# ABSOLUTE RULE, 14 item 2.4: no photograph, no face, no illustration of a child,
# and no text while the line is spoken. A navy field and one gold rule.
card("K34", f"""
<div class="frame navy"></div>
<div class="stack" style="align-items:center"><div class="rule" style="width:260px"></div></div>""")

# ---------------------------------------------------------------- K35 partners
PARTNERS = ["ನಿಸರ್ಗ ಫೌಂಡೇಶನ್", "ಬೆಳಕು ಟ್ರಸ್ಟ್, ಬಂಗಾರಪೇಟೆ",
            "ಸೌಖ್ಯ ಸಮೃದ್ಧಿ ಸಂಸ್ಥೆ, ಕೋಲಾರ",
            "ಜಿಲ್ಲಾ ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ ಇಲಾಖೆ, ಕೋಲಾರ"]
for n in range(5):
    rows = "".join(
        f'<div class="kn600" style="font-size:48px;line-height:1.55;color:{GOLDL};'
        f'margin-top:22px;opacity:{1 if i < n else 0}">{p}</div>'
        for i, p in enumerate(PARTNERS))
    card(f"K35_{n}", f"""
<div class="frame navy"></div>
<div class="stack pad">
  <div class="rule" style="margin-bottom:36px"></div>
  <div class="kn700" style="font-size:64px;line-height:1.5;color:{WHITE}">ಸಹಭಾಗಿತ್ವದಲ್ಲಿ</div>
  <div style="margin-top:18px">{rows}</div>
</div>""")

# ---------------------------------------------------------------- K46 end card
for n in range(4):
    card(f"K46_{n}", f"""
<div class="frame navy"></div>
<div class="stack pad">
  <div class="kn700" style="font-size:88px;line-height:1.45;color:{WHITE};max-width:1500px">
    ಪ್ರತಿ ಮಗುವಿನ ಮೇಲೆ ನಂಬಿಕೆ ಇಟ್ಟ ಒಂದು ದಶಕ</div>
  <div class="rule" style="margin:40px 0 34px;width:{260 if n >= 1 else 0}px"></div>
  <div class="kn600" style="font-size:52px;line-height:1.55;color:{GOLDL};
       opacity:{1 if n >= 1 else 0}">ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ · 2016 ರಿಂದ 2026</div>
  <div class="kn600" style="font-size:48px;line-height:1.55;color:{GOLDL};margin-top:38px;
       opacity:{1 if n >= 2 else 0}">ಒಂದು ಮಗುವಿನ ಹೆಸರು ಸೂಚಿಸಿ&nbsp;&nbsp;·&nbsp;&nbsp;ಸ್ವಯಂಸೇವಕರಾಗಿ&nbsp;&nbsp;·&nbsp;&nbsp;ಸಹಭಾಗಿಯಾಗಿ</div>
  <div style="font-family:{SANS};font-weight:500;font-size:46px;line-height:1.5;color:{WHITE};
       margin-top:34px;opacity:{1 if n >= 3 else 0}">
    journey.lawparkeducationaltrust.org<br>
    lawparktrust@gmail.com&nbsp;&nbsp;·&nbsp;&nbsp;+91&nbsp;99456&nbsp;65379</div>
  <div style="position:absolute;right:150px;bottom:96px;
       opacity:{1 if n >= 3 else 0}">{logo_on_dark(196)}</div>
</div>""")

# ================================================================ OVERLAYS
# Transparent 1920x1080. Composited over photography.

def lower_third(name, line1, line2=None, size1=52, size2=40, extra_top=""):
    l2 = (f'<div class="kn500" style="font-size:{size2}px;line-height:1.6;color:{GOLDL};'
          f'margin-top:10px">{line2}</div>') if line2 else ""
    card(name, f"""
<div class="lt">
  <div class="ltbar">
    {extra_top}
    <div class="kn600" style="font-size:{size1}px;line-height:1.5;color:{WHITE}">{line1}</div>
    {l2}
  </div>
</div>""", extra="html,body{background:transparent}.ltbar{border-top:3px solid " + GOLD + "}")

lower_third("LT_K08", "ಚಾರುಲತಾ&nbsp;ಎಂ.&nbsp;ಆರ್.", "ಸಂಸ್ಥಾಪಕರು ಮತ್ತು ವ್ಯವಸ್ಥಾಪಕ ಟ್ರಸ್ಟಿ, ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್")
lower_third("LT_K09", "ಎಸ್.&nbsp;ಎಂ.&nbsp;ಮಂಜುನಾಥ", "ಟ್ರಸ್ಟಿ, ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್")
lower_third("LT_K13", "150 ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸ್ಟೀಲ್ ತಟ್ಟೆ ಮತ್ತು ಲೋಟ")
lower_third("LT_K15", "ಕೆಲಸ ಮುಂದುವರಿಯಿತು")
lower_third("LT_K21", "9 ಮತ್ತು 10ನೇ ತರಗತಿಗೆ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ")
lower_third("LT_K31", "ಶಾಲಾ ಸಾಮಗ್ರಿ ವಿತರಣೆ")
lower_third("LT_K33", "ಪೋಷಕರಿಗೆ ಮಾರ್ಗದರ್ಶನ")
lower_third("LT_K36", "ಉದಯವಾಣಿ · 19 ಜೂನ್ 2024")
lower_third("LT_K37", "ಭಾರತ್ ಶಿಕ್ಷಾ ರತ್ನ ಪ್ರಶಸ್ತಿ · 19 ಡಿಸೆಂಬರ್ 2025 · ನವದೆಹಲಿ",
            "ಎಕನಾಮಿಕ್ ಅಂಡ್ ಸೋಶಿಯಲ್ ಡೆವಲಪ್‌ಮೆಂಟ್ ಫೌಂಡೇಶನ್")
lower_third("LT_K38", "ನೆರವು ನೀಡಿದವರಿಗೆ",
            "ಭಾರತ, ಅಮೆರಿಕ, ಬ್ರಿಟನ್, ಜರ್ಮನಿ, ಡೆನ್ಮಾರ್ಕ್, ದುಬೈ ಮತ್ತು ಇನ್ನೂ ಹಲವೆಡೆಯಿಂದ.")
lower_third("LT_K39", "ಸ್ವಯಂಸೇವಕರಿಗೆ",
            "ವಕೀಲರು · ಎಂಜಿನಿಯರ್‌ಗಳು · ವೈದ್ಯರು · ಗೃಹಿಣಿಯರು")
lower_third("LT_K40", "ಪೋಷಕರಿಗೆ",
            "ತಮ್ಮ ಪಾಲಿನ ಶುಲ್ಕವನ್ನು ತಪ್ಪದೇ ಹೊಂದಿಸಿದವರು. ಪ್ರತಿ ವರ್ಷವೂ.")

# year cards: numeral plus caption, lower third
def year_card(name, year, caption):
    card(name, f"""
<div class="lt">
  <div class="ltbar" style="display:flex;align-items:center;gap:40px">
    <div class="lat" style="font-size:130px;line-height:.85;color:{GOLD}">{year}</div>
    <div>
      <div class="kn600" style="font-size:52px;line-height:1.5;color:{WHITE}">{caption[0]}</div>
      {f'<div class="kn500" style="font-size:44px;line-height:1.55;color:{GOLDL};margin-top:8px">{caption[1]}</div>' if len(caption) > 1 else ''}
    </div>
  </div>
</div>""", extra="html,body{background:transparent}.ltbar{border-top:3px solid " + GOLD + "}")

year_card("YR_K11", "2016", ["ಚಿಕ್ಕಬಳ್ಳಾಪುರ", "ಮೊದಲ ಶಾಲಾ ಭೇಟಿ"])
year_card("YR_K14", "2017", ["10 ವಿದ್ಯಾರ್ಥಿಗಳು"])
year_card("YR_K18", "2022", ["ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯ"])
year_card("YR_K20", "2023", ["ಮೈಸೂರು · ಎಚ್.ಡಿ. ಕೋಟೆ"])
year_card("YR_K22", "2024", ["ಎಂ.ಎಂ. ಹಿಲ್ಸ್ · 200 ಶಾಲಾ ಚೀಲ"])
year_card("YR_K23", "2025", ["ಎಚ್.ಡಿ. ಕೋಟೆ · 300 ಶಾಲಾ ಚೀಲ"])

# K17 Kannada gloss strip: the poster is in English, so the two eligibility
# criteria are set in Kannada beside it. Left panel, photo sits right.
for n in range(3):
    card(f"GLOSS_K17_{n}", f"""
<div style="position:absolute;left:0;top:0;bottom:0;width:760px;background:{NAVY}"></div>
<div style="position:absolute;left:0;top:0;bottom:0;width:760px;display:flex;
     flex-direction:column;justify-content:center;padding:0 100px">
  <div class="lat" style="font-size:120px;line-height:.9;color:{GOLD}">2020</div>
  <div class="kn600" style="font-size:52px;line-height:1.5;color:{WHITE};margin-top:18px">
    ಸಾಂಕ್ರಾಮಿಕ ಕಾಲದ ನೆರವು</div>
  <div class="rule" style="margin:34px 0 30px"></div>
  <div class="kn500" style="font-size:44px;line-height:1.6;color:{GOLDL};
       opacity:{1 if n >= 1 else 0}">ಪೋಷಕರನ್ನು ಕಳೆದುಕೊಂಡ ಮಕ್ಕಳಿಗೆ</div>
  <div class="kn500" style="font-size:44px;line-height:1.6;color:{GOLDL};margin-top:22px;
       opacity:{1 if n >= 2 else 0}">ಕೆಲಸ ಕಳೆದುಕೊಂಡು ಶುಲ್ಕ ಕಟ್ಟಲಾಗದ ಪೋಷಕರಿಗೆ</div>
</div>""", extra="html,body{background:transparent}")

# K26 four-step method, one word per 1.5 s
STEPS = ["ಗುರುತಿಸುವುದು", "ಪರಿಶೀಲಿಸುವುದು", "ಒಳಗೊಳ್ಳುವುದು", "ಬೆಳೆಸುವುದು"]
for n in range(1, 5):
    words = "".join(
        f'<span style="opacity:{1 if i < n else 0}">{w}</span>'
        f'{f"<span style=\'color:{GOLD};opacity:{1 if i + 1 < n else 0}\">&nbsp;·&nbsp;</span>" if i < 3 else ""}'
        for i, w in enumerate(STEPS))
    card(f"STEP_K26_{n}", f"""
<div class="lt"><div class="ltbar">
  <div class="kn600" style="font-size:56px;line-height:1.5;color:{GOLDL}">{words}</div>
</div></div>""", extra="html,body{background:transparent}.ltbar{border-top:3px solid " + GOLD + "}")

# K32 programme labels, 3 s each
LABELS_K32 = ["ಕಲಿಕೆಯ ಆಟಗಳು", "ನಾಡು ನುಡಿಯ ಪರಿಚಯ", "ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯ"]
for i, l in enumerate(LABELS_K32):
    lower_third(f"LBL_K32_{i}", l)


# K31 / K32 programme labels: the storyboard specifies the labels STACKED RIGHT
# of a small native-size photograph, not a full-width lower third. A lower third
# crosses the photograph and looks like an accident.
def right_panel(name, heading, items, shown):
    """A heading and a progressive list, on a scrim, at the foot of the frame.

    This used to be navy Kannada set directly over the picture with nothing
    behind it, stacked down the right third. On a flat cream card that measured
    15.77:1 and was fine. It stopped being fine the moment K31 and K32 became
    full-bleed photography: navy type over an arbitrary photograph has whatever
    contrast the photograph happens to give it, and over the pale stationery
    plate that is close to none.

    Two changes. It sits on the same navy scrim the rest of the film's lower
    thirds use, where white is 16.7:1 and the gold 8.4:1 and neither depends on
    the picture. And the list is one line of separated items rather than a
    stack, because a four-item stack is a 400px block that covered most of a
    three-tile collage; K26 already sets its four method words this way.
    """
    parts = []
    for i, it in enumerate(items):
        if i:
            parts.append(f'<span style="color:{GOLD};opacity:'
                         f'{1 if i < shown else 0}">&nbsp;·&nbsp;</span>')
        parts.append(f'<span style="opacity:{1 if i < shown else 0}">{it}</span>')
    card(name, f"""
<div class="lt"><div class="ltbar">
  <div class="kn600" style="font-size:52px;line-height:1.5;color:{WHITE}">{heading}</div>
  <div class="kn500" style="font-size:44px;line-height:1.6;color:{GOLDL};
       margin-top:12px">{"".join(parts)}</div>
</div></div>""", extra="html,body{background:transparent}"
     ".ltbar{border-top:3px solid " + GOLD + "}")


for n in range(1, 4):
    right_panel(f"RP_K31_{n}", "ಶಾಲಾ ಸಾಮಗ್ರಿ ವಿತರಣೆ",
                ["ಶಾಲಾ ಚೀಲ · ನೋಟ್‌ಬುಕ್", "ಲೇಖನ ಸಾಮಗ್ರಿ", "ಚಿತ್ರಕಲೆಯ ಪರಿಕರ"], n)
for n in range(1, 4):
    right_panel(f"RP_K32_{n}", "ಸುತ್ತಲಿನ ವರ್ತುಲ",
                ["ಕಲಿಕೆಯ ಆಟಗಳು", "ನಾಡು ನುಡಿಯ ಪರಿಚಯ",
                 "ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯ"], n)

# ================================================================ SUBTITLES
# Burned in for the preview only. The delivered SRT is a separate file and the
# graded master carries no burned-in captions.
def sub_html(lines):
    body = "<br>".join(lines)
    return ("<!doctype html><meta charset='utf-8'><style>" + BASE +
            "html,body{background:transparent}</style>"
            f"""<div style="position:absolute;left:0;right:0;bottom:64px;text-align:center">
  <div style="display:inline-block;background:rgba(28,28,46,.94);padding:20px 40px;
       border-radius:6px;max-width:1560px">
    <div class="kn500" style="font-size:48px;line-height:1.55;color:{WHITE}">{body}</div>
  </div></div>""")

def load_srt(path):
    raw = open(path, encoding="utf-8-sig").read().strip()
    out = []
    for blk in raw.split("\n\n"):
        L = [x for x in blk.split("\n") if x.strip()]
        if len(L) < 3:
            continue
        a, b = L[1].split(" --> ")
        def sec(t):
            h, m, r = t.split(":"); s, ms = r.split(",")
            return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000
        out.append(dict(start=sec(a), end=sec(b), lines=L[2:]))
    return out

def _positional(argv, valued=("--scale",)):
    """argv minus every flag and minus the value that follows a valued flag."""
    out, skip = [], False
    for a in argv:
        if skip:
            skip = False
            continue
        if a in valued:
            skip = True
            continue
        if a.startswith("--"):
            continue
        out.append(a)
    return out

_pos = _positional(sys.argv[1:])
SRT = load_srt(_pos[0] if _pos
               else "../../../../../../Users/chetan/Downloads/jeevitha/"
                    "law-park-educational-trust-10-years/anniversary-video-production/"
                    "kannada/05-kannada-subtitles.srt")
for i, c in enumerate(SRT):
    CARDS[f"SUB_{i:03d}"] = sub_html(c["lines"])
json.dump(SRT, open("subs.json", "w"), ensure_ascii=False)

# ================================================================ render
# The cache is keyed on the HTML, not on the filename. Keying it on the filename
# alone is a silent-failure machine: SUB_NNN is an INDEX into the cue list, so
# re-timing the film (build_timeline.py --from-audio) renumbers every cue after
# the first split that moves, and each old PNG then sits under a new index
# holding the previous cue's Kannada. The film renders clean, no error is raised,
# and the burned subtitles are simply the wrong lines. That happened: the
# ElevenLabs re-time grew the cue list from 80 to 83, so exactly 3 graphics were
# judged new and 80 stale ones were kept.
MANIFEST = f"{OUT}/.manifest.json"
try:
    seen = json.load(open(MANIFEST, encoding="utf-8"))
except (OSError, ValueError):
    seen = {}

def _stamp(html):
    return hashlib.sha256(html.encode("utf-8")).hexdigest()[:16]

todo = [(n, h) for n, h in CARDS.items()
        if not os.path.exists(f"{OUT}/{n}.png") or seen.get(n) != _stamp(h)]
stale = [n for n, h in CARDS.items()
         if os.path.exists(f"{OUT}/{n}.png") and seen.get(n) not in (None, _stamp(h))]
# PNGs whose card no longer exists at all: a shorter cue list leaves orphans that
# nothing references but that make the directory listing lie about the count.
orphan = [f for f in os.listdir(OUT)
          if f.endswith(".png") and f[:-4] not in CARDS]
for f in orphan:
    os.remove(f"{OUT}/{f}")

print(f"{len(CARDS)} graphics, {len(todo)} to render "
      f"at {1920 * SCALE}x{1080 * SCALE} into {OUT}/")
if stale:
    print(f"  {len(stale)} changed content, re-rendering: "
          f"{' '.join(sorted(stale)[:8])}{' ...' if len(stale) > 8 else ''}")
if orphan:
    print(f"  {len(orphan)} orphaned PNGs removed")
if not seen:
    print("  no manifest yet, so every graphic is re-rendered once to "
          "guarantee the cache and the cue list agree")
with sync_playwright() as p:
    br = p.chromium.launch()
    pg = br.new_page(viewport={"width": 1920, "height": 1080},
                     device_scale_factor=SCALE)
    for i, (name, html) in enumerate(todo):
        pg.set_content(html)
        pg.wait_for_timeout(45)
        pg.screenshot(path=f"{OUT}/{name}.png", omit_background=True)
        if i % 25 == 0:
            print(f"  {i}/{len(todo)}", flush=True)
        seen[name] = _stamp(html)
    br.close()

json.dump({n: _stamp(h) for n, h in CARDS.items()},
          open(MANIFEST, "w"), indent=0, sort_keys=True)
print("done:", len([f for f in os.listdir(OUT) if f.endswith(".png")]),
      "PNGs in", OUT)
