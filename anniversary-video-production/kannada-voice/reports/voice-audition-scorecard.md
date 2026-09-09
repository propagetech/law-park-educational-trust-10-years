# Voice audition scorecard

**The subjective columns in this document are deliberately empty.**

Nothing in this pipeline can hear audio. Duration, words per minute, file size
and format are measured automatically and written to
`reports/audition-measurements.json`. Everything that requires an ear is left
blank for a human, because a filled-in score that nobody listened to is worse
than an empty one: it looks like evidence.

Fill in the CSV, then compute the weighted totals:

```bash
node scripts/score-auditions.mjs manifests/audition-scores.csv
```

---

## 1 · Automatic fails

Apply these before scoring anything. A voice that fails one is rejected
regardless of its total. Both come from `02` section 6 and are restated in
`09` section 3.

1. **`K12`** ಚಿಕ್ಕಬಳ್ಳಾಪುರ. ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ.
   Three sentences, three full stops. Read as a rising comma list, the voice is
   out. Most voices fail this.
2. **`K27`** ...ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು ಭರಿಸುತ್ತದೆ. ಪೂರ್ತಿ ಅಲ್ಲ.
   The second sentence must be level and quiet. Emphasised, the voice is out.
3. **Any hallucinated or invented syllable in a proper noun.** This is what take
   B, the creative band, is being tested for. Warmth does not buy it back.

## 2 · What is measured for you

From `reports/audition-measurements.json`:

| Field | Note |
|---|---|
| `duration_s` | ffprobe |
| `words_per_minute` | against the brief's 100 to 110, and the approved script's actual 93 |
| `bytes`, format | confirms the tier the output really came back at |
| `settings_sent` | what the API received, after v3 dropped style and speed |

On words per minute: the approved Kannada script and timeline run at **93 wpm**
across 296.9 seconds of speech. The brief asks for 100 to 110. Those disagree,
and the timeline is the one the picture is cut to. Treat a read near 93 as
correct and a read near 110 as rushed, not the other way round.

## 3 · Scoring grid

Score each of the 15 criteria from 1 to 5 for every voice and take. The seven
weighted groups are what the final score is built from.

| # | Criterion | Group | Weight |
|---|---|---|---|
| 1 | Native Kannada authenticity | Kannada authenticity | 20% |
| 2 | Natural pronunciation of Kannada | Kannada authenticity | |
| 3 | Lack of English or Hindi influenced pronunciation | Kannada authenticity | |
| 4 | Clarity and diction | Clarity and diction | 15% |
| 5 | Lack of robotic or synthetic quality | Clarity and diction | |
| 6 | Cinematic documentary feel | Cinematic documentary feel | 15% |
| 7 | Quiet confidence | Cinematic documentary feel | |
| 8 | Lack of excessive drama | Cinematic documentary feel | |
| 9 | Pronunciation of names and locations | Proper nouns and numbers | 15% |
| 10 | Number and year pronunciation | Proper nouns and numbers | |
| 11 | Warmth | Warmth and humility | 15% |
| 12 | Humility and dignity | Warmth and humility | |
| 13 | Emotional restraint | Warmth and humility | |
| 14 | Long-form listener comfort over five minutes | Long-form comfort | 10% |
| 15 | Suitability for auditorium playback | Auditorium suitability | 10% |
| | Fit for Law Park Educational Trust's story | tie-break, not scored | |

Weighted total = 20%(1,2,3 mean) + 15%(4,5 mean) + 15%(6,7,8 mean)
+ 15%(9,10 mean) + 15%(11,12,13 mean) + 10%(14) + 10%(15), scaled to 5.

## 4 · Score sheet

One row per voice and take. Copy to `manifests/audition-scores.csv` and fill in.

```
voice_id,voice_name,take,passage,listener,c1,c2,c3,c4,c5,c6,c7,c8,c9,c10,c11,c12,c13,c14,c15,k12_pass,k27_pass,hallucination,notes
eESo8CL7VOqMtWCh1ikK,Padhma - Calm Kannada Audiobook,a,main,,,,,,,,,,,,,,,,,,,,
eESo8CL7VOqMtWCh1ikK,Padhma - Calm Kannada Audiobook,b,main,,,,,,,,,,,,,,,,,,,,
eESo8CL7VOqMtWCh1ikK,Padhma - Calm Kannada Audiobook,c,main,,,,,,,,,,,,,,,,,,,,
7B4TkucyQHy3r9hvAnhg,Sharadhi - Natural Kannada Conversation,a,main,,,,,,,,,,,,,,,,,,,,
7B4TkucyQHy3r9hvAnhg,Sharadhi - Natural Kannada Conversation,b,main,,,,,,,,,,,,,,,,,,,,
7B4TkucyQHy3r9hvAnhg,Sharadhi - Natural Kannada Conversation,c,main,,,,,,,,,,,,,,,,,,,,
1yebI4wPatIbQgkzinlP,Aisiri - Warm Kannada Narration,a,main,,,,,,,,,,,,,,,,,,,,
1yebI4wPatIbQgkzinlP,Aisiri - Warm Kannada Narration,b,main,,,,,,,,,,,,,,,,,,,,
1yebI4wPatIbQgkzinlP,Aisiri - Warm Kannada Narration,c,main,,,,,,,,,,,,,,,,,,,,
```

`k12_pass`, `k27_pass` and `hallucination` take `yes` or `no`. A `no` on either
pass column, or a `yes` on hallucination, rejects that take outright.

## 5 · How to listen

1. **On a speaker, not headphones.** This plays in a hall. `09` section 3.
2. Then check it on a phone speaker and a laptop, because the online cut will be
   watched on both.
3. **Two Kannada-native listeners, neither of them the translator.** `14` item
   7.1 requires this and a synthesised read does not discharge it. Give them
   `reports/pronunciation-and-pickups.md` and nothing else, so they are not
   primed by the scores.
4. Score take by take, not voice by voice, so a strong voice in a weak take is
   not written off.
5. The three takes are allowed to win different scenes. That is the expected
   outcome, not a failure to decide: see `final-voice-recommendation.md`.
