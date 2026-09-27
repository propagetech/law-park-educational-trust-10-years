// Local API for /event-duties: the real Lambda handler on an in-memory store,
// so no AWS, Docker or Java is needed. Data resets when it stops.
//   npm run dev            -> http://localhost:8790/duties
// Loads ../team-roster.json (git-ignored) if it is there.
// With TABLE_NAME set it uses that DynamoDB table instead (your AWS login),
// e.g. a throwaway test table; never point it at the live table for tests.
import { createServer } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const PORT = Number(process.env.PORT || 8790)
process.env.ALLOWED_ORIGINS ||= 'http://localhost:8789,http://localhost:3000'
const allowed = process.env.ALLOWED_ORIGINS.split(',')

const { handler, useStore } = await import('../src/handlers/duties.js')
const { memoryStore } = await import('../src/lib/store.js')
const store = memoryStore()
if (!process.env.TABLE_NAME) useStore(store)

const roster = fileURLToPath(new URL('../../team-roster.json', import.meta.url))
if (!process.env.TABLE_NAME && existsSync(roster)) {
  const people = JSON.parse(readFileSync(roster, 'utf8'))
  const at = new Date().toISOString()
  for (const p of people) await store.put({ pk: 'MEMBER', sk: p.mobile, name: p.name, first_seen: at, last_seen: '' }, { ifAbsent: true })
  console.log(`Loaded ${people.length} people from team-roster.json`)
}

createServer(async (req, res) => {
  const origin = req.headers.origin || ''
  const cors = allowed.includes(origin) ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}
  const url = new URL(req.url, `http://localhost:${PORT}`)
  if (url.pathname !== '/duties') {
    res.writeHead(404, cors).end()
    return
  }
  // API Gateway answers preflights itself in production.
  if (req.method === 'OPTIONS') {
    res.writeHead(204, allowed.includes(origin) ? { ...cors, 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'content-type' } : {}).end()
    return
  }
  const chunks = []
  for await (const c of req) chunks.push(c)
  const result = await handler({
    requestContext: { http: { method: req.method } },
    headers: Object.fromEntries(Object.entries(req.headers).map(([k, v]) => [k.toLowerCase(), String(v)])),
    body: Buffer.concat(chunks).toString('utf8'),
    isBase64Encoded: false,
  })
  res.writeHead(result.statusCode, result.headers).end(result.body)
}).listen(PORT, () => console.log(`Duties API on http://localhost:${PORT}/duties (${process.env.TABLE_NAME ? `table ${process.env.TABLE_NAME}` : 'in memory'})`))
