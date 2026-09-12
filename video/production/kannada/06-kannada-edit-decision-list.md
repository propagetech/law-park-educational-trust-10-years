# 06 · ಕನ್ನಡ ಸಂಕಲನ ನಿರ್ಧಾರ ಪಟ್ಟಿ · Kannada Edit Decision List

**Kannada event master · 1920x1080 · 25 fps · ProRes 422 HQ · 00:05:03:21 · 7,596 frames**

A plain-text EDL, so the film can be rebuilt in five years without the original project file. `14` item 10.3.

---

## 1 · Master specification

| | |
|---|---|
| Resolution | 1920 x 1080 |
| Frame rate | 25 fps |
| Codec, master | ProRes 422 HQ |
| Colour | Rec. 709 |
| Duration | **00:05:03:21** = 303.86 s = 7,596 frames |
| Shots | 46 (37 photographic, 9 typographic cards) |
| Distinct images | 35 |
| Narration | 464 Kannada words at 105 wpm = 262.9 s |
| Marked pauses | 17.0 s |
| Deliberate silence | 24.0 s (cold open 7.0, founder quote 6.0, two card holds 3.5, end card 7.0) |
| Loudness, event | -23 LUFS integrated, narration peaks no higher than -3 dBTP |
| Loudness, online | -16 LUFS integrated |
| Music bed | at least 12 dB below narration at all times |

**Trim path to a hard 00:05:00:00**, if the event runs to a fixed slot. Take it out of picture, never out of pace.

| Step | Change | New duration |
|---|---|---|
| 1 | `K01` cold open 7:00 to 4:00 | 00:05:00:21 |
| 2 | `K46` end card 7:00 to 6:00 | 00:04:59:21 |

Do not raise the narration to 110 wpm to save the four seconds. It costs the pauses, and `01` section 1 explains why the pauses are the film.

---

## 2 · Path corrections against the filesystem

Every path in the earlier documents was resolved against the working tree. Three do not exist as written. Use the right-hand column.

| Referenced in `10` as | Actually on disk | Note |
|---|---|---|
| `assets/images/timeline/steel-plate-and-glass-distributed-to-these-children.jpeg` | **`assets/images/timeline/children-with-steel-plates-and-glasses-distribution.jpeg`** | The referenced name exists only at `public/images/steel-plate-and-glass-distributed-to-these-children.jpeg` (asset `A468`), which is the byte-identical, undescriptive twin. Source from `assets/` per `05` section 2.1 |
| `assets/images/awards/bharat-shiksha-ratan-award-certificate-scan.jpg` | **`...-scan.jpeg`** | Extension is `.jpeg`, not `.jpg` |
| `scholarship-interview-with-girl-and-guardian.jpeg` (no folder given) | **`assets/images/children-stories/scholarship-interview-with-girl-and-guardian.jpeg`** | It is in `children-stories/`, not `timeline/`. That folder placement is itself a safeguarding signal: see section 3 |

Two further facts that change earlier guidance:

- **`assets/images/magazine-gallery/trustee-mr-sm-manjunatha.webp` exists only as WebP.** There is no `.jpg` or `.jpeg` twin anywhere in the repository, so the house rule "always grade from the JPEG" (`05` section 2.2) cannot be met for `K09`. Request the original from the trustee. Until then, grade gently and do not push in.
- **A transparent-background logo does exist.** `05` section 3.3 states there is none. `logo.png` (300x257), `public/images/logo.png` (259x259) and `public/logo.webp` (300x332) all carry a real alpha channel with fully transparent corners; verified. They are small, not absent. `04` section 4 has the placement rule.

---

## 3 · Images rejected, and why

Nine assets were considered and cut. Each rejection is on a stated, checkable ground, and each has a named replacement in the timeline.

| Asset | File | Ground for rejection | Replaced by |
|---|---|---|---|
| **A140** | `timeline/2016-first-scholarship-home-visit.jpg` | **Three independent grounds.** (1) The frame is an adult handing money to a boy while his mother watches: precisely the "hand reaching down into frame to give something" trope `07` section 12 forbids. (2) 960x540, which cannot fill a 1080p frame. (3) It is the only image of this family and it depicts the moment of their need. The inventory marks it `N/A - no identifiable person`; **that is wrong**, a boy and a woman are both fully identifiable | `K12`, a navy typographic card reading ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. More dignified, sharper, and no consent exposure |
| **A188** | `timeline/2024-classroom-career-counselling-session.jpg` | **Three independent grounds.** (1) Heavy **TATA MD** commercial branding across the back wall and side panels, a third party with no permission on file (`14` item 4.9). (2) **Government of Karnataka emblem** twice in frame (`14` item 4.3). (3) A burned-in **"Galaxy S24 Ultra"** phone watermark at bottom-left. See section 4: this frame is still valuable as evidence | `K21`, `A172`, which shows LPET's own printed career-guidance chart with no children, no commercial mark and no watermark |
| **A166** | `timeline/2022-library-donation-poster.jpg` | **Three grounds.** (1) Carries a **second phone number, +919663944114**, which appears nowhere in the source of truth and would be published unverified. (2) Uses a silhouette photograph of a boy against a sunset whose provenance `14` item 4.10 flags as needing checking; it reads as stock. (3) Names Grameena Mahaila Okutta and links gramavikas.org, both third parties awaiting permission (`06` Q18) | `K19`, `A168`, students at the shelves. The two library sites are not named on screen in this cut |
| **A200** | `timeline/2024-school-supply-kit-on-floor.jpg` | Prominent **"Lotte Choco Pie"** branded packaging fills the frame (`14` item 4.9), and it is shot on a domestic laminate floor that reads as a city apartment rather than a school | `K31`, `A244`, stationery with no brand and no face |
| **A202** | `timeline/2024-snack-packets-for-distribution.jpg` | Prominent **"Finest Selection" biscuit-box branding** (`14` item 4.9) | as above |
| **A242** | `timeline/2025-stacked-school-bags-close-up.jpg` | 434x577, the smallest photographic asset considered, and the subject is ambiguous: wrapped bags with craft items hanging in front of them | not needed |
| **A004** | `awards/framed-bharat-shiksha-ratan-award-certificate.jpg` | 705x956 against `A002` at 1370x900. Same document, nearly double the resolution | `K37`, `A002` |
| **A138** | `timeline/2016-classroom-session-with-students.jpg` | **Near-duplicate of `A061`**, used at `K11`. Same room, same wall charts, same blackboard, same uniforms, same 747x1328 slide-deck extraction. `05` section 2.3: pick one, never cut between them | `K11`, `A061`, which has the founder in frame |
| **A146** | `timeline/2017-school-group-photo.jpeg` | Near-duplicate of `A144` at lower resolution. `05` section 2.3 | `K14`, `A144` |

**Excluded before selection began**, from `05` section 7 and `14`:

- `timeline/thank-you-volunteers-card.jpg` · a third-party stock greeting graphic with a visible **"(c)WishesMsg"** watermark. `14` item 4.7, BLOCKING.
- `public/images/mhaks.16@oksbi.jpg`, `assets/images/payments/law-park-upi-qr-code.*` · a live payment QR code and UPI identifier. Never in a film that will be screenshotted.
- `public/images/children-stories-processed/children-story-0*.jpg` · six 2160x3840 black-and-white portraits of identifiable children, produced to illustrate anonymised hardship case summaries. The highest-resolution images in the repository and the highest safeguarding risk in it. `14` item 2.7.
- `assets/images/children-stories/WhatsApp Image 2026-04-08 at *.jpeg` · seven WhatsApp-compressed files, identifiable minors, unknown provenance. `14` item 2.8.
- `featured/support-session-for-hiv-affected-children.jpeg` · **the only asset that names the HIV support work, and it must not be screened.** Using it anywhere near the `K34` narration would put identifiable faces beside a health condition, which `14` item 2.4 forbids absolutely. `K34` is a typographic card for exactly this reason.
- `data/childrenStories.ts` case summaries and the magazine's "Meena", "Raju" and "Sunita" composites · `14` items 2.5 and 2.6, both BLOCKING. No named child appears in any form, in narration, caption or subtitle.
- All `illustrations/*.svg` · see section 5.
- All `icons/*`, favicons, `vite.svg` · web furniture.

## 4 · Rejected on screen, retained as evidence

Two frames may not be screened but are worth more to the fact-check file than to the cut. Log both with the research package.

**`A188`** `timeline/2024-classroom-career-counselling-session.jpg`. The event banner in frame reads, in full:

> Law Park Educational Trust, Bangalore / Belaku Trust, Bangarpet / District Health & Family Welfare Department, Kolar / Soukhya Samrudhi Samsthe, Kolar / "ನಮ್ಮನ್ನೂ..... ಪ್ರೀತಿಸು" / Date: 15.10.2024 · Place: KOLAR

This is the **only photographic corroboration of all three Kolar partners in a single frame, with a date and a place**. It substantially answers `06` Q20 on the District Health and Family Welfare Department and supports `[PTR-02]`, `[PTR-03]` and `[PTR-04]`. It cannot be screened because of the Tata MD branding, the government emblem and the phone watermark.

**`A230`** `timeline/2025-hall-full-of-volunteers-and-children.jpg`. The banner cropped out of `K39` reads:

> [Law Park Educ]ational Trust, Bangalore / ಬೆಳಕು ಟ್ರಸ್ಟ್ (ರಿ), ತಂಬ್ರಹಳ್ಳಿ, ಬಂಗಾರಪೇಟೆ / BELAKU TRUST (R) Tambrahalli Bangarapet / L. H. INTERNATIONAL SCHOOL, Mulb[agal] / ಸಹಯೋಗದಲ್ಲಿ / ಮಕ್ಕಳ ವಿದ್ಯಾರ್ಥಿವೇತನ ವಿತರಣಾ ಕಾರ್ಯ[ಕ್ರಮ]

Three findings from it. It confirms the Kannada spelling **ಬೆಳಕು ಟ್ರಸ್ಟ್** in LPET's own usage. It gives Belaku Trust's location as **ತಂಬ್ರಹಳ್ಳಿ, ಬಂಗಾರಪೇಟೆ**, more precise than the source of truth's "Bangarpet", which answers part of `06` Q17. And it shows **ವಿದ್ಯಾರ್ಥಿವೇತನ** on LPET's own banner, which independently confirms the glossary's central terminology decision beyond the single Udayavani source. The banner also names L. H. International School, Mulbagal, a third party with no permission on file, which is why `K39` crops it out.

**One further correction to the record.** Assets `A170` and `A190` show the DMS school's own building sign and event banner, both reading **ಡಿ.ಎಂ.ಎಸ್. ಜ್ಞಾನಕುಟೀರ ಶಾಲೆ**, one word, at Baby Village, Chinakurali Hobali, Pandavapura Taluk, Mandya District 571455, run by **ಶ್ರೀ ಮಹಾಂತ ಶಿವಯೋಗಿ ವಿದ್ಯಾಪೀಠ ಟ್ರಸ್ಟ್ (ರಿ) / Sri Mahantha Shivayogi Vidyapeeta Trust (R)**. `09` section 3.5 flagged the Kannada spelling as unverified and rendered it as two words. It is now settled. It also means the permission sought under `14` item 4.4 must come from the parent trust, not from the school office alone. The school is not named in this cut.

## 5 · Illustrations: a disagreement, resolved

The brief lists six repository SVGs as approved assets and as a consent fallback. `05` section 7 says the opposite: that flat generic vector illustrations of children and graduation caps undercut the photography and read as clip art in a documentary. `14` item 4.8 adds that no licence file accompanies them anywhere in the repository.

**Resolution: no illustration appears in this cut, and none is needed.** Every consent gap in the timeline is covered by a stronger option that the repository already contains.

| Consent gap | What the brief offers as fallback | What this cut uses instead |
|---|---|---|
| The fee line must not sit over a child's face | a neutral graphic card | `K04`, `A226`, a real painted government school with a Kannada board and no people |
| The single-parent, HIV and chronic-illness line | an illustration or a neutral card | `K34`, a navy field with a single gold rule and no text at all |
| Validation, a private financial conversation | hands without identifiable faces | `K26`, exactly that: a real crop of hands, a form and a pen from `A025` |
| A 2016 origin frame without a staged handover | an illustration | `K12`, typography |
| Objects and supplies | books, bags, stationery | `K31` `A244` and `K22` `A180`, both real and both face-free |

If a future cut does want them, `illustration-books.svg`, `illustration-community.svg`, `illustration-growth.svg` and `illustration-team.svg` are the four with no depicted child, and `A047` `illustration-children.svg` should be avoided on the same grounds as any child image plus an unresolved licence. **Establish provenance first**, `14` item 4.8. Note also that `illustration-children.svg` declares no width or height, so it has no intrinsic size to lay out against.

---

## 6 · The cut

| # | TC in | TC out | Dur | Kind | Asset | Source file | Onscreen | Music cue |
|---|---|---|---|---|---|---|---|---|
| K01 | 00:00:00:00 | 00:00:07:00 | 7:00 | PHOTO | `A228` | `timeline/2025-government-primary-school-sign.jpg` | - | Bansuri enters at -30 dB, rises to -24 dB |
| K02 | 00:00:07:00 | 00:00:14:13 | 7:13 | PHOTO | `A240` | `timeline/2025-schoolwide-supplies-group-photo.jpg` | - | Bansuri, drone under |
| K03 | 00:00:14:13 | 00:00:18:04 | 3:16 | PHOTO | `A206` | `timeline/2025-child-with-school-kit-close-up.jpg` | - | - |
| K04 | 00:00:18:04 | 00:00:25:08 | 7:05 | PHOTO | `A226` | `timeline/2025-colorful-school-building.jpg` | - | Drop to drone only |
| K05 | 00:00:25:08 | 00:00:29:19 | 4:10 | CARD | `GFX-01` | `-` | ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್  //  ಹತ್ತು ವರ್ಷ · 2016 ರಿಂದ 2026 | Drone holds |
| K06 | 00:00:29:19 | 00:00:35:19 | 6:00 | CARD | `GFX-02` | `-` | "ಶಿಕ್ಷಣದ ವಿಷಯದಲ್ಲಿ ಯಾವ ಮಗುವೂ ಹಿಂದೆ ಉಳಿಯಬಾರದು."  //  ಚಾರುಲತಾ ... | Music out entirely. Room tone only. |
| K07 | 00:00:35:19 | 00:00:42:02 | 6:09 | CARD | `GFX-03` | `-` | ನೋಂದಾಯಿತ ಶೈಕ್ಷಣಿಕ ಟ್ರಸ್ಟ್  //  ಎಚ್.ಎಸ್.ಆರ್. ಲೇಔಟ್, ಬೆಂಗಳೂರು | Bansuri returns at -26 dB |
| K08 | 00:00:42:02 | 00:00:50:17 | 8:14 | PHOTOCARD | `A059` | `magazine-gallery/Charulatha-MR.jpeg` | ಚಾರುಲತಾ ಎಂ. ಆರ್.  //  ಸಂಸ್ಥಾಪಕರು ಮತ್ತು ವ್ಯವಸ್ಥಾಪಕ ಟ್ರಸ್ಟಿ | - |
| K09 | 00:00:50:17 | 00:00:58:07 | 7:15 | PHOTOCARD | `A082` | `magazine-gallery/trustee-mr-sm-manjunatha.webp` | ಎಸ್. ಎಂ. ಮಂಜುನಾಥ  //  ಟ್ರಸ್ಟಿ | - |
| K10 | 00:00:58:07 | 00:01:03:22 | 5:15 | PHOTO | `A234` | `timeline/2025-saraswati-primary-school-sign.jpg` | - | Music thins to drone for the pause |
| K11 | 00:01:03:22 | 00:01:07:17 | 3:20 | PHOTOCARD | `A061` | `magazine-gallery/charu-talk.jpeg` | 2016 · ಚಿಕ್ಕಬಳ್ಳಾಪುರ  //  ಮೊದಲ ಶಾಲಾ ಭೇಟಿ | - |
| K12 | 00:01:07:17 | 00:01:11:19 | 4:02 | CARD | `GFX-04` | `-` | ಒಂದು ಮಗು.  //  ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. | Silence under this card |
| K13 | 00:01:11:19 | 00:01:16:18 | 4:24 | PHOTO | `A254` | `timeline/children-with-steel-plates-and-glasses-distribution.jpeg` | 150 ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸ್ಟೀಲ್ ತಟ್ಟೆ ಮತ್ತು ಲೋಟ | - |
| K14 | 00:01:16:18 | 00:01:21:23 | 5:05 | PHOTO | `A144` | `timeline/2017-scholarship-group-photo-on-school-veranda.jpg` | 2017 · 10 ವಿದ್ಯಾರ್ಥಿಗಳು | Melody enters |
| K15 | 00:01:21:23 | 00:01:30:09 | 8:11 | PHOTO | `A150` | `timeline/2018-classroom-presentation-session.jpg` | ಕೆಲಸ ಮುಂದುವರಿಯಿತು | - |
| K16 | 00:01:30:09 | 00:01:35:00 | 4:16 | PHOTO | `A160` | `timeline/2021-scholarship-distribution-crowd.jpg` | - | Music falls away to a single held note |
| K17 | 00:01:35:00 | 00:01:45:05 | 10:05 | PHOTOCARD | `A158` | `timeline/2020-pandemic-relief-announcement-poster.jpg` | 2020 · ಸಾಂಕ್ರಾಮಿಕ ಕಾಲದ ನೆರವು  //  ಪೋಷಕರನ್ನು ಕಳೆದುಕೊಂಡ ಮಕ್ಕಳಿ... | Drone only |
| K18 | 00:01:45:05 | 00:01:51:01 | 5:20 | PHOTO | `A164` | `timeline/2022-library-bookshelves.jpg` | 2022 · ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯ | Melody returns, warmer |
| K19 | 00:01:51:01 | 00:01:56:00 | 4:24 | PHOTO | `A168` | `timeline/2022-students-in-school-library.jpg` | - | - |
| K20 | 00:01:56:00 | 00:02:00:11 | 4:11 | PHOTO | `A176` | `timeline/2023-students-in-tribal-school-hall.jpg` | 2023 · ಮೈಸೂರು · ಎಚ್.ಡಿ. ಕೋಟೆ | - |
| K21 | 00:02:00:11 | 00:02:07:21 | 7:10 | PHOTO | `A172` | `timeline/2023-school-event-backdrop-photo.jpg` | 9 ಮತ್ತು 10ನೇ ತರಗತಿಗೆ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ | - |
| K22 | 00:02:07:21 | 00:02:17:12 | 9:16 | PHOTO | `A180` | `timeline/2024-car-trunk-filled-with-books-and-supplies.jpg` | 2024 · ಎಂ.ಎಂ. ಹಿಲ್ಸ್ · 200 ಶಾಲಾ ಚೀಲ | Music builds, restrained |
| K23 | 00:02:17:12 | 00:02:24:05 | 6:18 | PHOTO | `A220` | `timeline/2025-children-with-volunteers-under-tree.jpg` | 2025 · ಎಚ್.ಡಿ. ಕೋಟೆ · 300 ಶಾಲಾ ಚೀಲ | Music peaks here, then holds |
| K24 | 00:02:24:05 | 00:02:27:02 | 2:21 | PHOTO | `A236` | `timeline/2025-school-front-group-photo.jpg` | - | Music thins to a single line |
| K25 | 00:02:27:02 | 00:02:31:13 | 4:11 | PHOTO | `A228` | `timeline/2025-government-primary-school-sign.jpg` | - | - |
| K26 | 00:02:31:13 | 00:02:39:02 | 7:14 | PHOTO | `A025-crop` | `children-stories/scholarship-interview-with-girl-and-guardian.jpeg` | ಗುರುತಿಸುವುದು · ಪರಿಶೀಲಿಸುವುದು · ಒಳಗೊಳ್ಳುವುದು · ಬೆಳೆಸುವುದು | - |
| K27 | 00:02:39:02 | 00:02:46:06 | 7:05 | CARD | `GFX-05` | `-` | ಶಾಲಾ ಶುಲ್ಕದ ಶೇಕಡ 75ರವರೆಗೆ  //  ನೇರವಾಗಿ ಶಾಲೆಗೆ | MUSIC OUT COMPLETELY under 'ಪೂರ್ತಿ ಅಲ್ಲ.' Drone alone returns on the pause. |
| K28 | 00:02:46:06 | 00:02:53:03 | 6:22 | PHOTO | `A222` | `timeline/2025-classroom-full-of-beneficiary-families.jpg` | - | Drone only |
| K29 | 00:02:53:03 | 00:02:57:06 | 4:03 | CARD | `GFX-06` | `-` | ನೇರವಾಗಿ ಶಾಲೆಗೆ. ಬೇರೆ ಯಾರ ಕೈಗೂ ಅಲ್ಲ. | Bansuri returns softly |
| K30 | 00:02:57:06 | 00:03:05:05 | 7:23 | PHOTO | `A252` | `timeline/2025-volunteer-tying-shoe-for-child.jpg` | - | - |
| K31 | 00:03:05:05 | 00:03:12:15 | 7:10 | PHOTO | `A244` | `timeline/2025-stationery-and-snacks-arranged.jpg` | ಶಾಲಾ ಸಾಮಗ್ರಿ ವಿತರಣೆ | Tempo lifts slightly |
| K32 | 00:03:12:15 | 00:03:19:14 | 7:00 | PHOTOCARD | `A078` | `magazine-gallery/kids-craft.jpeg` | ಕಲಿಕೆಯ ಆಟಗಳು · ನಾಡು ನುಡಿಯ ಪರಿಚಯ · ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲ... | - |
| K33 | 00:03:19:14 | 00:03:22:13 | 2:24 | PHOTO | `A232` | `timeline/2025-large-community-celebration-group-photo.jpg` | ಪೋಷಕರಿಗೆ ಮಾರ್ಗದರ್ಶನ | - |
| K34 | 00:03:22:13 | 00:03:33:07 | 10:18 | CARD | `GFX-07` | `-` | (no list on screen under this line) | Restrained, drone and a single held bansuri note |
| K35 | 00:03:33:07 | 00:03:40:09 | 7:02 | CARD | `GFX-08` | `-` | ಸಹಭಾಗಿತ್ವದಲ್ಲಿ  //  ನಿಸರ್ಗ ಫೌಂಡೇಶನ್  //  ಬೆಳಕು ಟ್ರಸ್ಟ್, ಬಂಗಾ... | Warmer |
| K36 | 00:03:40:09 | 00:03:50:11 | 10:02 | PHOTOCARD | `A196` | `timeline/2024-newspaper-coverage-clipping.jpg` | ಉದಯವಾಣಿ · 19 ಜೂನ್ 2024 | Music holds, no swell |
| K37 | 00:03:50:11 | 00:04:00:12 | 10:01 | PHOTOCARD | `A002` | `awards/bharat-shiksha-ratan-award-certificate-scan.jpeg` | ಭಾರತ್ ಶಿಕ್ಷಾ ರತ್ನ ಪ್ರಶಸ್ತಿ · 19 ಡಿಸೆಂಬರ್ 2025 · ನವದೆಹಲಿ  // ... | One gentle lift, then settle |
| K38 | 00:04:00:12 | 00:04:11:20 | 11:08 | PHOTO | `A250` | `timeline/2025-volunteer-group-at-school-garden.jpg` | ನೆರವು ನೀಡಿದವರಿಗೆ | Piano or nylon guitar enters here for the first time |
| K39 | 00:04:11:20 | 00:04:18:12 | 6:17 | PHOTO | `A230` | `timeline/2025-hall-full-of-volunteers-and-children.jpg` | ಸ್ವಯಂಸೇವಕರಿಗೆ  //  ವಕೀಲರು · ಎಂಜಿನಿಯರ್‌ಗಳು · ವೈದ್ಯರು · ಗೃಹಿಣಿ... | - |
| K40 | 00:04:18:12 | 00:04:21:11 | 2:24 | PHOTO | `A238` | `timeline/2025-schoolchildren-showing-school-bags-on-veranda.jpg` | ಪೋಷಕರಿಗೆ  //  ತಮ್ಮ ಪಾಲಿನ ಶುಲ್ಕವನ್ನು ತಪ್ಪದೇ ಹೊಂದಿಸಿದವರು | - |
| K41 | 00:04:21:11 | 00:04:31:17 | 10:07 | PHOTO | `A216` | `timeline/2025-children-showing-school-bags-outdoors.jpg` | - | Music opens up, piano and bansuri together |
| K42 | 00:04:31:17 | 00:04:39:14 | 7:22 | PHOTO | `A186` | `timeline/2024-children-with-supplies-outdoors.jpg` | - | - |
| K43 | 00:04:39:14 | 00:04:46:08 | 6:19 | PHOTO | `A240b` | `timeline/2025-schoolwide-supplies-group-photo.jpg` | - | Music lifts but does not climax |
| K44 | 00:04:46:08 | 00:04:51:04 | 4:20 | PHOTO | `A224` | `timeline/2025-classroom-full-of-children-with-supplies.jpg` | - | Music resolves, unhurried |
| K45 | 00:04:51:04 | 00:04:56:21 | 5:18 | PHOTO | `A224b` | `timeline/2025-classroom-full-of-children-with-supplies.jpg` | - | Music holds under, then begins to thin |
| K46 | 00:04:56:21 | 00:05:03:21 | 7:00 | CARD | `GFX-09` | `-` | ಪ್ರತಿ ಮಗುವಿನ ಮೇಲೆ ನಂಬಿಕೆ ಇಟ್ಟ ಒಂದು ದಶಕ  //  ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷ... | Fade to silence |
Full crop windows, motion, transitions and per-shot direction are in [`03-kannada-storyboard.md`](03-kannada-storyboard.md).

**Note on `K15`.** It is one 8:11 shot containing a two-image dissolve chain, not a single frame: `A150` (2018) into `A156` (`timeline/2019-community-group-photo-outdoors.jpg`, 1600x777). A 16-frame cross-dissolve, no location named on screen. The chain was written as three images ending on `A160`, but `A160` is also `K16`, which would have run the same photograph straight through the `K15`/`K16` cut; caught in the build and corrected. `A156` therefore appears in the cut without a shot number of its own, which brings the distinct-image count to 35: 34 distinct source paths across the 37 photographic shot rows, plus `A156` inside this chain. Three assets appear twice at different focal lengths (`A228` at `K01` and `K25`, `A240` at `K02` and `K43`, `A224` across the continuous `K44`-`K45`).

**Note on `K44` and `K45`.** One continuous 10:13 shot on `A224` with a single push from 0 to 6 percent. They are listed separately only because the subtitle cue changes. **There is no cut between them.** Do not cut away from faces while the welcome line is spoken.

**Note on `K25` and `K43`.** Both deliberately return to an asset used earlier at a different focal length and in a different act: `K25` tightens into the `K01` school board three minutes later, and `K43` pulls back wider than `K02` on the same school. These are rhymes, not duplicate cuts, and they are the only two repetitions in the film. The rule against consecutive duplicate photographs is not breached anywhere.

---

## 7 · Music cue sheet

One bed, both language versions. Only the narration stem changes. `07` section 11.

| TC | Shot | Cue | Level |
|---|---|---|---|
| 00:00:00:00 | `K01` | Solo bansuri enters over a low near-static drone | -30 dB rising to -24 dB |
| 00:00:18:21 | `K04` | Melody out. **Drone alone** under the school-fee line | -26 dB |
| 00:00:32:05 | `K06` | **Music out completely.** Room tone only, six seconds, under the founder's quote | silent |
| 00:00:38:05 | `K07` | Bansuri returns | -26 dB |
| 00:01:01:16 | `K10` | Thins to drone across the 2-second pause | -28 dB |
| 00:01:11:02 | `K12` | **Silence** under ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. | silent |
| 00:01:20:02 | `K14` | Melody enters properly for the first time | -24 dB |
| 00:01:32:09 | `K16` | Falls away to a single held note for 2020 | -28 dB |
| 00:01:35:20 | `K17` | Drone only through the relief poster | -28 dB |
| 00:01:45:23 | `K18` | Melody returns, warmer, for the libraries | -24 dB |
| 00:02:05:23 | `K22` | Builds, restrained. **No swell on the numbers** | -22 dB |
| 00:02:14:12 | `K23` | Peaks here, the film's highest point, then holds through the 2.5-second silence | -20 dB |
| 00:02:19:21 | `K24` | Thins to a single line | -26 dB |
| 00:02:35:04 | `K27` | **Music out completely** under ಪೂರ್ತಿ ಅಲ್ಲ. Drone alone returns on the 2-second pause | silent, then -30 dB |
| 00:02:50:07 | `K29` | Bansuri returns softly | -26 dB |
| 00:03:04:14 | `K31` | Tempo lifts slightly for the programmes | -24 dB |
| 00:03:21:04 | `K34` | Restrained: drone and one held bansuri note. **Nothing that could be read as sentiment** | -28 dB |
| 00:03:32:11 | `K35` | Warmer under the partners card | -25 dB |
| 00:03:49:11 | `K37` | One gentle lift for the award, then settle. **No fanfare** | -22 dB |
| 00:03:57:18 | `K38` | **Piano or nylon guitar enters for the first time.** The gratitude section | -22 dB |
| 00:04:18:07 | `K41` | Opens up, piano and bansuri together | -20 dB |
| 00:04:38:18 | `K43` | Lifts, but **does not climax** | -20 dB |
| 00:04:45:14 | `K44` | Resolves, unhurried | -22 dB |
| 00:04:51:04 | `K45` | Holds under the welcome, then begins to thin | -24 dB |
| 00:04:56:21 | `K46` | Fades to silence across the end card | to silent |

**Three cues carry the film:** the six seconds of complete silence at `K06`, the drop-out under `ಪೂರ್ತಿ ಅಲ್ಲ.` at `K27`, and the refusal to climax at `K43`. If a music supplier cannot deliver those three, the bed is wrong regardless of how good the melody is.

**Sound effects are not in this cue sheet on purpose.** `07` item 5.7 rules them out. A sourcing plan exists in `11` if the Trust revises 5.7; it must not touch the silence cues above.

**Forbidden:** any track with a vocal in any language; orchestral swell on the numbers; four-to-the-floor percussion; corporate-inspirational piano-and-clap library music; devotional cadence; a rise under the award. `07` section 11, `14` item 5.4.

**BLOCKING on licence.** The licence must cover public event screening, YouTube monetised or not, social media and website embedding, worldwide, in perpetuity. A "personal use" or "single project, non-broadcast" licence is not sufficient for an event plus YouTube. `14` items 5.1 and 5.2. If the budget allows, commissioning five minutes of original bansuri from a Karnataka musician is cheaper than premium library licensing and is a better story. `07` section 11.

---

## 8 · Grade

One pass, on the shared visual master, before the Kannada text layer goes on.

- Grade from the **`.jpg` / `.jpeg`** in every case. The `.webp` files were generated by `scripts/optimize-images.mjs` for web delivery and carry artefacts that show under a push and on a projector. `05` section 2.2. The one exception is `A082` at `K09`, where only WebP exists.
- **Unify the decade.** Most sources are phone photographs in harsh Karnataka daylight. Lift shadows, hold highlights, and match white balance so 2016 and 2025 belong to the same film.
- **Do not convert 2016 to 2019 to black and white** to signal the past. The early photographs are already visually distinct; a duotone reads as a stylistic tic. `07` section 8.
- **Protect faces.** No AI face enhancement, no skin smoothing, no AI upscaling: `05` section 3.1 forbids AI-upscaling documentary photographs of real children and presenting the result as an archival record, and nothing in this cut does. Enlargement is LANCZOS, which invents nothing.
- **There is one finishing step on top of that, and it is bounded.** LANCZOS is soft by design, so `film.py` applies a 1px unsharp mask scaled to how far each shot is actually enlarged: nothing under 1.20x, rising 60 percent per 1.0x, **capped at 60 percent**, with a threshold that leaves flat areas alone. 17 of the 37 photographic shots get none of it. It invents no detail and treats a face no differently from a wall. The cap is set where it is because it was compared on `K09`, the closest face in the cut: 60 percent is plainly better than none at the glasses, beard and collar with no halo, and 87 begins to harden the collar edge. `film.py --no-sharpen` turns it off entirely if the Trust would rather have the rule absolute. `tools/frame_audit.py` reports the enlargement per shot.
- Sub-HD material used to sit inside a cream or navy card at native size rather than being blown up, across eight shots. **That is withdrawn**: the photography now fills the frame, K31 and K32 as multi-image collages where a single image could not fill it without a 3.74x push, and `K36` is the only card left because it is the newspaper clipping the audience reads.
- Watch `A198` if it is ever reinstated: a **SELCO** solar-equipment mark is visible at frame right. Not used in this cut.

## 9 · Assembly order

1. Lay the narration stem against the shot order above. **Narration first, images second.** `10` section F.
2. Build the card templates once, as a single graphics project with a swappable text layer. `04` section 8.
3. Grade once, on the shared visual master.
4. Apply the Kannada text layer and the six Kannada-specific timing differences.
5. Mix the event master at -23 LUFS and the online master at -16 LUFS from the same bed.
6. Export 16:9, then re-frame for 9:16 and 1:1.

**Do not begin the 9:16 and 1:1 versions until the 16:9 Kannada cut is approved.** The Kannada text layout is the constraint that drives every other format.

## 10 · Social re-frames

**Re-frame, never letterbox.** `10` section E.

| Format | Spec | Approach |
|---|---|---|
| **9:16** | 1080x1920, 30 fps, H.264 10 Mbps, burned-in Kannada captions | Substitute the portrait-native assets rather than cropping the landscape ones: `A206` (1446x1920), `A204` (1446x1920), `A180` (1446x1920), `A178` (1200x1600), `A200` is rejected, plus the `magazine-gallery` 1200x1600 files. Text moves to the **upper third**, above the platform UI |
| **1:1** | 1080x1080, 30 fps, H.264 8 Mbps, burned-in Kannada captions | Centre-safe crop of the 16:9. Text moves to a lower band inside the square |
| **Title in both** | | Use main-title option 2, **ಹತ್ತು ವರ್ಷ. ಒಂದೊಂದೇ ಮಗು.** The long headline will not read at these sizes. `04` section 6 |

**Every rule in this package survives the crop.** In particular: `K34` stays a card with no face in every format, no payment code appears in any format, and no Kannada text drops below 44 px equivalent after the re-frame.

## 11 · Final visual notes

1. **The film's argument is in three cards, not in its photographs.** `K12` (one child, one scholarship), `K27` (75 per cent, directly to the school) and `K34` (the hardest to reach, shown as nothing at all). Each replaces a photograph that would have been easier and worse. If a later reviewer asks why a five-minute film about children has nine typographic cards, that is the answer.
2. **Seventy-one percent of the usable image library is from the last two years.** `05` section 4. This cut does not try to hide that. The 2018 to 2021 stretch is one dissolve chain under one line, `ಅದೇ ದಾರಿಗಳು, ಅದೇ ಶಾಲೆಗಳು, ಇನ್ನಷ್ಟು ಮಕ್ಕಳು`, which is both what the evidence supports and better paced than pretending otherwise.
3. **There is not one second of moving image in the repository.** `05` section 6 rank 3. This cut is built entirely from stills and is designed so it does not read as a slideshow: nine cards break the rhythm, every push is 2 to 4 percent, and nothing cuts faster than 2.3 seconds. Even ninety seconds of phone video from a school visit would change the register, and it is worth asking volunteers before the event.
4. **The single highest-value missing asset is 30 to 45 seconds of the founder speaking Kannada to camera.** `05` section 6 rank 5. The film currently has to speak *about* her, and it has a six-second silent card where her voice should be. One afternoon fixes both.
5. **Request the Udayavani page at full resolution** from `epaper.udayavani.com/c/75279105`. The repository copy is 513x733 and it is the film's only independent verification. The headline and caption are legible on inspection and will hold at the card size specified, but a hall projection deserves the real scan. `05` section 6 rank 12.
6. **`K23` is the film's peak and it is a number nobody argues with.** ಮುನ್ನೂರು, three hundred school bags in H.D. Kote, over the best group photograph in the library, held 2.5 seconds in silence. It carries the emotional weight that a cumulative total would have carried, without needing `06` Q1 to be answered first. If the trustees later supply a verified cumulative figure, **do not add it here.** Put it on the end card or leave it out.
