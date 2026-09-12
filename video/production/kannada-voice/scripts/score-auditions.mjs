#!/usr/bin/env node
/**
 * Compute weighted audition totals from human scores.
 *
 *   node scripts/score-auditions.mjs manifests/audition-scores.csv
 *
 * The CSV is filled in by listeners. See reports/voice-audition-scorecard.md
 * for the columns and the 1 to 5 criteria. This script does the arithmetic and
 * applies the automatic fails; it does not and cannot judge anything.
 *
 * Rows with an empty score column are skipped and reported, so a half-filled
 * sheet cannot quietly produce a winner.
 */

import fs from "node:fs";
import path from "node:path";

const GROUPS = [
  { name: "Kannada authenticity", weight: 0.20, cols: ["c1", "c2", "c3"] },
  { name: "Clarity and diction", weight: 0.15, cols: ["c4", "c5"] },
  { name: "Cinematic documentary feel", weight: 0.15, cols: ["c6", "c7", "c8"] },
  { name: "Proper nouns and numbers", weight: 0.15, cols: ["c9", "c10"] },
  { name: "Warmth and humility", weight: 0.15, cols: ["c11", "c12", "c13"] },
  { name: "Long-form comfort", weight: 0.10, cols: ["c14"] },
  { name: "Auditorium suitability", weight: 0.10, cols: ["c15"] },
];

const file = process.argv[2];
if (!file) {
  console.error(
    "usage: node scripts/score-auditions.mjs <scores.csv>\n" +
    "  Template columns are in reports/voice-audition-scorecard.md section 4.");
  process.exit(1);
}
if (!fs.existsSync(file)) {
  console.error(`no such file: ${file}\n` +
    `  Copy the template from reports/voice-audition-scorecard.md section 4.`);
  process.exit(1);
}

/** Minimal CSV reader: quoted fields with doubled quotes. */
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((f) => f.trim() !== ""));
}

const rows = parseCsv(fs.readFileSync(file, "utf8"));
const header = rows.shift().map((h) => h.trim());
const idx = (n) => header.indexOf(n);
const need = ["voice_id", "take", ...GROUPS.flatMap((g) => g.cols)];
const missingCols = need.filter((n) => idx(n) < 0);
if (missingCols.length) {
  console.error(`the sheet is missing columns: ${missingCols.join(", ")}`);
  process.exit(1);
}

const scored = [], incomplete = [], failed = [];
for (const r of rows) {
  const get = (n) => (idx(n) >= 0 ? String(r[idx(n)] ?? "").trim() : "");
  const rec = {
    voice_id: get("voice_id"), voice_name: get("voice_name"),
    take: get("take"), passage: get("passage"), listener: get("listener"),
    notes: get("notes"),
  };
  const label = `${rec.voice_name || rec.voice_id} take ${rec.take}` +
    (rec.passage ? ` ${rec.passage}` : "") +
    (rec.listener ? ` (${rec.listener})` : "");

  const no = (n) => /^(no|n|false|0)$/i.test(get(n));
  const yes = (n) => /^(yes|y|true|1)$/i.test(get(n));
  const fails = [];
  if (get("k12_pass") && no("k12_pass")) fails.push("K12 read as a rising list");
  if (get("k27_pass") && no("k27_pass")) fails.push("K27 ಪೂರ್ತಿ ಅಲ್ಲ. emphasised");
  if (get("hallucination") && yes("hallucination")) fails.push("hallucinated a proper noun");
  if (fails.length) { failed.push({ label, fails, ...rec }); continue; }

  const blanks = [];
  const groupScores = GROUPS.map((g) => {
    const vals = g.cols.map((c) => {
      const raw = get(c);
      if (raw === "") { blanks.push(c); return null; }
      const n = Number(raw);
      if (!Number.isFinite(n) || n < 1 || n > 5) {
        throw new Error(`${label}: ${c} is "${raw}", expected 1 to 5`);
      }
      return n;
    }).filter((v) => v !== null);
    return { ...g, mean: vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null };
  });

  if (blanks.length) { incomplete.push({ label, blanks: [...new Set(blanks)] }); continue; }

  const total = groupScores.reduce((n, g) => n + g.weight * g.mean, 0);
  scored.push({ ...rec, label, groupScores, total });
}

scored.sort((a, b) => b.total - a.total);

console.log(`\n${path.basename(file)}: ${scored.length} scored, ` +
  `${incomplete.length} incomplete, ${failed.length} automatic fail\n`);

if (scored.length) {
  console.log(`${"".padEnd(4)}${"voice / take".padEnd(46)}${"total".padStart(6)}   ` +
    GROUPS.map((g) => g.name.split(" ")[0].slice(0, 6).padStart(7)).join(""));
  scored.forEach((s, i) => {
    console.log(`${String(i + 1).padEnd(4)}${s.label.slice(0, 45).padEnd(46)}` +
      `${s.total.toFixed(2).padStart(6)}   ` +
      s.groupScores.map((g) => g.mean.toFixed(1).padStart(7)).join(""));
  });
  const best = scored[0];
  console.log(`\nhighest weighted score: ${best.label} at ${best.total.toFixed(2)} of 5`);
  console.log(`That is an arithmetic result, not a casting decision. Confirm it ` +
    `against\nthe listener notes and the Kannada-native review before it goes ` +
    `in config/selected-voice.json.`);
}

if (failed.length) {
  console.log(`\nautomatic fails, excluded from the ranking:`);
  for (const f of failed) console.log(`  ${f.label}\n      ${f.fails.join("; ")}`);
}
if (incomplete.length) {
  console.log(`\nincomplete rows, not scored:`);
  for (const i of incomplete) console.log(`  ${i.label}  missing ${i.blanks.join(" ")}`);
}
console.log("");
