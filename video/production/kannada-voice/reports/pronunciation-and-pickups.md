# Pronunciation and pickups

Give this document to the Kannada-native listeners and nothing else. No scores,
no shortlist, no recommendation, so they are not primed.

Every shot id below is a real line in
`video/production/kannada/tools/timeline.json`. The full text of
each is in `manifests/narration-cue-sheet.csv`, column `narration_kannada`,
beside exactly what the API will be sent in
`sent_to_tts_after_year_rewrite`.

---

## 1 · The brief's checklist against the film, corrected

An earlier version of this document said the trust's own name and the eastern
place names were not narrated. **That was wrong.** It came from searching for
the Latin string "Law Park" when the script writes the name in Kannada script as
ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್. Corrected below and checked in Kannada script
throughout.

| In the brief's checklist | In the narrated script? |
|---|---|
| Law Park Educational Trust | **yes.** Full name in **K07** and **K45**; ಟ್ರಸ್ಟ್ alone in K05 K08 K17 K27 K35 K41 |
| ಹೆಚ್. ಡಿ. ಕೋಟೆ | **yes**, written ಎಚ್.ಡಿ. ಕೋಟೆ in **K20** and **K23** |
| ಎಂ. ಎಂ. ಹಿಲ್ಸ್ | **yes**, written ಎಂ.ಎಂ. ಹಿಲ್ಸ್ in **K22** |
| ಮೈಸೂರು | **yes**, K20 |
| ಚಿಕ್ಕಬಳ್ಳಾಪುರ | **yes**, K12 |
| ವಿದ್ಯಾರ್ಥಿವೇತನ | **yes**, K12 K14 K31 K36 |
| ಗ್ರಂಥಾಲಯ | **yes**, K18 K32 K43 |
| ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ | **yes**, K21 K32 |
| ಚಾರುಲತಾ ಎಂ. ಆರ್. | **yes**, K08 |
| ಎಸ್. ಎಂ. ಮಂಜುನಾಥ | **yes**, K09 |
| ಸಾದೇನಹಳ್ಳಿ | **yes**, K09 |
| ಭಾರತ್ ಶಿಕ್ಷಾ ರತ್ನ ಪ್ರಶಸ್ತಿ | **yes**, K37 |
| ಸ್ಕಾಲರ್‌ಶಿಪ್ | no. The narration uses ವಿದ್ಯಾರ್ಥಿವೇತನ throughout |
| ಉದಯವಾಣಿ | no. It is a visual clipping moment, not narration |
| ಮುಳಬಾಗಿಲು | no |

So the brief's checklist is mostly right, and **the trust's own name is the most
important proper noun in the film**: it carries the welcome line, K45, which is
the last thing the audience hears.

Note how the initialisms are actually written, because it changes what the voice
is being asked to do: ಎಚ್.ಡಿ. and ಎಂ.ಎಂ. are set with no space after the first
full stop, while ಎಂ. ಆರ್. and ಎಸ್. ಎಂ. are spaced. v3 reads punctuation, so the
two forms may be delivered differently. Check both.

### Three words the brief misses entirely

**ಮುಖ್ಯೋಪಾಧ್ಯಾಯರೋ** (K25), **ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು** (K27) and **ಸಂಭ್ರಮ** (K45) are
absent from the brief's stress test, and they are the three that actually decide
a Kannada voice on this script.

That is why `--passages film` exists. It is built live from K12, K25, K27 and
K45, so it covers the two automatic-fail lines, the hardest word in the script,
and the trust name in the welcome line. It is the passage that predicts the read.

## 2 · The words that break a Kannada voice

| Word | Shots | What failure sounds like |
|---|---|---|
| ಮುಖ್ಯೋಪಾಧ್ಯಾಯರೋ | K25 | Anything at all. The hardest word in the script |
| ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು | K27 | Stumbles, or splits into two words |
| ವಿದ್ಯಾರ್ಥಿವೇತನ | K12 K14 K31 K36 | Compressed to four syllables, or ರ್ಥಿ broken into "ra-thi" |
| ಚಿಕ್ಕಬಳ್ಳಾಪುರ | K12 | The doubled ಳ್ಳ flattened to a single ಳ |
| ಸಂಭ್ರಮ | K45 | The ಭ್ರ conjunct read as "bha-ra". Second-to-last word in the film |
| ಗ್ರಂಥಾಲಯ | K18 K32 K43 | The ಂಥಾ conjunct broken up |
| ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ | K21 K32 | ವೃ flattened, or ರ್ಶ split into "ra-sha" |
| ಭಾರತ್ ಶಿಕ್ಷಾ ರತ್ನ ಪ್ರಶಸ್ತಿ | K37 | An award title rushed. It has to be audible and unhurried |
| ಸಾದೇನಹಳ್ಳಿ | K09 | The ಳ್ಳಿ ending |
| ಚಾರುಲತಾ ಎಂ. ಆರ್. | K08 | The initials read as a word instead of letters |
| ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ | K07 K45 | Over-Indianised, or spelled out as Kannada letters. It should sound like the English name inside a Kannada sentence. K45 is the welcome line and the last thing the audience hears |
| ಎಚ್.ಡಿ. ಕೋಟೆ | K20 K23 | Read as a word rather than the letters H D, then ಕೋಟೆ |
| ಎಂ.ಎಂ. ಹಿಲ್ಸ್ | K22 | Same, plus the English "Hills" and its non-joiner |

## 3 · Years

Nine lines carry a year numeral. v3 reads `2016ರಲ್ಲಿ` as English "two thousand
sixteen", so the numerals are rewritten to Kannada number words before the
request. `2016ರಲ್ಲಿ` goes out as `ಎರಡು ಸಾವಿರದ ಹದಿನಾರರಲ್ಲಿ`, with the case
ending attached so the sandhi is right.

The map lives in two places by necessity, `lib/speak-text.mjs` and
`tools/tts_eleven.py`. The preflight compares them on every run and refuses to
proceed if they have drifted apart.

Subtitles and on-screen text keep the Arabic numerals. Only the TTS payload is
rewritten. Confirm in the cue sheet that no line was rewritten that should not
have been.

After the rewrite **no bare numerals remain** in any narrated line, so there is
nothing left in the film for v3 to read as English digits. The brief's stress
test does still contain `200` and `300`, but those numbers are not spoken in the
film.

## 4 · The zero-width non-joiner

Ten narrated lines carry U+200C: K07 K19 K22 K31 K34 K36 K37 K39 K41 K45. It is
deliberate. Nothing in this pipeline calls `.normalize()` and nothing strips it.

If a listener reports a word in one of those lines sounding fused or wrong, check
the character survived into the payload before blaming the voice.

## 5 · The two automatic fails

Neither is about accent. Both are about reading punctuation.

**K12** ಚಿಕ್ಕಬಳ್ಳಾಪುರ. ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ.
Three sentences, three full stops. Most voices read it as a rising comma list.
If it lists, the voice is rejected regardless of its total.

**K27** ...ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು ಭರಿಸುತ್ತದೆ. ಪೂರ್ತಿ ಅಲ್ಲ.
The film's turn. ಪೂರ್ತಿ ಅಲ್ಲ. must be level and quiet, never emphasised. The
silence around it belongs to the edit; the voice must not perform the pause.

## 6 · Pickups

A pickup is one line, not a scene. Nothing needs regenerating around it.

```bash
node scripts/generate-final-narration.mjs --voice-id <ID> --sid K25
node scripts/generate-final-narration.mjs --voice-id <ID> --sid K27 K45
```

`durations.json` is read before it is written, so a pickup updates only the
lines it regenerated and leaves the rest of the read intact.

If a pickup changes a line's length by more than about 12 percent the picture
has to be re-timed to it, which the script tells you at the end of the run:

```bash
cd ../kannada/tools
python3 build_timeline.py timeline.json --from-audio vo_eleven/<ID>/durations.json
python3 make_srt.py timeline.json ../05-kannada-subtitles.srt
python3 gfx.py ../05-kannada-subtitles.srt
python3 film.py silent.mp4
python3 stem.py <ID>
```

## 7 · What a synthesised read does not settle

`14` item 7.1 requires a native Kannada speaker who is **not the translator** to
read the full script aloud and confirm it sounds spoken rather than translated. A
synthesised read is a useful proxy and does not discharge that item.

`01` section 6 still lists seven pending line variants: ನಿಂತಿದೆ against
ನಿಂತಿದ್ದಾರೆ against ನಿಂತುಕೊಂಡಿದೆ, ಎಚ್‌ಐವಿ ಇರುವ against ಪೀಡಿತ. Generate all of
them and let the trustees choose by ear. They are cheap: a handful of lines.
