#!/usr/bin/env node
/**
 * Audition the shortlisted voices on the two controlled passages, three takes
 * each, so a voice is chosen on evidence rather than on a description.
 *
 *   node scripts/generate-auditions.mjs --dry-run          # plan only, spends nothing
 *   node scripts/generate-auditions.mjs --role primary     # the three female candidates
 *   node scripts/generate-auditions.mjs --voices <id> <id>
 *   node scripts/generate-auditions.mjs --takes a c        # skip the creative take
 *   node scripts/generate-auditions.mjs --passages main
 *
 * Writes audition-audio/voice-{id}-{slug}-take-{a|b|c}-{passage}.mp3, a
 * measurement JSON beside the audio, reports/audition-plan.json, and one row
 * per request in manifests/narration-generation-log.csv.
 *
 * FILENAME NOTE
 * The brief specifies voice-{id}-{slug}-take-{a|b|c}.mp3. There are two
 * passages per take, so the passage id is appended; without it the stress test
 * would overwrite the main sample.
 *
 * The same text goes to every voice and every take. Change the passages in
 * lib/audition-copy.mjs and previous auditions stop being comparable.
 */

import fs from "node:fs";
import path from "node:path";
import {
  textToSpeech, plannedRequest, buildVoiceSettings, describeSettings,
  DEFAULT_MODEL, OUTPUT_FORMATS,
} from "../lib/eleven.mjs";
import { AUDITION_PASSAGES, allPassages } from "../lib/audition-copy.mjs";
import { TAKES, findTake, slug } from "../lib/takes.mjs";
import { speakText, yearRewrites, remainingNumerals, zwnjCount } from "../lib/speak-text.mjs";
import { preflight, reportPreflight, PreflightError } from "../lib/preflight.mjs";
import { logRow, rowFrom } from "../lib/log.mjs";
import { duration } from "../lib/ffprobe.mjs";
import { AUDITION_AUDIO, REPORTS, CONFIG } from "../lib/paths.mjs";

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const list = (n) => {
  const i = argv.indexOf(n);
  if (i < 0) return null;
  const out = [];
  for (let j = i + 1; j < argv.length && !argv[j].startsWith("--"); j++) out.push(argv[j]);
  return out.length ? out : null;
};

const dryRun = flag("--dry-run");
const modelId = opt("--model", DEFAULT_MODEL);
const outputFormat = opt("--output-format", "mp3_44100_128");
const role = opt("--role", "all");

const shortlistPath = path.join(CONFIG, "audition-shortlist.json");
if (!fs.existsSync(shortlistPath)) {
  console.error(`no ${shortlistPath}\n  run: node scripts/list-elevenlabs-voices.mjs`);
  process.exit(1);
}
const shortlist = JSON.parse(fs.readFileSync(shortlistPath, "utf8"));

let voices = shortlist.shortlist;
const wantIds = list("--voices");
if (wantIds) {
  voices = wantIds.map((id) => {
    const v = shortlist.shortlist.find((x) => x.voice_id === id);
    if (!v) throw new Error(`${id} is not in config/audition-shortlist.json`);
    return v;
  });
} else if (role !== "all") {
  voices = shortlist.shortlist.filter((v) => v.role === role);
  if (!voices.length) throw new Error(`no shortlisted voices with role "${role}"`);
}

const takeIds = list("--takes") ?? TAKES.map((t) => t.id);
const takes = takeIds.map(findTake);
const available = allPassages();
const passageIds = list("--passages") ?? AUDITION_PASSAGES.map((p) => p.id);
const passages = passageIds.map((id) => {
  const p = available.find((x) => x.id === id);
  if (!p) throw new Error(
    `no such passage: "${id}". Available: ${available.map((x) => x.id).join(", ")}`);
  return p;
});

if (!OUTPUT_FORMATS[outputFormat]) {
  console.error(`unknown output format "${outputFormat}". Known: ` +
    Object.keys(OUTPUT_FORMATS).join(", "));
  process.exit(1);
}

/** One planned unit of work. */
const jobs = [];
for (const v of voices) {
  for (const t of takes) {
    for (const p of passages) {
      // The band name wins; the brief's style and speed floats are passed in
      // only so buildVoiceSettings records them as dropped in the log.
      const built = buildVoiceSettings(modelId, {
        stability: t.stability,
        similarity_boost: t.similarity_boost,
        style: t.intent.style,
        speed: t.intent.speed,
      });
      const spoken = speakText(p.text);
      const file = path.join(AUDITION_AUDIO,
        `voice-${v.voice_id}-${slug(v.name)}-take-${t.id}-${p.id}.` +
        OUTPUT_FORMATS[outputFormat].ext);
      jobs.push({ voice: v, take: t, passage: p, built, spoken, file });
    }
  }
}

const characters = jobs.reduce((n, j) => n + [...j.spoken].length, 0);

console.error(`\nAudition plan`);
console.error(`  model            ${modelId}`);
console.error(`  output format    ${outputFormat} (${OUTPUT_FORMATS[outputFormat].tier})`);
console.error(`  voices           ${voices.length}   takes ${takes.length}   passages ${passages.length}`);
console.error(`  requests         ${jobs.length}`);
console.error(`  characters       ${characters.toLocaleString()}\n`);

let pf;
try {
  pf = await preflight({
    modelId,
    voices: voices.map((v) => ({ voice_id: v.voice_id, name: v.name })),
    texts: jobs.map((j) => j.passage.text),
    dryRun,
    allowNoncommercial: flag("--allow-noncommercial"),
    allowMissingVoices: flag("--allow-missing-voices"),
  });
} catch (e) {
  if (e instanceof PreflightError) { console.error(`\n${e.message}\n`); process.exit(3); }
  throw e;
}
reportPreflight(pf, { dryRun });

fs.mkdirSync(AUDITION_AUDIO, { recursive: true });
fs.mkdirSync(REPORTS, { recursive: true });

const plan = {
  generated_at: new Date().toISOString(),
  dry_run: dryRun,
  model_id: modelId,
  output_format: outputFormat,
  total_characters: characters,
  subscription: pf.subscription
    ? { tier: pf.subscription.tier, remaining: pf.subscription.remaining } : null,
  v3_reality: {
    speed: "not a parameter on eleven_v3. Per-take speed is editorial intent only.",
    style: "not a parameter on eleven_v3. Expressiveness comes from the stability band and the text.",
    stability: "three points: creative 0.0, natural 0.5, robust 1.0.",
    breaks: "no SSML breaks. Pauses come from punctuation, or from the timeline in the edit.",
  },
  takes: takes.map((t) => ({
    id: t.id, label: t.label, stability_band: t.stability,
    similarity_boost: t.similarity_boost, brief_intent: t.intent,
    direction: t.direction, what_to_listen_for: t.expect,
  })),
  passages: passages.map((p) => ({
    id: p.id, label: p.label,
    characters_raw: [...p.text].length,
    characters_spoken: [...speakText(p.text)].length,
    year_rewrites: yearRewrites(p.text),
    numerals_left_for_human_check: remainingNumerals(speakText(p.text)),
    zwnj_count: zwnjCount(speakText(p.text)),
    listen_for: p.listenFor,
  })),
  jobs: jobs.map((j) => ({
    voice_id: j.voice.voice_id, voice_name: j.voice.name, role: j.voice.role,
    category: j.voice.category, v3_risk: j.voice.v3_risk,
    take: j.take.id, passage: j.passage.id,
    output_file: path.relative(process.cwd(), j.file),
    characters: [...j.spoken].length,
    settings_sent: j.built.settings,
    dropped: j.built.dropped,
    snapped: j.built.snapped,
    request: dryRun
      ? plannedRequest(j.voice.voice_id, j.spoken,
          { modelId, settings: j.built.settings, outputFormat })
      : undefined,
  })),
};
fs.writeFileSync(path.join(REPORTS, "audition-plan.json"), JSON.stringify(plan, null, 2) + "\n");

if (dryRun) {
  for (const j of jobs) {
    const f = j.file.replace(/\.[^.]+$/, ".dry-run.json");
    fs.writeFileSync(f, JSON.stringify({
      would_post: plannedRequest(j.voice.voice_id, j.spoken,
        { modelId, settings: j.built.settings, outputFormat }),
      dropped_because_model_does_not_support_them: j.built.dropped,
      snapped_onto_the_real_scale: j.built.snapped,
    }, null, 2) + "\n");
    logRow(rowFrom({
      kind: "audition", status: "dry-run", voice: j.voice, modelId, built: j.built,
      blockId: j.passage.id, take: j.take.id, characters: [...j.spoken].length,
      outputFile: path.relative(process.cwd(), j.file),
      note: "no request sent",
    }));
  }
  console.error(`wrote ${jobs.length} dry-run payloads and reports/audition-plan.json`);
  console.error(`spent 0 characters\n`);
  console.error(`To generate for real, drop --dry-run. That will spend ` +
    `${characters.toLocaleString()} characters.\n`);
  process.exit(0);
}

let done = 0, failed = 0;
const measurements = [];
for (const j of jobs) {
  const label = `${j.voice.name} take ${j.take.id} ${j.passage.id}`;
  process.stderr.write(`  ${String(++done).padStart(2)}/${jobs.length} ${label} ... `);
  try {
    const audio = await textToSpeech(j.voice.voice_id, j.spoken, {
      modelId, settings: j.built.settings, outputFormat,
    }, label);
    fs.writeFileSync(j.file, audio);
    const secs = duration(j.file);
    const words = j.passage.text.trim().split(/\s+/).length;
    const wpm = words / (secs / 60);
    measurements.push({
      voice_id: j.voice.voice_id, voice_name: j.voice.name, take: j.take.id,
      passage: j.passage.id, file: path.basename(j.file),
      bytes: audio.length, duration_s: Number(secs.toFixed(3)),
      words, words_per_minute: Number(wpm.toFixed(1)),
      settings_sent: j.built.settings,
    });
    console.error(`${secs.toFixed(2)}s  ${wpm.toFixed(0)} wpm`);
    logRow(rowFrom({
      kind: "audition", status: "ok", voice: j.voice, modelId, built: j.built,
      blockId: j.passage.id, take: j.take.id, characters: [...j.spoken].length,
      outputFile: path.relative(process.cwd(), j.file),
      bytes: audio.length, duration: secs,
      note: `${wpm.toFixed(1)} wpm`,
    }));
  } catch (e) {
    failed++;
    console.error(`FAILED`);
    console.error(`      ${e.message}`);
    logRow(rowFrom({
      kind: "audition", status: "error", voice: j.voice, modelId, built: j.built,
      blockId: j.passage.id, take: j.take.id, characters: [...j.spoken].length,
      outputFile: path.relative(process.cwd(), j.file),
      note: e.message.slice(0, 200),
    }));
  }
}

fs.writeFileSync(path.join(REPORTS, "audition-measurements.json"), JSON.stringify({
  generated_at: new Date().toISOString(),
  note: "Measured, not judged. Duration and words per minute are computable; " +
        "every subjective column in the scorecard needs a human listener.",
  brief_target_wpm: [100, 110],
  approved_script_wpm: 93.0,
  measurements,
}, null, 2) + "\n");

console.error(`\n${done - failed} generated, ${failed} failed`);
console.error(`wrote reports/audition-measurements.json`);
console.error(`\nNothing here has been heard. Score the takes by ear with ` +
  `reports/voice-audition-scorecard.md,\nand get two Kannada-native listeners ` +
  `on the proper nouns before choosing.\n`);
