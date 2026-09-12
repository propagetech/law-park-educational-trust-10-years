#!/usr/bin/env python3
"""Convert 05-kannada-subtitles.srt to WebVTT for the team-handoff.html player.

The .srt stays the editor's deliverable. This only exists because browsers do not
read SRT. Run it after any make_srt.py run so the handoff page stays in step:

    python3 tools/make_vtt.py
"""
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent.parent
SRT = HERE / "05-kannada-subtitles.srt"
VTT = HERE / "05-kannada-subtitles.vtt"


def main() -> int:
    if not SRT.exists():
        print(f"missing {SRT}", file=sys.stderr)
        return 1

    blocks = [b for b in SRT.read_text(encoding="utf-8-sig").replace("\r\n", "\n").strip().split("\n\n") if b.strip()]
    out = [
        "WEBVTT",
        "",
        "NOTE",
        "Generated from 05-kannada-subtitles.srt by tools/make_vtt.py. Do not hand-edit:",
        "re-run tools/make_srt.py from tools/timeline.json, then re-run this script.",
        "",
    ]

    auto = 0
    for block in blocks:
        lines = block.strip().split("\n")
        if lines and re.fullmatch(r"\d+", lines[0].strip()):
            cue_id = lines[0].strip()
            lines = lines[1:]
        else:
            auto += 1
            cue_id = str(auto)
        out.append(cue_id)
        out.append(lines[0].replace(",", "."))
        out.extend(lines[1:])
        out.append("")

    VTT.write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"wrote {VTT.name}: {len(blocks)} cues")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
