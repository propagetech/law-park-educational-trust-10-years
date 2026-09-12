#!/usr/bin/env bash
# Copy the Kannada film handoff page into the website's public/ for the static site.
#
# The page and its favicon, and nothing else. Every document, script and
# photograph the page links to is published as a GitHub release instead, built
# by video/scripts/build-asset-drop.sh, so that:
#
#   - the creative team gets the whole pack from one link on the page and never
#     needs access to this repository,
#   - the pack can be re-cut and re-uploaded without redeploying the site,
#   - the deployed site stays one small page rather than a mirror of the pack.
#
# If a link on the page ever points at a relative path again, it will 404 in
# production. Keep them pointing at the release.
#
# Uses cp (not rsync) so Cloudflare Pages / CI images without rsync still build.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WEB="$ROOT/website"
VIDEO="$ROOT/video"
DEST="$WEB/public/anniversary-video-production/kannada"
SRC_K="$VIDEO/production/kannada"

rm -rf "$DEST" "$WEB/public/anniversary-video-research"
mkdir -p "$DEST"

cp "$SRC_K/team-handoff.html" "$DEST/"
cp "$ROOT/assets/images/icons/favicon-32.png" "$DEST/favicon-32x32.png"

# Guard: the page must not ship a relative asset link, because nothing beside it
# is deployed any more. The favicon is the one local file it is allowed to want.
stray="$(grep -oE '(href|src)="[^"#:$]+\.(md|csv|srt|vtt|json|py|jpe?g|png|txt)"' \
          "$DEST/team-handoff.html" | grep -v 'favicon-32x32.png' | sort -u || true)"
if [ -n "$stray" ]; then
  echo "ERROR: team-handoff.html still links to files that are not deployed:" >&2
  echo "$stray" >&2
  echo "       Point them at the GitHub release instead." >&2
  exit 1
fi

echo "Synced the handoff page to website/public/anniversary-video-production/kannada ($(du -sh "$DEST" | awk '{print $1}'))"
