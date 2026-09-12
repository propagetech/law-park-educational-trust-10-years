/**
 * The three audition takes, expressed in controls v3 actually has.
 *
 * The voice brief asks for three takes separated by stability, style and speed
 * floats. On v3 two of those three fields do not exist and the third is a
 * three-point scale, so a literal reading produces three identical requests
 * with different numbers in the log and no audible difference at all. That is
 * the trap this file exists to avoid.
 *
 * v3's real levers are: the stability band, similarity boost, and the text
 * itself. So the takes are separated by band, which is the only setting that
 * changes the performance:
 *
 *   A  natural   balanced documentary, the register the brief describes
 *   B  creative  the only way to get more expressiveness out of v3
 *   C  robust    most consistent diction, for a hall
 *
 * Take B carries a real risk and is not a free choice. Creative is documented
 * as more expressive AND more prone to hallucination. On a film naming real
 * children, places and award titles, a hallucinated syllable is worse than a
 * flat read. B is auditioned so the decision rests on evidence; if it drifts
 * at all on the proper nouns it is rejected, however warm it sounds.
 *
 * The brief's own numbers ride along as `intent` so the log shows what was
 * asked for beside what was sent.
 */

export const TAKES = [
  {
    id: "a",
    label: "Balanced documentary",
    stability: "natural",
    similarity_boost: 0.75,
    intent: { stability: 0.52, style: 0.10, speed: 0.95 },
    direction:
      "Confident, clear, warm and measured. A premium documentary narrator. " +
      "Natural emotion, no performance exaggeration.",
    expect: "The safest all-purpose read. This is the baseline the other two " +
            "are judged against.",
  },
  {
    id: "b",
    label: "Cinematic and intimate",
    stability: "creative",
    similarity_boost: 0.78,
    intent: { stability: 0.42, style: 0.20, speed: 0.92 },
    direction:
      "More intimate and cinematic. As if recalling ten years of real work. " +
      "Gentle pauses, quiet pride, never sad for effect.",
    expect: "Warmer, and the only take that can be more expressive than A. " +
            "Listen hard to ಚಿಕ್ಕಬಳ್ಳಾಪುರ, ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ and the years: " +
            "creative is prone to hallucination and any drift on a proper " +
            "noun rejects this take outright.",
  },
  {
    id: "c",
    label: "Clear event-hall narration",
    stability: "robust",
    similarity_boost: 0.75,
    intent: { stability: 0.60, style: 0.08, speed: 0.97 },
    direction:
      "Clear, mature, steady and strong enough for a large hall. Every Kannada " +
      "word clean. Less intimate than B, but never newsreader-flat.",
    expect: "Most consistent diction and least responsive to direction. The " +
            "likely winner for the years, counts and place names even if " +
            "another take wins the opening.",
  },
];

export function findTake(id) {
  const t = TAKES.find((x) => x.id === id.toLowerCase());
  if (!t) throw new Error(`no such take: "${id}". Available: ${TAKES.map((x) => x.id).join(", ")}`);
  return t;
}

export function slug(name) {
  return String(name).toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
}
