#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generates the Kannada narration with ElevenLabs, one file per line, and measures
what came back so the picture can be re-timed to the voice.

  export ELEVENLABS_API_KEY=...            # never put the key in this repo
  python3 tts_eleven.py --voices           # list voices, flag v3-capable ones
  python3 tts_eleven.py --audition VOICE_ID   # 5 lines, ~290 characters
  python3 tts_eleven.py --render   VOICE_ID   # all 43 lines, ~3,585 characters
  python3 tts_eleven.py --render   VOICE_ID --dry-run   # show payloads, call nothing

Output: vo_eleven/<VOICE_ID>/K02.mp3 ... and durations.json

WHY PER LINE, AND WHY MEASURE
Eleven v3 has no speed or rate control. The macOS scratch track could be squeezed
to fit each shot; v3 cannot. So the order reverses, which is what `10` section F
asks for anyway: narration first, picture second. Feed durations.json back into
build_timeline.py --from-audio and the film re-times to the real read.

MODEL
Kannada is supported by **eleven_v3 only**. Multilingual v2, Turbo v2.5 and
Flash v2.5 do not list Kannada, and they are the default in most examples.
If you change MODEL below to one of those, you will get wrong output or an error.
"""
import argparse, json, os, subprocess, sys, urllib.request, urllib.error

MODEL = "eleven_v3"
API = "https://api.elevenlabs.io/v1"
# mp3_44100_192 needs Creator+; 128 works on Free/Starter and is enough for audition.
OUTPUT_FORMAT = "mp3_44100_128"
EXT = "mp3"
# v3 docs describe creative / natural / robust. The HTTP API still wants a float;
# map the named bands onto the documented three-point scale.
STABILITY = {"creative": 0.0, "natural": 0.5, "robust": 1.0}

# The five lines that decide a voice. From 02 section 4.2, Test B: three
# one-word sentences, a six-syllable term twice, and the two-word turn.
AUDITION = ["K11", "K12", "K13", "K27", "K29"]


KEYFILE = os.path.expanduser("~/.elevenlabs_key")


def key():
    """Env var first, then ~/.elevenlabs_key. Never a literal in this repo."""
    k = os.environ.get("ELEVENLABS_API_KEY")
    if not k and os.path.exists(KEYFILE):
        k = open(KEYFILE).read().strip()
    if not k:
        sys.exit("No API key found.\n"
                 "  export ELEVENLABS_API_KEY=...\n"
                 "or put it in ~/.elevenlabs_key (chmod 600).\n"
                 "Never hardcode it here and never commit it.")
    return k


def get(path):
    req = urllib.request.Request(API + path, headers={"xi-api-key": key()})
    with urllib.request.urlopen(req) as r:
        return json.load(r)


def lines():
    S = json.load(open("timeline.json", encoding="utf-8"))
    return [(x["sid"], x["narr"], x["speech"]) for x in S if x["narr"].strip()]


def list_voices():
    v = get("/voices")["voices"]
    print(f"{len(v)} voices on this account\n")
    print(f"{'voice_id':24} {'name':22} {'v3?':5} labels")
    for x in sorted(v, key=lambda x: x["name"]):
        models = x.get("high_quality_base_model_ids") or []
        v3 = "yes" if any("v3" in m for m in models) else "-"
        lab = x.get("labels") or {}
        bits = " ".join(f"{k}={val}" for k, val in lab.items()
                        if k in ("accent", "gender", "age", "use_case", "language"))
        print(f"{x['voice_id']:24} {x['name'][:22]:22} {v3:5} {bits}")
    print("\nA voice not marked v3 may still work, but v3 is the only model that "
          "does Kannada, so prefer voices from the curated v3 collection.\n"
          "Professional Voice Clones are documented as weaker on v3; prefer "
          "designed voices or Instant Voice Clones.")


def synth(voice, sid, text, outdir, stability, similarity, dry):
    """One line, one request. Text goes as raw UTF-8: the ZWNJ in ನೋಟ್‌ಬುಕ್ matters."""
    path = os.path.join(outdir, f"{sid}.{EXT}")
    body = {
        "text": text,
        "model_id": MODEL,
        "voice_settings": {
            # CLI takes creative / natural / robust; API wants the float mapping.
            # `natural` (0.5) is the balanced, neutral register 02 asks for.
            "stability": STABILITY[stability],
            "similarity_boost": similarity,
            "use_speaker_boost": True,
        },
    }
    if dry:
        print(f"  POST /text-to-speech/{voice}?output_format={OUTPUT_FORMAT}")
        print("      " + json.dumps(body, ensure_ascii=False)[:200] + " ...")
        return None
    req = urllib.request.Request(
        f"{API}/text-to-speech/{voice}?output_format={OUTPUT_FORMAT}",
        data=json.dumps(body).encode("utf-8"),
        headers={"xi-api-key": key(), "Content-Type": "application/json"},
        method="POST")
    try:
        with urllib.request.urlopen(req) as r, open(path, "wb") as f:
            f.write(r.read())
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:400]
        if e.code == 401:
            sys.exit("401: the API key was rejected.")
        if e.code == 422:
            sys.exit(f"422 on {sid}. Usually the model cannot handle the language, "
                     f"or the voice is not valid for {MODEL}.\n{detail}")
        sys.exit(f"HTTP {e.code} on {sid}: {detail}")
    return path


def dur(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                          "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True)
    return float(out.stdout.strip())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voices", action="store_true")
    ap.add_argument("--audition", metavar="VOICE_ID")
    ap.add_argument("--render", metavar="VOICE_ID")
    ap.add_argument("--stability", default="natural",
                    choices=["creative", "natural", "robust"])
    ap.add_argument("--similarity", type=float, default=0.75)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    if a.voices:
        list_voices(); return

    voice = a.audition or a.render
    if not voice:
        ap.print_help(); return
    want = AUDITION if a.audition else None

    L = [(s, t, sp) for s, t, sp in lines() if want is None or s in want]
    chars = sum(len(t) for _, t, _ in L)
    outdir = os.path.join("vo_eleven", voice)
    os.makedirs(outdir, exist_ok=True)
    print(f"{MODEL} · voice {voice} · stability {a.stability} · "
          f"{len(L)} lines · {chars} characters"
          f"{' · DRY RUN' if a.dry_run else ''}\n")

    measured, drift = {}, []
    for sid, text, alloc in L:
        p = synth(voice, sid, text, outdir, a.stability, a.similarity, a.dry_run)
        if not p:
            continue
        d = dur(p)
        measured[sid] = d
        drift.append((sid, alloc, d))
        flag = "" if abs(d - alloc) / alloc < 0.12 else "   <-- picture will re-time"
        print(f"  {sid:4} allotted {alloc:5.2f}s   spoken {d:5.2f}s   "
              f"{100*(d-alloc)/alloc:+5.1f}%{flag}")

    if a.dry_run or not measured:
        return

    json.dump(measured, open(os.path.join(outdir, "durations.json"), "w"), indent=1)
    tot_a = sum(x[1] for x in drift); tot_d = sum(x[2] for x in drift)
    print(f"\nallotted {tot_a:.1f}s   spoken {tot_d:.1f}s   "
          f"{100*(tot_d-tot_a)/tot_a:+.1f}%")
    print(f"wrote {outdir}/durations.json")
    if want:
        print("\nAudition only. Play these five files, score them with 02 section 6,\n"
              "and get trustee approval before spending the full 3,585 characters.")
    else:
        print("\nNext, re-time the picture to this read:\n"
              f"  python3 build_timeline.py timeline.json --from-audio {outdir}/durations.json\n"
              "  python3 make_srt.py timeline.json ../05-kannada-subtitles.srt\n"
              "  python3 gfx.py ../05-kannada-subtitles.srt\n"
              "  python3 film.py silent.mp4\n"
              "then build the narration stem and mux (see 09 section 6).")


if __name__ == "__main__":
    main()
