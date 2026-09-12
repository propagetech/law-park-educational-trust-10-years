/**
 * Everything that must be true before a single character is spent.
 *
 * This exists because of what the account actually looks like. At the time
 * this pipeline was written the connected account was:
 *
 *   plan free  ·  10,000 characters per month  ·  0 remaining
 *   21 voices, all English premade, zero Kannada
 *
 * So a naive run does not fail cleanly. It fails 36 times in a row against a
 * quota that is already spent, on voices that cannot speak Kannada, under a
 * plan with no commercial licence. Each of those is checked here instead, once,
 * with the remedy in the message.
 *
 * The commercial licence check is not a technical nicety. ElevenLabs grants a
 * commercial licence from the Starter tier upward; the free tier does not carry
 * one. This film is screened at a public event and published by a registered
 * trust, so narration generated on a free plan would leave the trust using
 * audio it is not licensed to use. That is a rights problem of the same kind
 * as the music and photo consents already tracked in `14`.
 */

import { subscription, listVoices, isKannadaCapable, KANNADA_MODELS,
         formatAllowedForTier } from "./eleven.mjs";
import { hasKey, keySource } from "./key.mjs";
import { assertYearMapMatchesPython, assertNoStrayTags, speakText } from "./speak-text.mjs";

/** Plans that carry a commercial licence, cheapest first. */
const COMMERCIAL_TIERS = new Set([
  "starter", "creator", "pro", "scale", "business", "enterprise",
]);

export class PreflightError extends Error {}

/**
 * @param {object} o
 * @param {string} o.modelId
 * @param {Array<{voice_id:string,name?:string}>} o.voices  voices to be used
 * @param {Array<string>} o.texts  the exact texts that will be sent
 * @param {boolean} o.dryRun
 * @param {boolean} o.allowNoncommercial  proceed on a plan with no licence
 * @param {boolean} o.allowMissingVoices  proceed though a voice is not in the account
 */
export async function preflight({
  modelId, voices, texts, dryRun = false, outputFormat,
  allowNoncommercial = false, allowMissingVoices = false,
}) {
  const notes = [];
  const blockers = [];

  // 1. Key
  if (!hasKey()) {
    throw new PreflightError(
      "No ElevenLabs API key.\n" +
      "  export ELEVENLABS_API_KEY=...   or put it in ~/.elevenlabs_key (chmod 600)");
  }
  notes.push(`key source: ${keySource()}`);

  // 2. Model must be able to speak Kannada at all
  if (!isKannadaCapable(modelId)) {
    blockers.push(
      `model ${modelId} does not support Kannada. Use one of: ` +
      `${[...KANNADA_MODELS].join(", ")}. Multilingual v2, Turbo v2.5 and ` +
      `Flash v2.5 all omit Kannada and will return an error or audio that is ` +
      `not Kannada.`);
  }

  // 3. The year map must agree with the Python renderer
  const ymap = assertYearMapMatchesPython();
  notes.push(ymap.checked
    ? `year map agrees with tools/tts_eleven.py (${ymap.entries} entries)`
    : `year map not cross-checked: ${ymap.reason}`);

  // 4. No script pause notation may reach v3, which reads brackets as tags
  texts.forEach((t, i) => assertNoStrayTags(speakText(t), `text[${i}]`));
  notes.push(`${texts.length} texts carry no stray delivery tags`);

  // 5. Characters. Counted on the text that will actually be sent.
  const characters = texts.reduce((n, t) => n + [...speakText(t)].length, 0);

  let sub = null;
  try {
    sub = await subscription();
  } catch (e) {
    notes.push(`could not read the subscription: ${e.message}`);
  }

  if (sub) {
    notes.push(
      `plan ${sub.tier}  ·  ${sub.character_count?.toLocaleString()} of ` +
      `${sub.character_limit?.toLocaleString()} characters used  ·  ` +
      `${sub.remaining?.toLocaleString()} remaining`);

    if (!dryRun && characters > sub.remaining) {
      blockers.push(
        `this run needs ${characters.toLocaleString()} characters and the plan ` +
        `has ${sub.remaining?.toLocaleString()} left.\n` +
        `      Either upgrade the plan, wait for the monthly reset, or cut the ` +
        `run down with --voices or --takes.\n` +
        `      Nothing was sent, so no characters were spent.`);
    }

    const tier = String(sub.tier ?? "").toLowerCase();
    if (!COMMERCIAL_TIERS.has(tier)) {
      const msg =
        `plan "${sub.tier}" does not carry a commercial licence. ElevenLabs ` +
        `grants one from Starter upward.\n` +
        `      This film is screened publicly and published by a registered ` +
        `trust, so narration generated here would not be licensed for the use ` +
        `it is being made for.\n` +
        `      Upgrade before generating anything that will reach the final ` +
        `cut. Pass --allow-noncommercial only for a throwaway pronunciation ` +
        `test that will never be used.`;
      if (allowNoncommercial && !dryRun) notes.push(`OVERRIDDEN: ${msg}`);
      else if (!dryRun) blockers.push(msg);
      else notes.push(`plan has no commercial licence (dry run, not blocking)`);
    }
  }

  // 5b. The output format must be permitted by the plan. Checked here because
  //     a format the plan disallows fails on every request with a 403 that
  //     reads like a rejected key.
  if (outputFormat && sub) {
    const fmt = formatAllowedForTier(outputFormat, sub.tier);
    if (!fmt.allowed) blockers.push(fmt.why);
    else notes.push(`output format ${outputFormat} allowed on ${sub.tier}` +
      (fmt.why ? ` (${fmt.why})` : ""));
  }

  // 6. Every voice must be in the account. Library voices are not usable
  //    until added, and adding one is an account change.
  let account = [];
  try {
    account = (await listVoices()).voices;
  } catch (e) {
    notes.push(`could not list account voices: ${e.message}`);
  }
  const have = new Set(account.map((v) => v.voice_id));
  const missing = voices.filter((v) => !have.has(v.voice_id));
  if (missing.length) {
    const msg =
      `${missing.length} of ${voices.length} voices are not in this account:\n` +
      missing.map((v) => `        ${v.voice_id}  ${v.name ?? ""}`).join("\n") + "\n" +
      `      A Voice Library voice must be added to the account before it can ` +
      `be generated with:\n` +
      `        node scripts/add-shared-voice.mjs --voice-id <id>\n` +
      `      That changes the account and may consume a voice slot, so it is ` +
      `never done automatically.`;
    if (allowMissingVoices || dryRun) notes.push(msg);
    else blockers.push(msg);
  }

  return {
    ok: blockers.length === 0,
    blockers,
    notes,
    characters,
    subscription: sub,
    outputFormat,
    accountVoiceCount: account.length,
    missingVoices: missing,
  };
}

/** Print the preflight and exit non-zero if it did not pass. */
export function reportPreflight(pf, { dryRun = false } = {}) {
  for (const n of pf.notes) console.error(`  · ${n}`);
  console.error(`  · this run would send ${pf.characters.toLocaleString()} characters`);
  if (pf.ok) {
    console.error(dryRun ? "\npreflight passed (dry run)\n" : "\npreflight passed\n");
    return;
  }
  console.error(`\npreflight failed, nothing was sent:\n`);
  for (const b of pf.blockers) console.error(`  ${b}\n`);
  process.exit(3);
}
