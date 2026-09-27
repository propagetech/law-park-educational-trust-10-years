'use client'

import { useState } from 'react'
import {
  PeopleEditor,
  inputClass,
  primaryButtonClass,
  sameName,
  tidy,
  timeAgo,
  type Assignment,
  type Comment,
  type EventActivity,
  type Member,
  type Filter,
  type Post,
  type Todo,
} from './shared'
import { TaskList } from './Tasks'

const DEFAULT_DATE = '2026-10-04'

export function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return date
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

// 2026-10-04 -> Sun, 4 Oct
export function formatShortDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatTime(time: string) {
  if (!time) return 'Any time'
  const [h, m] = time.split(':').map(Number)
  const suffix = h < 12 ? 'AM' : 'PM'
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`
}

// Activities with no time sort to the end of their day.
export function sortActivities(events: EventActivity[]) {
  return [...events].sort((a, b) => a.date.localeCompare(b.date) || (a.time || '99').localeCompare(b.time || '99'))
}

/* ------------------------------------------------------------------ */

interface EventDraft {
  date: string
  time: string
  title: string
  description: string
}

function EventForm({
  idPrefix,
  initial,
  submitLabel,
  onSave,
  onCancel,
}: {
  idPrefix: string
  initial: EventDraft
  submitLabel: string
  onSave: (draft: EventDraft) => Promise<boolean>
  onCancel: () => void
}) {
  const [draft, setDraft] = useState(initial)
  const [saving, setSaving] = useState(false)
  const valid = Boolean(draft.date) && tidy(draft.title).length >= 3

  function field<K extends keyof EventDraft>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft({ ...draft, [key]: e.target.value })
  }

  return (
    <form
      className="rounded-xl bg-surface p-5 ring-2 ring-focus print:hidden"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!valid) return
        setSaving(true)
        const ok = await onSave(draft)
        setSaving(false)
        if (ok) onCancel()
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-date`} className="block text-sm font-semibold text-ink">
            Date
          </label>
          <input id={`${idPrefix}-date`} type="date" required value={draft.date} onChange={field('date')} className={`mt-1 w-full ${inputClass}`} />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-time`} className="block text-sm font-semibold text-ink">
            Time <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input id={`${idPrefix}-time`} type="time" value={draft.time} onChange={field('time')} className={`mt-1 w-full ${inputClass}`} />
        </div>
      </div>
      <label htmlFor={`${idPrefix}-title`} className="mt-4 block text-sm font-semibold text-ink">
        Activity
      </label>
      <input
        id={`${idPrefix}-title`}
        type="text"
        required
        maxLength={120}
        value={draft.title}
        onChange={field('title')}
        className={`mt-1 w-full ${inputClass}`}
        autoFocus
      />
      <label htmlFor={`${idPrefix}-description`} className="mt-4 block text-sm font-semibold text-ink">
        Description <span className="font-normal text-ink-muted">(optional)</span>
      </label>
      <textarea
        id={`${idPrefix}-description`}
        rows={3}
        maxLength={1000}
        value={draft.description}
        onChange={field('description')}
        className={`mt-1 w-full ${inputClass}`}
      />
      <div className="mt-4 flex gap-2">
        <button type="submit" disabled={!valid || saving} className={primaryButtonClass}>
          {saving ? 'Saving…' : submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-muted">
          Cancel
        </button>
      </div>
    </form>
  )
}

/* ------------------------------------------------------------------ */

interface EventCardProps {
  event: EventActivity
  owners: Assignment[]
  todos: Todo[]
  commentsByTodo: Map<string, Comment[]>
  members: Member[]
  phones: Map<string, string>
  me: string
  busy: boolean
  post: Post
}

function EventCard({ event, owners, todos, commentsByTodo, members, phones, me, busy, post }: EventCardProps) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <li>
        <EventForm
          idPrefix={`edit-${event.id}`}
          initial={{ date: event.date, time: event.time, title: event.title, description: event.description }}
          submitLabel="Save changes"
          onSave={(d) => post({ action: 'updateEvent', id: event.id, ...d }, event.id)}
          onCancel={() => setEditing(false)}
        />
      </li>
    )
  }

  return (
    <li>
      <article className="grid gap-x-6 gap-y-2 rounded-xl bg-surface p-5 shadow-sm ring-1 ring-line grid-cols-1 sm:grid-cols-[6.5rem_minmax(0,1fr)] print:break-inside-avoid print:shadow-none">
        <p className="font-semibold tabular-nums text-gold-ink">{formatTime(event.time)}</p>
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <h3 className="min-w-0 break-words font-semibold leading-snug text-ink">{event.title}</h3>
            <div className="flex shrink-0 gap-1 print:hidden">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex min-h-9 items-center rounded-md px-3 text-sm font-semibold text-link hover:bg-accent-soft"
                aria-label={`Edit ${event.title}`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Remove "${event.title}" from the schedule?`)) void post({ action: 'removeEvent', id: event.id })
                }}
                className="inline-flex min-h-9 items-center rounded-md px-3 text-sm font-semibold text-ink-muted hover:bg-danger-soft hover:text-danger-ink"
                aria-label={`Remove ${event.title}`}
              >
                Remove
              </button>
            </div>
          </div>
          {event.description && <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{event.description}</p>}

          <h4 className="mt-5 text-sm font-semibold text-ink">In charge</h4>
          <PeopleEditor
            id={event.id}
            label={event.title}
            people={owners}
            phones={phones}
            me={me}
            busy={busy}
            post={post}
            emptyText="No one in charge yet"
            className="mt-2"
          />

          <TaskList parentId={event.id} parentTitle={event.title} todos={todos} commentsByTodo={commentsByTodo} members={members} me={me} busy={busy} post={post} />

          <p className="mt-4 text-xs text-ink-muted">
            Last edited by {event.updated_by}, {timeAgo(event.updated_at)}
          </p>
        </div>
      </article>
    </li>
  )
}

/* ------------------------------------------------------------------ */

interface ScheduleProps {
  events: EventActivity[]
  todos: Todo[]
  comments: Comment[]
  members: Member[]
  byDuty: Map<string, Assignment[]>
  phones: Map<string, string>
  me: string
  busyKey: string | null
  filter: Filter
  query: string
  loaded: boolean
  post: Post
}

export function Schedule({ events, todos, comments, members, byDuty, phones, me, busyKey, filter, query, loaded, post }: ScheduleProps) {
  const [adding, setAdding] = useState(false)

  const todosByEvent = new Map<string, Todo[]>()
  for (const t of todos) {
    const list = todosByEvent.get(t.event_id) ?? []
    list.push(t)
    todosByEvent.set(t.event_id, list)
  }

  const commentsByTodo = new Map<string, Comment[]>()
  for (const c of comments) {
    const list = commentsByTodo.get(c.todo_id) ?? []
    list.push(c)
    commentsByTodo.set(c.todo_id, list)
  }

  const q = query.trim().toLowerCase()
  const visible = sortActivities(events).filter((e) => {
    const owners = byDuty.get(e.id) ?? []
    if (filter === 'open' && owners.length) return false
    if (filter === 'mine' && !owners.some((p) => sameName(p.person, me))) return false
    if (!q) return true
    return (
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      owners.some((p) => p.person.toLowerCase().includes(q)) ||
      (todosByEvent.get(e.id) ?? []).some((t) => t.text.toLowerCase().includes(q) || (t.assignee ?? '').toLowerCase().includes(q))
    )
  })

  const days: [string, EventActivity[]][] = []
  for (const e of visible) {
    const last = days[days.length - 1]
    if (last && last[0] === e.date) last[1].push(e)
    else days.push([e.date, [e]])
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-ink-soft">
          Everything happening on 3 and 4 October. Tap any task to say who is doing it, how it is going, or to leave a
          comment.
        </p>
        {!adding && (
          <button type="button" onClick={() => setAdding(true)} className={`${primaryButtonClass} print:hidden`}>
            + Add activity
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-10">
          <EventForm
            idPrefix="new-event"
            initial={{ date: DEFAULT_DATE, time: '', title: '', description: '' }}
            submitLabel="Add activity"
            onSave={(d) => post({ action: 'addEvent', ...d }, 'new-event')}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      {!loaded && <p className="text-ink-soft">Loading the schedule…</p>}
      {loaded && !visible.length && (
        <p className="rounded-xl bg-surface p-6 text-ink-soft ring-1 ring-line">
          {events.length ? 'No activities match.' : 'The schedule is empty. Add the first activity.'}
        </p>
      )}

      {days.map(([date, items]) => (
        <section key={date} className="mb-12" aria-labelledby={`day-${date}`}>
          <h2 id={`day-${date}`} className="font-serif text-2xl font-bold text-heading">
            {formatDate(date)}
          </h2>
          <ol className="mt-5 space-y-4">
            {items.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                owners={byDuty.get(e.id) ?? []}
                todos={todosByEvent.get(e.id) ?? []}
                commentsByTodo={commentsByTodo}
                members={members}
                phones={phones}
                me={me}
                busy={busyKey === e.id}
                post={post}
              />
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
