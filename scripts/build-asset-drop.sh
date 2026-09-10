#!/usr/bin/env bash
# Assemble the creative-team asset drop that team-handoff.html links to.
#
# The hand-off page is served from Cloudflare Pages and carries no assets of its
# own. Every download link on it points at a GitHub release of this repository,
# so the creative team can take the whole pack without being given the repo.
# This script builds exactly what that release must contain:
#
#   .asset-drop/flat/    one file per document, uploaded as individual release
#                        assets so each link on the page resolves to one file
#   .asset-drop/zips/    kannada-film-pack.zip     everything, repo-relative
#                        kannada-photographs.zip   the 34 source photographs
#
# Nothing here is committed. Re-run after any document or tool changes, then
# re-upload with the command this prints at the end.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
K="$ROOT/anniversary-video-production/kannada"
R="$ROOT/anniversary-video-research"
DROP="$ROOT/.asset-drop"
FLAT="$DROP/flat"
ZIPS="$DROP/zips"
STAGE="$DROP/stage"

REPO_SLUG="propagetech/law-park-educational-trust-10-years"

rm -rf "$DROP"
mkdir -p "$FLAT" "$ZIPS" "$STAGE"

# ---------------------------------------------------------------- flat assets
# Release asset names are flat, so basenames must not collide. They do not
# today; the check below fails the build if a new file ever makes them.
add_flat() {
  local f
  for f in "$@"; do
    [ -e "$f" ] || continue
    local base
    base="$(basename "$f")"
    if [ -e "$FLAT/$base" ]; then
      echo "ERROR: two files share the basename '$base'. Release assets are flat," >&2
      echo "       so rename one of them before re-running." >&2
      exit 1
    fi
    cp "$f" "$FLAT/$base"
  done
}

add_flat "$K"/*.md "$K"/*.csv "$K"/*.srt "$K"/*.vtt "$K"/*.txt "$K"/08-kannada-animatic-poster.jpg
add_flat "$R"/*.md "$R"/*.csv
add_flat "$K"/tools/*.py "$K"/tools/timeline.json "$K"/tools/subs.json "$K"/tools/README.md
add_flat "$ROOT"/logo.png "$ROOT"/logo-purple.png

# tools/README.md would be ambiguous as a flat name next to any other README.
mv "$FLAT/README.md" "$FLAT/tools-README.md"

# ------------------------------------------------------- the photograph pool
# Exactly the stills the cut uses, read from the timing source of truth rather
# than from a hand-kept list, so a re-timed film cannot ship a stale pool.
PHOTOS="$DROP/photos.txt"
python3 - "$K/tools/timeline.json" "$PHOTOS" <<'PY'
import json, re, sys
timeline, out = sys.argv[1], sys.argv[2]
blob = json.dumps(json.load(open(timeline, encoding="utf-8")))
paths = sorted(set(re.findall(r"assets/images/[\w./@-]+\.(?:jpe?g|png|webp)", blob)))
open(out, "w", encoding="utf-8").write("\n".join(paths) + "\n")
print(f"{len(paths)} photographs referenced by the timeline")
PY

# ------------------------------------------------------------ repo-relative stage
# Layout is preserved so the tools resolve their own paths after an unzip:
# film.py derives the repository root from its own location, and every image
# path in timeline.json is repo-relative.
while IFS= read -r p; do
  [ -n "$p" ] || continue
  mkdir -p "$STAGE/$(dirname "$p")"
  cp "$ROOT/$p" "$STAGE/$p"
done < "$PHOTOS"

mkdir -p "$STAGE/anniversary-video-production/kannada/tools" "$STAGE/anniversary-video-research"
cp "$K"/*.md "$K"/*.csv "$K"/*.srt "$K"/*.vtt "$K"/*.txt "$STAGE/anniversary-video-production/kannada/"
cp "$K"/08-kannada-animatic-poster.jpg "$STAGE/anniversary-video-production/kannada/"
cp "$K"/tools/*.py "$K"/tools/timeline.json "$K"/tools/subs.json "$K"/tools/README.md \
   "$STAGE/anniversary-video-production/kannada/tools/"
cp "$R"/*.md "$R"/*.csv "$STAGE/anniversary-video-research/"
cp "$ROOT"/logo.png "$ROOT"/logo-purple.png "$STAGE/"
cp "$K/00-creative-team-read-me-first.md" "$STAGE/READ-ME-FIRST.md"

# ------------------------------------------------------------------- bundles
( cd "$STAGE" && zip -q -r -X "$ZIPS/kannada-film-pack.zip" . )
( cd "$ROOT" && zip -q -X "$ZIPS/kannada-photographs.zip" -@ < "$PHOTOS" )

# ------------------------------------------------------------------- manifest
{
  echo "# Asset drop manifest"
  echo
  echo "Built $(date -u '+%Y-%m-%d %H:%M UTC') from $(git -C "$ROOT" rev-parse --short HEAD)."
  echo
  echo "## Bundles"
  for f in "$ZIPS"/*.zip; do
    printf -- "- %s (%s)\n" "$(basename "$f")" "$(du -h "$f" | awk '{print $1}')"
  done
  echo
  echo "## Individual release assets ($(find "$FLAT" -type f | wc -l | tr -d ' '))"
  for f in $(ls "$FLAT"); do echo "- $f"; done
} > "$DROP/MANIFEST.md"

echo
echo "Flat assets:  $(find "$FLAT" -type f | wc -l | tr -d ' ') files, $(du -sh "$FLAT" | awk '{print $1}')"
echo "Bundles:      $(du -sh "$ZIPS" | awk '{print $1}')"
echo "Manifest:     $DROP/MANIFEST.md"
echo
echo "Upload, replacing whatever is on the release already:"
echo
echo "  gh release upload film-pack --repo $REPO_SLUG --clobber \\"
echo "    $DROP/zips/*.zip $DROP/flat/*"
echo
