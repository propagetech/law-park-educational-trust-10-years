/**
 * Text preparation for Eleven v3.
 *
 * Three things corrupt Kannada narration silently, and all three are handled
 * here rather than left to whoever writes the next script:
 *
 * 1. Arabic year numerals. v3 reads "2016ರಲ್ಲಿ" as English "two thousand
 *    sixteen". The film needs ಎರಡು ಸಾವಿರದ ಹದಿನಾರರಲ್ಲಿ. Full year-plus-case
 *    forms are replaced so the sandhi is right (ಹದಿನಾರರಲ್ಲಿ, not
 *    ಹದಿನಾರುರಲ್ಲಿ). Subtitles and on-screen text keep the numerals; only the
 *    TTS payload is rewritten.
 *
 * 2. Square brackets. v3 reads them as delivery tags. The approved Kannada
 *    script uses [ವಿರಾಮ 2 ಸೆ] and [ಹಿಡಿ 1 ಸೆ] for pauses and holds. Those
 *    live in separate numeric fields in timeline.json and must never reach
 *    the text. assertNoStrayTags() fails loudly if one does.
 *
 * 3. The zero-width non-joiner in words like ನೋಟ್‌ಬುಕ್ and ಸ್ಕಾಲರ್‌ಶಿಪ್.
 *    Send raw UTF-8 and do not normalise. Nothing here calls .normalize().
 *
 * The year map is duplicated from tools/tts_eleven.py by necessity, one in
 * Python and one here. assertYearMapMatchesPython() compares them so they
 * cannot drift apart unnoticed.
 */

import fs from "node:fs";
import path from "node:path";
import { RENDER_TOOLS } from "./paths.mjs";

/** Longer forms first: ರಲ್ಲಿ must be replaced before the bare ರ. */
export const YEAR_SPEAK = [
  ["2016ರಲ್ಲಿ", "ಎರಡು ಸಾವಿರದ ಹದಿನಾರರಲ್ಲಿ"],
  ["2017ರಲ್ಲಿ", "ಎರಡು ಸಾವಿರದ ಹದಿನೇಳರಲ್ಲಿ"],
  ["2020ರಲ್ಲಿ", "ಎರಡು ಸಾವಿರದ ಇಪ್ಪತ್ತರಲ್ಲಿ"],
  ["2022ರಲ್ಲಿ", "ಎರಡು ಸಾವಿರದ ಇಪ್ಪತ್ತೆರಡರಲ್ಲಿ"],
  ["2023ರಲ್ಲಿ", "ಎರಡು ಸಾವಿರದ ಇಪ್ಪತ್ತಮೂರರಲ್ಲಿ"],
  ["2024ರಲ್ಲಿ", "ಎರಡು ಸಾವಿರದ ಇಪ್ಪತ್ತನಾಲ್ಕರಲ್ಲಿ"],
  ["2025ರಲ್ಲಿ", "ಎರಡು ಸಾವಿರದ ಇಪ್ಪತ್ತೈದರಲ್ಲಿ"],
  ["2026ರಲ್ಲಿ", "ಎರಡು ಸಾವಿರದ ಇಪ್ಪತ್ತಾರರಲ್ಲಿ"],
  ["2012ರಲ್ಲಿ", "ಎರಡು ಸಾವಿರದ ಹನ್ನೆರಡರಲ್ಲಿ"],
  ["2016ರ", "ಎರಡು ಸಾವಿರದ ಹದಿನಾರರ"],
  ["2017ರ", "ಎರಡು ಸಾವಿರದ ಹದಿನೇಳರ"],
  ["2020ರ", "ಎರಡು ಸಾವಿರದ ಇಪ್ಪತ್ತರ"],
  ["2022ರ", "ಎರಡು ಸಾವಿರದ ಇಪ್ಪತ್ತೆರಡರ"],
  ["2023ರ", "ಎರಡು ಸಾವಿರದ ಇಪ್ಪತ್ತಮೂರರ"],
  ["2024ರ", "ಎರಡು ಸಾವಿರದ ಇಪ್ಪತ್ತನಾಲ್ಕರ"],
  ["2025ರ", "ಎರಡು ಸಾವಿರದ ಇಪ್ಪತ್ತೈದರ"],
  ["2026ರ", "ಎರಡು ಸಾವಿರದ ಇಪ್ಪತ್ತಾರರ"],
];

/** Rewrite year numerals for speech. Returns the text unchanged if none. */
export function speakText(text) {
  let out = text;
  for (const [src, dst] of YEAR_SPEAK) out = out.split(src).join(dst);
  return out;
}

/**
 * Which replacements actually fired, for the log and the pronunciation report.
 *
 * This has to replay the substitution rather than test each pattern against
 * the original text: "2016ರ" is a substring of "2016ರಲ್ಲಿ", so a plain
 * includes() check reports both and doubles every year in the count.
 */
export function yearRewrites(text) {
  const fired = [];
  let out = text;
  for (const [src, dst] of YEAR_SPEAK) {
    if (!out.includes(src)) continue;
    const n = out.split(src).length - 1;
    fired.push({ from: src, to: dst, count: n });
    out = out.split(src).join(dst);
  }
  return fired;
}

/**
 * Bare Arabic digits left after the year rewrite. Counts are legitimate
 * (200 ಶಾಲಾ ಚೀಲಗಳು), so this reports rather than fails, but every one is a
 * place where v3 may switch to English digits and a human must listen.
 */
export function remainingNumerals(text) {
  return [...new Set(text.match(/\d[\d,.]*/g) || [])];
}

const TAG_ALLOWLIST = new Set(["calm", "sincere", "warm", "reflective"]);

/**
 * Fail if a square bracket survived into the payload, unless it is one of the
 * few delivery tags this film deliberately allows.
 */
export function assertNoStrayTags(text, where) {
  const found = text.match(/\[[^\]]*\]/g) || [];
  const stray = found.filter(
    (t) => !TAG_ALLOWLIST.has(t.slice(1, -1).trim().toLowerCase()));
  if (stray.length) {
    throw new Error(
      `${where}: square brackets reached the TTS payload: ${stray.join(" ")}\n` +
      `  v3 reads brackets as delivery tags. Script pause notation such as ` +
      `[ವಿರಾಮ 2 ಸೆ] belongs in timeline.json's pause/hold fields, not the text.\n` +
      `  Intentional tags allowed here: ${[...TAG_ALLOWLIST].join(", ")}`);
  }
  return found;
}

/** The zero-width non-joiner, U+200C. Its presence is deliberate. */
export function zwnjCount(text) {
  return (text.match(/‌/g) || []).length;
}

/**
 * Compare this year map against the one in tools/tts_eleven.py. Two copies of
 * the same table in two languages will drift; this makes the drift loud.
 */
export function assertYearMapMatchesPython() {
  const py = path.join(RENDER_TOOLS, "tts_eleven.py");
  if (!fs.existsSync(py)) return { checked: false, reason: "tts_eleven.py not found" };
  const src = fs.readFileSync(py, "utf8");
  const block = src.match(/YEAR_SPEAK\s*=\s*\[([\s\S]*?)\n\]/);
  if (!block) return { checked: false, reason: "YEAR_SPEAK block not found" };

  const pairs = [...block[1].matchAll(/\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\)/g)]
    .map((m) => [m[1], m[2]]);

  const mine = YEAR_SPEAK.map((p) => p.join("␟")).join("\n");
  const theirs = pairs.map((p) => p.join("␟")).join("\n");
  if (mine !== theirs) {
    throw new Error(
      "the year-to-Kannada-words map here and in tools/tts_eleven.py disagree.\n" +
      `  here: ${YEAR_SPEAK.length} entries, tts_eleven.py: ${pairs.length} entries\n` +
      "  Reconcile them before generating, or the two pipelines will speak " +
      "years differently.");
  }
  return { checked: true, entries: pairs.length };
}
