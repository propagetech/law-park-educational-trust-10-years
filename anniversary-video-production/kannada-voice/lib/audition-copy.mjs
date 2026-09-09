/**
 * The audition copy, verbatim from the voice brief.
 *
 * These two passages are the whole audition. The same text goes to every voice
 * and every take so the comparison is controlled: change it and previous
 * auditions stop being comparable.
 *
 * Years appear here as Arabic numerals exactly as the brief wrote them. They
 * are rewritten to Kannada number words by speakText() before the request, so
 * the audition tests the same year handling the film will use.
 */

import fs from "node:fs";
import { TIMELINE_JSON } from "./paths.mjs";

export const AUDITION_MAIN = {
  id: "main",
  label: "Brief sample, warmth and register",
  text: `ಶಿಕ್ಷಣವು ಒಂದು ಮಗುವಿನ ಹಕ್ಕು ಮಾತ್ರವಲ್ಲ.
ಅದು ಒಂದು ಕುಟುಂಬದ ನಾಳೆಯೂ ಹೌದು.

2016ರಲ್ಲಿ, ಚಿಕ್ಕಬಳ್ಳಾಪುರದ ಒಂದು ಶಾಲಾ ಭೇಟಿಯಿಂದ
ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್‌ನ ಪಯಣ ಆರಂಭವಾಯಿತು.

ಒಬ್ಬ ವಿದ್ಯಾರ್ಥಿಗೆ ಸ್ಕಾಲರ್‌ಶಿಪ್.
ಒಂದು ಸಣ್ಣ ಆರಂಭ.

ಆದರೆ,
ಮುಂದುವರಿದ ಒಂದು ಭರವಸೆ.`,
  listenFor: [
    "ಸ್ಕಾಲರ್‌ಶಿಪ್ keeps its zero-width non-joiner and does not become ಸ್ಕಾಲರಶಿಪ್",
    "ಚಿಕ್ಕಬಳ್ಳಾಪುರ keeps the doubled ಳ್ಳ",
    "2016 is spoken ಎರಡು ಸಾವಿರದ ಹದಿನಾರರಲ್ಲಿ, not English digits",
    "Law Park Educational Trust sounds like the English name inside a Kannada sentence",
    "ಒಂದು ಸಣ್ಣ ಆರಂಭ. reads as a full stop, not a list item",
  ],
};

export const AUDITION_STRESS = {
  id: "stress",
  label: "Pronunciation stress test, years places and programme terms",
  text: `2022ರಲ್ಲಿ ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯಗಳು ಆರಂಭವಾದವು.
2023ರಲ್ಲಿ ಮೈಸೂರು ಮತ್ತು ಹೆಚ್. ಡಿ. ಕೋಟೆಯಲ್ಲಿ
ಒಂಬತ್ತನೇ ಮತ್ತು ಹತ್ತನೇ ತರಗತಿಯ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ
ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ ನೀಡಲಾಯಿತು.

2024ರಲ್ಲಿ ಎಂ. ಎಂ. ಹಿಲ್ಸ್‌ನಲ್ಲಿ 200 ಶಾಲಾ ಚೀಲಗಳು.
2025ರಲ್ಲಿ ಹೆಚ್. ಡಿ. ಕೋಟೆಯಲ್ಲಿ 300 ಶಾಲಾ ಚೀಲಗಳು.`,
  listenFor: [
    "ಗ್ರಂಥಾಲಯಗಳು: the ಂಥಾ conjunct intact, not gran-tha-la-ya",
    "ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ: ವೃ is a vowel-r, and ರ್ಶ does not break into ra-sha",
    "ಹೆಚ್. ಡಿ. ಕೋಟೆ read as letters H D then ಕೋಟೆ, not as a word",
    "ಎಂ. ಎಂ. ಹಿಲ್ಸ್ keeps its non-joiner and the English Hills",
    "200 and 300 spoken as Kannada number words, not English digits",
    "ಒಂಬತ್ತನೇ and ಹತ್ತನೇ distinct from each other",
  ],
};

/**
 * The brief's two passages are the default, so an audition stays comparable
 * with any that came before. The film passage is opt-in via
 * `--passages main stress film`, and it is the one that actually predicts the
 * read.
 */
export const AUDITION_PASSAGES_BASE = [AUDITION_MAIN, AUDITION_STRESS];

/**
 * A third passage, built from the approved script instead of the brief.
 *
 * WHY THIS EXISTS
 * The brief's two passages test words the film never speaks. ಸ್ಕಾಲರ್‌ಶಿಪ್,
 * ಹೆಚ್. ಡಿ. ಕೋಟೆ, ಎಂ. ಎಂ. ಹಿಲ್ಸ್, ಉದಯವಾಣಿ and "Law Park Educational Trust"
 * appear nowhere in the 43 narrated lines: they are on-screen text and lower
 * thirds, not narration. Meanwhile the three words that actually decide a
 * Kannada voice on this film are missing from the brief's stress test
 * altogether:
 *
 *   K25  ಮುಖ್ಯೋಪಾಧ್ಯಾಯರೋ   the hardest word in the script
 *   K27  ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು  the film's turn, and an automatic-fail line
 *   K45  ಸಂಭ್ರಮ            the second-to-last word in the film
 *
 * K12 is included because it is the other automatic fail: three sentences and
 * three full stops that most voices read as a rising list.
 *
 * Auditioning the brief's passages alone can therefore pass a voice that then
 * fails on the real read. This passage is drawn live from timeline.json, so it
 * cannot drift from the approved script.
 */
export function filmPassage() {
  const sids = ["K12", "K25", "K27", "K45"];
  const tl = JSON.parse(
    fs.readFileSync(TIMELINE_JSON, "utf8"));
  const byId = new Map(tl.map((s) => [s.sid, s]));
  const missing = sids.filter((s) => !byId.get(s)?.narr?.trim());
  if (missing.length) {
    throw new Error(
      `film audition passage wants ${missing.join(" ")}, which carry no ` +
      `narration in timeline.json. The script changed: pick replacement lines ` +
      `that still exercise the hardest conjuncts.`);
  }
  return {
    id: "film",
    label: "The approved script's four decisive lines",
    text: sids.map((s) => byId.get(s).narr.trim()).join("\n\n"),
    sids,
    listenFor: [
      "K12 ಚಿಕ್ಕಬಳ್ಳಾಪುರ. ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. reads as three full " +
        "stops, not a rising list. AUTOMATIC FAIL if it lists",
      "K25 ಮುಖ್ಯೋಪಾಧ್ಯಾಯರೋ intact. The hardest word in the script",
      "K27 ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು does not stumble or split, and ಪೂರ್ತಿ ಅಲ್ಲ. stays " +
        "level and quiet. AUTOMATIC FAIL if it is emphasised",
      "K45 ಸಂಭ್ರಮ keeps the ಭ್ರ conjunct and does not become bha-ra",
      "ವಿದ್ಯಾರ್ಥಿವೇತನ keeps all six syllables and the ರ್ಥಿ conjunct",
    ],
  };
}

/** All selectable passages, the film one built on demand. */
export function allPassages() {
  return [...AUDITION_PASSAGES_BASE, filmPassage()];
}

// Back-compat for callers that want the brief's pair.
export const AUDITION_PASSAGES = AUDITION_PASSAGES_BASE;
