import { execFileSync } from "node:child_process";

/** Duration in seconds of an audio file, via ffprobe. */
export function duration(file) {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-show_entries", "format=duration",
    "-of", "csv=p=0", file,
  ], { encoding: "utf8" });
  const d = Number(out.trim());
  if (!Number.isFinite(d)) throw new Error(`ffprobe gave no duration for ${file}`);
  return d;
}

/** Peak and integrated loudness, for the auditorium suitability check. */
export function loudness(file) {
  try {
    const out = execFileSync("ffmpeg", [
      "-v", "info", "-i", file, "-af", "loudnorm=print_format=json",
      "-f", "null", "-",
    ], { encoding: "utf8", stdio: ["ignore", "ignore", "pipe"] });
    const m = out.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const j = JSON.parse(m[0]);
    return {
      input_i: Number(j.input_i),
      input_tp: Number(j.input_tp),
      input_lra: Number(j.input_lra),
    };
  } catch {
    return null;
  }
}
