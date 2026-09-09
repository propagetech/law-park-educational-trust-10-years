#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Rebuilds Kannada-sfx-licence-log.csv from sfx/placements.csv and timeline.json,
keeping every field a human has filled in.

  python3 log.py --check     report what is missing, write nothing
  python3 log.py             rewrite the log

WHY A GENERATOR AND WHY IT PRESERVES
Half the log is mechanical, and drifted the moment the film was re-timed: the
timecodes in the previous version were 1.8 seconds early and three rows
described placements that had been removed. The other half cannot be generated
at all: the download date, the licence text captured that day, the evidence
file and the approval are things a person does, and `07` item 5.9 is about
exactly those. So the technical columns are rebuilt every run and the human
columns are carried across by cue_key. Nothing a person typed is ever lost, and
nothing a machine can derive is ever typed.

WHAT IT WILL NOT DO
It will not invent a licence status. Every row it cannot evidence stays NOT
CAPTURED, loudly, because `07` item 5.9 is unsigned and a log that reads as
complete when it is not is worse than no log.
"""
import argparse
import csv
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.dirname(HERE)
LOG = os.path.join(PACK, "Kannada-sfx-licence-log.csv")
PLACEMENTS = os.path.join("sfx", "placements.csv")
FPS = 25

# What Pixabay calls each file, read off the filename the downloader chose.
# NOT verified against Pixabay: `07` item 5.9 wants the asset page captured on
# the day of download, and that has not been done for any of these.
ASSETS = {
 "universfield-school-bell-199584.mp3":
   ("school bell", "universfield",
    "https://pixabay.com/sound-effects/school-bell-199584/"),
 "black_kumizhi-dreamy-cinematic-riser-523158.mp3":
   ("dreamy cinematic riser", "black_kumizhi",
    "https://pixabay.com/sound-effects/dreamy-cinematic-riser-523158/"),
 "lesiakower-gentle-amp-echoing-whoosh-sound-effect-451056.mp3":
   ("gentle amp echoing whoosh sound effect", "lesiakower",
    "https://pixabay.com/sound-effects/"
    "gentle-amp-echoing-whoosh-sound-effect-451056/"),
 "creatorshome-turn-a-page-336933.mp3":
   ("turn a page", "creatorshome",
    "https://pixabay.com/sound-effects/turn-a-page-336933/"),
 "freesound_community-backpack-34942.mp3":
   ("backpack", "freesound_community",
    "https://pixabay.com/sound-effects/backpack-34942/"),
 "submority-boom-geomorphism-cinematic-trailer-sound-effects-123876.mp3":
   ("boom geomorphism cinematic trailer", "submority",
    "https://pixabay.com/sound-effects/"
    "boom-geomorphism-cinematic-trailer-sound-effects-123876/"),
}

# Specified in Kannada-cue-sheet.csv, not yet downloaded, so there is nothing
# to licence yet. They are listed so the gap is visible in the rights record.
PENDING = {
 "k21-pencil": ("pencil writing", "K21", 1.00, -20, 0.10, 0.50,
   "https://pixabay.com/sound-effects/search/pencil%20writing/"),
 "k46-chime": ("gentle chime", "K46", 2.00, -22, 0.0, 2.50,
   "https://pixabay.com/sound-effects/search/gentle%20chime/"),
}

# Rebuilt every run. Everything else in the file is a person's work.
DERIVED = {"asset_title", "uploader", "pixabay_page_url", "edit_file_name",
           "shot", "timecode_in", "offset_s", "excerpt_in_s", "duration_s",
           "level_db_rel_narration", "gain_db_applied", "fade_in_s",
           "fade_out_s", "status"}
HUMAN = ["download_date", "licence_status_on_download_date",
         "licence_evidence_file", "approved_by", "notes"]
COLS = ["cue_key", "status", "asset_title", "uploader", "pixabay_page_url",
        "download_date", "licence_status_on_download_date",
        "licence_evidence_file", "edit_file_name", "shot", "timecode_in",
        "offset_s", "excerpt_in_s", "duration_s", "level_db_rel_narration",
        "gain_db_applied", "fade_in_s", "fade_out_s", "approved_by", "notes"]

LICENCE_CLASS = ("public event screening, YouTube monetised or not, social "
                 "media and website embedding, worldwide, in perpetuity. "
                 "`14` items 5.1 and 5.2")


def tc(t):
    f = int(round(t * FPS))
    return "%02d:%02d:%02d:%02d" % (f // (3600 * FPS), f // (60 * FPS) % 60,
                                    f // FPS % 60, f % FPS)


def num(row, key, default=0.0):
    v = (row.get(key) or "").strip()
    return float(v) if v else default


def main():
    os.chdir(HERE)
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()

    by = {s["sid"]: s for s in json.load(open("timeline.json", encoding="utf-8"))}
    placed = [r for r in csv.DictReader(open(PLACEMENTS, encoding="utf-8"))
              if r.get("key", "").strip()]

    kept = {}
    if os.path.exists(LOG):
        for r in csv.DictReader(open(LOG, encoding="utf-8")):
            k = (r.get("cue_key") or "").strip()
            if k:
                kept[k] = {c: r.get(c, "") for c in HUMAN}

    rows, dropped = [], []
    for r in placed:
        key, f, sid = r["key"].strip(), r["file"].strip(), r["shot"].strip()
        if f not in ASSETS:
            sys.exit(f"{f} has no entry in ASSETS. Add its Pixabay title, "
                     f"uploader and asset page URL before it ships.")
        title, up, url = ASSETS[f]
        dur = num(r, "dur_s")
        row = {
            "cue_key": key, "status": "PLACED", "asset_title": title,
            "uploader": up, "pixabay_page_url": url, "edit_file_name": f,
            "shot": sid, "timecode_in": tc(by[sid]["t_in"] + num(r, "offset_s")),
            "offset_s": r["offset_s"], "excerpt_in_s": r["in_s"],
            "duration_s": f"{dur:.2f}" if dur else "whole file",
            "level_db_rel_narration": r["level_rel_narr_db"],
            "gain_db_applied": r["gain_db"], "fade_in_s": r["fade_in"],
            "fade_out_s": r["fade_out"],
            "download_date": "2026-09-09",
            "licence_status_on_download_date": "NOT CAPTURED",
            "licence_evidence_file": "NOT CAPTURED", "approved_by": "",
            "notes": f"{r['note']} | URL reconstructed from the filename, not "
                     f"verified against Pixabay | licence must cover "
                     f"{LICENCE_CLASS}",
        }
        row.update({c: v for c, v in kept.get(key, {}).items() if v.strip()})
        rows.append(row)

    for key, (title, sid, off, lvl, fin, fout, url) in PENDING.items():
        row = {
            "cue_key": key, "status": "PENDING DOWNLOAD", "asset_title": title,
            "uploader": "", "pixabay_page_url": url, "edit_file_name": "",
            "shot": sid, "timecode_in": tc(by[sid]["t_in"] + off),
            "offset_s": f"{off:.2f}", "excerpt_in_s": "",
            "duration_s": "", "level_db_rel_narration": f"{lvl}",
            "gain_db_applied": "", "fade_in_s": f"{fin:.2f}",
            "fade_out_s": f"{fout:.2f}", "download_date": "",
            "licence_status_on_download_date": "NOT DOWNLOADED",
            "licence_evidence_file": "", "approved_by": "",
            "notes": f"specified in Kannada-cue-sheet.csv, no file yet | "
                     f"licence must cover {LICENCE_CLASS}",
        }
        row.update({c: v for c, v in kept.get(key, {}).items() if v.strip()})
        rows.append(row)

    live = {r["cue_key"] for r in rows}
    dropped = sorted(k for k in kept if k not in live)

    missing = [r["cue_key"] for r in rows
               if r["licence_status_on_download_date"].startswith("NOT")]
    unapproved = [r["cue_key"] for r in rows if not r["approved_by"].strip()]

    print(f"{len(rows)} rows: {sum(1 for r in rows if r['status'] == 'PLACED')} "
          f"placed, {len(PENDING)} pending download")
    if dropped:
        print(f"\n  {len(dropped)} rows in the old log are no longer placed and "
              f"will be removed:\n    " + ", ".join(dropped))
    if missing:
        print(f"\n  `07` item 5.9. {len(missing)} rows have no licence text "
              f"captured on the download date:\n    " + ", ".join(missing))
    if unapproved:
        print(f"\n  {len(unapproved)} rows are unapproved. `07` item 5.8 is "
              f"unsigned, so that is correct for now.")

    if a.check:
        print("\n--check. Nothing was written.")
        return
    with open(LOG, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=COLS)
        w.writeheader()
        w.writerows(rows)
    print(f"\nwrote {LOG}")


if __name__ == "__main__":
    main()
