# Kannada cinematic voice pipeline (ElevenLabs)

Programmatic voice discovery, controlled auditions, and scene-by-scene narration for the Law Park Educational Trust 10th Anniversary Welcome Film.

## Requirements

- Node.js **20+**
- `ELEVENLABS_API_KEY` in the environment (preferred), or `~/.elevenlabs_key` (chmod 600)
- **Model must be `eleven_v3`** — Kannada is not supported on multilingual v2 / turbo / flash

Never put the API key in this folder, in JSON configs, in browser code, or in Git.

## Install

No npm package required. Scripts use Node 20 native `fetch`.

```bash
cd anniversary-video-production/kannada-voice
export ELEVENLABS_API_KEY=...   # do not paste into chat logs or commit
```

## Commands

```bash
# 1. List account voices + shared Kannada library hits
node scripts/list-elevenlabs-voices.mjs

# 2. Plan auditions without spending credits
node scripts/generate-auditions.mjs --dry-run

# 3. Add shortlisted library voices to the account, then generate Takes A/B/C
node scripts/generate-auditions.mjs --add-shared
node scripts/generate-auditions.mjs --voice-id 1yebI4wPatIbQgkzinlP

# 4. After trustee approval of the ~30s opening test, set config/selected-voice.json
node scripts/generate-final-narration.mjs --dry-run
node scripts/generate-final-narration.mjs --voice-id "VOICE_ID" --scene opening
node scripts/generate-final-narration.mjs --scene closing
node scripts/generate-final-narration.mjs --only K12 K27
node scripts/generate-final-narration.mjs --scene opening --variant b
```

## Select a voice

1. Listen to `audition-audio/voice-*-take-{a|b|c}.mp3` on headphones, phone, laptop, and the event PA if available.
2. Fill `reports/voice-audition-scorecard.md` with two Kannada-native listeners.
3. Copy the winner into `config/selected-voice.json` (see `voice-config.example.json`).
4. Set `approval.opening_30s_approved` to `true` only after the opening test is signed off.

## Takes

| Take | Best for | Stability | Similarity | Style | Speed\* |
|---|---|---:|---:|---:|---:|
| A | Safest documentary baseline | 0.52 | 0.75 | 0.10 | 0.95 |
| B | Opening, origin, gratitude, closing | 0.42 | 0.78 | 0.20 | 0.92 |
| C | Dates, numbers, milestones | 0.60 | 0.75 | 0.08 | 0.97 |

\* `eleven_v3` does **not** reliably honour speed. Speed values are kept as editorial intent and omitted from API requests. Pace is shaped by script pauses and per-line generation.

## Final narration strategy

- One request per timeline line (`K02`…`K45`), never one five-minute blob
- Scene packs: `opening`, `origin`, `timeline`, `scholarship`, `community`, `closing`
- Variant `b` only on emotional scenes when you need an editorial alternate
- Year numerals are rewritten to Kannada number words before TTS (same rules as `kannada/tools/tts_eleven.py`)
- Cue sheet: `manifests/narration-cue-sheet.csv`
- Sanitized generation log: `manifests/narration-generation-log.csv`

## Prevent keys entering Git

- `.env` and `.env.*` are gitignored
- `.elevenlabs_key` and `*.key` are gitignored
- `audition-audio/` and `final-narration/` are gitignored
- Scripts never write the key into reports

## Estimated API usage

| Stage | Rough character spend |
|---|---|
| One audition take (main + stress copy) | ~450–550 chars |
| 6 voices × 3 takes | ~8k–10k chars |
| Full film (43 narrated lines) | ~3.5k–4k chars (after year rewrite) |
| Emotional variants (selected scenes only) | +1k–2k chars |

Always run `--dry-run` first. Free-tier monthly caps are easy to exhaust.

## Relationship to existing `kannada/tools`

This folder is the **voice casting / retake** pipeline. The locked picture build still uses:

`anniversary-video-production/kannada/tools/tts_eleven.py` → `vo_eleven/<voice_id>/` → `build_timeline.py --from-audio`

After you choose a winner here, either:

- point the Python tool at the same `voice_id`, or
- copy approved MP3s into the tools chain and re-time the picture

## Safety

- No celebrity / actor / broadcaster cloning
- No invented Kannada script changes (use `reports/pronunciation-and-pickups.md` for suggestions only)
- Commercial use must stay within the connected ElevenLabs plan and each voice’s licence terms
