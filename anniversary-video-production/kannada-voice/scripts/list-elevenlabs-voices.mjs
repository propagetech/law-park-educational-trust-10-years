#!/usr/bin/env node
/**
 * Every voice on this ElevenLabs account, ranked for Kannada documentary
 * narration. Reads nothing from the network but the voice list, spends no
 * TTS characters, and never writes the API key anywhere.
 *
 *   node scripts/list-elevenlabs-voices.mjs
 *   node scripts/list-elevenlabs-voices.mjs --json      # machine-readable only
 *
 * Writes:
 *   reports/available-voices.json    sanitized, every voice, full metadata
 *   reports/kannada-candidates.json  the ranked candidates with their evidence
 *
 * HOW A VOICE QUALIFIES
 * `verified_languages` is the field that matters. A voice with a verified
 * Kannada entry has a real Kannada preview behind it and names the model that
 * produced it. `labels` and free-text descriptions are weaker evidence and are
 * ranked below. A voice with neither is tier 3 at best: broadly Indian, and
 * only usable if a Kannada speaker signs off on the preview.
 */

import fs from "node:fs";
import path from "node:path";
import { listVoices, sharedVoices, subscription, KANNADA_MODELS } from "../lib/eleven.mjs";
import { keySource } from "../lib/key.mjs";
import { REPORTS, AVAILABLE_VOICES } from "../lib/paths.mjs";

const KANNADA_CODES = new Set(["kn", "kan", "kannada"]);
const INDIAN_CODES = new Set([
  "hi", "hin", "ta", "tam", "te", "tel", "ml", "mal", "mr", "mar",
  "gu", "guj", "bn", "ben", "pa", "pan", "ur", "urd", "as", "asm",
]);

const argv = process.argv.slice(2);
const jsonOnly = argv.includes("--json");

/** Keep the fields that decide the cast; drop bulk we do not need. */
function sanitize(v) {
  return {
    voice_id: v.voice_id,
    name: v.name,
    category: v.category,
    is_owner: v.is_owner,
    description: v.description ?? null,
    preview_url: v.preview_url ?? null,
    labels: v.labels ?? {},
    verified_languages: (v.verified_languages ?? []).map((l) => ({
      language: l.language,
      locale: l.locale ?? null,
      accent: l.accent ?? null,
      model_id: l.model_id ?? null,
      preview_url: l.preview_url ?? null,
    })),
    high_quality_base_model_ids: v.high_quality_base_model_ids ?? [],
    recording_quality: v.recording_quality ?? null,
    default_settings: v.settings ?? null,
    created_at_unix: v.created_at_unix ?? null,
    sample_count: (v.samples ?? []).length,
  };
}

function kannadaEvidence(v) {
  const verified = (v.verified_languages ?? [])
    .filter((l) => KANNADA_CODES.has(String(l.language ?? "").toLowerCase()));
  const labelText = Object.values(v.labels ?? {}).join(" ").toLowerCase();
  const freeText = `${v.name ?? ""} ${v.description ?? ""}`.toLowerCase();
  const labelled = labelText.includes("kannada");
  const named = freeText.includes("kannada");
  const otherIndian = (v.verified_languages ?? [])
    .some((l) => INDIAN_CODES.has(String(l.language ?? "").toLowerCase()));

  const v3Verified = verified.some((l) => KANNADA_MODELS.has(l.model_id));
  const v3Capable = (v.high_quality_base_model_ids ?? [])
    .some((m) => KANNADA_MODELS.has(m) || String(m).includes("v3"));

  let tier, why;
  if (verified.length) {
    tier = 1;
    why = `verified_languages lists Kannada` +
      (v3Verified ? ` verified on ${verified.map((l) => l.model_id).filter(Boolean).join("/")}` : "") +
      (verified[0].accent ? `, accent ${verified[0].accent}` : "");
  } else if (labelled || named) {
    tier = 2;
    why = labelled ? "labels mention Kannada" : "name or description mentions Kannada";
  } else if (otherIndian) {
    tier = 3;
    why = "other Indian languages verified, Kannada not verified";
  } else {
    tier = 4;
    why = "no Kannada or Indian-language evidence";
  }
  return { tier, why, verified, v3Verified, v3Capable, otherIndian };
}

/** Age and gender read from labels, for the brief's 35 to 50 female target. */
function persona(v) {
  const l = v.labels ?? {};
  return {
    gender: (l.gender ?? "").toLowerCase() || null,
    age: (l.age ?? "").toLowerCase() || null,
    accent: (l.accent ?? "").toLowerCase() || null,
    use_case: (l.use_case ?? l.use_cases ?? "").toString().toLowerCase() || null,
    descriptive: (l.descriptive ?? "").toLowerCase() || null,
  };
}

/**
 * Fit against the brief, on metadata alone. This is a shortlisting aid, not a
 * verdict: nothing here can hear the voice.
 */
function fitNotes(v, ev) {
  const p = persona(v);
  const good = [], risk = [];

  if (p.gender === "female") good.push("female, the brief's primary target");
  else if (p.gender === "male") risk.push("male, the brief's alternative rather than primary");

  if (p.age && /middle|mature|old/.test(p.age)) good.push(`age impression ${p.age}`);
  else if (p.age && /young/.test(p.age)) risk.push(`age impression ${p.age}, brief wants 35 to 50`);

  if (p.use_case && /narrat|audiobook|document|informat/.test(p.use_case)) {
    good.push(`use case ${p.use_case}`);
  } else if (p.use_case && /advertis|social|game|charact/.test(p.use_case)) {
    risk.push(`use case ${p.use_case}, wrong register for a trust film`);
  }

  if (v.category === "professional") {
    risk.push("Professional Voice Clone: documented as weaker on v3 than " +
             "designed voices or Instant Voice Clones");
  }
  if (!ev.v3Capable && !ev.v3Verified) {
    risk.push("no v3 model listed, and v3 is the only model that speaks Kannada");
  }
  if (ev.tier === 3) {
    risk.push("Kannada unverified: a Kannada speaker must approve the preview " +
             "before this voice is auditioned further");
  }
  return { good, risk, persona: p };
}

const rank = (a, b) =>
  a.evidence.tier - b.evidence.tier ||
  Number(b.evidence.v3Verified) - Number(a.evidence.v3Verified) ||
  Number(b.fit.good.length) - Number(a.fit.good.length) ||
  a.voice.name.localeCompare(b.voice.name);

async function main() {
  if (!jsonOnly) console.error(`key source: ${keySource()}`);

  let sub = null;
  try { sub = await subscription(); } catch { /* not fatal */ }

  const { voices, total } = await listVoices();
  const clean = voices.map(sanitize);

  const scored = clean.map((v) => {
    const evidence = kannadaEvidence(v);
    return { voice: v, evidence, fit: fitNotes(v, evidence) };
  }).sort(rank);

  const candidates = scored.filter((s) => s.evidence.tier <= 3);

  // The account holds no Kannada voice, so the library has to be searched too
  // or the casting question has no answer. These are NOT usable until added.
  let library = [];
  let libraryError = null;
  try {
    library = await sharedVoices({ language: "kn" });
  } catch (e) {
    libraryError = e.message;
  }
  const libRanked = library.map((v) => ({
    voice_id: v.voice_id,
    public_owner_id: v.public_owner_id,
    name: (v.name || "").trim(),
    category: v.category,
    gender: v.gender ?? v.labels?.gender ?? null,
    age: v.age ?? v.labels?.age ?? null,
    accent: v.accent ?? v.labels?.accent ?? null,
    language: v.language ?? null,
    use_case: v.use_case ?? null,
    descriptive: v.descriptive ?? null,
    description: v.description ?? null,
    preview_url: v.preview_url ?? null,
    verified_languages: (v.verified_languages ?? []).map((l) => ({
      language: l.language, accent: l.accent ?? null, model_id: l.model_id ?? null,
    })),
    free_users_allowed: v.free_users_allowed ?? null,
    notice_period: v.notice_period ?? null,
    in_account: false,
    v3_risk: v.category === "professional"
      ? "Professional Voice Clone: documented as weaker on v3, and v3 is the " +
        "only model that speaks Kannada"
      : null,
  })).sort((a, b) =>
    (a.category === "professional") - (b.category === "professional") ||
    a.name.localeCompare(b.name));

  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(AVAILABLE_VOICES, JSON.stringify({
    generated_at: new Date().toISOString(),
    note: "Sanitized voice list. No API key or request header is recorded here.",
    account: sub ? { tier: sub.tier, characters_remaining: sub.remaining } : null,
    total_reported_by_api: total,
    voice_count: clean.length,
    kannada_model_ids: [...KANNADA_MODELS],
    account_kannada_voice_count: scored.filter((s) => s.evidence.tier <= 2).length,
    voice_library_kannada: {
      note: "Public Voice Library matches for language=kn. NOT usable until " +
            "added to the account: see scripts/add-shared-voice.mjs.",
      error: libraryError,
      count: libRanked.length,
      voices: libRanked,
    },
    voices: clean,
  }, null, 2) + "\n");

  fs.writeFileSync(path.join(REPORTS, "kannada-candidates.json"),
    JSON.stringify({
      generated_at: new Date().toISOString(),
      tiers: {
        1: "verified_languages lists Kannada",
        2: "labels, name or description mention Kannada, not verified",
        3: "other Indian languages verified, Kannada not verified",
        4: "no Kannada or Indian-language evidence (excluded)",
      },
      candidates: candidates.map((c) => ({
        voice_id: c.voice.voice_id,
        name: c.voice.name,
        tier: c.evidence.tier,
        why: c.evidence.why,
        v3_verified_for_kannada: c.evidence.v3Verified,
        v3_capable: c.evidence.v3Capable,
        category: c.voice.category,
        persona: c.fit.persona,
        strengths: c.fit.good,
        risks: c.fit.risk,
        preview_url: c.voice.preview_url,
        kannada_preview_url: c.evidence.verified[0]?.preview_url ?? null,
        description: c.voice.description,
      })),
    }, null, 2) + "\n");

  if (jsonOnly) {
    console.log(JSON.stringify(candidates.map((c) => ({
      voice_id: c.voice.voice_id, name: c.voice.name, tier: c.evidence.tier,
    })), null, 2));
    return;
  }

  const byTier = (t) => scored.filter((s) => s.evidence.tier === t).length;
  console.log(`\n${clean.length} voices on this account` +
    (sub ? `  ·  plan ${sub.tier}  ·  ${sub.remaining.toLocaleString()} characters remaining` : ""));
  console.log(`Kannada evidence: tier 1 verified ${byTier(1)}  ·  ` +
    `tier 2 claimed ${byTier(2)}  ·  tier 3 Indian only ${byTier(3)}  ·  ` +
    `tier 4 none ${byTier(4)}\n`);

  console.log(`${"tier".padEnd(5)}${"voice_id".padEnd(24)}${"name".padEnd(26)}` +
    `${"v3".padEnd(4)}${"gender".padEnd(8)}${"age".padEnd(14)}category`);
  for (const c of candidates) {
    const p = c.fit.persona;
    console.log(
      String(c.evidence.tier).padEnd(5) +
      c.voice.voice_id.padEnd(24) +
      (c.voice.name ?? "").slice(0, 25).padEnd(26) +
      (c.evidence.v3Verified ? "yes" : c.evidence.v3Capable ? "cap" : "-").padEnd(4) +
      (p.gender ?? "-").padEnd(8) +
      (p.age ?? "-").slice(0, 13).padEnd(14) +
      (c.voice.category ?? "-"));
  }

  console.log(`\nVoice Library, search=kannada: ${libRanked.length} Kannada voices found` +
    (libraryError ? `  (search failed: ${libraryError})` : "") +
    `\nNone of these is in the account yet. Adding one is an account change.\n`);
  console.log(`${"voice_id".padEnd(24)}${"name".padEnd(38)}${"category".padEnd(14)}` +
    `${"gender".padEnd(8)}free?`);
  for (const v of libRanked) {
    console.log(
      v.voice_id.padEnd(24) +
      v.name.slice(0, 37).padEnd(38) +
      (v.category ?? "-").padEnd(14) +
      String(v.gender ?? "-").padEnd(8) +
      (v.free_users_allowed === null ? "-" : String(v.free_users_allowed)));
  }

  console.log(`\nwrote ${path.relative(process.cwd(), AVAILABLE_VOICES)}`);
  console.log(`wrote ${path.relative(process.cwd(), path.join(REPORTS, "kannada-candidates.json"))}`);
  console.log(
    `\n${candidates.length} candidates at tier 3 or better. Nothing here has ` +
    `heard a voice:\nthese are metadata rankings. Audition the top of the list ` +
    `and judge by ear.\n  node scripts/generate-auditions.mjs --dry-run\n`);
}

main().catch((e) => { console.error(`\n${e.message}\n`); process.exit(1); });
