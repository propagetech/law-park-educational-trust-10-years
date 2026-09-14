#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Renders the 30-photo cut as a review page you can listen to, mark up and print.

  python3 preview.py <outdir>              index.html plus img/ and audio/
  python3 preview.py <file.html> --inline  ONE self-contained file, media embedded
  python3 preview.py <outdir> --fragment   body-only, for publishing as an Artifact
  python3 preview.py <outdir> --no-audio   skip the ffmpeg pass

What the page does beyond showing the cut:

  Listen   Every sound placement is pre-trimmed to its own window with its own
           fades, so pressing play auditions the cue as placed, not the whole
           source file. A shot can also be played whole, with each cue firing at
           its offset. Solo hears the effect; In mix drops each cue to its
           written level so the balance between them is audible.

  Mark up  Headings, narration and durations are editable, a shot can be pointed
           at a different photograph, and every shot takes a status and a note.
           Edits live in the browser only and are exported as review.json, which
           tools/apply_review.py writes back into shots.py. The page is never a
           second source of truth.

  Print    A print stylesheet lays the cut out for PDF: one shot per block, no
           controls, edits and review notes included.

Each frame is the photograph cover-cropped to 16:9 exactly as the film will crop
it, and the page composites the heading over it in the browser, which is also
where Kannada shapes correctly.

Both forms are complete HTML documents that open straight from disk. --fragment
drops the document shell, because the Artifact host supplies its own. Note that
the Artifact sandbox blocks downloads, so there the export is copy to clipboard.

Reads timeline-30-photos.json, so run build.py first. Audio needs ffmpeg.
"""
import base64, html, io, json, os, shutil, subprocess, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.abspath(os.path.join(HERE, ".."))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
PHOTOS = os.path.join(REPO, "video/production/photo-pack-10-years/enhanced")
SFX = os.path.abspath(os.path.join(HERE, "..", "..", "kannada", "tools", "sfx"))

FRAME = (1280, 720)          # the folder form, served as files
FRAME_INLINE = (1024, 576)   # the single-file form, where every byte is base64
BED_AUDITION = 15.0          # seconds of a bed worth hearing to judge it
ACCENT_MAX = 6.0             # cap for a placement whose window says "whole file"


# --------------------------------------------------------------------------
# Pictures
# --------------------------------------------------------------------------

def stem(photo):
    return photo.replace("-enhanced.png", "")


def crop(photo, size):
    """Cover-crop one photograph to 16:9 at `size`."""
    im = Image.open(os.path.join(PHOTOS, photo)).convert("RGB")
    w, h = im.size
    tw, th = size
    sc = max(tw / w, th / h)
    nw, nh = int(round(w * sc)), int(round(h * sc))
    im = im.resize((nw, nh), Image.LANCZOS)
    # Portrait sources carry their subject high in the frame, so bias the
    # 16:9 window up rather than centring it and cropping off the faces.
    top = int((nh - th) * (0.30 if h > w else 0.5))
    return im.crop(((nw - tw) // 2, top, (nw - tw) // 2 + tw, top + th))


def frames(photos, outdir, inline):
    """One 16:9 JPEG per photograph, keyed by file name rather than by shot, so
    a shot can be pointed at a different photograph without re-rendering."""
    if not inline:
        os.makedirs(os.path.join(outdir, "img"), exist_ok=True)
    out, total = {}, 0
    for photo in photos:
        if inline:
            buf = io.BytesIO()
            crop(photo, FRAME_INLINE).save(buf, "JPEG", quality=72,
                                           optimize=True, progressive=True)
            raw = buf.getvalue()
            total += len(raw)
            out[photo] = "data:image/jpeg;base64," + base64.b64encode(raw).decode()
        else:
            rel = "img/%s.jpg" % stem(photo)
            crop(photo, FRAME).save(os.path.join(outdir, rel), quality=78,
                                    optimize=True, progressive=True)
            total += os.path.getsize(os.path.join(outdir, rel))
            out[photo] = rel
    print("  %d frames, %.1f MB%s" % (len(out), total / 1e6,
                                      " before base64" if inline else ""))
    return out


# --------------------------------------------------------------------------
# Sound. Each placement becomes its own clip, trimmed to the window the cue
# sheet gives it and carrying that cue's fades. Auditioning the source file
# instead would tell you nothing about the placement.
# --------------------------------------------------------------------------

def probe(path):
    try:
        return float(subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=nw=1:nk=1", path],
            capture_output=True, text=True, check=True).stdout.strip())
    except Exception:
        return 0.0


def clips(snd, outdir, inline):
    if not shutil.which("ffmpeg"):
        print("  ffmpeg not found, building the page without audio")
        return {}
    if not inline:
        os.makedirs(os.path.join(outdir, "audio"), exist_ok=True)
    out, total = {}, 0
    for e in snd:
        if e["kind"] == "silence" or not e.get("file"):
            continue
        src = os.path.join(SFX, e["file"])
        if not os.path.exists(src):
            print("  missing sound file, skipped: %s" % e["file"])
            continue
        start = float(e.get("in_s") or 0.0)
        dur = float(e.get("dur") or 0.0)
        if dur <= 0:                       # the placement means "the whole file"
            dur = min(max(probe(src) - start, 0.5), ACCENT_MAX)
        if e["kind"] == "bed":
            dur = min(dur, BED_AUDITION)   # enough of a bed to judge it
        fi = min(float(e.get("fade_in") or 0.0), dur / 2)
        fo = min(float(e.get("fade_out") or 0.0), dur / 2)
        af = []
        if fi > 0:
            af.append("afade=t=in:st=0:d=%.3f" % fi)
        if fo > 0:
            af.append("afade=t=out:st=%.3f:d=%.3f" % (max(dur - fo, 0.0), fo))
        cmd = ["ffmpeg", "-v", "error", "-y", "-ss", "%.3f" % start,
               "-t", "%.3f" % dur, "-i", src]
        if af:
            cmd += ["-af", ",".join(af)]
        cmd += ["-ac", "1", "-ar", "44100", "-b:a", "96k"]
        if inline:
            raw = subprocess.run(cmd + ["-f", "mp3", "-"],
                                 capture_output=True, check=True).stdout
            total += len(raw)
            out[e["key"]] = "data:audio/mpeg;base64," + base64.b64encode(raw).decode()
        else:
            rel = "audio/%s.mp3" % e["key"]
            subprocess.run(cmd + [os.path.join(outdir, rel)],
                           capture_output=True, check=True)
            total += os.path.getsize(os.path.join(outdir, rel))
            out[e["key"]] = rel
    print("  %d sound clips, %.1f MB%s" % (len(out), total / 1e6,
                                           " before base64" if inline else ""))
    return out


# --------------------------------------------------------------------------

def esc(s):
    return html.escape(s or "", quote=True)


def fill(tpl, mapping):
    out = tpl
    for k, v in mapping.items():
        out = out.replace("{{%s}}" % k, str(v))
    return out


def heading_html(text):
    return "".join("<span>%s</span>" % esc(p.strip()) for p in text.split("//"))


def cue_label(e):
    """A name for the cue that says what it is, not what its file is called."""
    tail = e["file"].rsplit("-", 1)[0]
    return tail.split("-", 1)[-1].replace("-", " ").replace("_", " ")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    inline = "--inline" in sys.argv
    fragment = "--fragment" in sys.argv
    no_audio = "--no-audio" in sys.argv
    if len(args) != 1:
        sys.exit(__doc__)
    target = os.path.abspath(args[0])
    with open(os.path.join(PACK, "timeline-30-photos.json"), encoding="utf-8") as fh:
        tl = json.load(fh)
    cut, snd, total = tl["shots"], tl["sound"], tl["duration_s"]

    if inline:
        os.makedirs(os.path.dirname(target) or ".", exist_ok=True)
        page_path, outdir = target, os.path.dirname(target) or "."
    else:
        os.makedirs(target, exist_ok=True)
        page_path, outdir = os.path.join(target, "index.html"), target

    photos = sorted({r["photo"] for r in cut})
    src = frames(photos, outdir, inline)
    audio = {} if no_audio else clips(snd, outdir, inline)

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
                         first=rs[0]["sid"], last=rs[-1]["sid"],
                         run=sum(x["dur"] for x in rs)))

    en_words = sum(r["words_en"] for r in cut)
    en_speech = sum(r["speech_en"] for r in cut)
    kn_speech = sum(r["speech_kn"] for r in cut)
    kn_clusters = sum(r["clusters_kn"] for r in cut)
    n_accent = sum(1 for e in snd if e["kind"] == "accent")
    n_bed = sum(1 for e in snd if e["kind"] == "bed")
    n_sil = sum(1 for e in snd if e["kind"] == "silence")

    # The page harvests photoSrc from the DOM at load, so the data URIs in the
    # single-file form are carried once rather than twice.
    data = dict(
        fps=tl["fps"], duration=total, knRate=tl["kannada_seconds_per_cluster"],
        wpmEn=140, minAir=0.25, audioSrc=audio,
        shots=[dict(sid=r["sid"], act=r["act"], dur=r["dur"], role=r["role"],
                    photo=r["photo"], tcIn=r["tc_in"],
                    headEn=r["head_en"], headKn=r["head_kn"],
                    voEn=r["vo_en"], voKn=r["vo_kn"]) for r in cut],
        sound={sid: [dict(key=e["key"], kind=e["kind"], offset=e["offset"],
                          dur=e.get("dur", 0), level=e.get("level"))
                     for e in ev if e["kind"] != "silence"]
               for sid, ev in by_shot.items()})

    strip = ['<a class="seg a%d" href="#%s" style="flex:%.4f" '
             'title="%s &#183; %s &#183; %.0fs"><i></i></a>'
             % (r["act"], r["sid"], r["dur"], r["sid"], esc(r["tc_in"]), r["dur"])
             for r in cut]

    actnav = ['<a class="actchip a%d" href="#%s"><b>%d</b>'
              '<span class="en">%s</span><span class="kn">%s</span>'
              '<em>%s to %s &#183; %.0fs</em></a>'
              % (a["n"], a["first"], a["n"], esc(a["en"]), esc(a["kn"]),
                 esc(a["first"]), esc(a["last"]), a["run"]) for a in acts]

    photo_opts = "".join('<option value="%s">%s</option>' % (esc(p), esc(stem(p)))
                         for p in photos)

    rows, cur_act = [], None
    for r in cut:
        if r["act"] != cur_act:
            cur_act = r["act"]
            a = [x for x in acts if x["n"] == cur_act][0]
            rows.append('<h2 class="actrule a%d"><b>Act %d</b>'
                        '<span class="en">%s</span><span class="kn">%s</span>'
                        '<em>%s to %s &#183; %.0f s</em></h2>'
                        % (a["n"], a["n"], esc(a["en"]), esc(a["kn"]),
                           esc(a["first"]), esc(a["last"]), a["run"]))

        ev = by_shot.get(r["sid"], [])
        chips = []
        for e in ev:
            if e["kind"] == "silence":
                chips.append('<span class="chip sil"><span class="ck">silence '
                             '%.1fs</span><em>%s</em></span>'
                             % (e["dur"], "voice out" if not e.get("voice")
                                else "score out"))
            else:
                playable = e["key"] in audio
                chips.append(
                    '<button type="button" class="chip %s%s" data-cue="%s"%s>'
                    '<span class="ck">%s</span><em>%s &#183; %d dB</em></button>'
                    % (e["kind"], "" if playable else " mute", esc(e["key"]),
                       "" if playable else " disabled", esc(e["kind"]),
                       esc(cue_label(e)), e["level"]))
        has_audio = any(x["key"] in audio for x in ev if x["kind"] != "silence")

        consent = r["consent"]
        rows.append(fill(SHOT, dict(
            act=r["act"], sid=r["sid"], role=r["role"], kid=esc(r["kid"]),
            tcin=esc(r["tc_in"]), dur=r["dur"], alt=esc(r["see"][:120]),
            imgsrc=esc(src[r["photo"]]), photo=esc(r["photo"]),
            hen=heading_html(r["head_en"]), hkn=heading_html(r["head_kn"]),
            see=esc(r["see"]), voen=esc(r["vo_en"]), vokn=esc(r["vo_kn"]),
            we=r["words_en"], se="%.1f" % r["speech_en"], ae="%.1f" % r["air_en"],
            ck="%.0f" % r["clusters_kn"], sk="%.1f" % r["speech_kn"],
            ak="%.1f" % r["air_kn"], chips="".join(chips),
            cls=("ok" if consent.startswith("CLEAR") else
                 "rev" if consent.startswith("REVIEW") else "blk"),
            consent=esc(consent), note=esc(r["note"]), photoopts=photo_opts,
            playshot=('<button type="button" class="playshot" data-shot="%s">'
                      'Play shot</button>' % r["sid"]) if has_audio else "")))

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
        ("N_CLIP", str(len(audio))),
        ("STRIP", "".join(strip)), ("ACTNAV", "".join(actnav)),
        ("ROWS", "".join(rows)),
        ("DATA", json.dumps(data, ensure_ascii=False, separators=(",", ":"))),
    ):
        page = page.replace("@@%s@@" % k, v)
    assert "@@" not in page, "unsubstituted token in the template"
    if not fragment:
        page = SHELL.replace("@@BODY@@", page)

    with open(page_path, "w", encoding="utf-8") as fh:
        fh.write(page)
    print("wrote %s (%.1f MB%s)"
          % (page_path, os.path.getsize(page_path) / 1e6,
             ", self-contained" if inline else ", plus img/ and audio/ beside it"))


# --------------------------------------------------------------------------

SHOT = r"""<article class="shot a{{act}}" id="{{sid}}" data-sid="{{sid}}">
  <div class="framewrap">
    <div class="frame r-{{role}}">
      <img src="{{imgsrc}}" data-photo="{{photo}}" alt="{{alt}}" loading="lazy"
           width="1280" height="720">
      <div class="scrim"></div>
      <div class="head en">{{hen}}</div>
      <div class="head kn">{{hkn}}</div>
      <div class="tcburn">{{tcin}}</div>
    </div>
    <p class="inframe"><b>In frame</b> {{see}}</p>
    <div class="editrow">
      <label>Photograph<select class="photopick">{{photoopts}}</select></label>
      <label>Or a file from this machine
        <input type="file" class="photofile" accept="image/*"></label>
    </div>
  </div>
  <div class="meta">
    <div class="metatop">
      <span class="sid">{{sid}}</span>
      <span class="tc">{{tcin}}</span>
      <span class="dur"><span class="durtext">{{dur}}</span>s</span>
      <label class="duredit">Duration
        <input type="number" class="durinput" min="3" max="30" step="0.5"
               value="{{dur}}"></label>
      <span class="role">{{role}}</span>
      <span class="kid">EDL {{kid}}</span>
      <span class="flag"></span>
    </div>
    <p class="vo en" data-field="voEn">{{voen}}</p>
    <p class="vo kn" data-field="voKn">{{vokn}}</p>
    <p class="fit">
      <span class="en">{{we}} words &#183; {{se}}s spoken &#183; <b class="air">{{ae}}s</b> held</span>
      <span class="kn">{{ck}} clusters &#183; {{sk}}s spoken &#183; <b class="air">{{ak}}s</b> held</span>
    </p>
    <div class="sound">{{playshot}}<div class="chips">{{chips}}</div></div>
    <p class="consent {{cls}}"><b>Consent</b> {{consent}}</p>
    <p class="direction"><b>Direction</b> {{note}}</p>
    <div class="review">
      <div class="status" role="group" aria-label="Review status">
        <button type="button" data-status="ok">Approve</button>
        <button type="button" data-status="change">Needs a change</button>
        <button type="button" data-status="reject">Replace</button>
      </div>
      <textarea class="notes" rows="2"
                placeholder="Note for the creative team"></textarea>
    </div>
  </div>
</article>"""


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
.vitals b{color:var(--muted); font-weight:400; min-width:112px}
.vitals span{color:var(--ink); font-weight:500}

/* --------------------------------------------------------------- controls */
.bar{position:sticky; top:0; z-index:20; background:var(--raised);
     border-bottom:1px solid var(--rule)}
.barin{display:flex; align-items:center; gap:12px; flex-wrap:wrap;
       max-width:var(--max); margin:0 auto; padding:10px 24px}
.toggle{display:inline-flex; border:1px solid var(--rule2); border-radius:2px;
        overflow:hidden; background:var(--paper)}
.toggle button{appearance:none; border:0; background:transparent; cursor:pointer;
  padding:7px 14px; font:600 12px/1 "IBM Plex Sans",sans-serif;
  letter-spacing:.09em; text-transform:uppercase; color:var(--muted)}
.toggle button + button{border-left:1px solid var(--rule2)}
.toggle button[aria-pressed="true"]{background:var(--laterite); color:#fff}
.toggle.lang button:last-child{font-family:"Noto Sans Kannada",sans-serif;
  text-transform:none; letter-spacing:0; font-size:13px}
.btn{appearance:none; cursor:pointer; border:1px solid var(--rule2);
  background:var(--paper); color:var(--ink); border-radius:2px; padding:7px 13px;
  font:600 12px/1 "IBM Plex Sans",sans-serif; letter-spacing:.07em;
  text-transform:uppercase}
.btn:hover{border-color:var(--laterite); color:var(--laterite)}
.btn[aria-pressed="true"]{background:var(--laterite); border-color:var(--laterite);
  color:#fff}
.btn.ghost{border-style:dashed}
.barnote{font:400 11.5px/1.4 "IBM Plex Mono",monospace; color:var(--muted);
  flex:1 1 160px; min-width:140px; margin:0}
.count{font:500 11px/1 "IBM Plex Mono",monospace; color:var(--laterite);
  border:1px solid var(--laterite); border-radius:999px; padding:5px 10px}
.count[hidden]{display:none}

/* filmstrip: one segment per shot, width proportional to its duration */
.strip{display:flex; gap:2px; height:22px; flex:1 1 240px; align-items:stretch;
  min-width:200px}
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
      gap:26px 30px; padding:26px 0 26px 14px; margin-left:-14px;
      border-top:1px solid var(--rule); scroll-margin-top:78px;
      border-left:3px solid transparent}
.shot:first-of-type{border-top:0}
.shot.s-ok{border-left-color:var(--neem)}
.shot.s-change{border-left-color:var(--a6)}
.shot.s-reject{border-left-color:var(--clay)}

/* the frame: photograph behind, heading in front. this is the cut's one rule */
.frame{position:relative; aspect-ratio:16/9; overflow:hidden;
       background:#0d0b09; box-shadow:var(--shadow)}
.frame img{display:block; width:100%; height:100%; object-fit:cover}
.scrim{position:absolute; inset:0; pointer-events:none;
  background:linear-gradient(to top, rgba(8,6,5,.86) 0%, rgba(8,6,5,.62) 26%,
             rgba(8,6,5,.12) 54%, rgba(8,6,5,0) 74%)}
.head{position:absolute; left:6.5%; right:6.5%; bottom:7.5%; color:#fff;
      display:flex; flex-direction:column; gap:.28em;
      text-shadow:0 1px 14px rgba(0,0,0,.5)}
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
.r-partners .head span + span{font-size:clamp(11px,1.5cqw,14.5px);
  font-weight:500; color:#fff}
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
.metatop .sid{font-family:"Playfair Display",serif; font-weight:900;
  font-size:23px; color:var(--ink); line-height:1}
.metatop .tc,.metatop .dur{font:500 12px/1 "IBM Plex Mono",monospace;
  color:var(--laterite); font-variant-numeric:tabular-nums}
.metatop .dur{color:var(--muted)}
.metatop .role,.metatop .kid{font:400 10px/1 "IBM Plex Mono",monospace;
  letter-spacing:.1em; text-transform:uppercase; color:var(--muted);
  border:1px solid var(--rule2); padding:4px 7px; border-radius:2px}
.metatop .kid{margin-left:auto}
.flag{font:600 10px/1 "IBM Plex Sans",sans-serif; letter-spacing:.1em;
  text-transform:uppercase; padding:4px 8px; border-radius:2px; color:#fff}
.flag:empty{display:none}
.s-ok .flag{background:var(--neem)} .s-change .flag{background:var(--a6)}
.s-reject .flag{background:var(--clay)}

.vo{margin:0; font-size:16.5px; line-height:1.55; color:var(--ink);
  max-width:58ch; border-left:3px solid var(--laterite-soft); padding-left:15px}
.vo.kn{font-size:16px; line-height:1.75}
.fit{margin:0; font:400 11.5px/1.5 "IBM Plex Mono",monospace; color:var(--muted);
  font-variant-numeric:tabular-nums}
.fit b{font-weight:500; color:var(--muted)}
.fit b.over{color:var(--clay); font-weight:600}

/* ------------------------------------------------------------------ sound */
.sound{display:flex; flex-wrap:wrap; gap:8px; align-items:flex-start}
.playshot{appearance:none; cursor:pointer; border:1px solid var(--laterite);
  background:transparent; color:var(--laterite); border-radius:2px;
  padding:6px 11px; font:600 10px/1.25 "IBM Plex Sans",sans-serif;
  letter-spacing:.1em; text-transform:uppercase; align-self:stretch}
.playshot::before{content:"\25B8\00a0"}
.playshot:hover,.playshot[data-playing="1"]{background:var(--laterite); color:#fff}
.chips{display:flex; flex-wrap:wrap; gap:6px; flex:1 1 auto}
.chip{display:inline-flex; flex-direction:column; gap:2px; padding:5px 9px;
  border-radius:2px; font:600 10px/1.25 "IBM Plex Sans",sans-serif;
  letter-spacing:.1em; text-transform:uppercase; text-align:left;
  background:var(--raised); border:1px solid var(--rule2); color:var(--muted)}
button.chip{appearance:none; cursor:pointer; font-family:"IBM Plex Sans",sans-serif}
button.chip:hover{border-color:var(--laterite); color:var(--laterite)}
button.chip[data-playing="1"]{background:var(--laterite);
  border-color:var(--laterite); color:#fff}
button.chip[data-playing="1"] em{color:rgba(255,255,255,.85)}
.chip em{font:400 10.5px/1.3 "IBM Plex Mono",monospace; font-style:normal;
  letter-spacing:0; text-transform:none; color:var(--body)}
.chip.accent{border-color:var(--laterite); color:var(--laterite)}
.chip.bed{border-style:dashed}
.chip.sil{border-color:var(--slate); color:var(--slate); background:transparent}
.chip.mute{opacity:.55; cursor:not-allowed}
button.chip .ck::before{content:"\25B8\00a0"}
.chip.mute .ck::before{content:none}

.consent,.direction{margin:0; font-size:12.5px; line-height:1.55; color:var(--muted)}
.consent b,.direction b{display:inline-block; font-size:10px; letter-spacing:.13em;
  text-transform:uppercase; margin-right:7px; font-weight:600}
.consent.blk b{color:var(--clay)} .consent.ok b{color:var(--neem)}
.consent.rev b{color:var(--a6)} .direction b{color:var(--ink)}

/* ----------------------------------------------------------- review layer */
.review{display:none; flex-direction:column; gap:9px; padding-top:12px;
  border-top:1px dashed var(--rule2)}
.status{display:inline-flex; gap:6px; flex-wrap:wrap}
.status button{appearance:none; cursor:pointer; border:1px solid var(--rule2);
  background:transparent; color:var(--muted); border-radius:2px; padding:6px 11px;
  font:600 10px/1 "IBM Plex Sans",sans-serif; letter-spacing:.1em;
  text-transform:uppercase}
.status button:hover{border-color:var(--laterite); color:var(--laterite)}
.status button[aria-pressed="true"][data-status="ok"]{background:var(--neem);
  border-color:var(--neem); color:#fff}
.status button[aria-pressed="true"][data-status="change"]{background:var(--a6);
  border-color:var(--a6); color:#fff}
.status button[aria-pressed="true"][data-status="reject"]{background:var(--clay);
  border-color:var(--clay); color:#fff}
.notes{width:100%; resize:vertical; border:1px dashed var(--rule2);
  background:var(--raised); color:var(--ink); border-radius:2px; padding:8px 10px;
  font:400 13px/1.5 "IBM Plex Sans",sans-serif}
.editrow{display:none; gap:12px; flex-wrap:wrap; margin-top:10px}
.editrow label{display:flex; flex-direction:column; gap:4px; flex:1 1 170px;
  font:600 9.5px/1 "IBM Plex Sans",sans-serif; letter-spacing:.11em;
  text-transform:uppercase; color:var(--muted)}
.editrow select,.editrow input,.duredit input{border:1px solid var(--rule2);
  background:var(--raised); color:var(--ink); border-radius:2px; padding:6px 8px;
  font:400 12px/1.3 "IBM Plex Mono",monospace; max-width:100%}
.duredit{display:none; flex-direction:column; gap:3px;
  font:600 9px/1 "IBM Plex Sans",sans-serif; letter-spacing:.11em;
  text-transform:uppercase; color:var(--muted)}
.duredit input{width:74px}
body.editing .review{display:flex}
body.editing .editrow{display:flex}
body.editing .duredit{display:flex}
body.editing .metatop .dur{display:none}
body.editing [contenteditable]{outline:1px dashed var(--rule2); outline-offset:4px;
  border-radius:2px}
body.editing [contenteditable]:focus{outline:2px solid var(--laterite)}
body.editing .head [contenteditable]{outline-color:rgba(255,255,255,.5)}
body.editing .head [contenteditable]:focus{background:rgba(8,6,5,.55)}
.metatop.edited .sid::after,.framewrap.edited .inframe b::after{
  content:"edited"; margin-left:8px; font:600 8px/1 "IBM Plex Sans",sans-serif;
  letter-spacing:.1em; text-transform:uppercase; color:#fff;
  background:var(--laterite); padding:3px 5px; border-radius:2px;
  vertical-align:middle}

dialog{border:1px solid var(--rule2); border-radius:3px; background:var(--raised);
  color:var(--body); padding:0; max-width:min(680px,92vw); box-shadow:var(--shadow)}
dialog::backdrop{background:rgba(10,8,6,.55)}
dialog .dlg{padding:22px 24px 24px; display:flex; flex-direction:column; gap:13px}
dialog h3{margin:0; font-family:"Playfair Display",serif; font-weight:700;
  font-size:22px; color:var(--ink)}
dialog p{margin:0; font-size:13.5px; line-height:1.6; color:var(--muted)}
dialog textarea{width:100%; height:240px; resize:vertical;
  border:1px solid var(--rule2); background:var(--paper); color:var(--ink);
  border-radius:2px; padding:10px;
  font:400 12px/1.55 "IBM Plex Mono",monospace}
dialog .dlgrow{display:flex; gap:9px; flex-wrap:wrap; align-items:center}

footer{border-top:1px solid var(--rule); background:var(--raised);
  padding:34px 24px 46px}
footer .wrap{display:flex; flex-wrap:wrap; gap:26px 50px}
footer p{margin:0; max-width:46ch; font-size:13px; line-height:1.65;
  color:var(--muted)}
footer p > b:first-child{color:var(--ink); display:block; font-size:10px;
  letter-spacing:.13em; text-transform:uppercase; margin-bottom:7px}
footer strong{color:var(--ink); font-weight:600}

body:not(.lang-kn) .kn{display:none}
body.lang-kn .en{display:none}

@media (max-width:860px){
  .shot{grid-template-columns:1fr; gap:18px}
  .vitals{margin-left:0; grid-template-columns:1fr}
  .strip{order:3; flex-basis:100%}
  .metatop .kid{margin-left:0}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}

/* ------------------------------------------------------------------ print */
@media print{
  @page{size:A4 landscape; margin:12mm}
  :root{--paper:#fff; --raised:#fff; --ink:#000; --body:#2b2520; --muted:#5d554c;
        --rule:#ccc; --rule2:#bbb}
  body{background:#fff; font-size:10.5pt}
  .bar,.actindex,.editrow,.duredit,.playshot,.chip.mute,footer,dialog,
  .status button:not([aria-pressed="true"]){display:none!important}
  header{border:0}
  .mast{padding:0 0 12pt; gap:10pt 24pt}
  h1{font-size:26pt}
  .vitals div{font-size:8.5pt}
  main{padding:0}
  .actrule{margin:0 0 10pt; break-after:avoid; page-break-after:avoid}
  .shot{break-inside:avoid; page-break-inside:avoid; padding:10pt 0 10pt 8pt;
        margin-left:0; grid-template-columns:1.15fr 1fr; gap:14pt}
  .frame{box-shadow:none; border:1px solid #ddd}
  .notes:placeholder-shown{display:none}
  .notes{border:1px solid #bbb; background:#fafafa}
  .review{display:flex; border-top:1px solid #ddd}
  .review:not(:has(.notes:not(:placeholder-shown))):not(:has([aria-pressed="true"])){
    display:none}
  .frame,.scrim,.head,.flag,.status button,.shot{-webkit-print-color-adjust:exact;
    print-color-adjust:exact}
  a[href^="#"]{text-decoration:none}
}
</style>

<header>
  <div class="mast">
    <div>
      <p class="eyebrow">Law Park Educational Trust &#183; Anniversary film &#183; Cut 2</p>
      <h1>Ten Years,<br>Thirty Frames<em>Thirty photographs. Thirty headings.
        One timeline, two languages.</em></h1>
    </div>
    <div class="vitals">
      <div><b>Master</b><span>1920&#215;1080 &#183; @@FPS@@ fps</span></div>
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
    <div class="toggle lang" role="group" aria-label="Narration language">
      <button type="button" id="bEn" aria-pressed="true">English</button>
      <button type="button" id="bKn" aria-pressed="false" lang="kn">&#3221;&#3240;&#3277;&#3240;&#3233;</button>
    </div>
    <div class="toggle" role="group" aria-label="Monitoring level">
      <button type="button" id="bSolo" aria-pressed="true">Solo</button>
      <button type="button" id="bMix" aria-pressed="false">In mix</button>
    </div>
    <button type="button" class="btn" id="bEdit" aria-pressed="false">Mark up</button>
    <span class="count" id="nEdits" hidden>0</span>
    <button type="button" class="btn ghost" id="bExport">Export review</button>
    <button type="button" class="btn ghost" id="bPrint">Save as PDF</button>
    <p class="barnote" id="barnote">@@N_CLIP@@ cues ready. Click a cue to hear it as placed.</p>
    <nav class="strip" aria-label="Jump to shot">@@STRIP@@</nav>
  </div>
</div>

<nav class="actindex" aria-label="Acts">@@ACTNAV@@</nav>

<main class="wrap">@@ROWS@@</main>

<dialog id="dlg"><form method="dialog" class="dlg">
  <h3>Review export</h3>
  <p id="dlgnote"></p>
  <textarea id="dlgtext" readonly spellcheck="false"></textarea>
  <div class="dlgrow">
    <button type="button" class="btn" id="dlgCopy">Copy to clipboard</button>
    <button type="button" class="btn ghost" id="dlgSave">Download review.json</button>
    <button type="submit" class="btn ghost">Close</button>
    <span class="barnote" id="dlgmsg"></span>
  </div>
</form></dialog>

<footer>
  <div class="wrap">
    <p><b>What this is</b>Every shot is a full-bleed photograph with the heading
      composited over it. No graphics cards, no plates. The frames are the real
      16:9 crops of the enhanced stills, with the headings set as the film will
      set them.</p>
    <p><b>Listening</b>Each cue is pre-trimmed to its own window and carries its
      own fades, so what you hear is the placement, not the source file. Beds are
      cut to 15 s, enough to judge one. <strong>Solo</strong> plays every cue at
      full level; <strong>In mix</strong> drops each to its written level so the
      balance between cues is audible. Neither is the final mix: levels are set
      against the narration, and there is no narration yet.</p>
    <p><b>Marking up</b>Mark up makes the headings, the narration and the
      durations editable, lets a shot point at a different photograph, and gives
      every shot a status and a note. Edits stay in this browser. Export review
      writes a review.json that <strong>tools/apply_review.py</strong> puts back
      into <strong>shots.py</strong>, so the cut keeps one source of truth.</p>
    <p><b>Pace</b>English is written to 140&nbsp;wpm. Kannada is measured in
      display clusters at @@RATE@@&nbsp;s per cluster, a constant measured off the
      approved Kannada cut. Edit a line and the held time recalculates with the
      same model build.py uses, and turns red when the read no longer fits the
      shot.</p>
  </div>
</footer>

<script>window.CUT = @@DATA@@;</script>
<script>
(function () {
  "use strict";
  var CUT = window.CUT, KEY = "lpet-cut2", body = document.body;

  // Harvest each photograph's image source from the DOM rather than carrying a
  // second copy in the data blob. In the single-file build those are data URIs.
  var photoSrc = {};
  document.querySelectorAll(".frame img[data-photo]").forEach(function (im) {
    photoSrc[im.getAttribute("data-photo")] = im.getAttribute("src");
  });

  // ---------------------------------------------------------------- storage
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY + "-review") || "{}"); }
  catch (e) { state = {}; }
  function save() {
    try { localStorage.setItem(KEY + "-review", JSON.stringify(state)); }
    catch (e) { note("Edits cannot be saved in this browser. Export before closing."); }
    countEdits();
  }
  function shotState(sid) { return state[sid] || (state[sid] = {}); }
  function note(msg) { document.getElementById("barnote").textContent = msg; }
  function baseline(sid) {
    return CUT.shots.filter(function (s) { return s.sid === sid; })[0];
  }
  function shotEl(sid) {
    return document.querySelector('.shot[data-sid="' + sid + '"]');
  }

  // ------------------------------------------------------------ measurement
  // The same two models build.py uses, so the page and the build agree.
  var VIRAMA = 0x0CCD, PUNCT = /\p{P}/u;
  function clusters(t) {
    var n = 0, prevVirama = false;
    for (var ch of t) {
      var cp = ch.codePointAt(0);
      if (/\s/.test(ch)) { prevVirama = false; continue; }
      if (ch >= "0" && ch <= "9") { n += 3.25; prevVirama = false; continue; }
      var mark = (cp >= 0x0CBC && cp <= 0x0CCD) || cp === 0x0C82 ||
                 cp === 0x0C83 || cp === 0x0CD5 || cp === 0x0CD6 ||
                 cp === 0x200C || cp === 0x200D;
      if (mark) { prevVirama = (cp === VIRAMA); continue; }
      if (prevVirama) { prevVirama = false; continue; }
      if (PUNCT.test(ch)) continue;
      n += 1; prevVirama = false;
    }
    return n;
  }
  function words(t) { return t.trim() ? t.trim().split(/\s+/).length : 0; }

  // ------------------------------------------------------------------ audio
  var players = {}, timers = [], mode = "solo", cueIndex = {};
  Object.keys(CUT.sound).forEach(function (sid) {
    CUT.sound[sid].forEach(function (c) { cueIndex[c.key] = c; });
  });
  var levels = Object.keys(cueIndex)
    .map(function (k) { return cueIndex[k].level; })
    .filter(function (v) { return v != null; });
  var loudest = levels.length ? Math.max.apply(null, levels) : -12;

  function volumeFor(cue) {
    if (mode === "solo" || cue.level == null) return 1;
    // Relative to the loudest cue in the film, so what changes is the balance.
    return Math.max(0.05, Math.pow(10, (cue.level - loudest) / 20));
  }
  function player(key) {
    if (!players[key]) {
      var src = CUT.audioSrc[key];
      if (!src) return null;
      players[key] = new Audio(src);
    }
    return players[key];
  }
  function stopAll() {
    timers.forEach(clearTimeout);
    timers = [];
    Object.keys(players).forEach(function (k) {
      var a = players[k];
      if (!a.paused) { a.pause(); a.currentTime = 0; }
    });
    document.querySelectorAll('[data-playing="1"]').forEach(function (el) {
      el.removeAttribute("data-playing");
    });
  }
  function playCue(key, btn) {
    var a = player(key), cue = cueIndex[key];
    if (!a || !cue) return;
    a.currentTime = 0;
    a.volume = volumeFor(cue);
    a.play().catch(function () { note("The browser blocked playback. Click again."); });
    if (btn) {
      btn.setAttribute("data-playing", "1");
      a.onended = function () { btn.removeAttribute("data-playing"); };
    }
  }
  function playShot(sid, btn) {
    stopAll();
    var cues = (CUT.sound[sid] || []).filter(function (c) {
      return CUT.audioSrc[c.key];
    });
    if (!cues.length) return;
    if (btn) btn.setAttribute("data-playing", "1");
    var last = 0;
    cues.forEach(function (c) {
      var at = Math.max(0, c.offset) * 1000;
      last = Math.max(last, at + (c.dur || 2) * 1000);
      timers.push(setTimeout(function () {
        playCue(c.key, shotEl(sid).querySelector('.chip[data-cue="' + c.key + '"]'));
      }, at));
    });
    timers.push(setTimeout(function () {
      if (btn) btn.removeAttribute("data-playing");
    }, last + 200));
  }

  document.addEventListener("click", function (ev) {
    var chip = ev.target.closest("button.chip[data-cue]");
    if (chip && !chip.disabled) {
      var playingNow = chip.getAttribute("data-playing") === "1";
      stopAll();
      if (!playingNow) playCue(chip.getAttribute("data-cue"), chip);
      return;
    }
    var ps = ev.target.closest(".playshot");
    if (ps) {
      var was = ps.getAttribute("data-playing") === "1";
      stopAll();
      if (!was) playShot(ps.getAttribute("data-shot"), ps);
    }
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") stopAll();
  });

  // ------------------------------------------------------------------- shot
  function readHead(el, lang) {
    return Array.prototype.map.call(
      el.querySelectorAll(".head." + lang + " span"),
      function (s) { return s.textContent.trim(); }).join(" // ");
  }

  function refresh(sid) {
    var el = shotEl(sid), base = baseline(sid), st = state[sid] || {};
    var dur = st.dur != null ? st.dur : base.dur;
    var voEn = st.voEn != null ? st.voEn : base.voEn;
    var voKn = st.voKn != null ? st.voKn : base.voKn;
    var se = words(voEn) * 60 / CUT.wpmEn, sk = clusters(voKn) * CUT.knRate;
    var ae = dur - se, ak = dur - sk;
    var fit = el.querySelector(".fit");

    fit.querySelector(".en").innerHTML =
      words(voEn) + " words · " + se.toFixed(1) + "s spoken · " +
      '<b class="air' + (ae < CUT.minAir ? " over" : "") + '">' +
      ae.toFixed(1) + "s</b> held";
    fit.querySelector(".kn").innerHTML =
      clusters(voKn).toFixed(0) + " clusters · " + sk.toFixed(1) +
      "s spoken · " + '<b class="air' + (ak < CUT.minAir ? " over" : "") +
      '">' + ak.toFixed(1) + "s</b> held";

    el.querySelector(".durtext").textContent = dur;
    el.classList.remove("s-ok", "s-change", "s-reject");
    var flag = el.querySelector(".flag");
    flag.textContent = "";
    if (st.status) {
      el.classList.add("s-" + st.status);
      flag.textContent = {ok: "Approved", change: "Change",
                          reject: "Replace"}[st.status];
    }
    el.querySelectorAll(".status button").forEach(function (b) {
      b.setAttribute("aria-pressed",
        String(b.getAttribute("data-status") === st.status));
    });
    var textChanged = ["voEn", "voKn", "headEn", "headKn", "dur"].some(
      function (k) { return st[k] != null && st[k] !== base[k]; });
    el.querySelector(".metatop").classList.toggle("edited", textChanged);
    el.querySelector(".framewrap").classList.toggle(
      "edited", (st.photo != null && st.photo !== base.photo) || !!st.photoFile);
  }

  CUT.shots.forEach(function (base) {
    var el = shotEl(base.sid);

    el.querySelectorAll(".vo, .head span").forEach(function (n) {
      n.addEventListener("input", function () {
        var st = shotState(base.sid);
        if (n.classList.contains("vo")) {
          st[n.getAttribute("data-field")] = n.textContent.trim();
        } else {
          var kn = n.closest(".head").classList.contains("kn");
          st[kn ? "headKn" : "headEn"] = readHead(el, kn ? "kn" : "en");
        }
        refresh(base.sid);
        save();
      });
    });
    el.querySelector(".durinput").addEventListener("change", function (e) {
      shotState(base.sid).dur = parseFloat(e.target.value);
      refresh(base.sid);
      save();
    });
    el.querySelector(".photopick").addEventListener("change", function (e) {
      var st = shotState(base.sid);
      st.photo = e.target.value;
      delete st.photoFile;
      if (photoSrc[st.photo]) el.querySelector(".frame img").src = photoSrc[st.photo];
      refresh(base.sid);
      save();
    });
    el.querySelector(".photofile").addEventListener("change", function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      // The file stays on this machine. What is recorded is the choice, so the
      // creative team knows which file to put into the photo pack.
      shotState(base.sid).photoFile = f.name;
      el.querySelector(".frame img").src = URL.createObjectURL(f);
      refresh(base.sid);
      save();
      note("Recorded " + f.name + " for " + base.sid +
           ". Add the file to the photo pack: it is not stored in this page.");
    });
    el.querySelectorAll(".status button").forEach(function (b) {
      b.addEventListener("click", function () {
        var st = shotState(base.sid), v = b.getAttribute("data-status");
        if (st.status === v) { delete st.status; } else { st.status = v; }
        refresh(base.sid);
        save();
      });
    });
    el.querySelector(".notes").addEventListener("input", function (e) {
      shotState(base.sid).notes = e.target.value;
      save();
    });
  });

  function applySaved() {
    CUT.shots.forEach(function (base) {
      var st = state[base.sid], el = shotEl(base.sid);
      if (st) {
        if (st.voEn != null) el.querySelector(".vo.en").textContent = st.voEn;
        if (st.voKn != null) el.querySelector(".vo.kn").textContent = st.voKn;
        [["headEn", "en"], ["headKn", "kn"]].forEach(function (pair) {
          if (st[pair[0]] == null) return;
          var spans = el.querySelectorAll(".head." + pair[1] + " span");
          st[pair[0]].split("//").forEach(function (t, i) {
            if (spans[i]) spans[i].textContent = t.trim();
          });
        });
        if (st.dur != null) el.querySelector(".durinput").value = st.dur;
        if (st.photo != null) {
          el.querySelector(".photopick").value = st.photo;
          if (photoSrc[st.photo]) el.querySelector(".frame img").src = photoSrc[st.photo];
        }
        if (st.notes) el.querySelector(".notes").value = st.notes;
      }
      el.querySelector(".photopick").value =
        (st && st.photo != null) ? st.photo : base.photo;
      refresh(base.sid);
    });
  }

  function setEditable(on) {
    document.querySelectorAll(".vo, .head span").forEach(function (n) {
      if (on) { n.setAttribute("contenteditable", "true"); }
      else { n.removeAttribute("contenteditable"); }
    });
  }

  function countEdits() {
    var n = 0;
    Object.keys(state).forEach(function (sid) {
      var st = state[sid] || {};
      if (Object.keys(st).some(function (k) {
            return st[k] != null && st[k] !== ""; })) n++;
    });
    var el = document.getElementById("nEdits");
    el.textContent = n + (n === 1 ? " shot marked" : " shots marked");
    el.hidden = n === 0;
    return n;
  }

  // ----------------------------------------------------------------- export
  function review() {
    var out = {film: "Law Park Educational Trust, 30-photo cut",
               generated: new Date().toISOString(), shots: []};
    CUT.shots.forEach(function (base) {
      var st = state[base.sid] || {}, rec = {sid: base.sid}, any = false;
      ["headEn", "headKn", "voEn", "voKn", "dur", "photo"].forEach(function (k) {
        if (st[k] != null && st[k] !== base[k]) {
          rec[k] = {from: base[k], to: st[k]};
          any = true;
        }
      });
      if (st.photoFile) { rec.photoFile = st.photoFile; any = true; }
      if (st.status) { rec.status = st.status; any = true; }
      if (st.notes) { rec.notes = st.notes; any = true; }
      if (any) out.shots.push(rec);
    });
    return out;
  }

  var dlg = document.getElementById("dlg");
  document.getElementById("bExport").addEventListener("click", function () {
    var r = review();
    document.getElementById("dlgtext").value = JSON.stringify(r, null, 2);
    document.getElementById("dlgnote").textContent = r.shots.length
      ? r.shots.length + " shot(s) marked. Save this as review.json beside the " +
        "pack, then run python3 tools/apply_review.py review.json and " +
        "python3 tools/build.py."
      : "Nothing marked yet. Turn on Mark up, then edit a heading, a line, a " +
        "duration or a photograph, or set a status.";
    document.getElementById("dlgmsg").textContent = "";
    if (typeof dlg.showModal === "function") dlg.showModal();
  });
  document.getElementById("dlgCopy").addEventListener("click", function () {
    var t = document.getElementById("dlgtext"), msg = document.getElementById("dlgmsg");
    t.select();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(t.value).then(
        function () { msg.textContent = "Copied."; },
        function () { msg.textContent = "Select the text and copy it."; });
    } else {
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      msg.textContent = ok ? "Copied." : "Select the text and copy it.";
    }
  });
  // Opened from disk, an anchor downloads the file. Opened as a published
  // artifact, the sandbox blocks that and the host mediates the save instead.
  // Resolve the host's downloads namespace if there is one, and use whichever
  // this view actually has.
  var hostSave = null;
  if (window.claude && typeof window.claude.use === "function") {
    window.claude.use("downloads").then(function (d) { hostSave = d; },
                                        function () { hostSave = null; });
  }
  document.getElementById("dlgSave").addEventListener("click", function () {
    var text = document.getElementById("dlgtext").value;
    var msg = document.getElementById("dlgmsg");
    if (hostSave) {
      msg.textContent = "Waiting for you to confirm the save.";
      hostSave.save({filename: "review.json", data: text}).then(function () {
        msg.textContent = "Saved.";
      }, function (err) {
        msg.textContent = (err && err.code === "declined")
          ? "Save cancelled." : "Could not save here. Copy the text instead.";
      });
      return;
    }
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], {type: "application/json"}));
    a.download = "review.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    msg.textContent = "Saved to your downloads. If nothing arrived, copy the text instead.";
  });
  document.getElementById("bPrint").addEventListener("click", function () {
    stopAll();
    window.print();
  });

  // --------------------------------------------------------------- controls
  var bEn = document.getElementById("bEn"), bKn = document.getElementById("bKn");
  function setLang(lang) {
    body.classList.toggle("lang-kn", lang === "kn");
    bEn.setAttribute("aria-pressed", String(lang !== "kn"));
    bKn.setAttribute("aria-pressed", String(lang === "kn"));
    try { localStorage.setItem(KEY + "-lang", lang); } catch (e) {}
  }
  bEn.addEventListener("click", function () { setLang("en"); });
  bKn.addEventListener("click", function () { setLang("kn"); });

  var bSolo = document.getElementById("bSolo"), bMix = document.getElementById("bMix");
  function setMode(m) {
    mode = m;
    bSolo.setAttribute("aria-pressed", String(m === "solo"));
    bMix.setAttribute("aria-pressed", String(m === "mix"));
    note(m === "solo"
      ? "Solo: every cue at full level, so you can hear what it is."
      : "In mix: each cue at its written level, so you can hear the balance.");
  }
  bSolo.addEventListener("click", function () { setMode("solo"); });
  bMix.addEventListener("click", function () { setMode("mix"); });

  var bEdit = document.getElementById("bEdit");
  bEdit.addEventListener("click", function () {
    var on = !body.classList.contains("editing");
    body.classList.toggle("editing", on);
    bEdit.setAttribute("aria-pressed", String(on));
    bEdit.textContent = on ? "Done" : "Mark up";
    setEditable(on);
    note(on
      ? "Headings, narration and durations are editable. Edits stay in this browser."
      : "@@N_CLIP@@ cues ready. Click a cue to hear it as placed.");
  });

  try {
    if (localStorage.getItem(KEY + "-lang") === "kn") setLang("kn");
  } catch (e) {}
  applySaved();
  countEdits();
})();
</script>
"""

if __name__ == "__main__":
    main()
