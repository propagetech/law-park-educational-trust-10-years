#!/usr/bin/env node
/**
 * The final Kannada narration, one file per line, grouped by scene.
 *
 *   node scripts/generate-final-narration.mjs --voice-id <ID> --dry-run
 *   node scripts/generate-final-narration.mjs --voice-id <ID>
 *   node scripts/generate-final-narration.mjs --voice-id <ID> --scene opening
 *   node scripts/generate-final-narration.mjs --voice-id <ID> --sid K27 K29
 *   node scripts/generate-final-narration.mjs --voice-id <ID> --variants
 *
 * ONE FILE PER LINE, NOT PER SCENE, AND NOT ONE LONG FILE
 * The brief asks for scene blocks. The render chain asks for lines: stem.py
 * places each line at its own shot's t_in so pauses and holds stay silent, and
 * build_timeline.py --from-audio re-times the picture from a per-line
 * durations.json. Generating per line satisfies both, because a scene is then
 * just a group of lines, and it means a single mispronounced word costs one
 * short retake instead of a whole block.
 *
 * NO SILENCE IS PADDED INTO THE FILES
 * The brief asks for 300 to 700 ms handles around each line. Those must not be
 * baked into the audio: durations.json feeds build_timeline.py, so padded files
 * would re-time the picture to the padding and every shot after the first would
 * drift. Handles belong to the edit. The cue sheet carries the handle column
 * and the concat manifests apply them, leaving the source files clean.
 *
 * OUTPUT
 *   final-narration/<VOICE_ID>/<SID>.mp3        one per narrated line
 *   final-narration/<VOICE_ID>/durations.json   { sid: seconds }
 *   final-narration/<VOICE_ID>/scenes/<scene>.concat.txt
 *   final-narration/<VOICE_ID>/variants/<SID>-alt.mp3   with --variants
 *
 * With --vo-eleven the same per-line files and durations.json are also written
 * to anniversary-video-production/kannada/tools/vo_eleven/<VOICE_ID>/, which is
 * the layout stem.py and build_timeline.py already read. Nothing downstream
 * needs changing.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  textToSpeech, plannedRequest, buildVoiceSettings, describeSettings,
  DEFAULT_MODEL, OUTPUT_FORMATS,
} from "../lib/eleven.mjs";
import { narratedBlocks, findBlock } from "../lib/blocks.mjs";
import { speakText, yearRewrites, remainingNumerals } from "../lib/speak-text.mjs";
import { preflight, reportPreflight, PreflightError } from "../lib/preflight.mjs";
import { logRow, rowFrom } from "../lib/log.mjs";
import { duration } from "../lib/ffprobe.mjs";
import { FINAL_NARRATION, VO_ELEVEN, REPORTS, CONFIG, SELECTED_VOICE } from "../lib/paths.mjs";
import { TAKES } from "../lib/takes.mjs";

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
const outputFormat = opt("--output-format", "mp3_44100_192");
const withVariants = flag("--variants");
const alsoVoEleven = flag("--vo-eleven");
const handleMs = Number(opt("--handle-ms", "500"));

// The voice: --voice-id, else config/selected-voice.json.
let voiceId = opt("--voice-id");
let voiceName = opt("--voice-name");
if (!voiceId) {
  if (!fs.existsSync(SELECTED_VOICE)) {
    console.error(
      `no --voice-id and no ${path.relative(process.cwd(), SELECTED_VOICE)}\n` +
      `  Audition first:  node scripts/generate-auditions.mjs --dry-run\n` +
      `  Then record the choice in config/selected-voice.json.`);
    process.exit(1);
  }
  const sel = JSON.parse(fs.readFileSync(SELECTED_VOICE, "utf8"));
  if (!sel.voice_id) {
    console.error(
      `config/selected-voice.json has no voice_id yet.\n` +
      `  It is a template until a human has listened to the auditions and ` +
      `filled it in.\n  Nothing is generated from a template.`);
    process.exit(1);
  }
  voiceId = sel.voice_id;
  voiceName = voiceName ?? sel.voice_name;
}
if (!OUTPUT_FORMATS[outputFormat]) {
  console.error(`unknown output format "${outputFormat}". Known: ` +
    Object.keys(OUTPUT_FORMATS).join(", "));
  process.exit(1);
}

// Which blocks and lines.
let blocks = narratedBlocks();
const sceneIds = list("--scene");
if (sceneIds) blocks = sceneIds.map(findBlock);
const wantSids = list("--sid");
if (wantSids) {
  const want = new Set(wantSids);
  blocks = blocks
    .map((b) => ({ ...b, lines: b.lines.filter((l) => want.has(l.sid)) }))
    .filter((b) => b.lines.length);
  const found = new Set(blocks.flatMap((b) => b.lines.map((l) => l.sid)));
  const missing = wantSids.filter((s) => !found.has(s));
  if (missing.length) {
    console.error(`these shot ids carry no narration, or do not exist: ${missing.join(" ")}`);
    process.exit(1);
  }
}
if (!blocks.length) { console.error("nothing to generate"); process.exit(1); }

const outDir = path.join(FINAL_NARRATION, voiceId);
const creativeTake = TAKES.find((t) => t.stability === "creative");

/** One job per line, plus one variant job per line in a variants block. */
const jobs = [];
for (const b of blocks) {
  const built = buildVoiceSettings(modelId, {
    stability: b.stability,
    similarity_boost: b.similarity_boost,
    style: b.intent?.style,
    speed: b.intent?.speed,
  });
  for (const l of b.lines) {
    const spoken = speakText(l.text);
    jobs.push({
      block: b, line: l, built, spoken, variant: false,
      file: path.join(outDir, `${l.sid}.${OUTPUT_FORMATS[outputFormat].ext}`),
    });
    if (withVariants && b.variants) {
      // The alternate is the same line at the creative band, for the scenes
      // the brief calls emotionally important. It is an option for the edit,
      // not a replacement: creative can hallucinate on proper nouns.
      const altBuilt = buildVoiceSettings(modelId, {
        stability: creativeTake.stability,
        similarity_boost: creativeTake.similarity_boost,
      });
      jobs.push({
        block: b, line: l, built: altBuilt, spoken, variant: true,
        file: path.join(outDir, "variants", `${l.sid}-alt.${OUTPUT_FORMATS[outputFormat].ext}`),
      });
    }
  }
}

const characters = jobs.reduce((n, j) => n + [...j.spoken].length, 0);

console.error(`\nFinal narration plan`);
console.error(`  voice            ${voiceId}${voiceName ? `  ${voiceName}` : ""}`);
console.error(`  model            ${modelId}`);
console.error(`  output format    ${outputFormat} (${OUTPUT_FORMATS[outputFormat].tier})`);
console.error(`  scenes           ${blocks.length}`);
console.error(`  lines            ${jobs.filter((j) => !j.variant).length}` +
  (withVariants ? `   variants ${jobs.filter((j) => j.variant).length}` : ""));
console.error(`  characters       ${characters.toLocaleString()}\n`);
for (const b of blocks) {
  const built = jobs.find((j) => j.block.id === b.id).built;
  console.error(`  ${b.id.padEnd(12)} ${String(b.lines.length).padStart(2)} lines  ` +
    `${b.tc_in} to ${b.tc_out}  ${describeSettings(built)}`);
}
console.error("");

let pf;
try {
  pf = await preflight({
    modelId,
    voices: [{ voice_id: voiceId, name: voiceName }],
    texts: jobs.map((j) => j.line.text),
    dryRun, outputFormat,
    allowNoncommercial: flag("--allow-noncommercial"),
    allowMissingVoices: flag("--allow-missing-voices"),
  });
} catch (e) {
  if (e instanceof PreflightError) { console.error(`\n${e.message}\n`); process.exit(3); }
  throw e;
}
reportPreflight(pf, { dryRun });

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.join(outDir, "scenes"), { recursive: true });
if (withVariants) fs.mkdirSync(path.join(outDir, "variants"), { recursive: true });

// Scene concat manifests, for an editor who wants one file per scene.
// The handles are real silence interleaved between the lines, so the line
// files themselves stay unpadded and durations.json stays true to the read.
const ext = OUTPUT_FORMATS[outputFormat].ext;
const silenceName = `silence-${handleMs}ms.${ext}`;
const silencePath = path.join(outDir, "scenes", silenceName);
if (!fs.existsSync(silencePath)) {
  // Generated locally with ffmpeg, not with API characters.
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-f", "lavfi",
    "-i", `anullsrc=r=44100:cl=mono`,
    "-t", (handleMs / 1000).toFixed(3),
    ...(ext === "mp3" ? ["-c:a", "libmp3lame", "-b:a", "192k"] : []),
    silencePath,
  ], { stdio: ["ignore", "ignore", "pipe"] });
}
for (const b of blocks) {
  const entries = [];
  b.lines.forEach((l, i) => {
    if (i > 0) entries.push(`file '${silenceName}'`);
    entries.push(`# ${l.sid}  ${l.tc_in}`);
    entries.push(`file '../${l.sid}.${ext}'`);
  });
  fs.writeFileSync(path.join(outDir, "scenes", `${b.id}.concat.txt`),
    `# ${b.id}  ${b.label}\n# ${b.tc_in} to ${b.tc_out}\n` +
    `# ${handleMs} ms handles are the ${silenceName} entries below. They are\n` +
    `# NOT baked into the line files: durations.json feeds\n` +
    `# build_timeline.py --from-audio, and padded lines would re-time the\n` +
    `# picture to the padding.\n` +
    `# Build this scene:\n` +
    `#   cd scenes && ffmpeg -f concat -safe 0 -i ${b.id}.concat.txt \\\n` +
    `#     -c:a libmp3lame -b:a 192k ${b.id}.${ext}\n` +
    `${entries.join("\n")}\n`);
}

if (dryRun) {
  const plan = {
    generated_at: new Date().toISOString(),
    voice_id: voiceId, voice_name: voiceName ?? null, model_id: modelId,
    output_format: outputFormat, total_characters: characters,
    handle_ms: handleMs,
    v3_reality: {
      speed: "not a parameter. Per-scene speed in the brief is editorial intent.",
      style: "not a parameter. Expressiveness comes from the stability band and the text.",
      stability: "creative 0.0, natural 0.5, robust 1.0.",
    },
    scenes: blocks.map((b) => {
      const built = jobs.find((j) => j.block.id === b.id).built;
      return {
        id: b.id, label: b.label, sec: b.sec, brief_scene: b.briefScene,
        tc_in: b.tc_in, tc_out: b.tc_out,
        lines: b.lines.length, characters: b.chars, words: b.words,
        allotted_speech_s: Number(b.speech.toFixed(2)),
        stability_band: b.stability, settings_sent: built.settings,
        dropped: built.dropped, snapped: built.snapped,
        direction: b.direction,
        generates_variants: Boolean(withVariants && b.variants),
      };
    }),
    jobs: jobs.map((j) => ({
      sid: j.line.sid, scene: j.block.id, variant: j.variant,
      characters: [...j.spoken].length,
      allotted_speech_s: j.line.speech,
      year_rewrites: yearRewrites(j.line.text),
      numerals_left_for_human_check: remainingNumerals(j.spoken),
      output_file: path.relative(process.cwd(), j.file),
      request: plannedRequest(voiceId, j.spoken,
        { modelId, settings: j.built.settings, outputFormat }),
    })),
  };
  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(path.join(REPORTS, "final-narration-plan.json"),
    JSON.stringify(plan, null, 2) + "\n");
  for (const j of jobs) {
    logRow(rowFrom({
      kind: j.variant ? "final-variant" : "final", status: "dry-run",
      voice: { voice_id: voiceId, name: voiceName }, modelId, built: j.built,
      blockId: j.block.id, sid: j.line.sid, characters: [...j.spoken].length,
      outputFile: path.relative(process.cwd(), j.file), note: "no request sent",
    }));
  }
  console.error(`wrote reports/final-narration-plan.json and ` +
    `${blocks.length} scene concat manifests`);
  console.error(`spent 0 characters\n`);
  console.error(`To generate for real, drop --dry-run. That will spend ` +
    `${characters.toLocaleString()} characters.\n`);
  process.exit(0);
}

// Preserve durations from earlier partial runs so a single-line pickup does
// not wipe the rest of the read.
const durPath = path.join(outDir, "durations.json");
let durations = {};
if (fs.existsSync(durPath)) {
  try { durations = JSON.parse(fs.readFileSync(durPath, "utf8")); } catch { durations = {}; }
}

let done = 0, failed = 0;
const drift = [];
for (const j of jobs) {
  const label = `${j.line.sid}${j.variant ? " alt" : ""}`;
  process.stderr.write(`  ${String(++done).padStart(2)}/${jobs.length} ${label.padEnd(8)} `);
  try {
    const audio = await textToSpeech(voiceId, j.spoken, {
      modelId, settings: j.built.settings, outputFormat,
    }, label);
    fs.mkdirSync(path.dirname(j.file), { recursive: true });
    fs.writeFileSync(j.file, audio);
    const secs = duration(j.file);
    if (!j.variant) {
      durations[j.line.sid] = secs;
      const alloc = j.line.speech;
      const pct = alloc ? (100 * (secs - alloc)) / alloc : 0;
      drift.push({ sid: j.line.sid, alloc, spoken: secs, pct });
      console.error(`allotted ${alloc.toFixed(2)}s  spoken ${secs.toFixed(2)}s  ` +
        `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%` +
        (Math.abs(pct) >= 12 ? "   <- picture will re-time" : ""));
    } else {
      console.error(`${secs.toFixed(2)}s  variant`);
    }
    logRow(rowFrom({
      kind: j.variant ? "final-variant" : "final", status: "ok",
      voice: { voice_id: voiceId, name: voiceName }, modelId, built: j.built,
      blockId: j.block.id, sid: j.line.sid, characters: [...j.spoken].length,
      outputFile: path.relative(process.cwd(), j.file),
      bytes: audio.length, duration: secs,
    }));
  } catch (e) {
    failed++;
    console.error(`FAILED\n      ${e.message}`);
    logRow(rowFrom({
      kind: j.variant ? "final-variant" : "final", status: "error",
      voice: { voice_id: voiceId, name: voiceName }, modelId, built: j.built,
      blockId: j.block.id, sid: j.line.sid, characters: [...j.spoken].length,
      outputFile: path.relative(process.cwd(), j.file),
      note: e.message.slice(0, 200),
    }));
  }
}

// An empty durations.json is worse than none: build_timeline.py --from-audio
// would read it and re-time the film to nothing.
if (Object.keys(durations).length) {
  fs.writeFileSync(durPath, JSON.stringify(durations, null, 1) + "\n");
}

if (alsoVoEleven && Object.keys(durations).length) {
  const dst = path.join(VO_ELEVEN, voiceId);
  fs.mkdirSync(dst, { recursive: true });
  for (const j of jobs) {
    if (j.variant || !fs.existsSync(j.file)) continue;
    fs.copyFileSync(j.file, path.join(dst, path.basename(j.file)));
  }
  fs.writeFileSync(path.join(dst, "durations.json"), JSON.stringify(durations, null, 1) + "\n");
  console.error(`\nmirrored into ${path.relative(process.cwd(), dst)} for stem.py`);
}

const allSids = narratedBlocks().flatMap((b) => b.lines.map((l) => l.sid));
const haveAll = allSids.every((s) => durations[s] !== undefined);

console.error(`\n${done - failed} generated, ${failed} failed`);
console.error(`wrote ${path.relative(process.cwd(), durPath)}  ` +
  `(${Object.keys(durations).length} of ${allSids.length} lines)`);

if (drift.length) {
  const alloc = drift.reduce((n, d) => n + d.alloc, 0);
  const spoken = drift.reduce((n, d) => n + d.spoken, 0);
  console.error(`\nallotted ${alloc.toFixed(1)}s   spoken ${spoken.toFixed(1)}s   ` +
    `${spoken >= alloc ? "+" : ""}${(100 * (spoken - alloc) / alloc).toFixed(1)}%`);
  const bad = drift.filter((d) => Math.abs(d.pct) >= 12);
  if (bad.length) console.error(`${bad.length} lines more than 12% out: ` +
    bad.map((d) => d.sid).join(" "));
}

if (!haveAll) {
  const missing = allSids.filter((s) => durations[s] === undefined);
  console.error(`\n${missing.length} lines still have no audio: ${missing.join(" ")}`);
  console.error(`The film cannot be re-timed from a partial read. Generate the rest first.`);
} else {
  console.error(`\nRe-time the picture to this read, then rebuild:`);
  console.error(`  cd ../kannada/tools`);
  console.error(`  python3 build_timeline.py timeline.json --from-audio ` +
    `${alsoVoEleven ? `vo_eleven/${voiceId}` : path.relative(
      path.join(process.cwd(), "../kannada/tools"), outDir)}/durations.json`);
  console.error(`  python3 make_srt.py timeline.json ../05-kannada-subtitles.srt`);
  console.error(`  python3 gfx.py ../05-kannada-subtitles.srt`);
  console.error(`  python3 film.py silent.mp4`);
  console.error(`  python3 stem.py ${voiceId}`);
}
console.error("");
