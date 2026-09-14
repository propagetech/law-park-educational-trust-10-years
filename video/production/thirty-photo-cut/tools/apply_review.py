#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Applies a review.json exported from the review page back into tools/shots.py.

  python3 apply_review.py review.json           show what would change
  python3 apply_review.py review.json --write   write it, after a backup

This closes the loop. The review page is a marking-up surface, never a second
source of truth: what it exports is a list of old-value / new-value pairs, and
this writes those into shots.py so build.py can re-derive every document from
one place.

The rule that keeps it safe: a change is applied only if the OLD value is still
in shots.py, character for character, exactly once. If the file has moved on
since the review was made, the edit is refused and reported rather than guessed
at. Nothing is ever half-applied: either every change lands or none do.

Statuses and notes are not written into shots.py. They are review opinion, not
film content, so they are printed as a summary for the creative team and left
in review.json.

After writing:

    python3 build.py --check    confirm the cut still validates
    python3 build.py            re-derive every deliverable
"""
import json, os, re, shutil, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(HERE, "shots.py")

# review.json field -> the keyword argument it sets in shots.py
FIELDS = {"headEn": "head_en", "headKn": "head_kn",
          "voEn": "vo_en", "voKn": "vo_kn",
          "photo": "photo", "dur": "dur"}

STATUS = {"ok": "APPROVED", "change": "NEEDS A CHANGE", "reject": "REPLACE"}


def py_literal(value):
    """Render a value the way shots.py writes it: a float bare, a string as a
    double-quoted literal wrapped to the file's own indentation."""
    if isinstance(value, (int, float)):
        return "%.1f" % float(value)
    text = " ".join(str(value).split())
    if len(text) <= 74:
        return '"%s"' % text.replace('"', '\\"')
    # Wrap long strings into implicit-concatenation lines, as the file does.
    words, lines, cur = text.split(" "), [], ""
    for w in words:
        if cur and len(cur) + len(w) + 1 > 74:
            lines.append(cur)
            cur = w
        else:
            cur = (cur + " " + w).strip()
    if cur:
        lines.append(cur)
    pad = "\n" + " " * 14
    return pad.join('"%s "' % l.replace('"', '\\"') if i < len(lines) - 1
                    else '"%s"' % l.replace('"', '\\"')
                    for i, l in enumerate(lines))


def current(src, sid, key):
    """The value shots.py currently holds for one field of one shot."""
    block = shot_block(src, sid)
    if block is None:
        return None
    if key == "dur":
        m = re.search(r"\bdur=([\d.]+)", block)
        return float(m.group(1)) if m else None
    m = re.search(r'\b%s=((?:\s*"(?:[^"\\]|\\.)*")+)' % key, block)
    if not m:
        return None
    parts = re.findall(r'"((?:[^"\\]|\\.)*)"', m.group(1))
    return " ".join("".join(parts).split())


def shot_block(src, sid):
    m = re.search(r'\n    dict\(\s*\n?\s*sid="%s"' % re.escape(sid), src)
    if not m:
        return None
    start = m.start()
    end = src.find("\n    dict(", start + 10)
    if end == -1:
        end = src.find("\n]", start)
    return src[start:end]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    write = "--write" in sys.argv
    if len(args) != 1:
        sys.exit(__doc__)
    with open(args[0], encoding="utf-8") as fh:
        review = json.load(fh)
    with open(SHOTS, encoding="utf-8") as fh:
        src = fh.read()

    edits, refused, opinions, assets = [], [], [], []

    for rec in review.get("shots", []):
        sid = rec.get("sid")
        if not sid:
            continue
        if shot_block(src, sid) is None:
            refused.append("%s: no such shot in shots.py" % sid)
            continue
        for jkey, pykey in FIELDS.items():
            if jkey not in rec:
                continue
            want_from = rec[jkey].get("from")
            want_to = rec[jkey].get("to")
            have = current(src, sid, pykey)
            if pykey == "dur":
                have_norm = None if have is None else float(have)
                from_norm = float(want_from)
            else:
                have_norm = have
                from_norm = " ".join(str(want_from).split())
            if have_norm != from_norm:
                refused.append(
                    "%s %s: shots.py has moved on since the review.\n"
                    "      review expected: %r\n"
                    "      shots.py holds:  %r" % (sid, pykey, from_norm, have_norm))
                continue
            if pykey == "dur":
                if float(want_to) == from_norm:
                    continue
            elif " ".join(str(want_to).split()) == from_norm:
                continue
            edits.append((sid, pykey, want_to))
        if rec.get("photoFile"):
            assets.append((sid, rec["photoFile"]))
        if rec.get("status") or rec.get("notes"):
            opinions.append((sid, rec.get("status"), rec.get("notes")))

    # ------------------------------------------------------------------ report
    print("Review: %s" % review.get("generated", "undated"))
    print("%d shot(s) marked, %d field edit(s), %d refusal(s)\n"
          % (len(review.get("shots", [])), len(edits), len(refused)))

    for sid, key, value in edits:
        print("  %s  %-8s -> %s" % (sid, key,
                                    value if key == "dur" else repr(value)[:90]))
    if assets:
        print("\nNew photographs to add to photo-pack-10-years/enhanced/ by hand:")
        for sid, name in assets:
            print("  %s  %s" % (sid, name))
        print("  The page cannot carry a file. Drop it in, re-run build.py, then\n"
              "  point the shot at it in shots.py.")
    if opinions:
        print("\nReview notes, for the creative team. Not written into shots.py:")
        for sid, status, notes in opinions:
            print("  %s  %s" % (sid, STATUS.get(status, "") or ""))
            if notes:
                print("      %s" % notes.replace("\n", "\n      "))
    if refused:
        print("\nREFUSED:")
        for r in refused:
            print("  " + r)
        print("\nNothing was written. Re-export the review against the current\n"
              "shots.py, or make these edits by hand.")
        sys.exit(1)
    if not edits:
        print("\nNo field edits to apply.")
        return
    if not write:
        print("\nDry run. Re-run with --write to apply.")
        return

    # ------------------------------------------------------------------- write
    out = src
    for sid, key, value in edits:
        block = shot_block(out, sid)
        if key == "dur":
            new_block = re.sub(r"\bdur=[\d.]+", "dur=%s" % py_literal(value),
                               block, count=1)
        else:
            new_block = re.sub(r'\b%s=(?:\s*"(?:[^"\\]|\\.)*")+' % key,
                               "%s=%s" % (key, py_literal(value)), block, count=1)
        if new_block == block:
            sys.exit("could not rewrite %s %s. Nothing written." % (sid, key))
        out = out.replace(block, new_block, 1)

    backup = SHOTS + ".bak-" + time.strftime("%Y%m%d-%H%M%S")
    shutil.copy2(SHOTS, backup)
    with open(SHOTS, "w", encoding="utf-8") as fh:
        fh.write(out)
    print("\nWrote %d edit(s) to shots.py. Backup: %s" % (len(edits),
                                                          os.path.basename(backup)))
    print("Now run:  python3 build.py --check   then   python3 build.py")


if __name__ == "__main__":
    main()
