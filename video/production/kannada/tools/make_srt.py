#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generates the Kannada subtitle file from timeline.json.

Rules enforced (14 item 8.3, 10 section E):
  - max 2 lines per cue, max 32 display clusters per line
  - min 1.8 s per cue
  - breaks only at word boundaries: never inside a word, never inside a
    conjunct cluster, never between a base consonant and its vowel sign
  - sentence splitting never breaks an initial (ಎಂ. ಆರ್., ಎಚ್.ಎಸ್.ಆರ್., ಎಚ್.ಡಿ., ಎಂ.ಎಂ.)
"""
import json, re, sys, unicodedata, math

MAXLINE = 32
MINCUE = 1.8

def clusters(s):
    n = 0
    for ch in s:
        if unicodedata.category(ch) in ("Mn", "Mc", "Cf"):
            continue
        n += 1
    return n

# Explicit, auditable set of the initials that occur in this narration.
# A whitelist rather than a pattern: Kannada initials are 1-2 clusters
# (ಎಂ = 1, ಎಸ್ = 2), which no pattern can tell apart from short real words
# such as ಇದೆ. without false positives.
INITIALS = {
    "ಎಂ.", "ಆರ್.", "ಎಸ್.", "ಎಚ್.", "ಡಿ.", "ಜಿ.", "ಎಫ್.",
    "ಎಚ್.ಎಸ್.ಆರ್.", "ಎಚ್.ಡಿ.", "ಎಂ.ಎಂ.", "ಡಿ.ಎಂ.ಎಸ್.", "ಕೆ.ಜಿ.ಎಫ್.",
}

def is_initial(tok):
    return re.sub(r"^[\"'(]", "", tok) in INITIALS

# Personal names are glued whole so a line break can never fall between a
# name and its initials. Indian name order goes both ways (ಚಾರುಲತಾ ಎಂ. ಆರ್.
# but ಎಸ್. ಎಂ. ಮಂಜುನಾಥ), which no rule can resolve, so both are named here.
NAMES = ["ಚಾರುಲತಾ ಎಂ. ಆರ್.", "ಎಸ್. ಎಂ. ಮಂಜುನಾಥ"]
GLUE = "\u2060"   # WORD JOINER: not whitespace, so str.split() keeps the name whole

def preglue(text):
    for n in NAMES:
        text = text.replace(n, n.replace(" ", GLUE))
    return text

def unglue(text):
    return text.replace(GLUE, " ")

def atomise(text):
    """Words, except that initials are glued to their name so a line break can
    never fall between ಎಸ್. and ಎಂ. ಮಂಜುನಾಥ."""
    toks, out, i = preglue(text).split(), [], 0
    while i < len(toks):
        if is_initial(toks[i]):
            j = i
            while j < len(toks) and is_initial(toks[j]):
                j += 1
            if j < len(toks):                      # glue forward: ಎಸ್. ಎಂ. ಮಂಜುನಾಥ
                out.append(" ".join(toks[i:j + 1])); i = j + 1
            elif out:                              # glue backward: ಚಾರುಲತಾ ಎಂ. ಆರ್.
                out[-1] = out[-1] + " " + " ".join(toks[i:j]); i = j
            else:
                out.append(" ".join(toks[i:j])); i = j
        else:
            out.append(toks[i]); i += 1
    return out

def kw(s):
    return [w for w in s.split() if re.search(r"[ಀ-೿0-9]", w)]

def balanced_split(words, n):
    """Split an atom list into n groups, balancing display width."""
    if n <= 1:
        return [" ".join(words)]
    target = clusters(" ".join(words)) / n
    groups, cur, curw = [], [], 0
    for i, w in enumerate(words):
        add = clusters(w) + (1 if cur else 0)
        remaining_groups = n - len(groups)
        if cur and curw + add > target and remaining_groups > 1 \
           and len(words) - i >= remaining_groups - 1:
            groups.append(" ".join(cur)); cur, curw = [w], clusters(w)
        else:
            cur.append(w); curw += add
    groups.append(" ".join(cur))
    while len(groups) < n:
        big = max(range(len(groups)), key=lambda i: clusters(groups[i]))
        w = atomise(groups[big])
        if len(w) < 2:
            break
        mid = len(w) // 2
        groups[big:big+1] = [" ".join(w[:mid]), " ".join(w[mid:])]
    return groups

def wrap(text):
    """Two lines max, break at a word boundary, balanced. None if impossible."""
    if clusters(text) <= MAXLINE:
        return [unglue(text)]
    words = atomise(text)
    best = None
    for i in range(1, len(words)):
        a, b = " ".join(words[:i]), " ".join(words[i:])
        ca, cb = clusters(a), clusters(b)
        if ca <= MAXLINE and cb <= MAXLINE:
            if best is None or abs(ca - cb) < best[0]:
                best = (abs(ca - cb), a, b)
    return [unglue(best[1]), unglue(best[2])] if best else None

# sentence split that protects initials: a full stop ends a sentence only when
# the token before it is longer than one display cluster.
def split_sentences(text):
    toks = preglue(text).split()
    sents, cur = [], []
    for t in toks:
        cur.append(t)
        if t.endswith((".", "?", "!")):
            if is_initial(t) and GLUE not in t:
                continue                      # ಎಂ.  ಆರ್.  ಎಚ್.ಎಸ್.ಆರ್.  ಎಂ.ಎಂ.
            sents.append(" ".join(cur)); cur = []
    if cur:
        sents.append(" ".join(cur))
    return sents

def to_cues(text):
    out = []
    for s in split_sentences(text):
        n = max(1, math.ceil(clusters(s) / (2 * MAXLINE)))
        pieces = balanced_split(atomise(s), n)
        # widen if any piece still will not wrap into 2 legal lines
        while any(wrap(p) is None for p in pieces):
            n += 1
            pieces = balanced_split(atomise(s), n)
        out.extend(pieces)
    return out

def allocate(total, weights):
    """Split `total` seconds across pieces, every share >= MINCUE where possible."""
    n = len(weights)
    if n * MINCUE > total + 1e-9:
        return None                            # caller must merge
    shares = [total * w / sum(weights) for w in weights]
    for _ in range(50):
        deficit = sum(max(0.0, MINCUE - s) for s in shares)
        if deficit < 1e-9:
            break
        surplus_idx = [i for i, s in enumerate(shares) if s > MINCUE]
        surplus = sum(shares[i] - MINCUE for i in surplus_idx)
        if surplus < 1e-9:
            break
        for i in surplus_idx:
            shares[i] -= deficit * (shares[i] - MINCUE) / surplus
        for i, s in enumerate(shares):
            if s < MINCUE:
                shares[i] = MINCUE
    return shares

def stamp(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return "%02d:%02d:%02d,%03d" % (h, m, s, ms)

S = json.load(open(sys.argv[1], encoding="utf-8"))
cues = []
for sh in S:
    if not sh["narr"].strip():
        continue
    pieces = to_cues(sh["narr"])
    while True:
        w = [max(1, len(kw(p))) for p in pieces]
        shares = allocate(sh["speech"], w)
        if shares is not None:
            break
        # not enough time for this many cues: merge the two narrowest neighbours
        j = min(range(len(pieces) - 1),
                key=lambda i: clusters(pieces[i]) + clusters(pieces[i + 1]))
        merged = pieces[j] + " " + pieces[j + 1]
        if wrap(merged) is None:
            shares = [max(MINCUE, sh["speech"] / len(pieces))] * len(pieces)
            break
        pieces[j:j + 2] = [merged]
    t = sh["t_in"]
    for p, d in zip(pieces, shares):
        cues.append(dict(text=p, start=t, dur=d))
        t += d

out, bad = [], []
for i, c in enumerate(cues, 1):
    lines = wrap(c["text"])
    for ln in lines:
        if clusters(ln) > MAXLINE:
            bad.append(("LONG", i, clusters(ln), ln))
    if c["dur"] < MINCUE - 1e-6:
        bad.append(("SHORT", i, round(c["dur"], 2), c["text"]))
    if i > 1 and c["start"] < cues[i - 2]["start"] + cues[i - 2]["dur"] - 1e-6:
        bad.append(("OVERLAP", i, c["text"]))
    out.append("%d\n%s --> %s\n%s\n" % (i, stamp(c["start"]),
                                        stamp(c["start"] + c["dur"]), "\n".join(lines)))

open(sys.argv[2], "w", encoding="utf-8-sig").write("\n".join(out))
sys.stderr.write("cues=%d  longest line=%d clusters  shortest cue=%.2fs  last out=%s\n" % (
    len(cues), max(clusters(l) for c in cues for l in wrap(c["text"])),
    min(c["dur"] for c in cues), stamp(cues[-1]["start"] + cues[-1]["dur"])))
sys.stderr.write(("VIOLATIONS:\n" + "\n".join(map(str, bad))) if bad else "no violations\n")
