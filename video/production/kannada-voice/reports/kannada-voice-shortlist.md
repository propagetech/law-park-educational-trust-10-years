# Kannada voice shortlist

Generated from the live account and the ElevenLabs Voice Library.
Regenerate the data behind it with `node scripts/list-elevenlabs-voices.mjs`.

**Nothing in this document has heard a voice.** Every judgement below is read off
metadata, descriptions and category. It exists to decide what to audition, not
what to cast.

---

## 1 · What the account actually holds

| | |
|---|---|
| Plan | **free** |
| Characters | 10,000 per month |
| Voices on the account | 21 |
| Kannada voices on the account | **0** |
| Voice Library Kannada voices found | 20 |

All 21 account voices are English premade voices: Alice, George, Brian, Callum,
Chris, Jessica, Sarah, Liam and so on. Not one of them has a verified Kannada
entry, and none is listed against a v3 model.

Two consequences follow, and both have to be settled before any audio is worth
generating.

**The voices have to be added.** Every Kannada voice is in the public Voice
Library, not on the account. A library voice cannot be generated with until it
is added, which changes the account and may consume a voice slot. Use
`node scripts/add-shared-voice.mjs --voice-id <id> --yes`. The preflight in
every generator refuses to run until the voice is present.

**The plan has no commercial licence.** ElevenLabs grants one from Starter
upward. This film is screened at a public event and published by a registered
trust, so narration generated on the free plan would leave the trust using audio
it is not licensed for. That belongs in the same file as the music licence and
the photo consents, `14` item 5.2. The preflight blocks a real run on a
non-commercial plan.

## 2 · How a voice qualified

`verified_languages` is the field that decides this, not the description. A
verified Kannada entry has a real Kannada preview behind it and names the model
that produced it.

| Tier | Meaning | Found |
|---|---|---|
| 1 | `verified_languages` lists Kannada | 0 on the account |
| 2 | Labels or description claim Kannada, unverified | 0 on the account |
| 3 | Other Indian languages verified, Kannada not | 8 on the account |
| Library | Voice Library search for Kannada | 20 |

One caveat that runs through the whole library list: the library's `language`
filter is useless for Kannada. Several Kannada voices are tagged with a
different primary language, so `language=kn` returns nothing at all. The search
in `lib/eleven.mjs` matches on name and description instead, and filters the
results for genuine Kannada mentions.

## 3 · Two things the metadata claims that turned out to be false

Both were found by adding a voice and calling the API, not by reading
descriptions. They change how this list should be read.

### Not one of the 20 voices is verified for Kannada

Every one of them carries `verified_languages`, and every one of those entries
is **Hindi**, or English for two of them. Not a single Kannada entry, and not one
verified against v3:

| Voice | Verified language | Verified on |
|---|---|---|
| Padhma - Calm Kannada Audiobook | `hi` | turbo_v2_5, flash_v2_5, multilingual_v2 |
| Mani - Steady Kannada Storyteller | `hi` | turbo_v2_5, flash_v2_5 |
| Aisiri - Warm Kannada Narration | `hi` | multilingual_v2, turbo_v2_5 |
| Srinatha - Kannada Factual Documentary | `hi` | turbo_v2_5, flash_v2_5 |
| Kannada - Surprised and Paranoid | `en` | multilingual_v2, turbo_v2_5 |
| Sanjay | `en` | turbo_v2_5, flash_v2_5 |
| ...and 14 more | `hi` | none list v3 |

None of turbo_v2_5, flash_v2_5 or multilingual_v2 supports Kannada at all. So
the word "Kannada" in these names and descriptions is **unverified copy**, and
casting one of them is a bet that a Hindi-verified clone, driven by a model it
was never verified against, produces credible Kannada.

This is exactly the risk `09` section 2 names, and it makes that section's other
recommendation the strongest option on the table: **an Instant Voice Clone of a
real Kannada speaker will beat any of these.** `05` section 6 rank 5 already
asks for 30 to 45 seconds of Charulatha M. R. speaking Kannada to camera. That
recording would serve twice, and it would also answer `14` item 7.1.

### The library's `category` does not mean what it looks like

In the library, Padhma reads `high_quality` and Aisiri reads `professional`, and
the first draft of this shortlist ranked on that difference. It does not survive
contact with the account: once Padhma is added, the account reports
`category: professional`, so it is a Professional Voice Clone too.

The library `category` is a quality tier, not a clone type. It therefore says
nothing about the one thing that mattered here, which is that ElevenLabs
documents Professional Voice Clones as weaker on v3. Treat all 20 as
professional clones until an account-side `category` says otherwise.

### And a free plan cannot use any of them

Adding Padhma and calling the API returns:

```
HTTP 402  paid_plan_required
"Free users cannot use library voices via the API.
 Please upgrade your subscription to use this voice."
```

Refused before synthesis, so it costs nothing, but it is absolute. Separately
confirmed: **`eleven_v3` itself works fine on the free plan** with a premade
voice, 273 characters returning 23.4 seconds of audio. The gate is on library
voices specifically, not on the model and not on the character balance.

Since every Kannada voice is a library voice, **Kannada narration requires a paid
plan.** There is no free path to hearing any of these voices.

## 4 · Shortlist

Machine-readable: `config/audition-shortlist.json`. Read section 3 first: the
`category` column below is the account-side clone type, and **no voice here is
verified for Kannada.** This is a running order for a listening test, not a
ranking of Kannada quality, which nothing in this repository can assess.

### Primary target, female, age impression 35 to 50

| # | Voice | ID | Category | Why |
|---|---|---|---|---|
| 1 | Padhma - Calm Kannada Audiobook | `eESo8CL7VOqMtWCh1ikK` | professional | Audiobook is the closest register in the library to long-form documentary narration, and it is described as unhurried and measured, which is the brief. **Added to the account; verified for Hindi, not Kannada.** |
| 2 | Sharadhi - Natural Kannada Conversation | `7B4TkucyQHy3r9hvAnhg` | professional | Female, described as natural rather than performed. The conversational register is the risk: listen for whether it can carry a hall. |
| 3 | Aisiri - Warm Kannada Narration | `1yebI4wPatIbQgkzinlP` | professional | The best description against the brief in the entire library: warm, well paced Kannada narration. No longer held back relative to the others, since all 20 are professional clones. |

### Alternative, male, age impression 40 to 55

| # | Voice | ID | Category | Why |
|---|---|---|---|---|
| 4 | Mani - Steady Kannada Storyteller | `1dRM7GYsStGPro8wPFGA` | professional | Described as sounding like someone who trusts the story enough not to perform it. That is the brief almost word for word. |
| 5 | Srivatsa - Kannada Narration | `UeUC009F3NYPIArcZmq0` | professional | Rich and measured, audiobook lineage. |
| 6 | Srinatha - Kannada Factual Documentary | `QnERnlMSVcCo1wktWlfs` | professional | The only voice in the library that names documentary as its register. Professional, so v3 behaviour must be checked before it is trusted. |

## 5 · Rejected, with reasons

| Voice | Reason |
|---|---|
| Kampana - Kannada FM Radio Presenter | FM radio presenter. The brief forbids a radio jockey register outright. |
| Sangamitra - Animated Kannada Narrator | Animated. Too performed for a film about real children. |
| Aisiri - Friendly Kannada Customer Care | Customer care register. Wrong for a trust anniversary film. |
| Kannada - Surprised and Paranoid | Multi-emotional range, paranoid whispers to screams. Nothing to do with this film. |
| Sanjay | `free_users_allowed` is false, and the entry carries no Kannada or register information. |
| Kumaran - Kannada Expressive & Friendly | Expressive and friendly, warmer and lighter than the brief wants. |
| Ishvak, Subbanna, Nelamane Srini, Srivatsa - Warm Deep, Mani - Rich Deep, Kumaran - Effortless | Plausible but not shortlisted. Held in reserve behind the six above; see `reports/available-voices.json`. |
| All 21 account voices | English premade, no Kannada verification, no v3 listing. |

## 6 · Budget

The full matrix, six voices by three takes by two passages, is **10,584
characters**. The plan holds 10,000 per month, so the whole shortlist does not
fit in one month.

| Run | Characters | Fits in 10,000 |
|---|---|---|
| All six voices, three takes, both passages | 10,584 | no |
| Three primary voices, three takes, both passages | 5,292 | yes |
| Six voices, three takes, main passage only | 4,518 | yes |
| Full film read, 43 lines, one take | 3,585 | yes |

Recommended first pass: `--role primary`, which is the three female candidates
at 5,292 characters, and keep the rest of the month's allowance for the stress
test on whichever voice survives.
