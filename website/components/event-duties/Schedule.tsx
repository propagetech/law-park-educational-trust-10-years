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
  type EventActivity,
  type Filter,
  type Post,
  type Todo,
} from './shared'

const DEFAULT_DATE = '2026-10-04'

export function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return date
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
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
      className="rounded-xl bg-white p-5 ring-2 ring-primary-300 print:hidden"
      onSubmit={async (e) => {
        e.preventDefault()
        if (!valid) return
        setSaving(true)
        const ok = await onSave(draft)
        setSaving(false)
        if (ok) onCancel()
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-date`} className="block text-sm font-semibold text-gray-800">
            Date
          </label>
          <input id={`${idPrefix}-date`} type="date" required value={draft.date} onChange={field('date')} className={`mt-1 w-full ${inputClass}`} />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-time`} className="block text-sm font-semibold text-gray-800">
            Time <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <input id={`${idPrefix}-time`} type="time" value={draft.time} onChange={field('time')} className={`mt-1 w-full ${inputClass}`} />
        </div>
      </div>
      <label htmlFor={`${idPrefix}-title`} className="mt-4 block text-sm font-semibold text-gray-800">
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
      <label htmlFor={`${idPrefix}-description`} className="mt-4 block text-sm font-semibold text-gray-800">
        Description <span className="font-normal text-gray-500">(optional)</span>
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
        <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
          Cancel
        </button>
      </div>
    </form>
  )
}

/* ------------------------------------------------------------------ */

function TodoList({ event, todos, busy, post }: { event: EventActivity; todos: Todo[]; busy: boolean; post: Post }) {
  const [draft, setDraft] = useState('')
  const done = todos.filter((t) => t.done).length

  return (
    <div className="mt-5">
      <h4 className="text-sm font-semibold text-gray-800">
        To-dos{' '}
        {todos.length > 0 && (
          <span className="font-normal text-gray-500">
            ({done} of {todos.length} done)
          </span>
        )}
      </h4>
      {todos.length > 0 && (
        <ul className="mt-2 space-y-1">
          {todos.map((t) => (
            <li key={t.id} className="group flex items-start gap-3 rounded-lg px-1 py-1 hover:bg-gray-50">
              <input
                id={`todo-${t.id}`}
                type="checkbox"
                checked={Boolean(t.done)}
                disabled={busy}
                onChange={(e) => void post({ action: 'toggleTodo', id: t.id, done: e.target.checked }, event.id)}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-gray-300 accent-primary-700"
              />
              <label htmlFor={`todo-${t.id}`} className="flex-1 text-sm leading-6">
                <span className={t.done ? 'text-gray-500 line-through' : 'text-gray-800'}>{t.text}</span>
                {t.done && t.done_by ? <span className="ml-2 text-xs text-green-800">✓ {t.done_by}</span> : null}
              </label>
              <button
                type="button"
                onClick={() => void post({ action: 'removeTodo', id: t.id }, event.id)}
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 print:hidden"
                aria-label={`Remove to-do: ${t.text}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <form
        className="mt-2 flex gap-2 print:hidden"
        onSubmit={async (e) => {
          e.preventDefault()
          const text = tidy(draft)
          if (text.length < 2) return
          if (await post({ action: 'addTodo', eventId: event.id, text }, event.id)) setDraft('')
        }}
      >
        <label htmlFor={`new-todo-${event.id}`} className="sr-only">
          Add a to-do to {event.title}
        </label>
        <input
          id={`new-todo-${event.id}`}
          type="text"
          maxLength={200}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a to-do"
          className={`min-w-0 flex-1 ${inputClass}`}
        />
        <button type="submit" disabled={busy || tidy(draft).length < 2} className={primaryButtonClass}>
          Add
        </button>
      </form>
    </div>
  )
}

interface EventCardProps {
  event: EventActivity
  owners: Assignment[]
  todos: Todo[]
  phones: Map<string, string>
  me: string
  busy: boolean
  post: Post
}

function EventCard({ event, owners, todos, phones, me, busy, post }: EventCardProps) {
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
      <article className="grid gap-x-6 gap-y-2 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 sm:grid-cols-[6.5rem_1fr] print:break-inside-avoid print:shadow-none">
        <p className="font-semibold tabular-nums text-gold-800">{formatTime(event.time)}</p>
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold leading-snug text-gray-900">{event.title}</h3>
            <div className="flex shrink-0 gap-1 print:hidden">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-md px-2 py-1 text-sm font-semibold text-primary-600 hover:bg-primary-50"
                aria-label={`Edit ${event.title}`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Remove "${event.title}" from the schedule?`)) void post({ action: 'removeEvent', id: event.id })
                }}
                className="rounded-md px-2 py-1 text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-700"
                aria-label={`Remove ${event.title}`}
              >
                Remove
              </button>
            </div>
          </div>
          {event.description && <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-gray-600">{event.description}</p>}

          <h4 className="mt-5 text-sm font-semibold text-gray-800">Owner</h4>
          <PeopleEditor
            id={event.id}
            label={event.title}
            people={owners}
            phones={phones}
            me={me}
            busy={busy}
            post={post}
            emptyText="No owner yet"
            className="mt-2"
          />

          <TodoList event={event} todos={todos} busy={busy} post={post} />

          <p className="mt-4 text-xs text-gray-500">
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
  byDuty: Map<string, Assignment[]>
  phones: Map<string, string>
  me: string
  busyKey: string | null
  filter: Filter
  query: string
  loaded: boolean
  post: Post
}

export function Schedule({ events, todos, byDuty, phones, me, busyKey, filter, query, loaded, post }: ScheduleProps) {
  const [adding, setAdding] = useState(false)

  const todosByEvent = new Map<string, Todo[]>()
  for (const t of todos) {
    const list = todosByEvent.get(t.event_id) ?? []
    list.push(t)
    todosByEvent.set(t.event_id, list)
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
      (todosByEvent.get(e.id) ?? []).some((t) => t.text.toLowerCase().includes(q))
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
        <p className="max-w-xl text-sm text-gray-600">
          Anyone on the team can add, edit or remove an activity, give it an owner, and tick off its to-dos. Every change is
          shown under Recent changes.
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

      {!loaded && <p className="text-gray-600">Loading the schedule…</p>}
      {loaded && !visible.length && (
        <p className="rounded-xl bg-white p-6 text-gray-700 ring-1 ring-gray-200">
          {events.length ? 'No activities match.' : 'The schedule is empty. Add the first activity.'}
        </p>
      )}

      {days.map(([date, items]) => (
        <section key={date} className="mb-12" aria-labelledby={`day-${date}`}>
          <h2 id={`day-${date}`} className="font-serif text-2xl font-bold text-primary-700">
            {formatDate(date)}
          </h2>
          <ol className="mt-5 space-y-4">
            {items.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                owners={byDuty.get(e.id) ?? []}
                todos={todosByEvent.get(e.id) ?? []}
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
