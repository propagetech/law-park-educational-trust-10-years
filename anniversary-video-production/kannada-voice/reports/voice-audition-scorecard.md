# Voice audition scorecard

Score every generated file out of **5**. Leave blank until you have listened.
Two Kannada-native listeners should score independently, then average.

**Weighted final score**

| Pillar | Weight | Source criteria (average) |
|---|---:|---|
| Kannada authenticity | 20% | (1 + 3) / 2 |
| Clarity and diction | 15% | 2 |
| Cinematic documentary feel | 15% | 8 |
| Proper noun and number pronunciation | 15% | (4 + 5) / 2 |
| Warmth and humility | 15% | (6 + 9) / 2 |
| Long-form comfort | 10% | 12 |
| Auditorium suitability | 10% | 11 |

Criteria 7, 10, 13, 14, 15 are advisory tie-breakers (also note in comments).

---

## Status

| | |
|---|---|
| Audition audio generated | **Pending** (account at free-tier character cap 10000/10000) |
| Dry-run plan | Run `node scripts/generate-auditions.mjs --dry-run` |
| Listening devices | Headphones · phone · laptop · event PA |
| Listeners | ________________ · ________________ |

---

## Rubric (1–5)

1. Native Kannada authenticity  
2. Clarity and diction  
3. Natural pronunciation of Kannada  
4. Pronunciation of names and locations  
5. Number pronunciation  
6. Warmth  
7. Quiet confidence  
8. Cinematic documentary feel  
9. Humility and dignity  
10. Emotional restraint  
11. Suitability for auditorium playback  
12. Long-form listener comfort  
13. Lack of robotic/synthetic quality  
14. Lack of excessive drama  
15. Fit for Law Park Educational Trust’s story  

**Automatic fail checks (from production plan 02)**

- [ ] `ಚಿಕ್ಕಬಳ್ಳಾಪುರ. ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ.` reads as three sentences, not a rising list  
- [ ] Years and places clear: ಚಿಕ್ಕಬಳ್ಳಾಪುರ, ಮೈಸೂರು, ಹೆಚ್. ಡಿ. ಕೋಟೆ, ಎಂ. ಎಂ. ಹಿಲ್ಸ್  
- [ ] `ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ` and `ಗ್ರಂಥಾಲಯ` intact  
- [ ] No RJ / ad / trailer swagger  

---

## Scores

Fill one block per `audition-audio/voice-*-take-*.mp3` file.

### Template

| File | |
|---|---|
| Voice | |
| Take | A / B / C |
| 1 … 15 | _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ |
| Weighted | |
| Auto-fail? | Y / N · notes: |
| Comments | |

### Primary candidate — Aisiri `1yebI4wPatIbQgkzinlP`

| Take | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | Weighted | Fail? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A | | | | | | | | | | | | | | | | | |
| B | | | | | | | | | | | | | | | | | |
| C | | | | | | | | | | | | | | | | | |

### Padhma `eESo8CL7VOqMtWCh1ikK`

| Take | Weighted | Fail? | Notes |
|---|---|---|---|
| A | | | |
| B | | | |
| C | | | |

### Sharadhi `7B4TkucyQHy3r9hvAnhg`

| Take | Weighted | Fail? | Notes |
|---|---|---|---|
| A | | | |
| B | | | |
| C | | | |

### Varalaxmi `imphBib61OiJ8r9IfSGe`

| Take | Weighted | Fail? | Notes |
|---|---|---|---|
| A | | | |
| B | | | |
| C | | | |

### Mani `1dRM7GYsStGPro8wPFGA`

| Take | Weighted | Fail? | Notes |
|---|---|---|---|
| A | | | |
| B | | | |
| C | | | |

### Srivatsa `UeUC009F3NYPIArcZmq0`

| Take | Weighted | Fail? | Notes |
|---|---|---|---|
| A | | | |
| B | | | |
| C | | | |

---

## Decision (after listening)

| Role | Voice | Take | Settings |
|---|---|---|---|
| Primary | | | stability / similarity / style |
| Fallback | | | |
| Human-review-only | Matilda `XrExE9yKIg1WjnnlVkGX` if native listeners accept pronunciation | prior `vo_eleven` render | |

Rejected voices and reasons:

1.  
2.  
3.  
