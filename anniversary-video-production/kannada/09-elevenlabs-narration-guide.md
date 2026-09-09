# 09 · ElevenLabs ನಿರೂಪಣೆ · Generating the Kannada Narration with ElevenLabs

How to replace the scratch track in [`08`](08-kannada-animatic-notes.md) with an ElevenLabs read, and what to watch out for.

Companion tool: [`tools/tts_eleven.py`](tools/tts_eleven.py).

---

## 1 · The one thing that will catch you out

**Kannada is supported by `eleven_v3` only.**

| Model | Languages | Kannada |
|---|---|---|
| **Eleven v3** | 70+ | **yes** |
| Eleven v3 Conversational | 70+ | yes |
| Multilingual v2 | 29 | **no** |
| Flash v2.5 | 32 | **no** |
| Turbo v2.5 | 32 | **no** |

Multilingual v2 is the model in most tutorials and SDK examples. Send Kannada to it and you get an error or, worse, mangled output that sounds vaguely Indian and is not Kannada. `tools/tts_eleven.py` pins `model_id: "eleven_v3"` and says so in a comment; do not change it.

**Second thing:** v3 reads **square brackets as delivery tags** (`[whispers]`, `[sighs]`). Our script notation uses square brackets too, for `[ವಿರಾಮ 2 ಸೆ]` and `[ಹಿಡಿ 1 ಸೆ]`. Those are stored as separate numeric fields in `timeline.json` and never reach the text, so the tool is safe. **But if you paste lines out of [`01`](01-kannada-final-script.md) into the ElevenLabs web UI by hand, strip the brackets first**, or v3 will try to perform them.

**Third thing:** the narration carries a zero-width non-joiner in words like `ನೋಟ್‌ಬುಕ್`. Send raw UTF-8 and do not "clean" the text. The tool does not.

## 2 · Pick a voice

```bash
export ELEVENLABS_API_KEY=...
cd anniversary-video-production/kannada/tools
python3 tts_eleven.py --voices
```

It lists every voice on the account and flags which are v3-capable.

What to look for, from [`02`](02-kannada-voice-audition-plan.md) section 2:

- **Female, age impression 35 to 50.** Warm, composed, dignified, grounded.
- Prefer voices from ElevenLabs' **curated v3 collection**, or an Instant Voice Clone. The documentation notes Professional Voice Clones are weaker on v3.
- A voice trained on English will speak Kannada with v3, but listen hard to the conjuncts. Section 4 below tells you exactly which words expose it.

**Better than any of this:** clone a real Kannada speaker. An Instant Voice Clone from a few minutes of a Kannada narrator, or of the founder herself, will beat any stock voice on this script. `05` section 6 rank 5 already asks for 30 to 45 seconds of Charulatha M. R. speaking Kannada to camera. That recording would serve twice.

## 3 · Audition before you spend

The whole script is **3,585 characters**. The audition is **288**. Do not render the film until a voice has passed and the trustees have approved a sample: `02` section 7, and `14` item 7.1.

```bash
python3 tts_eleven.py --audition <VOICE_ID>
```

That renders five lines into `vo_eleven/<VOICE_ID>/` and prints how far each one lands from its allocation. The five are Test B from `02` section 4.2, chosen because each one breaks a different kind of voice:

| Line | What it exposes |
|---|---|
| `K11` 2016ರಲ್ಲಿ ಅವರು ಮೊದಲ ಶಾಲಾ ಭೇಟಿ ಮಾಡಿದರು. | Does it say the year as `ಎರಡು ಸಾವಿರದ ಹದಿನಾರು`, or read the digits as English "two thousand sixteen"? |
| `K12` ಚಿಕ್ಕಬಳ್ಳಾಪುರ. ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. | **Three sentences, three full stops, no rising list intonation.** Most voices read this as a comma list. Automatic fail |
| `K13` ...ನೂರೈವತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ... | Two six-syllable words in one breath, neither compressed |
| `K27` ...ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು ಭರಿಸುತ್ತದೆ. ಪೂರ್ತಿ ಅಲ್ಲ. | The film's turn. `ಪೂರ್ತಿ ಅಲ್ಲ.` must be level and quiet, not emphasised |
| `K29` ...ಬೇರೆ ಯಾರ ಕೈಗೂ ಅಲ್ಲ. | A flat, final close with no lift |

Score them with the weighted card in `02` section 6. **A voice scoring 1 or 2 on `K12` or `K27` is rejected regardless of total.** Listen on a speaker, not headphones: this plays in a hall.

## 4 · The words that break a Kannada voice

Play the audition and check these specifically. If any is wrong, the voice is wrong, however good the rest sounds.

| Word | In | What failure sounds like |
|---|---|---|
| ವಿದ್ಯಾರ್ಥಿವೇತನ | throughout | Compressed to four syllables, or the ರ್ಥಿ conjunct broken into "ra-thi" |
| ಚಿಕ್ಕಬಳ್ಳಾಪುರ | `K12` | The doubled ಳ್ಳ flattened to a single ಳ |
| ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು | `K27` | Stumbles, or splits into two words |
| ಸಂಭ್ರಮ | `K45` | The ಭ್ರ conjunct read as "bha-ra". This is the film's second-to-last word |
| ಮುಖ್ಯೋಪಾಧ್ಯಾಯರೋ | `K25` | Anything at all. It is the hardest word in the script |
| 2016, 2025 | year lines | Read as English digits instead of Kannada number words |
| Law Park Educational Trust | `K05`, `K45` | Over-Indianised, or read as Kannada letters. It should sound like the English name inside a Kannada sentence |

**On the years:** `09` section 3.4 says record both the Kannada number words and the English digits, then choose in the edit. If v3 gives you English digits and you want the Kannada, write the number words into the text instead of the numeral: `ಎರಡು ಸಾವಿರದ ಹದಿನಾರರಲ್ಲಿ` rather than `2016ರಲ್ಲಿ`. Change it in `build_timeline.py`, not in the audio.

## 5 · Direction, in v3 terms

v3 has **no speed or rate parameter**, and **no SSML `<break>`**. You direct it three ways.

**Stability** is a named band, not a number:

| Setting | Use |
|---|---|
| `creative` | More expressive, prone to hallucination. **Avoid on this film** |
| **`natural`** | Closest to the original recording, balanced and neutral. **Use this.** It is the register `02` asks for |
| `robust` | Very stable, less responsive to direction. Try it if `natural` drifts |

```bash
python3 tts_eleven.py --render <VOICE_ID> --stability natural
```

**Punctuation** is your pacing tool. Ellipses create a pause and weight; capitals emphasise. The script's own full stops already do most of the work, and `K12` depends on them entirely.

**Audio tags** in square brackets do exist, and for this film you should mostly not use them. A dignified NGO welcome film does not want `[sighs]` or `[crying]`; the brief forbids exactly that register. The two that might earn their place:

- `[sincere]` or `[calm]` before `K27`'s `ಪೂರ್ತಿ ಅಲ್ಲ.`
- Nothing at all on `K34`, the hardest-to-reach line. Let it be plain. Any tag there turns four groups of real children into a performance.

If you add a tag, **re-run the audition and listen**. Tag effectiveness depends on the voice's training, and a tag that works on one voice does nothing on another.

## 6 · Render, then re-time the picture to the voice

This is the step that matters, and it is the opposite of what the scratch track did.

The macOS scratch voice had a rate control, so it could be squeezed to fit each shot. **v3 cannot.** So the order reverses, which is what `10` section F asks for anyway: *narration first, images second.*

```bash
cd anniversary-video-production/kannada/tools

# 1. render all 43 lines (~3,585 characters)
python3 tts_eleven.py --render <VOICE_ID> --stability natural

# 2. re-time the film to what the voice actually did
python3 build_timeline.py timeline.json --from-audio vo_eleven/<VOICE_ID>/durations.json

# 3. re-derive everything downstream
python3 make_srt.py timeline.json ../05-kannada-subtitles.srt
python3 gfx.py ../05-kannada-subtitles.srt
python3 film.py silent.mp4
```

`--render` prints, per line, how far the read landed from the predicted allocation, and flags anything more than 12 percent out. Step 2 then makes the picture match. **Expect the film to get longer.** A natural Kannada read of this script runs 5 to 10 percent over the cluster prediction; at +9 percent the film becomes **00:05:27:13**. That is not a fault, it is the real duration. If the event needs it shorter, `01` section 1 has the trim path, and it takes the time out of picture, not pace.

Then assemble the narration stem and mux. Lines are placed at each shot's start, so pauses and holds stay silent:

```bash
python3 - <<'EOF'
import json, glob, os, subprocess, wave, struct, math
SR=48000; V=sorted(glob.glob("vo_eleven/*/durations.json"))[-1]; D=os.path.dirname(V)
S=json.load(open("timeline.json")); M=json.load(open(V))
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

ffmpeg -i silent.mp4 -i vo_eleven/<VOICE_ID>/narration.wav \
  -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-16:TP=-3.0:LRA=11" \
  -c:a aac -b:a 192k -ar 48000 -ac 1 -shortest -movflags +faststart \
  ../08-kannada-animatic-preview.mp4
```

`-16 LUFS` for the online cut, `-23` for the event master. Narration peaks no higher than `-3 dBTP`. `14` item 8.7.

## 7 · Cost

Billed per character.

| Job | Characters |
|---|---|
| Audition, 5 lines | **288** |
| Full script, 43 lines | **3,585** |
| Full script, allowing 3 takes and revisions | ~11,000 |

Modest. Which means **there is no reason to skip the audition**, and no reason to accept a voice you are not happy with.

## 8 · What ElevenLabs does not solve

Be clear-eyed about this, because it decides whether you cast a human.

1. **`14` item 7.1 is still open.** It requires a native Kannada speaker who is not the translator to read the full script aloud and confirm it sounds spoken rather than translated. A synthesised read does not discharge that. It is a proxy, and a useful one, but a person has to do it.
2. **The seven pending line variants still need a human ear.** `01` section 6: ನಿಂತಿದೆ against ನಿಂತಿದ್ದಾರೆ against ನಿಂತುಕೊಂಡಿದೆ, ಎಚ್‌ಐವಿ ಇರುವ against ಪೀಡಿತ. Generate all of them and let the trustees choose by ear.
3. **The founder's own voice is still the best option for `K06`.** There is a six-second silent card where her quote sits. Her reading it would be worth more than any synthesised narration in the film.
4. **Terms of use and disclosure.** Check ElevenLabs' terms for the licence that attaches to generated audio at your plan level, and keep the record with the music licence under `14` item 5.2. Decide with the trustees whether a film for a children's charity, screened to the families in it, should say in its credits that the narration is synthesised. **My recommendation is yes**, one line in the end credits. It costs nothing and it is the kind of thing that, discovered later, costs a great deal.
5. **`14` item 5.5 does not apply, but its purpose does.** There is no narrator to release, so nothing to sign. That is precisely why point 4 matters.

## 9 · Quick reference

```bash
export ELEVENLABS_API_KEY=...
cd anniversary-video-production/kannada/tools

python3 tts_eleven.py --voices                       # find a v3-capable voice
python3 tts_eleven.py --audition <VOICE_ID>          # 288 chars, 5 decisive lines
python3 tts_eleven.py --render <VOICE_ID> --dry-run  # show payloads, spend nothing
python3 tts_eleven.py --render <VOICE_ID>            # 3,585 chars, all 43 lines
```

Never commit the key. Never change `model_id` off `eleven_v3`. Never strip the ZWNJ.
