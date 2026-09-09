#!/usr/bin/env bash
# Slim copy of the Kannada film handoff into public/ for the static site.
# Uses cp (not rsync) so Cloudflare Pages / CI images without rsync still build.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/public/anniversary-video-production/kannada"
RES="$ROOT/public/anniversary-video-research"
SRC_K="$ROOT/anniversary-video-production/kannada"
SRC_R="$ROOT/anniversary-video-research"

rm -rf "$DEST" "$RES"
mkdir -p "$DEST/tools" "$RES"

copy_globs() {
  local dest="$1"
  shift
  local f
  for f in "$@"; do
    if [ -e "$f" ]; then
      cp "$f" "$dest/"
    fi
  done
}

# Docs and handoff page (no renders)
copy_globs "$DEST" \
  "$SRC_K"/*.md \
  "$SRC_K"/*.html \
  "$SRC_K"/*.csv \
  "$SRC_K"/*.srt \
  "$SRC_K"/*.vtt \
  "$SRC_K"/*.jpg \
  "$SRC_K"/*.png

# Tools: scripts + timing JSON only
copy_globs "$DEST/tools" \
  "$SRC_K/tools"/*.py \
  "$SRC_K/tools"/*.json \
  "$SRC_K/tools/README.md"

# Research docs linked from the handoff
copy_globs "$RES" \
  "$SRC_R"/*.md \
  "$SRC_R"/*.csv

echo "Synced handoff to public/anniversary-video-production/kannada ($(du -sh "$DEST" | awk '{print $1}'))"
