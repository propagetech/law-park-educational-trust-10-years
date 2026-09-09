# 04 · ಪರದೆ ಪಠ್ಯ · Every Piece of Kannada Onscreen Text

Build sheet for the graphics operator. Every string that appears on screen in the Kannada event master, in the order it appears, with its type spec, colour, dwell and shot ID.

Nothing here is a translation of the English cut. The wording is fixed by [`12-bilingual-onscreen-text-and-lower-thirds.md`](../../anniversary-video-research/12-bilingual-onscreen-text-and-lower-thirds.md); this document turns it into a buildable spec and adds the four strings the Kannada cut needs that the English cut does not.

---

## 1 · Type system

| Role | Family | Weight | Size on the 1080p master | Line height | Tracking |
|---|---|---|---|---|---|
| Main titles, the wordmark | **Noto Serif Kannada** | 700 | 96 px | 1.5 | **0. Never track Kannada** |
| Year numerals, the 75 numeral | **Playfair Display** | 900 | 180 to 220 px | 1.0 | as designed |
| Card body, statistics support lines | **Noto Sans Kannada** | 600 | 52 to 56 px | 1.55 | 0 |
| Lower thirds, name line | **Noto Sans Kannada** | 600 | 52 px | 1.5 | 0 |
| Lower thirds, role line | **Noto Sans Kannada** | 500 | 40 px | 1.6 | 0 |
| Captions and labels | **Noto Sans Kannada** | 500 | 44 px minimum | 1.55 | 0 |
| Subtitles, burned-in social cuts | **Noto Sans Kannada** | 500 | 48 px | 1.55 | 0 |
| Latin inside a Kannada line (URL, email, phone) | **Noto Sans** | 500 | 40 px | 1.4 | as designed |

**Hard rules, all from [`07`](../../anniversary-video-research/07-bilingual-creative-brief.md) section 9 and [`14`](../../anniversary-video-research/14-rights-consent-and-publishing-checklist.md) Part 7.**

1. **Nothing below 44 px cap height** for Kannada meant to be read; nothing below 40 px at all. The back row is 25 m from a 4 m screen.
2. **Kannada at 1.35x the equivalent English size.** Every size above already has the multiplier applied; do not apply it twice.
3. **Line height 1.5 to 1.6.** Kannada has tall ascenders and deep vowel signs that collide at English leading.
4. **No letterspacing, ever.** Tracking visually breaks conjunct clusters.
5. **No all-caps.** The script has no case; forcing it changes nothing and breaks some renderers.
6. **No ultra-light, no ultra-black.** Conjuncts lose their counters at both extremes. 500 to 700 only.
7. **All text inside the 90 percent title-safe area.**
8. **Kannada cards hold 1.3x the English dwell.** Already in the durations below.
9. Left-aligned, generous left margin. **Never centre body copy.** Cards may centre a single short line only.
10. **Check the final render, not the preview.** Kannada shaping fails silently in some video applications. `14` item 7.8.

## 2 · Colour

| Role | Hex | Use | Contrast on navy |
|---|---|---|---|
| Navy, primary ground | `#1c1c2e` | Cards, lower-third bars, end card | ground |
| Navy mid | `#2d2d44` | Secondary panels, gradient partner | ground |
| Cream, light ground | `#faf8f3` | Photo cards, statistics panels, the organisation card | ground |
| White | `#ffffff` | Primary text on navy | 15.9:1 |
| **Gold light** `#e0b06a` | **all Kannada body text on navy** | Sub-lines, captions, labels, lower-third roles | approx 8.2:1, AA and AAA |
| Gold | `#c9903e` | **rules, numerals above 60 px, graphic elements only** | approx 5.9:1, large text only |

**Never gold `#c9903e` as text below 60 px. Never gold text on cream at any size.** `07` section 8.
**Do not use `#15803d`.** It is a pre-rebrand green still sitting in `site.webmanifest`.

## 2b · Lower-third vertical position

The design position is **250 px from the frame bottom**, not the 96 px an unsubtitled film would use.

That is not a style preference. The burned-in Kannada caption band in the animatic occupies roughly y 900 to 1020, and a lower third at 96 px runs straight into it: the first render had the founder's name, four year cards and three gratitude cards all crossed by their own subtitles. 250 px clears the band in every cue in [`05`](05-kannada-subtitles.srt), and it still reads as a lower third.

Keep 250 px for the graded master too. The 9:16 and 1:1 crops burn captions permanently, so a single vertical position across all four formats is one less thing to get wrong, and `14` item 8.5 (90 percent title safe) is satisfied either way.

## 3 · The recurring device

A single **3 px gold `#c9903e` rule, drawn left to right over 600 ms**. It already exists on the website and in the anniversary magazine. It is the only transition device the graphics use. No swipes, no particles, no light leaks, no glows.

## 4 · Logo

| | |
|---|---|
| File to use | `assets/images/brand/law-park-logo-public.png` (259x259) or the repository-root `logo.png` (300x257) |
| Transparency | **Both are genuinely transparent.** Verified: alpha range 0 to 255, all four corners fully transparent. `05` section 3.3 states no transparent logo exists in the repository; that is incorrect, and it changes the title-card design for the better |
| Maximum placed size | **300 px on the 1080p master.** At 300x257 native it is sharp at 1:1 and softens above roughly 350 px |
| Content | Mark only: hands supporting a canopy, graduation cap over an open book. **No wordmark exists in any file**, so the wordmark is always typeset |
| Placement | On navy or cream only. It composites cleanly on `#1c1c2e` |
| Do not use | `logo-purple.png` / `law-park-logo-purple-public.png` (976x833) - larger, but a fully opaque purple field with no alpha. `law-park-educational-trust-logo-mark.jpg` (500x500) - JPEG on a solid field |
| Still requested | A 2000 px transparent PNG plus a vector original, `05` section 6 rank 1. The 300 px file is enough for this film's title and end cards; it is not enough for a 4K master or a large-format print |

---

## 5 · Card by card, in order

### `K05` · Title card · `00:00:25:08` · 4:10

> **ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್**
> ಹತ್ತು ವರ್ಷ · 2016 ರಿಂದ 2026

| | |
|---|---|
| Ground | Navy `#1c1c2e` |
| Line 1 | Noto Serif Kannada 700, 96 px, `#ffffff` |
| Line 2 | Noto Sans Kannada 600, 52 px, `#e0b06a` |
| Logo | 300 px, above the wordmark, left-aligned to it |
| Rule | 3 px gold, drawn left to right over 600 ms, then the wordmark rises 20 px with a 400 ms ease-out |
| Claim | `[ORG-02, ORG-13]` |

**The organisation name is never translated.** `ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್` is the exact form printed in Udayavani on 19 June 2024 and independently confirmed on an LPET banner in asset `A230`. No calque, no ಕಾನೂನು ಉದ್ಯಾನ.

### `K06` · Founder quote card · `00:00:29:19` · 6:00

> "ಶಿಕ್ಷಣದ ವಿಷಯದಲ್ಲಿ ಯಾವ ಮಗುವೂ ಹಿಂದೆ ಉಳಿಯಬಾರದು."
> ಚಾರುಲತಾ ಎಂ. ಆರ್., ಸಂಸ್ಥಾಪಕರು

| | |
|---|---|
| Ground | Navy `#1c1c2e` |
| Quote | Noto Serif Kannada 700, 72 px, `#ffffff`, left-aligned, generous left margin, wrapped over two lines |
| Attribution | Noto Sans Kannada 500, 44 px, `#e0b06a` |
| Rule | 3 px gold above the attribution only |
| Motion | Text fades up over 800 ms. Nothing else moves. No push, no drift |
| Claim | `[MIS-02]` |

**The film's single most important text element.** Six seconds, no narration, no music, no photograph. Longer than the English card by a full second.
**[ಟ್ರಸ್ಟಿ ದೃಢೀಕರಣ ಅಗತ್ಯ]** The founder confirms this rendering or supplies her own Kannada wording. Hers wins. `14` item 7.4.

### `K07` · Organisation card · `00:00:35:19` · 6:09

> ನೋಂದಾಯಿತ ಶೈಕ್ಷಣಿಕ ಟ್ರಸ್ಟ್
> ಎಚ್.ಎಸ್.ಆರ್. ಲೇಔಟ್, ಬೆಂಗಳೂರು

| | |
|---|---|
| Ground | Cream `#faf8f3` |
| Text | Noto Sans Kannada 600, 56 px, navy `#1c1c2e` |
| Logo | 300 px, centred above |
| Rule | 3 px gold beneath the logo |
| Claim | `[ORG-04, ORG-05]` |

### `K08` · Lower third, founder · from `00:00:42:02`, in at 1.0 s, holds 4.5 s, out over 500 ms

> **ಚಾರುಲತಾ ಎಂ. ಆರ್.**
> ಸಂಸ್ಥಾಪಕರು ಮತ್ತು ವ್ಯವಸ್ಥಾಪಕ ಟ್ರಸ್ಟಿ, ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್

| | |
|---|---|
| Bar | Navy `#1c1c2e` at 92 percent opacity, **1.5x the height of the English bar** |
| Name | Noto Sans Kannada 600, 52 px, `#ffffff` |
| Role | Noto Sans Kannada 500, 40 px, `#e0b06a` |
| Rule | 3 px gold, 3 px above the bar, drawn left to right |
| Claim | `[PPL-01]` |

**Never break `ಚಾರುಲತಾ ಎಂ. ಆರ್.` across two lines.** The name and its initials are one unit.
**[ಟ್ರಸ್ಟಿ ದೃಢೀಕರಣ ಅಗತ್ಯ]** `06` Q10 records four competing spellings in LPET's own materials: "Charulatha M. R.", "Charulatha. M. R", "Charulata ji", "Charu". The founder chooses one.

### `K09` · Lower third, trustee · from `00:00:50:17`, same timing

> **ಎಸ್. ಎಂ. ಮಂಜುನಾಥ**
> ಟ್ರಸ್ಟಿ, ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್

Same spec. `[PPL-02]`
**[ಟ್ರಸ್ಟಿ ದೃಢೀಕರಣ ಅಗತ್ಯ]** `06` Q11 records four spellings: "S.M. MANJUNATHA", "S. M. Manjunatha", "Manjunath ji", "Mr. Manjunatha S. M".
**ಟ್ರಸ್ಟಿ, not ಧರ್ಮದರ್ಶಿ**, which reads as a temple office.
**Do not state the trustees' marital relationship.** It appears in one donor letter only, it is a personal detail, and the recommendation in `06` Q12 and `14` item 3.6 is not to use it.

### `K11` · Year card, 2016 · `00:01:03:22` · 3:20

> **2016 · ಚಿಕ್ಕಬಳ್ಳಾಪುರ**
> ಮೊದಲ ಶಾಲಾ ಭೇಟಿ

| | |
|---|---|
| Ground | Cream photo card, photograph in the left third |
| Year | Playfair Display 900, 180 px, gold `#c9903e` |
| Place and caption | Noto Sans Kannada 600, 56 px, navy |
| Claim | `[TML-2016]` |

### `K12` · The film's smallest number · `00:01:07:17` · 4:02

> ಒಂದು ಮಗು.
> ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ.

| | |
|---|---|
| Ground | Navy `#1c1c2e` |
| Text | Noto Serif Kannada 700, 84 px, `#ffffff` |
| Motion | Line 1, then line 2 entering 1.2 s later. A 3 px gold rule between them |
| Music | Silence under this card |
| Claim | `[NUM-02]` |

**This card exists because a photograph was rejected.** The only 2016 first-scholarship image in the repository, `A140`, shows an adult handing money to a boy while his mother watches: the exact "hand reaching down" trope `07` section 12 forbids, at 960x540, in a frame about a family's poverty. Typography does the job with more dignity and no consent exposure. See [`06`](06-kannada-edit-decision-list.md) section 3.

### `K13` · Statistics caption, 150 · from `00:01:11:19` · 4:24

> 150 ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸ್ಟೀಲ್ ತಟ್ಟೆ ಮತ್ತು ಲೋಟ

| | |
|---|---|
| Placement | Lower-third strip on the photograph, navy at 92 percent |
| Numeral | Playfair Display 900, 96 px, gold `#c9903e` |
| Text | Noto Sans Kannada 600, 52 px, `#e0b06a` |
| Claim | `[NUM-01]` |

**Arabic numeral 150 on the card, ನೂರೈವತ್ತು spoken.** `09` section 3.4: Kannada print and signage use Arabic numerals; Kannada narration uses number words. Both are correct in their own medium and the mismatch is deliberate.

> **QC trap on this beat.** The school notice board visible in `A198` reads `ಮಕ್ಕಳ ಸಂಖ್ಯೆ: 150` (enrolment 150) at a *different* school in a *different* year. If `A198` is ever cut anywhere near this line, a Kannada-reading viewer will connect the two numbers and the film will appear to claim something it does not. `A198` is not used in this cut. Keep it that way.

### `K14` `K16` `K18` `K20` `K22` `K23` · Year cards

Identical construction. Year numeral Playfair Display 900, 180 px, gold, entering from a 20 px rise with a 400 ms ease-out. Caption Noto Sans Kannada 600, 52 px, `#e0b06a` on a navy lower-third strip. The year numerals are the film's spine and are the only element that repeats unchanged.

| Shot | TC | Card | Claim |
|---|---|---|---|
| `K14` | `00:01:16:18` | **2017** · 10 ವಿದ್ಯಾರ್ಥಿಗಳು | `[TML-2017, NUM-03]` |
| `K15` | `00:01:21:23` | ಕೆಲಸ ಮುಂದುವರಿಯಿತು | `[TML-2018, TML-2019, TML-2021]` |
| `K17` | `00:01:35:00` | **2020** · ಸಾಂಕ್ರಾಮಿಕ ಕಾಲದ ನೆರವು | `[TML-2020]` |
| `K18` | `00:01:45:05` | **2022** · ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯ | `[TML-2022, PRG-07]` |
| `K20` | `00:01:56:00` | **2023** · ಮೈಸೂರು · ಎಚ್.ಡಿ. ಕೋಟೆ | `[TML-2023]` |
| `K21` | `00:02:00:11` | 9 ಮತ್ತು 10ನೇ ತರಗತಿಗೆ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ | `[PRG-06]` |
| `K22` | `00:02:07:21` | **2024** · ಎಂ.ಎಂ. ಹಿಲ್ಸ್ · 200 ಶಾಲಾ ಚೀಲ | `[TML-2024, NUM-04]` |
| `K23` | `00:02:17:12` | **2025** · ಎಚ್.ಡಿ. ಕೋಟೆ · 300 ಶಾಲಾ ಚೀಲ | `[TML-2025, NUM-05]` |

**No location card for 2019, 2020 or 2021.** The repository contradicts itself on all three: `milestones.ts` says KGF, the magazine says Chickaballapur. `06` A3. `K15` therefore carries a state, not a place.
**`ಎಂ.ಎಂ. ಹಿಲ್ಸ್` is provisional.** If the trustees confirm `ಮಲೆ ಮಹದೇಶ್ವರ ಬೆಟ್ಟ`, rebuild `K22`'s card and record pickup P3. `14` item 7.6.

### `K17` · Kannada gloss strip on the 2020 poster · `00:01:35:00` · 10:05

The poster in frame is in English. The Kannada strip beside it carries the two eligibility criteria so the beat does not exclude its own audience.

> **2020 · ಸಾಂಕ್ರಾಮಿಕ ಕಾಲದ ನೆರವು**
> ಪೋಷಕರನ್ನು ಕಳೆದುಕೊಂಡ ಮಕ್ಕಳಿಗೆ
> ಕೆಲಸ ಕಳೆದುಕೊಂಡು ಶುಲ್ಕ ಕಟ್ಟಲಾಗದ ಪೋಷಕರಿಗೆ

| | |
|---|---|
| Placement | Left third, navy panel; the poster sits at native size in the right two thirds |
| Heading | Noto Sans Kannada 600, 56 px, `#e0b06a` |
| Criteria | Noto Sans Kannada 500, 48 px, `#ffffff`, each entering 1.2 s apart |
| Claim | `[TML-2020b]` |

**One of the four Kannada-only strings in this film.** Difference 4 in `10` section C.
Do not paraphrase upward: the poster says financial support for children who lost a parent and/or parents who lost jobs. It does not say how many, and neither does the strip.

### `K26` · The four-step method · from `00:02:31:13` · 7:14

> ಗುರುತಿಸುವುದು · ಪರಿಶೀಲಿಸುವುದು · ಒಳಗೊಳ್ಳುವುದು · ಬೆಳೆಸುವುದು

| | |
|---|---|
| Placement | Lower-third strip over the hands-and-form crop |
| Text | Noto Sans Kannada 600, 56 px, `#e0b06a` on navy |
| Motion | **One word per 1.5 s, not per 1.0 s.** The Kannada words are longer than Identify / Validate / Embrace / Incubate and need the extra half second each |
| Separator | Gold `#c9903e` interpunct, not a hyphen |
| Claim | `[PRC-01, PRC-02, PRC-03, PRC-04]` |

All four Kannada terms are verbal nouns, which makes the set grammatically consistent in a way the English set is not. `ಒಳಗೊಳ್ಳುವುದು` and `ಬೆಳೆಸುವುದು` carry Embrace and Incubate without inheriting the odd English metaphor. `12` section 6.

### `K27` · The 75 per cent card · `00:02:39:02` · 7:05

> **ಶೇಕಡ 75ರವರೆಗೆ**
> ಶಾಲಾ ಶುಲ್ಕ, ನೇರವಾಗಿ ಶಾಲೆಗೆ

| | |
|---|---|
| Ground | Navy `#1c1c2e` |
| Numeral | **75** in Playfair Display 900, 220 px, gold `#c9903e` |
| ಶೇಕಡ and ರವರೆಗೆ | Noto Serif Kannada 700, 72 px, `#ffffff`, set around the numeral |
| Support line | Noto Sans Kannada 600, 56 px, `#e0b06a` |
| Rule | 3 px gold drawn beneath, 600 ms |
| Motion | **None on the numeral.** No count-up, no spin, no scale. It appears and it stays |
| Music | Out completely under `ಪೂರ್ತಿ ಅಲ್ಲ.` |
| Claim | `[NUM-07]` |

**The quietest frame in the film.** `07` section 12 forbids counting numbers spinning up on screen; this is the card that rule was written for. The layout is shared with the English cut and only the text layer swaps, so build it once. `10` section F.

### `K29` · The anti-leakage card · `00:02:53:03` · 4:03

> ನೇರವಾಗಿ ಶಾಲೆಗೆ. ಬೇರೆ ಯಾರ ಕೈಗೂ ಅಲ್ಲ.

| | |
|---|---|
| Ground | Cream `#faf8f3` |
| Text | Noto Serif Kannada 700, 76 px, navy `#1c1c2e`, one line, centred |
| Rule | 3 px gold above |
| Claim | `[PRC-04, MIS-04]` |

This is the Trust's strongest claim on a stranger's trust, and it gets its own frame rather than a caption.

### `K31` `K32` `K33` · Programme labels · from `00:03:05:05`

**3 seconds each, not 2.** The Kannada dwell rule.

| Shot | Label | Back-translation | Claim |
|---|---|---|---|
| `K31` | ಶಾಲಾ ಸಾಮಗ್ರಿ ವಿತರಣೆ | school materials distribution | `[PRG-03]` |
| `K32` | ಕಲಿಕೆಯ ಆಟಗಳು · ನಾಡು ನುಡಿಯ ಪರಿಚಯ · ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯ | learning games · introduction to land and language · libraries in rural schools | `[PRG-04, PRG-05, PRG-07]` |
| `K33` | ಪೋಷಕರಿಗೆ ಮಾರ್ಗದರ್ಶನ | guidance for parents | `[PRG-09]` |

**`ನಾಡು ನುಡಿಯ ಪರಿಚಯ` is the best single Kannada gain in the package.** The literal ಸಾಂಸ್ಕೃತಿಕ ಅರಿವು ಕಾರ್ಯಕ್ರಮ for "cultural awareness programme" is bureaucratic; ನಾಡು ನುಡಿ ("land and language") is a warm, universally understood Kannada pairing that says exactly what the programme is. `12` section 5.

### `K34` · The hardest-to-reach card · `00:03:22:13` · 10:18

> *(No list on screen. A navy field and a single gold rule.)*

| | |
|---|---|
| Ground | Navy `#1c1c2e` |
| Text | **None while the line is spoken** |
| Motion | Nothing enters, nothing moves, nothing pushes |

**The strongest typographic decision in the film is to put nothing here.** The narration names single-parent status, HIV in the family and chronic illness. Setting those words on screen, over eleven seconds, in 96 px, turns four groups of real children into a graphic. The line is heard, not displayed, and no face and no illustration of a child appears anywhere in the shot. `14` item 2.4, which is absolute.

### `K35` · Partners card · `00:03:33:07` · 7:02

> **ಸಹಭಾಗಿತ್ವದಲ್ಲಿ**
> ನಿಸರ್ಗ ಫೌಂಡೇಶನ್
> ಬೆಳಕು ಟ್ರಸ್ಟ್, ಬಂಗಾರಪೇಟೆ
> ಸೌಖ್ಯ ಸಮೃದ್ಧಿ ಸಂಸ್ಥೆ, ಕೋಲಾರ
> ಜಿಲ್ಲಾ ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ ಇಲಾಖೆ, ಕೋಲಾರ

| | |
|---|---|
| Ground | Navy `#1c1c2e`. **No photograph** |
| Heading | Noto Serif Kannada 700, 64 px, `#ffffff` |
| Names | Noto Sans Kannada 600, 48 px, `#e0b06a`, left-aligned, each entering 0.9 s apart |
| Rule | 3 px gold above the list |
| Dwell | **1 second longer than the English card**, to fit four Kannada names legibly at 48 px |
| Claim | `[PTR-01, PTR-02, PTR-03, PTR-04]` |

**No logos and no government emblem until `14` items 4.2 and 4.3 are signed.**
**Only these four.** "Rural Education Foundation", "Children Welfare Society" and "Education for All Initiative" appear in `websiteContent.ts` but carry no location, no contact, no photograph, and do not appear in the print magazine at all. `06` A4 treats them as template placeholders and they are excluded. `14` item 6.6.
**[ಟ್ರಸ್ಟಿ ದೃಢೀಕರಣ ಅಗತ್ಯ]** on all four Kannada spellings, from each organisation's own usage rather than our transliteration. Note that the Kannada spelling `ಬೆಳಕು ಟ್ರಸ್ಟ್` is independently confirmed: it appears on LPET's own event banner in asset `A230`, alongside `ತಂಬ್ರಹಳ್ಳಿ, ಬಂಗಾರಪೇಟೆ`.

### `K36` · Press credit · from `00:03:40:09` · 10:02

> ಉದಯವಾಣಿ · 19 ಜೂನ್ 2024

| | |
|---|---|
| Placement | Lower third beside the clipping, navy panel |
| Text | Noto Sans Kannada 600, 52 px, `#e0b06a` |
| Claim | `[MED-01]` |

Crop the burned-in `epaper.udayavani.com` URL strip off the foot of the scan and let this card carry the attribution instead. **BLOCKING on Udayavani's written permission**, `14` item 4.1.

### `K37` · Award card · from `00:03:50:11` · 10:01

> ಭಾರತ್ ಶಿಕ್ಷಾ ರತ್ನ ಪ್ರಶಸ್ತಿ · 19 ಡಿಸೆಂಬರ್ 2025 · ನವದೆಹಲಿ
> ಎಕನಾಮಿಕ್ ಅಂಡ್ ಸೋಶಿಯಲ್ ಡೆವಲಪ್‌ಮೆಂಟ್ ಫೌಂಡೇಶನ್

| | |
|---|---|
| Placement | Lower third, held for the whole shot because the certificate itself is in English |
| Line 1 | Noto Sans Kannada 600, 52 px, `#e0b06a` |
| Line 2 | Noto Sans Kannada 500, 44 px, `#ffffff` |
| Claim | `[AWD-01]` |

**Exactly what the certificate records and nothing more.** No minister names, no "one of 25". Neither appears on the certificate, no ceremony photograph exists, and `06` Q3 recommends omitting both. Verified from the scan: the award name, `CHARULATHA M. R. (FOUNDER)`, `LAW PARK EDUCATIONAL TRUST`, `NATIONAL SUMMIT`, `19th DECEMBER 2025`, Delhi, presented by the Economic and Social Development Foundation, signed H. S. Rawat, Secretary.

### `K38` `K39` `K40` · Gratitude cards · from `00:04:00:12`

| Shot | Card | Back-translation |
|---|---|---|
| `K38` | **ನೆರವು ನೀಡಿದವರಿಗೆ** / ಭಾರತ, ಅಮೆರಿಕ, ಬ್ರಿಟನ್, ಜರ್ಮನಿ, ಡೆನ್ಮಾರ್ಕ್, ದುಬೈ ಮತ್ತು ಇನ್ನೂ ಹಲವೆಡೆಯಿಂದ. | To those who gave help / From India, America, Britain, Germany, Denmark, Dubai and many more places |
| `K39` | **ಸ್ವಯಂಸೇವಕರಿಗೆ** / ವಕೀಲರು · ಎಂಜಿನಿಯರ್‌ಗಳು · ವೈದ್ಯರು · ಗೃಹಿಣಿಯರು | To the volunteers |
| `K40` | **ಪೋಷಕರಿಗೆ** / ತಮ್ಮ ಪಾಲಿನ ಶುಲ್ಕವನ್ನು ತಪ್ಪದೇ ಹೊಂದಿಸಿದವರು. ಪ್ರತಿ ವರ್ಷವೂ. | To the parents / Who found their share of the fee without fail. Every year |

Heading Noto Serif Kannada 700, 64 px, `#ffffff`. Body Noto Sans Kannada 500, 48 px, `#e0b06a`. Navy lower-third panel.

**`ನೆರವು ನೀಡಿದವರು`, not `ದಾನಿಗಳು`.** ದಾನಿಗಳು is correct and formal but carries a faint charity hierarchy; "those who gave help" is warmer and puts the giver and the receiver on the same level. Reserve ದಾನಿಗಳು for a credit-roll heading. `12` section 9.
**No donor names on screen in this film.** The list in `websiteContent.ts` contains near-duplicates ("Raman ChandraShekar" and "Raman Chandra Shekar", "Veena" twice, "Ganesh" three times) and every person must agree to be named. `06` Q13, Q14 and `14` item 3.4. A credit roll belongs to a separate deliverable, after a clean de-duplicated list arrives.
**No unsourced quotes.** The 20 first-person supporter quotes in `websiteContent.ts` have no source document anywhere in the repository. `06` A5, `14` item 3.3. None appears in any card.

### `K46` · End card · `00:04:56:21` · 7:00

> **ಪ್ರತಿ ಮಗುವಿನ ಮೇಲೆ ನಂಬಿಕೆ ಇಟ್ಟ ಒಂದು ದಶಕ**
>
> ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ · 2016 ರಿಂದ 2026
>
> ಒಂದು ಮಗುವಿನ ಹೆಸರು ಸೂಚಿಸಿ · ಸ್ವಯಂಸೇವಕರಾಗಿ · ಸಹಭಾಗಿಯಾಗಿ
>
> journey.lawparkeducationaltrust.org
> lawparktrust@gmail.com · +91 99456 65379

| | |
|---|---|
| Ground | Navy `#1c1c2e` |
| Headline | Noto Serif Kannada 700, 88 px, `#ffffff` |
| Org line | Noto Sans Kannada 600, 52 px, `#e0b06a` |
| Calls to action | Noto Sans Kannada 600, 48 px, `#e0b06a`, gold interpuncts |
| Contact | Noto Sans 500, 40 px, `#ffffff` |
| Logo | 300 px |
| Motion | Headline fades up, gold rule draws, then the calls to action, then the contact block. **Nothing moves after 4.0 s** |
| Dwell | **1 second longer than the English end card** so the Kannada headline can be read |
| Claim | `[ORG-06, ORG-07, ORG-09]` |

**Primary call to action is `ಒಂದು ಮಗುವಿನ ಹೆಸರು ಸೂಚಿಸಿ`.** It is how children actually reach the Trust (`[PRC-01]`), it asks nothing financial of a room that has just watched a film about children, and it is the only action every person in the hall can take tonight. `12` section 11.

> ### NEVER ON SCREEN
> - The UPI ID `mhaks.16@oksbi`. Verified `[ORG-11]`, and it must still never appear.
> - `public/images/mhaks.16@oksbi.jpg` or `assets/images/payments/law-park-upi-qr-code.*`. **A scannable payment code in a film that will be screenshotted and reposted is a fraud vector, not a convenience.**
> - Bank details of any kind.
> - The razorpay URL, in this cut. If a donation route is ever wanted, it is text on a web page, not a code on a screen.
> - The Section 80G tax claim, unless a current certificate is produced. It appears on the magazine back cover and nowhere else. `[ORG-14]`, `14` item 6.4.

---

## 6 · The main-title alternatives, for the record

The recommended title is in use above. The others are here so the choice is documented rather than re-litigated.

| # | Kannada | Back-translation | Status |
|---|---|---|---|
| **1** | **ಪ್ರತಿ ಮಗುವಿನ ಮೇಲೆ ನಂಬಿಕೆ ಇಟ್ಟ ಒಂದು ದಶಕ** | A decade of having placed faith in every child | **In use, `K46`.** Already the site hero |
| 2 | ಹತ್ತು ವರ್ಷ. ಒಂದೊಂದೇ ಮಗು. | Ten years. One child at a time. | Shortest and strongest. **Use for the teaser and the 9:16 and 1:1 social cuts**, where the long headline will not read |
| 3 | ಯಾವ ಮಗುವೂ ಹಿಂದೆ ಉಳಿಯಬಾರದು | No child should be left behind | **Only as the founder's quote, attributed.** As a title it borrows unwanted education-policy associations |
| 4 | ಹತ್ತು ವರ್ಷ, ತಪ್ಪದೆ ಹೋದ ಹಾದಿ | Ten years, a road walked without fail | Held in reserve. More evocative than the English "Ten years of showing up" |

**Never "10 Years of Transforming Lives"**, the current site metadata title. It is the saviour framing the brief excludes, and there is no good Kannada for it. `[EXC-06]`

## 7 · Glossary, fixed for this production

Deviating from this list mid-edit is what makes a film look like two films. The full list is in `12` section 12; these are the decisions that reach the screen.

| English | Kannada | Why this one |
|---|---|---|
| Law Park Educational Trust | ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ | Udayavani 19.06.2024; confirmed on LPET's own banner, asset `A230`. Never translated |
| scholarship | ವಿದ್ಯಾರ್ಥಿವೇತನ | Same two sources. **Not ಸ್ಕಾಲರ್‌ಶಿಪ್**, not ಶಿಷ್ಯವೇತನ |
| school bag | ಶಾಲಾ ಚೀಲ | Warmer and more concrete than ಬ್ಯಾಗ್ |
| stationery | ಲೇಖನ ಸಾಮಗ್ರಿ | |
| notebook | ನೋಟ್‌ಬುಕ್ | Retained; ಪುಸ್ತಕ would be ambiguous |
| library | ಗ್ರಂಥಾಲಯ | |
| career guidance | ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ | Not ಸಮಾಲೋಚನೆ, which is clinical |
| cultural awareness programmes | ನಾಡು ನುಡಿಯ ಪರಿಚಯ | See `K32` |
| tribal | ಬುಡಕಟ್ಟು | Preferred over ಗಿರಿಜನ. Note that the government's own signboard in `A228` uses ಗಿರಿಜನ; that is their word on their sign and it is not captioned |
| single parent | ಏಕ ಪೋಷಕ | Udayavani |
| trustee | ಟ್ರಸ್ಟಿ | Not ಧರ್ಮದರ್ಶಿ |
| founder | ಸಂಸ್ಥಾಪಕರು | |
| donor | ನೆರವು ನೀಡಿದವರು on cards and in narration; ದಾನಿಗಳು only as a credit-roll heading | See `K38` |
| headmaster, principal | ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು | |
| celebration | ಸಂಭ್ರಮ | |
| welcome | ಆತ್ಮೀಯ ಸ್ವಾಗತ | The warm form, for the closing line |
| D.M.S Jnana Kuteera School | **ಡಿ.ಎಂ.ಎಸ್. ಜ್ಞಾನಕುಟೀರ ಶಾಲೆ** | **Corrected.** `09` section 3.5 flagged this as unverified and rendered it as two words, ಜ್ಞಾನ ಕುಟೀರ. The school's own banner and building sign, assets `A190` and `A170`, both read **ಜ್ಞಾನಕುಟೀರ** as one word, at Baby Village, Chinakurali Hobali, Pandavapura Taluk, Mandya District 571455. The school is not named in this cut, but the spelling is now settled for any future use |

**Words that must never appear on screen:** ಫಲಾನುಭವಿ · ಬಡ ಮಕ್ಕಳು · ಅಸಹಾಯಕ · ದೀನ · ಸಬಲೀಕರಣ · ಜೀವನ ಪರಿವರ್ತನೆ · ಉದ್ಧಾರ

## 8 · Graphics build order

1. **Build one card template project**, 1920x1080, with a swappable text layer. English and Kannada share every layout; only the text layer and the dwell change. Do not build two sets. `10` section F.
2. Set every Kannada string from **this document**, copied and pasted. Do not retype Kannada; a retyped conjunct is the most common way a vowel sign goes missing.
3. **Render at full resolution and inspect every card at 100 percent** for broken conjuncts, missing vowel signs and tofu boxes. Kannada shaping fails silently in some video applications, and the preview is not proof. `14` item 7.8.
4. Check every card against the 90 percent title-safe guide.
5. Check contrast: no gold `#c9903e` text below 60 px anywhere, no gold on cream anywhere.
6. Only then build the 9:16 and 1:1 crops. **The Kannada text layout is the constraint that drives every other format**, so the 16:9 Kannada cut is approved first. In 9:16 the text moves to the upper third, above the platform UI; in 1:1 it moves to a lower band inside the square.
