# Kannada voice shortlist

Generated from live ElevenLabs account + Voice Library search (`search=kannada`).
Account premade library is English-only; native Kannada candidates come from the shared Voice Library and must be added with `--add-shared` before TTS.

**Recommended model:** `eleven_v3` (only current TTS model listing Kannada).

**Quota at discovery:** free tier `10000/10000` characters used — real auditions blocked until reset or top-up.

---

## Shortlist (6)

### 1. Aisiri - Warm Kannada Narration
| | |
|---|---|
| Voice ID | `1yebI4wPatIbQgkzinlP` |
| Public owner | `7398804d9eaf2f463899a907587c33a390591775784f87857b6d0e1e4e3e66f6` |
| Profile | Female · middle_aged · narrative_story · professional |
| Why shortlisted | Closest match to the primary brief: warm Kannada narration, mature, story-led |
| Strengths | Narration use-case; middle-aged female; explicit Kannada branding |
| Risks | “Soothing / story” register may soften auditorium authority; verify hall playback |
| Suggested settings | Take A baseline; Take B for opening/closing |
| Best for | Opening, origin, gratitude, closing |
| Preview | [library preview](https://storage.googleapis.com/eleven-public-prod/database/workspace/ed9b05e6324c457685490352e9a1ec90/voices/1yebI4wPatIbQgkzinlP/HDIGGM8mntjNGQWZzPY1.mp3) |

### 2. Padhma - Calm Kannada Audiobook
| | |
|---|---|
| Voice ID | `eESo8CL7VOqMtWCh1ikK` |
| Profile | Female · middle_aged · narrative_story · high_quality |
| Why shortlisted | Calm long-form Kannada; good long-listener comfort candidate |
| Strengths | Unhurried; audiobook pacing; dignity |
| Risks | May be too soft / intimate for a full event hall without Take C |
| Suggested settings | Take B intimate; Take C for timeline/numbers |
| Best for | Opening, founder quote zone, closing |
| Preview | [library preview](https://storage.googleapis.com/eleven-public-prod/database/workspace/ed9b05e6324c457685490352e9a1ec90/voices/eESo8CL7VOqMtWCh1ikK/yfuqPYaBx2inuAytLCXk.mp3) |

### 3. Sharadhi - Natural Kannada Conversation
| | |
|---|---|
| Voice ID | `7B4TkucyQHy3r9hvAnhg` |
| Profile | Female · middle_aged · conversational · high_quality |
| Why shortlisted | Natural Kannada warmth; middle-aged female |
| Strengths | Human, unscripted feel |
| Risks | Conversational energy may feel too casual for documentary hall narration |
| Suggested settings | Take A or C; avoid high style |
| Best for | Community / gratitude if Take A stays composed |
| Preview | [library preview](https://storage.googleapis.com/eleven-public-prod/database/workspace/ed9b05e6324c457685490352e9a1ec90/voices/7B4TkucyQHy3r9hvAnhg/OQwcAxItAsy4PvvPonit.mp3) |

### 4. Varalaxmi - Natural Kannada Conversation
| | |
|---|---|
| Voice ID | `imphBib61OiJ8r9IfSGe` |
| Profile | Female · middle_aged · conversational · professional |
| Why shortlisted | Additional mature female Kannada option |
| Strengths | Familiar, warm neighbourly tone |
| Risks | “Bright / lively” description may fight quiet documentary restraint |
| Suggested settings | Take C first; reject if list intonation appears on K12-style lines |
| Best for | Backup female only |

### 5. Mani - Steady Kannada Storyteller
| | |
|---|---|
| Voice ID | `1dRM7GYsStGPro8wPFGA` |
| Profile | Male · middle_aged · narrative_story · high_quality |
| Why shortlisted | Best male match to the alternative brief (steady storyteller, not trailer) |
| Strengths | Unhurried; plainspoken; narrative |
| Risks | Confirm baritone warmth vs. flatness; watch English proper nouns |
| Suggested settings | Take A; Take C for timeline |
| Best for | Full film alternative if female shortlist fails pronunciation |
| Preview | [library preview](https://storage.googleapis.com/eleven-public-prod/database/workspace/ed9b05e6324c457685490352e9a1ec90/voices/1dRM7GYsStGPro8wPFGA/gPqZkWzLSfVnGYB9n2ro.mp3) |

### 6. Srivatsa - Kannada Narration
| | |
|---|---|
| Voice ID | `UeUC009F3NYPIArcZmq0` |
| Profile | Male · middle_aged · narrative_story · high_quality |
| Why shortlisted | Measured immersive Kannada narration; male fallback |
| Strengths | Rich, long-form friendly |
| Risks | Audiobook warmth may over-soften factual 75% section |
| Suggested settings | Take A / C |
| Best for | Male fallback |
| Preview | [library preview](https://storage.googleapis.com/eleven-public-prod/database/workspace/ed9b05e6324c457685490352e9a1ec90/voices/UeUC009F3NYPIArcZmq0/YT9phlJSSPdwve8X565g.mp3) |

---

## Explicitly rejected (from Kannada search)

| Voice | Reason |
|---|---|
| Kampana - Kannada FM Radio Presenter | Radio / FM energy — brief forbids RJ delivery |
| Sangamitra - Animated Kannada Narrator | Children’s / animated register |
| Ishvak - Friendly Kannada Speaker | Young conversational; not documentary |
| Srinatha - Kannada Factual Documentary | Self-described energetic / gripping — trailer risk |
| Aisiri - Friendly Kannada Customer Care | Support-agent register |
| Kumaran variants (young) | Too youthful for 40–55 male brief |

## Human-review-only baseline (not shortlisted as native Kannada)

**Matilda** `XrExE9yKIg1WjnnlVkGX` — English premade already rendered on this account with `eleven_v3` under `kannada/tools/vo_eleven/`. Useful as a pronunciation/control baseline only after native listeners approve Kannada authenticity.

---

## Next step

```bash
node scripts/generate-auditions.mjs --dry-run
# after credits available:
node scripts/generate-auditions.mjs --add-shared
```
