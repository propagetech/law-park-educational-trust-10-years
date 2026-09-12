import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const ROOT = path.resolve(HERE, "..");
// The film project root (video/production). Everything this module needs lives
// under it, so the video project resolves without knowing the repo layout.
export const PRODUCTION_ROOT = path.resolve(ROOT, "..");
export const REPO_ROOT = path.resolve(PRODUCTION_ROOT, "../..");

export const SCRIPTS = path.join(ROOT, "scripts");
export const CONFIG = path.join(ROOT, "config");
export const REPORTS = path.join(ROOT, "reports");
export const AUDITION_AUDIO = path.join(ROOT, "audition-audio");
export const FINAL_NARRATION = path.join(ROOT, "final-narration");
export const MANIFESTS = path.join(ROOT, "manifests");

// The existing render chain. generate-final-narration.mjs can write straight
// into it so stem.py and build_timeline.py --from-audio need no changes.
export const RENDER_TOOLS = path.join(
  PRODUCTION_ROOT, "kannada/tools");
export const TIMELINE_JSON = path.join(RENDER_TOOLS, "timeline.json");
export const VO_ELEVEN = path.join(RENDER_TOOLS, "vo_eleven");

export const GENERATION_LOG = path.join(MANIFESTS, "narration-generation-log.csv");
export const CUE_SHEET = path.join(MANIFESTS, "narration-cue-sheet.csv");
export const SELECTED_VOICE = path.join(CONFIG, "selected-voice.json");
export const AVAILABLE_VOICES = path.join(REPORTS, "available-voices.json");
