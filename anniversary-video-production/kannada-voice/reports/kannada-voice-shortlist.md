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

## 3 · The category matters more than the description

The library splits these voices into `high_quality` and `professional`.
`professional` means a Professional Voice Clone, and ElevenLabs documents those
as **weaker on v3** than designed or high quality voices. Since v3 is the only
model that speaks Kannada, that caveat lands directly on this film. `09` section
2 reached the same conclusion from the other direction.

So a beautifully described `professional` voice ranks below a plainly described
`high_quality` one until a preview proves otherwise.

## 4 · Shortlist

Machine-readable: `config/audition-shortlist.json`.

### Primary target, female, age impression 35 to 50

| # | Voice | ID | Category | Why |
|---|---|---|---|---|
| 1 | Padhma - Calm Kannada Audiobook | `eESo8CL7VOqMtWCh1ikK` | high_quality | Audiobook is the closest register in the library to long-form documentary narration, and the category is the safer one on v3. Described as unhurried and measured, which is the brief. |
| 2 | Sharadhi - Natural Kannada Conversation | `7B4TkucyQHy3r9hvAnhg` | high_quality | Female, high_quality, described as natural rather than performed. The conversational register is the risk: listen for whether it can carry a hall. |
| 3 | Aisiri - Warm Kannada Narration | `1yebI4wPatIbQgkzinlP` | professional | The best description against the brief in the entire library: warm, well paced Kannada narration. Held third only because it is a Professional Voice Clone. |

### Alternative, male, age impression 40 to 55

| # | Voice | ID | Category | Why |
|---|---|---|---|---|
| 4 | Mani - Steady Kannada Storyteller | `1dRM7GYsStGPro8wPFGA` | high_quality | Described as sounding like someone who trusts the story enough not to perform it. That is the brief almost word for word. |
| 5 | Srivatsa - Kannada Narration | `UeUC009F3NYPIArcZmq0` | high_quality | Rich and measured, audiobook lineage, high_quality. |
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
