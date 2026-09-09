# Final voice recommendation

**Status:** Provisional shortlist only. No audition audio has been scored yet because the connected ElevenLabs free tier is at **10000/10000** characters.

## Console discovery summary

| Item | Value |
|---|---|
| Account voices found | 21 (premade English) |
| Account Kannada-labelled voices | 0 |
| Shared Kannada search hits | 20 |
| Shortlisted for audition | 6 |
| Audition audio files generated | 0 (blocked by quota) |
| Recommended model | `eleven_v3` + `language_code: kn` |

## Provisional primary (metadata, pending listen)

**Aisiri - Warm Kannada Narration** · `1yebI4wPatIbQgkzinlP`

| | |
|---|---|
| Preferred take to try first | **A** (balanced documentary) |
| Settings | stability `0.52` · similarity `0.75` · style omitted on v3 · speed intent `0.95` (not sent) |
| Why | Female, middle-aged, narrative_story, explicit Kannada narration positioning |

## Provisional fallback

**Padhma - Calm Kannada Audiobook** · `eESo8CL7VOqMtWCh1ikK` — Take B for intimate scenes, Take C if hall clarity suffers.

**Male alternative:** **Mani - Steady Kannada Storyteller** · `1dRM7GYsStGPro8wPFGA` — Take A.

## Human-review-only option

**Matilda** `XrExE9yKIg1WjnnlVkGX` — already rendered with `eleven_v3` in `kannada/tools/vo_eleven/`. Not a native Kannada voice; keep only if two native listeners approve pronunciation of proper nouns and `ವಿದ್ಯಾರ್ಥಿವೇತನ`.

## Scene settings after winner is approved

Use `config/selected-voice.json` scene_settings:

| Scene | Stability | Similarity | Style intent | Speed intent |
|---|---:|---:|---:|---:|
| opening | 0.45 | 0.78 | 0.18 | 0.92 |
| origin | 0.50 | 0.76 | 0.13 | 0.93 |
| timeline | 0.56 | 0.75 | 0.10 | 0.96 |
| scholarship | 0.58 | 0.75 | 0.08 | 0.91 |
| community | 0.48 | 0.77 | 0.15 | 0.93 |
| closing | 0.46 | 0.78 | 0.18 | 0.91 |

## Full narration estimated duration

From live `timeline.json` narrated lines (43): **296.9 s speech + 17.0 s scripted pauses ≈ 5:14 of allotted VO windows**, inside the **5:00** picture plan with holds/cards. Re-time picture to measured audio after render (`build_timeline.py --from-audio`); do not force `eleven_v3` speed.

## Blockers before final 5-minute generation

1. Restore ElevenLabs character quota  
2. `node scripts/generate-auditions.mjs --add-shared` then generate Takes A/B/C  
3. Native-listener scorecard + trustee approval of opening ~30 s  
4. Write winner into `config/selected-voice.json` with `opening_30s_approved: true`  
5. Generate scene-by-scene — never one five-minute API call  

## Reminder

Trustee/team must approve the 30-second opening test before final 5-minute generation.
