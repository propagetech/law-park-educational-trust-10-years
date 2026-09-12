/**
 * Rebuild the shot-ID photo pack from assets/, the master photo library.
 *
 * photo-pack-10-years/ presents the film's stills under editorial names
 * ({year}-{event}__{shot-id}.ext) so the creative team can find a shot by its
 * EDL id. Every one of those stills was a byte-identical second copy of a
 * photograph already in assets/, which meant a regrade or re-crop of a master
 * left the pack silently stale.
 *
 * photo-manifest.json maps each pack filename to its source, so the pack is now
 * generated and cannot drift. The names the creative team uses are unchanged.
 *
 * enhanced/ is NOT generated. Those are AI-cleanup renders that exist nowhere
 * else, so they stay tracked in git.
 *
 * Run: node video/scripts/sync-photo-pack.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, '../..')
const PACK = join(REPO, 'video/production/photo-pack-10-years')

const manifest = JSON.parse(readFileSync(join(PACK, 'photo-manifest.json'), 'utf8'))

let written = 0, unchanged = 0
const missing = []

for (const [target, source] of Object.entries(manifest)) {
  const src = join(REPO, source)
  const dest = join(PACK, target)
  if (!existsSync(src)) { missing.push({ target, source }); continue }
  const bytes = readFileSync(src)
  if (existsSync(dest) && statSync(dest).size === bytes.length
      && readFileSync(dest).equals(bytes)) { unchanged++; continue }
  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, bytes)
  written++
}

if (missing.length) {
  console.error(`\nERROR: ${missing.length} still(s) named in photo-manifest.json are missing from assets/:`)
  for (const m of missing) console.error(`  ${m.target}\n    expected source: ${m.source}`)
  console.error('\nRestore the source, or drop the entry from photo-manifest.json.\n')
  process.exit(1)
}

console.log(`Photo pack synced from assets/: ${written} written, ${unchanged} already current `
          + `(${Object.keys(manifest).length} stills; enhanced/ is tracked, not generated)`)
