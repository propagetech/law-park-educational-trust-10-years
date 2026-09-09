# Pronunciation and pickups

Suggestions only. The approved Kannada script in `anniversary-video-research/09-kannada-five-minute-script.md` and `timeline.json` remains authoritative. Do not rewrite the film from this file.

## TTS year rewrite (already automated)

Arabic years are rewritten for spoken payloads only (onscreen text stays Arabic):

| Script | Spoken for TTS |
|---|---|
| 2016ರಲ್ಲಿ | ಎರಡು ಸಾವಿರದ ಹದಿನಾರರಲ್ಲಿ |
| 2017ರಲ್ಲಿ | ಎರಡು ಸಾವಿರದ ಹದಿನೇಳರಲ್ಲಿ |
| 2020ರಲ್ಲಿ | ಎರಡು ಸಾವಿರದ ಇಪ್ಪತ್ತರಲ್ಲಿ |
| 2022ರಲ್ಲಿ … 2026ರಲ್ಲಿ | matching ಎರಡು ಸಾವಿರದ … forms |

Implemented in `lib/year-speak.mjs` (same policy as `kannada/tools/tts_eleven.py`).

## Listen-hard list (native speakers)

Confirm these survive every take:

| Term | Concern |
|---|---|
| ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ | Keep exact approved form; no translation |
| ಚಾರುಲತಾ ಎಂ. ಆರ್. | Trustee-approved spelling |
| ಎಸ್. ಎಂ. ಮಂಜುನಾಥ | Trustee-approved spelling |
| ಚಿಕ್ಕಬಳ್ಳಾಪುರ | Full place name, not clipped |
| ಸಾದೇನಹಳ್ಳಿ | |
| ಮೈಸೂರು | |
| ಹೆಚ್. ಡಿ. ಕೋಟೆ / ಎಚ್.ಡಿ. ಕೋಟೆ | Script uses ಎಚ್.ಡಿ. in timeline |
| ಎಂ. ಎಂ. ಹಿಲ್ಸ್ | Confirm vs ಮಲೆ ಮಹದೇಶ್ವರ ಬೆಟ್ಟ with trustees |
| ಮುಳಬಾಗಿಲು | |
| ಉದಯವಾಣಿ | Onscreen; may appear in gratitude VO context |
| ಭಾರತ್ ಶಿಕ್ಷಾ ರತ್ನ ಪ್ರಶಸ್ತಿ | |
| ಬೆಂಗಳೂರು | |
| ವಿದ್ಯಾರ್ಥಿವೇತನ | Film glossary term — not ಸ್ಕಾಲರ್‌ಶಿಪ್ in final VO |
| ಸ್ಕಾಲರ್‌ಶಿಪ್ | Present only in brief Test A audition copy |
| ಗ್ರಂಥಾಲಯ | |
| ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ | |

## Suggested pickups (after first full render)

| SID | Issue | Action |
|---|---|---|
| K12 | List intonation | Re-render Take C; verify three full stops |
| K27 | Over-emphasis on ಪೂರ್ತಿ ಅಲ್ಲ | Raise stability; shorter style |
| K23 | Trailing ಮುನ್ನೂರು | Leave breath/handle after line in edit |
| K45 | Closing welcome rush | Prefer opening/closing intimate settings |

## Optional pacing corrections (not script changes)

- Prefer longer editorial handles (300–700 ms) around K12, K27, K29, K45 rather than speeding TTS  
- If total VO overshoots picture, re-time picture via `build_timeline.py --from-audio` — do not force unnatural speed on `eleven_v3`
