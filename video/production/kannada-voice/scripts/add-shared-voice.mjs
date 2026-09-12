#!/usr/bin/env node
/**
 * Add a Voice Library voice to this account so it can be generated with.
 *
 *   node scripts/add-shared-voice.mjs --list
 *   node scripts/add-shared-voice.mjs --voice-id eESo8CL7VOqMtWCh1ikK
 *   node scripts/add-shared-voice.mjs --voice-id <id> --yes
 *
 * THIS CHANGES THE ACCOUNT. On plans with a voice-slot limit it consumes a
 * slot, and the voice then counts against the account's custom voice count.
 * Nothing else in this pipeline calls it, and it refuses to run without --yes.
 *
 * The shortlist in config/audition-shortlist.json is the intended input. Every
 * voice there is a library voice, because this account holds no Kannada voice
 * of its own.
 */

import fs from "node:fs";
import path from "node:path";
import { addSharedVoice, listVoices } from "../lib/eleven.mjs";
import { CONFIG } from "../lib/paths.mjs";

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };

const shortlistPath = path.join(CONFIG, "audition-shortlist.json");
if (!fs.existsSync(shortlistPath)) {
  console.error(`no ${shortlistPath}\n  run: node scripts/list-elevenlabs-voices.mjs`);
  process.exit(1);
}
const shortlist = JSON.parse(fs.readFileSync(shortlistPath, "utf8"));
const all = [...shortlist.shortlist];

if (flag("--list") || !opt("--voice-id")) {
  const have = new Set((await listVoices()).voices.map((v) => v.voice_id));
  console.log(`\nshortlisted Voice Library voices (in account: ${[...have].length ? "checked" : "unknown"})\n`);
  for (const v of all) {
    const cat = v.account_category ?? `${v.library_category ?? "?"} (library)`;
    console.log(`  ${have.has(v.voice_id) ? "IN ACCOUNT" : "not added "}  ` +
      `${v.voice_id}  ${v.role.padEnd(12)}${String(cat).padEnd(24)}${v.name}`);
  }
  console.log(`\nAdd one:  node scripts/add-shared-voice.mjs --voice-id <id> --yes`);
  console.log(`This changes the account and may consume a voice slot.\n`);
  process.exit(0);
}

const voiceId = opt("--voice-id");
const entry = all.find((v) => v.voice_id === voiceId);
if (!entry) {
  console.error(`${voiceId} is not in the shortlist. Add it there first, or ` +
    `pass --public-owner-id explicitly.`);
  if (!opt("--public-owner-id")) process.exit(1);
}
const ownerId = opt("--public-owner-id", entry?.public_owner_id);
const name = opt("--name", entry?.name ?? voiceId);

if (!flag("--yes")) {
  console.error(
    `\nwould add to the account:\n` +
    `  ${voiceId}  ${name}\n` +
    `  category ${entry?.account_category ?? entry?.library_category ?? "unknown"}\n` +
    `  verified for Kannada: ${entry?.verified_for_kannada ?? "unknown, not yet on the account"}\n\n` +
    `This changes the ElevenLabs account and may consume a voice slot.\n` +
    `Re-run with --yes to do it.\n`);
  process.exit(0);
}

const res = await addSharedVoice(ownerId, voiceId, name);
console.log(`added: ${res.voice_id ?? voiceId}  ${name}`);
console.log(`\nnow re-run the listing so the reports reflect it:\n` +
  `  node scripts/list-elevenlabs-voices.mjs\n`);
