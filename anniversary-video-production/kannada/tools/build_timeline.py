#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Builds the frame-accurate Kannada cut timeline for the LPET 10-year welcome film.
Single source of timing truth for deliverables 01, 03, 05 and 06.

Model:
  The film's TOTAL speech time is set by WPM, the pace the brief specifies.
  That total is then distributed between lines by DISPLAY CLUSTER COUNT, not by
  word count, because Kannada word length varies enormously: ವಿದ್ಯಾರ್ಥಿವೇತನ is
  one word and six syllables. Measured against 43 lines of synthesised Kannada,
  clusters predict spoken duration with 9.2% mean error against 16.0% for words,
  and only 3 lines off by more than 20% against 13. Word count under-allocated
  the compound-heavy lines badly: K37 needed 9.6s and had been given 6.3s.

  shot duration = speech + marked pauses + held silence
  25 fps, timecodes HH:MM:SS:FF
"""
import re, json, sys, unicodedata

WPM = 105.0          # brief: female Kannada voice, 100-110 wpm. 105 = design target.
FPS = 25

def kwords(s):
    s = re.sub(r"\[[^\]]*\]", " ", s)
    return [w for w in re.split(r"\s+", s) if re.search(r"[ಀ-೿0-9]", w)]

# A digit is written in one character and spoken in several: 09 section 3.4 has
# the narrator saying years as Kannada number words, so "2016" is four characters
# and ಎರಡು ಸಾವಿರದ ಹದಿನಾರು, thirteen clusters, in the mouth. Measured against the
# synthesised read, the year lines were the worst-fitting in the film until each
# digit was weighted at 3.25 clusters.
DIGIT_CLUSTERS = 3.25

def clusters(s):
    """Rendered display units: codepoints less combining marks and joiners,
    with digits weighted at what they cost to SAY. The subtitle generator uses
    the unweighted form, because there it is line width that matters."""
    s = re.sub(r"\[[^\]]*\]", " ", s)
    n = 0.0
    for ch in s:
        if unicodedata.category(ch) in ("Mn", "Mc", "Cf"):
            continue
        n += DIGIT_CLUSTERS if ch.isdigit() else 1.0
    return n

# shot = (sec, shot_id, kind, asset_id, path/desc, narration, pause, hold, onscreen, note)
# kind: PHOTO | CARD | PHOTOCARD
S = []
def shot(sec, sid, kind, asset, path, narr="", pause=0.0, hold=0.0, osd="", crop="", motion="", trans="", music="", note=""):
    S.append(dict(sec=sec, sid=sid, kind=kind, asset=asset, path=path, narr=narr,
                  pause=pause, hold=hold, osd=osd, crop=crop, motion=motion,
                  trans=trans, music=music, note=note))

# ---------------------------------------------------------------- COLD OPEN
shot("0 · ಆರಂಭಪೂರ್ವ", "K01", "PHOTO", "A228",
     "assets/images/timeline/2025-government-primary-school-sign.jpg",
     hold=7.0,
     crop="1215x911 native. 16:9 window y 0-684, full width. Upscale 1.58x to 1920x1080 (LANCZOS). Excludes the adult at bottom-left.",
     motion="Static 3s, then 3% push toward the centre of the board over the remaining 4s.",
     trans="Fade from black, 20f", music="Bansuri enters at -30 dB, rises to -24 dB",
     note="NO FACES. Kannada board: ಕರ್ನಾಟಕ ಸರ್ಕಾರ / ಜಿಲ್ಲಾ ಪಂಚಾಯತ್ ಮೈಸೂರು / ಸಾರ್ವಜನಿಕ ಶಿಕ್ಷಣ ಇಲಾಖೆ / ಸರ್ಕಾರಿ ಕಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ / ಎನ್.ಎಸ್. ಹಳ್ಳಿ ಗಿರಿಜನ ಕಾಲೋನಿ (ಪ್ರಭಾನಗರ ಹಾಡಿ), ಹೆಚ್.ಡಿ. ಕೋಟೆ ತಾ. Reads the location for the audience without a caption.")

# ---------------------------------------------------------------- A
A1 = "ಪ್ರತಿ ವರ್ಷ, ಕರ್ನಾಟಕದ ಹಳ್ಳಿಗಳಲ್ಲಿ, ಮಕ್ಕಳು ತಮ್ಮ ಬಳಿ ಇರುವುದೆಲ್ಲವನ್ನೂ ಒಂದೇ ಚೀಲದಲ್ಲಿ ಹೊತ್ತು ಶಾಲೆಗೆ ನಡೆಯುತ್ತಾರೆ."
A2 = "ಅವರಿಗೆ ಬುದ್ಧಿ ಇದೆ. ಕಲಿಯುವ ಹಂಬಲ ಇದೆ."
A3 = "ಆದರೆ ಆ ನಡಿಗೆಗೂ ತರಗತಿಗೂ ನಡುವೆ, ಶಾಲಾ ಶುಲ್ಕ ಒಂದು ತೀರ್ಮಾನ ತೆಗೆದುಕೊಂಡು ಬಿಡುತ್ತದೆ."
A4 = "ಹತ್ತು ವರ್ಷಗಳಿಂದ, ಒಂದು ಟ್ರಸ್ಟ್ ಸರಿಯಾಗಿ ಅಲ್ಲಿಯೇ ಬಂದು ನಿಂತಿದೆ."

shot("ಎ · ಆರಂಭ", "K02", "PHOTO", "A240",
     "assets/images/timeline/2025-schoolwide-supplies-group-photo.jpg", narr=A1,
     crop="1618x911. Upscale 1.19x to 1920x1080.", motion="3% push in over the shot.",
     trans="Cross-dissolve 20f", music="Bansuri, drone under",
     note="Whole school outdoors, Kannada school board legible top-left. CONSENT [C].")
shot("ಎ · ಆರಂಭ", "K03", "PHOTO", "A206",
     "assets/images/timeline/2025-child-with-school-kit-close-up.jpg", narr=A2, pause=1.0,
     crop="1446x1920 portrait. 16:9 window on the two laughing children, y 430-1243. Upscale 1.33x.",
     motion="Static. No push. Let the laugh sit still.", trans="Cross-dissolve 16f",
     note="The film's one moment of undirected joy. CONSENT [C], high priority for release.")
shot("ಎ · ಆರಂಭ", "K04", "PHOTO", "A226",
     "assets/images/timeline/2025-colorful-school-building.jpg", narr=A3, pause=2.0,
     crop="1215x911. Crop out the adult at bottom-left: window x 0-1215, y 0-684. Upscale 1.58x.",
     motion="Static.", trans="Cross-dissolve 20f", music="Drop to drone only",
     note="DIGNITY RULE. The fee line must not sit over a child's face. A painted government school, empty of people, carries it better. Kannada board: ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ, ಮಂಟಿಹಾಡಿ.")
shot("ಎ · ಆರಂಭ", "K05", "CARD", "GFX-01", "Title card",
     narr=A4, hold=0.5,
     osd="ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್  //  ಹತ್ತು ವರ್ಷ · 2016 ರಿಂದ 2026",
     motion="Gold rule draws left to right over 600ms, then the wordmark rises 20px with a 400ms ease-out.",
     trans="Hard cut", music="Drone holds",
     note="Navy #1c1c2e. Wordmark Noto Serif Kannada 700, 96px. Sub-line Noto Sans Kannada 600, 52px, #e0b06a. Logo mark logo.png at native 300x257, top-left of the lockup. 1.3x Kannada dwell already in the duration.")

# ---------------------------------------------------------------- QUOTE
shot("ಎ2 · ಸಂಸ್ಥಾಪಕರ ಮಾತು", "K06", "CARD", "GFX-02", "Founder quote card",
     hold=6.0,
     osd='"ಶಿಕ್ಷಣದ ವಿಷಯದಲ್ಲಿ ಯಾವ ಮಗುವೂ ಹಿಂದೆ ಉಳಿಯಬಾರದು."  //  ಚಾರುಲತಾ ಎಂ. ಆರ್., ಸಂಸ್ಥಾಪಕರು',
     motion="Text fades up over 800ms. Nothing else moves.",
     trans="Dissolve 24f", music="Music out entirely. Room tone only.",
     note="NO NARRATION. NO PHOTOGRAPH. 6s, the longest silent card in the film. Typography only, so the sentence is the whole frame. [ಟ್ರಸ್ಟಿ ದೃಢೀಕರಣ ಅಗತ್ಯ] on the Kannada wording.")

# ---------------------------------------------------------------- B
B1 = "ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್, ಬೆಂಗಳೂರಿನ ಎಚ್.ಎಸ್.ಆರ್. ಲೇಔಟ್‌ನಲ್ಲಿರುವ ನೋಂದಾಯಿತ ಶೈಕ್ಷಣಿಕ ಟ್ರಸ್ಟ್."
B2 = "ಇದನ್ನು ಸ್ಥಾಪಿಸಿದವರು ಚಾರುಲತಾ ಎಂ. ಆರ್. ಟ್ರಸ್ಟ್ ಶುರುವಾಗುವ ಮೊದಲೇ ಅವರು ತಮ್ಮ ಬಡಾವಣೆಯ ಮಕ್ಕಳ ಶಾಲಾ ಶುಲ್ಕವನ್ನು ತಾವೇ ಕಟ್ಟುತ್ತಿದ್ದರು."
B3 = "ಅವರ ಜೊತೆಗೂಡಿದವರು ಸಾದೇನಹಳ್ಳಿಯ ಎಸ್. ಎಂ. ಮಂಜುನಾಥ. ಓದಲೆಂದು ಊರು ಬಿಟ್ಟು ನಗರಕ್ಕೆ ಬಂದ ತಮ್ಮ ಕುಟುಂಬದ ಮೊದಲ ವ್ಯಕ್ತಿ."
B4 = "ತಮ್ಮ ಊರಿನ ಹಲವು ಮಕ್ಕಳನ್ನು ಅವರು ಆಗಲೇ ಓದಿಸಿದ್ದರು."
B5 = "2016ರಲ್ಲಿ ಅವರು ಮೊದಲ ಶಾಲಾ ಭೇಟಿ ಮಾಡಿದರು."
B6 = "ಚಿಕ್ಕಬಳ್ಳಾಪುರ. ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ."
B7 = "ಅದೇ ಭೇಟಿಯಲ್ಲಿ ನೂರೈವತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸ್ಟೀಲ್ ತಟ್ಟೆ ಮತ್ತು ಲೋಟ ವಿತರಿಸಲಾಯಿತು."

shot("ಬಿ · ಆರಂಭದ ದಿನಗಳು", "K07", "CARD", "GFX-03", "Organisation card", narr=B1,
     osd="ನೋಂದಾಯಿತ ಶೈಕ್ಷಣಿಕ ಟ್ರಸ್ಟ್  //  ಎಚ್.ಎಸ್.ಆರ್. ಲೇಔಟ್, ಬೆಂಗಳೂರು",
     motion="Static navy card, logo mark centred above the text.", trans="Dissolve 20f",
     music="Bansuri returns at -26 dB", note="Cream #faf8f3 ground, navy text, gold rule. ORG-04, ORG-05.")
shot("ಬಿ · ಆರಂಭದ ದಿನಗಳು", "K08", "PHOTOCARD", "A059",
     "assets/images/magazine-gallery/Charulatha-MR.jpeg", narr=B2,
     crop="1280x853 placed at 1280px wide inside a navy 1920x1080 frame (67% width, native, no upscale). Crop the LG monitor badge out of the left edge.",
     motion="2% push.", trans="Cut", osd="ಚಾರುಲತಾ ಎಂ. ಆರ್.  //  ಸಂಸ್ಥಾಪಕರು ಮತ್ತು ವ್ಯವಸ್ಥಾಪಕ ಟ್ರಸ್ಟಿ",
     note="Lower third enters at 1.0s, holds 4.5s, exits over 500ms. Kannada bar 1.5x English height. TRUSTEE LIKENESS approval.")
shot("ಬಿ · ಆರಂಭದ ದಿನಗಳು", "K09", "PHOTOCARD", "A082",
     "assets/images/magazine-gallery/trustee-mr-sm-manjunatha.webp", narr=B3,
     crop="853x853 square, placed at 853px inside the navy frame (44% width, native). WEBP ONLY - see note.",
     motion="Static.", trans="Cut", osd="ಎಸ್. ಎಂ. ಮಂಜುನಾಥ  //  ಟ್ರಸ್ಟಿ",
     note="ONLY WEBP EXISTS. No JPEG twin anywhere in the repository, so the house rule 'always grade from the JPEG' cannot be met. Request the original. A framed devotional picture is visible on the wall behind; the trustee should decide whether to keep or reframe.")
shot("ಬಿ · ಆರಂಭದ ದಿನಗಳು", "K10", "PHOTO", "A234",
     "assets/images/timeline/2025-saraswati-primary-school-sign.jpg", narr=B4, pause=2.0,
     crop="1215x911. 16:9 window y 90-774. Upscale 1.58x.",
     motion="Static, then the 2s pause runs on the held frame.", trans="Dissolve 20f",
     music="Music thins to drone for the pause",
     note="NO FACES. A weathered village school board, ಸರ್ಕಾರಿ ಕಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ. Carries 'the children of his own village' without putting anyone on screen.")
shot("ಬಿ · ಆರಂಭದ ದಿನಗಳು", "K11", "PHOTOCARD", "A061",
     "assets/images/magazine-gallery/charu-talk.jpeg", narr=B5,
     crop="747x1328 portrait. Place at 640px wide, left third of a cream 1920x1080 card. Native, no upscale.",
     motion="Static.", trans="Cut", osd="2016 · ಚಿಕ್ಕಬಳ್ಳಾಪುರ  //  ಮೊದಲ ಶಾಲಾ ಭೇಟಿ",
     note="THE FILM'S MOST VALUABLE FRAME IF DATED. The founder teaching at the blackboard, children seated on the floor seen from behind. Same room, same wall charts, same uniforms and the same 747x1328 slide-deck extraction as A138 (2016-classroom-session-with-students.jpg, inventoried as 2016 Chickaballapur), so this is almost certainly the same 2016 visit. Inventory lists its year as UNKNOWN. [ಟ್ರಸ್ಟಿ ದೃಢೀಕರಣ ಅಗತ್ಯ] on the date. Do NOT also cut A138 anywhere in the film; they are two frames of one moment.")
shot("ಬಿ · ಆರಂಭದ ದಿನಗಳು", "K12", "CARD", "GFX-04", "One child card", narr=B6, hold=1.0,
     osd="ಒಂದು ಮಗು.  //  ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ.",
     motion="Two lines, the second entering 1.2s after the first. Gold rule between them.",
     trans="Cut", music="Silence under this card",
     note="REPLACES the rejected A140 handover photograph. Typography, not a staged handover. Navy, Noto Serif Kannada 700 at 84px.")
shot("ಬಿ · ಆರಂಭದ ದಿನಗಳು", "K13", "PHOTO", "A254",
     "assets/images/timeline/children-with-steel-plates-and-glasses-distribution.jpeg", narr=B7,
     crop="1440x802. Upscale 1.33x to 1920x1070, pillar-safe.",
     motion="Slow 4% push along the row of plates.", trans="Dissolve 20f",
     osd="150 ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸ್ಟೀಲ್ ತಟ್ಟೆ ಮತ್ತು ಲೋಟ",
     note="NUM-01. Numeral 150 in Arabic figures on the card; ನೂರೈವತ್ತು spoken. CONSENT [C]. Use this asset path, not public/images/steel-plate-and-glass-distributed-to-these-children.jpeg (A468), which is the byte-identical undescriptive twin.")

# ---------------------------------------------------------------- C
C1 = "2017ರಲ್ಲಿ ಒಂದು ಹತ್ತಾಯಿತು. ಹತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಿದ್ಯಾರ್ಥಿವೇತನ."
C2 = "ಆಮೇಲೆ ಕೆಲಸ ಹಾಗೇ ಮುಂದುವರಿಯಿತು. ವರ್ಷದಿಂದ ವರ್ಷಕ್ಕೆ. ಅದೇ ದಾರಿಗಳು, ಅದೇ ಶಾಲೆಗಳು, ಇನ್ನಷ್ಟು ಮಕ್ಕಳು."
C3 = "2020ರಲ್ಲಿ ಶಾಲೆಗಳು ಮುಚ್ಚಿದವು, ಕುಟುಂಬಗಳ ದಿನಗೂಲಿ ನಿಂತಿತು."
C4 = "ಆಗ ಟ್ರಸ್ಟ್ ಒಂದೇ ಪುಟದ ಪ್ರಕಟಣೆ ಹೊರಡಿಸಿತು. ಪೋಷಕರನ್ನು ಕಳೆದುಕೊಂಡ ಮಕ್ಕಳಿಗೆ. ಕೆಲಸ ಕಳೆದುಕೊಂಡು ಶುಲ್ಕ ಕಟ್ಟಲಾಗದ ಪೋಷಕರಿಗೆ. ನೆರವು ನಿಲ್ಲಲಿಲ್ಲ."
C5 = "2022ರಲ್ಲಿ ಪುಸ್ತಕದ ಕಪಾಟುಗಳು ಎದ್ದವು. ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯಗಳು."
C6 = "ದಾನವಾಗಿ ಬಂದ ಕಥೆ ಪುಸ್ತಕಗಳು, ಪಠ್ಯ ಪುಸ್ತಕಗಳು, ಬಳಸದೇ ಉಳಿದ ನೋಟ್‌ಬುಕ್‌ಗಳು."
C7 = "2023ರಲ್ಲಿ ವ್ಯಾಪ್ತಿ ಹಿಗ್ಗಿತು. ಮೈಸೂರು. ಎಚ್.ಡಿ. ಕೋಟೆ."
C8 = "ಒಂಬತ್ತು ಮತ್ತು ಹತ್ತನೇ ತರಗತಿಯ ಮಕ್ಕಳಿಗೆ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ. ಬದುಕಿನ ದಾರಿ ಸದ್ದಿಲ್ಲದೆ ನಿರ್ಧಾರವಾಗುವ ವಯಸ್ಸು ಅದು."
C9 = "2024ರಲ್ಲಿ ಎಂ.ಎಂ. ಹಿಲ್ಸ್‌ನ ಬುಡಕಟ್ಟು ಶಾಲೆಗಳಲ್ಲಿ ಇನ್ನೂರು ಶಾಲಾ ಚೀಲ, ನೋಟ್‌ಬುಕ್ ಮತ್ತು ಲೇಖನ ಸಾಮಗ್ರಿಗಳೊಂದಿಗೆ ಶೈಕ್ಷಣಿಕ ವರ್ಷ ಆರಂಭವಾಯಿತು."
C10 = "ಮತ್ತು 2025ರಲ್ಲಿ, ಎಚ್.ಡಿ. ಕೋಟೆಯಲ್ಲಿ, ಮುನ್ನೂರು."

shot("ಸಿ · ಒಂದು ದಶಕದ ಹಾದಿ", "K14", "PHOTO", "A144",
     "assets/images/timeline/2017-scholarship-group-photo-on-school-veranda.jpg", narr=C1,
     crop="1600x1200. 16:9 window y 150-1050. Upscale 1.2x.",
     motion="Static. Under 4s, so no push: a move this short reads as a wobble.", trans="Cut", osd="2017 · 10 ವಿದ್ಯಾರ್ಥಿಗಳು", music="Melody enters",
     note="Chosen over A146 (2017-school-group-photo.jpeg) on resolution, per 05 section 2.3. CONSENT [C].")
shot("ಸಿ · ಒಂದು ದಶಕದ ಹಾದಿ", "K15", "PHOTO", "A150",
     "assets/images/timeline/2018-classroom-presentation-session.jpg", narr=C2, pause=2.0,
     crop="1600x1200. 16:9 window y 170-1070. Upscale 1.2x.",
     motion="Static, dissolve through to A156 at the halfway point.",
     trans="Cross-dissolves 16f", osd="ಕೆಲಸ ಮುಂದುವರಿಯಿತು",
     note="Three-image dissolve chain across the thin years: A150 (2018) -> A156 (2019-community-group-photo-outdoors.jpg, 1600x777) -> A160 (2021-scholarship-distribution-crowd.jpg, 1600x1200). NO LOCATION NAMED anywhere in this shot. Sidesteps the 2019/2020/2021 KGF-versus-Chickaballapur conflict (06 A3). Children's faces are in all three: CONSENT [C].")
shot("ಸಿ · ಒಂದು ದಶಕದ ಹಾದಿ", "K16", "PHOTO", "A160",
     "assets/images/timeline/2021-scholarship-distribution-crowd.jpg", narr=C3,
     crop="1600x1200. 16:9 window y 200-1100. Upscale 1.2x.",
     motion="Static.", trans="Dissolve 20f", music="Music falls away to a single held note",
     note="A large outdoor gathering. The inventory marks A160 'N/A - no identifiable person'; that is WRONG, the frame is full of identifiable faces. Corrected in deliverable 07.")
shot("ಸಿ · ಒಂದು ದಶಕದ ಹಾದಿ", "K17", "PHOTOCARD", "A158",
     "assets/images/timeline/2020-pandemic-relief-announcement-poster.jpg", narr=C4, pause=1.0,
     crop="1440x1377. Place at 900px tall, right of frame, on navy. Native, no upscale.",
     motion="Static. No push on a document.", trans="Cut",
     osd="2020 · ಸಾಂಕ್ರಾಮಿಕ ಕಾಲದ ನೆರವು  //  ಪೋಷಕರನ್ನು ಕಳೆದುಕೊಂಡ ಮಕ್ಕಳಿಗೆ · ಕೆಲಸ ಕಳೆದುಕೊಂಡ ಪೋಷಕರಿಗೆ",
     music="Drone only",
     note="KANNADA-SPECIFIC. The poster itself is in English. The two eligibility criteria are set as a Kannada lower-third strip beside it, left third, so a Kannada-only viewer is not excluded. LPET's own artwork; confirm it was not built from licensed stock (14 item 4.10).")
shot("ಸಿ · ಒಂದು ದಶಕದ ಹಾದಿ", "K18", "PHOTO", "A164",
     "assets/images/timeline/2022-library-bookshelves.jpg", narr=C5,
     crop="1600x900 native 16:9. Upscale 1.2x.",
     motion="Slow 4% push across the shelves.", trans="Dissolve 20f",
     osd="2022 · ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯ", music="Melody returns, warmer",
     note="NO PEOPLE. Full shelves, floor to ceiling. The cleanest asset in the library.")
shot("ಸಿ · ಒಂದು ದಶಕದ ಹಾದಿ", "K19", "PHOTO", "A168",
     "assets/images/timeline/2022-students-in-school-library.jpg", narr=C6,
     crop="1600x900 native 16:9. Upscale 1.2x.",
     motion="Static.", trans="Cross-dissolve 16f",
     note="Students choosing books, almost all seen from behind. Consent-light by composition. Replaces the 2022 donation poster A166, which is REJECTED - see deliverable 06 rejects.")
shot("ಸಿ · ಒಂದು ದಶಕದ ಹಾದಿ", "K20", "PHOTO", "A176",
     "assets/images/timeline/2023-students-in-tribal-school-hall.jpg", narr=C7,
     crop="1600x1200. 16:9 window y 180-1080. Upscale 1.2x.",
     motion="Static. Under 4s, no push.", trans="Cut", osd="2023 · ಮೈಸೂರು · ಎಚ್.ಡಿ. ಕೋಟೆ",
     note="Thatched-roof hall, tribal school. CONSENT [C].")
shot("ಸಿ · ಒಂದು ದಶಕದ ಹಾದಿ", "K21", "PHOTO", "A172",
     "assets/images/timeline/2023-school-event-backdrop-photo.jpg", narr=C8,
     crop="1280x960. 16:9 window y 120-840. Upscale 1.5x.",
     motion="Slow push toward the chart.", trans="Dissolve 20f",
     osd="9 ಮತ್ತು 10ನೇ ತರಗತಿಗೆ ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ",
     note="REPLACES A188 (2024-classroom-career-counselling-session.jpg), which is rejected on three grounds. This frame shows LPET's own printed 'Academics and Career Guidance Chart' with four volunteers beside it. NO CHILDREN IN FRAME. Adults are volunteers; clear under 14 item 3.7.")
shot("ಸಿ · ಒಂದು ದಶಕದ ಹಾದಿ", "K22", "PHOTO", "A180",
     "assets/images/timeline/2024-car-trunk-filled-with-books-and-supplies.jpg", narr=C9,
     crop="1446x1920 portrait. 16:9 window on the stacked notebooks, y 620-1433. Upscale 1.33x.",
     motion="Static 2s, then 3% push.", trans="Cut",
     osd="2024 · ಎಂ.ಎಂ. ಹಿಲ್ಸ್ · 200 ಶಾಲಾ ಚೀಲ", music="Music builds, restrained",
     note="NO PEOPLE. A car boot packed with notebooks: the least sentimental and most truthful image of how this work actually travels. NUM-04. If the trustees confirm ಮಲೆ ಮಹದೇಶ್ವರ ಬೆಟ್ಟ, change the card here (7.6 in 14).")
shot("ಸಿ · ಒಂದು ದಶಕದ ಹಾದಿ", "K23", "PHOTO", "A220",
     "assets/images/timeline/2025-children-with-volunteers-under-tree.jpg", narr=C10, hold=2.5,
     crop="1920x1446 native. 16:9 window y 180-1260. NO UPSCALE.",
     motion="Static through the line, then a 3% push toward the tree across the 2.5s hold that follows it.", trans="Dissolve 20f",
     osd="2025 · ಎಚ್.ಡಿ. ಕೋಟೆ · 300 ಶಾಲಾ ಚೀಲ", music="Music peaks here, then holds",
     note="The best single group photograph in the library, and one of only five true 1920px assets. NUM-05. CONSENT [C].")

# ---------------------------------------------------------------- D
D1 = "ಇದೆಲ್ಲ ಕಚೇರಿಯಲ್ಲಿ ಕುಳಿತು ಆಗುವ ಕೆಲಸವಲ್ಲ."
D2 = "ಮುಖ್ಯೋಪಾಧ್ಯಾಯರೋ, ನೆರೆಹೊರೆಯವರೋ, ಊರಿನ ಹಿತೈಷಿಯೋ ಒಂದು ಹೆಸರು ಸೂಚಿಸುತ್ತಾರೆ."
D3 = "ತಂಡ ಆ ಊರಿಗೆ ಹೋಗುತ್ತದೆ. ಮಕ್ಕಳನ್ನೂ ಪೋಷಕರನ್ನೂ ಒಂದೆಡೆ ಸೇರಿಸಿ, ಪ್ರತಿ ಕುಟುಂಬದ ಜೊತೆ ಕೂತು ಮಾತನಾಡುತ್ತದೆ."
D4 = "ನಂತರ ಟ್ರಸ್ಟ್ ಶಾಲಾ ಶುಲ್ಕದ ಶೇಕಡ ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು ಭರಿಸುತ್ತದೆ. ಪೂರ್ತಿ ಅಲ್ಲ."
D5 = "ಉಳಿದ ಪಾಲನ್ನು ಕುಟುಂಬವೇ ಕಟ್ಟುತ್ತದೆ. ಏಕೆಂದರೆ ತಾವೂ ಒಂದು ಪಾಲು ಹೊತ್ತ ಪೋಷಕರು ಮಗುವಿನ ಓದಿನ ಒಳಗೇ ಉಳಿಯುತ್ತಾರೆ."
D6 = "ಮತ್ತು ಆ ಹಣ ನೇರವಾಗಿ ಶಾಲೆಗೇ ಸಲ್ಲುತ್ತದೆ. ಬೇರೆ ಯಾರ ಕೈಗೂ ಅಲ್ಲ."
D7 = "ಬುಡಕಟ್ಟು ಶಾಲೆಗಳ ಮಕ್ಕಳ ಜೊತೆ ತಂಡ ಕೆಲವು ದಿನ ಉಳಿಯುತ್ತದೆ. ಕಲಿಸುತ್ತದೆ, ಕಲಿಯುತ್ತದೆ. ಆಮೇಲೆ ಚೀಲಗಳು ಮಕ್ಕಳ ಕೈ ಸೇರುತ್ತವೆ."

shot("ಡಿ · ಕೆಲಸದ ಕ್ರಮ", "K24", "PHOTO", "A236",
     "assets/images/timeline/2025-school-front-group-photo.jpg", narr=D1,
     crop="1600x1200. 16:9 window y 200-1100. Upscale 1.2x.",
     motion="Static.", trans="Cut", music="Music thins to a single line",
     note="A school forecourt, dust, trees, the whole group at a distance. Faces are small at this width, which is the point of using it under this line. CONSENT [C].")
shot("ಡಿ · ಕೆಲಸದ ಕ್ರಮ", "K25", "PHOTO", "A228",
     "assets/images/timeline/2025-government-primary-school-sign.jpg", narr=D2,
     crop="Second, TIGHTER window than K01: x 60-960, y 180-686, upscale 2.1x to fill 1920x1080. Only the board.",
     motion="Static. HOLD 1s LONGER THAN THE ENGLISH CUT.", trans="Dissolve 20f",
     note="KANNADA-SPECIFIC, difference 5. Deliberate re-use of K01 at a different focal length, in a different act, 3 minutes later: a documentary rhyme, not a duplicate cut. If the QC editor objects, substitute the ಮಂಟಿಹಾಡಿ board from A226. Verify the 2.1x upscale on the projector; large flat lettering carries it, small lettering will not.")
shot("ಡಿ · ಕೆಲಸದ ಕ್ರಮ", "K26", "PHOTO", "A025-crop",
     "assets/images/children-stories/scholarship-interview-with-girl-and-guardian.jpeg", narr=D3, pause=1.0,
     crop="1280x960. HANDS-AND-FORM CROP ONLY: window x 200-1080, y 560-1055, upscale 2.2x. Excludes every face.",
     motion="Static.", trans="Cut",
     osd="ಗುರುತಿಸುವುದು · ಪರಿಶೀಲಿಸುವುದು · ಒಳಗೊಳ್ಳುವುದು · ಬೆಳೆಸುವುದು",
     note="CONSENT-DRIVEN CROP. The full frame is a private conversation about a family's finances (14 item 2.10) and must not be shown. Cropped to the desk, the hands, the form and the pen, it becomes the best available illustration of ಪರಿಶೀಲಿಸುವುದು with nobody identifiable. Four-word card animates one word per 1.5s (not 1.0s: the Kannada words are longer). If the 2.2x upscale is unacceptable, replace with a navy four-step card and no photograph.")
shot("ಡಿ · ಕೆಲಸದ ಕ್ರಮ", "K27", "CARD", "GFX-05", "75 per cent card", narr=D4, pause=2.0,
     osd="ಶಾಲಾ ಶುಲ್ಕದ ಶೇಕಡ 75ರವರೆಗೆ  //  ನೇರವಾಗಿ ಶಾಲೆಗೆ",
     motion="Numeral 75 in Playfair Display 900, gold #c9903e, 220px. Supporting Kannada line Noto Sans Kannada 600 at 56px, #e0b06a. Gold rule draws under.",
     trans="Hard cut to card", music="MUSIC OUT COMPLETELY under 'ಪೂರ್ತಿ ಅಲ್ಲ.' Drone alone returns on the pause.",
     note="NUM-07. The quietest frame in the film. No photograph, no push, no swell. Card layout is shared with the English cut; only the text layer swaps.")
shot("ಡಿ · ಕೆಲಸದ ಕ್ರಮ", "K28", "PHOTO", "A222",
     "assets/images/timeline/2025-classroom-full-of-beneficiary-families.jpg", narr=D5,
     crop="1600x900 native 16:9. Upscale 1.2x.",
     motion="Static.", trans="Dissolve 20f", music="Drone only",
     note="Parents and children together in a hall. The right image for the line about the family carrying its share, because the parents are visibly present. CONSENT [C], adults included, 14 item 3.7.")
shot("ಡಿ · ಕೆಲಸದ ಕ್ರಮ", "K29", "CARD", "GFX-06", "Direct-to-school card", narr=D6,
     osd="ನೇರವಾಗಿ ಶಾಲೆಗೆ. ಬೇರೆ ಯಾರ ಕೈಗೂ ಅಲ್ಲ.",
     motion="Single line, cream ground, navy text, gold rule above.", trans="Cut",
     music="Bansuri returns softly", note="MIS-04, PRC-04. The anti-leakage principle is the Trust's strongest claim on a donor's trust; give it its own frame.")
shot("ಡಿ · ಕೆಲಸದ ಕ್ರಮ", "K30", "PHOTO", "A252",
     "assets/images/timeline/2025-volunteer-tying-shoe-for-child.jpg", narr=D7,
     crop="1280x720 native 16:9. Upscale 1.5x.",
     motion="Static.", trans="Dissolve 16f",
     note="A volunteer crouched down, helping one boy with something in his hands. Small, undramatic, nobody performing for the camera. Exactly the register 07 asks for. Note the filename says 'tying shoe'; the frame is a volunteer helping with a kit. Do not caption it. CONSENT [C].")

# ---------------------------------------------------------------- E
E1 = "ವಿದ್ಯಾರ್ಥಿವೇತನ ಒಂದರಿಂದಲೇ ಶಿಕ್ಷಣ ಪೂರ್ಣವಾಗುವುದಿಲ್ಲ."
E2 = "ಹಾಗಾಗಿ ಶಾಲಾ ಚೀಲ, ನೋಟ್‌ಬುಕ್, ಲೇಖನ ಸಾಮಗ್ರಿ, ಚಿತ್ರಕಲೆಯ ಪರಿಕರ."
E3 = "ಗ್ರಂಥಾಲಯಗಳು. ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ. ಆಟಗಳು. ಮಕ್ಕಳು ಹಾಡಿ ಕುಣಿಯುವ ವೇದಿಕೆ, ಮತ್ತು ಅದನ್ನು ನೋಡಲೆಂದೇ ಬಂದ ಜನ."
E4 = "ಮಕ್ಕಳಿಗೆ ಮಾತ್ರವಲ್ಲ, ಪೋಷಕರಿಗೂ ಮಾರ್ಗದರ್ಶನ."
E5 = "ತಲುಪುವುದೇ ಕಷ್ಟವಾದ ಮಕ್ಕಳನ್ನೂ ಈ ಕೆಲಸ ತಲುಪಿದೆ. ಏಕ ಪೋಷಕರ ಮಕ್ಕಳು. ಎಚ್‌ಐವಿ ಇರುವ ಕುಟುಂಬಗಳ ಮಕ್ಕಳು. ದೀರ್ಘಕಾಲದ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ ಇರುವ ಮಕ್ಕಳು."
E6 = "ಈ ಕೆಲಸ ಬೆಳಕು ಟ್ರಸ್ಟ್, ಸೌಖ್ಯ ಸಮೃದ್ಧಿ ಸಂಸ್ಥೆ, ಜಿಲ್ಲಾ ಆರೋಗ್ಯ ಇಲಾಖೆ ಮತ್ತು ನಿಸರ್ಗ ಫೌಂಡೇಶನ್ ಜೊತೆಗೂಡಿ ನಡೆದಿದೆ."

shot("ಇ · ಸುತ್ತಲಿನ ಬೆಂಬಲ", "K31", "PHOTO", "A244",
     "assets/images/timeline/2025-stationery-and-snacks-arranged.jpg", narr=E1+" "+E2,
     crop="513x911, the smallest asset in the cut. DO NOT FILL FRAME. Place at native 513px inside a cream card, 27% width, left third, with the Kannada programme labels stacked right.",
     motion="Static.", trans="Cut", osd="ಶಾಲಾ ಸಾಮಗ್ರಿ ವಿತರಣೆ",
     music="Tempo lifts slightly",
     note="Pens, geometry boxes, small stationery laid out on a floor. NO FACES, NO BRANDS. Chosen over A200 (2024-school-supply-kit-on-floor.jpg) and A202 (2024-snack-packets-for-distribution.jpg), both REJECTED for prominent commercial packaging.")
shot("ಇ · ಸುತ್ತಲಿನ ಬೆಂಬಲ", "K32", "PHOTOCARD", "A078",
     "assets/images/magazine-gallery/kids-craft.jpeg", narr=E3,
     crop="720x1560 portrait. Place at native 720px, 37% width, on cream, with labels stacked beside.",
     motion="Static.", trans="Cross-dissolve 16f",
     osd="ಕಲಿಕೆಯ ಆಟಗಳು · ನಾಡು ನುಡಿಯ ಪರಿಚಯ · ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯ",
     note="Children making paper craft on a classroom floor. LABELS RUN 3s EACH, not 2s, per the Kannada dwell rule. CONSENT [C].")
shot("ಇ · ಸುತ್ತಲಿನ ಬೆಂಬಲ", "K33", "PHOTO", "A232",
     "assets/images/timeline/2025-large-community-celebration-group-photo.jpg", narr=E4,
     crop="1600x1200. 16:9 window y 150-1050. Upscale 1.2x.",
     motion="Static.", trans="Dissolve 20f", osd="ಪೋಷಕರಿಗೆ ಮಾರ್ಗದರ್ಶನ",
     note="A hall with a stage, children and parents together. Carries PRG-08 and PRG-09 in one frame. CONSENT [C].")
shot("ಇ · ಸುತ್ತಲಿನ ಬೆಂಬಲ", "K34", "CARD", "GFX-07", "Hardest to reach card", narr=E5, pause=1.0,
     osd="(no list on screen under this line)",
     motion="Navy. Type only. A single gold rule. Nothing enters, nothing moves.",
     trans="Hard cut to card", music="Restrained, drone and a single held bansuri note",
     note="ABSOLUTE RULE, 14 item 2.4. Single-parent status, HIV in the family and chronic illness are spoken here. NO PHOTOGRAPH, NO FACE, NO ILLUSTRATION OF A CHILD may appear anywhere in this shot. The card carries no text beyond a gold rule while the line is spoken; the partner list arrives in K35, after the sentence has ended. Trustees choose between ಎಚ್‌ಐವಿ ಇರುವ (used here, Version B wording) and ಎಚ್‌ಐವಿ ಪೀಡಿತ (Version A wording); 09 section 3.5.")
shot("ಇ · ಸುತ್ತಲಿನ ಬೆಂಬಲ", "K35", "CARD", "GFX-08", "Partners card", narr=E6,
     osd="ಸಹಭಾಗಿತ್ವದಲ್ಲಿ  //  ನಿಸರ್ಗ ಫೌಂಡೇಶನ್  //  ಬೆಳಕು ಟ್ರಸ್ಟ್, ಬಂಗಾರಪೇಟೆ  //  ಸೌಖ್ಯ ಸಮೃದ್ಧಿ ಸಂಸ್ಥೆ, ಕೋಲಾರ  //  ಜಿಲ್ಲಾ ಆರೋಗ್ಯ ಮತ್ತು ಕುಟುಂಬ ಕಲ್ಯಾಣ ಇಲಾಖೆ, ಕೋಲಾರ",
     motion="Four names, each entering 0.9s apart, left-aligned, gold rule above.",
     trans="Cut", music="Warmer",
     note="1s LONGER THAN THE ENGLISH CARD to fit four Kannada names legibly at 48px. NO LOGOS until 14 item 4.2 is signed. NO GOVERNMENT EMBLEM until 4.3 is signed. Photographic corroboration for all four exists in A188 and A230 but neither frame may be screened; see deliverable 07.")

# ---------------------------------------------------------------- F
F1 = "2024ರ ಜೂನ್‌ನಲ್ಲಿ ಒಂದು ಕನ್ನಡ ದಿನಪತ್ರಿಕೆ ಮುಳಬಾಗಿಲಿನ ಚಿತ್ರವನ್ನು ಪ್ರಕಟಿಸಿತು. ಏಕ ಪೋಷಕರ ಮಕ್ಕಳಿಗೆ ವಿದ್ಯಾರ್ಥಿವೇತನ ವಿತರಣೆ."
F2 = "2025ರ ಡಿಸೆಂಬರ್‌ನಲ್ಲಿ, ನವದೆಹಲಿಯ ರಾಷ್ಟ್ರೀಯ ಶೃಂಗಸಭೆಯಲ್ಲಿ, ಸಂಸ್ಥಾಪಕರಿಗೆ ಭಾರತ್ ಶಿಕ್ಷಾ ರತ್ನ ಪ್ರಶಸ್ತಿ ಸಂದಿತು."
F3 = "ಆದರೆ ಮುಖ್ಯವಾದ ದಾಖಲೆ ಪ್ರಶಸ್ತಿ ಪತ್ರದಲ್ಲಿ ಇಲ್ಲ."
F4 = "ಅದು ಒಂದು ಹೆಸರುಗಳ ಪಟ್ಟಿಯಲ್ಲಿದೆ. ಬೆಂಗಳೂರು, ಚೆನ್ನೈ, ಅಮೆರಿಕ, ಬ್ರಿಟನ್, ಜರ್ಮನಿ, ಡೆನ್ಮಾರ್ಕ್, ದುಬೈನಲ್ಲಿದ್ದು ನೆರವು ನೀಡಿದವರು."
F5 = "ವಕೀಲರು, ಎಂಜಿನಿಯರ್‌ಗಳು, ವೈದ್ಯರು, ಗೃಹಿಣಿಯರು ಆಗಿರುವ ಸ್ವಯಂಸೇವಕರು."
F6 = "ಒಂದು ಮಗುವಿಗಾಗಿ ಫೋನ್ ಮಾಡಿದ ಶಿಕ್ಷಕರು."
F7 = "ಮತ್ತು ತಮ್ಮ ಪಾಲನ್ನು ತಪ್ಪದೇ ಕಟ್ಟಿದ ಪೋಷಕರು."

shot("ಎಫ್ · ಗುರುತಿಸುವಿಕೆ ಮತ್ತು ಕೃತಜ್ಞತೆ", "K36", "PHOTOCARD", "A196",
     "assets/images/timeline/2024-newspaper-coverage-clipping.jpg", narr=F1, pause=1.0,
     crop="513x733, the second-lowest-resolution asset in the cut. Crop OFF the burned-in epaper URL strip at the foot. Place the remaining ~513x660 at native size on navy, 27% width, then push to 40% over the shot. NEVER full frame.",
     motion="Slow 5% push toward the headline and the caption, the only two legible text blocks. DO NOT push into the body text; it is unreadable at this resolution and pushing into it advertises the fact.",
     trans="Dissolve 20f", osd="ಉದಯವಾಣಿ · 19 ಜೂನ್ 2024",
     music="Music holds, no swell",
     note="KANNADA-SPECIFIC, difference 6, AND THE FILM'S ONLY INDEPENDENT VERIFICATION. Held 2s longer than in the English cut because in Kannada this is a document the audience reads, not a texture. Verified legible on inspection: headline ಪಾಲನೆಗೆ ಏಕ ಪೋಷಕರ ನಿರಾಸಕ್ತಿ ಸಲ್ಲ and the caption naming ಮುಳಬಾಗಿಲು ಮುತ್ತಲಪೇಟೆ, ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ and ಬೆಳಕು ಟ್ರಸ್ಟ್. BLOCKING: Udayavani permission, 14 item 4.1. Request the high-resolution page from epaper.udayavani.com/c/75279105; the repository copy will soften badly on a 4-metre screen.")
shot("ಎಫ್ · ಗುರುತಿಸುವಿಕೆ ಮತ್ತು ಕೃತಜ್ಞತೆ", "K37", "PHOTOCARD", "A002",
     "assets/images/awards/bharat-shiksha-ratan-award-certificate-scan.jpeg", narr=F2, pause=2.0,
     crop="1370x900. The scan shows an open folder with TWO documents. Crop to the RIGHT-HAND certificate only: window x 700-1370, y 40-870, then place at 830px tall on navy, right of frame.",
     motion="Static. No push on a document.", trans="Cut",
     osd="ಭಾರತ್ ಶಿಕ್ಷಾ ರತ್ನ ಪ್ರಶಸ್ತಿ · 19 ಡಿಸೆಂಬರ್ 2025 · ನವದೆಹಲಿ  //  ಎಕನಾಮಿಕ್ ಅಂಡ್ ಸೋಶಿಯಲ್ ಡೆವಲಪ್‌ಮೆಂಟ್ ಫೌಂಡೇಶನ್",
     music="One gentle lift, then settle",
     note="Use A002 (1370x900), NOT A004 (framed version, 705x956), per 05 section 3.2. Certificate is in English; the Kannada card stays in the lower third throughout. NO MINISTER NAMES. NO 'one of 25'. 06 Q3, 14 item 6.3. The 2s pause after this line is the film's turn from recognition to gratitude; hold the certificate through it.")
shot("ಎಫ್ · ಗುರುತಿಸುವಿಕೆ ಮತ್ತು ಕೃತಜ್ಞತೆ", "K38", "PHOTO", "A250",
     "assets/images/timeline/2025-volunteer-group-at-school-garden.jpg", narr=F3+" "+F4,
     crop="941x529, sub-HD. Upscale 2.04x to 1920x1080 OR place at native inside a cream card. Editor's call on the projector; prefer the card.",
     motion="Static.", trans="Dissolve 20f", osd="ನೆರವು ನೀಡಿದವರಿಗೆ",
     music="Piano or nylon guitar enters here for the first time",
     note="Volunteers standing together in a school garden. The inventory marks A250 'N/A - no identifiable person'; that is WRONG, roughly thirteen adults and several children are identifiable. Corrected in deliverable 07. This is the gratitude section's opening frame precisely because it shows the helpers, not the helped.")
shot("ಎಫ್ · ಗುರುತಿಸುವಿಕೆ ಮತ್ತು ಕೃತಜ್ಞತೆ", "K39", "PHOTO", "A230",
     "assets/images/timeline/2025-hall-full-of-volunteers-and-children.jpg", narr=F5+" "+F6,
     crop="1600x900 native 16:9. Upscale 1.2x. MUST CROP OUT the banner along the top edge: window y 150-1050 removes it.",
     motion="Static.", trans="Cross-dissolve 20f",
     osd="ಸ್ವಯಂಸೇವಕರಿಗೆ  //  ವಕೀಲರು · ಎಂಜಿನಿಯರ್‌ಗಳು · ವೈದ್ಯರು · ಗೃಹಿಣಿಯರು",
     note="CROP IS MANDATORY. The uncropped banner names L. H. INTERNATIONAL SCHOOL, Mulbagal, a third party with no permission on file (14 item 2.2). Cropped, the frame is a hall full of volunteers and families, which is what the line is about. The banner is however valuable EVIDENCE: it reads ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ + ಬೆಳಕು ಟ್ರಸ್ಟ್ (ರಿ), ತಂಬ್ರಹಳ್ಳಿ, ಬಂಗಾರಪೇಟೆ and ಮಕ್ಕಳ ವಿದ್ಯಾರ್ಥಿವೇತನ ವಿತರಣಾ ಕಾರ್ಯಕ್ರಮ, independently confirming PTR-02 and the glossary's choice of ವಿದ್ಯಾರ್ಥಿವೇತನ. Logged in deliverable 07.")
shot("ಎಫ್ · ಗುರುತಿಸುವಿಕೆ ಮತ್ತು ಕೃತಜ್ಞತೆ", "K40", "PHOTO", "A238",
     "assets/images/timeline/2025-schoolchildren-showing-school-bags-on-veranda.jpg", narr=F7,
     crop="1600x1200. 16:9 window y 190-1090. Upscale 1.2x.",
     motion="Static.", trans="Dissolve 20f", osd="ಪೋಷಕರಿಗೆ  //  ತಮ್ಮ ಪಾಲಿನ ಶುಲ್ಕವನ್ನು ತಪ್ಪದೇ ಹೊಂದಿಸಿದವರು",
     note="Chosen over the near-identical magazine-gallery twin per 05 section 2.3, because the 2025- prefix carries the year attribution. CONSENT [C].")

# ---------------------------------------------------------------- G
G1 = "ಈ ವರ್ಷ, ತನ್ನ ಆರೈಕೆಯಲ್ಲಿರುವ ಎಲ್ಲ ಮಕ್ಕಳನ್ನೂ ಬೆಂಗಳೂರಿಗೆ ಕರೆತರಬೇಕೆಂಬುದು ಟ್ರಸ್ಟ್‌ನ ಆಸೆ. ಒಂದು ಕಾರ್ಯಕ್ರಮ, ಒಂದು ದಿನದ ಸುತ್ತಾಟ, ಮನೆಗೆ ಒಯ್ಯಲು ಒಂದು ಉಡುಗೊರೆ."
G2 = "ಅವರಲ್ಲಿ ಹಲವರಿಗೆ ಇದು ಈ ನಗರವನ್ನು ನೋಡುವ ಮೊದಲ ಬಾರಿ. ಕೆಲವರಿಗೆ ತಮ್ಮ ಊರು ಬಿಟ್ಟು ಹೊರಡುವ ಮೊದಲ ಬಾರಿ."
G3 = "ಮುಂದಿನ ಹತ್ತು ವರ್ಷವೂ ಹೀಗೇ. ಇನ್ನಷ್ಟು ಜಿಲ್ಲೆಗಳು. ಇನ್ನಷ್ಟು ಗ್ರಂಥಾಲಯಗಳು. ಓದು ನಿಲ್ಲದ ಇನ್ನಷ್ಟು ಮಕ್ಕಳು."

shot("ಜಿ · ಮುಂದಿನ ದಾರಿ", "K41", "PHOTO", "A216",
     "assets/images/timeline/2025-children-showing-school-bags-outdoors.jpg", narr=G1,
     crop="1280x720 native 16:9. Upscale 1.5x.",
     motion="3% push.", trans="Cut", music="Music opens up, piano and bansuri together",
     note="EVT-03. CONSENT [C].")
shot("ಜಿ · ಮುಂದಿನ ದಾರಿ", "K42", "PHOTO", "A186",
     "assets/images/timeline/2024-children-with-supplies-outdoors.jpg", narr=G2, pause=1.0,
     crop="1920x1446 native. 16:9 window y 200-1280. NO UPSCALE.",
     motion="Static 2s, then 3% push.", trans="Dissolve 20f",
     note="A true 1920px asset. A hillside village behind the children, which is the right backdrop for a line about never having left home. CONSENT [C].")
shot("ಜಿ · ಮುಂದಿನ ದಾರಿ", "K43", "PHOTO", "A240b",
     "assets/images/timeline/2025-schoolwide-supplies-group-photo.jpg", narr=G3,
     crop="Second, WIDER window than K02: full 1618x911 frame including the Kannada school board, upscale 1.19x.",
     motion="Slow pull back, 4%, ending on the widest framing in the film.",
     trans="Cross-dissolve 20f", music="Music lifts but does not climax",
     note="Deliberate return to the K02 location at the film's forward-looking beat: the same school, the same board, at the end of the decade rather than the start. FORWARD COMMITMENT: this narration is a public promise and needs trustee approval before record. [ಟ್ರಸ್ಟಿ ದೃಢೀಕರಣ ಅಗತ್ಯ], 14 item 6.9.")

# ---------------------------------------------------------------- H
H1 = "ಹತ್ತು ವರ್ಷ. ಒಂದೊಂದೇ ಮಗು. ಸದ್ದಿಲ್ಲದೆ ಉಳಿಸಿಕೊಂಡ ಒಂದು ಮಾತು."
H2 = "ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್‌ನ ಹತ್ತನೇ ವರ್ಷದ ಸಂಭ್ರಮಕ್ಕೆ ನಿಮಗೆಲ್ಲರಿಗೂ ಆತ್ಮೀಯ ಸ್ವಾಗತ."

shot("ಎಚ್ · ಸ್ವಾಗತ ಮತ್ತು ಸಮಾರೋಪ", "K44", "PHOTO", "A224",
     "assets/images/timeline/2025-classroom-full-of-children-with-supplies.jpg", narr=H1, pause=1.0,
     crop="1920x1446 native. 16:9 window y 180-1260. NO UPSCALE.",
     motion="Static 2s, then a 3% push. No text over this frame.",
     trans="Dissolve 24f", music="Music resolves, unhurried",
     note="A yellow classroom, dozens of children with their bags. Reads as scale without stating a number, which is the whole solution to the unresolved impact figures. CONSENT [C].")
shot("ಎಚ್ · ಸ್ವಾಗತ ಮತ್ತು ಸಮಾರೋಪ", "K45", "PHOTO", "A224b",
     "assets/images/timeline/2025-classroom-full-of-children-with-supplies.jpg", narr=H2,
     crop="Continuous with K44. Same frame, the push simply continues. NOT a new cut.",
     motion="Push continues to 6% total. NO ONSCREEN TEXT.", trans="(no cut)",
     music="Music holds under, then begins to thin",
     note="THE PAYOFF LINE. Do not cut away from faces while the welcome is spoken. Listed as a separate row only because the subtitle cue changes; in the timeline it is one continuous 20.3s shot with K44.")
shot("ಎಚ್ · ಸಮಾರೋಪ", "K46", "CARD", "GFX-09", "End card", hold=7.0,
     osd="ಪ್ರತಿ ಮಗುವಿನ ಮೇಲೆ ನಂಬಿಕೆ ಇಟ್ಟ ಒಂದು ದಶಕ  //  ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ · 2016 ರಿಂದ 2026  //  ಒಂದು ಮಗುವಿನ ಹೆಸರು ಸೂಚಿಸಿ · ಸ್ವಯಂಸೇವಕರಾಗಿ · ಸಹಭಾಗಿಯಾಗಿ  //  journey.lawparkeducationaltrust.org  //  lawparktrust@gmail.com · +91 99456 65379",
     motion="Headline fades up, gold rule draws, then the three calls to action and the contact block. Nothing after 4.0s.",
     trans="Dissolve 24f, fade to black over the last 12f", music="Fade to silence",
     note="1s LONGER THAN THE ENGLISH END CARD so the Kannada headline can be read. NO UPI ID. NO PAYMENT QR CODE. ORG-11 is verified but must never be on screen. Primary CTA is ಒಂದು ಮಗುವಿನ ಹೆಸರು ಸೂಚಿಸಿ, per 12 section 11.")


# ---------------------------------------------------------------- consent register
# Per-shot consent assessment made by opening every image, not copied from
# 04-media-inventory.csv. Where the two disagree, deliverable 07 Part 2 records it.
CONSENT = {
    "A228": [
        "CLEAR - no identifiable person in the 16:9 window",
        "School permission still required for the signboard and the school's name: 14 item 2.2."
    ],
    "A240": [
        "[C] BLOCKING - approx 60 identifiable children and adults",
        ""
    ],
    "A206": [
        "[C] BLOCKING - two children in close-up, fully identifiable",
        "Highest-priority release in the film: it is the opening emotional beat."
    ],
    "A226": [
        "CLEAR after crop - the one adult at bottom-left is cropped out",
        "School permission for the signboard: 14 item 2.2."
    ],
    "A059": [
        "TRUSTEE LIKENESS - founder approval",
        ""
    ],
    "A082": [
        "TRUSTEE LIKENESS - trustee approval",
        ""
    ],
    "A234": [
        "CLEAR - no person in frame",
        "INVENTORY CORRECTION: A234 is flagged 'likely shows minors'. It does not. School permission still applies."
    ],
    "A061": [
        "[C] BLOCKING - children seated with backs to camera, plus the founder",
        "Backs of heads are far lower risk, but the school and the visit still need permission."
    ],
    "A254": [
        "[C] BLOCKING - approx 25 identifiable children at a meal",
        ""
    ],
    "A144": [
        "[C] BLOCKING - approx 14 identifiable children and adults",
        ""
    ],
    "A150": [
        "[C] BLOCKING - adults identifiable, children in foreground from behind",
        ""
    ],
    "A160": [
        "[C] BLOCKING - large crowd, many identifiable",
        "INVENTORY CORRECTION: A160 is flagged 'N/A - no identifiable person'. The frame is full of identifiable faces."
    ],
    "A158": [
        "CLEAR - LPET's own poster artwork, no person",
        "Confirm the poster was not built from licensed stock: 14 item 4.10."
    ],
    "A164": [
        "CLEAR - no person in frame",
        ""
    ],
    "A168": [
        "[C] - students browsing, almost all from behind",
        "Lower risk by composition. Still request release."
    ],
    "A176": [
        "[C] BLOCKING - approx 30 identifiable children",
        ""
    ],
    "A172": [
        "ADULTS ONLY - four volunteers, no children",
        "Volunteer consent under 14 item 3.7."
    ],
    "A180": [
        "CLEAR - no person in frame",
        ""
    ],
    "A220": [
        "[C] BLOCKING - approx 20 identifiable children and adults",
        ""
    ],
    "A236": [
        "[C] BLOCKING - large group, faces small but identifiable",
        ""
    ],
    "A025-crop": [
        "CLEAR after crop - the hands-and-form window excludes every face",
        "THE FULL FRAME MUST NEVER BE SCREENED: it is a private conversation about a family's finances. 14 item 2.10."
    ],
    "A222": [
        "[C] BLOCKING - families, adults and children identifiable",
        ""
    ],
    "A252": [
        "[C] BLOCKING - one volunteer and one child, both identifiable",
        ""
    ],
    "A244": [
        "CLEAR - no person, no brand in frame",
        ""
    ],
    "A078": [
        "[C] BLOCKING - approx 8 identifiable children",
        ""
    ],
    "A232": [
        "[C] BLOCKING - large hall, many identifiable",
        ""
    ],
    "A196": [
        "THIRD-PARTY COPYRIGHT - BLOCKING",
        "Udayavani permission required: 14 item 4.1. The clipping's own photograph also shows approx 25 identifiable children, already published by the newspaper. INVENTORY CORRECTION: A196 is flagged 'N/A - no identifiable person'."
    ],
    "A002": [
        "CLEAR - document only",
        "Economic and Social Development Foundation permission to reproduce the certificate and use the award name: 14 item 4.5."
    ],
    "A250": [
        "ADULTS AND SOME CHILDREN - identifiable",
        "INVENTORY CORRECTION: A250 is flagged 'N/A - no identifiable person'. Roughly thirteen adults and several children are identifiable."
    ],
    "A230": [
        "[C] BLOCKING after crop - approx 60 identifiable",
        "Crop removes the L. H. International School banner but not the people. Third-party school permission would also be needed if the banner were shown: 14 item 2.2."
    ],
    "A238": [
        "[C] BLOCKING - approx 30 identifiable children",
        ""
    ],
    "A216": [
        "[C] BLOCKING - approx 10 identifiable children",
        ""
    ],
    "A186": [
        "[C] BLOCKING - approx 15 identifiable children and adults",
        ""
    ],
    "A240b": [
        "[C] BLOCKING - as A240",
        ""
    ],
    "A224": [
        "[C] BLOCKING - approx 40 identifiable children",
        ""
    ],
    "A224b": [
        "[C] BLOCKING - as A224",
        ""
    ]
}
INVENTORY_SAYS = {
    "A228": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A240": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A206": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A226": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A059": "TRUSTEE LIKENESS - internal approval required",
    "A082": "TRUSTEE LIKENESS - internal approval required",
    "A234": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A061": "TRUSTEE LIKENESS - internal approval required",
    "A254": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A144": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A150": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A160": "N/A - no identifiable person",
    "A158": "N/A - no identifiable person",
    "A164": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A168": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A176": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A172": "N/A - no identifiable person",
    "A180": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A220": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A236": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A025-crop": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A222": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A252": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A244": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A078": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A232": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A196": "N/A - no identifiable person",
    "A002": "N/A - no identifiable person",
    "A250": "N/A - no identifiable person",
    "A230": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A238": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A216": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A186": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A240b": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A224": "CONSENT VERIFICATION REQUIRED - likely shows minors",
    "A224b": "CONSENT VERIFICATION REQUIRED - likely shows minors"
}

# ---------------------------------------------------------------- compute
def tc(sec_total):
    f = int(round(sec_total * FPS))
    return "%02d:%02d:%02d:%02d" % (f//(FPS*3600), f//(FPS*60) % 60, f//FPS % 60, f % FPS)

# --from-audio <durations.json>: use the MEASURED length of a real recorded read
# instead of the model. Eleven v3 has no speed control, so once a voice is cast
# the narration leads and the picture follows, which is what 10 section F asks
# for anyway. The cluster model is only a predictor for before that exists.
MEASURED = {}
if "--from-audio" in sys.argv:
    _p = sys.argv[sys.argv.index("--from-audio") + 1]
    MEASURED = {k: float(v) for k, v in json.load(open(_p, encoding="utf-8")).items()}
    sys.stderr.write("using measured durations for %d lines from %s\n" % (len(MEASURED), _p))

# Calibrate: the whole script at WPM sets the budget, clusters share it out.
_tot_words = sum(len(kwords(s["narr"])) for s in S)
_tot_clusters = sum(clusters(s["narr"]) for s in S)
SEC_PER_CLUSTER = (_tot_words / WPM * 60.0) / _tot_clusters

def speech(text, sid=None):
    if sid and sid in MEASURED:
        return MEASURED[sid]
    return clusters(text) * SEC_PER_CLUSTER

t = 0.0
for s in S:
    if s["kind"] == "CARD":
        s["consent"], s["consent_note"], s["inv"] = "n/a - graphics only", "", ""
    else:
        s["consent"], s["consent_note"] = CONSENT.get(s["asset"], ("[C] - review required", ""))
        s["inv"] = INVENTORY_SAYS.get(s["asset"], "not in inventory")
    s["speech"] = speech(s["narr"], s["sid"])
    s["words"] = len(kwords(s["narr"]))
    s["dur"] = s["speech"] + s["pause"] + s["hold"]
    s["tc_in"] = tc(t)
    s["t_in"] = t
    t += s["dur"]
    s["tc_out"] = tc(t)
    s["t_out"] = t

json.dump(S, open(sys.argv[1] if len(sys.argv) > 1 else "/dev/stdout", "w"),
          ensure_ascii=False, indent=1)
sys.stderr.write("shots=%d  words=%d  total=%.2fs  TC=%s\n" % (
    len(S), sum(s["words"] for s in S), t, tc(t)))
sys.stderr.write("narration speech=%.1fs pauses=%.1fs holds=%.1fs\n" % (
    sum(s["speech"] for s in S), sum(s["pause"] for s in S), sum(s["hold"] for s in S)))
