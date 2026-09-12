# Runway prompt pack · ಕನ್ನಡ ಚಿತ್ರ

**ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ · ಹತ್ತು ವರ್ಷಗಳ ಸಂಭ್ರಮ**
46 shots · 3840x2160 or 1920x1080 · 25 fps · **00:05:57:22** · 357.88 s

For whoever sits down at [app.runwayml.com](https://app.runwayml.com/) to try this film.
Every timecode, duration and path below is read out of [`tools/timeline.json`](tools/timeline.json), which is the pack's timing source of truth. Do not re-type them from `01`, `03` or `06`: those three documents still carry the older designed timeline of `00:05:03:21`, and the film on disk is `00:05:57:22`. That gap is real and is flagged at the end of this document.

---

## 1 · What Runway can actually do for this film

The honest answer is: four shots well, twenty-three shots only if the trustees agree to synthetic footage, and the remaining nineteen not at all.

That is not a limitation of the tool. It is what this particular film is made of. An image-to-video model re-renders every pixel of the frame it is given. This film's frames are, in order of how often: **Kannada lettering** (nine typographic cards, four school signboards, a poster, a printed chart, a newspaper page, a certificate), **children's faces under a consent gate** (twenty-three shots), and **two named trustees**. Each of those three is a category a generative pass either destroys or must not touch.

| Lane | Shots | What to do |
|---|---|---|
| **A · generate** | 6 clips across 4 cuts | Upload the plate, prompt the motion, cut it in |
| **B · do not send** | 10 shots + 9 cards = 19 | Keep the render `film.py` already makes |
| **C · blocked** | 23 shots | Wait for the release, or generate a place-and-object stand-in under section 5's rules |

**Nothing here replaces the finished film.** `kannada-1080p-EVENT-master.mp4` and `kannada-2160p-review.mp4` already exist and already cut. This pack is for trying Runway against them, one shot at a time, and keeping whatever turns out better.

### Before you upload anything

Uploading a plate sends it to a third party. Three of the pack's five publishing gates apply directly to that act, and none of them is open yet:

- **Gate 2, consent.** 21 shots are marked BLOCKING on consent, and Lane C holds 23: the extra two are `K19`, marked `[C]` but not BLOCKING, and `K38`, marked ADULTS AND SOME CHILDREN. Both are still a child on screen and both are still an upload. A release that has not been signed cannot cover a disclosure to an AI vendor. `tools/runway_plates.py` refuses to write any of these plates, which is deliberate: a folder of blocked plates is an upload waiting to happen.
- **Gate 3, copyright.** `K36`, the Udayavani clipping, is a third party's property with no written permission on file. It may not be uploaded to anything.
- **Gate 5, names.** Not triggered by an upload, but a generated shot cannot appear in a cut that goes out under the Trust's name until section 5's disclosure question is answered.

Run `python3 tools/master.py --check` for the current state of all five.

---

## 2 · Runway settings for every generation in this pack

| Setting | Value | Why |
|---|---|---|
| Mode | **Image to video** for Lane A, **text to video** for Lane C | Lane A has a real photograph to preserve. Lane C has nothing to preserve, by definition |
| Model | the current Gen-4 family generation | Menu wording changes; take the newest image-to-video model on the account |
| Aspect ratio | **16:9** | The plates are 1920x1080 exactly. Any other ratio and the crop the storyboard specified is thrown away |
| Duration | **5s or 10s**, per shot below | Runway generates in fixed lengths. Section 7 covers reaching the cut duration |
| Seed | **lock it and write it down** | The only way a re-run is a variation rather than a fresh roll of the dice |
| Upscale | leave off until the take is chosen | The master is 2160p but no photograph in this library exceeds 1920x1446, so an upscale buys nothing until the cut is locked |

**Write the prompt as a description of the motion, not of the picture.** In image-to-video the model can already see the photograph. Telling it what is in the frame invites it to reinterpret what is in the frame. Every Lane A prompt below is phrased that way.

**Never ask for lettering.** Not on a board, not on a spine, not on a banner, not on a form. Kannada shaping needs HarfBuzz and the model does not have it, which is the same reason `tools/gfx.py` renders every card through headless Chrome and never through PIL. Any Kannada a model produces is decorative noise, and in a film whose first seven seconds are a Kannada signboard read in silence, decorative noise is a lie.

---

## 3 · Lane A · the four cuts worth generating

First, write the plates. They are the cropped photograph at frame size with no push, no lower third and no subtitle burned in, which is what a model needs and what `film.py --stills` does not give you:

```bash
cd video/production/kannada/tools
python3 runway_plates.py
```

That writes 15 cleared plates into `tools/runway-plates/` and names the 24 it refused. Four of the 15 are the Lane A cuts below; the other 11 are Lane B, written for reference only.

| Cut | Plate to upload | Gen | In | Cut duration | Reaching it |
|---|---|---|---|---|---|
| `K18` | `tools/runway-plates/K18.png` | 10s | 00:02:00:24 | 7.20s | trim to 7.20s |
| `K22` | `tools/runway-plates/K22.png` | 10s | 00:02:28:12 | 11.04s | retime to 90.6% speed (11.04s from 10s) |
| `K26` | `tools/runway-plates/K26.png` | 10s | 00:02:56:07 | 9.00s | trim to 9.00s |
| `K31_t1` | `tools/runway-plates/K31_t1.png` | 10s | 00:03:36:02 | 9.44s | trim to 9.44s |
| `K31_t2` | `tools/runway-plates/K31_t2.png` | 10s | 00:03:36:02 | 9.44s | trim to 9.44s |
| `K31_t3` | `tools/runway-plates/K31_t3.png` | 10s | 00:03:36:02 | 9.44s | trim to 9.44s |

`K31` is a three-up collage in the cut, so its tiles are generated separately and the collage is rebuilt in the edit. `film.py`'s collage layout takes still tiles only.

### K18 · `00:02:00:24 - 00:02:08:04` · 7.20s · 10s generation

**Plate** `tools/runway-plates/K18.png`  
**Cut motion** Slow 4% push across the shelves.  
**Consent** CLEAR - no person in frame

**Prompt**

```text
Locked-off documentary shot of a full library bookshelf in a rural school, books packed floor to ceiling. The camera pushes in very slowly and steadily, about four percent across the whole clip. Nothing else moves at all: no book shifts, no hand enters, no change of light. Warm indoor daylight, natural colour, no film grain, no stylisation.
```

**Under this shot** `K18` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K18.mp3

> 2022ರಲ್ಲಿ ಪುಸ್ತಕದ ಕಪಾಟುಗಳು ಎದ್ದವು. ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯಗಳು.

**Reject a take for** Spine lettering. The model will reinvent every printed word on every spine. Reject any take where a spine's colour block moves or a book leans differently at the end than at the start. Keep the push under five percent: past that the reinvented type becomes readable as wrong.

### K22 · `00:02:28:12 - 00:02:39:13` · 11.04s · 10s generation

**Plate** `tools/runway-plates/K22.png`  
**Cut motion** Static 2s, then 3% push.  
**Consent** CLEAR - no person in frame

**Prompt**

```text
Static high-angle documentary shot looking down into the open boot of a car packed with stacked school notebooks and textbooks. The camera holds completely still for the first two seconds, then begins an extremely slow push in, about three percent. The stacks stay exactly as they are. Overcast daylight. No people, no hands, nothing enters the frame.
```

**Under this shot** `K22` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K22.mp3

> 2024ರಲ್ಲಿ ಎಂ.ಎಂ. ಹಿಲ್ಸ್‌ನ ಬುಡಕಟ್ಟು ಶಾಲೆಗಳಲ್ಲಿ ಇನ್ನೂರು ಶಾಲಾ ಚೀಲ, ನೋಟ್‌ಬುಕ್ ಮತ್ತು ಲೇಖನ ಸಾಮಗ್ರಿಗಳೊಂದಿಗೆ ಶೈಕ್ಷಣಿಕ ವರ್ಷ ಆರಂಭವಾಯಿತು.

**Reject a take for** Stack collapse. The model likes to settle a leaning pile. Reject any take where a stack slumps, slides or gains a book. Cover art on the notebooks will be redrawn; that is acceptable here because none of it is meant to be read, unlike the shelves in K18.

### K26 · `00:02:56:07 - 00:03:05:07` · 9.00s · 10s generation

**Plate** `tools/runway-plates/K26.png`  
**Cut motion** Static.  
**Consent** CLEAR after crop - the hands-and-form window excludes every face

**Prompt**

```text
Static documentary shot of a worn wooden school desk. Hands rest on a paper form, a pen held above it. Almost nothing moves: the smallest natural settle of a hand, a breath of cotton fabric at the edge of frame. The camera does not move at all. Indoor daylight from one side. No face is visible anywhere in the frame.
```

**Under this shot** `K26` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K26.mp3

> ತಂಡ ಆ ಊರಿಗೆ ಹೋಗುತ್ತದೆ. ಮಕ್ಕಳನ್ನೂ ಪೋಷಕರನ್ನೂ ಒಂದೆಡೆ ಸೇರಿಸಿ, ಪ್ರತಿ ಕುಟುಂಬದ ಜೊತೆ ಕೂತು ಮಾತನಾಡುತ್ತದೆ.

**Reject a take for** TWO HARD REJECTS. First, fingers: discard any take where a hand gains or loses a finger, or where a wrist bends the wrong way. Second, and this one is a rights failure and not a quality failure, a face. This crop exists to keep every face out of the frame because the full photograph is a private conversation about a family's money (`07` item 2.10). If the model reveals a head at the top edge, the take is dead. The handwriting on the form will reflow into nonsense; it is out of focus and unreadable in the plate, so that is tolerable.

### K31_t1 · `00:03:36:02 - 00:03:45:13` · 9.44s · 10s generation

**Plate** `tools/runway-plates/K31_t1.png`  
**Cut motion** Static.  
**Consent** CLEAR - no person, no brand in frame

**Prompt**

```text
Static shot of new school bags packed into the boot of a car. The camera holds still with a barely perceptible push in. Nothing moves. Daylight, no people.
```

**Under this shot** `K31` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K31.mp3

> ವಿದ್ಯಾರ್ಥಿವೇತನ ಒಂದರಿಂದಲೇ ಶಿಕ್ಷಣ ಪೂರ್ಣವಾಗುವುದಿಲ್ಲ. ಹಾಗಾಗಿ ಶಾಲಾ ಚೀಲ, ನೋಟ್‌ಬುಕ್, ಲೇಖನ ಸಾಮಗ್ರಿ, ಚಿತ್ರಕಲೆಯ ಪರಿಕರ.

**Reject a take for** Tile one of three. Generate all three, then rebuild the collage in the edit; film.py's collage layout cannot take moving tiles.

### K31_t2 · `00:03:36:02 - 00:03:45:13` · 9.44s · 10s generation

**Plate** `tools/runway-plates/K31_t2.png`  
**Cut motion** Static.  
**Consent** CLEAR - no person, no brand in frame

**Prompt**

```text
Static overhead shot of pens, geometry boxes, crayons and exercise books laid out in rows on a floor. The camera holds still with a very slow, very small push in. No hand enters the frame. Even indoor daylight.
```

**Under this shot** `K31` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K31.mp3

> ವಿದ್ಯಾರ್ಥಿವೇತನ ಒಂದರಿಂದಲೇ ಶಿಕ್ಷಣ ಪೂರ್ಣವಾಗುವುದಿಲ್ಲ. ಹಾಗಾಗಿ ಶಾಲಾ ಚೀಲ, ನೋಟ್‌ಬುಕ್, ಲೇಖನ ಸಾಮಗ್ರಿ, ಚಿತ್ರಕಲೆಯ ಪರಿಕರ.

**Reject a take for** Tile two of three. Brand marks: this asset was chosen over two others precisely because it carries no commercial packaging (`06` rejects). If the model invents a logo, reject the take.

### K31_t3 · `00:03:36:02 - 00:03:45:13` · 9.44s · 10s generation

**Plate** `tools/runway-plates/K31_t3.png`  
**Cut motion** Static.  
**Consent** CLEAR - no person, no brand in frame

**Prompt**

```text
Static shot looking down into a car boot filled with donated textbooks and notebooks in stacks. The camera holds still, then pushes in about three percent. Nothing shifts. Daylight, no people.
```

**Under this shot** `K31` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K31.mp3

> ವಿದ್ಯಾರ್ಥಿವೇತನ ಒಂದರಿಂದಲೇ ಶಿಕ್ಷಣ ಪೂರ್ಣವಾಗುವುದಿಲ್ಲ. ಹಾಗಾಗಿ ಶಾಲಾ ಚೀಲ, ನೋಟ್‌ಬುಕ್, ಲೇಖನ ಸಾಮಗ್ರಿ, ಚಿತ್ರಕಲೆಯ ಪರಿಕರ.

**Reject a take for** Tile three of three.

---

## 4 · Lane B · the nineteen shots that must not go through Runway

Not a matter of taste. Each of these is either text that is read on screen, a document of record, or a real named person's face.

| Shot | In | What it is | Keep | Why not Runway |
|---|---|---|---|---|
| `K01` | 00:00:00:00 | `2025-government-primary-school-sign.jpg` | film.py, 3% push after a 3s hold | The whole shot is a Kannada government school signboard, held seven seconds in silence so the audience reads it. Five lines of Kannada and the name of the taluk. An image-to-video model re-renders every pixel it is handed, so the board comes back as Kannada-shaped noise. This is the film's first frame and its only unwritten caption. |
| `K04` | 00:00:19:21 | `2025-colorful-school-building.jpg` | film.py, static | A painted school building with ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ, ಮಂಟಿಹಾಡಿ legible on the board. Same failure as K01, and the shot is static anyway, so there is nothing for Runway to add. |
| `K08` | 00:00:45:24 | `Charulatha-MR.jpeg` | film.py, 2% push | The founder's portrait. Do not put a real, named, identified person's face through a generative model in a documentary: what comes back is a different face wearing her name. Also gated on her own likeness approval (`07` section 3). |
| `K09` | 00:00:56:03 | `trustee-mr-sm-manjunatha.webp` | film.py, static | The trustee's portrait. Same rule as K08. |
| `K10` | 00:01:04:19 | `2025-saraswati-primary-school-sign.jpg` | film.py, static | A weathered village school board. It exists in the cut to carry 'the children of his own village' without putting a person on screen; the lettering is the entire content. |
| `K17` | 00:01:47:21 | `2020-pandemic-relief-announcement-poster.jpg` | film.py, panel layout, static | LPET's own 2020 relief poster beside a Kannada gloss strip. Two text blocks, one of them a document of record. The storyboard's rule for documents is no push at all. |
| `K21` | 00:02:20:01 | `2023-school-event-backdrop-photo.jpg` | film.py, 3% push toward the chart | Two reasons, either sufficient. The subject is LPET's own printed career guidance chart, which is text. And the four people in frame are named volunteers whose faces a generative pass would redraw. |
| `K25` | 00:02:49:20 | `2025-government-primary-school-sign.jpg` | film.py, static, held 1s longer than the English cut | The K01 board returning at a tighter focal length. The rhyme only works if it is visibly the same board, which is exactly what a generative pass cannot promise. |
| `K36` | 00:04:18:15 | `2024-newspaper-coverage-clipping.jpg` | film.py, 5% push toward headline and caption | The Udayavani clipping, and the film's only independent verification. Two compounding reasons: the headline and caption are read on screen, and the clipping is third-party copyright with no written permission on file (`07` gate 3). It may not be uploaded anywhere. |
| `K37` | 00:04:30:22 | `bharat-shiksha-ratan-award-certificate-scan.jpeg` | film.py, static | The award certificate. A document, read on screen. No push, and no generative pass: a reworded certificate is a fabricated record. |

**And all nine typographic cards.** These are not photographs at all. They are rendered by `tools/gfx.py` through headless Chrome so Kannada conjuncts shape correctly, then animated by `film.py` state by state. A generative pass over them produces Kannada-shaped decoration where the founder's quote used to be.

| Card | In | Duration | On screen |
|---|---|---|---|
| `K05` | 00:00:28:00 | 4.98s | ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್  //  ಹತ್ತು ವರ್ಷ · 2016 ರಿಂದ 2026 |
| `K06` | 00:00:33:00 | 6.00s | "ಶಿಕ್ಷಣದ ವಿಷಯದಲ್ಲಿ ಯಾವ ಮಗುವೂ ಹಿಂದೆ ಉಳಿಯಬಾರದು."  //  ಚಾರುಲತಾ ಎಂ. ಆರ್., ಸಂಸ್ಥಾಪಕರು |
| `K07` | 00:00:39:00 | 6.96s | ನೋಂದಾಯಿತ ಶೈಕ್ಷಣಿಕ ಟ್ರಸ್ಟ್  //  ಎಚ್.ಎಸ್.ಆರ್. ಲೇಔಟ್, ಬೆಂಗಳೂರು |
| `K12` | 00:01:14:08 | 6.12s | ಒಂದು ಮಗು.  //  ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. |
| `K27` | 00:03:05:07 | 7.92s | ಶಾಲಾ ಶುಲ್ಕದ ಶೇಕಡ 75ರವರೆಗೆ  //  ನೇರವಾಗಿ ಶಾಲೆಗೆ |
| `K29` | 00:03:21:05 | 5.28s | ನೇರವಾಗಿ ಶಾಲೆಗೆ. ಬೇರೆ ಯಾರ ಕೈಗೂ ಅಲ್ಲ. |
| `K34` | 00:03:57:23 | 12.52s | (no list on screen under this line) |
| `K35` | 00:04:10:11 | 8.16s | ಸಹಭಾಗಿತ್ವದಲ್ಲಿ  //  ನಿಸರ್ಗ ಫೌಂಡೇಶನ್  //  ಬೆಳಕು ಟ್ರಸ್ಟ್, ಬಂಗಾರಪೇಟೆ  //  ಸೌಖ್ಯ ಸಮೃದ್ಧಿ ಸಂಸ… |
| `K46` | 00:05:50:22 | 7.00s | ಪ್ರತಿ ಮಗುವಿನ ಮೇಲೆ ನಂಬಿಕೆ ಇಟ್ಟ ಒಂದು ದಶಕ  //  ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ · 2016 ರಿಂದ 2026… |

---

## 5 · Lane C · the twenty-three blocked shots

These are the shots waiting on guardian consent. Runway can do something genuinely useful here, and it is not the obvious thing.

**The obvious thing is to generate children, and the answer is no.** A film that exists to thank real people, about real children whose guardians have not yet been asked, cannot fill the gap with manufactured children. It also collides with the script's own register: the banned-words list in `01` section 5 keeps ಫಲಾನುಭವಿ, ಅಸಹಾಯಕ and ಹೃದಯಸ್ಪರ್ಶಿ out of the narration precisely so the film does not perform the children it is about. Generating them performs them harder than any adjective could.

**What works instead is the place and the object.** Every prompt below generates the room, the road, the desk, the bags, the gate: what the line is about, with the people left out. Twenty-one of the twenty-three are empty frames. One, `K30`, shows two pairs of hands and nothing above the shoulder line. `K45` is refused outright and says why.

### The four rules for anything generated in this lane

1. **No face, ever.** Not a real one, not a synthetic one, not a blurred one, not a back of a head that could be mistaken for a specific child.
2. **No lettering.** Same reason as section 2. An empty classroom with hallucinated Kannada on the wall is worse than an empty classroom.
3. **Never a claim.** A generated frame may carry atmosphere. It may not carry evidence. It may not sit under a line that names a place, a year or a number, because a viewer reads picture as proof of the words over it. Where a Lane C line does name one, the card carries the fact and the picture stays generic. `K23`, `K42` and `K44` are the ones to watch.
4. **Disclosed, or not used.** A generated shot in a registered trust's anniversary film is a trustee decision and a credit-roll line, not an editor's convenience. It is not in `07`'s five gates because nobody had raised it; raise it. Suggested wording for `video/research/13-credits-and-acknowledgements.md`: **ಕೆಲವು ದೃಶ್ಯಗಳು ಸಂಯೋಜಿತ (AI) ಚಿತ್ರಣ. ಯಾವುದೇ ಮಗುವಿನ ಚಿತ್ರ ಸಂಯೋಜಿತವಲ್ಲ.** (Some shots are synthetic imagery. No image of a child is synthetic.) That second sentence is only true if rule 1 held, which is the point of putting them in the same line.

If the trustees say no to synthetic footage, this whole lane collapses to: get the releases. The worklist is in `07` section 2 and it is the pack's longest-lead item.

| Shot | In | Duration | Gen | The line it sits under | Reaching it |
|---|---|---|---|---|---|
| `K02` | 00:00:07:00 | 8.64s | 10s | ಪ್ರತಿ ವರ್ಷ, ಕರ್ನಾಟಕದ ಹಳ್ಳಿಗಳಲ್ಲಿ, ಮಕ್ಕಳು ತಮ್ಮ ಬಳಿ ಇರ… | trim to 8.64s |
| `K03` | 00:00:15:16 | 4.20s | 5s | ಅವರಿಗೆ ಬುದ್ಧಿ ಇದೆ. ಕಲಿಯುವ ಹಂಬಲ ಇದೆ. | trim to 4.20s |
| `K11` | 00:01:10:08 | 4.00s | 5s | 2016ರಲ್ಲಿ ಅವರು ಮೊದಲ ಶಾಲಾ ಭೇಟಿ ಮಾಡಿದರು. | trim to 4.00s |
| `K13` | 00:01:20:12 | 5.52s | 10s | ಅದೇ ಭೇಟಿಯಲ್ಲಿ ನೂರೈವತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸ್ಟೀಲ್ ತಟ್ಟೆ… | trim to 5.52s |
| `K14` | 00:01:26:00 | 6.08s | 10s | 2017ರಲ್ಲಿ ಒಂದು ಹತ್ತಾಯಿತು. ಹತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಿದ್… | trim to 6.08s |
| `K15` | 00:01:32:02 | 9.76s | 10s | ಆಮೇಲೆ ಕೆಲಸ ಹಾಗೇ ಮುಂದುವರಿಯಿತು. ವರ್ಷದಿಂದ ವರ್ಷಕ್ಕೆ. ಅದೇ… | trim to 9.76s |
| `K16` | 00:01:41:21 | 6.00s | 5s | 2020ರಲ್ಲಿ ಶಾಲೆಗಳು ಮುಚ್ಚಿದವು, ಕುಟುಂಬಗಳ ದಿನಗೂಲಿ ನಿಂತಿತು. | two takes, cut at about 4s (6.00s total) |
| `K19` | 00:02:08:04 | 5.60s | 5s | ದಾನವಾಗಿ ಬಂದ ಕಥೆ ಪುಸ್ತಕಗಳು, ಪಠ್ಯ ಪುಸ್ತಕಗಳು, ಬಳಸದೇ ಉಳಿ… | retime to 89.3% speed (5.60s from 5s) |
| `K20` | 00:02:13:19 | 6.24s | 10s | 2023ರಲ್ಲಿ ವ್ಯಾಪ್ತಿ ಹಿಗ್ಗಿತು. ಮೈಸೂರು. ಎಚ್.ಡಿ. ಕೋಟೆ. | trim to 6.24s |
| `K23` | 00:02:39:13 | 7.06s | 10s | ಮತ್ತು 2025ರಲ್ಲಿ, ಎಚ್.ಡಿ. ಕೋಟೆಯಲ್ಲಿ, ಮುನ್ನೂರು. | trim to 7.06s |
| `K24` | 00:02:46:15 | 3.20s | 5s | ಇದೆಲ್ಲ ಕಚೇರಿಯಲ್ಲಿ ಕುಳಿತು ಆಗುವ ಕೆಲಸವಲ್ಲ. | trim to 3.20s |
| `K28` | 00:03:13:05 | 8.00s | 10s | ಉಳಿದ ಪಾಲನ್ನು ಕುಟುಂಬವೇ ಕಟ್ಟುತ್ತದೆ. ಏಕೆಂದರೆ ತಾವೂ ಒಂದು … | trim to 8.00s |
| `K30` | 00:03:26:12 | 9.60s | 10s | ಬುಡಕಟ್ಟು ಶಾಲೆಗಳ ಮಕ್ಕಳ ಜೊತೆ ತಂಡ ಕೆಲವು ದಿನ ಉಳಿಯುತ್ತದೆ.… | trim to 9.60s |
| `K32` | 00:03:45:13 | 9.20s | 10s | ಗ್ರಂಥಾಲಯಗಳು. ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ. ಆಟಗಳು. ಮಕ್ಕಳು ಹಾಡಿ ಕ… | trim to 9.20s |
| `K33` | 00:03:54:18 | 3.20s | 5s | ಮಕ್ಕಳಿಗೆ ಮಾತ್ರವಲ್ಲ, ಪೋಷಕರಿಗೂ ಮಾರ್ಗದರ್ಶನ. | trim to 3.20s |
| `K38` | 00:04:42:06 | 15.28s | 10s | ಆದರೆ ಮುಖ್ಯವಾದ ದಾಖಲೆ ಪ್ರಶಸ್ತಿ ಪತ್ರದಲ್ಲಿ ಇಲ್ಲ. ಅದು ಒಂದ… | two takes, cut at about 9s (15.28s total) |
| `K39` | 00:04:57:13 | 8.96s | 10s | ವಕೀಲರು, ಎಂಜಿನಿಯರ್‌ಗಳು, ವೈದ್ಯರು, ಗೃಹಿಣಿಯರು ಆಗಿರುವ ಸ್ವ… | trim to 8.96s |
| `K40` | 00:05:06:12 | 2.80s | 5s | ಮತ್ತು ತಮ್ಮ ಪಾಲನ್ನು ತಪ್ಪದೇ ಕಟ್ಟಿದ ಪೋಷಕರು. | trim to 2.80s |
| `K41` | 00:05:09:07 | 11.76s | 10s | ಈ ವರ್ಷ, ತನ್ನ ಆರೈಕೆಯಲ್ಲಿರುವ ಎಲ್ಲ ಮಕ್ಕಳನ್ನೂ ಬೆಂಗಳೂರಿಗೆ… | two takes, cut at about 9s (11.76s total) |
| `K42` | 00:05:21:01 | 8.76s | 10s | ಅವರಲ್ಲಿ ಹಲವರಿಗೆ ಇದು ಈ ನಗರವನ್ನು ನೋಡುವ ಮೊದಲ ಬಾರಿ. ಕೆಲವ… | trim to 8.76s |
| `K43` | 00:05:29:20 | 8.48s | 10s | ಮುಂದಿನ ಹತ್ತು ವರ್ಷವೂ ಹೀಗೇ. ಇನ್ನಷ್ಟು ಜಿಲ್ಲೆಗಳು. ಇನ್ನಷ್… | trim to 8.48s |
| `K44` | 00:05:38:07 | 6.92s | 10s | ಹತ್ತು ವರ್ಷ. ಒಂದೊಂದೇ ಮಗು. ಸದ್ದಿಲ್ಲದೆ ಉಳಿಸಿಕೊಂಡ ಒಂದು ಮ… | trim to 6.92s |
| `K45` | 00:05:45:05 | 5.68s | refuseds | ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್‌ನ ಹತ್ತನೇ ವರ್ಷದ ಸಂಭ್ರಮಕ್ಕ… | n/a |

### K02 · `00:00:07:00 - 00:00:15:16` · 8.64s · text to video, 10s

**Blocked by** [C] BLOCKING - approx 60 identifiable children and adults  
**Replaces** `assets/images/timeline/2025-schoolwide-supplies-group-photo.jpg`  
**Cut motion** 3% push in over the shot.

**Prompt**

```text
Wide static documentary shot of a red-earth road running between fields in rural Karnataka at early morning, eucalyptus along one side, the compound wall of a school in the distance. The road is empty. Soft haze, low sun. The camera holds still, with the faintest drift in. No people anywhere in the frame.
```

**Under this shot** `K02` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K02.mp3

> ಪ್ರತಿ ವರ್ಷ, ಕರ್ನಾಟಕದ ಹಳ್ಳಿಗಳಲ್ಲಿ, ಮಕ್ಕಳು ತಮ್ಮ ಬಳಿ ಇರುವುದೆಲ್ಲವನ್ನೂ ಒಂದೇ ಚೀಲದಲ್ಲಿ ಹೊತ್ತು ಶಾಲೆಗೆ ನಡೆಯುತ್ತಾರೆ.

### K03 · `00:00:15:16 - 00:00:19:21` · 4.20s · text to video, 5s

**Blocked by** [C] BLOCKING - two children in close-up, fully identifiable  
**Replaces** `assets/images/timeline/2025-child-with-school-kit-close-up.jpg`  
**Cut motion** Static. No push. Let the laugh sit still.

**Prompt**

```text
Close static shot of a single school bag set down on a wooden bench beside a slate and a stub of chalk. Early morning light crosses the bench. The camera does not move. No people, no hands.
```

**Under this shot** `K03` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K03.mp3

> ಅವರಿಗೆ ಬುದ್ಧಿ ಇದೆ. ಕಲಿಯುವ ಹಂಬಲ ಇದೆ.

### K11 · `00:01:10:08 - 00:01:14:08` · 4.00s · text to video, 5s

**Blocked by** [C] BLOCKING - children seated with backs to camera, plus the founder  
**Replaces** `assets/images/magazine-gallery/charu-talk.jpeg`  
**Cut motion** Static.

**Prompt**

```text
Static shot of an empty rural classroom. A green blackboard with faded chalk dust, wooden benches in rows, light falling in from an open doorway. Dust in the air. The camera holds still. No people, and no writing on the board.
```

**Under this shot** `K11` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K11.mp3

> 2016ರಲ್ಲಿ ಅವರು ಮೊದಲ ಶಾಲಾ ಭೇಟಿ ಮಾಡಿದರು.

**Card over it, unchanged** 2016 · ಚಿಕ್ಕಬಳ್ಳಾಪುರ  //  ಮೊದಲ ಶಾಲಾ ಭೇಟಿ

### K13 · `00:01:20:12 - 00:01:26:00` · 5.52s · text to video, 10s

**Blocked by** [C] BLOCKING - approx 25 identifiable children at a meal  
**Replaces** `assets/images/timeline/children-with-steel-plates-and-glasses-distribution.jpeg`  
**Cut motion** Slow 4% push along the row of plates.

**Prompt**

```text
Slow lateral drift along a long row of stacked steel plates and steel tumblers set out on a school floor. Daylight from high windows. No people, no hands, nothing is picked up.
```

**Under this shot** `K13` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K13.mp3

> ಅದೇ ಭೇಟಿಯಲ್ಲಿ ನೂರೈವತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸ್ಟೀಲ್ ತಟ್ಟೆ ಮತ್ತು ಲೋಟ ವಿತರಿಸಲಾಯಿತು.

**Card over it, unchanged** 150 ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸ್ಟೀಲ್ ತಟ್ಟೆ ಮತ್ತು ಲೋಟ

### K14 · `00:01:26:00 - 00:01:32:02` · 6.08s · text to video, 10s

**Blocked by** [C] BLOCKING - approx 14 identifiable children and adults  
**Replaces** `assets/images/timeline/2017-scholarship-group-photo-on-school-veranda.jpg`  
**Cut motion** Static. Under 4s, so no push: a move this short reads as a wobble.

**Prompt**

```text
Static shot of an empty school veranda, tiled roof, a row of plaster pillars, morning shadows laid across the floor in bands. The camera holds completely still. No people.
```

**Under this shot** `K14` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K14.mp3

> 2017ರಲ್ಲಿ ಒಂದು ಹತ್ತಾಯಿತು. ಹತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಿದ್ಯಾರ್ಥಿವೇತನ.

**Card over it, unchanged** 2017 · 10 ವಿದ್ಯಾರ್ಥಿಗಳು

### K15 · `00:01:32:02 - 00:01:41:21` · 9.76s · text to video, 10s

**Blocked by** [C] BLOCKING - adults identifiable, children in foreground from behind  
**Replaces** `assets/images/timeline/2018-classroom-presentation-session.jpg`  
**Cut motion** Static, dissolve through to A156 at the halfway point.

**Prompt**

```text
Static shot of an empty classroom with hand-painted wall charts, holding for several seconds, then a slow dissolve to a static shot of an empty school courtyard with a bare flagpole. Flat overcast light in both. No people. No lettering on the charts.
```

**Under this shot** `K15` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K15.mp3

> ಆಮೇಲೆ ಕೆಲಸ ಹಾಗೇ ಮುಂದುವರಿಯಿತು. ವರ್ಷದಿಂದ ವರ್ಷಕ್ಕೆ. ಅದೇ ದಾರಿಗಳು, ಅದೇ ಶಾಲೆಗಳು, ಇನ್ನಷ್ಟು ಮಕ್ಕಳು.

**Card over it, unchanged** ಕೆಲಸ ಮುಂದುವರಿಯಿತು

### K16 · `00:01:41:21 - 00:01:47:21` · 6.00s · text to video, 5s

**Blocked by** [C] BLOCKING - large crowd, many identifiable  
**Replaces** `assets/images/timeline/2021-scholarship-distribution-crowd.jpg`  
**Cut motion** Static.

**Prompt**

```text
Static shot of a padlocked metal school gate seen straight on, dust and dry leaves against the base, hard midday light. Nothing moves but a little dust. No people.
```

**Under this shot** `K16` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K16.mp3

> 2020ರಲ್ಲಿ ಶಾಲೆಗಳು ಮುಚ್ಚಿದವು, ಕುಟುಂಬಗಳ ದಿನಗೂಲಿ ನಿಂತಿತು.

### K19 · `00:02:08:04 - 00:02:13:19` · 5.60s · text to video, 5s

**Blocked by** [C] - students browsing, almost all from behind  
**Replaces** `assets/images/timeline/2022-students-in-school-library.jpg`  
**Cut motion** Static.

**Prompt**

```text
Static shot of donated storybooks and exercise books stacked in uneven piles on a low wooden shelf. Soft indoor daylight, shallow depth of field. No people, no hands, no readable print.
```

**Under this shot** `K19` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K19.mp3

> ದಾನವಾಗಿ ಬಂದ ಕಥೆ ಪುಸ್ತಕಗಳು, ಪಠ್ಯ ಪುಸ್ತಕಗಳು, ಬಳಸದೇ ಉಳಿದ ನೋಟ್‌ಬುಕ್‌ಗಳು.

### K20 · `00:02:13:19 - 00:02:20:01` · 6.24s · text to video, 10s

**Blocked by** [C] BLOCKING - approx 30 identifiable children  
**Replaces** `assets/images/timeline/2023-students-in-tribal-school-hall.jpg`  
**Cut motion** Static. Under 4s, no push.

**Prompt**

```text
Static shot of the interior of a thatched-roof school hall, open at the sides, packed mud floor, dappled light coming through the roof. The camera holds still. No people.
```

**Under this shot** `K20` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K20.mp3

> 2023ರಲ್ಲಿ ವ್ಯಾಪ್ತಿ ಹಿಗ್ಗಿತು. ಮೈಸೂರು. ಎಚ್.ಡಿ. ಕೋಟೆ.

**Card over it, unchanged** 2023 · ಮೈಸೂರು · ಎಚ್.ಡಿ. ಕೋಟೆ

### K23 · `00:02:39:13 - 00:02:46:15` · 7.06s · text to video, 10s

**Blocked by** [C] BLOCKING - approx 20 identifiable children and adults  
**Replaces** `assets/images/timeline/2025-children-with-volunteers-under-tree.jpg`  
**Cut motion** Static through the line, then a 3% push toward the tree across the 2.5s hold that follows it.

**Prompt**

```text
Static shot of school bags set out in rows on bare ground under a large tamarind tree, dappled shade moving very slightly across them. A slow push toward the trunk of the tree. No people.
```

**Under this shot** `K23` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K23.mp3

> ಮತ್ತು 2025ರಲ್ಲಿ, ಎಚ್.ಡಿ. ಕೋಟೆಯಲ್ಲಿ, ಮುನ್ನೂರು.

**Card over it, unchanged** 2025 · ಎಚ್.ಡಿ. ಕೋಟೆ · 300 ಶಾಲಾ ಚೀಲ

### K24 · `00:02:46:15 - 00:02:49:20` · 3.20s · text to video, 5s

**Blocked by** [C] BLOCKING - large group, faces small but identifiable  
**Replaces** `assets/images/timeline/2025-school-front-group-photo.jpg`  
**Cut motion** Static.

**Prompt**

```text
Static wide shot of a school forecourt from a distance: a low compound wall, dust, two large trees, a single-storey painted building behind. Late afternoon. The camera does not move. No people.
```

**Under this shot** `K24` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K24.mp3

> ಇದೆಲ್ಲ ಕಚೇರಿಯಲ್ಲಿ ಕುಳಿತು ಆಗುವ ಕೆಲಸವಲ್ಲ.

### K28 · `00:03:13:05 - 00:03:21:05` · 8.00s · text to video, 10s

**Blocked by** [C] BLOCKING - families, adults and children identifiable  
**Replaces** `assets/images/timeline/2025-classroom-full-of-beneficiary-families.jpg`  
**Cut motion** Static.

**Prompt**

```text
Static shot of a school classroom with plastic chairs arranged in rows facing a small table, empty, afternoon light through a window grille. A ceiling fan turns slowly. No people.
```

**Under this shot** `K28` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K28.mp3

> ಉಳಿದ ಪಾಲನ್ನು ಕುಟುಂಬವೇ ಕಟ್ಟುತ್ತದೆ. ಏಕೆಂದರೆ ತಾವೂ ಒಂದು ಪಾಲು ಹೊತ್ತ ಪೋಷಕರು ಮಗುವಿನ ಓದಿನ ಒಳಗೇ ಉಳಿಯುತ್ತಾರೆ.

### K30 · `00:03:26:12 - 00:03:36:02` · 9.60s · text to video, 10s

**Blocked by** [C] BLOCKING - one volunteer and one child, both identifiable  
**Replaces** `assets/images/timeline/2025-volunteer-tying-shoe-for-child.jpg`  
**Cut motion** Static.

**Prompt**

```text
Static close shot of hands only. An adult's hands fasten the buckle of a school bag that a child's hands are holding steady. The frame ends below both pairs of shoulders, so no face and no head is anywhere in shot. Natural indoor light, no camera movement.
```

**Under this shot** `K30` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K30.mp3

> ಬುಡಕಟ್ಟು ಶಾಲೆಗಳ ಮಕ್ಕಳ ಜೊತೆ ತಂಡ ಕೆಲವು ದಿನ ಉಳಿಯುತ್ತದೆ. ಕಲಿಸುತ್ತದೆ, ಕಲಿಯುತ್ತದೆ. ಆಮೇಲೆ ಚೀಲಗಳು ಮಕ್ಕಳ ಕೈ ಸೇರುತ್ತವೆ.

### K32 · `00:03:45:13 - 00:03:54:18` · 9.20s · text to video, 10s

**Blocked by** [C] BLOCKING - approx 8 identifiable children  
**Replaces** `assets/images/magazine-gallery/kids-craft.jpeg`  
**Cut motion** Static.

**Prompt**

```text
Static overhead shot of a classroom floor mid-craft: coloured paper, blunt scissors, a glue stick and small folded paper shapes scattered on a mat. The camera holds still. No people, no hands in frame.
```

**Under this shot** `K32` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K32.mp3

> ಗ್ರಂಥಾಲಯಗಳು. ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ. ಆಟಗಳು. ಮಕ್ಕಳು ಹಾಡಿ ಕುಣಿಯುವ ವೇದಿಕೆ, ಮತ್ತು ಅದನ್ನು ನೋಡಲೆಂದೇ ಬಂದ ಜನ.

**Card over it, unchanged** ಕಲಿಕೆಯ ಆಟಗಳು · ನಾಡು ನುಡಿಯ ಪರಿಚಯ · ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯ

### K33 · `00:03:54:18 - 00:03:57:23` · 3.20s · text to video, 5s

**Blocked by** [C] BLOCKING - large hall, many identifiable  
**Replaces** `assets/images/timeline/2025-large-community-celebration-group-photo.jpg`  
**Cut motion** Static.

**Prompt**

```text
Static wide shot of an empty school hall with a low stage, a plain curtain backdrop and rows of plastic chairs. Side light through open doors. Ceiling fans still. No people.
```

**Under this shot** `K33` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K33.mp3

> ಮಕ್ಕಳಿಗೆ ಮಾತ್ರವಲ್ಲ, ಪೋಷಕರಿಗೂ ಮಾರ್ಗದರ್ಶನ.

**Card over it, unchanged** ಪೋಷಕರಿಗೆ ಮಾರ್ಗದರ್ಶನ

### K38 · `00:04:42:06 - 00:04:57:13` · 15.28s · text to video, 10s

**Blocked by** ADULTS AND SOME CHILDREN - identifiable  
**Replaces** `assets/images/timeline/2025-volunteer-group-at-school-garden.jpg`  
**Cut motion** Static.

**Prompt**

```text
Static shot of a school garden path in the morning, young saplings staked in a row along it, a metal watering can set down on the soil. Wet earth. The camera holds still, with a slow push along the path. No people.
```

**Under this shot** `K38` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K38.mp3

> ಆದರೆ ಮುಖ್ಯವಾದ ದಾಖಲೆ ಪ್ರಶಸ್ತಿ ಪತ್ರದಲ್ಲಿ ಇಲ್ಲ. ಅದು ಒಂದು ಹೆಸರುಗಳ ಪಟ್ಟಿಯಲ್ಲಿದೆ. ಬೆಂಗಳೂರು, ಚೆನ್ನೈ, ಅಮೆರಿಕ, ಬ್ರಿಟನ್, ಜರ್ಮನಿ, ಡೆನ್ಮಾರ್ಕ್, ದುಬೈನಲ್ಲಿದ್ದು ನೆರವು ನೀಡಿದವರು.

**Card over it, unchanged** ನೆರವು ನೀಡಿದವರಿಗೆ

### K39 · `00:04:57:13 - 00:05:06:12` · 8.96s · text to video, 10s

**Blocked by** [C] BLOCKING after crop - approx 60 identifiable  
**Replaces** `assets/images/timeline/2025-hall-full-of-volunteers-and-children.jpg`  
**Cut motion** Static.

**Prompt**

```text
Static shot of an empty school hall, rows of plastic chairs and a folding table at the front, side light coming through open double doors. Dust in the light. No people, and no banner or lettering on the wall.
```

**Under this shot** `K39` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K39.mp3

> ವಕೀಲರು, ಎಂಜಿನಿಯರ್‌ಗಳು, ವೈದ್ಯರು, ಗೃಹಿಣಿಯರು ಆಗಿರುವ ಸ್ವಯಂಸೇವಕರು. ಒಂದು ಮಗುವಿಗಾಗಿ ಫೋನ್ ಮಾಡಿದ ಶಿಕ್ಷಕರು.

**Card over it, unchanged** ಸ್ವಯಂಸೇವಕರಿಗೆ  //  ವಕೀಲರು · ಎಂಜಿನಿಯರ್‌ಗಳು · ವೈದ್ಯರು · ಗೃಹಿಣಿಯರು

### K40 · `00:05:06:12 - 00:05:09:07` · 2.80s · text to video, 5s

**Blocked by** [C] BLOCKING - approx 30 identifiable children  
**Replaces** `assets/images/timeline/2025-schoolchildren-showing-school-bags-on-veranda.jpg`  
**Cut motion** Static.

**Prompt**

```text
Static close shot of a stack of blank paper forms and a pen on a wooden desk, shallow focus, no writing visible on any sheet. Indoor daylight. The camera does not move. No people.
```

**Under this shot** `K40` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K40.mp3

> ಮತ್ತು ತಮ್ಮ ಪಾಲನ್ನು ತಪ್ಪದೇ ಕಟ್ಟಿದ ಪೋಷಕರು.

**Card over it, unchanged** ಪೋಷಕರಿಗೆ  //  ತಮ್ಮ ಪಾಲಿನ ಶುಲ್ಕವನ್ನು ತಪ್ಪದೇ ಹೊಂದಿಸಿದವರು

### K41 · `00:05:09:07 - 00:05:21:01` · 11.76s · text to video, 10s

**Blocked by** [C] BLOCKING - approx 10 identifiable children  
**Replaces** `assets/images/timeline/2025-children-showing-school-bags-outdoors.jpg`  
**Cut motion** 3% push.

**Prompt**

```text
Static shot of a Bengaluru street from the footpath at first light, a canopy of rain trees overhead, the road still empty, shutters down. A very slow push forward. No people, no readable signage.
```

**Under this shot** `K41` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K41.mp3

> ಈ ವರ್ಷ, ತನ್ನ ಆರೈಕೆಯಲ್ಲಿರುವ ಎಲ್ಲ ಮಕ್ಕಳನ್ನೂ ಬೆಂಗಳೂರಿಗೆ ಕರೆತರಬೇಕೆಂಬುದು ಟ್ರಸ್ಟ್‌ನ ಆಸೆ. ಒಂದು ಕಾರ್ಯಕ್ರಮ, ಒಂದು ದಿನದ ಸುತ್ತಾಟ, ಮನೆಗೆ ಒಯ್ಯಲು ಒಂದು ಉಡುಗೊರೆ.

### K42 · `00:05:21:01 - 00:05:29:20` · 8.76s · text to video, 10s

**Blocked by** [C] BLOCKING - approx 15 identifiable children and adults  
**Replaces** `assets/images/timeline/2024-children-with-supplies-outdoors.jpg`  
**Cut motion** Static 2s, then 3% push.

**Prompt**

```text
Static wide shot of a hillside village in Karnataka at dawn, terraced fields below, a footpath descending toward a road, blue haze on the far ridge. The camera holds still, then drifts in very slightly. No people.
```

**Under this shot** `K42` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K42.mp3

> ಅವರಲ್ಲಿ ಹಲವರಿಗೆ ಇದು ಈ ನಗರವನ್ನು ನೋಡುವ ಮೊದಲ ಬಾರಿ. ಕೆಲವರಿಗೆ ತಮ್ಮ ಊರು ಬಿಟ್ಟು ಹೊರಡುವ ಮೊದಲ ಬಾರಿ.

### K43 · `00:05:29:20 - 00:05:38:07` · 8.48s · text to video, 10s

**Blocked by** [C] BLOCKING - as A240  
**Replaces** `assets/images/timeline/2025-schoolwide-supplies-group-photo.jpg`  
**Cut motion** Slow pull back, 4%, ending on the widest framing in the film.

**Prompt**

```text
Slow pull back from a painted school compound wall to reveal fields, a road and the far ridge behind it, dawn light. The widest framing in the film. Steady, even, no handheld movement. No people.
```

**Under this shot** `K43` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K43.mp3

> ಮುಂದಿನ ಹತ್ತು ವರ್ಷವೂ ಹೀಗೇ. ಇನ್ನಷ್ಟು ಜಿಲ್ಲೆಗಳು. ಇನ್ನಷ್ಟು ಗ್ರಂಥಾಲಯಗಳು. ಓದು ನಿಲ್ಲದ ಇನ್ನಷ್ಟು ಮಕ್ಕಳು.

### K44 · `00:05:38:07 - 00:05:45:05` · 6.92s · text to video, 10s

**Blocked by** [C] BLOCKING - approx 40 identifiable children  
**Replaces** `assets/images/timeline/2025-classroom-full-of-children-with-supplies.jpg`  
**Cut motion** Static 2s, then a 3% push. No text over this frame.

**Prompt**

```text
Static shot of a yellow-painted classroom, empty wooden desks in rows, sunlight through a barred window laid across the floor. The camera holds still for two seconds, then a three percent push in. No people, no lettering on the walls.
```

**Under this shot** `K44` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K44.mp3

> ಹತ್ತು ವರ್ಷ. ಒಂದೊಂದೇ ಮಗು. ಸದ್ದಿಲ್ಲದೆ ಉಳಿಸಿಕೊಂಡ ಒಂದು ಮಾತು.

### K45 · `00:05:45:05 - 00:05:50:22` · 5.68s · REFUSED

**Blocked by** [C] BLOCKING - as A224  
**Replaces** `assets/images/timeline/2025-classroom-full-of-children-with-supplies.jpg`  
**Cut motion** Push continues to 6% total. NO ONSCREEN TEXT.

**Prompt**

```text
DO NOT GENERATE. This is the payoff: the welcome line lands on children's faces and the storyboard forbids cutting away from them while it is spoken. A synthetic stand-in here would put fabricated faces under the film's one sentence of direct address, in a film that exists to thank real people. Either the release for A224 is signed, or this shot holds on the last real frame and the end card comes early.
```

**Under this shot** `K45` · tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K45.mp3

> ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್‌ನ ಹತ್ತನೇ ವರ್ಷದ ಸಂಭ್ರಮಕ್ಕೆ ನಿಮಗೆಲ್ಲರಿಗೂ ಆತ್ಮೀಯ ಸ್ವಾಗತ.

---

## 6 · The audio · do not generate any of it

**Runway does not read Kannada, and this narration is not a first draft.** It is 460 tokens of reviewed script with a 25-line pronunciation sheet, a list of nine words that must never be spoken, and a standing instruction to record the closing line at least five times. Several lines are still gated on a trustee decision, and `K43` cannot go into a master at all until the wording is approved, because it is a public promise made on camera by a registered trust. There is nothing for a generative audio pass to add here and a great deal for it to lose.

The narration that exists today is the ElevenLabs scratch read, one file per shot:

```text
tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/K02.mp3 … K45.mp3      43 files, one per spoken shot
tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/narration.wav                     the assembled read
tools/vo_eleven/EXAVITQu4vr4xnSDxMaL/narration_plus_sfx_LEARNING.wav   the read plus effects, what the masters carry
```

It is a **scratch voice and gate 1 of five**. The human Kannada read replaces it, and when it arrives only the narration stem changes: picture stays, and `05-kannada-subtitles.srt` is regenerated with `tools/make_srt.py` rather than hand-edited.

The full spoken text, per shot, with timecodes and the matching audio file for each, is in **[`Runway-kannada-vo-transcript.txt`](Runway-kannada-vo-transcript.txt)**. It also carries a continuous read-through with no timecodes, for pasting into a text-to-speech field.

**3 shots carry no narration at all** and are silent by design: `K01`, `K06`, `K46`, 20 seconds between them. The rest of the film's silence is inside the spoken shots, as the 17 seconds of marked `[ವಿರಾಮ]` pauses and the holds after a line ends, both of which the transcript prints per shot. Do not put music or a generated bed under `K06`: six seconds of nothing is the longest silence in the film and it is the point of it.

---

## 7 · Getting a Runway clip into this cut

### Frame rate

The master is **25 fps**. Runway typically hands back 24 fps. Check the file before you cut it in, and if it is 24, **conform** it rather than resampling: interpret 24 frames as 25, which runs the clip 4.2% short and 4.2% faster. On a three percent push nobody sees it. Frame-blended retiming on a slow push produces a soft, swimming texture that will be the only shot in the film that looks like that.

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate,width,height -of csv=p=0 clip.mp4
ffmpeg -i clip.mp4 -r 25 -filter:v 'setpts=(24/25)*PTS' -c:v prores_ks -profile:v 3 -an K18-runway.mov
```

### Duration

Generations come in 5s and 10s. Cut durations do not. The Reaching it column in sections 3 and 5 says which of three to do, per shot:

- **Trim** when the generation is longer than the cut. Trim the tail, never the head: the head is where the model is most stable.
- **Retime** when the cut is up to 15% longer than the generation. Slow the clip. Safe on a static shot or a slow push, and nowhere else.
- **Two takes** past that. Same plate, same seed family, cut between them on the push. 5 shots run longer than 11.5s and need it: `K17`, `K34`, `K36`, `K38`, `K41`. Of those, only `K38` and `K41` are in a lane that generates at all.

### Resolution

Generate at the highest the account allows and do not upscale until the take is chosen. Then match `film.py`'s own discipline: it sharpens by how hard each shot is enlarged, and leaves anything under 1.25x alone. A Runway clip arriving at 1080p into a 2160p master is a 2.0x enlargement, which is harder than all but five shots in the film. Run `tools/frame_audit.py` after you cut it in.

### Sound

Generate silent, or strip the audio on import. `Kannada-cue-sheet.csv` places 46 music cues and 28 effect events at generated timecodes and `tools/mix.py` builds against it. A clip carrying its own invented room tone will fight both.

---

## 8 · Two things in this repository that are out of step, and will bite

### The documents and the film disagree about the running time

The film on disk is **00:05:57:22** (357.88 s), and every rendered master measures exactly that. So do `tools/timeline.json`, `05-kannada-subtitles.srt` and `tools/subs.json`. Four documents still carry the older designed timeline of `00:05:03:21`: `01`, `03`, `06` and `08`.

The gap is 54 seconds and it is not a rounding error: the cut was re-timed to the ElevenLabs read, and every shot moved. `K05` starts at `00:00:28:00` in the film and `00:00:25:08` in `01`. **Take every number in this pack, and every number you type into Runway, from `tools/timeline.json`.** Then re-derive the four stale documents rather than hand-patching them, which is what `01` section 1 already tells you to do.

### The plate exporter is new and is not in the share pack

`tools/runway_plates.py` and this document were written for a Runway trial and are not part of the reviewed handoff. `SHARE-PACK.md` does not list them and `team-handoff.html` does not link them. If the trial goes anywhere, add both, and add the synthetic-footage question to `07` as a sixth gate.

