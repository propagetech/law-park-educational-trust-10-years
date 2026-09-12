#!/usr/bin/env node
/**
 * Derive manifests/narration-cue-sheet.csv from timeline.json.
 *
 *   node scripts/write-cue-sheet.mjs
 *
 * One row per narrated line: where it sits, what it says, what it will be sent
 * as after the year rewrite, which scene and stability band it belongs to, and
 * what a human has to listen for. Regenerate it whenever the timeline changes;
 * it is derived, never hand-edited.
 */

import fs from "node:fs";
import path from "node:path";
import { narratedBlocks } from "../lib/blocks.mjs";
import { speakText, yearRewrites, remainingNumerals, zwnjCount } from "../lib/speak-text.mjs";
import { CUE_SHEET } from "../lib/paths.mjs";

const COLUMNS = [
  "sid", "scene", "brief_scene", "section", "tc_in", "tc_out", "t_in",
  "allotted_speech_s", "pause_s", "hold_s", "words", "characters",
  "stability_band", "similarity_boost", "handle_ms",
  "narration_kannada", "sent_to_tts_after_year_rewrite",
  "year_rewrites", "numerals_left_for_human_check", "zwnj",
  "generates_variant", "direction",
];

const cell = (v) => {
  if (v === undefined || v === null) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const rows = [];
for (const b of narratedBlocks()) {
  for (const l of b.lines) {
    const spoken = speakText(l.text);
    rows.push({
      sid: l.sid, scene: b.id, brief_scene: b.briefScene, section: b.sec,
      tc_in: l.tc_in, tc_out: l.tc_out, t_in: l.t_in,
      allotted_speech_s: l.speech, pause_s: l.pause, hold_s: l.hold,
      words: l.words, characters: [...l.text].length,
      stability_band: b.stability, similarity_boost: b.similarity_boost,
      handle_ms: 500,
      narration_kannada: l.text,
      sent_to_tts_after_year_rewrite: spoken === l.text ? "(unchanged)" : spoken,
      year_rewrites: yearRewrites(l.text).map((r) => `${r.from}->${r.to}`).join(" | "),
      numerals_left_for_human_check: remainingNumerals(spoken).join(" "),
      zwnj: zwnjCount(l.text),
      generates_variant: b.variants ? "yes" : "no",
      direction: b.direction,
    });
  }
}

fs.mkdirSync(path.dirname(CUE_SHEET), { recursive: true });
fs.writeFileSync(CUE_SHEET,
  COLUMNS.join(",") + "\n" +
  rows.map((r) => COLUMNS.map((c) => cell(r[c])).join(",")).join("\n") + "\n");

console.log(`wrote ${path.relative(process.cwd(), CUE_SHEET)}: ${rows.length} lines`);
console.log(`  ${rows.reduce((n, r) => n + r.characters, 0)} characters, ` +
  `${rows.reduce((n, r) => n + r.words, 0)} words, ` +
  `${rows.reduce((n, r) => n + Number(r.allotted_speech_s), 0).toFixed(1)}s allotted speech`);
console.log(`  ${rows.filter((r) => r.year_rewrites).length} lines carry a year rewrite`);
console.log(`  ${rows.filter((r) => r.numerals_left_for_human_check).length} lines still ` +
  `carry bare numerals a human must check by ear`);
