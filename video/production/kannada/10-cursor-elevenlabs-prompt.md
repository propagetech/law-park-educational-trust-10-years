# 10 · Cursor prompt · Generate the Kannada narration with ElevenLabs

Paste section A into Cursor. It is self-contained: everything Cursor needs is either
in this repo or in the tables below.

Background and the reasoning behind every constraint is in
[`09-elevenlabs-narration-guide.md`](09-elevenlabs-narration-guide.md).

---

## A · The prompt to paste

Copy everything between the lines.

---

You have an ElevenLabs connection. Generate the Kannada narration for the Law Park
Educational Trust 10th anniversary film, then re-time the picture to it.

Work in `video/production/kannada/`.

### Read these first

- `tools/timeline.json` is the authoritative source. Each object has `sid` (shot id),
  `narr` (the Kannada line to speak), and `speech` (the seconds currently allotted).
  Generate audio only for objects whose `narr` is non-empty: there are **43** of them.
- `01-kannada-final-script.md` has the per-line performance direction.
- `09-elevenlabs-narration-guide.md` explains why the constraints below exist.

### Five hard constraints. Breaking any of them wastes the run.

1. **Model must be `eleven_v3`.** Kannada is supported by Eleven v3 only.
   Multilingual v2, Flash v2.5 and Turbo v2.5 do **not** support Kannada and are the
   default in most tutorials and SDK wrappers. If your ElevenLabs tool does not let you
   set the model explicitly, find out what it defaults to before you generate anything.
   A wrong default produces confident-sounding output that is not Kannada.

2. **Do not add square-bracket audio tags.** v3 reads `[...]` as delivery direction.
   Send each `narr` string exactly as it appears in `timeline.json` and nothing else.
   Do not add `[calm]`, `[sighs]`, `[pause]` or anything similar.

3. **Send the text byte-for-byte as raw UTF-8.** Several lines contain a zero-width
   non-joiner (U+200C), for example in `ನೋಟ್‌ಬುಕ್` and `ಎಂಜಿನಿಯರ್‌ಗಳು`. Do not strip,
   normalise, transliterate or "clean" it. Do not NFC/NFKC-normalise.

4. **Stability `natural`.** Not `creative`, which hallucinates, and not `robust`,
   which ignores direction. `natural` is the balanced, neutral register this film wants.

5. **One request per line, one file per line.** Do not concatenate the script into one
   request. Per-line files are what the edit needs in order to place each line against
   its own shot.

### Voice

Pick a **female voice, age impression 35 to 50**: warm, composed, dignified, grounded.
Prefer a voice from ElevenLabs' curated v3 collection. Professional Voice Clones are
documented as weaker on v3.

Avoid: high-pitched, youthful, theatrical, radio-jockey, sales-warm, devotional,
or deep trailer voice.

List the available voices first and tell me which you picked and why.

### Step 1 · Audition only. Stop after this.

Generate **only these five lines** and stop. This is 288 characters. Do not generate the
other 38 until I have listened and approved.

| `K11` | 3.81 | 2016ರಲ್ಲಿ ಅವರು ಮೊದಲ ಶಾಲಾ ಭೇಟಿ ಮಾಡಿದರು. |
| `K12` | 3.07 | ಚಿಕ್ಕಬಳ್ಳಾಪುರ. ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. |
| `K13` | 4.97 | ಅದೇ ಭೇಟಿಯಲ್ಲಿ ನೂರೈವತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸ್ಟೀಲ್ ತಟ್ಟೆ ಮತ್ತು ಲೋಟ ವಿತರಿಸಲಾಯಿತು. |
| `K27` | 5.18 | ನಂತರ ಟ್ರಸ್ಟ್ ಶಾಲಾ ಶುಲ್ಕದ ಶೇಕಡ ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು ಭರಿಸುತ್ತದೆ. ಪೂರ್ತಿ ಅಲ್ಲ. |
| `K29` | 4.13 | ಮತ್ತು ಆ ಹಣ ನೇರವಾಗಿ ಶಾಲೆಗೇ ಸಲ್ಲುತ್ತದೆ. ಬೇರೆ ಯಾರ ಕೈಗೂ ಅಲ್ಲ. |

Save to `tools/vo_eleven/<VOICE_ID>/<SID>.mp3`.

Then report, for each line, the duration you got against the `speech` value from
`timeline.json`, and tell me:

- Does `K12` read as **three separate sentences** with three full stops and no rising
  list intonation? `ಚಿಕ್ಕಬಳ್ಳಾಪುರ. ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ.` Most voices read it as a
  comma list. That is an automatic fail.
- In `K11`, is `2016` spoken as the Kannada number words `ಎರಡು ಸಾವಿರದ ಹದಿನಾರು`, or as
  English digits? Report which.
- In `K27`, is `ಪೂರ್ತಿ ಅಲ್ಲ.` level and quiet, at the same volume as the sentence before
  it? It must not be emphasised. It is the film's turning point.
- Are these words intact, with their conjuncts unbroken?
  `ವಿದ್ಯಾರ್ಥಿವೇತನ` · `ಚಿಕ್ಕಬಳ್ಳಾಪುರ` · `ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು`

**Then stop and wait for me.**

### Step 2 · Only after I approve the voice

Generate the remaining 38 lines with the same voice and settings, into the same folder.
The full set is 3,585 characters.

Then write `tools/vo_eleven/<VOICE_ID>/durations.json`, a flat JSON object mapping shot
id to the measured duration in seconds, exactly this shape:

```json
{{ "K02": 7.61, "K03": 2.80, "K04": 5.42 }}
```

Measure with `ffprobe -v error -show_entries format=duration -of csv=p=0 <file>`.
Include an entry for every one of the 43 lines.

### Step 3 · Re-time the picture to the voice and rebuild

Eleven v3 has no speed control, so the narration leads and the picture follows.
Run these, in order, from `video/production/kannada/tools/`:

```bash
python3 build_timeline.py timeline.json --from-audio vo_eleven/<VOICE_ID>/durations.json
python3 make_srt.py timeline.json ../05-kannada-subtitles.srt
python3 gfx.py ../05-kannada-subtitles.srt
python3 film.py silent.mp4
```

Expect the film to get **longer**. A natural Kannada read runs 5 to 10 percent over the
current prediction; at +9 percent it becomes 00:05:27:13. That is the real duration, not
a fault. Report the new total.

Then build the narration stem and mux. Each line is placed at its shot's `t_in`, so the
designed pauses and silences stay silent:

```bash
cd video/production/kannada/tools
python3 - <<'EOF'
import json, glob, os, subprocess, wave, struct, math
SR=48000
D=os.path.dirname(sorted(glob.glob("vo_eleven/*/durations.json"))[-1])
S=json.load(open("timeline.json"))
track=[0]*int(math.ceil(S[-1]["t_out"]*SR)+SR)
for sh in S:
    f=os.path.join(D, sh["sid"]+".mp3")
    if not os.path.exists(f): continue
    subprocess.run(["ffmpeg","-v","error","-y","-i",f,"-ar",str(SR),"-ac","1",
                    "-c:a","pcm_s16le","/tmp/l.wav"],check=True)
    w=wave.open("/tmp/l.wav"); n=w.getnframes()
    s=struct.unpack("<%dh"%n,w.readframes(n)); w.close()
    at=int(round(sh["t_in"]*SR))
    for i,v in enumerate(s):
        if at+i<len(track): track[at+i]+=v
pk=max(1,max(abs(v) for v in track)); g=(10**(-3/20))*32767/pk
track=[max(-32768,min(32767,int(v*g))) for v in track]
w=wave.open(D+"/narration.wav","w"); w.setnchannels(1); w.setsampwidth(2)
w.setframerate(SR); w.writeframes(struct.pack("<%dh"%len(track),*track)); w.close()
print("wrote", D+"/narration.wav")
EOF

ffmpeg -y -i silent.mp4 -i vo_eleven/<VOICE_ID>/narration.wav \
  -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-16:TP=-3.0:LRA=11" \
  -c:a aac -b:a 192k -ar 48000 -ac 1 -shortest -movflags +faststart \
  ../08-kannada-animatic-preview.mp4
```

### Step 4 · Verify, and report failures rather than fixing them silently

Check and report each of these:

- Audio length matches picture length exactly.
- Loudness is -16.0 LUFS integrated, true peak no higher than -3.0 dBTP.
- Shots `K01`, `K06` and `K46` are **completely silent** in their own windows. `K06` is
  the founder's quote card: six seconds, no voice, no music. If there is speech there,
  something is misaligned.
- All 14 marked pauses and holds fall quiet at their shot tails.
- No line bleeds into the shot after it.

### What not to do

- Do not edit `01`, `03`, `04`, `05` or `06` by hand. Every timecode in them derives from
  `timeline.json`. Re-run the tools instead.
- Do not change the Kannada wording. It is an approved script and the trust has sign-off
  obligations against it. If a line is unpronounceable, report it, do not rewrite it.
- Do not add music. There is no licence, and 41 seconds of this film are deliberately silent.
- Do not commit the generated `.mp3`, `.wav` or `.mp4` files, and never commit an API key.

---

## B · The five audition lines

288 characters. `speech` is the seconds currently allotted, for comparison.

| Shot | speech (s) | Kannada |
|---|---|---|
| `K11` | 3.81 | 2016ರಲ್ಲಿ ಅವರು ಮೊದಲ ಶಾಲಾ ಭೇಟಿ ಮಾಡಿದರು. |
| `K12` | 3.07 | ಚಿಕ್ಕಬಳ್ಳಾಪುರ. ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. |
| `K13` | 4.97 | ಅದೇ ಭೇಟಿಯಲ್ಲಿ ನೂರೈವತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸ್ಟೀಲ್ ತಟ್ಟೆ ಮತ್ತು ಲೋಟ ವಿತರಿಸಲಾಯಿತು. |
| `K27` | 5.18 | ನಂತರ ಟ್ರಸ್ಟ್ ಶಾಲಾ ಶುಲ್ಕದ ಶೇಕಡ ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು ಭರಿಸುತ್ತದೆ. ಪೂರ್ತಿ ಅಲ್ಲ. |
| `K29` | 4.13 | ಮತ್ತು ಆ ಹಣ ನೇರವಾಗಿ ಶಾಲೆಗೇ ಸಲ್ಲುತ್ತದೆ. ಬೇರೆ ಯಾರ ಕೈಗೂ ಅಲ್ಲ. |

## C · All 43 lines

3,585 characters. Cursor should read these from `tools/timeline.json` rather than from
this table; the table is here so you can check nothing was mangled in transit.

| Shot | speech (s) | Kannada |
|---|---|---|
| `K02` | 7.51 | ಪ್ರತಿ ವರ್ಷ, ಕರ್ನಾಟಕದ ಹಳ್ಳಿಗಳಲ್ಲಿ, ಮಕ್ಕಳು ತಮ್ಮ ಬಳಿ ಇರುವುದೆಲ್ಲವನ್ನೂ ಒಂದೇ ಚೀಲದಲ್ಲಿ ಹೊತ್ತು ಶಾಲೆಗೆ ನಡೆಯುತ್ತಾರೆ. |
| `K03` | 2.64 | ಅವರಿಗೆ ಬುದ್ಧಿ ಇದೆ. ಕಲಿಯುವ ಹಂಬಲ ಇದೆ. |
| `K04` | 5.18 | ಆದರೆ ಆ ನಡಿಗೆಗೂ ತರಗತಿಗೂ ನಡುವೆ, ಶಾಲಾ ಶುಲ್ಕ ಒಂದು ತೀರ್ಮಾನ ತೆಗೆದುಕೊಂಡು ಬಿಡುತ್ತದೆ. |
| `K05` | 3.91 | ಹತ್ತು ವರ್ಷಗಳಿಂದ, ಒಂದು ಟ್ರಸ್ಟ್ ಸರಿಯಾಗಿ ಅಲ್ಲಿಯೇ ಬಂದು ನಿಂತಿದೆ. |
| `K07` | 6.35 | ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್, ಬೆಂಗಳೂರಿನ ಎಚ್.ಎಸ್.ಆರ್. ಲೇಔಟ್‌ನಲ್ಲಿರುವ ನೋಂದಾಯಿತ ಶೈಕ್ಷಣಿಕ ಟ್ರಸ್ಟ್. |
| `K08` | 8.57 | ಇದನ್ನು ಸ್ಥಾಪಿಸಿದವರು ಚಾರುಲತಾ ಎಂ. ಆರ್. ಟ್ರಸ್ಟ್ ಶುರುವಾಗುವ ಮೊದಲೇ ಅವರು ತಮ್ಮ ಬಡಾವಣೆಯ ಮಕ್ಕಳ ಶಾಲಾ ಶುಲ್ಕವನ್ನು ತಾವೇ ಕಟ್ಟುತ್ತಿದ್ದರು. |
| `K09` | 7.62 | ಅವರ ಜೊತೆಗೂಡಿದವರು ಸಾದೇನಹಳ್ಳಿಯ ಎಸ್. ಎಂ. ಮಂಜುನಾಥ. ಓದಲೆಂದು ಊರು ಬಿಟ್ಟು ನಗರಕ್ಕೆ ಬಂದ ತಮ್ಮ ಕುಟುಂಬದ ಮೊದಲ ವ್ಯಕ್ತಿ. |
| `K10` | 3.60 | ತಮ್ಮ ಊರಿನ ಹಲವು ಮಕ್ಕಳನ್ನು ಅವರು ಆಗಲೇ ಓದಿಸಿದ್ದರು. |
| `K11` | 3.81 | 2016ರಲ್ಲಿ ಅವರು ಮೊದಲ ಶಾಲಾ ಭೇಟಿ ಮಾಡಿದರು. |
| `K12` | 3.07 | ಚಿಕ್ಕಬಳ್ಳಾಪುರ. ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. |
| `K13` | 4.97 | ಅದೇ ಭೇಟಿಯಲ್ಲಿ ನೂರೈವತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸ್ಟೀಲ್ ತಟ್ಟೆ ಮತ್ತು ಲೋಟ ವಿತರಿಸಲಾಯಿತು. |
| `K14` | 5.18 | 2017ರಲ್ಲಿ ಒಂದು ಹತ್ತಾಯಿತು. ಹತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಿದ್ಯಾರ್ಥಿವೇತನ. |
| `K15` | 6.45 | ಆಮೇಲೆ ಕೆಲಸ ಹಾಗೇ ಮುಂದುವರಿಯಿತು. ವರ್ಷದಿಂದ ವರ್ಷಕ್ಕೆ. ಅದೇ ದಾರಿಗಳು, ಅದೇ ಶಾಲೆಗಳು, ಇನ್ನಷ್ಟು ಮಕ್ಕಳು. |
| `K16` | 4.65 | 2020ರಲ್ಲಿ ಶಾಲೆಗಳು ಮುಚ್ಚಿದವು, ಕುಟುಂಬಗಳ ದಿನಗೂಲಿ ನಿಂತಿತು. |
| `K17` | 9.20 | ಆಗ ಟ್ರಸ್ಟ್ ಒಂದೇ ಪುಟದ ಪ್ರಕಟಣೆ ಹೊರಡಿಸಿತು. ಪೋಷಕರನ್ನು ಕಳೆದುಕೊಂಡ ಮಕ್ಕಳಿಗೆ. ಕೆಲಸ ಕಳೆದುಕೊಂಡು ಶುಲ್ಕ ಕಟ್ಟಲಾಗದ ಪೋಷಕರಿಗೆ. ನೆರವು ನಿಲ್ಲಲಿಲ್ಲ. |
| `K18` | 5.82 | 2022ರಲ್ಲಿ ಪುಸ್ತಕದ ಕಪಾಟುಗಳು ಎದ್ದವು. ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯಗಳು. |
| `K19` | 4.97 | ದಾನವಾಗಿ ಬಂದ ಕಥೆ ಪುಸ್ತಕಗಳು, ಪಠ್ಯ ಪುಸ್ತಕಗಳು, ಬಳಸದೇ ಉಳಿದ ನೋಟ್‌ಬುಕ್‌ಗಳು. |
| `K20` | 4.44 | 2023ರಲ್ಲಿ ವ್ಯಾಪ್ತಿ ಹಿಗ್ಗಿತು. ಮೈಸೂರು. ಎಚ್.ಡಿ. ಕೋಟೆ. |
| `K21` | 7.40 | ಒಂಬತ್ತು ಮತ್ತು ಹತ್ತನೇ ತರಗತಿಯ ಮಕ್ಕಳಿಗೆ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ. ಬದುಕಿನ ದಾರಿ ಸದ್ದಿಲ್ಲದೆ ನಿರ್ಧಾರವಾಗುವ ವಯಸ್ಸು ಅದು. |
| `K22` | 9.63 | 2024ರಲ್ಲಿ ಎಂ.ಎಂ. ಹಿಲ್ಸ್‌ನ ಬುಡಕಟ್ಟು ಶಾಲೆಗಳಲ್ಲಿ ಇನ್ನೂರು ಶಾಲಾ ಚೀಲ, ನೋಟ್‌ಬುಕ್ ಮತ್ತು ಲೇಖನ ಸಾಮಗ್ರಿಗಳೊಂದಿಗೆ ಶೈಕ್ಷಣಿಕ ವರ್ಷ ಆರಂಭವಾಯಿತು. |
| `K23` | 4.23 | ಮತ್ತು 2025ರಲ್ಲಿ, ಎಚ್.ಡಿ. ಕೋಟೆಯಲ್ಲಿ, ಮುನ್ನೂರು. |
| `K24` | 2.86 | ಇದೆಲ್ಲ ಕಚೇರಿಯಲ್ಲಿ ಕುಳಿತು ಆಗುವ ಕೆಲಸವಲ್ಲ. |
| `K25` | 4.44 | ಮುಖ್ಯೋಪಾಧ್ಯಾಯರೋ, ನೆರೆಹೊರೆಯವರೋ, ಊರಿನ ಹಿತೈಷಿಯೋ ಒಂದು ಹೆಸರು ಸೂಚಿಸುತ್ತಾರೆ. |
| `K26` | 6.56 | ತಂಡ ಆ ಊರಿಗೆ ಹೋಗುತ್ತದೆ. ಮಕ್ಕಳನ್ನೂ ಪೋಷಕರನ್ನೂ ಒಂದೆಡೆ ಸೇರಿಸಿ, ಪ್ರತಿ ಕುಟುಂಬದ ಜೊತೆ ಕೂತು ಮಾತನಾಡುತ್ತದೆ. |
| `K27` | 5.18 | ನಂತರ ಟ್ರಸ್ಟ್ ಶಾಲಾ ಶುಲ್ಕದ ಶೇಕಡ ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು ಭರಿಸುತ್ತದೆ. ಪೂರ್ತಿ ಅಲ್ಲ. |
| `K28` | 6.88 | ಉಳಿದ ಪಾಲನ್ನು ಕುಟುಂಬವೇ ಕಟ್ಟುತ್ತದೆ. ಏಕೆಂದರೆ ತಾವೂ ಒಂದು ಪಾಲು ಹೊತ್ತ ಪೋಷಕರು ಮಗುವಿನ ಓದಿನ ಒಳಗೇ ಉಳಿಯುತ್ತಾರೆ. |
| `K29` | 4.13 | ಮತ್ತು ಆ ಹಣ ನೇರವಾಗಿ ಶಾಲೆಗೇ ಸಲ್ಲುತ್ತದೆ. ಬೇರೆ ಯಾರ ಕೈಗೂ ಅಲ್ಲ. |
| `K30` | 7.93 | ಬುಡಕಟ್ಟು ಶಾಲೆಗಳ ಮಕ್ಕಳ ಜೊತೆ ತಂಡ ಕೆಲವು ದಿನ ಉಳಿಯುತ್ತದೆ. ಕಲಿಸುತ್ತದೆ, ಕಲಿಯುತ್ತದೆ. ಆಮೇಲೆ ಚೀಲಗಳು ಮಕ್ಕಳ ಕೈ ಸೇರುತ್ತವೆ. |
| `K31` | 7.40 | ವಿದ್ಯಾರ್ಥಿವೇತನ ಒಂದರಿಂದಲೇ ಶಿಕ್ಷಣ ಪೂರ್ಣವಾಗುವುದಿಲ್ಲ. ಹಾಗಾಗಿ ಶಾಲಾ ಚೀಲ, ನೋಟ್‌ಬುಕ್, ಲೇಖನ ಸಾಮಗ್ರಿ, ಚಿತ್ರಕಲೆಯ ಪರಿಕರ. |
| `K32` | 6.98 | ಗ್ರಂಥಾಲಯಗಳು. ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ. ಆಟಗಳು. ಮಕ್ಕಳು ಹಾಡಿ ಕುಣಿಯುವ ವೇದಿಕೆ, ಮತ್ತು ಅದನ್ನು ನೋಡಲೆಂದೇ ಬಂದ ಜನ. |
| `K33` | 2.96 | ಮಕ್ಕಳಿಗೆ ಮಾತ್ರವಲ್ಲ, ಪೋಷಕರಿಗೂ ಮಾರ್ಗದರ್ಶನ. |
| `K34` | 9.73 | ತಲುಪುವುದೇ ಕಷ್ಟವಾದ ಮಕ್ಕಳನ್ನೂ ಈ ಕೆಲಸ ತಲುಪಿದೆ. ಏಕ ಪೋಷಕರ ಮಕ್ಕಳು. ಎಚ್‌ಐವಿ ಇರುವ ಕುಟುಂಬಗಳ ಮಕ್ಕಳು. ದೀರ್ಘಕಾಲದ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಇರುವ ಮಕ್ಕಳು. |
| `K35` | 7.09 | ಈ ಕೆಲಸ ಬೆಳಕು ಟ್ರಸ್ಟ್, ಸೌಖ್ಯ ಸಮೃದ್ಧಿ ಸಂಸ್ಥೆ, ಜಿಲ್ಲಾ ಆರೋಗ್ಯ ಇಲಾಖೆ ಮತ್ತು ನಿಸರ್ಗ ಫೌಂಡೇಶನ್ ಜೊತೆಗೂಡಿ ನಡೆದಿದೆ. |
| `K36` | 9.10 | 2024ರ ಜೂನ್‌ನಲ್ಲಿ ಒಂದು ಕನ್ನಡ ದಿನಪತ್ರಿಕೆ ಮುಳಬಾಗಿಲಿನ ಚಿತ್ರವನ್ನು ಪ್ರಕಟಿಸಿತು. ಏಕ ಪೋಷಕರ ಮಕ್ಕಳಿಗೆ ವಿದ್ಯಾರ್ಥಿವೇತನ ವಿತರಣೆ. |
| `K37` | 8.04 | 2025ರ ಡಿಸೆಂಬರ್‌ನಲ್ಲಿ, ನವದೆಹಲಿಯ ರಾಷ್ಟ್ರೀಯ ಶೃಂಗಸಭೆಯಲ್ಲಿ, ಸಂಸ್ಥಾಪಕರಿಗೆ ಭಾರತ್ ಶಿಕ್ಷಾ ರತ್ನ ಪ್ರಶಸ್ತಿ ಸಂದಿತು. |
| `K38` | 11.32 | ಆದರೆ ಮುಖ್ಯವಾದ ದಾಖಲೆ ಪ್ರಶಸ್ತಿ ಪತ್ರದಲ್ಲಿ ಇಲ್ಲ. ಅದು ಒಂದು ಹೆಸರುಗಳ ಪಟ್ಟಿಯಲ್ಲಿದೆ. ಬೆಂಗಳೂರು, ಚೆನ್ನೈ, ಅಮೆರಿಕ, ಬ್ರಿಟನ್, ಜರ್ಮನಿ, ಡೆನ್ಮಾರ್ಕ್, ದುಬೈನಲ್ಲಿದ್ದು ನೆರವು ನೀಡಿದವರು. |
| `K39` | 6.66 | ವಕೀಲರು, ಎಂಜಿನಿಯರ್‌ಗಳು, ವೈದ್ಯರು, ಗೃಹಿಣಿಯರು ಆಗಿರುವ ಸ್ವಯಂಸೇವಕರು. ಒಂದು ಮಗುವಿಗಾಗಿ ಫೋನ್ ಮಾಡಿದ ಶಿಕ್ಷಕರು. |
| `K40` | 2.96 | ಮತ್ತು ತಮ್ಮ ಪಾಲನ್ನು ತಪ್ಪದೇ ಕಟ್ಟಿದ ಪೋಷಕರು. |
| `K41` | 10.26 | ಈ ವರ್ಷ, ತನ್ನ ಆರೈಕೆಯಲ್ಲಿರುವ ಎಲ್ಲ ಮಕ್ಕಳನ್ನೂ ಬೆಂಗಳೂರಿಗೆ ಕರೆತರಬೇಕೆಂಬುದು ಟ್ರಸ್ಟ್‌ನ ಆಸೆ. ಒಂದು ಕಾರ್ಯಕ್ರಮ, ಒಂದು ದಿನದ ಸುತ್ತಾಟ, ಮನೆಗೆ ಒಯ್ಯಲು ಒಂದು ಉಡುಗೊರೆ. |
| `K42` | 6.88 | ಅವರಲ್ಲಿ ಹಲವರಿಗೆ ಇದು ಈ ನಗರವನ್ನು ನೋಡುವ ಮೊದಲ ಬಾರಿ. ಕೆಲವರಿಗೆ ತಮ್ಮ ಊರು ಬಿಟ್ಟು ಹೊರಡುವ ಮೊದಲ ಬಾರಿ. |
| `K43` | 6.77 | ಮುಂದಿನ ಹತ್ತು ವರ್ಷವೂ ಹೀಗೇ. ಇನ್ನಷ್ಟು ಜಿಲ್ಲೆಗಳು. ಇನ್ನಷ್ಟು ಗ್ರಂಥಾಲಯಗಳು. ಓದು ನಿಲ್ಲದ ಇನ್ನಷ್ಟು ಮಕ್ಕಳು. |
| `K44` | 3.81 | ಹತ್ತು ವರ್ಷ. ಒಂದೊಂದೇ ಮಗು. ಸದ್ದಿಲ್ಲದೆ ಉಳಿಸಿಕೊಂಡ ಒಂದು ಮಾತು. |
| `K45` | 5.71 | ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್‌ನ ಹತ್ತನೇ ವರ್ಷದ ಸಂಭ್ರಮಕ್ಕೆ ನಿಮಗೆಲ್ಲರಿಗೂ ಆತ್ಮೀಯ ಸ್ವಾಗತ. |

## D · If Cursor's ElevenLabs tool cannot set the model

This is the likeliest failure. Some MCP wrappers expose only a voice and a text field.

1. Ask it to print the exact request it sends, including `model_id`.
2. If it defaults to `eleven_multilingual_v2`, that model does not support Kannada.
   Either find the parameter, or fall back to
   `tools/tts_eleven.py`, which pins `eleven_v3` and needs only an API key in
   `~/.elevenlabs_key`. See `09` section 9.
3. A useful smoke test: generate `K12` alone and listen. If the output is not
   recognisably Kannada, the model is wrong. Do not spend the other 42 lines finding out.
