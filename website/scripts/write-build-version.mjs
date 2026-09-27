// Stamps each build with a version the /event-duties app can compare against,
// so an open or installed copy knows when newer code has been pushed.
// Writes public/duties-version.json; next.config.js bakes the same value into
// the page as NEXT_PUBLIC_BUILD_ID.
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

let commit = ''
try {
  commit = execSync('git rev-parse --short HEAD', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
} catch {
  // Not a git checkout: the timestamp alone is enough.
}
const version = `${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}${commit ? `-${commit}` : ''}`

writeFileSync(join(root, 'public', 'duties-version.json'), `${JSON.stringify({ version })}\n`)
console.log(`duties-version ${version}`)
