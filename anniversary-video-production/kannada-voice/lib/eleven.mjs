/**
 * ElevenLabs client and capability model for the Kannada narration.
 *
 * The one fact this file exists to enforce: Kannada is supported by the
 * Eleven v3 family ONLY. Multilingual v2, Turbo v2.5 and Flash v2.5 do not
 * list Kannada, and they are the default in almost every SDK example. Sending
 * Kannada to one of them returns an error or, worse, fluent-sounding audio
 * that is not Kannada.
 *
 * The second fact, which the voice brief does not account for: v3 has no
 * `speed` parameter, no `style` parameter and no SSML breaks, and its
 * stability is a three-point named scale rather than a continuous float.
 * Any per-scene speed or style number is editorial intent, not an API field.
 * buildVoiceSettings() drops those fields, snaps stability to the real scale,
 * and reports exactly what it did so the log records intent and payload both.
 *
 * The key is read through lib/key.mjs and never logged. No function here
 * prints headers.
 */

import { apiKey } from "./key.mjs";

export const API_BASE = "https://api.elevenlabs.io";

/** Models that list Kannada. Nothing else may be used for this film. */
export const KANNADA_MODELS = new Set([
  "eleven_v3",
  "eleven_v3_conversational",
]);

export const DEFAULT_MODEL = "eleven_v3";

/**
 * v3 stability is documented as three named points, not a slider:
 *   Creative  more expressive, prone to hallucination
 *   Natural   closest to the original recording, balanced
 *   Robust    very stable, less responsive to direction
 * The HTTP API still wants a float, so the bands map onto these values.
 */
export const V3_STABILITY = { creative: 0.0, natural: 0.5, robust: 1.0 };

/** Models known to accept a continuous `speed` in voice_settings. */
const MODELS_WITH_SPEED = new Set([
  "eleven_multilingual_v2",
  "eleven_turbo_v2",
  "eleven_turbo_v2_5",
  "eleven_flash_v2",
  "eleven_flash_v2_5",
]);

/** Models known to accept `style`. v3 does not document one. */
const MODELS_WITH_STYLE = new Set([
  "eleven_multilingual_v2",
  "eleven_turbo_v2",
  "eleven_turbo_v2_5",
  "eleven_flash_v2",
  "eleven_flash_v2_5",
]);

/** Models whose stability is the three-point v3 scale. */
const MODELS_WITH_BANDED_STABILITY = KANNADA_MODELS;

export function isKannadaCapable(modelId) {
  return KANNADA_MODELS.has(modelId);
}

/**
 * mp3_44100_192 needs Creator or above; PCM/WAV at 44.1k needs Pro.
 * 128 works on every paid tier and is transparent enough for an audition.
 */
export const OUTPUT_FORMATS = {
  "mp3_44100_128": { ext: "mp3", tier: "any paid", note: "audition default" },
  "mp3_44100_192": { ext: "mp3", tier: "Creator+", note: "final default" },
  "pcm_44100": { ext: "pcm", tier: "Pro+", note: "raw, needs a WAV header" },
};

/** Nearest of the three v3 stability points, and the band's name. */
function snapStability(value) {
  const entries = Object.entries(V3_STABILITY);
  let best = entries[0];
  for (const e of entries) {
    if (Math.abs(e[1] - value) < Math.abs(best[1] - value)) best = e;
  }
  return { band: best[0], value: best[1] };
}

/**
 * Turn an editorial settings block into a payload the chosen model actually
 * honours.
 *
 * Returns { settings, dropped, snapped, intent } where `settings` is safe to
 * send, `dropped` names fields the model does not support, `snapped` records
 * values that were moved onto a real scale, and `intent` preserves what was
 * asked for so the generation log can show both.
 */
export function buildVoiceSettings(modelId, requested = {}) {
  const intent = { ...requested };
  const settings = {};
  const dropped = [];
  const snapped = [];

  // stability
  if (requested.stability !== undefined) {
    if (MODELS_WITH_BANDED_STABILITY.has(modelId)) {
      if (typeof requested.stability === "string") {
        const band = requested.stability.toLowerCase();
        if (!(band in V3_STABILITY)) {
          throw new Error(
            `stability "${requested.stability}" is not a v3 band. ` +
            `Use one of: ${Object.keys(V3_STABILITY).join(", ")}`);
        }
        settings.stability = V3_STABILITY[band];
      } else {
        const s = snapStability(requested.stability);
        settings.stability = s.value;
        if (s.value !== requested.stability) {
          snapped.push({
            field: "stability",
            requested: requested.stability,
            sent: s.value,
            band: s.band,
            why: `${modelId} stability is the three-point scale ` +
                 `creative/natural/robust, not a continuous float`,
          });
        }
      }
    } else {
      settings.stability = requested.stability;
    }
  }

  // similarity_boost, supported everywhere
  if (requested.similarity_boost !== undefined) {
    settings.similarity_boost = requested.similarity_boost;
  }

  // use_speaker_boost, supported everywhere
  settings.use_speaker_boost = requested.use_speaker_boost ?? true;

  // style
  if (requested.style !== undefined) {
    if (MODELS_WITH_STYLE.has(modelId)) settings.style = requested.style;
    else dropped.push({
      field: "style",
      requested: requested.style,
      why: `${modelId} does not document a style parameter. Style on v3 comes ` +
           `from the text: punctuation, ellipses, capitals and audio tags`,
    });
  }

  // speed
  if (requested.speed !== undefined) {
    if (MODELS_WITH_SPEED.has(modelId)) settings.speed = requested.speed;
    else dropped.push({
      field: "speed",
      requested: requested.speed,
      why: `${modelId} has no speed parameter and no SSML breaks. Pace comes ` +
           `from punctuation. Re-time the picture to the read instead`,
    });
  }

  return { settings, dropped, snapped, intent };
}

/** One-line human summary of what buildVoiceSettings decided. */
export function describeSettings(built) {
  const bits = Object.entries(built.settings)
    .map(([k, v]) => `${k}=${v}`).join(" ");
  const notes = [];
  for (const s of built.snapped) notes.push(`${s.field} ${s.requested}->${s.sent}`);
  for (const d of built.dropped) notes.push(`${d.field} dropped`);
  return bits + (notes.length ? `  [${notes.join(", ")}]` : "");
}

const RETRYABLE = new Set([408, 429, 500, 502, 503, 504]);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * One HTTP call with retry on rate limits and transient failures.
 * `label` appears in errors; the key and headers never do.
 */
async function call(pathname, { method = "GET", body, query, accept } = {}, label = "") {
  const url = new URL(API_BASE + pathname);
  for (const [k, v] of Object.entries(query || {})) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }

  const headers = { "xi-api-key": apiKey() };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (accept) headers["Accept"] = accept;

  const maxAttempts = 5;
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let res;
    try {
      res = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (e) {
      lastErr = new Error(`network error on ${method} ${pathname}${label ? ` (${label})` : ""}: ${e.message}`);
      if (attempt === maxAttempts) throw lastErr;
      await sleep(Math.min(30000, 1000 * 2 ** (attempt - 1)));
      continue;
    }

    if (res.ok) return res;

    const detail = (await res.text().catch(() => "")).slice(0, 600);

    if (res.status === 401 || res.status === 403) {
      throw new Error(
        `${res.status}: the API key was rejected or lacks permission. ` +
        `Check the key in ELEVENLABS_API_KEY or ~/.elevenlabs_key. ${detail}`);
    }
    if (res.status === 422) {
      throw new Error(
        `422 on ${label || pathname}. Usually the model cannot handle the ` +
        `language, or the voice is not valid for this model. Kannada needs ` +
        `${[...KANNADA_MODELS].join(" or ")}. ${detail}`);
    }
    if (!RETRYABLE.has(res.status) || attempt === maxAttempts) {
      throw new Error(`HTTP ${res.status} on ${label || pathname}: ${detail}`);
    }

    const retryAfter = Number(res.headers.get("retry-after"));
    const wait = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : Math.min(30000, 1000 * 2 ** (attempt - 1));
    console.error(`  HTTP ${res.status}, retrying in ${(wait / 1000).toFixed(1)}s ` +
                  `(attempt ${attempt}/${maxAttempts})`);
    await sleep(wait);
  }
  throw lastErr;
}

/**
 * Every voice on the account, paginated. GET /v2/voices carries the fields
 * that decide this cast: verified_languages, labels, descriptive metadata and
 * high_quality_base_model_ids.
 */
export async function listVoices({ pageSize = 100 } = {}) {
  const voices = [];
  let token;
  let total = null;
  for (let page = 0; page < 50; page++) {
    const res = await call("/v2/voices", {
      query: {
        page_size: pageSize,
        next_page_token: token,
        include_total_count: page === 0 ? "true" : undefined,
      },
    }, "list voices");
    const json = await res.json();
    if (total === null && typeof json.total_count === "number") total = json.total_count;
    voices.push(...(json.voices || []));
    if (!json.has_more || !json.next_page_token) break;
    token = json.next_page_token;
  }
  return { voices, total: total ?? voices.length };
}

/**
 * Kannada voices in the public Voice Library.
 *
 * This account holds no Kannada voice, so /v2/voices cannot answer the casting
 * question on its own. A library voice must be ADDED to the account before it
 * can be used, which is an account change and needs a human to approve it:
 * see scripts/add-shared-voice.mjs.
 *
 * `category` matters more than the description here. A "professional" entry is
 * a Professional Voice Clone, which ElevenLabs documents as weaker on v3 than
 * designed or high-quality voices, and v3 is the only model that speaks
 * Kannada. Prefer high_quality for this film.
 */
export async function sharedVoices({ search = "kannada", pageSize = 100 } = {}) {
  // The `language` filter is useless for Kannada: the library tags several
  // Kannada voices with a different primary language (Ishvak, a Kannada
  // speaker, is tagged `hi`), so language=kn returns nothing at all. A free
  // text search on the name and description is what actually finds them.
  // Pagination is by `last_sort_id`, not a page number.
  const out = [];
  let lastSortId;
  for (let page = 0; page < 10; page++) {
    const res = await call("/v1/shared-voices", {
      query: { search, page_size: pageSize, last_sort_id: lastSortId },
    }, "shared voices");
    const json = await res.json();
    const batch = json.voices || [];
    out.push(...batch);
    if (!json.has_more || batch.length === 0 || !json.last_sort_id) break;
    lastSortId = json.last_sort_id;
  }
  // Keep only entries that really mention Kannada somewhere, since a free
  // text search will also drag in near misses.
  return out.filter((v) =>
    `${v.name ?? ""} ${v.description ?? ""} ${v.language ?? ""} ${(v.verified_languages ?? []).map((l) => l.language).join(" ")}`
      .toLowerCase().includes("kannada")
    || (v.verified_languages ?? []).some((l) => ["kn", "kan"].includes(String(l.language).toLowerCase())));
}

/**
 * Add a Voice Library voice to this account. CHANGES ACCOUNT STATE, and on
 * plans with a voice-slot limit it consumes a slot. Never called automatically.
 */
export async function addSharedVoice(publicOwnerId, voiceId, newName) {
  const res = await call(
    `/v1/voices/add/${encodeURIComponent(publicOwnerId)}/${encodeURIComponent(voiceId)}`,
    { method: "POST", body: { new_name: newName } },
    `add shared voice ${voiceId}`);
  return res.json();
}

/** Subscription tier, so output_format choices can be checked before spending. */
export async function subscription() {
  const res = await call("/v1/user/subscription", {}, "subscription");
  const j = await res.json();
  return {
    tier: j.tier,
    character_count: j.character_count,
    character_limit: j.character_limit,
    remaining: (j.character_limit ?? 0) - (j.character_count ?? 0),
  };
}

/**
 * One text-to-speech request. Returns a Buffer of encoded audio.
 * `text` goes as raw UTF-8: the zero-width non-joiner in words like
 * ನೋಟ್‌ಬುಕ್ is meaningful and must not be normalised away.
 */
export async function textToSpeech(voiceId, text, {
  modelId = DEFAULT_MODEL,
  settings = {},
  outputFormat = "mp3_44100_128",
  languageCode,
  seed,
} = {}, label = "") {
  if (!isKannadaCapable(modelId)) {
    throw new Error(
      `refusing to send Kannada to ${modelId}. Kannada is supported by ` +
      `${[...KANNADA_MODELS].join(" and ")} only.`);
  }
  const body = { text, model_id: modelId, voice_settings: settings };
  if (languageCode) body.language_code = languageCode;
  if (seed !== undefined) body.seed = seed;

  const path_ = `/v1/text-to-speech/${encodeURIComponent(voiceId)}`;
  const query = { output_format: outputFormat };

  try {
    const res = await call(path_, {
      method: "POST", body, query, accept: "audio/mpeg",
    }, label || `tts ${voiceId}`);
    return Buffer.from(await res.arrayBuffer());
  } catch (e) {
    // A 422 on a request carrying optional fields is usually one of those
    // fields rather than the text. Retry once with the settings alone before
    // giving up, and say so, because a silent fallback would hide a payload
    // the account does not accept.
    const optional = [languageCode && "language_code", seed !== undefined && "seed"]
      .filter(Boolean);
    if (!/^422/.test(e.message) || optional.length === 0) throw e;

    console.error(`      422 with ${optional.join(" and ")}; retrying with ` +
                  `voice_settings alone`);
    const res = await call(path_, {
      method: "POST",
      body: { text, model_id: modelId, voice_settings: settings },
      query,
      accept: "audio/mpeg",
    }, `${label || `tts ${voiceId}`} (fallback)`);
    return Buffer.from(await res.arrayBuffer());
  }
}

/** The request that would be sent, for --dry-run. Never includes the key. */
export function plannedRequest(voiceId, text, {
  modelId = DEFAULT_MODEL, settings = {}, outputFormat = "mp3_44100_128",
} = {}) {
  return {
    method: "POST",
    path: `/v1/text-to-speech/${voiceId}`,
    query: { output_format: outputFormat },
    body: { text, model_id: modelId, voice_settings: settings },
    characters: [...text].length,
  };
}
