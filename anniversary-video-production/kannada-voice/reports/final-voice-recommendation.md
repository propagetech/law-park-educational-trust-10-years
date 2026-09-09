# Final voice recommendation

**No voice is recommended yet, and none can be.** Three things have to happen
first, and two of them are decisions rather than work.

---

## 1 · What blocks a recommendation

Three findings, all measured against the live account rather than read off
descriptions. The first is the one that matters most.

### No Kannada voice anywhere is actually verified for Kannada

All 20 Kannada voices in the Voice Library carry `verified_languages`, and every
entry is **Hindi**, or English for two of them. Not one Kannada entry, and not
one verified against v3. The models they are verified on, turbo_v2_5,
flash_v2_5 and multilingual_v2, do not support Kannada at all.

So "Kannada" in those names and descriptions is unverified copy. Casting one is
a bet that a Hindi-verified clone, driven by a model it was never verified
against, produces credible Kannada. It might. Nothing in the metadata says so,
and nothing in this repository can hear whether it does.

**This makes an Instant Voice Clone the strongest option on the table**, and it
is not a new idea: `09` section 2 already says a clone of a real Kannada speaker
will beat any stock voice on this script, and `05` section 6 rank 5 already asks
for 30 to 45 seconds of Charulatha M. R. speaking Kannada to camera. One
recording would then do three jobs: the clone, the founder's own voice on the
silent K06 quote card, and `14` item 7.1's native-speaker confirmation.

### A free plan cannot use library voices through the API

Padhma was added to the account and called. The API answered:

```
HTTP 402  paid_plan_required
"Free users cannot use library voices via the API.
 Please upgrade your subscription to use this voice."
```

Refused before synthesis, so it cost nothing, and the character balance is
untouched at 0 of 10,000 used. But it is absolute, and every Kannada voice is a
library voice.

Separately confirmed, so the diagnosis is precise: **`eleven_v3` itself works on
the free plan.** A premade voice returned 23.4 seconds of Kannada audio from 273
characters. The gate is on library voices specifically, not on the model, not on
v3 access, and not on credits.

**A paid plan is therefore unavoidable to hear any Kannada voice.**

### The plan also carries no commercial licence

ElevenLabs grants one from Starter upward. This film is screened at a public
event and published by a registered trust, so narration generated on the free
plan would leave the trust using audio it is not licensed for. That belongs in
the same file as the music licence and the photo consents, `14` item 5.2.

Both of these resolve with the same upgrade, which is convenient: the cheapest
paid tier fixes the 402 and the licence together.

### And nobody has listened yet

Nothing in this pipeline can hear audio. The scorecard's subjective columns are
empty on purpose. `14` item 7.1 needs a native Kannada speaker who is not the
translator, and `02` section 7 needs trustee approval of a 30 second opening
sample before the full read.

### Voice already added

`Padhma - Calm Kannada Audiobook` (`eESo8CL7VOqMtWCh1ikK`) is on the account
now, taking the count from 21 to 22. It is unusable until the plan is upgraded.
Nothing else was added.

## 2 · The order to audition in

Metadata only, and after section 1 the metadata is known to be thin: none of
these is verified for Kannada. This is a running order for a listening test, not
a ranking of Kannada quality.

**Audition option 0, ahead of all of them: an Instant Voice Clone** of a Kannada
speaker, ideally the founder. It is the only route where the Kannada is verified
by construction rather than asserted in a product description.

| # | Voice | ID | Why it is in this position |
|---|---|---|---|
| 1 | Padhma - Calm Kannada Audiobook | `eESo8CL7VOqMtWCh1ikK` | Female, `high_quality`, audiobook register. The closest thing in the library to long-form documentary narration, in the category that behaves better on v3. |
| 2 | Mani - Steady Kannada Storyteller | `1dRM7GYsStGPro8wPFGA` | The male alternative, and the best description in the library: sounds like someone who trusts the story enough not to perform it. Audition it early rather than treating male as a fallback. |
| 3 | Sharadhi - Natural Kannada Conversation | `7B4TkucyQHy3r9hvAnhg` | Female, `high_quality`, natural. Conversational register is the risk. |
| 4 | Aisiri - Warm Kannada Narration | `1yebI4wPatIbQgkzinlP` | Best description against the brief, but a Professional Voice Clone and therefore a v3 risk. Audition it to find out whether the caveat bites. |
| 5 | Srivatsa - Kannada Narration | `UeUC009F3NYPIArcZmq0` | Reserve. |
| 6 | Srinatha - Kannada Factual Documentary | `QnERnlMSVcCo1wktWlfs` | Reserve. The only voice that names documentary as its register, but Professional. |

Cheapest audition that actually predicts the read, 2,457 characters:

```bash
node scripts/generate-auditions.mjs --role primary --passages film
```

That is the three female candidates, three takes each, on the four lines that
decide the film. Add `--voices 1dRM7GYsStGPro8wPFGA` to include Mani.

## 3 · Settings, once a voice is chosen

The brief's per-scene numbers cannot be used as written. On `eleven_v3`, the only
model that speaks Kannada:

| Brief asks for | Reality on v3 |
|---|---|
| speed 0.90 to 0.98 per scene | **No speed parameter.** Pace comes from punctuation. Re-time the picture to the read instead |
| style 0.05 to 0.22 per scene | **No style parameter.** Expressiveness comes from the stability band and the text |
| stability 0.42 to 0.62 per scene | **Three points only:** creative 0.0, natural 0.5, robust 1.0 |
| SSML breaks for pauses | **Not supported.** Pauses are `pause` and `hold` fields in the timeline |

So the brief's intent is mapped rather than transcribed, in `lib/blocks.mjs`:

| Scene | Shots | Band | Why |
|---|---|---|---|
| opening | K02 to K05 | `natural` | The brief wants intimate. `creative` is the only more expressive option and it hallucinates, which this film cannot afford |
| origin | K07 to K13 | `natural` | Carries K12, an automatic fail line |
| decade | K14 to K23 | `robust` | Most of the film's years, counts and place names. Diction outranks warmth |
| method | K24 to K30 | `robust` | Carries K27, the film's turn, and the 75 percent line |
| community | K31 to K35 | `natural` | Warmer. K34 names real children and must stay plain |
| gratitude | K36 to K40 | `natural` | Award and publication names must be unhurried |
| future | K41 to K43 | `natural` | Hopeful, no lift at line ends |
| closing | K44 to K45 | `natural` | Carries ಸಂಭ್ರಮ |

Every dropped and snapped field is recorded per request in
`manifests/narration-generation-log.csv`, so the log shows the brief's intent
beside what the API actually received.

## 4 · Expect the takes to split

The three takes are allowed to win different scenes, and that is the likely
outcome rather than indecision:

- **Take C, `robust`** for `decade` and `method`. Years, counts, place names, and
  the 75 percent line.
- **Take A, `natural`** for `opening`, `origin`, `community`, `gratitude`,
  `future`, `closing`.
- **Take B, `creative`** only if it survives the proper nouns cleanly. If it
  drifts on ಮುಖ್ಯೋಪಾಧ್ಯಾಯರೋ or ಚಿಕ್ಕಬಳ್ಳಾಪುರ, it is out however warm it sounds.

`--variants` generates the creative alternate for the six scenes the brief calls
emotionally important, so the edit has the option without paying for a second
full read.

## 5 · Runtime

The film is **00:05:37:22**, not five minutes. 43 narrated lines, 3,585
characters, 460 words over 296.9 seconds of speech, which is **93 words per
minute**.

The brief asks for 100 to 110 wpm. The approved edit is cut to 93. Do not chase
the brief's number: v3 has no speed control to chase it with, and the picture is
already built around the slower read. `09` section 6 expects a natural Kannada
read to land 5 to 10 percent over the cluster prediction, and treats that as the
real duration rather than a fault.

## 6 · Before the full read

1. Add the chosen voice to the account.
2. Upgrade to a plan with a commercial licence, or accept in writing that the
   narration is a non-commercial draft.
3. Generate the opening only, and get trustee approval on it:
   `node scripts/generate-final-narration.mjs --voice-id <ID> --scene opening`
4. Two Kannada-native listeners on `reports/pronunciation-and-pickups.md`.
5. Fill in `config/selected-voice.json`. The generator refuses to run from the
   template.
6. Decide with the trustees whether the end credits disclose that the narration
   is synthesised. `09` section 8 recommends yes, one line. It costs nothing, and
   discovered later it costs a great deal.
