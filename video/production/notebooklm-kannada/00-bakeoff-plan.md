# 00 · NotebookLM Kannada bake-off plan

**Goal.** Produce a second Kannada version of the 10-year film using a NotebookLM
Video Overview, with NotebookLM writing its own narration, then compare it
head to head against the finished pack and decide what, if anything, we carry across.

**Incumbent.** `video/production/kannada/kannada-1080p-EVENT-master.mp4`
1920x1080, 25 fps, **5 min 57.9 s**, ElevenLabs Kannada narration, 14-cue SFX pack,
face-free fallback stills. Built from script `09` Version A, every claim tied to
`02-evidence-table.csv`.

**Challenger.** A NotebookLM Video Overview, Kannada output, narration composed by
the model from a fact pack we choose.

**Timebox.** About two hours end to end. Roughly 20 minutes preparing sources,
15 minutes of generation wait, 45 minutes of scored viewing, 20 minutes of writeup.

**Honest expectation.** The challenger will very likely win on speed and lose on
photography and on fact discipline. That is still worth an afternoon, because the
things it can win on are real: a fresh Kannada phrasing we have not thought of, a
clearer beat order, and a read on whether Google's Kannada TTS has passed
ElevenLabs. Plan for a harvest, not a replacement.

---

## 1 · The decision that comes before any upload

The current event master **already refuses to show children's faces**. `13-event-playback-notes.md`
says the picture uses `film.py --fallback`, 24 shots replaced with face-free stills,
because guardian consent under `14` item 2.1 is still blank. `14` Part 1 is explicit
that no consent or release record exists anywhere in the repository.

Uploading those same photographs to a third-party service to make a second film
would be a step backwards from a position the pack took deliberately.

**Recommendation: run the bake-off with a face-free source set.** No child photographs
go to NotebookLM. We compare narration, structure, language and voice, which is
where the interesting answer lives anyway. The incumbent's photography is not in
question and does not need to be re-litigated by a slideshow generator.

If the trustees later want a photo comparison, it happens after `14` items 2.1,
2.2 and 2.3 are signed, and with a cleared-photo subset only.

**Second thing to settle before uploading:** confirm what Google's current terms say
about ownership and permitted use of a generated Video Overview, and whether the
notebook's contents are used for model improvement on the account tier we are on.
Write the answer into section 6 of the comparison. A film that cannot be screened
at the event or posted to YouTube is not a candidate, however good it looks.

---

## 2 · Build the upload pack

Target folder: `video/production/notebooklm-kannada/upload/`

**Include.** These give NotebookLM the facts and the register, and nothing else.

| Source | Why | Format for upload |
|---|---|---|
| `01-source-of-truth.md` | The organisation, in plain prose | PDF or paste as text |
| `02-evidence-table.csv` | The claim ledger. 57 claims cleared, the rest gated | Convert to PDF or Google Sheet, CSV alone reads poorly |
| `03-impact-and-milestone-data.csv` | Year-by-year numbers | Same |
| `06-fact-check-and-trustee-questions.md` | Tells it what is contested and must not be asserted | PDF |
| `07-bilingual-creative-brief.md` | Audience, register, the quiet-pride target | PDF |
| `13-credits-and-acknowledgements.md` | Correct names and spellings | PDF |
| `https://journey.lawparkeducationaltrust.org/` | Live site as a website source | URL source |

**Withhold, deliberately.**

- `08` and `09`, the finished English and Kannada scripts. If NotebookLM sees them it
  will paraphrase them, and the comparison stops being a comparison.
- `10` storyboard and edit plan, for the same reason.
- `data/childrenStories.ts` and anything derived from it. Blocked outright by `14` 2.5.
- Every photograph, per section 1 above.

Prepare the pack, then list every file that went up in a `SOURCES.md` beside it, so the
result is reproducible and we can tell later which input produced which claim.

---

## 3 · Configure the notebook

Feature names in NotebookLM move around. Verify each of these in the interface at the
time of use rather than trusting the labels here.

1. Create a notebook named `LPET 10 years · Kannada bake-off`.
2. Add all sources from section 2. Confirm each one ingested and is not truncated.
3. **Set the notebook output language to Kannada before generating.** This is a notebook
   setting, not a per-video one, and getting it wrong wastes a full generation cycle.
4. Choose Video Overview. Pick the longer explainer format, not the brief one, since the
   event slot is 5 to 7 minutes.
5. Pick a visual style. Choose the most restrained option available and note which one,
   so the comparison records it. Anything whimsical will read as disrespectful next to
   photographs of the actual children in the room.
6. Paste the customization prompt from section 4.
7. Generate. Expect several minutes. Do not touch the notebook while it runs.

---

## 4 · Customization prompt, ready to paste

Write the prompt in English even though the output is Kannada. The constraints matter
more than the language they are given in.

```
Make a five to seven minute anniversary film for Law Park Educational Trust,
a registered educational trust in HSR Layout, Bengaluru, that turns ten years
old in 2026.

AUDIENCE, in the room, in this order of priority: rural Kannada-speaking
children the trust has supported and their parents, then volunteers and
trustees, then donors, then the chief guest and local press. Kannada is the
primary language for most of this room, not a translation for a minority.

REGISTER: quiet pride, earned over time. Not pity, not triumph, not a charity
appeal. The feeling of a long job done steadily by people who kept showing up.
This is a welcome film that opens an event. The fundraising ask comes later in
the programme, so do not make one.

STRUCTURE: an eight-beat arc across the decade. Open on education as
possibility. The founding, and the first school visit in 2016. How the process
actually works: someone puts a child's name forward, the team drives out, they
sit with the family, the trust pays the school directly. The programmes that
grew from it. The years, 2016 to 2026. The people who made it possible. Close
on an invitation into the next ten years.

USE ONLY these facts, from the evidence table and milestone data provided:
- The trust's name in Kannada is exactly ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್.
- Founded by Charulatha M. R., joined by S. M. Manjunatha of Sadenahalli.
- First school visit 2016, Chickaballapur. One scholarship, and 150 students
  given a steel plate and a steel glass.
- The trust pays up to 75 per cent of a school fee, directly to the school.
- Libraries in rural schools, career guidance for standards nine and ten,
  200 school bags at MM Hills, 300 in H.D. Kote.

DO NOT, under any circumstances:
- State any cumulative total of students, villages or districts helped. Those
  figures conflict across sources and are not cleared. No "over 550 students",
  no totals of any kind.
- Mention HIV status, bereavement, disability, family violence, or any named
  child's personal circumstances.
- Tell any individual child's hardship story.
- Invent a quotation, a statistic, a date or a place name. If a fact is not in
  the sources, leave it out.
- Use English words where ordinary Kannada exists, beyond proper nouns and the
  trust's own name.

Speak numbers as Kannada words. Keep the pace unhurried, around 100 words per
minute, and leave silence for images to carry.
```

---

## 5 · Capture the output

- Download the MP4. Note its real duration, resolution and frame rate with `ffprobe`.
- Save to `video/production/notebooklm-kannada/nblm-kannada-v1.mp4`.
  **It will not be committed.** `.gitignore` excludes `*.mp4` at line 46, the same rule
  that keeps every other cut out of the repository.
- Transcribe the narration to `nblm-kannada-v1-transcript.txt`. Everything in section 6
  depends on having the spoken words as text.
- If the first generation misses badly, regenerate once with a tightened prompt, and
  keep both. Two attempts is the cap. More than that and we are hand-authoring the
  script through a prompt, which is the other option we did not choose.

---

## 6 · The comparison

Score both films on the same eight axes, 1 to 5, in
`video/production/notebooklm-kannada/01-comparison.md`.

| # | Axis | How it is judged | Weight |
|---|---|---|---|
| 1 | **Factual accuracy** | Every spoken claim checked against `02-evidence-table.csv`. Count claims with no VERIFIED backing. **Any cumulative student, village or district total is an automatic fail on this axis**, per `06` question 1 | Blocking |
| 2 | **Safeguarding** | Anything that would breach `14` Part 2. Hardship language over an identifiable face, a named child, a case story | Blocking |
| 3 | **Rights and usability** | Can this be projected at the event and posted to YouTube. Ownership, attribution, watermark, terms | Blocking |
| 4 | **Kannada quality** | Register, grammar, numbers spoken as Kannada words, code-mixing. Proper nouns: Chickaballapur, Sadenahalli, H.D. Kote, MM Hills, Muttalapete. Use the pronunciation appendix in `09` section 4 as the checklist | High |
| 5 | **Voice** | Naturalness, warmth, pace, breath. Direct A/B against the ElevenLabs read in `08-kannada-elevenlabs-preview.mp4` | High |
| 6 | **Picture** | Real photographs of the real decade versus generated illustration. For a room containing the children in those photographs, this is close to decisive | High |
| 7 | **Brand** | Navy `#1c1c2e`, gold `#c9903e`, cream `#faf8f3`, Noto Sans Kannada rendering, correct logo, org name spelled ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ | Medium |
| 8 | **Slot fit and delivery** | Duration inside 5 to 7 minutes, resolution, audio levels, whether a Kannada SRT can be produced from it | Medium |

**Watch them properly.** Same screen, same audio chain, back to back, in that order and
then reversed. Follow `13-event-playback-notes.md` for the playback setup so the
incumbent is heard the way the hall will hear it. Two people minimum, one of them a
first-language Kannada speaker, scoring independently before comparing notes.

---

## 7 · Decide, then harvest

Three outcomes, in descending likelihood.

**A. Incumbent holds, harvest the challenger.** Most likely. Pull out anything genuinely
better: a Kannada line that lands harder, a beat order that flows better, a way of
framing the 75 per cent that is clearer. Fold those into `09` as revisions, re-record,
rebuild with `tools/master.py`. The NotebookLM cut is filed as a research artefact.

**B. Challenger wins on voice only.** Also plausible. Then the question is narrower and
useful: swap the narration source, keep the picture. That is a `vo.py` change, not a
new film.

**C. Challenger wins outright.** Unlikely, and if it happens the blocking axes still
have to be clean before it goes anywhere near the hall. A film that cannot pass `14`
is not a film we have.

Whatever the outcome, write it up. The comparison document is the deliverable that
survives, and it answers a question the trust will ask again on the next project:
can a generated overview stand in for a directed film.

---

## 8 · Files this plan produces

```
video/production/notebooklm-kannada/
├── 00-bakeoff-plan.md              this document
├── SOURCES.md                      exactly what was uploaded
├── upload/                         the prepared source pack
├── nblm-kannada-v1.mp4             not committed, gitignored
├── nblm-kannada-v1-transcript.txt  the spoken narration as text
└── 01-comparison.md                scores, evidence, decision
```
