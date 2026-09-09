#!/usr/bin/env node
/**
 * Generate three performance takes per shortlisted Kannada voice.
 *
 *   node scripts/generate-auditions.mjs --dry-run
 *   node scripts/generate-auditions.mjs
 *   node scripts/generate-auditions.mjs --voice-id 1yebI4wPatIbQgkzinlP
 *   node scripts/generate-auditions.mjs --add-shared
 */

import fs from "node:fs";
import path from "node:path";
import {
  requireApiKey,
  listAccountVoices,
  addSharedVoice,
  textToSpeech,
  slugifyVoiceName,
  appendCsvLog,
  KANNADA_MODEL_ID,
  DEFAULT_OUTPUT_FORMAT,
  getSubscription,
} from "../lib/elevenlabs.mjs";
import { AUDITION_FULL, TAKES } from "../lib/audition-copy.mjs";
import { speakText } from "../lib/year-speak.mjs";
import {
  ROOT,
  REPORTS,
  AUDITION_AUDIO,
  MANIFESTS,
  CONFIG,
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
    addShared: argv.includes("--add-shared"),
    voiceIds: [],
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--voice-id" && argv[i + 1]) {
      out.voiceIds.push(argv[++i]);
    }
  }
  return out;
}

function loadShortlist() {
  const configPath = path.join(CONFIG, "audition-shortlist.json");
  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Missing ${configPath}. Run list-elevenlabs-voices.mjs and create the shortlist config.`
    );
  }
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}

async function ensureVoiceOnAccount(candidate, accountIds, addShared) {
  if (accountIds.has(candidate.voice_id)) {
    return { ok: true, already: true };
  }
  if (!candidate.public_owner_id) {
    return {
      ok: false,
      error: "Voice not on account and no public_owner_id to add from library",
    };
  }
  if (!addShared) {
    return {
      ok: false,
      error: `Voice ${candidate.voice_id} is not on this account. Re-run with --add-shared`,
    };
  }
  try {
    await addSharedVoice(
      candidate.public_owner_id,
      candidate.voice_id,
      candidate.name
    );
    accountIds.add(candidate.voice_id);
    return { ok: true, added: true };
  } catch (err) {
    // Some plans return an error if already added under another name.
    const msg = err.message || String(err);
    if (/already|exists|limit/i.test(msg)) {
      return { ok: false, error: msg };
    }
    return { ok: false, error: msg };
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  requireApiKey();
  fs.mkdirSync(AUDITION_AUDIO, { recursive: true });
  fs.mkdirSync(MANIFESTS, { recursive: true });

  const shortlist = loadShortlist();
  let candidates = shortlist.voices || [];
  if (args.voiceIds.length) {
    candidates = candidates.filter((v) => args.voiceIds.includes(v.voice_id));
  }
  if (!candidates.length) {
    throw new Error("No shortlisted voices to audition.");
  }

  const accountVoices = await listAccountVoices();
  const accountIds = new Set(accountVoices.map((v) => v.voice_id));
  const sub = await getSubscription();
  const spoken = speakText(AUDITION_FULL);
  const charCount = [...spoken].length;

  console.log("=== Kannada voice auditions ===");
  console.log(`Model: ${KANNADA_MODEL_ID}`);
  console.log(`Output format: ${DEFAULT_OUTPUT_FORMAT}`);
  console.log(`Voices: ${candidates.length} · Takes: a/b/c · Chars/take ≈ ${charCount}`);
  console.log(
    `Estimated characters: ${candidates.length * 3 * charCount}` +
      (args.dryRun ? " (dry-run, no spend)" : "")
  );
  if (sub) {
    console.log(
      `Quota: ${sub.character_count}/${sub.character_limit} used (${sub.tier})`
    );
    const remaining = (sub.character_limit || 0) - (sub.character_count || 0);
    if (!args.dryRun && remaining < charCount) {
      console.error(
        `\nNot enough characters remaining (${remaining}). Top up or wait for reset, or use --dry-run.`
      );
      process.exit(2);
    }
  }
  console.log(`Speed note: ${KANNADA_MODEL_ID} omits API speed; take speeds are editorial intent only.\n`);

  const logPath = path.join(MANIFESTS, "narration-generation-log.csv");
  const planned = [];
  let generated = 0;
  let failed = 0;

  for (const voice of candidates) {
    const ensure = await ensureVoiceOnAccount(voice, accountIds, args.addShared);
    if (!ensure.ok && !args.dryRun) {
      console.error(`SKIP ${voice.name}: ${ensure.error}`);
      failed += 1;
      continue;
    }
    if (ensure.added) {
      console.log(`Added shared voice to account: ${voice.name}`);
    } else if (args.dryRun && !accountIds.has(voice.voice_id)) {
      console.log(
        `(dry-run) would require --add-shared for ${voice.name} (${voice.voice_id})`
      );
    }

    const slug = slugifyVoiceName(voice.name);
    for (const takeKey of ["a", "b", "c"]) {
      const take = TAKES[takeKey];
      const filename = `voice-${voice.voice_id}-${slug}-take-${takeKey}.mp3`;
      const outPath = path.join(AUDITION_AUDIO, filename);
      const settings = take.settings;
      const blockId = `audition-full-take-${takeKey}`;

      console.log(
        `${args.dryRun ? "PLAN" : "GEN "} ${voice.name} take ${takeKey.toUpperCase()} → ${filename}`
      );
      console.log(`     ${take.label} · stab ${settings.stability} sim ${settings.similarity_boost} style ${settings.style} speed* ${settings.speed}`);
      console.log(`     Direction: ${take.direction}`);

      try {
        const result = await textToSpeech({
          voiceId: voice.voice_id,
          text: spoken,
          outPath,
          modelId: KANNADA_MODEL_ID,
          languageCode: "kn",
          settings,
          dryRun: args.dryRun,
        });

        const status = args.dryRun ? "dry-run" : "ok";
        const notes = [
          take.label,
          result.usedFallbackSettings ? "fallback-settings" : "",
          ensure.added ? "added-shared" : "",
          !accountIds.has(voice.voice_id) && args.dryRun ? "needs-add-shared" : "",
        ]
          .filter(Boolean)
          .join("; ");

        appendCsvLog(
          logPath,
          {
            timestamp: new Date().toISOString(),
            voice_id: voice.voice_id,
            voice_name: voice.name,
            model_id: KANNADA_MODEL_ID,
            take: takeKey,
            stability: settings.stability,
            similarity_boost: settings.similarity_boost,
            style: settings.style,
            speed_intent: settings.speed,
            script_block_id: blockId,
            output_file: path.relative(ROOT, outPath),
            status,
            bytes: result.bytes || 0,
            notes,
          },
          LOG_HEADER
        );

        if (args.dryRun) {
          planned.push(result.request);
          fs.writeFileSync(
            outPath.replace(/\.mp3$/, ".dry-run.json"),
            JSON.stringify(result.request, null, 2),
            "utf8"
          );
        } else {
          generated += 1;
        }
      } catch (err) {
        failed += 1;
        appendCsvLog(
          logPath,
          {
            timestamp: new Date().toISOString(),
            voice_id: voice.voice_id,
            voice_name: voice.name,
            model_id: KANNADA_MODEL_ID,
            take: takeKey,
            stability: settings.stability,
            similarity_boost: settings.similarity_boost,
            style: settings.style,
            speed_intent: settings.speed,
            script_block_id: blockId,
            output_file: path.relative(ROOT, outPath),
            status: "error",
            bytes: 0,
            notes: (err.message || String(err)).slice(0, 200),
          },
          LOG_HEADER
        );
        console.error(`  ERROR: ${(err.message || err).slice(0, 300)}`);
      }
    }
  }

  if (args.dryRun) {
    const planPath = path.join(REPORTS, "audition-dry-run-plan.json");
    fs.writeFileSync(
      planPath,
      JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          model_id: KANNADA_MODEL_ID,
          character_estimate_per_take: charCount,
          total_calls: planned.length,
          calls: planned,
        },
        null,
        2
      ),
      "utf8"
    );
    console.log(`\nDry-run plan: ${planPath}`);
  }

  console.log(`\nAudition files generated: ${generated}`);
  console.log(`Failures: ${failed}`);
  console.log(`Log: ${logPath}`);
  console.log(
    "\nReminder: trustee/team must approve the 30-second opening test before final 5-minute generation."
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
