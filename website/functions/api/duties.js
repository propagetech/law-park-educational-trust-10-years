// Cloudflare Pages Function: /api/duties
// Backs the /event-duties page. Storage is Cloudflare D1, bound as DB.
// No passwords by design: every write carries the name the person typed on
// entry, and every change lands in duty_activity so nothing happens unseen.
// Schedule activities (duty_events) are owned through duty_assignments too:
// an activity id is just another duty id there.

import { SEED_ACTIVITIES } from '../../data/eventDuties'
import { SEED_MEMBERS } from '../../data/eventTeam'

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS duty_assignments (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     duty_id TEXT NOT NULL,
     person TEXT NOT NULL,
     added_by TEXT NOT NULL,
     added_at TEXT NOT NULL,
     UNIQUE (duty_id, person COLLATE NOCASE)
   )`,
  `CREATE TABLE IF NOT EXISTS duty_custom (
     id TEXT PRIMARY KEY,
     section_id TEXT NOT NULL,
     title TEXT NOT NULL,
     detail TEXT NOT NULL DEFAULT '',
     added_by TEXT NOT NULL,
     added_at TEXT NOT NULL,
     removed_at TEXT
   )`,
  `CREATE TABLE IF NOT EXISTS duty_members (
     mobile TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     first_seen TEXT NOT NULL,
     last_seen TEXT NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS duty_events (
     id TEXT PRIMARY KEY,
     date TEXT NOT NULL,
     time TEXT NOT NULL DEFAULT '',
     title TEXT NOT NULL,
     description TEXT NOT NULL DEFAULT '',
     updated_by TEXT NOT NULL,
     updated_at TEXT NOT NULL,
     removed_at TEXT
   )`,
  `CREATE TABLE IF NOT EXISTS duty_todos (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     event_id TEXT NOT NULL,
     text TEXT NOT NULL,
     done INTEGER NOT NULL DEFAULT 0,
     done_by TEXT,
     added_by TEXT NOT NULL,
     added_at TEXT NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS duty_meta (
     key TEXT PRIMARY KEY,
     value TEXT NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS duty_activity (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     at TEXT NOT NULL,
     by_name TEXT NOT NULL,
     action TEXT NOT NULL,
     duty_id TEXT,
     person TEXT
   )`,
]

const MAX_MEMBERS = 500
const MAX_EVENTS = 300
const MAX_TODOS = 2000
const DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/
const EVENT_ID = /^e-[a-z0-9-]{1,40}$/
const ID = /^[a-z0-9-]{1,64}$/
const MAX_ASSIGNMENTS = 3000
const MAX_CUSTOM = 200

let schemaReady

// Copies the starting schedule in once, in one transaction. Every insert is
// idempotent, so two requests racing on a fresh database cannot duplicate it,
// and the meta row means a schedule the team emptied on purpose stays empty.
async function seedActivities(db) {
  const seeded = await db.prepare("SELECT 1 FROM duty_meta WHERE key = 'activities_seeded'").first()
  if (seeded) return
  const at = new Date().toISOString()
  const writes = [
    db.prepare("INSERT INTO duty_meta (key, value) VALUES ('activities_seeded', ?) ON CONFLICT (key) DO NOTHING").bind(at),
  ]
  for (const a of SEED_ACTIVITIES) {
    writes.push(
      db
        .prepare('INSERT OR IGNORE INTO duty_events (id, date, time, title, description, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .bind(a.id, a.date, a.time, a.title, a.description, 'Planning team', at),
    )
    for (const text of a.todos) {
      writes.push(
        db
          .prepare(
            `INSERT INTO duty_todos (event_id, text, added_by, added_at)
             SELECT ?1, ?2, 'Planning team', ?3
             WHERE NOT EXISTS (SELECT 1 FROM duty_todos WHERE event_id = ?1 AND text = ?2)`,
          )
          .bind(a.id, text, at),
      )
    }
  }
  await db.batch(writes)
}

// Copies the team roster in once. A number that is already registered keeps
// the name its owner chose. last_seen stays '' until they first sign in.
async function seedMembers(db) {
  const seeded = await db.prepare("SELECT 1 FROM duty_meta WHERE key = 'members_seeded'").first()
  if (seeded) return
  const at = new Date().toISOString()
  await db.batch([
    db.prepare("INSERT INTO duty_meta (key, value) VALUES ('members_seeded', ?) ON CONFLICT (key) DO NOTHING").bind(at),
    ...SEED_MEMBERS.map((m) =>
      db.prepare("INSERT OR IGNORE INTO duty_members (mobile, name, first_seen, last_seen) VALUES (?, ?, ?, '')").bind(m.mobile, m.name, at),
    ),
  ])
}

function ensureSchema(db) {
  if (!schemaReady) {
    schemaReady = db
      .batch([
        ...SCHEMA.map((sql) => db.prepare(sql)),
        // Numbers saved before country codes were kept were Indian 10-digit.
        db.prepare("UPDATE OR IGNORE duty_members SET mobile = '+91' || mobile WHERE mobile NOT LIKE '+%'"),
      ])
      .then(() => seedActivities(db))
      .then(() => seedMembers(db))
      .catch((err) => {
        schemaReady = undefined
        throw err
      })
  }
  return schemaReady
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}

// Mobile numbers are stored with their country code, like +919876543210.
// Without a + (or 00) prefix a number is read as Indian. Mirrors cleanMobile
// in components/event-duties/shared.tsx.
function cleanMobile(value) {
  const raw = String(value || '').trim()
  let digits = raw.replace(/\D/g, '')
  if (raw.startsWith('+') || raw.startsWith('00')) {
    if (raw.startsWith('00')) digits = digits.slice(2)
    if (digits.startsWith('91')) return /^91[6-9]\d{9}$/.test(digits) ? `+${digits}` : ''
    return /^[1-9]\d{7,14}$/.test(digits) ? `+${digits}` : ''
  }
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : ''
}

const MOBILE_HELP = 'Enter a mobile number. Add the country code, like +1, if it is not an Indian number.'
const NAME_TAKEN = 'Someone on the team already uses that name. Add an initial or surname.'

function cleanName(value, max = 60) {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim().slice(0, max)
}

// Like cleanName, but keeps line breaks for longer descriptions.
function cleanText(value, max) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/\r\n?/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max)
}

async function readState(db) {
  const [assignments, custom, activity, members, events, todos] = await db.batch([
    db.prepare('SELECT id, duty_id, person, added_by, added_at FROM duty_assignments ORDER BY id'),
    db.prepare('SELECT id, section_id, title, detail, added_by, added_at FROM duty_custom WHERE removed_at IS NULL ORDER BY added_at'),
    db.prepare('SELECT id, at, by_name, action, duty_id, person FROM duty_activity ORDER BY id DESC LIMIT 40'),
    db.prepare('SELECT name, mobile FROM duty_members ORDER BY name'),
    db.prepare('SELECT id, date, time, title, description, updated_by, updated_at FROM duty_events WHERE removed_at IS NULL ORDER BY date, time'),
    db.prepare('SELECT id, event_id, text, done, done_by, added_by FROM duty_todos ORDER BY id'),
  ])
  return {
    assignments: assignments.results,
    custom: custom.results,
    activity: activity.results,
    members: members.results,
    events: events.results,
    todos: todos.results,
  }
}

function logActivity(db, at, by, action, dutyId, person) {
  return db
    .prepare('INSERT INTO duty_activity (at, by_name, action, duty_id, person) VALUES (?, ?, ?, ?, ?)')
    .bind(at, by, action, dutyId ?? null, person ?? null)
}

export async function onRequestGet({ env }) {
  if (!env.DB) return json(503, { error: 'Database is not connected yet.' })
  await ensureSchema(env.DB)
  return json(200, await readState(env.DB))
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json(503, { error: 'Database is not connected yet.' })

  // JSON content type forces a CORS preflight, which this endpoint never
  // answers, so other sites cannot write here from a visitor's browser.
  if (!(request.headers.get('Content-Type') || '').includes('application/json')) {
    return json(415, { error: 'Send JSON.' })
  }
  const origin = request.headers.get('Origin')
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json(403, { error: 'Wrong origin.' })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json(400, { error: 'Invalid JSON.' })
  }

  const db = env.DB
  await ensureSchema(db)

  const by = cleanName(body.by)
  if (by.length < 2) return json(400, { error: 'Enter your name first.' })
  const at = new Date().toISOString()
  let me // set by sign-in and rename: who the browser should now remember

  switch (body.action) {
    case 'hello': {
      // Sign-in. A known number signs in under its saved name; a new one is
      // added to the team with the name typed.
      const mobile = cleanMobile(body.mobile)
      if (!mobile) return json(400, { error: MOBILE_HELP })
      const known = await db.prepare('SELECT name, last_seen FROM duty_members WHERE mobile = ?').bind(mobile).first()
      if (known) {
        await db.batch([
          db.prepare('UPDATE duty_members SET last_seen = ? WHERE mobile = ?').bind(at, mobile),
          ...(known.last_seen ? [] : [logActivity(db, at, known.name, 'joined', null, null)]),
        ])
        me = { name: known.name, mobile }
        break
      }
      const taken = await db.prepare('SELECT 1 FROM duty_members WHERE name = ? COLLATE NOCASE').bind(by).first()
      if (taken) return json(409, { error: NAME_TAKEN })
      const { total } = await db.prepare('SELECT COUNT(*) AS total FROM duty_members').first()
      if (total >= MAX_MEMBERS) return json(429, { error: 'The team list is full.' })
      await db.batch([
        db.prepare('INSERT INTO duty_members (mobile, name, first_seen, last_seen) VALUES (?, ?, ?, ?)').bind(mobile, by, at, at),
        logActivity(db, at, by, 'joined', null, null),
      ])
      me = { name: by, mobile }
      break
    }

    case 'rename': {
      // Changes a person's name everywhere it is used as theirs: the team
      // list, the duties and activities they are on, and to-dos they ticked.
      const mobile = cleanMobile(body.mobile)
      const name = cleanName(body.name)
      if (name.length < 2) return json(400, { error: 'Enter your new name.' })
      const member = await db.prepare('SELECT name FROM duty_members WHERE mobile = ?').bind(mobile).first()
      if (!member) return json(404, { error: 'Sign in again, then change your name.' })
      if (name !== member.name) {
        const taken = await db
          .prepare('SELECT 1 FROM duty_members WHERE name = ? COLLATE NOCASE AND mobile != ?')
          .bind(name, mobile)
          .first()
        if (taken) return json(409, { error: NAME_TAKEN })
        const old = member.name
        const caseOnly = old.toLowerCase() === name.toLowerCase()
        await db.batch([
          db.prepare('UPDATE duty_members SET name = ? WHERE mobile = ?').bind(name, mobile),
          // Where the new name is already on a duty, the old entry is a duplicate.
          db.prepare('UPDATE OR IGNORE duty_assignments SET person = ? WHERE person = ? COLLATE NOCASE').bind(name, old),
          ...(caseOnly ? [] : [db.prepare('DELETE FROM duty_assignments WHERE person = ? COLLATE NOCASE').bind(old)]),
          db.prepare('UPDATE duty_todos SET done_by = ? WHERE done_by = ? COLLATE NOCASE').bind(name, old),
          logActivity(db, at, old, 'renamed', null, name),
        ])
      }
      me = { name, mobile }
      break
    }

    case 'assign': {
      const dutyId = String(body.dutyId || '')
      if (!ID.test(dutyId)) return json(400, { error: 'Unknown duty.' })
      const people = (Array.isArray(body.people) ? body.people : [])
        .map((p) => cleanName(p))
        .filter((p) => p.length >= 2)
        .slice(0, 20)
      if (!people.length) return json(400, { error: 'Enter at least one name.' })

      const { total } = await db.prepare('SELECT COUNT(*) AS total FROM duty_assignments').first()
      if (total + people.length > MAX_ASSIGNMENTS) return json(429, { error: 'The list is full.' })

      const writes = []
      for (const person of people) {
        writes.push(
          db
            .prepare('INSERT OR IGNORE INTO duty_assignments (duty_id, person, added_by, added_at) VALUES (?, ?, ?, ?)')
            .bind(dutyId, person, by, at),
          // Only log names that were new; changes() is the insert just above.
          db
            .prepare(
              `INSERT INTO duty_activity (at, by_name, action, duty_id, person)
               SELECT ?, ?, 'assign', ?, ? WHERE changes() = 1`,
            )
            .bind(at, by, dutyId, person),
        )
      }
      await db.batch(writes)
      break
    }

    case 'unassign': {
      const id = Number(body.id)
      if (!Number.isInteger(id)) return json(400, { error: 'Unknown name.' })
      const row = await db.prepare('SELECT duty_id, person FROM duty_assignments WHERE id = ?').bind(id).first()
      if (row) {
        await db.batch([
          db.prepare('DELETE FROM duty_assignments WHERE id = ?').bind(id),
          logActivity(db, at, by, 'unassign', row.duty_id, row.person),
        ])
      }
      break
    }

    case 'addDuty': {
      const sectionId = String(body.sectionId || '')
      const title = cleanName(body.title, 120)
      const detail = cleanName(body.detail, 400)
      if (!ID.test(sectionId)) return json(400, { error: 'Unknown section.' })
      if (title.length < 3) return json(400, { error: 'Give the duty a short title.' })

      const { total } = await db.prepare('SELECT COUNT(*) AS total FROM duty_custom').first()
      if (total >= MAX_CUSTOM) return json(429, { error: 'Too many added duties.' })

      const id = `c-${crypto.randomUUID().slice(0, 8)}`
      await db.batch([
        db
          .prepare('INSERT INTO duty_custom (id, section_id, title, detail, added_by, added_at) VALUES (?, ?, ?, ?, ?, ?)')
          .bind(id, sectionId, title, detail, by, at),
        logActivity(db, at, by, 'addDuty', id, title),
      ])
      break
    }

    case 'removeDuty': {
      const id = String(body.id || '')
      if (!/^c-[a-f0-9]{8}$/.test(id)) return json(400, { error: 'Only added duties can be removed.' })
      const row = await db.prepare('SELECT title FROM duty_custom WHERE id = ? AND removed_at IS NULL').bind(id).first()
      if (row) {
        await db.batch([
          db.prepare('UPDATE duty_custom SET removed_at = ? WHERE id = ?').bind(at, id),
          logActivity(db, at, by, 'removeDuty', id, row.title),
        ])
      }
      break
    }

    case 'addEvent':
    case 'updateEvent': {
      const date = String(body.date || '')
      const time = String(body.time || '')
      const title = cleanName(body.title, 120)
      const description = cleanText(body.description, 1000)
      if (!DATE.test(date)) return json(400, { error: 'Pick a date.' })
      if (time && !TIME.test(time)) return json(400, { error: 'Pick a valid time.' })
      if (title.length < 3) return json(400, { error: 'Give the activity a short title.' })

      if (body.action === 'addEvent') {
        const { total } = await db.prepare('SELECT COUNT(*) AS total FROM duty_events').first()
        if (total >= MAX_EVENTS) return json(429, { error: 'Too many activities.' })
        const id = `e-${crypto.randomUUID().slice(0, 8)}`
        await db.batch([
          db
            .prepare('INSERT INTO duty_events (id, date, time, title, description, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .bind(id, date, time, title, description, by, at),
          logActivity(db, at, by, 'addEvent', id, title),
        ])
      } else {
        const id = String(body.id || '')
        if (!EVENT_ID.test(id)) return json(400, { error: 'Unknown activity.' })
        const result = await db
          .prepare('UPDATE duty_events SET date = ?, time = ?, title = ?, description = ?, updated_by = ?, updated_at = ? WHERE id = ? AND removed_at IS NULL')
          .bind(date, time, title, description, by, at, id)
          .run()
        if (!result.meta.changes) return json(404, { error: 'That activity was removed.' })
        await logActivity(db, at, by, 'updateEvent', id, title).run()
      }
      break
    }

    case 'removeEvent': {
      const id = String(body.id || '')
      if (!EVENT_ID.test(id)) return json(400, { error: 'Unknown activity.' })
      const row = await db.prepare('SELECT title FROM duty_events WHERE id = ? AND removed_at IS NULL').bind(id).first()
      if (row) {
        await db.batch([
          db.prepare('UPDATE duty_events SET removed_at = ? WHERE id = ?').bind(at, id),
          logActivity(db, at, by, 'removeEvent', id, row.title),
        ])
      }
      break
    }

    case 'addTodo': {
      const eventId = String(body.eventId || '')
      const text = cleanName(body.text, 200)
      if (!EVENT_ID.test(eventId)) return json(400, { error: 'Unknown activity.' })
      if (text.length < 2) return json(400, { error: 'Write the to-do first.' })
      const { total } = await db.prepare('SELECT COUNT(*) AS total FROM duty_todos').first()
      if (total >= MAX_TODOS) return json(429, { error: 'Too many to-dos.' })
      await db.batch([
        db.prepare('INSERT INTO duty_todos (event_id, text, added_by, added_at) VALUES (?, ?, ?, ?)').bind(eventId, text, by, at),
        logActivity(db, at, by, 'addTodo', eventId, text),
      ])
      break
    }

    case 'toggleTodo': {
      const id = Number(body.id)
      if (!Number.isInteger(id)) return json(400, { error: 'Unknown to-do.' })
      const done = body.done ? 1 : 0
      const row = await db.prepare('SELECT event_id, text FROM duty_todos WHERE id = ?').bind(id).first()
      if (row) {
        await db.batch([
          db.prepare('UPDATE duty_todos SET done = ?, done_by = ? WHERE id = ?').bind(done, done ? by : null, id),
          logActivity(db, at, by, done ? 'doneTodo' : 'undoTodo', row.event_id, row.text),
        ])
      }
      break
    }

    case 'removeTodo': {
      const id = Number(body.id)
      if (!Number.isInteger(id)) return json(400, { error: 'Unknown to-do.' })
      const row = await db.prepare('SELECT event_id, text FROM duty_todos WHERE id = ?').bind(id).first()
      if (row) {
        await db.batch([
          db.prepare('DELETE FROM duty_todos WHERE id = ?').bind(id),
          logActivity(db, at, by, 'removeTodo', row.event_id, row.text),
        ])
      }
      break
    }

    default:
      return json(400, { error: 'Unknown action.' })
  }

  return json(200, { ...(await readState(db)), ...(me ? { me } : {}) })
}
