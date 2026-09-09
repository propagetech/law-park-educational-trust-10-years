# 01 · ಅಂತಿಮ ಕನ್ನಡ ಚಿತ್ರಕಥೆ · Final Kannada Narration Script

**ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ · ಹತ್ತು ವರ್ಷಗಳ ಸಂಭ್ರಮ · ಸ್ವಾಗತ ಚಿತ್ರ**
Kannada event master · 1920x1080 · 25 fps · **00:05:03:21**

This is the record-ready narration script. It is the Kannada film's single source of spoken text.
Every line is **Version A of [`09-kannada-five-minute-script.md`](../../anniversary-video-research/09-kannada-five-minute-script.md), verbatim**, with two documented departures listed in section 2. Nothing has been rewritten, shortened or paraphrased to fit picture.

Timecodes are frame-accurate at 25 fps and are shared with deliverables `03`, `05` and `06`. If a line is re-recorded, re-derive the timeline; do not hand-edit one document.

---

## 1 · How the duration is built

| Component | Value |
|---|---|
| Kannada narration tokens | **460** (every one of them `09` Version A, verbatim) |
| Pace | **105 words per minute** overall (brief: 100 to 110) |
| Speech | 262.9 s |
| Marked pauses inside narration (`[ವಿರಾಮ]`) | 17.0 s |
| Deliberate silence: cold open, founder quote card, two held cards, end card | 24.0 s |
| **Total** | **303.86 s = 00:05:03:21 = 7,596 frames** |

### How the speech time is shared out between lines

The film's total speech time is set by the pace the brief specifies. That total is then
distributed between lines **by display cluster count, not by word count.**

This is not a refinement for its own sake. Kannada word length varies enormously:
`ವಿದ್ಯಾರ್ಥಿವೇತನ` is one word and six syllables, and a five-word line can take longer to
say than a twelve-word one. Measured against a synthesised read of all 43 narration lines,
clusters predict spoken duration with **9.2 percent mean error against 16.0 percent for
words**, and only 3 lines land more than 20 percent out against 13. Word count was
under-allocating the compound-heavy lines badly: `K37` needed 9.6 seconds and had been
given 6.3.

Digits carry a further weight of 3.25 clusters each, because `09` section 3.4 has the
narrator saying years as Kannada number words: `2016` is four characters on the page and
`ಎರಡು ಸಾವಿರದ ಹದಿನಾರು`, thirteen clusters, in the mouth. Before that correction the eight
year lines were the worst-fitting in the film, and the year cards were being clipped.

The proof is in the fit. Asking one synthetic voice to hit every line's allocation:

| Model | Rate range needed | Worst line |
|---|---|---|
| Words | 74 to 322 | 7.4 percent out |
| Clusters | 150 to 265 | 6.9 percent out |
| **Clusters + digit weighting** | **146 to 239** | **3.8 percent out** |

A narrower rate range means a more even delivery. The first model would have forced the
narrator to sprint through some lines and crawl through others to stay in sync.

**The narration was not sped up to reach a round number.** The film lands three seconds
over five minutes. If the event needs a hard 5:00:00, take it out of picture, not pace:

| Trim | New duration |
|---|---|
| Cold open `K01` 7:00 to 4:00 | 00:05:00:21 |
| ...and end card `K46` 7:00 to 6:00 | 00:04:59:21 |
| ...and drop the 1-second hold on `K12` | 00:04:58:21 |

**Do not raise the pace to 110 wpm to save the three seconds.** It costs the pauses, and
the pauses are the film.

---

## 2 · The two departures from `09` Version A, and why

| # | Line | `09` Version A | Recorded here | Reason |
|---|---|---|---|---|
| 1 | Section E, hardest to reach | "ಎಚ್‌ಐವಿ **ಪೀಡಿತ** ಕುಟುಂಬಗಳ ಮಕ್ಕಳು" | "ಎಚ್‌ಐವಿ **ಇರುವ** ಕುಟುಂಬಗಳ ಮಕ್ಕಳು" | `09` section 3.5 requires the trustees to choose between the two. ಪೀಡಿತ carries a sense of affliction. ಇರುವ, which `09` itself uses in Version B, states the fact without the judgement. Recommended, **[ಟ್ರಸ್ಟಿ ದೃಢೀಕರಣ ಅಗತ್ಯ]**. |
| 2 | Section B, founding year | Optional line: "ಈ ಕೆಲಸ ಶುರುವಾಗಿದ್ದು ಅದಕ್ಕೂ ನಾಲ್ಕು ವರ್ಷ ಮೊದಲು, 2012ರಲ್ಲಿ. ನೋಂದಣಿ ಆದದ್ದು 2016ರಲ್ಲಿ." | **Not recorded in the base cut** | Gated on `06` Q2. Record it as a **pickup take** and hold it out of the master until the trustees answer. Section 6 below gives the insert point and the exact re-timing. |

Everything else is `09` Version A word for word. A token-level diff against the source confirms every word matches, with no additions. (The 460 figure above is the timeline's own tokeniser, which treats `ಎಚ್.ಎಸ್.ಆರ್.` as one token; `09` counts 471 for Version A including the optional 2012 line held out here.)

---

## 3 · The script

`ಧ್ವನಿ` is spoken. `[ವಿರಾಮ n ಸೆ]` is a deliberate pause with picture running. `[ಹಿಡಿ n ಸೆ]` is silence held on the shot after the line ends.
Claim IDs resolve in [`02-evidence-table.csv`](../../anniversary-video-research/02-evidence-table.csv). Every claim below is **VERIFIED** unless marked otherwise.

---

### 0 · ಆರಂಭಪೂರ್ವ · Cold open
**`00:00:00:00 - 00:00:07:00` · 7:00 · no narration**

> *(ಮೌನ. ಕನ್ನಡ ಶಾಲಾ ಫಲಕ ಮಾತ್ರ.)*
> *(Silence. A Kannada school board and nothing else.)*

Seven seconds of a Karnataka government school signboard before a word is spoken. The audience reads the board itself. `[TML-2025]`

---

### ಎ · ಆರಂಭ · The opening
**`00:00:07:00 - 00:00:29:19` · 22:19 · 38 words**

> **ಧ್ವನಿ:** ಪ್ರತಿ ವರ್ಷ, ಕರ್ನಾಟಕದ ಹಳ್ಳಿಗಳಲ್ಲಿ, ಮಕ್ಕಳು ತಮ್ಮ ಬಳಿ ಇರುವುದೆಲ್ಲವನ್ನೂ ಒಂದೇ ಚೀಲದಲ್ಲಿ ಹೊತ್ತು ಶಾಲೆಗೆ ನಡೆಯುತ್ತಾರೆ. `K02 · 00:00:07:00`
>
> ಅವರಿಗೆ ಬುದ್ಧಿ ಇದೆ. ಕಲಿಯುವ ಹಂಬಲ ಇದೆ. `[ವಿರಾಮ 1 ಸೆ]` `K03 · 00:00:14:13`
>
> ಆದರೆ ಆ ನಡಿಗೆಗೂ ತರಗತಿಗೂ ನಡುವೆ, ಶಾಲಾ ಶುಲ್ಕ ಒಂದು ತೀರ್ಮಾನ ತೆಗೆದುಕೊಂಡು ಬಿಡುತ್ತದೆ. `[ವಿರಾಮ 2 ಸೆ]` `K04 · 00:00:18:04` `[MIS-01]`
>
> ಹತ್ತು ವರ್ಷಗಳಿಂದ, ಒಂದು ಟ್ರಸ್ಟ್ ಸರಿಯಾಗಿ ಅಲ್ಲಿಯೇ ಬಂದು ನಿಂತಿದೆ. `[ಹಿಡಿ 0.5 ಸೆ]` `K05 · 00:00:25:08` `[ORG-13, NUM-08]`

**Performance.** Medium-low energy. The first sentence is a statement of fact, not a lament. Land ಒಂದೇ ಚೀಲದಲ್ಲಿ without pressing it.
The 2-second pause after ಬಿಡುತ್ತದೆ is the most important silence in the first minute. Let it be uncomfortable.
`ಬಂದು ನಿಂತಿದೆ` **[ಟ್ರಸ್ಟಿ / ಸ್ಥಳೀಯ ಪರಿಶೀಲನೆ]**: `09` section 3.5 asks that ನಿಂತಿದೆ, ನಿಂತಿದ್ದಾರೆ and ನಿಂತುಕೊಂಡಿದೆ all be read aloud before the take is chosen. Record all three.

---

### ಎ2 · ಸಂಸ್ಥಾಪಕರ ಮಾತು · The founder's line
**`00:00:29:19 - 00:00:35:19` · 6:00 · no narration**

> *(ಮೌನ. ಪರದೆಯ ಮೇಲೆ ಮಾತ್ರ.)*
> "ಶಿಕ್ಷಣದ ವಿಷಯದಲ್ಲಿ ಯಾವ ಮಗುವೂ ಹಿಂದೆ ಉಳಿಯಬಾರದು."
> ಚಾರುಲತಾ ಎಂ. ಆರ್., ಸಂಸ್ಥಾಪಕರು `[MIS-02]`

**Six seconds, no voice, no music, no photograph.** The longest silence in the film. The brief is explicit: give the founder's quote a quiet pause with nothing underneath it.
**[ಟ್ರಸ್ಟಿ ದೃಢೀಕರಣ ಅಗತ್ಯ]** The founder should either approve this Kannada rendering or supply the words she would actually use. Her own phrasing beats any translation, and if she supplies one, re-set this card and leave the duration alone.

---

### ಬಿ · ಆರಂಭದ ದಿನಗಳು · The early days
**`00:00:35:19 - 00:01:16:18` · 40:24 · 68 words**

> **ಧ್ವನಿ:** ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್, ಬೆಂಗಳೂರಿನ ಎಚ್.ಎಸ್.ಆರ್. ಲೇಔಟ್‌ನಲ್ಲಿರುವ ನೋಂದಾಯಿತ ಶೈಕ್ಷಣಿಕ ಟ್ರಸ್ಟ್. `K07 · 00:00:35:19` `[ORG-04, ORG-05]`
>
> ಇದನ್ನು ಸ್ಥಾಪಿಸಿದವರು ಚಾರುಲತಾ ಎಂ. ಆರ್. ಟ್ರಸ್ಟ್ ಶುರುವಾಗುವ ಮೊದಲೇ ಅವರು ತಮ್ಮ ಬಡಾವಣೆಯ ಮಕ್ಕಳ ಶಾಲಾ ಶುಲ್ಕವನ್ನು ತಾವೇ ಕಟ್ಟುತ್ತಿದ್ದರು. `K08 · 00:00:42:02` `[PPL-01]`
>
> ಅವರ ಜೊತೆಗೂಡಿದವರು ಸಾದೇನಹಳ್ಳಿಯ ಎಸ್. ಎಂ. ಮಂಜುನಾಥ. ಓದಲೆಂದು ಊರು ಬಿಟ್ಟು ನಗರಕ್ಕೆ ಬಂದ ತಮ್ಮ ಕುಟುಂಬದ ಮೊದಲ ವ್ಯಕ್ತಿ. `K09 · 00:00:50:17` `[PPL-02]`
>
> ತಮ್ಮ ಊರಿನ ಹಲವು ಮಕ್ಕಳನ್ನು ಅವರು ಆಗಲೇ ಓದಿಸಿದ್ದರು. `[ವಿರಾಮ 2 ಸೆ]` `K10 · 00:00:58:07` `[PPL-02]`
>
> 2016ರಲ್ಲಿ ಅವರು ಮೊದಲ ಶಾಲಾ ಭೇಟಿ ಮಾಡಿದರು. `K11 · 00:01:03:22` `[TML-2016]`
>
> ಚಿಕ್ಕಬಳ್ಳಾಪುರ. ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. `[ಹಿಡಿ 1 ಸೆ]` `K12 · 00:01:07:17` `[NUM-02]`
>
> ಅದೇ ಭೇಟಿಯಲ್ಲಿ ನೂರೈವತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸ್ಟೀಲ್ ತಟ್ಟೆ ಮತ್ತು ಲೋಟ ವಿತರಿಸಲಾಯಿತು. `K13 · 00:01:11:19` `[NUM-01]`

**Performance.** `ಚಿಕ್ಕಬಳ್ಳಾಪುರ. ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ.` is three separate sentences. Full stop after each. Do not run them together and do not let the pitch rise; the smallness of the number is the point, and any lift turns it into a boast. This is the single most important delivery note in the script.
**[ಟ್ರಸ್ಟಿ ದೃಢೀಕರಣ ಅಗತ್ಯ]** Both trustees must approve the Kannada spelling of their own names before the take is kept: `ಚಾರುಲತಾ ಎಂ. ಆರ್.` and `ಎಸ್. ಎಂ. ಮಂಜುನಾಥ`. See `06` Q10 and Q11, which record four and four competing spellings respectively.

---

### ಸಿ · ಒಂದು ದಶಕದ ಹಾದಿ · A decade of road
**`00:01:16:18 - 00:02:24:05` · 67:12 · 95 words**

> **ಧ್ವನಿ:** 2017ರಲ್ಲಿ ಒಂದು ಹತ್ತಾಯಿತು. ಹತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಿದ್ಯಾರ್ಥಿವೇತನ. `K14 · 00:01:16:18` `[TML-2017, NUM-03]`
>
> ಆಮೇಲೆ ಕೆಲಸ ಹಾಗೇ ಮುಂದುವರಿಯಿತು. ವರ್ಷದಿಂದ ವರ್ಷಕ್ಕೆ. ಅದೇ ದಾರಿಗಳು, ಅದೇ ಶಾಲೆಗಳು, ಇನ್ನಷ್ಟು ಮಕ್ಕಳು. `[ವಿರಾಮ 2 ಸೆ]` `K15 · 00:01:21:23` `[TML-2018, TML-2019, TML-2021]`
>
> 2020ರಲ್ಲಿ ಶಾಲೆಗಳು ಮುಚ್ಚಿದವು, ಕುಟುಂಬಗಳ ದಿನಗೂಲಿ ನಿಂತಿತು. `K16 · 00:01:30:09` `[TML-2020]`
>
> ಆಗ ಟ್ರಸ್ಟ್ ಒಂದೇ ಪುಟದ ಪ್ರಕಟಣೆ ಹೊರಡಿಸಿತು. ಪೋಷಕರನ್ನು ಕಳೆದುಕೊಂಡ ಮಕ್ಕಳಿಗೆ. ಕೆಲಸ ಕಳೆದುಕೊಂಡು ಶುಲ್ಕ ಕಟ್ಟಲಾಗದ ಪೋಷಕರಿಗೆ. ನೆರವು ನಿಲ್ಲಲಿಲ್ಲ. `[ವಿರಾಮ 1 ಸೆ]` `K17 · 00:01:35:00` `[TML-2020b]`
>
> 2022ರಲ್ಲಿ ಪುಸ್ತಕದ ಕಪಾಟುಗಳು ಎದ್ದವು. ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯಗಳು. `K18 · 00:01:45:05` `[TML-2022, PRG-07]`
>
> ದಾನವಾಗಿ ಬಂದ ಕಥೆ ಪುಸ್ತಕಗಳು, ಪಠ್ಯ ಪುಸ್ತಕಗಳು, ಬಳಸದೇ ಉಳಿದ ನೋಟ್‌ಬುಕ್‌ಗಳು. `K19 · 00:01:51:01` `[TML-2022]`
>
> 2023ರಲ್ಲಿ ವ್ಯಾಪ್ತಿ ಹಿಗ್ಗಿತು. ಮೈಸೂರು. ಎಚ್.ಡಿ. ಕೋಟೆ. `K20 · 00:01:56:00` `[TML-2023]`
>
> ಒಂಬತ್ತು ಮತ್ತು ಹತ್ತನೇ ತರಗತಿಯ ಮಕ್ಕಳಿಗೆ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ. ಬದುಕಿನ ದಾರಿ ಸದ್ದಿಲ್ಲದೆ ನಿರ್ಧಾರವಾಗುವ ವಯಸ್ಸು ಅದು. `K21 · 00:02:00:11` `[TML-2023, PRG-06]`
>
> 2024ರಲ್ಲಿ ಎಂ.ಎಂ. ಹಿಲ್ಸ್‌ನ ಬುಡಕಟ್ಟು ಶಾಲೆಗಳಲ್ಲಿ ಇನ್ನೂರು ಶಾಲಾ ಚೀಲ, ನೋಟ್‌ಬುಕ್ ಮತ್ತು ಲೇಖನ ಸಾಮಗ್ರಿಗಳೊಂದಿಗೆ ಶೈಕ್ಷಣಿಕ ವರ್ಷ ಆರಂಭವಾಯಿತು. `K22 · 00:02:07:21` `[TML-2024, NUM-04]`
>
> ಮತ್ತು 2025ರಲ್ಲಿ, ಎಚ್.ಡಿ. ಕೋಟೆಯಲ್ಲಿ, ಮುನ್ನೂರು. `[ಹಿಡಿ 2.5 ಸೆ]` `K23 · 00:02:17:12` `[TML-2025, NUM-05]`

**Performance.** This section carries the decade and must not turn into a list. Vary the landing: 2017 is light, 2020 is flat and quiet, 2022 lifts, 2024 and 2025 are plain and confident.
`ಮತ್ತು 2025ರಲ್ಲಿ, ಎಚ್.ಡಿ. ಕೋಟೆಯಲ್ಲಿ, ಮುನ್ನೂರು.` ends on the number, then 2.5 seconds of held silence. Do not add a word after ಮುನ್ನೂರು. It is the strongest number in the film precisely because nothing follows it.
**No location is named for 2018 to 2021.** `milestones.ts` says KGF and the magazine says Chickaballapur for 2019 and 2021 (`06` A3). The line ಅದೇ ದಾರಿಗಳು, ಅದೇ ಶಾಲೆಗಳು is not a hedge; it is what the evidence actually supports.
**[ಟ್ರಸ್ಟಿ ದೃಢೀಕರಣ]** If the trustees confirm ಮಲೆ ಮಹದೇಶ್ವರ ಬೆಟ್ಟ, record a pickup of `K22` with the full Kannada name. It will land far better with a Karnataka audience than ಎಂ.ಎಂ. ಹಿಲ್ಸ್. `14` item 7.6.

---

### ಡಿ · ಕೆಲಸದ ಕ್ರಮ · How the work is done
**`00:02:24:05 - 00:03:05:05` · 40:24 · 73 words**

> **ಧ್ವನಿ:** ಇದೆಲ್ಲ ಕಚೇರಿಯಲ್ಲಿ ಕುಳಿತು ಆಗುವ ಕೆಲಸವಲ್ಲ. `K24 · 00:02:24:05` `[PRC-02]`
>
> ಮುಖ್ಯೋಪಾಧ್ಯಾಯರೋ, ನೆರೆಹೊರೆಯವರೋ, ಊರಿನ ಹಿತೈಷಿಯೋ ಒಂದು ಹೆಸರು ಸೂಚಿಸುತ್ತಾರೆ. `K25 · 00:02:27:02` `[PRC-01]`
>
> ತಂಡ ಆ ಊರಿಗೆ ಹೋಗುತ್ತದೆ. ಮಕ್ಕಳನ್ನೂ ಪೋಷಕರನ್ನೂ ಒಂದೆಡೆ ಸೇರಿಸಿ, ಪ್ರತಿ ಕುಟುಂಬದ ಜೊತೆ ಕೂತು ಮಾತನಾಡುತ್ತದೆ. `[ವಿರಾಮ 1 ಸೆ]` `K26 · 00:02:31:13` `[PRC-02]`
>
> ನಂತರ ಟ್ರಸ್ಟ್ ಶಾಲಾ ಶುಲ್ಕದ ಶೇಕಡ ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು ಭರಿಸುತ್ತದೆ. ಪೂರ್ತಿ ಅಲ್ಲ. `[ವಿರಾಮ 2 ಸೆ]` `K27 · 00:02:39:02` `[PRC-03, NUM-07]`
>
> ಉಳಿದ ಪಾಲನ್ನು ಕುಟುಂಬವೇ ಕಟ್ಟುತ್ತದೆ. ಏಕೆಂದರೆ ತಾವೂ ಒಂದು ಪಾಲು ಹೊತ್ತ ಪೋಷಕರು ಮಗುವಿನ ಓದಿನ ಒಳಗೇ ಉಳಿಯುತ್ತಾರೆ. `K28 · 00:02:46:06` `[MIS-03]`
>
> ಮತ್ತು ಆ ಹಣ ನೇರವಾಗಿ ಶಾಲೆಗೇ ಸಲ್ಲುತ್ತದೆ. ಬೇರೆ ಯಾರ ಕೈಗೂ ಅಲ್ಲ. `K29 · 00:02:53:03` `[PRC-04, MIS-04]`
>
> ಬುಡಕಟ್ಟು ಶಾಲೆಗಳ ಮಕ್ಕಳ ಜೊತೆ ತಂಡ ಕೆಲವು ದಿನ ಉಳಿಯುತ್ತದೆ. ಕಲಿಸುತ್ತದೆ, ಕಲಿಯುತ್ತದೆ. ಆಮೇಲೆ ಚೀಲಗಳು ಮಕ್ಕಳ ಕೈ ಸೇರುತ್ತವೆ. `K30 · 00:02:57:06` `[EVT-05]`

**Performance.** `ಪೂರ್ತಿ ಅಲ್ಲ.` is two words and it is the film's turn. Say it quietly, at the same volume as the sentence before it, and stop. The music stops with it. Then two full seconds. Any emphasis here reads as defensiveness; flatness reads as honesty.
`ಓದಿನ ಒಳಗೇ ಉಳಿಯುತ್ತಾರೆ` is a coined phrase (`09` section 3.5). If it does not sit comfortably in the mouth, the approved fallback is: **"...ಮಗುವಿನ ಓದಿನ ಜವಾಬ್ದಾರಿಯನ್ನೂ ಜೊತೆಯಾಗಿ ಹೊರುತ್ತಾರೆ."** Record both.
`ಬದುಕಿನ ದಾರಿ ಸದ್ದಿಲ್ಲದೆ ನಿರ್ಧಾರವಾಗುವ ವಯಸ್ಸು ಅದು` in section C has the same status; fallback **"ಮುಂದೇನು ಎಂಬುದು ಸದ್ದಿಲ್ಲದೆ ನಿರ್ಧಾರವಾಗುವ ವಯಸ್ಸು."**

---

### ಇ · ಸುತ್ತಲಿನ ಬೆಂಬಲ · The circle around the fee
**`00:03:05:05 - 00:03:40:09` · 35:04 · 62 words**

> **ಧ್ವನಿ:** ವಿದ್ಯಾರ್ಥಿವೇತನ ಒಂದರಿಂದಲೇ ಶಿಕ್ಷಣ ಪೂರ್ಣವಾಗುವುದಿಲ್ಲ. ಹಾಗಾಗಿ ಶಾಲಾ ಚೀಲ, ನೋಟ್‌ಬುಕ್, ಲೇಖನ ಸಾಮಗ್ರಿ, ಚಿತ್ರಕಲೆಯ ಪರಿಕರ. `K31 · 00:03:05:05` `[PRG-03]`
>
> ಗ್ರಂಥಾಲಯಗಳು. ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ. ಆಟಗಳು. ಮಕ್ಕಳು ಹಾಡಿ ಕುಣಿಯುವ ವೇದಿಕೆ, ಮತ್ತು ಅದನ್ನು ನೋಡಲೆಂದೇ ಬಂದ ಜನ. `K32 · 00:03:12:15` `[PRG-04, PRG-05, PRG-08]`
>
> ಮಕ್ಕಳಿಗೆ ಮಾತ್ರವಲ್ಲ, ಪೋಷಕರಿಗೂ ಮಾರ್ಗದರ್ಶನ. `K33 · 00:03:19:14` `[PRG-09]`
>
> ತಲುಪುವುದೇ ಕಷ್ಟವಾದ ಮಕ್ಕಳನ್ನೂ ಈ ಕೆಲಸ ತಲುಪಿದೆ. ಏಕ ಪೋಷಕರ ಮಕ್ಕಳು. ಎಚ್‌ಐವಿ ಇರುವ ಕುಟುಂಬಗಳ ಮಕ್ಕಳು. ದೀರ್ಘಕಾಲದ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಇರುವ ಮಕ್ಕಳು. `[ವಿರಾಮ 1 ಸೆ]` `K34 · 00:03:22:13` `[MIS-05, TML-2024, TML-2025]`
>
> ಈ ಕೆಲಸ ಬೆಳಕು ಟ್ರಸ್ಟ್, ಸೌಖ್ಯ ಸಮೃದ್ಧಿ ಸಂಸ್ಥೆ, ಜಿಲ್ಲಾ ಆರೋಗ್ಯ ಇಲಾಖೆ ಮತ್ತು ನಿಸರ್ಗ ಫೌಂಡೇಶನ್ ಜೊತೆಗೂಡಿ ನಡೆದಿದೆ. `K35 · 00:03:33:07` `[PTR-01, PTR-02, PTR-03, PTR-04]`

> **ಸಂಪೂರ್ಣ ನಿಯಮ · ABSOLUTE RULE.** `K34` runs 11 seconds and carries single-parent status, HIV in the family and chronic illness. **No child's face, no child's photograph and no illustration of a child may appear anywhere in that shot.** It is a typographic card. This is `14` item 2.4 and it is not negotiable at any stage of the edit or in any social crop.

**Performance.** The four categories in `K34` are read as a plain list, one breath each, with no softening and no pity in the voice. The register that respects these families is the register of a school register, not of a fundraising appeal.
**[ಟ್ರಸ್ಟಿ ದೃಢೀಕರಣ ಅಗತ್ಯ]** on `ಸೌಖ್ಯ ಸಮೃದ್ಧಿ ಸಂಸ್ಥೆ`, transliterated from English; confirm the organisation's own Kannada spelling. `14` item 7.5.

---

### ಎಫ್ · ಗುರುತಿಸುವಿಕೆ ಮತ್ತು ಕೃತಜ್ಞತೆ · Recognition and gratitude
**`00:03:40:09 - 00:04:21:11` · 41:02 · 60 words**

> **ಧ್ವನಿ:** 2024ರ ಜೂನ್‌ನಲ್ಲಿ ಒಂದು ಕನ್ನಡ ದಿನಪತ್ರಿಕೆ ಮುಳಬಾಗಿಲಿನ ಚಿತ್ರವನ್ನು ಪ್ರಕಟಿಸಿತು. ಏಕ ಪೋಷಕರ ಮಕ್ಕಳಿಗೆ ವಿದ್ಯಾರ್ಥಿವೇತನ ವಿತರಣೆ. `[ವಿರಾಮ 1 ಸೆ]` `K36 · 00:03:40:09` `[MED-01, MED-02]`
>
> 2025ರ ಡಿಸೆಂಬರ್‌ನಲ್ಲಿ, ನವದೆಹಲಿಯ ರಾಷ್ಟ್ರೀಯ ಶೃಂಗಸಭೆಯಲ್ಲಿ, ಸಂಸ್ಥಾಪಕರಿಗೆ ಭಾರತ್ ಶಿಕ್ಷಾ ರತ್ನ ಪ್ರಶಸ್ತಿ ಸಂದಿತು. `[ವಿರಾಮ 2 ಸೆ]` `K37 · 00:03:50:11` `[AWD-01]`
>
> ಆದರೆ ಮುಖ್ಯವಾದ ದಾಖಲೆ ಪ್ರಶಸ್ತಿ ಪತ್ರದಲ್ಲಿ ಇಲ್ಲ. ಅದು ಒಂದು ಹೆಸರುಗಳ ಪಟ್ಟಿಯಲ್ಲಿದೆ. ಬೆಂಗಳೂರು, ಚೆನ್ನೈ, ಅಮೆರಿಕ, ಬ್ರಿಟನ್, ಜರ್ಮನಿ, ಡೆನ್ಮಾರ್ಕ್, ದುಬೈನಲ್ಲಿದ್ದು ನೆರವು ನೀಡಿದವರು. `K38 · 00:04:00:12` `[PPL-06]`
>
> ವಕೀಲರು, ಎಂಜಿನಿಯರ್‌ಗಳು, ವೈದ್ಯರು, ಗೃಹಿಣಿಯರು ಆಗಿರುವ ಸ್ವಯಂಸೇವಕರು. ಒಂದು ಮಗುವಿಗಾಗಿ ಫೋನ್ ಮಾಡಿದ ಶಿಕ್ಷಕರು. `K39 · 00:04:11:20` `[PPL-05]`
>
> ಮತ್ತು ತಮ್ಮ ಪಾಲನ್ನು ತಪ್ಪದೇ ಕಟ್ಟಿದ ಪೋಷಕರು. `K40 · 00:04:18:12`

**Performance.** `ಆದರೆ ಮುಖ್ಯವಾದ ದಾಖಲೆ ಪ್ರಶಸ್ತಿ ಪತ್ರದಲ್ಲಿ ಇಲ್ಲ.` is the sentence that keeps the film from becoming an award announcement. Say it as a correction, gently, the way you would correct a compliment.
The last line, `ಮತ್ತು ತಮ್ಮ ಪಾಲನ್ನು ತಪ್ಪದೇ ಕಟ್ಟಿದ ಪೋಷಕರು.`, is the end of the gratitude list and the most important item in it. Slow slightly. No rise.
**No minister names. No "one of 25".** Neither appears on the certificate and there are no ceremony photographs. `06` Q3, `14` item 6.3.

---

### ಜಿ · ಮುಂದಿನ ದಾರಿ · The road ahead
**`00:04:21:11 - 00:04:46:08` · 24:23 · 46 words**

> **ಧ್ವನಿ:** ಈ ವರ್ಷ, ತನ್ನ ಆರೈಕೆಯಲ್ಲಿರುವ ಎಲ್ಲ ಮಕ್ಕಳನ್ನೂ ಬೆಂಗಳೂರಿಗೆ ಕರೆತರಬೇಕೆಂಬುದು ಟ್ರಸ್ಟ್‌ನ ಆಸೆ. ಒಂದು ಕಾರ್ಯಕ್ರಮ, ಒಂದು ದಿನದ ಸುತ್ತಾಟ, ಮನೆಗೆ ಒಯ್ಯಲು ಒಂದು ಉಡುಗೊರೆ. `K41 · 00:04:21:11` `[EVT-03]`
>
> ಅವರಲ್ಲಿ ಹಲವರಿಗೆ ಇದು ಈ ನಗರವನ್ನು ನೋಡುವ ಮೊದಲ ಬಾರಿ. ಕೆಲವರಿಗೆ ತಮ್ಮ ಊರು ಬಿಟ್ಟು ಹೊರಡುವ ಮೊದಲ ಬಾರಿ. `[ವಿರಾಮ 1 ಸೆ]` `K42 · 00:04:31:17` `[EVT-03]`
>
> ಮುಂದಿನ ಹತ್ತು ವರ್ಷವೂ ಹೀಗೇ. ಇನ್ನಷ್ಟು ಜಿಲ್ಲೆಗಳು. ಇನ್ನಷ್ಟು ಗ್ರಂಥಾಲಯಗಳು. ಓದು ನಿಲ್ಲದ ಇನ್ನಷ್ಟು ಮಕ್ಕಳು. `K43 · 00:04:39:14` **[ಟ್ರಸ್ಟಿ ದೃಢೀಕರಣ ಅಗತ್ಯ]**

**BLOCKING.** `K43` is a public promise made on camera by a registered trust. It cannot be recorded into the master until the trustees approve the wording. `14` item 6.9, `06` Q5.
Note what it does not promise: no number of children, no number of districts, no geography. `ಇನ್ನಷ್ಟು` (more) is deliberate and is the only forward claim the evidence supports.

---

### ಎಚ್ · ಸ್ವಾಗತ ಮತ್ತು ಸಮಾರೋಪ · The welcome
**`00:04:46:08 - 00:04:56:21` · 10:13 · 18 words**

> **ಧ್ವನಿ:** ಹತ್ತು ವರ್ಷ. ಒಂದೊಂದೇ ಮಗು. ಸದ್ದಿಲ್ಲದೆ ಉಳಿಸಿಕೊಂಡ ಒಂದು ಮಾತು. `[ವಿರಾಮ 1 ಸೆ]` `K44 · 00:04:46:08` `[MIS-07]`
>
> ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್‌ನ ಹತ್ತನೇ ವರ್ಷದ ಸಂಭ್ರಮಕ್ಕೆ ನಿಮಗೆಲ್ಲರಿಗೂ ಆತ್ಮೀಯ ಸ್ವಾಗತ. `K45 · 00:04:51:04`

**Performance.** The whole film is built to deliver this one line, and it is the only line where the voice may warm openly. Even so: **calm conviction, not a dramatic rise.** Land on ಸ್ವಾಗತ and stop. Do not add ಧನ್ಯವಾದ, do not add a second welcome, do not let the last syllable lift.
Record this line **at least five times**. It is 5.7 seconds long and it is the take the whole event hears.

---

### ಎಚ್2 · ಸಮಾರೋಪ ಫಲಕ · End card
**`00:04:56:21 - 00:05:03:21` · 7:00 · no narration**

> *(ಮೌನ. ಸಂಗೀತ ಮೆಲ್ಲನೆ ಮುಗಿಯುತ್ತದೆ.)*

Seven seconds, one second longer than the English end card so the Kannada headline can be read. **No UPI ID, no payment QR code, ever.** `[ORG-11]`

---

## 4 · Pronunciation and delivery sheet

For the recording engineer and for a non-Kannada-speaking editor placing cuts against the audio. The narrator reads from the Kannada above, never from Roman letters.

| Kannada | Roman | Say it | Where | Watch for |
|---|---|---|---|---|
| ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ | Law Park Educational Trust | *lah park e-ju-KAY-shun-al trust* | K05, K07, K45 | Never translated, never abbreviated to LPET on air. `[ORG-02]` |
| ಚಾರುಲತಾ ಎಂ. ಆರ್. | Charulatha M. R. | *chaa-ru-la-THAA em aar* | K08 | Both initials voiced, small gap between them |
| ಎಸ್. ಎಂ. ಮಂಜುನಾಥ | S. M. Manjunatha | *ess em man-ju-NAA-tha* | K09 | Stress on NAA |
| ಚಿಕ್ಕಬಳ್ಳಾಪುರ | Chickaballapur | *chik-ka-bal-LAA-pu-ra* | K12 | Double ಳ್ಳ held |
| ಸಾದೇನಹಳ್ಳಿ | Sadenahalli | *saa-DAY-na-hal-li* | K09 | |
| ವಿದ್ಯಾರ್ಥಿವೇತನ | vidyaarthi-vetana | *vid-YAAR-thi-VAY-ta-na* | throughout | Never ಸ್ಕಾಲರ್‌ಶಿಪ್. Six syllables, do not compress |
| ನೂರೈವತ್ತು | 150 | *noo-rai-VAT-tu* | K13 | Spoken as a word; the card shows the numeral |
| ಇನ್ನೂರು | 200 | *in-NOO-ru* | K22 | |
| ಮುನ್ನೂರು | 300 | *mun-NOO-ru* | K23 | The film's last number. Land it and stop |
| ಶೇಕಡ ಎಪ್ಪತ್ತೈದು | 75 per cent | *SHAY-ka-da ep-pat-TAI-du* | K27 | |
| ಗ್ರಂಥಾಲಯ | library | *gran-THAA-la-ya* | K18, K32 | Conjunct ಗ್ರಂ, do not say ga-ran |
| ಮೈಸೂರು | Mysore | *my-SOO-ru* | K20 | |
| ಎಚ್.ಡಿ. ಕೋಟೆ | H.D. Kote | *aitch dee KOH-tay* | K20, K23 | Not "coat" |
| ಎಂ.ಎಂ. ಹಿಲ್ಸ್ | MM Hills | *em em hills* | K22 | See the trustee question above |
| ಬುಡಕಟ್ಟು | tribal | *bu-da-KAT-tu* | K22, K30 | Never ಗಿರಿಜನ in narration |
| ಮುಳಬಾಗಿಲು | Mulbagal | *mu-La-BAA-gi-lu* | K36 | Retroflex ಳ |
| ಉದಯವಾಣಿ | Udayavani | *u-da-ya-VAA-ni* | K36 card | Not spoken; onscreen only |
| ಬೆಳಕು ಟ್ರಸ್ಟ್ | Belaku Trust | *BAY-la-ku trust* | K35 | Spelling from Udayavani |
| ಸೌಖ್ಯ ಸಮೃದ್ಧಿ ಸಂಸ್ಥೆ | Soukhya Samrudhi Samsthe | *SOWK-ya sam-RUD-dhi SAM-sthe* | K35 | Awaiting the organisation's own spelling |
| ನಿಸರ್ಗ ಫೌಂಡೇಶನ್ | Nisarga Foundation | *ni-SAR-ga foundation* | K35 | |
| ಭಾರತ್ ಶಿಕ್ಷಾ ರತ್ನ ಪ್ರಶಸ್ತಿ | Bharat Shiksha Ratan Award | *bhaa-rat SHIK-shaa RAT-na pra-SHAS-ti* | K37 | |
| ನವದೆಹಲಿ | New Delhi | *na-va-DEH-li* | K37 | |
| ಸಂಭ್ರಮ | celebration | *sam-BHRA-ma* | K45 | Conjunct ಭ್ರ; the film's second-to-last word |
| ಆತ್ಮೀಯ ಸ್ವಾಗತ | warm welcome | *aat-MEE-ya SWAA-ga-ta* | K45 | The last three seconds of the film |

**The one line the editor must recognise by ear**, because every cut in the last minute hangs off it:

> ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್‌ನ ಹತ್ತನೇ ವರ್ಷದ ಸಂಭ್ರಮಕ್ಕೆ ನಿಮಗೆಲ್ಲರಿಗೂ ಆತ್ಮೀಯ ಸ್ವಾಗತ.
> *lah park e-ju-KAY-shun-al TRUST-na hat-ta-nay VAR-sha-da sam-BHRA-ma-kke ni-ma-gel-la-ri-goo aat-MEE-ya SWAA-ga-ta*

---

## 5 · Words that must never be spoken in this film

From `07` section 12 and `12` section 12. If any of these reaches a take, discard the take.

ಫಲಾನುಭವಿ · ಬಡ ಮಕ್ಕಳು · ಅಸಹಾಯಕ · ದೀನ · ಸಬಲೀಕರಣ · ಜೀವನ ಪರಿವರ್ತನೆ · ಉದ್ಧಾರ · ಹೃದಯಸ್ಪರ್ಶಿ · ಕಣ್ಣೀರು

And no cumulative total of any kind: no number of children supported, no number of villages, no number of districts, no number of schools, until `06` Q1 is answered. `14` item 6.1.

---

## 6 · Pickup takes to record in the same session

Record all of these. None of them goes into the master without a trustee decision, and having them on file means no second session.

| # | Line | Gate | Insert point | Re-timing |
|---|---|---|---|---|
| P1 | ಈ ಕೆಲಸ ಶುರುವಾಗಿದ್ದು ಅದಕ್ಕೂ ನಾಲ್ಕು ವರ್ಷ ಮೊದಲು, 2012ರಲ್ಲಿ. ನೋಂದಣಿ ಆದದ್ದು 2016ರಲ್ಲಿ. | `06` Q2, founding year | After `K13`, before `K14` | +7.4 s at 105 wpm. New total 00:05:11:04. Trim the cold open to 4:00 and the end card to 6:00 to hold 00:05:08:04 |
| P2 | ...ಎಚ್‌ಐವಿ **ಪೀಡಿತ** ಕುಟುಂಬಗಳ ಮಕ್ಕಳು... | `09` 3.5, trustees choose | Replaces the same clause in `K34` | none, same word count |
| P3 | 2024ರಲ್ಲಿ **ಮಲೆ ಮಹದೇಶ್ವರ ಬೆಟ್ಟದ** ಬುಡಕಟ್ಟು ಶಾಲೆಗಳಲ್ಲಿ... | `14` 7.6 | Replaces `K22` | +1.1 s |
| P4 | ...ಮಗುವಿನ ಓದಿನ ಜವಾಬ್ದಾರಿಯನ್ನೂ ಜೊತೆಯಾಗಿ ಹೊರುತ್ತಾರೆ. | `09` 3.5 fallback | Replaces the tail of `K28` | +1.1 s |
| P5 | ಮುಂದೇನು ಎಂಬುದು ಸದ್ದಿಲ್ಲದೆ ನಿರ್ಧಾರವಾಗುವ ವಯಸ್ಸು. | `09` 3.5 fallback | Replaces the tail of `K21` | -0.6 s |
| P6 | ...ಒಂದು ಟ್ರಸ್ಟ್ ಸರಿಯಾಗಿ ಅಲ್ಲಿಯೇ ಬಂದು **ನಿಂತಿದ್ದಾರೆ** / **ನಿಂತುಕೊಂಡಿದೆ**. | `09` 3.5, read all three aloud | Replaces `K05` | none |
| P7 | The founder's own Kannada wording of her quote, if she supplies one | `14` 7.4 | `K06` is a silent card; record it anyway in case the film later uses her voice | n/a |

---

## 7 · Delivery from the recording session

| Item | Spec |
|---|---|
| Main Kannada narration | WAV, 48 kHz, 24-bit, **mono** |
| Clean take | no music, no processing beyond gentle de-essing |
| Pickups | one file per line in section 6, named `P1-...` to `P7-...` |
| Alternate year readings | both "ಎರಡು ಸಾವಿರದ ಹದಿನಾರು" and the English-digit style for every year, chosen in the edit (`09` section 3.4) |
| Pronunciation sheet | section 4 above, printed for the booth |
| Timecoded transcript | this document |
| Kannada subtitles | [`05-kannada-subtitles.srt`](05-kannada-subtitles.srt), UTF-8 with BOM |
| English subtitles | optional, generated from `08-english-five-minute-script.md` against this timeline |
| Narrator release | signed, covering event screening, website, YouTube, social media and donor communication. `14` item 5.5 |

Narration peaks no higher than **-3 dBTP**. Music bed at least **12 dB below** narration at all times. Event master **-23 LUFS**, online master **-16 LUFS**.
