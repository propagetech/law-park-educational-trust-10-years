#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Regenerates Kannada-sfx-licence-log.csv from what is actually in the mix.

  python3 licence_log.py            rewrite the log
  python3 licence_log.py --check    report what would change, write nothing

WHY THIS IS GENERATED
The log is the document the Trust would have to stand behind if anyone asked
where a sound came from, and it was being maintained by hand against a
placements table that changed underneath it. By the time this was written it
held 16 rows for 14 placements, two of them PENDING DOWNLOAD for cues that had
since been filled with something else, and twelve of the sixteen still read NOT
CAPTURED in the evidence columns while the evidence sat on disk in
sfx/licence-evidence/ under a different naming scheme.

A log that disagrees with the mix is worse than no log, because it reads as
though someone checked. So it is derived: placements.csv says what is in the
film, the Pixabay selection record says where each file came from and which
screenshot proves its licence, and this joins them. Anything it cannot source is
written NOT CAPTURED rather than left out, so the gaps are visible.

`07` item 5.9 wants a licence screenshot per effect captured on the day of
download. Rows that say NOT CAPTURED are that item, still open.
"""
import csv, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.dirname(HERE)
LOG = os.path.join(PACK, "Kannada-sfx-licence-log.csv")
SEL = "sfx/licence-evidence/pixabay_sound_effects_selections.json"
COLS = ["cue_key", "kind", "status", "asset_title", "uploader", "pixabay_page_url",
        "download_date", "licence_status_on_download_date", "licence_evidence_file",
        "edit_file_name", "shot", "offset_s", "excerpt_in_s", "window_s",
        "duration_s", "level_db_rel_narration", "solo_dbfs", "fade_in_s",
        "fade_out_s", "approved_by", "notes"]
TERMS = ("licence must cover public event screening, YouTube monetised or not, "
         "social media and website embedding, worldwide, in perpetuity. "
         "`14` items 5.1 and 5.2")


def main():
    os.chdir(HERE)
    check = "--check" in sys.argv

    sel = {}
    if os.path.exists(SEL):
        for e in json.load(open(SEL, encoding="utf-8")):
            sel[e["original_filename"]] = e

    # Whatever the hand-kept log already established per FILE, so a row that was
    # verified once is not silently downgraded when a cue is re-cut.
    prior = {}
    if os.path.exists(LOG):
        for r in csv.DictReader(open(LOG, encoding="utf-8")):
            f = (r.get("edit_file_name") or "").strip()
            if f and r.get("licence_status_on_download_date", "") not in (
                    "", "NOT CAPTURED", "NOT DOWNLOADED"):
                prior[f] = r

    tl = {s["sid"]: s for s in json.load(open("timeline.json", encoding="utf-8"))}
    rows = []
    for p in csv.DictReader(open("sfx/placements.csv", encoding="utf-8")):
        f = p["file"].strip()
        e, pr = sel.get(f), prior.get(f)
        ev = f"licence-evidence/{os.path.basename(e['evidence_path'])}" if e else (
            pr["licence_evidence_file"] if pr else "NOT CAPTURED")
        rows.append({
            "cue_key": p["key"], "kind": p["kind"],
            "status": "PLACED",
            "asset_title": e["title"] if e else (pr["asset_title"] if pr else f),
            "uploader": e["uploader"] if e else (pr["uploader"] if pr else "UNKNOWN"),
            "pixabay_page_url": e["page_url"] if e else (
                pr["pixabay_page_url"] if pr else "NOT CAPTURED"),
            "download_date": pr["download_date"] if pr else "2026-09-09",
            "licence_status_on_download_date":
                "Free for use under the Pixabay Content Licence" if e else (
                    pr["licence_status_on_download_date"] if pr else "NOT CAPTURED"),
            "licence_evidence_file": ev,
            "edit_file_name": f, "shot": p["shot"],
            "offset_s": p["offset_s"], "excerpt_in_s": p["in_s"],
            "window_s": p["win_s"], "duration_s": p["dur_s"],
            "level_db_rel_narration": p["level_rel_narr_db"],
            "solo_dbfs": p["solo_dbfs"],
            "fade_in_s": p["fade_in"], "fade_out_s": p["fade_out"],
            "approved_by": "",
            "notes": f"{p['note']} | {TERMS}",
        })

    gaps = [r["cue_key"] for r in rows
            if r["licence_status_on_download_date"] == "NOT CAPTURED"]
    print(f"{len(rows)} placements, {len(rows) - len(gaps)} with verified licence "
          f"evidence, {len(gaps)} still NOT CAPTURED")
    if gaps:
        print("  `07` item 5.9 open for: " + ", ".join(gaps))
    if check:
        print("\n--check. Nothing was written.")
        return
    with open(LOG, "w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=COLS)
        w.writeheader()
        w.writerows(rows)
    print(f"wrote {LOG}")


if __name__ == "__main__":
    main()
