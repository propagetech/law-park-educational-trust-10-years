# Kannada voice

ElevenLabs narration pipeline for the Law Park Educational Trust 10th
anniversary film.

**Start here: [`scripts/README.md`](scripts/README.md).**

Three facts that decide everything else in this directory:

1. **Kannada runs on `eleven_v3` only.** Multilingual v2, Turbo v2.5 and Flash
   v2.5 do not support it, and they are the default in most examples.
2. **v3 has no speed and no style parameter**, and stability is three points
   rather than a slider. The voice brief's per-scene numbers are editorial
   intent, mapped in `lib/blocks.mjs`, not API fields.
3. **Nothing here can hear audio.** Durations and words per minute are measured;
   every subjective judgement is left to a human, and the scorecard ships empty
   on purpose.

Current state, from the live account:

| | |
|---|---|
| Plan | free, no commercial licence |
| Kannada voices on the account | **0**, all 20 candidates are in the Voice Library |
| Film | 00:05:37:22, 43 narrated lines, 3,585 characters, 93 wpm |
| Audio generated | none. See [`reports/final-voice-recommendation.md`](reports/final-voice-recommendation.md) for what blocks it |
