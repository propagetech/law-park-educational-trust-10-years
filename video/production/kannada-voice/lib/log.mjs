/**
 * The sanitized generation log. One row per request, appended.
 * The API key never appears here, and neither do request headers.
 */

import fs from "node:fs";
import path from "node:path";
import { GENERATION_LOG } from "./paths.mjs";

export const LOG_COLUMNS = [
  "timestamp", "kind", "status", "voice_id", "voice_name", "model_id",
  "stability_band", "stability_sent", "similarity_boost", "dropped_fields",
  "snapped_fields", "block_id", "sid", "take", "characters", "output_file",
  "bytes", "duration_s", "note",
];

function cell(v) {
  if (v === undefined || v === null) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function ensureLog() {
  fs.mkdirSync(path.dirname(GENERATION_LOG), { recursive: true });
  if (!fs.existsSync(GENERATION_LOG)) {
    fs.writeFileSync(GENERATION_LOG, LOG_COLUMNS.join(",") + "\n");
  }
}

export function logRow(row) {
  ensureLog();
  fs.appendFileSync(
    GENERATION_LOG,
    LOG_COLUMNS.map((c) => cell(row[c])).join(",") + "\n");
}

/** Build a row from a buildVoiceSettings() result plus the request outcome. */
export function rowFrom({ kind, status, voice, modelId, built, blockId, sid, take,
                          characters, outputFile, bytes, duration, note }) {
  const band = Object.entries({ creative: 0, natural: 0.5, robust: 1 })
    .find(([, v]) => v === built?.settings?.stability);
  return {
    timestamp: new Date().toISOString(),
    kind, status,
    voice_id: voice?.voice_id ?? voice?.id ?? "",
    voice_name: voice?.name ?? "",
    model_id: modelId,
    stability_band: band ? band[0] : "",
    stability_sent: built?.settings?.stability,
    similarity_boost: built?.settings?.similarity_boost,
    dropped_fields: (built?.dropped ?? []).map((d) => `${d.field}=${d.requested}`).join(" "),
    snapped_fields: (built?.snapped ?? []).map((s) => `${s.field}:${s.requested}->${s.sent}`).join(" "),
    block_id: blockId, sid, take,
    characters, output_file: outputFile, bytes,
    duration_s: duration === undefined ? "" : Number(duration).toFixed(3),
    note,
  };
}
