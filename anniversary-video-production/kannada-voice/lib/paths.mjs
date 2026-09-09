import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const ROOT = path.resolve(__dirname, "..");
export const REPO_ROOT = path.resolve(ROOT, "../..");
export const SCRIPTS = path.join(ROOT, "scripts");
export const CONFIG = path.join(ROOT, "config");
export const REPORTS = path.join(ROOT, "reports");
export const AUDITION_AUDIO = path.join(ROOT, "audition-audio");
export const FINAL_NARRATION = path.join(ROOT, "final-narration");
export const MANIFESTS = path.join(ROOT, "manifests");

export const TIMELINE_JSON = path.join(
  REPO_ROOT,
  "anniversary-video-production/kannada/tools/timeline.json"
);

export const APPROVED_SCRIPT = path.join(
  REPO_ROOT,
  "anniversary-video-research/09-kannada-five-minute-script.md"
);
