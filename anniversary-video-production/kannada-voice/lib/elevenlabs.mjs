/**
 * Shared ElevenLabs helpers for the Kannada voice pipeline.
 * Never logs the API key or Authorization / xi-api-key headers.
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export const API_BASE = "https://api.elevenlabs.io";

/** Kannada is supported by eleven_v3 only among current TTS models. */
export const KANNADA_MODEL_ID = "eleven_v3";

/**
 * Models known to accept speed in voice_settings.
 * eleven_v3 does not expose reliable speed control; omit speed for it.
 */
export const MODELS_WITH_SPEED = new Set([
  "eleven_multilingual_v2",
  "eleven_turbo_v2",
  "eleven_turbo_v2_5",
  "eleven_flash_v2",
  "eleven_flash_v2_5",
  "eleven_multilingual_sts_v2",
]);

export const DEFAULT_OUTPUT_FORMAT = "mp3_44100_128";

export function requireApiKey() {
  let key = process.env.ELEVENLABS_API_KEY?.trim();
  if (!key) {
    const keyfile = path.join(os.homedir(), ".elevenlabs_key");
    if (fs.existsSync(keyfile)) {
      key = fs.readFileSync(keyfile, "utf8").trim();
      if (key) {
        process.env.ELEVENLABS_API_KEY = key;
      }
    }
  }
  if (!key) {
    throw new Error(
      "Missing ELEVENLABS_API_KEY.\n" +
        "  export ELEVENLABS_API_KEY=...\n" +
        "or put the key in ~/.elevenlabs_key (chmod 600).\n" +
        "Never hardcode the key or commit it."
    );
  }
  return key;
}

function headers(json = false) {
  const h = { "xi-api-key": requireApiKey() };
  if (json) {
    h["Content-Type"] = "application/json";
  }
  return h;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch with retries for 429 / 5xx. Never logs headers.
 */
export async function apiFetch(pathname, options = {}, { retries = 4 } = {}) {
  const url = pathname.startsWith("http") ? pathname : `${API_BASE}${pathname}`;
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
        const body = await res.text();
        const wait = Math.min(30_000, 1000 * 2 ** attempt);
        if (attempt < retries) {
          console.warn(
            `  HTTP ${res.status}; retrying in ${wait}ms (attempt ${attempt + 1}/${retries})`
          );
          await sleep(wait);
          continue;
        }
        throw new Error(`HTTP ${res.status} after retries: ${body.slice(0, 400)}`);
      }
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < retries && !(err.message || "").startsWith("HTTP ")) {
        const wait = Math.min(15_000, 800 * 2 ** attempt);
        console.warn(`  Network error; retrying in ${wait}ms: ${err.message}`);
        await sleep(wait);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export async function apiJson(pathname, options = {}) {
  const res = await apiFetch(pathname, {
    ...options,
    headers: { ...headers(Boolean(options.body)), ...(options.headers || {}) },
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text.slice(0, 500) };
  }
  if (!res.ok) {
    const detail =
      data?.detail?.message ||
      data?.detail ||
      data?.message ||
      text.slice(0, 400);
    const err = new Error(`HTTP ${res.status}: ${typeof detail === "string" ? detail : JSON.stringify(detail)}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function listAccountVoices() {
  const data = await apiJson("/v1/voices");
  return data.voices || [];
}

export async function searchSharedVoices(params = {}) {
  const qs = new URLSearchParams(params);
  const data = await apiJson(`/v1/shared-voices?${qs}`);
  return data;
}

export async function getSubscription() {
  try {
    return await apiJson("/v1/user/subscription");
  } catch {
    return null;
  }
}

export async function getModels() {
  return await apiJson("/v1/models");
}

/**
 * Add a Voice Library / shared voice into this account so TTS can use it.
 * Idempotent enough: if already present, ElevenLabs usually returns success or a clear error.
 */
export async function addSharedVoice(publicOwnerId, voiceId, newName) {
  const body = JSON.stringify({ new_name: newName });
  return apiJson(`/v1/voices/add/${publicOwnerId}/${voiceId}`, {
    method: "POST",
    body,
  });
}

/**
 * Build voice_settings for a model. Omits unsupported fields.
 */
export function buildVoiceSettings(modelId, settings = {}) {
  const out = {
    stability: settings.stability ?? 0.5,
    similarity_boost: settings.similarity_boost ?? 0.75,
    use_speaker_boost: settings.use_speaker_boost !== false,
  };
  if (typeof settings.style === "number" && modelId !== KANNADA_MODEL_ID) {
    out.style = settings.style;
  } else if (typeof settings.style === "number" && modelId === KANNADA_MODEL_ID) {
    // eleven_v3 historically ignores style; omit to avoid 422 on strict plans.
  }
  if (
    typeof settings.speed === "number" &&
    MODELS_WITH_SPEED.has(modelId)
  ) {
    out.speed = settings.speed;
  }
  return out;
}

/**
 * Synthesize speech to a file. Returns { bytes, path, dryRun }.
 */
export async function textToSpeech({
  voiceId,
  text,
  outPath,
  modelId = KANNADA_MODEL_ID,
  languageCode = "kn",
  settings = {},
  outputFormat = DEFAULT_OUTPUT_FORMAT,
  dryRun = false,
}) {
  const voiceSettings = buildVoiceSettings(modelId, settings);
  const body = {
    text,
    model_id: modelId,
    voice_settings: voiceSettings,
  };
  if (languageCode && modelId === KANNADA_MODEL_ID) {
    body.language_code = languageCode;
  }

  if (dryRun) {
    return {
      dryRun: true,
      path: outPath,
      bytes: 0,
      request: {
        method: "POST",
        url: `/v1/text-to-speech/${voiceId}?output_format=${outputFormat}`,
        body,
      },
    };
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const res = await apiFetch(
    `/v1/text-to-speech/${voiceId}?output_format=${outputFormat}`,
    {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    // Retry once without language_code / style if validation fails.
    if (res.status === 422) {
      const fallbackBody = {
        text,
        model_id: modelId,
        voice_settings: {
          stability: voiceSettings.stability,
          similarity_boost: voiceSettings.similarity_boost,
          use_speaker_boost: voiceSettings.use_speaker_boost,
        },
      };
      const retry = await apiFetch(
        `/v1/text-to-speech/${voiceId}?output_format=${outputFormat}`,
        {
          method: "POST",
          headers: headers(true),
          body: JSON.stringify(fallbackBody),
        }
      );
      if (!retry.ok) {
        const t2 = await retry.text();
        throw new Error(`HTTP ${retry.status} TTS: ${t2.slice(0, 400)}`);
      }
      const buf2 = Buffer.from(await retry.arrayBuffer());
      fs.writeFileSync(outPath, buf2);
      return { dryRun: false, path: outPath, bytes: buf2.length, usedFallbackSettings: true };
    }
    throw new Error(`HTTP ${res.status} TTS: ${errText.slice(0, 400)}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  return { dryRun: false, path: outPath, bytes: buf.length };
}

export function slugifyVoiceName(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "voice";
}

export function sanitizeVoiceRecord(voice) {
  return {
    voice_id: voice.voice_id,
    name: voice.name,
    category: voice.category || null,
    description: voice.description || null,
    preview_url: voice.preview_url || null,
    labels: voice.labels || {},
    language: voice.labels?.language || voice.language || null,
    accent: voice.labels?.accent || voice.accent || null,
    gender: voice.labels?.gender || voice.gender || null,
    age: voice.labels?.age || voice.age || null,
    use_case: voice.labels?.use_case || voice.use_case || null,
    verified_languages: voice.verified_languages || null,
    fine_tuning: voice.fine_tuning
      ? { is_allowed_to_fine_tune: voice.fine_tuning.is_allowed_to_fine_tune }
      : null,
    high_quality_base_model_ids: voice.high_quality_base_model_ids || [],
    available_for_tiers: voice.available_for_tiers || null,
    sharing: voice.sharing
      ? {
          status: voice.sharing.status,
          category: voice.sharing.category,
        }
      : null,
  };
}

export function appendCsvLog(filePath, row, header) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const needsHeader = !fs.existsSync(filePath) || fs.statSync(filePath).size === 0;
  const escape = (v) => {
    const s = v == null ? "" : String(v);
    if (/[",\n]/.test(s)) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const line = header.map((k) => escape(row[k])).join(",") + "\n";
  if (needsHeader) {
    fs.writeFileSync(filePath, header.join(",") + "\n" + line, "utf8");
  } else {
    fs.appendFileSync(filePath, line, "utf8");
  }
}
