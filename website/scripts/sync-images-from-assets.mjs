/**
 * Copy every generated image into public/ from assets/, the master library.
 *
 * assets/ is the single source of truth for photographs. The website used to
 * keep its own byte-identical copy of each one under public/, which meant an
 * edit to a master silently left the served copy stale. image-manifest.json
 * maps each served path to its source, so the two can no longer drift.
 *
 * The served paths are deliberately unchanged from when they were committed,
 * so no image URL moves and nothing linking to one has to be rewritten.
 *
 * Runs automatically before `next build` via the prebuild script. Safe to run
 * by hand at any time; it only writes when the bytes actually differ.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const WEBSITE = resolve(HERE, '..')
const REPO = resolve(WEBSITE, '..')
const PUBLIC = join(WEBSITE, 'public')

const manifest = JSON.parse(readFileSync(join(WEBSITE, 'image-manifest.json'), 'utf8'))

let written = 0, unchanged = 0
const missing = []

for (const [target, source] of Object.entries(manifest)) {
  const src = join(REPO, source)
  const dest = join(PUBLIC, target)
  if (!existsSync(src)) { missing.push({ target, source }); continue }
  const bytes = readFileSync(src)
  if (existsSync(dest) && statSync(dest).size === bytes.length
      && readFileSync(dest).equals(bytes)) { unchanged++; continue }
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, bytes)
  written++
}

if (missing.length) {
  console.error(`\nERROR: ${missing.length} image(s) named in image-manifest.json are missing from assets/:`)
  for (const m of missing) console.error(`  ${m.target}\n    expected source: ${m.source}`)
  console.error('\nEvery served image is generated from assets/. Restore the source, or drop')
  console.error('the entry from website/image-manifest.json if the image is genuinely gone.\n')
  process.exit(1)
}

console.log(`Images synced from assets/: ${written} written, ${unchanged} already current `
          + `(${Object.keys(manifest).length} total)`)
