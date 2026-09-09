#!/usr/bin/env bash
# Slim copy of the Kannada film handoff into public/ for the static site.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/public/anniversary-video-production/kannada"
RES="$ROOT/public/anniversary-video-research"
rm -rf "$DEST" "$RES"
mkdir -p "$DEST/tools" "$RES"
# Docs and handoff page (no renders)
rsync -a \
  --include='*.md' --include='*.html' --include='*.csv' \
  --include='*.srt' --include='*.vtt' --include='*.jpg' --include='*.png' \
  --exclude='*' \
  "$ROOT/anniversary-video-production/kannada/" "$DEST/"
# Tools: scripts + timing JSON only
rsync -a \
  --include='*.py' --include='*.json' --include='README.md' \
  --exclude='*' \
  "$ROOT/anniversary-video-production/kannada/tools/" "$DEST/tools/"
# Research docs linked from the handoff
rsync -a --include='*.md' --include='*.csv' --exclude='*' \
  "$ROOT/anniversary-video-research/" "$RES/"
echo "Synced handoff to public/anniversary-video-production/kannada ($(du -sh "$DEST" | awk '{print $1}'))"
