/**
 * Controlled audition copy from the Cursor voice brief.
 * Test A is the brief excerpt; stress test covers years, places, and programme terms.
 */

export const AUDITION_MAIN = `ಶಿಕ್ಷಣವು ಒಂದು ಮಗುವಿನ ಹಕ್ಕು ಮಾತ್ರವಲ್ಲ.
ಅದು ಒಂದು ಕುಟುಂಬದ ನಾಳೆಯೂ ಹೌದು.

2016ರಲ್ಲಿ, ಚಿಕ್ಕಬಳ್ಳಾಪುರದ ಒಂದು ಶಾಲಾ ಭೇಟಿಯಿಂದ
ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್‌ನ ಪಯಣ ಆರಂಭವಾಯಿತು.

ಒಬ್ಬ ವಿದ್ಯಾರ್ಥಿಗೆ ಸ್ಕಾಲರ್‌ಶಿಪ್.
ಒಂದು ಸಣ್ಣ ಆರಂಭ.

ಆದರೆ,
ಮುಂದುವರಿದ ಒಂದು ಭರವಸೆ.`;

export const AUDITION_STRESS = `2022ರಲ್ಲಿ ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಲ್ಲಿ ಗ್ರಂಥಾಲಯಗಳು ಆರಂಭವಾದವು.
2023ರಲ್ಲಿ ಮೈಸೂರು ಮತ್ತು ಹೆಚ್. ಡಿ. ಕೋಟೆಯಲ್ಲಿ
ಒಂಬತ್ತನೇ ಮತ್ತು ಹತ್ತನೇ ತರಗತಿಯ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ
ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶನ ನೀಡಲಾಯಿತು.

2024ರಲ್ಲಿ ಎಂ. ಎಂ. ಹಿಲ್ಸ್‌ನಲ್ಲಿ 200 ಶಾಲಾ ಚೀಲಗಳು.
2025ರಲ್ಲಿ ಹೆಚ್. ಡಿ. ಕೋಟೆಯಲ್ಲಿ 300 ಶಾಲಾ ಚೀಲಗಳು.`;

export const AUDITION_FULL = `${AUDITION_MAIN}

${AUDITION_STRESS}`;

/**
 * Take matrices from the brief.
 * For eleven_v3, speed is recorded for editorial intent but omitted from the API body
 * (see lib/elevenlabs.mjs MODELS_WITH_SPEED).
 */
export const TAKES = {
  a: {
    label: "Balanced documentary",
    letter: "a",
    direction:
      "Confident, clear, warm, and measured. A premium documentary narrator. Natural emotion, no performance exaggeration.",
    settings: {
      stability: 0.52,
      similarity_boost: 0.75,
      style: 0.1,
      speed: 0.95,
    },
  },
  b: {
    label: "Cinematic and intimate",
    letter: "b",
    direction:
      "More intimate and cinematic. Speak as if recalling ten years of real human work. Use gentle pauses. Allow warmth and quiet pride. Never sound sad for effect.",
    settings: {
      stability: 0.42,
      similarity_boost: 0.78,
      style: 0.2,
      speed: 0.92,
    },
  },
  c: {
    label: "Clear event-hall narration",
    letter: "c",
    direction:
      "Clear, mature, steady, and strong enough for a large event hall. Speak every Kannada word cleanly. Less intimate than Take B, but never newsreader-flat.",
    settings: {
      stability: 0.6,
      similarity_boost: 0.75,
      style: 0.08,
      speed: 0.97,
    },
  },
};
