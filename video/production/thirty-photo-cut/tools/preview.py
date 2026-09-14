#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Renders the 30-photo cut as a browsable review page.

  python3 preview.py <outdir>              index.html plus img/S01.jpg ... S30.jpg
  python3 preview.py <file.html> --inline  ONE self-contained file, frames embedded
  python3 preview.py <outdir> --fragment   body-only, for publishing as an Artifact

Each frame is the photograph cover-cropped to 16:9 exactly as the film will crop
it, and the page composites the heading over it in the browser, which is also
where Kannada shapes correctly.

The folder form is the one to host or to open from a checkout. The --inline form
is one file with every frame embedded as a data URI, so it can be emailed to a
trustee or opened from a USB stick with nothing beside it. It is larger and the
frames are smaller, because base64 costs a third on top of the bytes.

Both forms are complete HTML documents that open straight from disk. --fragment
drops the document shell, because the Artifact host supplies its own.

Nothing here is part of the delivery: it exists so a trustee can see the cut
before anyone renders video.

Reads timeline-30-photos.json, so run build.py first.
"""
import base64, html, io, json, os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.abspath(os.path.join(HERE, ".."))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
PHOTOS = os.path.join(REPO, "video/production/photo-pack-10-years/enhanced")

FRAME = (1280, 720)          # the folder form, served as files
FRAME_INLINE = (1024, 576)   # the single-file form, where every byte is base64


def crop(sh, size):
    """Cover-crop one photograph to 16:9 at `size`."""
    im = Image.open(os.path.join(PHOTOS, sh["photo"])).convert("RGB")
    w, h = im.size
    tw, th = size
    sc = max(tw / w, th / h)
    nw, nh = int(round(w * sc)), int(round(h * sc))
    im = im.resize((nw, nh), Image.LANCZOS)
    # Portrait sources carry their subject high in the frame, so bias the
    # 16:9 window up rather than centring it and cropping off the faces.
    top = int((nh - th) * (0.30 if h > w else 0.5))
    return im.crop(((nw - tw) // 2, top, (nw - tw) // 2 + tw, top + th))


def frames(cut, outdir):
    """Write one JPEG per shot into <outdir>/img/."""
    d = os.path.join(outdir, "img")
    os.makedirs(d, exist_ok=True)
    for sh in cut:
        crop(sh, FRAME).save(os.path.join(d, sh["sid"] + ".jpg"),
                             quality=78, optimize=True, progressive=True)
    return {sh["sid"]: "img/%s.jpg" % sh["sid"] for sh in cut}


def frames_inline(cut):
    """Encode every shot as a data URI, for the single-file page."""
    out, total = {}, 0
    for sh in cut:
        buf = io.BytesIO()
        crop(sh, FRAME_INLINE).save(buf, "JPEG", quality=72, optimize=True,
                                    progressive=True)
        raw = buf.getvalue()
        total += len(raw)
        out[sh["sid"]] = "data:image/jpeg;base64," + \
            base64.b64encode(raw).decode("ascii")
    print("  %d frames embedded, %.1f MB of JPEG before base64"
          % (len(cut), total / 1e6))
    return out


def esc(s):
    return html.escape(s, quote=True)


def heading_html(text):
    return "".join("<span>%s</span>" % esc(p.strip()) for p in text.split("//"))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    inline = "--inline" in sys.argv
    fragment = "--fragment" in sys.argv
    if len(args) != 1:
        sys.exit(__doc__)
    target = os.path.abspath(args[0])
    with open(os.path.join(PACK, "timeline-30-photos.json"), encoding="utf-8") as fh:
        tl = json.load(fh)
    cut, snd, total = tl["shots"], tl["sound"], tl["duration_s"]

    if inline:
        os.makedirs(os.path.dirname(target) or ".", exist_ok=True)
        src = frames_inline(cut)
        page_path = target
    else:
        os.makedirs(target, exist_ok=True)
        src = frames(cut, target)
        page_path = os.path.join(target, "index.html")

    by_shot = {}
    for e in snd:
        by_shot.setdefault(e["shot"], []).append(e)

    acts, seen = [], set()
    for r in cut:
        if r["act"] in seen:
            continue
        seen.add(r["act"])
        rs = [x for x in cut if x["act"] == r["act"]]
        acts.append(dict(n=r["act"], en=r["act_en"], kn=r["act_kn"],
                         t_in=rs[0]["t_in"], t_out=rs[-1]["t_out"],
                         first=rs[0]["sid"], last=rs[-1]["sid"],
                         run=sum(x["dur"] for x in rs)))

    en_words = sum(r["words_en"] for r in cut)
    en_speech = sum(r["speech_en"] for r in cut)
    kn_speech = sum(r["speech_kn"] for r in cut)
    kn_clusters = sum(r["clusters_kn"] for r in cut)
    n_accent = sum(1 for e in snd if e["kind"] == "accent")
    n_bed = sum(1 for e in snd if e["kind"] == "bed")
    n_sil = sum(1 for e in snd if e["kind"] == "silence")

    # ---------------------------------------------------------------- strip
    strip = []
    for r in cut:
        strip.append(
            '<a class="seg a%d" href="#%s" style="flex:%.4f" '
            'title="%s · %s · %.0fs"><i></i></a>'
            % (r["act"], r["sid"], r["dur"], r["sid"], esc(r["tc_in"]), r["dur"]))

    # ----------------------------------------------------------------- acts
    actnav = []
    for a in acts:
        actnav.append(
            '<a class="actchip a%d" href="#%s"><b>%d</b>'
            '<span class="en">%s</span><span class="kn">%s</span>'
            '<em>%s to %s · %.0fs</em></a>'
            % (a["n"], a["first"], a["n"], esc(a["en"]), esc(a["kn"]),
               esc(a["first"]), esc(a["last"]), a["run"]))

    # ---------------------------------------------------------------- shots
    rows, cur_act = [], None
    for r in cut:
        if r["act"] != cur_act:
            cur_act = r["act"]
            a = [x for x in acts if x["n"] == cur_act][0]
            rows.append(
                '<h2 class="actrule a%d"><b>Act %d</b>'
                '<span class="en">%s</span><span class="kn">%s</span>'
                '<em>%s to %s &#183; %.0f s</em></h2>'
                % (a["n"], a["n"], esc(a["en"]), esc(a["kn"]),
                   esc(a["first"]), esc(a["last"]), a["run"]))

        ev = by_shot.get(r["sid"], [])
        chips = []
        for e in ev:
            if e["kind"] == "silence":
                chips.append('<span class="chip sil">silence %.1fs<em>%s</em></span>'
                             % (e["dur"], "voice out" if not e.get("voice") else "score out"))
            else:
                name = e["file"].split("-")[-1].rsplit(".", 1)[0].replace("_", " ")
                chips.append('<span class="chip %s">%s<em>%s · %d dB</em></span>'
                             % (e["kind"], esc(e["kind"]), esc(name), e["level"]))
        consent = r["consent"]
        cls = ("ok" if consent.startswith("CLEAR") else
               "rev" if consent.startswith("REVIEW") else "blk")

        rows.append("""
<article class="shot a{act}" id="{sid}">
  <div class="framewrap">
    <div class="frame r-{role}">
      <img src="{src}" alt="{alt}" loading="lazy" width="1280" height="720">
      <div class="scrim"></div>
      <div class="head en">{hen}</div>
      <div class="head kn">{hkn}</div>
      <div class="tcburn">{tcin}</div>
    </div>
    <p class="inframe"><b>In frame</b> {see}</p>
  </div>
  <div class="meta">
    <div class="metatop">
      <span class="sid">{sid}</span>
      <span class="tc">{tcin}</span>
      <span class="dur">{dur:.0f}s</span>
      <span class="role">{role}</span>
      <span class="kid">EDL {kid}</span>
    </div>
    <p class="vo en">{voen}</p>
    <p class="vo kn">{vokn}</p>
    <p class="fit"><span class="en">{we} words · {se:.1f}s spoken · {ae:.1f}s held</span>
       <span class="kn">{ck:.0f} clusters · {sk:.1f}s spoken · {ak:.1f}s held</span></p>
    {chips}
    <p class="consent {cls}"><b>Consent</b> {consent}</p>
    <p class="direction"><b>Direction</b> {note}</p>
  </div>
</article>""".format(
            act=r["act"], sid=r["sid"], role=r["role"], kid=esc(r["kid"]),
            src=src[r["sid"]], alt=esc(r["see"][:120]),
            hen=heading_html(r["head_en"]),
            hkn=heading_html(r["head_kn"]), tcin=esc(r["tc_in"]), dur=r["dur"],
            see=esc(r["see"]), voen=esc(r["vo_en"]), vokn=esc(r["vo_kn"]),
            we=r["words_en"], se=r["speech_en"], ae=r["air_en"],
            ck=r["clusters_kn"], sk=r["speech_kn"], ak=r["air_kn"],
            chips=('<div class="chips">%s</div>' % "".join(chips)) if chips else "",
            cls=cls, consent=esc(consent), note=esc(r["note"])))

    page = TEMPLATE
    for k, v in (
        ("TOTAL_TC", esc(tl["duration_tc"])),
        ("FRAMES", "{:,}".format(int(round(total * tl["fps"])))),
        ("FPS", str(tl["fps"])),
        ("EN_WORDS", str(en_words)),
        ("EN_SPEECH", "%.1f" % en_speech),
        ("KN_CLUSTERS", "{:,}".format(int(round(kn_clusters)))),
        ("KN_SPEECH", "%.1f" % kn_speech),
        ("HELD_EN", "%.1f" % (total - en_speech)),
        ("HELD_KN", "%.1f" % (total - kn_speech)),
        ("RATE", "%.4f" % tl["kannada_seconds_per_cluster"]),
        ("N_BED", str(n_bed)), ("N_ACCENT", str(n_accent)), ("N_SIL", str(n_sil)),
        ("STRIP", "".join(strip)), ("ACTNAV", "".join(actnav)),
        ("ROWS", "".join(rows)),
    ):
        page = page.replace("@@%s@@" % k, v)
    assert "@@" not in page, "unsubstituted token in the template"
    if not fragment:
        page = SHELL.replace("@@BODY@@", page)
    with open(page_path, "w", encoding="utf-8") as fh:
        fh.write(page)
    size = os.path.getsize(page_path)
    print("wrote %s (%.1f MB%s)"
          % (page_path, size / 1e6,
             ", self-contained" if inline else ", plus img/ beside it"))


SHELL = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="description" content="Shot-by-shot timeline for the Law Park Educational Trust anniversary film: 30 photographs, foreground headings and sound cues, in English and Kannada on one picture cut.">
<meta name="robots" content="noindex, nofollow">
</head>
<body>
@@BODY@@
</body>
</html>
"""

TEMPLATE = r"""<title>Ten Years, Thirty Frames</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,500;1,700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Noto+Sans+Kannada:wght@400;600;700&display=swap">
<style>
:root{
  --paper:#f7f3ec; --raised:#fffdf9; --ink:#17120e; --body:#3a322a;
  --muted:#7a6f64; --rule:#e0d8cc; --rule2:#cfc5b6;
  --laterite:#b4541f; --laterite-soft:#e8d3c3;
  --neem:#5f7038; --clay:#9c3b2c; --slate:#42566b;
  --a1:#b4541f; --a2:#8a5a2b; --a3:#5f7038; --a4:#42566b; --a5:#8a4a5e; --a6:#6b5a2e;
  --shadow:0 1px 2px rgba(23,18,14,.06), 0 8px 24px -12px rgba(23,18,14,.18);
  --max:1180px;
  color-scheme:light dark;
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --paper:#14110e; --raised:#1d1815; --ink:#f4ece1; --body:#cfc3b4;
    --muted:#96897a; --rule:#2c2521; --rule2:#3d342e;
    --laterite:#e07b42; --laterite-soft:#4a2c1b;
    --neem:#9bb063; --clay:#e0705c; --slate:#7e9ab5;
    --a1:#e07b42; --a2:#c2895a; --a3:#9bb063; --a4:#7e9ab5; --a5:#c98098; --a6:#bda65f;
    --shadow:0 1px 2px rgba(0,0,0,.5), 0 10px 30px -14px rgba(0,0,0,.8);
  }
}
:root[data-theme="dark"]{
  --paper:#14110e; --raised:#1d1815; --ink:#f4ece1; --body:#cfc3b4;
  --muted:#96897a; --rule:#2c2521; --rule2:#3d342e;
  --laterite:#e07b42; --laterite-soft:#4a2c1b;
  --neem:#9bb063; --clay:#e0705c; --slate:#7e9ab5;
  --a1:#e07b42; --a2:#c2895a; --a3:#9bb063; --a4:#7e9ab5; --a5:#c98098; --a6:#bda65f;
  --shadow:0 1px 2px rgba(0,0,0,.5), 0 10px 30px -14px rgba(0,0,0,.8);
}
*{box-sizing:border-box}
body{
  margin:0; background:var(--paper); color:var(--body);
  font:400 15px/1.6 "IBM Plex Sans", system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing:antialiased;
}
:lang(kn), .kn{font-family:"Noto Sans Kannada","IBM Plex Sans",system-ui,sans-serif}
a{color:inherit}
:focus-visible{outline:2px solid var(--laterite); outline-offset:3px; border-radius:2px}
.wrap{max-width:var(--max); margin:0 auto; padding:0 24px}

/* ---------------------------------------------------------------- masthead */
header{border-bottom:1px solid var(--rule); background:var(--raised)}
.mast{display:flex; flex-wrap:wrap; gap:28px 40px; align-items:flex-end;
      padding:40px 24px 26px; max-width:var(--max); margin:0 auto}
.eyebrow{font:500 11px/1 "IBM Plex Mono",monospace; letter-spacing:.16em;
         text-transform:uppercase; color:var(--laterite); margin:0 0 14px}
h1{font-family:"Playfair Display",Georgia,serif; font-weight:900;
   font-size:clamp(38px,5.4vw,62px); line-height:.98; letter-spacing:-.015em;
   margin:0; color:var(--ink); text-wrap:balance}
h1 em{display:block; font-style:italic; font-weight:500;
      font-size:.44em; line-height:1.2; color:var(--muted); margin-top:12px;
      letter-spacing:0}
.vitals{display:grid; grid-template-columns:repeat(2,minmax(0,1fr));
        gap:2px 30px; margin-left:auto}
.vitals div{display:flex; gap:10px; align-items:baseline;
            font:400 13px/1.7 "IBM Plex Mono",monospace;
            font-variant-numeric:tabular-nums; white-space:nowrap}
.vitals dt,.vitals b{color:var(--muted); font-weight:400; min-width:112px}
.vitals span{color:var(--ink); font-weight:500}

/* --------------------------------------------------------------- controls */
.bar{position:sticky; top:0; z-index:20; background:var(--raised);
     border-bottom:1px solid var(--rule)}
.barin{display:flex; align-items:center; gap:20px; flex-wrap:wrap;
       max-width:var(--max); margin:0 auto; padding:11px 24px}
.toggle{display:inline-flex; border:1px solid var(--rule2); border-radius:2px;
        overflow:hidden; background:var(--paper)}
.toggle button{appearance:none; border:0; background:transparent; cursor:pointer;
  padding:7px 16px; font:600 12px/1 "IBM Plex Sans",sans-serif;
  letter-spacing:.09em; text-transform:uppercase; color:var(--muted)}
.toggle button + button{border-left:1px solid var(--rule2)}
.toggle button[aria-pressed="true"]{background:var(--laterite); color:#fff}
.toggle button:last-child{font-family:"Noto Sans Kannada",sans-serif;
  text-transform:none; letter-spacing:0; font-size:13px}
.barnote{font:400 12px/1.4 "IBM Plex Mono",monospace; color:var(--muted)}

/* filmstrip: one segment per shot, width proportional to its duration */
.strip{display:flex; gap:2px; height:22px; margin-left:auto; min-width:260px;
       flex:1 1 320px; align-items:stretch}
.seg{display:block; text-decoration:none; padding:6px 0}
.seg i{display:block; height:100%; border-radius:1px; background:currentColor;
       opacity:.42; transition:opacity .15s, transform .15s}
.seg:hover i,.seg:focus-visible i{opacity:1; transform:scaleY(1.9)}

/* ------------------------------------------------------------------- acts */
.actindex{display:grid; grid-template-columns:repeat(auto-fit,minmax(168px,1fr));
          gap:1px; background:var(--rule); border-bottom:1px solid var(--rule)}
.actchip{display:block; background:var(--raised); padding:16px 18px 18px;
         text-decoration:none; border-top:3px solid currentColor}
.actchip:hover{background:var(--paper)}
.actchip b{display:block; font-family:"Playfair Display",serif; font-weight:900;
           font-size:26px; line-height:1; color:currentColor; margin-bottom:7px}
.actchip span{display:block; color:var(--ink); font-weight:600; font-size:13.5px;
              line-height:1.35}
.actchip em{display:block; margin-top:7px; font-style:normal; color:var(--muted);
            font:400 11px/1.5 "IBM Plex Mono",monospace;
            font-variant-numeric:tabular-nums}

.a1{color:var(--a1)} .a2{color:var(--a2)} .a3{color:var(--a3)}
.a4{color:var(--a4)} .a5{color:var(--a5)} .a6{color:var(--a6)}

/* ------------------------------------------------------------------ shots */
main{padding:40px 0 80px}
.actrule{display:flex; align-items:baseline; gap:14px; flex-wrap:wrap;
  margin:56px 0 26px; padding-bottom:10px; border-bottom:2px solid currentColor}
.actrule:first-child{margin-top:0}
.actrule b{font-family:"Playfair Display",serif; font-weight:900; font-size:15px;
  letter-spacing:.02em; text-transform:uppercase}
.actrule span{color:var(--ink); font-family:"Playfair Display",serif;
  font-weight:700; font-size:25px; letter-spacing:-.01em}
.actrule span.kn{font-family:"Noto Sans Kannada",sans-serif; font-size:22px;
  font-weight:700}
.actrule em{margin-left:auto; font-style:normal; color:var(--muted);
  font:400 12px/1 "IBM Plex Mono",monospace}

.shot{display:grid; grid-template-columns:minmax(0,1.06fr) minmax(0,1fr);
      gap:26px 30px; padding:26px 0; border-top:1px solid var(--rule);
      scroll-margin-top:70px}
.shot:first-of-type{border-top:0}

/* the frame: photograph behind, heading in front. this is the cut's one rule */
.frame{position:relative; aspect-ratio:16/9; overflow:hidden;
       background:#0d0b09; box-shadow:var(--shadow)}
.frame img{display:block; width:100%; height:100%; object-fit:cover}
.scrim{position:absolute; inset:0;
  background:linear-gradient(to top, rgba(8,6,5,.86) 0%, rgba(8,6,5,.62) 26%,
             rgba(8,6,5,.12) 54%, rgba(8,6,5,0) 74%)}
.head{position:absolute; left:6.5%; right:6.5%; bottom:7.5%; color:#fff;
      display:flex; flex-direction:column; gap:.28em; text-shadow:0 1px 14px rgba(0,0,0,.5)}
.head span{display:block}
.head span:first-child{font-family:"Playfair Display",Georgia,serif;
  font-weight:700; font-size:clamp(17px,3.1cqw,30px); line-height:1.08;
  letter-spacing:-.005em}
.head span + span{font-size:clamp(11px,1.62cqw,15px); font-weight:500;
  color:rgba(255,255,255,.88); line-height:1.35}
.framewrap{container-type:inline-size}
.head.kn span:first-child{font-family:"Noto Sans Kannada",sans-serif;
  font-weight:700; font-size:clamp(15px,2.6cqw,25px); line-height:1.3}
.head.kn span + span{font-family:"Noto Sans Kannada",sans-serif}

/* registers change what the heading is, not merely how big it is */
.r-title .head, .r-end .head{bottom:auto; top:50%; transform:translateY(-50%);
  align-items:center; text-align:center}
.r-title .scrim, .r-end .scrim{background:
  linear-gradient(to top, rgba(8,6,5,.7), rgba(8,6,5,.52) 55%, rgba(8,6,5,.6))}
.r-title .head span:first-child, .r-end .head span:first-child{
  font-size:clamp(18px,3.5cqw,34px); font-weight:900; letter-spacing:.01em}
.r-title .head span + span, .r-end .head span + span{
  letter-spacing:.14em; text-transform:uppercase; font-size:clamp(9px,1.25cqw,12px);
  padding-top:.45em; border-top:1px solid rgba(255,255,255,.4); margin-top:.3em}
.r-title .head.kn span + span, .r-end .head.kn span + span{
  letter-spacing:.04em; text-transform:none; font-size:clamp(10px,1.5cqw,14px)}
.r-year .head span:first-child{font-weight:900;
  font-size:clamp(19px,3.6cqw,34px); letter-spacing:-.01em;
  font-variant-numeric:lining-nums}
.r-quote .head span:first-child, .r-quote .head span:nth-child(2){
  font-family:"Playfair Display",serif; font-style:italic; font-weight:500;
  font-size:clamp(15px,2.5cqw,24px); line-height:1.26; letter-spacing:0}
.r-quote .head.kn span:first-child, .r-quote .head.kn span:nth-child(2){
  font-family:"Noto Sans Kannada",sans-serif; font-style:normal}
.r-quote .head span:last-child{font-size:clamp(10px,1.35cqw,13px);
  letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.78);
  margin-top:.5em}
.r-quote .head.kn span:last-child{text-transform:none; letter-spacing:.02em}
.r-partners .head span:first-child{font-family:"IBM Plex Sans",sans-serif;
  font-weight:600; font-size:clamp(10px,1.3cqw,12.5px); letter-spacing:.14em;
  text-transform:uppercase; color:rgba(255,255,255,.75)}
.r-partners .head.kn span:first-child{font-family:"Noto Sans Kannada",sans-serif;
  text-transform:none; letter-spacing:.03em; font-size:clamp(11px,1.5cqw,14px)}
.r-partners .head span + span{font-size:clamp(11px,1.5cqw,14.5px); font-weight:500;
  color:#fff}
.r-name .head span:first-child{font-weight:700}
.r-name .head span + span{letter-spacing:.11em; text-transform:uppercase;
  font-size:clamp(9px,1.2cqw,11.5px)}
.r-name .head.kn span + span{text-transform:none; letter-spacing:.02em;
  font-size:clamp(11px,1.5cqw,14px)}

.tcburn{position:absolute; top:9px; right:11px; color:rgba(255,255,255,.7);
  font:500 10.5px/1 "IBM Plex Mono",monospace; letter-spacing:.05em;
  font-variant-numeric:tabular-nums; text-shadow:0 1px 6px rgba(0,0,0,.7)}
.inframe{margin:11px 0 0; font-size:12.5px; line-height:1.55; color:var(--muted)}
.inframe b{display:inline-block; color:var(--ink); font-weight:600;
  font-size:10px; letter-spacing:.13em; text-transform:uppercase; margin-right:7px}

.meta{display:flex; flex-direction:column; gap:13px; min-width:0}
.metatop{display:flex; align-items:baseline; gap:12px; flex-wrap:wrap;
  padding-bottom:11px; border-bottom:1px solid var(--rule)}
.metatop .sid{font-family:"Playfair Display",serif; font-weight:900; font-size:23px;
  color:var(--ink); line-height:1}
.metatop .tc,.metatop .dur{font:500 12px/1 "IBM Plex Mono",monospace;
  color:var(--laterite); font-variant-numeric:tabular-nums}
.metatop .dur{color:var(--muted)}
.metatop .role,.metatop .kid{margin-left:0; font:400 10px/1 "IBM Plex Mono",monospace;
  letter-spacing:.1em; text-transform:uppercase; color:var(--muted);
  border:1px solid var(--rule2); padding:4px 7px; border-radius:2px}
.metatop .kid{margin-left:auto}

.vo{margin:0; font-size:16.5px; line-height:1.55; color:var(--ink);
  max-width:58ch; border-left:3px solid var(--laterite-soft); padding-left:15px}
.vo.kn{font-size:16px; line-height:1.75}
.fit{margin:0; font:400 11.5px/1.5 "IBM Plex Mono",monospace; color:var(--muted);
  font-variant-numeric:tabular-nums}

.chips{display:flex; flex-wrap:wrap; gap:6px}
.chip{display:inline-flex; flex-direction:column; gap:2px; padding:5px 9px;
  border-radius:2px; font:600 10px/1.25 "IBM Plex Sans",sans-serif;
  letter-spacing:.1em; text-transform:uppercase;
  background:var(--raised); border:1px solid var(--rule2); color:var(--muted)}
.chip em{font:400 10.5px/1.3 "IBM Plex Mono",monospace; font-style:normal;
  letter-spacing:0; text-transform:none; color:var(--body)}
.chip.accent{border-color:var(--laterite); color:var(--laterite)}
.chip.bed{border-style:dashed}
.chip.sil{border-color:var(--slate); color:var(--slate); background:transparent}

.consent,.direction{margin:0; font-size:12.5px; line-height:1.55; color:var(--muted)}
.consent b,.direction b{display:inline-block; font-size:10px; letter-spacing:.13em;
  text-transform:uppercase; margin-right:7px; font-weight:600}
.consent.blk b{color:var(--clay)} .consent.ok b{color:var(--neem)}
.consent.rev b{color:var(--a6)} .direction b{color:var(--ink)}

footer{border-top:1px solid var(--rule); background:var(--raised);
  padding:34px 24px 46px}
footer .wrap{display:flex; flex-wrap:wrap; gap:26px 50px}
footer p{margin:0; max-width:46ch; font-size:13px; line-height:1.65; color:var(--muted)}
footer b{color:var(--ink); display:block; font-size:10px; letter-spacing:.13em;
  text-transform:uppercase; margin-bottom:7px}

body:not(.lang-kn) .kn{display:none}
body.lang-kn .en{display:none}
body.lang-kn .vitals .en{display:none}

@media (max-width:860px){
  .shot{grid-template-columns:1fr; gap:18px}
  .vitals{margin-left:0; grid-template-columns:1fr}
  .strip{order:3; flex-basis:100%; margin-left:0}
  .metatop .kid{margin-left:0}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>

<header>
  <div class="mast">
    <div>
      <p class="eyebrow">Law Park Educational Trust · Anniversary film · Cut 2</p>
      <h1>Ten Years,<br>Thirty Frames<em>Thirty photographs. Thirty headings.
        One timeline, two languages.</em></h1>
    </div>
    <div class="vitals">
      <div><b>Master</b><span>1920&#215;1080 · @@FPS@@ fps</span></div>
      <div><b>Duration</b><span>@@TOTAL_TC@@ &#183; @@FRAMES@@ frames</span></div>
      <div><b>English</b><span>@@EN_WORDS@@ words &#183; @@EN_SPEECH@@ s spoken</span></div>
      <div><b>Kannada</b><span>@@KN_CLUSTERS@@ clusters &#183; @@KN_SPEECH@@ s spoken</span></div>
      <div><b>Held picture</b><span>@@HELD_EN@@ s EN / @@HELD_KN@@ s KN</span></div>
      <div><b>Sound</b><span>@@N_BED@@ beds &#183; @@N_ACCENT@@ accents &#183; @@N_SIL@@ silences</span></div>
    </div>
  </div>
</header>

<div class="bar">
  <div class="barin">
    <div class="toggle" role="group" aria-label="Narration language">
      <button type="button" id="bEn" aria-pressed="true">English</button>
      <button type="button" id="bKn" aria-pressed="false" lang="kn">ಕನ್ನಡ</button>
    </div>
    <p class="barnote">Headings and narration switch together. The picture cut does not move.</p>
    <nav class="strip" aria-label="Jump to shot">@@STRIP@@</nav>
  </div>
</div>

<nav class="actindex" aria-label="Acts">@@ACTNAV@@</nav>

<main class="wrap">@@ROWS@@</main>

<footer>
  <div class="wrap">
    <p><b>What this is</b>Every shot is a full-bleed photograph with the heading
      composited over it. No graphics cards, no plates. The frames below are the
      real 16:9 crops of the enhanced stills, with the headings set as the film
      will set them.</p>
    <p><b>Pace</b>English is written to 140&nbsp;wpm. Kannada is measured in display
      clusters at @@RATE@@&nbsp;s per cluster, a constant measured off the approved
      Kannada cut rather than assumed. Shot lengths are set to the Kannada read, so
      English sits with a little more air.</p>
    <p><b>Before anyone renders</b>24 of the 30 shots are consent-blocking, the four
      partner names and the award line need written approval, and the enhanced
      renders need a trustee face-check. The full gate list is in the pack README.</p>
    <p><b>Source</b>Generated from <code>tools/shots.py</code> by
      <code>tools/build.py</code> and <code>tools/preview.py</code>. Change the shot
      file and every document, caption set and this page move together.</p>
  </div>
</footer>

<script>
(function(){
  var b = document.body, en = document.getElementById('bEn'), kn = document.getElementById('bKn');
  function set(lang){
    b.classList.toggle('lang-kn', lang === 'kn');
    en.setAttribute('aria-pressed', String(lang !== 'kn'));
    kn.setAttribute('aria-pressed', String(lang === 'kn'));
    try { localStorage.setItem('lpet-cut2-lang', lang); } catch (e) {}
  }
  en.addEventListener('click', function(){ set('en'); });
  kn.addEventListener('click', function(){ set('kn'); });
  var saved = null;
  try { saved = localStorage.getItem('lpet-cut2-lang'); } catch (e) {}
  if (saved === 'kn') set('kn');
})();
</script>
"""

if __name__ == "__main__":
    main()
