import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Same two sources as tools/tts_eleven.py, in the same order, so both
// pipelines authenticate identically. Never a literal in this repo.
const KEYFILE = path.join(os.homedir(), ".elevenlabs_key");

let cached = null;

/**
 * The API key, from ELEVENLABS_API_KEY or ~/.elevenlabs_key.
 * The value is never printed, logged or written to any generated file.
 */
export function apiKey() {
  if (cached) return cached;
  let k = process.env.ELEVENLABS_API_KEY;
  if (!k && fs.existsSync(KEYFILE)) k = fs.readFileSync(KEYFILE, "utf8").trim();
  if (!k) {
    console.error(
      "No ElevenLabs API key found.\n" +
      "  export ELEVENLABS_API_KEY=...\n" +
      "or put it in ~/.elevenlabs_key (chmod 600).\n" +
      "Never hardcode it and never commit it."
    );
    process.exit(2);
  }
  cached = k;
  return cached;
}

/** True if a key is reachable, without reading or revealing it. */
export function hasKey() {
  return Boolean(process.env.ELEVENLABS_API_KEY) || fs.existsSync(KEYFILE);
}

/** Where the key came from, for logs. Never the value. */
export function keySource() {
  if (process.env.ELEVENLABS_API_KEY) return "env:ELEVENLABS_API_KEY";
  if (fs.existsSync(KEYFILE)) return "file:~/.elevenlabs_key";
  return "none";
}
