/**
 * Scene blocks for final narration, aligned to the Kannada storyboard and timeline.json.
 * Settings follow the brief; speed is editorial intent (omitted for eleven_v3 API).
 */

import fs from "node:fs";
import { TIMELINE_JSON } from "./paths.mjs";

export const SCENE_SETTINGS = {
  opening: {
    id: "opening",
    label: "Opening",
    tc: "0:00–0:35",
    sids: ["K02", "K03", "K04", "K05"],
    generateVariants: true,
    settings: {
      stability: 0.45,
      similarity_boost: 0.78,
      style: 0.18,
      speed: 0.92,
    },
    direction: "intimate, visual, quiet, reflective",
  },
  origin: {
    id: "origin",
    label: "Founder / origin",
    tc: "0:35–1:20",
    sids: ["K07", "K08", "K09", "K10", "K11", "K12", "K13"],
    generateVariants: true,
    settings: {
      stability: 0.5,
      similarity_boost: 0.76,
      style: 0.13,
      speed: 0.93,
    },
    direction: "humble, respectful, historically grounded",
  },
  timeline: {
    id: "timeline",
    label: "Timeline montage",
    tc: "1:20–2:45",
    sids: ["K14", "K15", "K16", "K17", "K18", "K19", "K20", "K21", "K22", "K23"],
    generateVariants: false,
    settings: {
      stability: 0.56,
      similarity_boost: 0.75,
      style: 0.1,
      speed: 0.96,
    },
    direction: "clear, forward-moving, measured energy",
  },
  scholarship: {
    id: "scholarship",
    label: "Scholarship method and 75%",
    tc: "2:45–3:20",
    sids: ["K24", "K25", "K26", "K27", "K28", "K29", "K30"],
    generateVariants: true,
    settings: {
      stability: 0.58,
      similarity_boost: 0.75,
      style: 0.08,
      speed: 0.91,
    },
    direction: "precise, trustworthy, calm; leave silence around the 75% line",
  },
  community: {
    id: "community",
    label: "Community, recognition, gratitude",
    tc: "3:20–4:35",
    sids: ["K31", "K32", "K33", "K34", "K35", "K36", "K37", "K38", "K39", "K40"],
    generateVariants: true,
    settings: {
      stability: 0.48,
      similarity_boost: 0.77,
      style: 0.15,
      speed: 0.93,
    },
    direction: "warmer, appreciative, never celebratory-commercial",
  },
  closing: {
    id: "closing",
    label: "Future and closing",
    tc: "4:35–5:00",
    sids: ["K41", "K42", "K43", "K44", "K45"],
    generateVariants: true,
    settings: {
      stability: 0.46,
      similarity_boost: 0.78,
      style: 0.18,
      speed: 0.91,
    },
    direction: "hopeful, dignified, calm, emotionally resolved",
  },
};

export function loadTimelineShots() {
  const raw = JSON.parse(fs.readFileSync(TIMELINE_JSON, "utf8"));
  return raw;
}

export function narratedShots() {
  return loadTimelineShots().filter((s) => (s.narr || "").trim());
}

export function shotsForScene(sceneId) {
  const scene = SCENE_SETTINGS[sceneId];
  if (!scene) {
    throw new Error(`Unknown scene "${sceneId}". Known: ${Object.keys(SCENE_SETTINGS).join(", ")}`);
  }
  const bySid = new Map(loadTimelineShots().map((s) => [s.sid, s]));
  return scene.sids
    .map((sid) => bySid.get(sid))
    .filter((s) => s && (s.narr || "").trim());
}

export function estimateNarrationDurationSeconds() {
  const shots = narratedShots();
  const speech = shots.reduce((sum, s) => sum + (Number(s.speech) || 0), 0);
  const pauses = shots.reduce((sum, s) => sum + (Number(s.pause) || 0), 0);
  return { speech, pauses, total: speech + pauses, lineCount: shots.length };
}
