# README · kannada-voice

See [`scripts/README.md`](scripts/README.md) for full CLI documentation.

Quick start:

```bash
export ELEVENLABS_API_KEY=...   # never commit
node scripts/list-elevenlabs-voices.mjs
node scripts/generate-auditions.mjs --dry-run
```

Folder layout:

```
kannada-voice/
  scripts/           CLI tools
  lib/               shared helpers
  config/            shortlist + selected voice (no secrets)
  audition-audio/    generated takes (gitignored)
  final-narration/   scene MP3s (gitignored)
  reports/           discovery, shortlist, scorecard
  manifests/         cue sheet + generation log
```
