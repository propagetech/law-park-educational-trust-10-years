#!/usr/bin/env node
/**
 * Generate scene-by-scene Kannada narration from timeline.json.
 *
 *   node scripts/generate-final-narration.mjs --dry-run
 *   node scripts/generate-final-narration.mjs --voice-id VOICE_ID
 *   node scripts/generate-final-narration.mjs --scene opening
 *   node scripts/generate-final-narration.mjs --scene closing --variant b
 *   node scripts/generate-final-narration.mjs --only K12 K27
 */

import fs from "node:fs";
import path from "node:path";
import {
  requireApiKey,
  textToSpeech,
  appendCsvLog,
  KANNADA_MODEL_ID,
  DEFAULT_OUTPUT_FORMAT,
  getSubscription,
} from "../lib/elevenlabs.mjs";
import { speakText } from "../lib/year-speak.mjs";
import {
  SCENE_SETTINGS,
  shotsForScene,
  narratedShots,
  estimateNarrationDurationSeconds,
} from "../lib/scenes.mjs";
import {
  ROOT,
  CONFIG,
  FINAL_NARRATION,
  MANIFESTS,
} from "../lib/paths.mjs";

const LOG_HEADER = [
  "timestamp",
  "voice_id",
  "voice_name",
  "model_id",
  "take",
  "stability",
  "similarity_boost",
  "style",
  "speed_intent",
  "script_block_id",
  "output_file",
  "status",
  "bytes",
  "notes",
];

function parseArgs(argv) {
  const out = {
    dryRun: argv.includes("--dry-run"),
    voiceId: null,
    scenes: [],
    only: [],
    variant: "primary",
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--voice-id" && argv[i + 1]) {
      out.voiceId = argv[++i];
    } else if (argv[i] === "--scene" && argv[i + 1]) {
      out.scenes.push(argv[++i]);
    } else if (argv[i] === "--variant" && argv[i + 1]) {
      out.variant = argv[++i];
    } else if (argv[i] === "--only") {
      while (argv[i + 1] && !argv[i + 1].startsWith("--")) {
        out.only.push(argv[++i]);
      }
    }
  }
  return out;
}

function loadSelectedVoice(cliVoiceId) {
  const selectedPath = path.join(CONFIG, "selected-voice.json");
  let selected = null;
  if (fs.existsSync(selectedPath)) {
    selected = JSON.parse(fs.readFileSync(selectedPath, "utf8"));
  }
  const voiceId = cliVoiceId || selected?.voice_id;
  if (!voiceId) {
    throw new Error(
      "Provide --voice-id or write config/selected-voice.json after audition approval."
    );
  }
  return {
    voice_id: voiceId,
    voice_name: selected?.voice_name || selected?.name || voiceId,
    settings: selected?.settings || null,
    scene_settings: selected?.scene_settings || null,
  };
}

function settingsForScene(voice, scene) {
  if (voice.scene_settings?.[scene.id]) {
    return voice.scene_settings[scene.id];
  }
  return scene.settings;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  requireApiKey();
  fs.mkdirSync(FINAL_NARRATION, { recursive: true });
  fs.mkdirSync(MANIFESTS, { recursive: true });

  const voice = loadSelectedVoice(args.voiceId);
  const sceneIds = args.scenes.length
    ? args.scenes
    : Object.keys(SCENE_SETTINGS);

  for (const id of sceneIds) {
    if (!SCENE_SETTINGS[id]) {
      throw new Error(
        `Unknown scene "${id}". Known: ${Object.keys(SCENE_SETTINGS).join(", ")}`
      );
    }
  }

  const estimate = estimateNarrationDurationSeconds();
  const sub = await getSubscription();
  const logPath = path.join(MANIFESTS, "narration-generation-log.csv");

  console.log("=== Final Kannada narration ===");
  console.log(`Voice: ${voice.voice_name} (${voice.voice_id})`);
  console.log(`Model: ${KANNADA_MODEL_ID} · format ${DEFAULT_OUTPUT_FORMAT}`);
  console.log(
    `Estimated VO duration from timeline: ${estimate.total.toFixed(1)}s ` +
      `(speech ${estimate.speech.toFixed(1)}s + pauses ${estimate.pauses.toFixed(1)}s, ${estimate.lineCount} lines)`
  );
  if (sub) {
    console.log(
      `Quota: ${sub.character_count}/${sub.character_limit} used (${sub.tier})`
    );
  }
  if (args.dryRun) {
    console.log("DRY RUN — no audio will be generated.\n");
  }
  console.log(
    "Reminder: approve the 30-second opening audition before spending a full render.\n"
  );

  let generated = 0;
  let failed = 0;
  let plannedChars = 0;

  for (const sceneId of sceneIds) {
    const scene = SCENE_SETTINGS[sceneId];
    let shots = shotsForScene(sceneId);
    if (args.only.length) {
      shots = shots.filter((s) => args.only.includes(s.sid));
    }
    if (!shots.length) {
      continue;
    }

    const settings = settingsForScene(voice, scene);
    const outDir = path.join(
      FINAL_NARRATION,
      voice.voice_id,
      args.variant === "primary" ? scene.id : `${scene.id}-${args.variant}`
    );
    fs.mkdirSync(outDir, { recursive: true });

    console.log(`Scene ${scene.id} (${scene.tc}) · ${shots.length} lines · ${scene.direction}`);

    // Optional second variant for emotional scenes uses slightly more intimate settings.
    const effectiveSettings =
      args.variant === "b" && scene.generateVariants
        ? {
            ...settings,
            stability: Math.max(0.38, (settings.stability || 0.5) - 0.06),
            style: Math.min(0.25, (settings.style || 0.1) + 0.06),
            speed: Math.max(0.9, (settings.speed || 0.94) - 0.02),
          }
        : settings;

    for (const shot of shots) {
      const spoken = speakText(shot.narr);
      plannedChars += [...spoken].length;
      const outPath = path.join(outDir, `${shot.sid}.mp3`);
      console.log(
        `  ${args.dryRun ? "PLAN" : "GEN "} ${shot.sid} (${spoken.length} chars) → ${path.relative(ROOT, outPath)}`
      );

      try {
        if (!args.dryRun && sub) {
          const remaining =
            (sub.character_limit || 0) - (sub.character_count || 0);
          if (remaining < spoken.length) {
            throw new Error(
              `Insufficient quota remaining (${remaining} chars) for ${shot.sid}`
            );
          }
        }

        const result = await textToSpeech({
          voiceId: voice.voice_id,
          text: spoken,
          outPath,
          modelId: KANNADA_MODEL_ID,
          languageCode: "kn",
          settings: effectiveSettings,
          dryRun: args.dryRun,
        });

        appendCsvLog(
          logPath,
          {
            timestamp: new Date().toISOString(),
            voice_id: voice.voice_id,
            voice_name: voice.voice_name,
            model_id: KANNADA_MODEL_ID,
            take: args.variant,
            stability: effectiveSettings.stability,
            similarity_boost: effectiveSettings.similarity_boost,
            style: effectiveSettings.style,
            speed_intent: effectiveSettings.speed,
            script_block_id: `${scene.id}:${shot.sid}`,
            output_file: path.relative(ROOT, outPath),
            status: args.dryRun ? "dry-run" : "ok",
            bytes: result.bytes || 0,
            notes: scene.direction,
          },
          LOG_HEADER
        );

        if (args.dryRun) {
          fs.writeFileSync(
            outPath.replace(/\.mp3$/, ".dry-run.json"),
            JSON.stringify(result.request, null, 2),
            "utf8"
          );
        } else {
          generated += 1;
          if (sub) {
            sub.character_count =
              (sub.character_count || 0) + spoken.length;
          }
        }
      } catch (err) {
        failed += 1;
        appendCsvLog(
          logPath,
          {
            timestamp: new Date().toISOString(),
            voice_id: voice.voice_id,
            voice_name: voice.voice_name,
            model_id: KANNADA_MODEL_ID,
            take: args.variant,
            stability: effectiveSettings.stability,
            similarity_boost: effectiveSettings.similarity_boost,
            style: effectiveSettings.style,
            speed_intent: effectiveSettings.speed,
            script_block_id: `${scene.id}:${shot.sid}`,
            output_file: path.relative(ROOT, outPath),
            status: "error",
            bytes: 0,
            notes: (err.message || String(err)).slice(0, 200),
          },
          LOG_HEADER
        );
        console.error(`  ERROR ${shot.sid}: ${(err.message || err).slice(0, 300)}`);
      }
    }
  }

  // Write / refresh cue sheet from timeline for editorial use.
  const cuePath = path.join(MANIFESTS, "narration-cue-sheet.csv");
  const cueHeader =
    "scene_id,sid,tc_in,speech_s,pause_s,words,settings_profile,narr_preview\n";
  const cueRows = [];
  for (const sceneId of Object.keys(SCENE_SETTINGS)) {
    const scene = SCENE_SETTINGS[sceneId];
    for (const shot of shotsForScene(sceneId)) {
      const preview = (shot.narr || "").replace(/\s+/g, " ").slice(0, 80);
      cueRows.push(
        [
          scene.id,
          shot.sid,
          shot.tc_in || "",
          shot.speech ?? "",
          shot.pause ?? "",
          shot.words ?? "",
          scene.id,
          `"${preview.replace(/"/g, '""')}"`,
        ].join(",")
      );
    }
  }
  fs.writeFileSync(cuePath, cueHeader + cueRows.join("\n") + "\n", "utf8");

  console.log(`\nLines generated: ${generated}`);
  console.log(`Failures: ${failed}`);
  console.log(`Planned / spoken characters this run: ${plannedChars}`);
  console.log(`Cue sheet: ${cuePath}`);
  console.log(`Log: ${logPath}`);
  if (!args.dryRun && generated > 0) {
    console.log(
      "\nNext (existing Kannada tools chain):\n" +
        "  cd ../kannada/tools && python3 build_timeline.py timeline.json --from-audio <durations.json>"
    );
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
