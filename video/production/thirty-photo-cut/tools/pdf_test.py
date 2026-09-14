#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Drives a realistic markup session against the review page, then prints it and
checks the PDF is actually the document it claims to be.

  python3 pdf_test.py [url] [outdir]

Checks, in order:
  1. the markup lands on the page and the timing recalculates
  2. print emulation hides what it should and shows what it should
  3. the PDF has the right page geometry and page count
  4. no shot is split across a page boundary
  5. the edited text, the statuses and the notes reach the PDF
  6. the frames reach the PDF as images, not as gaps
"""
import json, os, subprocess, sys

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8788/"
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.dirname(os.path.abspath(__file__))

# A review a trustee might plausibly leave: a rewrite that fits, a rewrite that
# does not, a swap, a duration change, all three statuses and some notes.
REVIEW = {
    "S03": {"status": "ok",
            "notes": "Best frame in the film. Do not crop it any tighter."},
    "S07": {"voEn": "In 2016 they made their first school visit to Chickaballapur. "
                    "One child. One scholarship, and the first of ten years.",
            "headEn": "2016 · Chickaballapur // Where it started",
            "status": "change",
            "notes": "Trying a longer read here. Check it still breathes before "
                     "the silence."},
    "S12": {"dur": 13.0, "status": "change",
            "notes": "Give the crowd another three seconds, it is the only wide "
                     "shot in the act."},
    "S18": {"voEn": "The Trust covers up to seventy-five per cent of the school fee, "
                    "and not one rupee more than that, because the remaining quarter "
                    "is the part the family carries and protects for itself.",
            "status": "reject",
            "notes": "This overruns. Deliberately left long so the red warning "
                     "shows in the PDF."},
    "S22": {"photo": "2025-children-showing-school-bags-outdoors__K41-enhanced.png",
            "status": "change", "notes": "Swapped with S23. Prefer the field."},
    "S23": {"photo": "2025-hd-kote-300-school-bags-under-tree__K23-enhanced.png"},
    "S26": {"headKn": "ಸಹಯೋಗದಲ್ಲಿ // ನಿಸರ್ಗ ಫೌಂಡೇಶನ್ // ಬೆಳಕು ಟ್ರಸ್ಟ್, ಬಂಗಾರಪೇಟೆ",
            "status": "reject",
            "notes": "Partner list is not cleared yet. Hold this frame."},
    "S30": {"status": "ok", "notes": "Lock it."},
}


def main():
    from playwright.sync_api import sync_playwright
    import fitz

    pdf_path = os.path.join(OUT, "review-print.pdf")
    report = {}

    with sync_playwright() as pw:
        br = pw.chromium.launch()
        pg = br.new_page(viewport={"width": 1440, "height": 1000})
        pg.goto(URL, wait_until="networkidle")

        # seed the review the way the page itself stores it, then reload so the
        # page restores it through its own code path rather than a test-only one
        pg.evaluate("s => localStorage.setItem('lpet-cut2-review', s)",
                    json.dumps(REVIEW))
        pg.goto(URL, wait_until="networkidle")
        pg.click("#bEdit")

        # 1 -------------------------------------------------- markup landed
        report["screen"] = pg.evaluate("""() => {
          const q = s => document.querySelector(s);
          const txt = s => (q(s) ? q(s).textContent.trim() : null);
          return {
            counter: txt('#nEdits'),
            s07vo: txt('.shot[data-sid="S07"] .vo.en').slice(0, 42),
            s07head: [...document.querySelectorAll('.shot[data-sid="S07"] .head.en span')].map(x => x.textContent),
            s12dur: txt('.shot[data-sid="S12"] .durtext'),
            s18fit: txt('.shot[data-sid="S18"] .fit .en'),
            s18over: !!q('.shot[data-sid="S18"] .fit .en b.over'),
            s22photo: q('.shot[data-sid="S22"] .frame img').getAttribute('src'),
            s23photo: q('.shot[data-sid="S23"] .frame img').getAttribute('src'),
            flags: [...document.querySelectorAll('.flag')].map(f => f.textContent).filter(Boolean),
            notesFilled: [...document.querySelectorAll('.notes')].filter(n => n.value).length,
            duplicates: (() => {
              const seen = {}, d = [];
              document.querySelectorAll('.shot').forEach(s => {
                const p = s.querySelector('.frame img').getAttribute('src');
                if (seen[p]) d.push(seen[p] + '+' + s.dataset.sid); else seen[p] = s.dataset.sid;
              });
              return d;
            })()
          };
        }""")

        # 2 ------------------------------------------- print media emulation
        # On a SECOND page, so the one we print from is never media-emulated:
        # flipping emulation before pdf() changes Chrome's pagination, and a
        # person clicking Save as PDF never does it.
        probe = br.new_page(viewport={"width": 1440, "height": 1000})
        probe.goto(URL, wait_until="networkidle")
        probe.evaluate("s => localStorage.setItem('lpet-cut2-review', s)",
                       json.dumps(REVIEW))
        probe.goto(URL, wait_until="networkidle")
        probe.click("#bEdit")
        probe.emulate_media(media="print")
        report["print_css"] = probe.evaluate("""() => {
          const vis = s => { const e = document.querySelector(s);
            return e ? getComputedStyle(e).display !== 'none' : null; };
          return {
            bar_hidden: vis('.bar') === false,
            actindex_hidden: vis('.actindex') === false,
            footer_hidden: vis('footer') === false,
            editrow_hidden: vis('.editrow') === false,
            playshot_hidden: vis('.playshot') === false,
            tcburn_hidden: vis('.tcburn') === false,
            frames_visible: vis('.frame') === true,
            heading_visible: vis('.head.en') === true,
            vo_visible: vis('.shot .vo.en') === true,
            consent_visible: vis('.consent') === true,
            // a review block with a note or a status must print, one with
            // neither must not
            review_S07: vis('.shot[data-sid="S07"] .review'),
            review_S01: vis('.shot[data-sid="S01"] .review'),
            pressed_status_visible: vis('.shot[data-sid="S07"] .status button[aria-pressed="true"]'),
            unpressed_status_hidden: vis('.shot[data-sid="S07"] .status button[aria-pressed="false"]') === false,
            notes_S07: vis('.shot[data-sid="S07"] .notes'),
            notes_S01: vis('.shot[data-sid="S01"] .notes')
          };
        }""")
        probe.close()

        PDF_OPTS = dict(format="A4", landscape=True, print_background=True,
                        margin={"top": "12mm", "bottom": "12mm",
                                "left": "12mm", "right": "12mm"})
        pg.pdf(path=pdf_path, **PDF_OPTS)

        # and the Kannada cut, which has to embed a Kannada face or the file
        # the creative team opens is a page of boxes
        pg.click("#bKn")
        pg.pdf(path=os.path.join(OUT, "review-print-kn.pdf"), **PDF_OPTS)
        br.close()

    # 3 ------------------------------------------------------ the PDF itself
    doc = fitz.open(pdf_path)
    pages = doc.page_count
    w, h = doc[0].rect.width, doc[0].rect.height
    report["pdf"] = {
        "pages": pages,
        "size_pt": [round(w), round(h)],
        "landscape": w > h,
        "a4": abs(w - 841.89) < 3 and abs(h - 595.28) < 3,
        "bytes": os.path.getsize(pdf_path),
    }

    raw = "\n".join(doc[i].get_text() for i in range(pages))
    # The stylesheet uppercases labels and wraps narration mid-sentence, so
    # compare against text with case and line breaks normalised away.
    text = " ".join(raw.split())
    low = text.lower()

    # 4 ------------------------------- is any shot split across a page break?
    per_page = [doc[i].get_text() for i in range(pages)]
    sids = ["S%02d" % n for n in range(1, 31)]
    where = {}
    for sid in sids:
        hits = [i for i, t in enumerate(per_page) if ("\n%s\n" % sid) in t or t.startswith(sid)]
        where[sid] = hits
    report["shots_in_pdf"] = {
        "found": sum(1 for v in where.values() if v),
        "missing": [k for k, v in where.items() if not v],
        "spanning_pages": {k: v for k, v in where.items() if len(v) > 1},
    }

    # 5 --------------------------------------- did the edits reach the paper?
    report["content"] = {
        "edited_S07_vo": "first of ten years" in low,
        "edited_S07_head": "where it started" in low,
        "edited_S18_vo": "not one rupee more" in low,
        "note_S03": "do not crop it any tighter" in low,
        "note_S18": "red warning" in low,
        "note_S26": "partner list is not cleared" in low,
        "status_approved": low.count("approved"),
        "status_needs_change": low.count("needs a change"),
        "status_replace": low.count("replace"),
        "kannada_absent_in_en_print": "ಸಹಯೋಗದಲ್ಲಿ" not in text,
        "consent_lines": low.count("consent"),
        "direction_lines": low.count("direction"),
        "overrun_shown": "-4.1s held" in low,
        "title": "ten years," in low,
        "controls_absent": ("export review" not in low and "save as pdf" not in low),
        # text-shadow made Chrome draw every heading glyph twice
        "heading_not_doubled": low.count("where it started") == 1,
        "tc_not_doubled": low.count("00:00:57:00") <= 2,
    }

    # 5b ------------------------- does the overrun actually print red, in ink?
    from PIL import Image
    from collections import Counter
    hit = None
    for i in range(pages):
        found = doc[i].search_for("-4.1s")
        if found:
            hit = (i, found[0])
            break
    if hit:
        i, r = hit
        crop = os.path.join(OUT, "_overrun.png")
        doc[i].get_pixmap(dpi=288, clip=fitz.Rect(r.x0 - 3, r.y0 - 3,
                                                  r.x1 + 3, r.y1 + 3)).save(crop)
        px = list(Image.open(crop).convert("RGB").getdata())
        ink = Counter(p for p in px if sum(p) < 600).most_common(1)
        os.remove(crop)
        report["overrun_ink"] = {"page": i + 1, "rgb": list(ink[0][0]) if ink else None,
                                 "is_clay": bool(ink) and abs(ink[0][0][0] - 156) < 12
                                 and abs(ink[0][0][1] - 59) < 12}
    else:
        report["overrun_ink"] = {"page": None, "is_clay": False}

    # 5c ------------------------------------------- the Kannada print, if any
    kn_path = os.path.join(OUT, "review-print-kn.pdf")
    if os.path.exists(kn_path):
        kdoc = fitz.open(kn_path)
        ktext = " ".join(" ".join(kdoc[i].get_text() for i in range(kdoc.page_count)).split())
        fonts = set()
        for i in range(kdoc.page_count):
            for f in kdoc[i].get_fonts(full=True):
                fonts.add(f[3])
        report["kannada_pdf"] = {
            "pages": kdoc.page_count,
            "has_kannada_glyphs": any("\u0c80" <= ch <= "\u0cff" for ch in ktext),
            "sample": next((w for w in ktext.split() if "\u0c80" <= w[0] <= "\u0cff"), None),
            "english_vo_absent": "children walk to a school like this one" not in ktext,
            "fonts": sorted(fonts)[:8],
        }
        kdoc.close()

    # 6 ------------------------------------ are the photographs on the paper?
    imgs = sum(len(doc[i].get_images(full=True)) for i in range(pages))
    report["images"] = {"total": imgs, "per_page": [len(doc[i].get_images(full=True))
                                                    for i in range(pages)]}

    # render a couple of pages so they can actually be looked at
    for n in (0, 1, max(0, pages - 1)):
        pix = doc[n].get_pixmap(dpi=96)
        pix.save(os.path.join(OUT, "pdf-page-%02d.png" % (n + 1)))
    doc.close()

    print(json.dumps(report, indent=2, ensure_ascii=False))
    print("\nPDF: %s" % pdf_path)


if __name__ == "__main__":
    main()
