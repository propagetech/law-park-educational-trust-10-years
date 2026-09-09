#!/usr/bin/env node
/**
 * List ElevenLabs voices available to this account, plus Kannada-capable
 * candidates from the Voice Library search. Writes a sanitized report.
 *
 *   export ELEVENLABS_API_KEY=...
 *   node scripts/list-elevenlabs-voices.mjs
 *   node scripts/list-elevenlabs-voices.mjs --search-shared
 */

import fs from "node:fs";
import path from "node:path";
import {
  requireApiKey,
  listAccountVoices,
  searchSharedVoices,
  getSubscription,
  getModels,
  sanitizeVoiceRecord,
  KANNADA_MODEL_ID,
} from "../lib/elevenlabs.mjs";
import { REPORTS } from "../lib/paths.mjs";

function parseArgs(argv) {
  return {
    searchShared: argv.includes("--search-shared") || !argv.includes("--account-only"),
    accountOnly: argv.includes("--account-only"),
  };
}

function looksKannadaCapable(voice) {
  const blob = JSON.stringify({
    name: voice.name,
    description: voice.description,
    labels: voice.labels,
    language: voice.language || voice.labels?.language,
    accent: voice.accent || voice.labels?.accent,
    verified_languages: voice.verified_languages,
  }).toLowerCase();
  return (
    blob.includes("kannada") ||
    blob.includes("karnataka") ||
    /\bkn\b/.test(blob) ||
    blob.includes('"language":"kn"')
  );
}

function scoreCandidate(voice) {
  const name = (voice.name || "").toLowerCase();
  const desc = (voice.description || "").toLowerCase();
  const gender = (voice.gender || voice.labels?.gender || "").toLowerCase();
  const age = (voice.age || voice.labels?.age || "").toLowerCase();
  const use = (voice.use_case || voice.labels?.use_case || "").toLowerCase();
  let score = 0;
  const reasons = [];

  if (name.includes("kannada") || desc.includes("kannada")) {
    score += 40;
    reasons.push("explicit Kannada labelling");
  }
  if (gender === "female") {
    score += 20;
    reasons.push("female (primary brief)");
  } else if (gender === "male") {
    score += 8;
    reasons.push("male (alternative brief)");
  }
  if (age === "middle_aged") {
    score += 15;
    reasons.push("middle-aged");
  } else if (age === "old") {
    score += 8;
    reasons.push("mature age");
  } else if (age === "young") {
    score -= 10;
    reasons.push("young (risk for 35–50 brief)");
  }
  if (use.includes("narrative") || use.includes("informative") || use.includes("educational")) {
    score += 15;
    reasons.push(`use_case=${use}`);
  }
  if (use.includes("advertisement") || use.includes("social_media")) {
    score -= 20;
    reasons.push(`reject-leaning use_case=${use}`);
  }
  if (name.includes("radio") || name.includes("fm ") || desc.includes("fm radio")) {
    score -= 25;
    reasons.push("radio / FM energy");
  }
  if (name.includes("animated") || desc.includes("children")) {
    score -= 20;
    reasons.push("children / animated register");
  }
  if (name.includes("documentary") && desc.includes("energetic")) {
    score -= 8;
    reasons.push("energetic documentary risk");
  }
  if (name.includes("audiobook") || name.includes("narration") || name.includes("storyteller")) {
    score += 12;
    reasons.push("narration / storyteller framing");
  }
  if ((voice.category || "").includes("high_quality") || voice.category === "professional") {
    score += 5;
  }
  return { score, reasons };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  requireApiKey();
  fs.mkdirSync(REPORTS, { recursive: true });

  const [accountVoices, subscription, models] = await Promise.all([
    listAccountVoices(),
    getSubscription(),
    getModels().catch(() => []),
  ]);

  const kannadaModels = (models || [])
    .filter((m) =>
      (m.languages || []).some(
        (l) => l.language_id === "kn" || String(l.name || "").toLowerCase() === "kannada"
      )
    )
    .map((m) => m.model_id);

  const sanitizedAccount = accountVoices.map(sanitizeVoiceRecord);
  const accountKannada = sanitizedAccount.filter(looksKannadaCapable);

  let sharedHits = [];
  if (args.searchShared && !args.accountOnly) {
    const shared = await searchSharedVoices({ search: "kannada", page_size: "50" });
    sharedHits = (shared.voices || []).map((v) => ({
      voice_id: v.voice_id,
      public_owner_id: v.public_owner_id,
      name: v.name,
      category: v.category || null,
      description: v.description || null,
      preview_url: v.preview_url || null,
      language: v.language || null,
      locale: v.locale || null,
      accent: v.accent || null,
      gender: v.gender || null,
      age: v.age || null,
      use_case: v.use_case || null,
      verified_languages: v.verified_languages || null,
      cloned_by_count: v.cloned_by_count ?? null,
      free_users_allowed: v.free_users_allowed ?? null,
      featured: v.featured ?? null,
      source: "shared-voices-search:kannada",
      ...scoreCandidate(v),
    }));
    sharedHits.sort((a, b) => b.score - a.score);
  }

  const report = {
    generated_at: new Date().toISOString(),
    note: "Sanitized voice inventory. API key never stored.",
    recommended_model_for_kannada: KANNADA_MODEL_ID,
    models_with_kannada: kannadaModels,
    subscription: subscription
      ? {
          tier: subscription.tier,
          character_count: subscription.character_count,
          character_limit: subscription.character_limit,
          next_character_count_reset_unix: subscription.next_character_count_reset_unix,
        }
      : null,
    account_voice_count: sanitizedAccount.length,
    account_kannada_labelled_count: accountKannada.length,
    account_voices: sanitizedAccount,
    shared_kannada_search_count: sharedHits.length,
    shared_kannada_candidates: sharedHits,
  };

  const outPath = path.join(REPORTS, "available-voices.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

  console.log("=== ElevenLabs voice discovery ===");
  console.log(`Account voices found: ${sanitizedAccount.length}`);
  console.log(`Account voices with Kannada labels: ${accountKannada.length}`);
  console.log(`Shared-library Kannada search hits: ${sharedHits.length}`);
  console.log(`Kannada-capable models: ${kannadaModels.join(", ") || "(none detected)"}`);
  if (subscription) {
    console.log(
      `Subscription: ${subscription.tier} · ${subscription.character_count}/${subscription.character_limit} characters used`
    );
  }
  if (sharedHits.length) {
    console.log("\nTop shared Kannada candidates:");
    for (const v of sharedHits.slice(0, 8)) {
      console.log(
        `  ${v.score.toString().padStart(3)}  ${v.voice_id}  ${v.name}  [${v.gender}/${v.age}/${v.use_case}]`
      );
    }
  }
  console.log(`\nWrote ${outPath}`);
  console.log(
    "Next: review reports/kannada-voice-shortlist.md, then:\n  node scripts/generate-auditions.mjs --dry-run"
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
