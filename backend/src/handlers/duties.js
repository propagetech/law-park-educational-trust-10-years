/**
 * Duties API for /event-duties — one Lambda behind the HTTP API.
 *
 *   GET  /duties   everything the page shows
 *   POST /duties   { action, by, ... } one change, then everything again
 *
 * No passwords, by design: every write carries the name the person signed in
 * with, and every change lands in the LOG so nothing happens unseen.
 * Activities (EVENT) and duties are both "parents": tasks (TODO) point at one
 * through event_id, and the people on a duty or in charge of an activity are
 * ASSIGN items keyed by that same id.
 */
import { randomBytes } from 'node:crypto'
import { dynamoStore } from '../lib/store.js'
import { SEED_ACTIVITIES, SEED_DUTY_TASKS } from '../seed.js'

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

let store = process.env.TABLE_NAME ? dynamoStore(process.env.TABLE_NAME) : null

// The local dev server swaps in the in-memory store.
export function useStore(s) {
  store = s
  seeding = undefined
}

const ID = /^[a-z0-9-]{1,64}$/
const EVENT_ID = /^e-[a-z0-9-]{1,40}$/
const TODO_ID = /^[0-9a-z]{4,24}$/
const DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/
const STATUSES = new Set(['todo', 'doing', 'stuck', 'done'])
const MAX = { members: 500, assignments: 3000, custom: 200, events: 300, todos: 2000, comments: 5000 }
const MOBILE_HELP = 'Enter a mobile number. Add the country code, like +1, if it is not an Indian number.'
const NAME_TAKEN = 'Someone on the team already uses that name. Add an initial or surname.'

/* ---------------------------------------------------------------- helpers */

function respond(statusCode, body, origin) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...(origin && ALLOWED_ORIGINS.includes(origin) ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}),
    },
    body: JSON.stringify(body),
  }
}

// Time-ordered ids, so records of one kind come back in the order they were made.
function newId() {
  return Date.now().toString(36).padStart(9, '0') + randomBytes(3).toString('hex')
}

const lower = (s) => String(s ?? '').toLowerCase()

// Mobile numbers are stored with their country code, like +919876543210.
// Without a + (or 00) prefix a number is read as Indian. Mirrors cleanMobile
// in website/components/event-duties/shared.tsx.
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

const fail = (status, error) => ({ status, error })

/* ------------------------------------------------------------ seed once */

let seeding

function ensureSeed() {
  if (!seeding) {
    seeding = seedAll().catch((err) => {
      seeding = undefined
      throw err
    })
  }
  return seeding
}

// Starting data is copied in once. Seed items have fixed ids and are only
// written if absent, so two cold starts racing on a new table write the same
// thing, and a run cut short is simply finished by the next one. The META
// flag means a schedule the team emptied on purpose is never refilled.
async function seedOnce(key, build) {
  if (await store.get('META', key)) return
  const at = new Date().toISOString()
  const items = build(at)
  for (let i = 0; i < items.length; i += 25) {
    await Promise.all(items.slice(i, i + 25).map((item) => store.put(item, { ifAbsent: true })))
  }
  await store.put({ pk: 'META', sk: key, value: at })
}

const seedTodo = (sk, eventId, text, at) => ({
  pk: 'TODO',
  sk,
  event_id: eventId,
  text,
  done: 0,
  added_by: 'Planning team',
  added_at: at,
  status: 'todo',
})

async function seedAll() {
  await seedOnce('activities_seeded', (at) => {
    const items = []
    let n = 0
    for (const a of SEED_ACTIVITIES) {
      items.push({ pk: 'EVENT', sk: a.id, date: a.date, time: a.time, title: a.title, description: a.description, updated_by: 'Planning team', updated_at: at })
      // '0a' sorts before every newId(), so starting tasks stay first, in order.
      for (const text of a.todos) items.push(seedTodo(`0a${String(n++).padStart(4, '0')}`, a.id, text, at))
    }
    return items
  })
  await seedOnce('duty_tasks_seeded', (at) => {
    const items = []
    let n = 0
    for (const [dutyId, tasks] of Object.entries(SEED_DUTY_TASKS)) {
      for (const text of tasks) items.push(seedTodo(`0d${String(n++).padStart(4, '0')}`, dutyId, text, at))
    }
    return items
  })
}

/* ---------------------------------------------------------------- read */

async function readState() {
  const [assign, custom, log, members, events, todos, comments] = await Promise.all([
    store.query('ASSIGN'),
    store.query('CUSTOM'),
    store.query('LOG', { reverse: true, limit: 40 }),
    store.query('MEMBER'),
    store.query('EVENT'),
    store.query('TODO'),
    store.query('COMMENT'),
  ])
  return {
    assignments: assign
      .sort((a, b) => a.added_at.localeCompare(b.added_at) || a.sk.localeCompare(b.sk))
      .map((a) => ({ id: a.sk, duty_id: a.duty_id, person: a.person, added_by: a.added_by, added_at: a.added_at })),
    custom: custom
      .filter((c) => !c.removed_at)
      .sort((a, b) => a.added_at.localeCompare(b.added_at))
      .map((c) => ({ id: c.sk, section_id: c.section_id, title: c.title, detail: c.detail ?? '', added_by: c.added_by, added_at: c.added_at })),
    activity: log.map((l) => ({
      id: l.sk,
      at: l.at,
      by_name: l.by_name,
      action: l.action,
      duty_id: l.duty_id ?? null,
      person: l.person ?? null,
      detail: l.detail ?? null,
    })),
    members: members.map((m) => ({ name: m.name, mobile: m.sk })).sort((a, b) => a.name.localeCompare(b.name)),
    events: events
      .filter((e) => !e.removed_at)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '99').localeCompare(b.time || '99'))
      .map((e) => ({
        id: e.sk,
        date: e.date,
        time: e.time ?? '',
        title: e.title,
        description: e.description ?? '',
        updated_by: e.updated_by,
        updated_at: e.updated_at,
      })),
    todos: todos.map((t) => ({
      id: t.sk,
      event_id: t.event_id,
      text: t.text,
      done: t.done ?? 0,
      done_by: t.done_by ?? null,
      added_by: t.added_by,
      assignee: t.assignee ?? null,
      status: t.status ?? 'todo',
      updated_by: t.updated_by ?? null,
      updated_at: t.updated_at ?? null,
    })),
    comments: comments.map((c) => ({ id: c.sk, todo_id: c.todo_id, by_name: c.by_name, text: c.text, at: c.at })),
  }
}

/* ---------------------------------------------------------------- write */

async function act(body) {
  const by = cleanName(body.by)
  if (by.length < 2) return fail(400, 'Enter your name first.')
  const at = new Date().toISOString()
  const log = (action, dutyId, person, detail) =>
    store.put({ pk: 'LOG', sk: newId(), at, by_name: by, action, duty_id: dutyId ?? null, person: person ?? null, detail: detail ?? null })
  const logAs = (name, action, dutyId, person, detail) =>
    store.put({ pk: 'LOG', sk: newId(), at, by_name: name, action, duty_id: dutyId ?? null, person: person ?? null, detail: detail ?? null })

  switch (body.action) {
    case 'hello': {
      // Sign-in. A known number signs in under its saved name; a new one is
      // added to the team with the name typed.
      const mobile = cleanMobile(body.mobile)
      if (!mobile) return fail(400, MOBILE_HELP)
      const known = await store.get('MEMBER', mobile)
      if (known) {
        await store.update('MEMBER', mobile, { last_seen: at })
        if (!known.last_seen) await logAs(known.name, 'joined')
        return { me: { name: known.name, mobile } }
      }
      const members = await store.query('MEMBER')
      if (members.some((m) => lower(m.name) === lower(by))) return fail(409, NAME_TAKEN)
      if (members.length >= MAX.members) return fail(429, 'The team list is full.')
      if (!(await store.put({ pk: 'MEMBER', sk: mobile, name: by, first_seen: at, last_seen: at }, { ifAbsent: true }))) {
        // Added a moment ago from another phone: sign in as that entry.
        const now = await store.get('MEMBER', mobile)
        return { me: { name: now.name, mobile } }
      }
      await log('joined')
      return { me: { name: by, mobile } }
    }

    case 'rename': {
      // Changes a person's name everywhere it is used as theirs: the team
      // list, the duties and activities they are on, their tasks and comments.
      const mobile = cleanMobile(body.mobile)
      const name = cleanName(body.name)
      if (name.length < 2) return fail(400, 'Enter your new name.')
      const member = mobile && (await store.get('MEMBER', mobile))
      if (!member) return fail(404, 'Sign in again, then change your name.')
      const old = member.name
      if (name !== old) {
        const members = await store.query('MEMBER')
        if (members.some((m) => m.sk !== mobile && lower(m.name) === lower(name))) return fail(409, NAME_TAKEN)
        await store.update('MEMBER', mobile, { name })
        const caseOnly = lower(old) === lower(name)
        for (const a of await store.query('ASSIGN')) {
          if (lower(a.person) !== lower(old)) continue
          if (caseOnly) await store.update('ASSIGN', a.sk, { person: name })
          else {
            // If the new name is already on that duty, the old entry was a duplicate.
            await store.put({ ...a, sk: `${a.duty_id}#${lower(name)}`, person: name }, { ifAbsent: true })
            await store.del('ASSIGN', a.sk)
          }
        }
        for (const t of await store.query('TODO')) {
          const fields = {}
          if (t.done_by && lower(t.done_by) === lower(old)) fields.done_by = name
          if (t.assignee && lower(t.assignee) === lower(old)) fields.assignee = name
          if (Object.keys(fields).length) await store.update('TODO', t.sk, fields)
        }
        for (const c of await store.query('COMMENT')) {
          if (lower(c.by_name) === lower(old)) await store.update('COMMENT', c.sk, { by_name: name })
        }
        await logAs(old, 'renamed', null, name)
      }
      return { me: { name, mobile } }
    }

    case 'assign': {
      const dutyId = String(body.dutyId || '')
      if (!ID.test(dutyId)) return fail(400, 'Unknown duty.')
      const people = (Array.isArray(body.people) ? body.people : [])
        .map((p) => cleanName(p))
        .filter((p) => p.length >= 2)
        .slice(0, 20)
      if (!people.length) return fail(400, 'Enter at least one name.')
      if ((await store.count('ASSIGN')) + people.length > MAX.assignments) return fail(429, 'The list is full.')
      for (const person of people) {
        // Keyed by lower-case name, so "asha k" and "Asha K" are one person.
        const added = await store.put(
          { pk: 'ASSIGN', sk: `${dutyId}#${lower(person)}`, duty_id: dutyId, person, added_by: by, added_at: at },
          { ifAbsent: true },
        )
        if (added) await log('assign', dutyId, person)
      }
      return {}
    }

    case 'unassign': {
      const id = typeof body.id === 'string' ? body.id : ''
      if (!id || id.length > 200) return fail(400, 'Unknown name.')
      const row = await store.get('ASSIGN', id)
      if (row) {
        await store.del('ASSIGN', id)
        await log('unassign', row.duty_id, row.person)
      }
      return {}
    }

    case 'addDuty': {
      const sectionId = String(body.sectionId || '')
      const title = cleanName(body.title, 120)
      const detail = cleanName(body.detail, 400)
      if (!ID.test(sectionId)) return fail(400, 'Unknown section.')
      if (title.length < 3) return fail(400, 'Give the duty a short title.')
      if ((await store.count('CUSTOM')) >= MAX.custom) return fail(429, 'Too many added duties.')
      const id = `c-${randomBytes(4).toString('hex')}`
      await store.put({ pk: 'CUSTOM', sk: id, section_id: sectionId, title, detail, added_by: by, added_at: at })
      await log('addDuty', id, title)
      return {}
    }

    case 'removeDuty': {
      const id = String(body.id || '')
      if (!/^c-[a-f0-9]{8}$/.test(id)) return fail(400, 'Only added duties can be removed.')
      const row = await store.get('CUSTOM', id)
      if (row && !row.removed_at) {
        await store.update('CUSTOM', id, { removed_at: at })
        await log('removeDuty', id, row.title)
      }
      return {}
    }

    case 'addEvent':
    case 'updateEvent': {
      const date = String(body.date || '')
      const time = String(body.time || '')
      const title = cleanName(body.title, 120)
      const description = cleanText(body.description, 1000)
      if (!DATE.test(date)) return fail(400, 'Pick a date.')
      if (time && !TIME.test(time)) return fail(400, 'Pick a valid time.')
      if (title.length < 3) return fail(400, 'Give the activity a short title.')
      if (body.action === 'addEvent') {
        if ((await store.count('EVENT')) >= MAX.events) return fail(429, 'Too many activities.')
        const id = `e-${randomBytes(4).toString('hex')}`
        await store.put({ pk: 'EVENT', sk: id, date, time, title, description, updated_by: by, updated_at: at })
        await log('addEvent', id, title)
      } else {
        const id = String(body.id || '')
        if (!EVENT_ID.test(id)) return fail(400, 'Unknown activity.')
        const ok = await store.update('EVENT', id, { date, time, title, description, updated_by: by, updated_at: at }, { ifLive: true })
        if (!ok) return fail(404, 'That activity was removed.')
        await log('updateEvent', id, title)
      }
      return {}
    }

    case 'removeEvent': {
      const id = String(body.id || '')
      if (!EVENT_ID.test(id)) return fail(400, 'Unknown activity.')
      const row = await store.get('EVENT', id)
      if (row && !row.removed_at) {
        await store.update('EVENT', id, { removed_at: at })
        await log('removeEvent', id, row.title)
      }
      return {}
    }

    case 'addTodo': {
      // eventId names what the task belongs to: an activity or a duty.
      const eventId = String(body.eventId || '')
      const text = cleanName(body.text, 200)
      const assignee = cleanName(body.assignee) || null
      if (!ID.test(eventId)) return fail(400, 'Unknown activity or duty.')
      if (text.length < 2) return fail(400, 'Write the task first.')
      if ((await store.count('TODO')) >= MAX.todos) return fail(429, 'Too many tasks.')
      await store.put({
        pk: 'TODO',
        sk: newId(),
        event_id: eventId,
        text,
        done: 0,
        added_by: by,
        added_at: at,
        assignee,
        status: 'todo',
        updated_by: by,
        updated_at: at,
      })
      await log('addTodo', eventId, text, assignee)
      return {}
    }

    case 'editTodo': {
      const id = String(body.id || '')
      const text = cleanName(body.text, 200)
      if (!TODO_ID.test(id)) return fail(400, 'Unknown task.')
      if (text.length < 2) return fail(400, 'Write the task first.')
      const row = await store.get('TODO', id)
      if (!row) return fail(404, 'That task was removed.')
      if (row.text !== text) {
        await store.update('TODO', id, { text, updated_by: by, updated_at: at })
        await log('editTodo', row.event_id, text, row.text)
      }
      return {}
    }

    // toggleTodo is kept for pages opened before task statuses existed.
    case 'toggleTodo':
    case 'setTodoStatus': {
      const id = String(body.id || '')
      if (!TODO_ID.test(id)) return fail(400, 'Unknown task.')
      const status = body.action === 'toggleTodo' ? (body.done ? 'done' : 'todo') : String(body.status || '')
      if (!STATUSES.has(status)) return fail(400, 'Unknown status.')
      const row = await store.get('TODO', id)
      if (!row) return fail(404, 'That task was removed.')
      if ((row.status ?? 'todo') !== status) {
        const done = status === 'done' ? 1 : 0
        await store.update('TODO', id, { status, done, done_by: done ? by : null, updated_by: by, updated_at: at })
        await log('statusTodo', row.event_id, row.text, status)
      }
      return {}
    }

    case 'assignTodo': {
      const id = String(body.id || '')
      if (!TODO_ID.test(id)) return fail(400, 'Unknown task.')
      const assignee = cleanName(body.assignee) || null
      const row = await store.get('TODO', id)
      if (!row) return fail(404, 'That task was removed.')
      if ((row.assignee ?? null) !== assignee) {
        await store.update('TODO', id, { assignee, updated_by: by, updated_at: at })
        await log('assignTodo', row.event_id, row.text, assignee)
      }
      return {}
    }

    case 'addComment': {
      const todoId = String(body.todoId || '')
      const text = cleanText(body.text, 500)
      if (!TODO_ID.test(todoId)) return fail(400, 'Unknown task.')
      if (!text) return fail(400, 'Write your comment first.')
      const row = await store.get('TODO', todoId)
      if (!row) return fail(404, 'That task was removed.')
      if ((await store.count('COMMENT')) >= MAX.comments) return fail(429, 'Too many comments.')
      await store.put({ pk: 'COMMENT', sk: newId(), todo_id: todoId, by_name: by, text, at })
      await log('comment', row.event_id, row.text, text.slice(0, 120))
      return {}
    }

    case 'removeTodo': {
      const id = String(body.id || '')
      if (!TODO_ID.test(id)) return fail(400, 'Unknown task.')
      const row = await store.get('TODO', id)
      if (row) {
        await store.del('TODO', id)
        for (const c of await store.query('COMMENT')) if (c.todo_id === id) await store.del('COMMENT', c.sk)
        await log('removeTodo', row.event_id, row.text)
      }
      return {}
    }

    default:
      return fail(400, 'Unknown action.')
  }
}

/* ---------------------------------------------------------------- entry */

export async function handler(event) {
  const headers = event.headers || {}
  const origin = headers.origin || headers.Origin || ''
  const reply = (status, body) => respond(status, body, origin)
  const method = event.requestContext?.http?.method || ''

  if (!store) return reply(503, { error: 'Database is not connected yet.' })
  // Browsers always send Origin on these requests; only the event site may call.
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return reply(403, { error: 'Wrong origin.' })

  try {
    await ensureSeed()
    if (method === 'GET') return reply(200, await readState())
    if (method !== 'POST') return reply(405, { error: 'Method not allowed.' })

    // A JSON content type forces a CORS preflight, which the HTTP API only
    // passes for the allowed origins, so other sites cannot write here.
    if (!String(headers['content-type'] || headers['Content-Type'] || '').includes('application/json')) {
      return reply(415, { error: 'Send JSON.' })
    }
    let body
    try {
      const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body || ''
      body = JSON.parse(raw)
    } catch {
      return reply(400, { error: 'Invalid JSON.' })
    }
    if (!body || typeof body !== 'object') return reply(400, { error: 'Invalid JSON.' })

    const result = await act(body)
    if (result.error) return reply(result.status, { error: result.error })
    return reply(200, { ...(await readState()), ...(result.me ? { me: result.me } : {}) })
  } catch (err) {
    console.error('duties error:', err)
    return reply(500, { error: 'Something went wrong. Please try again.' })
  }
}
