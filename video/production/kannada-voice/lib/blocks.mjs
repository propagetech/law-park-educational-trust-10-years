/**
 * Scene blocks for the final narration.
 *
 * The blocks are derived from timeline.json's own `sec` field, not from the
 * timecodes in the voice brief. The brief guesses a 5:00 film in six scenes;
 * the approved edit is 00:05:37:22 in eleven sections, three of which carry no
 * narration at all (the pre-roll, the founder's silent quote card, and the
 * outro). Deriving from the timeline means the blocks cannot drift out of
 * agreement with the picture.
 *
 * WHY EACH SCENE'S STABILITY IS A BAND AND NOT THE BRIEF'S FLOAT
 * The brief asks for stability 0.42 to 0.62 across the film. v3 offers three
 * points: creative 0.0, natural 0.5, robust 1.0. So the brief's intent has to
 * be mapped, not transcribed:
 *
 *   brief wants expressive and intimate  -> `natural`, NOT `creative`
 *   brief wants precise and trustworthy  -> `robust`
 *
 * Creative is documented as more expressive and prone to hallucination. On a
 * film about real named children, screened to their families, a hallucinated
 * syllable in a place name is not an acceptable trade for warmth. The 09
 * narration guide reaches the same conclusion independently. Take B in the
 * audition exists to test creative on the shortlisted voice so the choice is
 * evidence and not assumption.
 *
 * The brief's numbers are preserved as `intent` so the log records what was
 * asked for beside what was sent.
 */

import fs from "node:fs";
import { TIMELINE_JSON } from "./paths.mjs";

/**
 * timeline.json `sec` value -> block. Order here is film order.
 * `briefScene` names the scene in the voice brief this block belongs to.
 */
export const BLOCKS = [
  {
    id: "preroll",
    sec: "0 · ಆರಂಭಪೂರ್ವ",
    briefScene: "opening",
    label: "Pre-roll, silent",
    narrated: false,
    direction: "No narration. Bansuri enters under the school signboard.",
  },
  {
    id: "opening",
    sec: "ಎ · ಆರಂಭ",
    briefScene: "opening",
    label: "Opening",
    narrated: true,
    variants: true,
    stability: "natural",
    similarity_boost: 0.78,
    intent: { stability: 0.45, style: 0.18, speed: 0.92 },
    direction:
      "Intimate, visual, quiet, reflective. The voice is looking at these " +
      "children, not introducing them. K03 is the film's one moment of " +
      "undirected joy: let the laugh sit still and do not smile over it.",
  },
  {
    id: "founder-card",
    sec: "ಎ2 · ಸಂಸ್ಥಾಪಕರ ಮಾತು",
    briefScene: "origin",
    label: "Founder quote card, silent",
    narrated: false,
    direction:
      "Six seconds, no narration. The founder's own voice reading her quote " +
      "belongs here if it can be recorded. See 09 section 8 point 3.",
  },
  {
    id: "origin",
    sec: "ಬಿ · ಆರಂಭದ ದಿನಗಳು",
    briefScene: "origin",
    label: "Origin and early days",
    narrated: true,
    variants: true,
    stability: "natural",
    similarity_boost: 0.78,
    intent: { stability: 0.51, style: 0.13, speed: 0.93 },
    direction:
      "Humble, respectful, historically grounded. K12 is three sentences and " +
      "three full stops: ಚಿಕ್ಕಬಳ್ಳಾಪುರ. ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. " +
      "Read as a rising list, the voice is rejected regardless of total score.",
  },
  {
    id: "decade",
    sec: "ಸಿ · ಒಂದು ದಶಕದ ಹಾದಿ",
    briefScene: "timeline",
    label: "A decade of the work, year by year",
    narrated: true,
    variants: false,
    stability: "robust",
    similarity_boost: 0.75,
    intent: { stability: 0.56, style: 0.11, speed: 0.965 },
    direction:
      "Clear, forward-moving, measured energy. This block carries most of the " +
      "years, counts and place names in the film, so diction outranks warmth. " +
      "Robust rather than natural for exactly that reason.",
  },
  {
    id: "method",
    sec: "ಡಿ · ಕೆಲಸದ ಕ್ರಮ",
    briefScene: "method",
    label: "How the work is done, and the 75 percent line",
    narrated: true,
    variants: true,
    stability: "robust",
    similarity_boost: 0.75,
    intent: { stability: 0.585, style: 0.075, speed: 0.915 },
    direction:
      "Precise, trustworthy, calm. K27 is the film's turn: " +
      "ಎಪ್ಪತ್ತೈದರಷ್ಟನ್ನು ಭರಿಸುತ್ತದೆ. ಪೂರ್ತಿ ಅಲ್ಲ. The second sentence must be " +
      "level and quiet, never emphasised. Leave the silence around it in the " +
      "edit; do not ask the voice to perform the pause.",
  },
  {
    id: "community",
    sec: "ಇ · ಸುತ್ತಲಿನ ಬೆಂಬಲ",
    briefScene: "community",
    label: "The support around the work",
    narrated: true,
    variants: false,
    stability: "natural",
    similarity_boost: 0.78,
    intent: { stability: 0.485, style: 0.15, speed: 0.935 },
    direction:
      "Warmer and appreciative, never celebratory or commercial. K34 names " +
      "four groups of real children. Any tag or performance there turns them " +
      "into a device. Leave it plain.",
  },
  {
    id: "gratitude",
    sec: "ಎಫ್ · ಗುರುತಿಸುವಿಕೆ ಮತ್ತು ಕೃತಜ್ಞತೆ",
    briefScene: "community",
    label: "Recognition and gratitude",
    narrated: true,
    variants: true,
    stability: "natural",
    similarity_boost: 0.78,
    intent: { stability: 0.485, style: 0.15, speed: 0.935 },
    direction:
      "Appreciative and grounded. Award and publication names must be audible " +
      "and unhurried: ಭಾರತ್ ಶಿಕ್ಷಾ ರತ್ನ ಪ್ರಶಸ್ತಿ, ಉದಯವಾಣಿ.",
  },
  {
    id: "future",
    sec: "ಜಿ · ಮುಂದಿನ ದಾರಿ",
    briefScene: "closing",
    label: "The road ahead",
    narrated: true,
    variants: false,
    stability: "natural",
    similarity_boost: 0.78,
    intent: { stability: 0.46, style: 0.185, speed: 0.915 },
    direction: "Hopeful, dignified, calm. No lift at the ends of lines.",
  },
  {
    id: "closing",
    sec: "ಎಚ್ · ಸ್ವಾಗತ ಮತ್ತು ಸಮಾರೋಪ",
    briefScene: "closing",
    label: "Welcome and close",
    narrated: true,
    variants: true,
    stability: "natural",
    similarity_boost: 0.78,
    intent: { stability: 0.46, style: 0.185, speed: 0.915 },
    direction:
      "Emotionally resolved. K45 carries ಸಂಭ್ರಮ, the film's second-to-last " +
      "word: the ಭ್ರ conjunct must not break into bha-ra. K29's close and this " +
      "one both end flat, with no rise.",
  },
  {
    id: "outro",
    sec: "ಎಚ್ · ಸಮಾರೋಪ",
    briefScene: "closing",
    label: "Outro card, silent",
    narrated: false,
    direction: "No narration. Music resolves under the logo.",
  },
];

export function loadTimeline() {
  return JSON.parse(fs.readFileSync(TIMELINE_JSON, "utf8"));
}

/**
 * Blocks with their shots attached, checked against the timeline.
 * Throws if the timeline has a section no block claims: a new section in the
 * edit must be given direction here rather than silently going unnarrated.
 */
export function blocksWithShots() {
  const tl = loadTimeline();
  const bySec = new Map();
  for (const shot of tl) {
    if (!bySec.has(shot.sec)) bySec.set(shot.sec, []);
    bySec.get(shot.sec).push(shot);
  }

  const claimed = new Set(BLOCKS.map((b) => b.sec));
  const orphans = [...bySec.keys()].filter((s) => !claimed.has(s));
  if (orphans.length) {
    throw new Error(
      `timeline.json has sections no block in lib/blocks.mjs claims:\n` +
      orphans.map((s) => `  ${s}`).join("\n") +
      `\n  Add a block with direction and a stability band, or the lines in ` +
      `these sections will never be generated.`);
  }

  return BLOCKS.map((b) => {
    const shots = bySec.get(b.sec) || [];
    const lines = shots
      .filter((s) => s.narr.trim())
      .map((s) => ({
        sid: s.sid,
        text: s.narr,
        words: Number(s.words),
        speech: Number(s.speech),
        pause: Number(s.pause),
        hold: Number(s.hold),
        tc_in: s.tc_in,
        tc_out: s.tc_out,
        t_in: Number(s.t_in),
      }));
    return {
      ...b,
      shots,
      lines,
      chars: lines.reduce((n, l) => n + [...l.text].length, 0),
      words: lines.reduce((n, l) => n + l.words, 0),
      speech: lines.reduce((n, l) => n + l.speech, 0),
      tc_in: shots.length ? shots[0].tc_in : null,
      tc_out: shots.length ? shots[shots.length - 1].tc_out : null,
    };
  });
}

/** Only the blocks that actually carry narration. */
export function narratedBlocks() {
  return blocksWithShots().filter((b) => b.narrated && b.lines.length);
}

export function findBlock(id) {
  const all = blocksWithShots();
  const b = all.find((x) => x.id === id);
  if (!b) {
    throw new Error(
      `no such scene: "${id}"\n  available: ` +
      all.filter((x) => x.narrated).map((x) => x.id).join(", "));
  }
  return b;
}

/** Every narrated line in film order, with its block. */
export function allLines() {
  const out = [];
  for (const b of narratedBlocks()) {
    for (const l of b.lines) out.push({ ...l, block: b.id, briefScene: b.briefScene });
  }
  return out;
}
