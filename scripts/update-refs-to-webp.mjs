#!/usr/bin/env node
/**
 * Update references from .jpg/.jpeg to .webp in TSX, TS, and HTML
 * when a matching .webp file exists in public/images.
 *
 * Run after optimize-images.mjs. Usage:
 *   node scripts/update-refs-to-webp.mjs [--dry-run]
 */

import { readdir, readFile, writeFile } from 'fs/promises'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const IMAGES_DIR = join(ROOT, 'public', 'images')
const EXTENSIONS = ['.tsx', '.ts', '.html']
const SOURCE_EXTENSIONS = ['.jpg', '.jpeg']

const dryRun = process.argv.includes('--dry-run')

async function getWebpBasenames() {
  const entries = await readdir(IMAGES_DIR, { withFileTypes: true })
  const webp = new Set()
  for (const e of entries) {
    if (e.isFile() && extname(e.name).toLowerCase() === '.webp') {
      webp.add(e.name.replace(/\.webp$/i, ''))
    }
  }
  return webp
}

const SCAN_DIRS = ['app', 'components', 'data', 'public']

async function getFilesToScan() {
  const files = []
  async function scan(dir) {
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
    for (const e of entries) {
      const full = join(dir, e.name)
      if (e.isDirectory()) {
        if (e.name !== 'node_modules' && e.name !== '.git') {
          await scan(full)
        }
      } else if (EXTENSIONS.some((ext) => e.name.endsWith(ext))) {
        files.push(full)
      }
    }
  }
  for (const d of SCAN_DIRS) {
    const fullDir = join(ROOT, d)
    try {
      await scan(fullDir)
    } catch (_) {}
  }
  return files
}

async function main() {
  const imagesDir = await import('fs').then((fs) => fs.promises.readdir(IMAGES_DIR).catch(() => []))
  if (!imagesDir.length) {
    console.warn('No public/images directory or empty. Skipping.')
    return
  }

  const webpBasenames = await getWebpBasenames()
  if (!webpBasenames.size) {
    console.log('No .webp files in public/images. Run optimize-images.mjs first.')
    return
  }

  const replacementMap = new Map()
  for (const base of webpBasenames) {
    for (const ext of SOURCE_EXTENSIONS) {
      replacementMap.set(`${base}${ext}`, `${base}.webp`)
    }
  }

  const files = await getFilesToScan()
  let totalReplacements = 0

  for (const filePath of files) {
    let content = await readFile(filePath, 'utf-8')
    let count = 0
    for (const [oldName, newName] of replacementMap) {
      const patterns = [
        [`/images/${oldName}`, `/images/${newName}`],
        [`images/${oldName}`, `images/${newName}`],
        [`'${oldName}'`, `'${newName}'`],
        [`"${oldName}"`, `"${newName}"`],
      ]
      for (const [old, next] of patterns) {
        const n = (content.match(new RegExp(escapeRe(old), 'g')) || []).length
        if (n) {
          content = content.split(old).join(next)
          count += n
        }
      }
    }
    if (count > 0) {
      const rel = filePath.replace(ROOT + '/', '')
      console.log(`${dryRun ? '[dry-run] Would update' : 'Updated'} ${rel}: ${count} ref(s)`)
      if (!dryRun) {
        await writeFile(filePath, content, 'utf-8')
      }
      totalReplacements += count
    }
  }

  if (dryRun && totalReplacements > 0) {
    console.log('\n[dry-run] No files written. Run without --dry-run to apply.')
  }
  console.log(`Done. ${totalReplacements} reference(s) ${dryRun ? 'would be updated' : 'updated'}.`)
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
