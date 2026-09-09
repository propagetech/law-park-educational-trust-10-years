# Kannada narration pipeline

Generates the Kannada narration for the Law Park Educational Trust 10th
anniversary film with ElevenLabs, and drops the result straight into the
existing render chain.

Companions: [`09-elevenlabs-narration-guide.md`](../../kannada/09-elevenlabs-narration-guide.md),
[`02-kannada-voice-audition-plan.md`](../../kannada/02-kannada-voice-audition-plan.md),
and [`tools/tts_eleven.py`](../../kannada/tools/tts_eleven.py), which is the
Python pipeline this one sits beside.

---

## 1 · The three things that will catch you out

**Kannada is supported by `eleven_v3` only.** Multilingual v2, Turbo v2.5 and
Flash v2.5 do not list Kannada, and they are the default in almost every SDK
example. Sending Kannada to one returns an error or, worse, fluent-sounding
audio that is not Kannada. Every script here pins v3 and refuses anything else.

**v3 has no `speed` and no `style`, and its stability is three points, not a
slider.** creative 0.0, natural 0.5, robust 1.0. The voice brief specifies
per-scene speed and style floats; those are recorded as editorial intent and
dropped from the request. `manifests/narration-generation-log.csv` shows both.

**v3 reads square brackets as delivery tags.** The approved script uses
`[ವಿರಾಮ 2 ಸೆ]` and `[ಹಿಡಿ 1 ಸೆ]` for pauses. Those live in `timeline.json`'s
`pause` and `hold` fields and never reach the text. The preflight fails loudly
if a bracket gets into a payload.

## 2 · Setup

Node 20 or later. Nothing to install: native `fetch` and Node built-ins only, no
`package.json`, no dependencies. `ffmpeg` and `ffprobe` must be on PATH, which
they already are for the render chain.

```bash
node --version     # v20+
ffprobe -version
```

## 3 · The API key

From an environment variable, or the same key file `tts_eleven.py` uses:

```bash
export ELEVENLABS_API_KEY=...
# or
printf '%s' 'your-key' > ~/.elevenlabs_key && chmod 600 ~/.elevenlabs_key
```

**Keeping it out of git.** The key is never written to any generated file, never
logged, and never included in a report. Request headers are not printed by any
code path. `.gitignore` already covers `.env`, `.env.*`, `*.key` and
`.elevenlabs_key`. Do not add a key to `config/voice-config.json`: nothing reads
one from there.

Check what a run would authenticate with, without revealing it:

```bash
node -e 'import("./lib/key.mjs").then(m=>console.log(m.keySource()))'
```

## 4 · Find a voice

```bash
node scripts/list-elevenlabs-voices.mjs
```

Spends no characters. Writes `reports/available-voices.json` and
`reports/kannada-candidates.json`, and searches the public Voice Library as well
as the account, because **the account holds no Kannada voice**.

A Voice Library voice has to be added before it can be used. That changes the
account, so it is never automatic:

```bash
node scripts/add-shared-voice.mjs --list
node scripts/add-shared-voice.mjs --voice-id <ID> --yes
```

Read [`reports/kannada-voice-shortlist.md`](../reports/kannada-voice-shortlist.md)
for who is on the list and why, and what was rejected.

## 5 · Audition

Always dry-run first. It writes the exact payloads and spends nothing:

```bash
node scripts/generate-auditions.mjs --dry-run
```

Then, for real:

```bash
node scripts/generate-auditions.mjs --role primary --passages film
```

| Flag | Effect |
|---|---|
| `--dry-run` | Write planned payloads, send nothing |
| `--role primary` \| `alternative` | The female or male candidates from the shortlist |
| `--voices <id> <id>` | Specific voices |
| `--takes a c` | Skip a take. `b` is the creative band |
| `--passages main stress film` | `film` is built from the approved script and is the one that predicts the read |
| `--output-format` | Default `mp3_44100_128` for auditions |
| `--allow-noncommercial` | Proceed on a plan with no commercial licence. Throwaway tests only |

Three takes, separated by the only setting that changes a v3 performance:

| Take | Band | For |
|---|---|---|
| A | `natural` | Balanced documentary. The baseline |
| B | `creative` | The only more expressive option, and prone to hallucination. Audition it, do not assume it |
| C | `robust` | Cleanest diction, for a hall and for the years and counts |

Outputs go to `audition-audio/`, measurements to
`reports/audition-measurements.json`, one row per request to
`manifests/narration-generation-log.csv`.

## 6 · Choose a voice

Nothing in this pipeline can hear audio, so nothing in it may choose. Score by
ear with [`reports/voice-audition-scorecard.md`](../reports/voice-audition-scorecard.md),
then:

```bash
node scripts/score-auditions.mjs manifests/audition-scores.csv
```

It applies the automatic fails, refuses half-filled rows, and computes the
weighted total. The number is arithmetic, not a casting decision.

Then fill in `config/selected-voice.json`. It ships as a template with
`voice_id: null`, and `generate-final-narration.mjs` refuses to run from a
template.

Before the full read: trustee approval of a 30 second opening sample
(`02` section 7, `14` item 7.1), and two Kannada-native listeners on
[`reports/pronunciation-and-pickups.md`](../reports/pronunciation-and-pickups.md).

## 7 · Generate the narration

```bash
node scripts/generate-final-narration.mjs --voice-id <ID> --dry-run
node scripts/generate-final-narration.mjs --voice-id <ID> --scene opening
node scripts/generate-final-narration.mjs --voice-id <ID>
node scripts/generate-final-narration.mjs --voice-id <ID> --variants --vo-eleven
```

| Flag | Effect |
|---|---|
| `--scene <id>` | One scene: `opening origin decade method community gratitude future closing` |
| `--sid K25 K27` | Named lines only. This is how a pickup is done |
| `--variants` | Also generate the creative alternate for the six scenes the brief calls emotionally important |
| `--vo-eleven` | Also write into `kannada/tools/vo_eleven/<ID>/` so `stem.py` needs no changes |
| `--handle-ms 500` | Handle length in the scene concat manifests |
| `--output-format` | Default `mp3_44100_192`, which needs Creator or above |

**One file per line, not per scene.** `stem.py` places each line at its own
shot's `t_in` so pauses stay silent, and `build_timeline.py --from-audio`
re-times the picture from a per-line `durations.json`. A scene is a group of
lines, so a mispronounced word costs one short retake instead of a block.

**No silence is padded into the files.** The brief asks for 300 to 700 ms
handles. Those are interleaved silence in `scenes/<id>.concat.txt`, not baked
into the line files: `durations.json` feeds the re-time, and padded files would
re-time the picture to the padding.

## 8 · A single pickup

```bash
node scripts/generate-final-narration.mjs --voice-id <ID> --sid K25
```

`durations.json` is read before it is written, so only the regenerated lines
change. If a line moves more than about 12 percent the script says so, and the
picture has to be re-derived:

```bash
cd ../kannada/tools
python3 build_timeline.py timeline.json --from-audio vo_eleven/<ID>/durations.json
python3 make_srt.py timeline.json ../05-kannada-subtitles.srt
python3 gfx.py ../05-kannada-subtitles.srt
python3 film.py silent.mp4
python3 stem.py <ID>
```

## 9 · Cost

Billed per character, on the text after the year rewrite.

| Job | Characters |
|---|---|
| Film passage, 3 voices, 3 takes | 2,457 |
| Brief's two passages, 3 voices, 3 takes | 5,292 |
| Brief's two passages, all 6 voices, 3 takes | 10,584 |
| Full film read, 43 lines | 3,585 |
| Full read plus variants for 6 scenes | 5,777 |

The free plan is 10,000 characters a month, so the full six-voice audition does
not fit in one month. Start with `--role primary --passages film` at 2,457.

The preflight refuses a run that exceeds the remaining allowance, before sending
anything, and tells you what it would have cost.

## 10 · What the preflight checks

Every generator runs this first, once, and exits `3` without sending anything if
it fails:

1. A key is reachable.
2. The model can speak Kannada at all.
3. The year map here agrees with the one in `tts_eleven.py`.
4. No square brackets reached any payload.
5. The run fits in the remaining character allowance.
6. The plan carries a commercial licence.
7. Every voice is actually on the account.

## 11 · Files

```
lib/            paths, key, API client, text prep, scene blocks, takes, logging
scripts/        list voices, add a library voice, auditions, scoring, final read, cue sheet
config/         voice-config.example.json, selected-voice.json, audition-shortlist.json
reports/        available voices, candidates, shortlist, scorecard, recommendation, pronunciation
manifests/      narration-cue-sheet.csv, narration-generation-log.csv
audition-audio/ gitignored
final-narration/ gitignored
```

Regenerate the cue sheet whenever the timeline changes. It is derived, never
hand-edited:

```bash
node scripts/write-cue-sheet.mjs
```
