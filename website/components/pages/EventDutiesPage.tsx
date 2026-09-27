'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DUTY_SECTIONS, EVENT_FACTS, PILLAR_GROUPS, type Duty } from '@/data/eventDuties'
import {
  DUTIES_API as API,
  NOT_CONNECTED,
  PeopleEditor,
  cleanMobile,
  formatMobile,
  inputClass,
  primaryButtonClass,
  sameName,
  tidy,
  timeAgo,
  type Assignment,
  type Comment,
  type EventActivity,
  type Filter,
  type Member,
  type Post,
  type Todo,
  type TodoStatus,
} from '@/components/event-duties/shared'
import { Schedule, formatShortDate, formatTime, sortActivities } from '@/components/event-duties/Schedule'
import { SignIn } from '@/components/event-duties/SignIn'
import { PreferenceButtons, toolbarButtonClass, usePreferences } from '@/components/event-duties/Preferences'
import { MyTasks, type TaskParent } from '@/components/event-duties/MyTasks'
import { STATUS, TaskList, statusOf } from '@/components/event-duties/Tasks'
import { TOUR_STEPS, Tour, TourOffer } from '@/components/event-duties/Tour'

interface CustomDuty {
  id: string
  section_id: string
  title: string
  detail: string
  added_by: string
}

interface Activity {
  id: string
  at: string
  by_name: string
  action: string
  duty_id: string | null
  person: string | null
  detail: string | null
}

interface State {
  assignments: Assignment[]
  custom: CustomDuty[]
  activity: Activity[]
  members: Member[]
  events: EventActivity[]
  todos: Todo[]
  comments: Comment[]
}

type User = Member

type View = 'mine' | 'schedule' | 'duties'
const VIEWS: View[] = ['mine', 'schedule', 'duties']

const USER_KEY = 'lpet-duties-user'
const VIEW_KEY = 'lpet-duties-view'
const TOUR_KEY = 'lpet-duties-tour'
const VERSION_URL = '/duties-version.json'
const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID || 'dev'
const LOGO_ICON = '/images/event-duties/lawpark-trust-tree-icon.webp' // 252x256
const REFRESH_MS = 20000
const VERSION_CHECK_MS = 60000

function readSavedUser(): User | null {
  try {
    const saved = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    if (saved && typeof saved.name === 'string' && cleanMobile(saved.mobile)) {
      return { name: saved.name, mobile: cleanMobile(saved.mobile) }
    }
  } catch {
    // Unreadable or blocked storage: ask again.
  }
  return null
}

function saveUser(user: User | null) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  } catch {
    // Private mode: the details just last for this visit.
  }
}

// Drops cached files and reloads, so the newest pushed version is what runs.
async function reloadLatest() {
  try {
    const reg = await navigator.serviceWorker?.getRegistration('/event-duties')
    await reg?.update()
  } catch {
    // Offline or no worker: the reload below still asks the network first.
  }
  try {
    const keys = await caches.keys()
    await Promise.all(keys.filter((k) => k.startsWith('duties-')).map((k) => caches.delete(k)))
  } catch {
    // No Cache API: nothing to clear.
  }
  window.location.reload()
}

function RefreshIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  )
}

function readSavedView(): View {
  try {
    const saved = localStorage.getItem(VIEW_KEY) as View | null
    return saved && VIEWS.includes(saved) ? saved : 'mine'
  } catch {
    return 'mine'
  }
}

function saveView(view: View) {
  try {
    localStorage.setItem(VIEW_KEY, view)
  } catch {
    // Not remembered in private mode; harmless.
  }
}

/* ------------------------------------------------------------------ */

function StatusPill({ have, need }: { have: number; need: number }) {
  if (have >= need) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-success-ink ring-1 ring-success-line">
        <span aria-hidden>✓</span> Covered
      </span>
    )
  }
  if (have === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-danger-soft px-2.5 py-0.5 text-xs font-semibold text-danger-ink ring-1 ring-danger-line">
        Needs {need}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-warn-soft px-2.5 py-0.5 text-xs font-semibold text-warn-ink ring-1 ring-warn-line">
      {have} of {need}
    </span>
  )
}

interface DutyCardProps {
  duty: Duty
  custom?: CustomDuty
  people: Assignment[]
  todos: Todo[]
  commentsByTodo: Map<string, Comment[]>
  members: Member[]
  phones: Map<string, string>
  me: string
  busy: boolean
  post: Post
  onRemoveDuty: (id: string) => void
}

function DutyCard({ duty, custom, people, todos, commentsByTodo, members, phones, me, busy, post, onRemoveDuty }: DutyCardProps) {
  // Folded by default, so 82 cards stay easy to scan.
  const [tasksOpen, setTasksOpen] = useState(false)
  const done = todos.filter((t) => statusOf(t) === 'done').length
  return (
    <article className="flex flex-col rounded-xl bg-surface p-5 shadow-sm ring-1 ring-line print:break-inside-avoid print:shadow-none">
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <h3 className="min-w-0 break-words font-semibold text-ink leading-snug">{duty.title}</h3>
        <div className="shrink-0">
          <StatusPill have={people.length} need={duty.need} />
        </div>
      </div>
      {duty.when && <p className="mt-1 text-sm font-medium text-gold-ink">{duty.when}</p>}
      {duty.detail && <p className="mt-2 text-sm text-ink-soft leading-relaxed">{duty.detail}</p>}
      {custom && (
        <p className="mt-2 text-xs text-ink-muted">
          Added by {custom.added_by}
          {' · '}
          <button
            type="button"
            onClick={() => onRemoveDuty(custom.id)}
            className="inline-flex min-h-9 items-center underline hover:text-danger-ink print:hidden"
          >
            remove duty
          </button>
        </p>
      )}
      <PeopleEditor
        id={duty.id}
        label={duty.title}
        people={people}
        phones={phones}
        me={me}
        busy={busy}
        post={post}
        className="mt-4 flex flex-1 flex-col"
      />
      <div className="mt-4 border-t border-line pt-2">
        <button
          type="button"
          aria-expanded={tasksOpen}
          onClick={() => setTasksOpen(!tasksOpen)}
          className="flex min-h-11 w-full items-center justify-between gap-3 rounded-md text-left text-sm font-semibold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <span>
            Tasks
            {todos.length > 0 && (
              <span className="font-normal text-ink-muted">
                {' '}
                ({done} of {todos.length} done)
              </span>
            )}
          </span>
          <span className="text-link">{tasksOpen ? 'Hide' : todos.length ? 'Show' : 'Add a task'}</span>
        </button>
        {tasksOpen && (
          <div className="mt-2">
            <TaskList
              parentId={duty.id}
              parentTitle={duty.title}
              todos={todos}
              commentsByTodo={commentsByTodo}
              members={members}
              me={me}
              busy={busy}
              post={post}
              heading={false}
            />
          </div>
        )}
      </div>
    </article>
  )
}

function AddDutyForm({
  sectionId,
  onAdd,
}: {
  sectionId: string
  onAdd: (sectionId: string, title: string, detail: string) => Promise<boolean>
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-32 items-center justify-center rounded-xl border-2 border-dashed border-line-strong p-5 text-sm font-semibold text-ink-soft hover:border-focus hover:text-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-focus print:hidden"
      >
        + Add a duty we missed
      </button>
    )
  }

  return (
    <form
      className="rounded-xl border-2 border-dashed border-focus bg-surface p-5 print:hidden"
      onSubmit={async (e) => {
        e.preventDefault()
        if (tidy(title).length < 3) return
        if (await onAdd(sectionId, title, detail)) {
          setTitle('')
          setDetail('')
          setOpen(false)
        }
      }}
    >
      <label htmlFor={`new-title-${sectionId}`} className="block text-sm font-semibold text-ink">
        Duty
      </label>
      <input
        id={`new-title-${sectionId}`}
        type="text"
        maxLength={120}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={`mt-1 w-full ${inputClass}`}
        autoFocus
      />
      <label htmlFor={`new-detail-${sectionId}`} className="mt-3 block text-sm font-semibold text-ink">
        What it involves <span className="font-normal text-ink-muted">(optional)</span>
      </label>
      <textarea
        id={`new-detail-${sectionId}`}
        maxLength={400}
        rows={2}
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        className={`mt-1 w-full ${inputClass}`}
      />
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={tidy(title).length < 3}
          className="rounded-lg bg-action px-4 py-2 text-sm font-semibold text-on-action hover:bg-action-hover disabled:opacity-40"
        >
          Add duty
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-muted">
          Cancel
        </button>
      </div>
    </form>
  )
}

/* ------------------------------------------------------------------ */

const ACTION_TEXT: Record<string, string> = {
  assign: 'added',
  unassign: 'removed',
  addDuty: 'added the duty',
  removeDuty: 'removed the duty',
  joined: 'joined the page',
  renamed: 'is now',
  addEvent: 'added the activity',
  updateEvent: 'edited the activity',
  removeEvent: 'removed the activity',
  addTodo: 'added the task',
  doneTodo: 'ticked',
  undoTodo: 'unticked',
  removeTodo: 'removed the task',
  editTodo: 'reworded the task',
  statusTodo: 'marked',
  assignTodo: 'gave',
  comment: 'commented on',
}

function tourSeen() {
  try {
    return Boolean(localStorage.getItem(TOUR_KEY))
  } catch {
    return true // storage blocked: do not offer it on every visit
  }
}

function markTourSeen(how: 'done' | 'skipped') {
  try {
    localStorage.setItem(TOUR_KEY, how)
  } catch {
    // Private mode: it may be offered again next visit.
  }
}

const userBarButtonClass =
  'inline-flex min-h-9 items-center rounded-full px-3 font-semibold text-link hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus'

const TODO_ACTIONS = new Set(['addTodo', 'doneTodo', 'undoTodo', 'removeTodo', 'editTodo', 'comment'])

function EventDutiesPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [editing, setEditing] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [newName, setNewName] = useState('')
  const [updateReady, setUpdateReady] = useState(false)
  const me = user?.name ?? ''
  const [state, setState] = useState<State | null>(null)
  const [error, setError] = useState('')
  const [busyDuty, setBusyDuty] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [view, setView] = useState<View>('mine')
  const [touring, setTouring] = useState(false)
  const [tourHandled, setTourHandled] = useState(false)
  const prefs = usePreferences()

  useEffect(() => {
    // localStorage only exists in the browser, after the static page loads.
    setUser(readSavedUser())
    setView(readSavedView())
  }, [])

  function switchView(next: View) {
    setView(next)
    saveView(next)
    window.scrollTo({ top: 0 })
  }

  // Installable app: the worker URL carries the build id, so each deploy
  // installs a fresh worker and drops the old caches.
  useEffect(() => {
    if (!('serviceWorker' in navigator) || BUILD_ID === 'dev') return
    navigator.serviceWorker
      .register(`/event-duties-sw.js?v=${encodeURIComponent(BUILD_ID)}&api=${encodeURIComponent(API)}`, { scope: '/event-duties' })
      .catch(() => {})
  }, [])

  // Tell the person when newer code has been pushed since this copy loaded.
  useEffect(() => {
    if (BUILD_ID === 'dev') return
    async function check() {
      try {
        const res = await fetch(VERSION_URL, { cache: 'no-store' })
        const { version } = await res.json()
        if (version && version !== BUILD_ID) setUpdateReady(true)
      } catch {
        // Offline: check again later.
      }
    }
    void check()
    const timer = setInterval(() => {
      if (!document.hidden) void check()
    }, VERSION_CHECK_MS)
    const onVisible = () => {
      if (!document.hidden) void check()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  // A returning phone signs in again on each visit, which also picks up a
  // name changed from another phone.
  const userMobile = user?.mobile
  useEffect(() => {
    if (!userMobile || !API) return
    const saved = readSavedUser()
    if (!saved || saved.mobile !== userMobile) return
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'hello', by: saved.name, mobile: saved.mobile }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.me && body.me.name !== saved.name) {
          saveUser(body.me)
          setUser(body.me)
        }
      })
      .catch(() => {})
  }, [userMobile])

  const load = useCallback(async () => {
    if (!API) {
      setError(NOT_CONNECTED)
      return
    }
    try {
      const res = await fetch(API, { cache: 'no-store' })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Could not load duties.')
      setState(body)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load duties.')
    }
  }, [])

  useEffect(() => {
    if (!me || editing) return
    void load()
    const timer = setInterval(() => {
      if (!document.hidden) void load()
    }, REFRESH_MS)
    const onFocus = () => void load()
    window.addEventListener('focus', onFocus)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', onFocus)
    }
  }, [me, editing, load])

  const post = useCallback<Post>(
    async (payload, busyKey) => {
      if (!API) {
        setError(NOT_CONNECTED)
        return false
      }
      setBusyDuty(busyKey ?? 'page')
      try {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, by: me }),
        })
        const body = await res.json()
        if (!res.ok) throw new Error(body.error || 'Could not save.')
        setState(body)
        setError('')
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save. Check your connection and try again.')
        return false
      } finally {
        setBusyDuty(null)
      }
    },
    [me],
  )

  const byDuty = useMemo(() => {
    const map = new Map<string, Assignment[]>()
    for (const a of state?.assignments ?? []) {
      const list = map.get(a.duty_id) ?? []
      list.push(a)
      map.set(a.duty_id, list)
    }
    return map
  }, [state])

  const sections = useMemo(
    () =>
      DUTY_SECTIONS.map((section) => ({
        ...section,
        items: [
          ...section.duties.map((duty) => ({ duty, custom: undefined as CustomDuty | undefined })),
          ...(state?.custom ?? [])
            .filter((c) => c.section_id === section.id)
            .map((c) => ({ duty: { id: c.id, title: c.title, detail: c.detail, need: 1 }, custom: c })),
        ],
      })),
    [state],
  )

  const allItems = sections.flatMap((s) => s.items)
  const covered = allItems.filter(({ duty }) => (byDuty.get(duty.id)?.length ?? 0) >= duty.need).length
  const empty = allItems.filter(({ duty }) => !byDuty.get(duty.id)?.length).length
  const everyone = useMemo(() => {
    const names = new Map<string, string>()
    for (const a of state?.assignments ?? []) names.set(a.person.toLowerCase(), a.person)
    return [...names.values()].sort((a, b) => a.localeCompare(b))
  }, [state])
  // Name suggestions for the duty inputs: the whole team plus anyone typed in.
  const knownNames = useMemo(() => {
    const names = new Map<string, string>()
    for (const m of state?.members ?? []) names.set(m.name.toLowerCase(), m.name)
    for (const n of everyone) names.set(n.toLowerCase(), n)
    return [...names.values()].sort((a, b) => a.localeCompare(b))
  }, [state, everyone])
  const phones = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of state?.members ?? []) map.set(m.name.toLowerCase(), m.mobile)
    return map
  }, [state])
  const mineCount = me ? allItems.filter(({ duty }) => byDuty.get(duty.id)?.some((p) => sameName(p.person, me))).length : 0

  const events = useMemo(() => sortActivities(state?.events ?? []), [state])
  const titleOf = useCallback(
    (id: string | null) => {
      if (!id) return ''
      return (
        allItems.find(({ duty }) => duty.id === id)?.duty.title ??
        events.find((e) => e.id === id)?.title ??
        // A removed activity: its title is still in the log entries about it.
        state?.activity.find((a) => a.duty_id === id && /Event$/.test(a.action))?.person ??
        ''
      )
    },
    [allItems, events, state],
  )
  const todos = useMemo(() => state?.todos ?? [], [state])
  const todosByParent = useMemo(() => {
    const map = new Map<string, Todo[]>()
    for (const t of todos) {
      const list = map.get(t.event_id) ?? []
      list.push(t)
      map.set(t.event_id, list)
    }
    return map
  }, [todos])
  const commentsByTodo = useMemo(() => {
    const map = new Map<string, Comment[]>()
    for (const c of state?.comments ?? []) {
      const list = map.get(c.todo_id) ?? []
      list.push(c)
      map.set(c.todo_id, list)
    }
    return map
  }, [state])
  // Everything a task can belong to, as My tasks shows it.
  const parents = useMemo(() => {
    const map = new Map<string, TaskParent>()
    for (const e of events) {
      map.set(e.id, { caption: `${formatShortDate(e.date)} · ${formatTime(e.time)} · ${e.title}`, sortKey: `${e.date} ${e.time || '23:59'}` })
    }
    for (const section of sections) {
      for (const { duty } of section.items) map.set(duty.id, { caption: `${section.title} · ${duty.title}`, sortKey: section.sortKey })
    }
    return map
  }, [events, sections])
  const liveEventIds = new Set(events.map((e) => e.id))
  const openTodos = todos.filter((t) => statusOf(t) !== 'done' && liveEventIds.has(t.event_id)).length
  const myOpenTasks = todos.filter(
    (t) => statusOf(t) !== 'done' && parents.has(t.event_id) && t.assignee && sameName(t.assignee, me),
  ).length
  const myDuties = allItems.filter(({ duty }) => byDuty.get(duty.id)?.some((p) => sameName(p.person, me))).map(({ duty }) => duty.title)
  const ownerless = events.filter((e) => !byDuty.get(e.id)?.length).length
  const myEvents = events.filter((e) => byDuty.get(e.id)?.some((p) => sameName(p.person, me))).length

  if (user === undefined) return <div className="duties-app min-h-screen bg-primary-700" />
  if (!user || editing) {
    return (
      <SignIn
        toolbar={<PreferenceButtons prefs={prefs} />}
        onSignedIn={(next) => {
          saveUser(next)
          setUser(next)
          setEditing(false)
        }}
      />
    )
  }

  const q = query.trim().toLowerCase()
  function visible(duty: Duty) {
    const people = byDuty.get(duty.id) ?? []
    if (filter === 'open' && people.length >= duty.need) return false
    if (filter === 'mine' && !people.some((p) => sameName(p.person, me))) return false
    if (!q) return true
    return (
      duty.title.toLowerCase().includes(q) ||
      duty.detail.toLowerCase().includes(q) ||
      people.some((p) => p.person.toLowerCase().includes(q)) ||
      (todosByParent.get(duty.id) ?? []).some((t) => t.text.toLowerCase().includes(q) || (t.assignee ?? '').toLowerCase().includes(q))
    )
  }

  const tabs: [View, string, number, string][] = [
    ['mine', 'My tasks', myOpenTasks, 'to do'],
    ['schedule', 'Schedule', openTodos, 'open tasks'],
    ['duties', 'Duties', empty, 'with nobody'],
  ]
  const offerTour = !tourHandled && !touring && Boolean(state) && !tourSeen()

  const progress = allItems.length ? Math.round((covered / allItems.length) * 100) : 0
  const knownCounts = PILLAR_GROUPS.filter((g) => g.children !== undefined)
  const children = knownCounts.reduce((n, g) => n + (g.children ?? 0), 0)
  const adults = knownCounts.reduce((n, g) => n + (g.adults ?? 0), 0)
  const toppers = knownCounts.reduce((n, g) => n + (g.toppers ?? 0), 0)

  return (
    <div className="duties-app min-h-screen bg-canvas pb-28 text-ink md:pb-20 print:bg-white">
      <datalist id="known-names">
        {knownNames.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>

      {updateReady && (
        <div className="bg-mine text-mine-ink print:hidden" role="status">
          <div className="container-custom flex flex-wrap items-center justify-between gap-3 py-3">
            <p className="text-sm font-semibold">A newer version of this page has been published.</p>
            <button
              type="button"
              onClick={() => void reloadLatest()}
              className="inline-flex items-center gap-2 rounded-lg bg-action px-4 py-2 text-sm font-semibold text-on-action hover:bg-action-hover"
            >
              <RefreshIcon className="h-4 w-4" /> Update now
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-primary-700 text-white print:bg-white print:text-black">
        <div className="container-custom pb-8 pt-4 md:pb-14">
          <div className="flex flex-wrap justify-end gap-2 print:hidden">
            <PreferenceButtons prefs={prefs} />
            <button
              type="button"
              onClick={() => void reloadLatest()}
              className={toolbarButtonClass}
              aria-label="Reload the latest version"
              title="Reload the latest version"
              data-tour="refresh"
            >
              <RefreshIcon className="h-5 w-5" />
              {updateReady && <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-gold-400 ring-2 ring-primary-700" aria-hidden />}
            </button>
          </div>
          <div className="mt-4 flex items-center gap-4 md:mt-2">
            {/* Brown and green need a light tile to read on navy. */}
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-md sm:h-16 sm:w-16 md:h-20 md:w-20 print:shadow-none">
              <Image src={LOGO_ICON} alt="" width={252} height={256} priority className="h-full w-auto" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-wide text-gold-300 print:text-black">
                Law Park Educational Trust · 10 years
              </p>
              <h1 className="mt-1 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white print:text-black">
                Event day duties
              </h1>
            </div>
          </div>
          <p className="mt-3 hidden max-w-2xl text-lg text-primary-100 sm:block print:text-black">
            Pick up a duty, keep the schedule up to date, and tick off to-dos. Every duty needs a name before 3 October.
          </p>
          {/* Phones: event details fold into one line so the duties start sooner. */}
          <details className="group mt-5 rounded-xl bg-white/10 sm:hidden print:hidden">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
              <span>Sun 4 Oct · RV Auditorium · Event details</span>
              <span aria-hidden className="transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div className="px-4 pb-4">
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-sm">
                <div>
                  <dt className="text-primary-200 print:text-black">Event</dt>
                  <dd className="mt-1 font-semibold">{EVENT_FACTS.eventDay}</dd>
                  <dd className="text-primary-100 print:text-black">Setup {EVENT_FACTS.setupDay}, from 3 PM</dd>
                </div>
                <div>
                  <dt className="text-primary-200 print:text-black">Venue</dt>
                  <dd className="mt-1 font-semibold">{EVENT_FACTS.venue}</dd>
                  <dd>
                    <a
                      href={EVENT_FACTS.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-9 items-center text-gold-300 underline underline-offset-2 hover:text-gold-200 print:text-black"
                    >
                      Open in Google Maps
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-primary-200 print:text-black">Chief guests</dt>
                  {EVENT_FACTS.chiefGuests.map((g) => (
                    <dd key={g} className="mt-1 text-primary-50 print:text-black">
                      {g.split(',')[0]}
                      {g.includes('IAS') ? ', IAS' : g.includes('IPS') ? ', IPS' : ''}
                    </dd>
                  ))}
                </div>
              </dl>
            </div>
          </details>
          <div className="mt-8 hidden sm:block print:block">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-sm">
              <div>
                <dt className="text-primary-200 print:text-black">Event</dt>
                <dd className="mt-1 font-semibold">{EVENT_FACTS.eventDay}</dd>
                <dd className="text-primary-100 print:text-black">Setup {EVENT_FACTS.setupDay}, from 3 PM</dd>
              </div>
              <div>
                <dt className="text-primary-200 print:text-black">Venue</dt>
                <dd className="mt-1 font-semibold">{EVENT_FACTS.venue}</dd>
                <dd>
                  <a
                    href={EVENT_FACTS.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center text-gold-300 underline underline-offset-2 hover:text-gold-200 print:text-black"
                  >
                    Open in Google Maps
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-primary-200 print:text-black">Chief guests</dt>
                {EVENT_FACTS.chiefGuests.map((g) => (
                  <dd key={g} className="mt-1 text-primary-50 print:text-black">
                    {g.split(',')[0]}
                    {g.includes('IAS') ? ', IAS' : g.includes('IPS') ? ', IPS' : ''}
                  </dd>
                ))}
              </div>
            </dl>
          </div>
        </div>
      </header>

      {/* Progress + controls */}
      <div className="z-30 border-b md:sticky md:top-0 border-line bg-surface/95 backdrop-blur print:static print:border-0">
        <div className="container-custom py-3">
          <div className="mb-3 hidden gap-1 border-b border-line md:flex print:hidden" role="group" aria-label="View">
            {tabs.map(([key, label, count, countLabel]) => (
              <button
                key={key}
                type="button"
                aria-pressed={view === key}
                data-tour={`tab-${key}`}
                onClick={() => switchView(key)}
                className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                  view === key ? 'border-heading text-heading' : 'border-transparent text-ink-soft hover:text-ink'
                }`}
              >
                {label}
                {count > 0 && (
                  <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-ink-soft">
                    {count}
                    <span className="sr-only"> {countLabel}</span>
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {view === 'mine' ? null : view === 'schedule' ? (
              <p className="min-w-48 flex-1 text-sm text-ink-soft">
                <strong className="text-ink">{events.length}</strong> activities
                {' · '}
                <strong className="text-danger-ink">{ownerless}</strong> with no one in charge
                {' · '}
                <strong className="text-ink">{openTodos}</strong> tasks open
              </p>
            ) : (
              <div className="min-w-48 flex-1">
                <p className="text-sm text-ink-soft">
                  <strong className="text-ink">{covered}</strong> of {allItems.length} duties covered
                  {' · '}
                  <strong className="text-danger-ink">{empty}</strong> with nobody
                  {' · '}
                  {everyone.length} people signed up
                </p>
                <div
                  className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-line"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Duties covered"
                >
                  <div className="h-full rounded-full bg-gold-500 transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            {view !== 'mine' && (
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto print:hidden" role="group" aria-label="Show">
              {(
                [
                  ['all', 'All'],
                  ['open', view === 'schedule' ? 'No one in charge' : 'Needs people'],
                  ['mine', `Mine (${view === 'schedule' ? myEvents : mineCount})`],
                ] as [Filter, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={filter === key}
                  onClick={() => setFilter(key)}
                  className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                    filter === key ? 'bg-action text-on-action' : 'bg-muted text-ink-soft hover:bg-muted-strong'
                  }`}
                >
                  {label}
                </button>
              ))}
              <label htmlFor="duty-search" className="sr-only">
                {view === 'schedule' ? 'Search activities, names or tasks' : 'Search duties or names'}
              </label>
              <input
                id="duty-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="min-h-10 w-full rounded-full border border-line-strong bg-surface px-4 text-base focus:outline-none focus:ring-2 focus:ring-focus sm:w-44 sm:text-sm"
              />
            </div>
            )}
            <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-soft md:w-auto print:hidden">
              <p className="mr-1">
                You are <strong className="text-ink">{me}</strong>
                <span className="text-ink-muted"> ({formatMobile(user.mobile)})</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setNewName(me)
                  setRenaming(true)
                }}
                className={userBarButtonClass}
              >
                Change name
              </button>
              <button
                type="button"
                onClick={() => {
                  saveUser(null)
                  setUser(null)
                  setRenaming(false)
                }}
                className={userBarButtonClass}
              >
                Switch user
              </button>
              <button type="button" data-tour="help" onClick={() => setTouring(true)} className={userBarButtonClass}>
                Help
              </button>
              <button type="button" onClick={() => window.print()} className={userBarButtonClass.replace('inline-flex', 'hidden md:inline-flex')}>
                Print
              </button>
            </div>
          </div>
          {renaming && (
            <form
              className="mt-3 flex flex-wrap items-end gap-2 print:hidden"
              onSubmit={async (e) => {
                e.preventDefault()
                const name = tidy(newName)
                if (name.length < 2) return
                if (name === me) {
                  setRenaming(false)
                  return
                }
                const res = await fetch(API, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'rename', by: me, mobile: user.mobile, name }),
                }).catch(() => null)
                const body = res ? await res.json().catch(() => ({})) : {}
                if (!res || !res.ok || !body.me) {
                  setError(body.error || 'Could not change your name. Check your connection and try again.')
                  return
                }
                saveUser(body.me)
                setUser(body.me)
                setState(body)
                setError('')
                setRenaming(false)
              }}
            >
              <div className="w-full sm:w-auto">
                <label htmlFor="rename-input" className="block text-sm font-semibold text-ink">
                  Your name
                </label>
                <input
                  id="rename-input"
                  type="text"
                  maxLength={60}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                  className={`mt-1 w-full sm:w-56 ${inputClass}`}
                />
              </div>
              <button type="submit" disabled={tidy(newName).length < 2} className={primaryButtonClass}>
                Save name
              </button>
              <button
                type="button"
                onClick={() => setRenaming(false)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-muted"
              >
                Cancel
              </button>
              <p className="basis-full text-xs text-ink-muted">Your name also changes on every duty and activity you are on.</p>
            </form>
          )}
          <p role="status" aria-live="polite" className={error ? 'mt-2 text-sm font-semibold text-danger-ink' : 'sr-only'}>
            {error}
          </p>
        </div>
      </div>

      <div className="container-custom mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {view === 'mine' ? (
          <MyTasks
            parents={parents}
            todos={todos}
            comments={state?.comments ?? []}
            members={state?.members ?? []}
            byDuty={byDuty}
            myDuties={myDuties}
            me={me}
            busyKey={busyDuty}
            loaded={Boolean(state)}
            post={post}
            openSchedule={() => switchView('schedule')}
            openDuties={() => switchView('duties')}
          />
        ) : view === 'schedule' ? (
          <Schedule
            events={events}
            todos={todos}
            comments={state?.comments ?? []}
            members={state?.members ?? []}
            byDuty={byDuty}
            phones={phones}
            me={me}
            busyKey={busyDuty}
            filter={filter}
            query={query}
            loaded={Boolean(state)}
            post={post}
          />
        ) : (
          <div>
            {!state && !error && <p className="text-ink-soft">Loading duties…</p>}
            {/* Phones: one row that scrolls sideways instead of five wrapped rows. */}
            <nav
              aria-label="Sections"
              className="-mx-4 mb-8 flex snap-x gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 print:hidden"
            >
              {sections.map((s) => {
                const open = s.items.filter(({ duty }) => (byDuty.get(duty.id)?.length ?? 0) < duty.need).length
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="inline-flex min-h-10 shrink-0 snap-start items-center whitespace-nowrap rounded-full bg-surface px-4 text-sm font-medium text-ink-soft ring-1 ring-line hover:ring-focus"
                  >
                    {s.title}
                    {open > 0 && <span className="ml-1.5 text-danger-ink">{open} open</span>}
                  </a>
                )
              })}
            </nav>

            {sections.map((section) => {
              const items = section.items.filter(({ duty }) => visible(duty))
              const showAdd = filter === 'all' && !q
              if (!items.length && !showAdd) return null
              return (
                <section key={section.id} id={section.id} className="mb-14 scroll-mt-28" aria-labelledby={`h-${section.id}`}>
                  <h2 id={`h-${section.id}`} className="font-serif text-2xl font-bold text-heading">
                    {section.title}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-ink-soft">{section.when}</p>
                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {items.map(({ duty, custom }) => (
                      <DutyCard
                        key={duty.id}
                        duty={duty}
                        custom={custom}
                        people={byDuty.get(duty.id) ?? []}
                        todos={todosByParent.get(duty.id) ?? []}
                        commentsByTodo={commentsByTodo}
                        members={state?.members ?? []}
                        phones={phones}
                        me={me}
                        busy={busyDuty === duty.id}
                        post={post}
                        onRemoveDuty={(id) => {
                          if (window.confirm(`Remove the duty "${duty.title}"?`)) void post({ action: 'removeDuty', id })
                        }}
                      />
                    ))}
                    {showAdd && (
                      <AddDutyForm
                        sectionId={section.id}
                        onAdd={(sectionId, title, detail) => post({ action: 'addDuty', sectionId, title, detail })}
                      />
                    )}
                  </div>
                </section>
              )
            })}

            {filter === 'mine' && mineCount === 0 && (
              <p className="rounded-xl bg-surface p-6 text-ink-soft ring-1 ring-line">
                You are not on any duty yet. Switch to <strong>Needs people</strong> and pick one.
              </p>
            )}
          </div>
        )}

        {/* Side panel */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto print:hidden">
          <section aria-labelledby="h-activity" className="rounded-xl bg-surface p-5 ring-1 ring-line">
            <h2 id="h-activity" className="font-semibold text-ink">
              Recent changes
            </h2>
            {state && !state.activity.length && <p className="mt-2 text-sm text-ink-muted">No changes yet.</p>}
            <ol className="mt-3 space-y-3 text-sm">
              {state?.activity.slice(0, 15).map((a) => (
                <li key={a.id} className="text-ink-soft">
                  <strong className="text-ink">{a.by_name}</strong> {ACTION_TEXT[a.action] ?? a.action}{' '}
                  {a.action === 'joined' ? null : a.action === 'renamed' ? (
                    <strong className="text-ink">{a.person}</strong>
                  ) : a.action === 'assign' || a.action === 'unassign' ? (
                    <>
                      <strong className="text-ink">{a.person}</strong> {a.action === 'assign' ? 'to' : 'from'}{' '}
                      {titleOf(a.duty_id) || 'a removed item'}
                    </>
                  ) : a.action === 'statusTodo' ? (
                    <>
                      <strong className="text-ink">{a.person}</strong> as {STATUS[(a.detail as TodoStatus) || 'todo']?.label ?? a.detail}
                    </>
                  ) : a.action === 'assignTodo' ? (
                    a.detail ? (
                      <>
                        <strong className="text-ink">{a.person}</strong> to <strong className="text-ink">{a.detail}</strong>
                      </>
                    ) : (
                      <>
                        no one <strong className="text-ink">{a.person}</strong>
                      </>
                    )
                  ) : TODO_ACTIONS.has(a.action) ? (
                    <>
                      <strong className="text-ink">{a.person}</strong> on {titleOf(a.duty_id) || 'a removed activity'}
                    </>
                  ) : (
                    <strong className="text-ink">{a.person}</strong>
                  )}
                  <span className="block text-xs text-ink-muted">{timeAgo(a.at)}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="h-groups" className="rounded-xl bg-surface p-5 ring-1 ring-line">
            <h2 id="h-groups" className="font-semibold text-ink">
              Groups coming
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              Transport for the children is arranged. Team members come on their own.
            </p>
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-muted">
                  <th scope="col" className="pb-1 font-medium">Pillar</th>
                  <th scope="col" className="pb-1 text-right font-medium">Children</th>
                  <th scope="col" className="pb-1 text-right font-medium">Adults</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {PILLAR_GROUPS.map((g) => (
                  <tr key={g.pillar}>
                    <th scope="row" className="py-1.5 text-left font-medium text-ink">
                      {g.pillar}
                      <span className="block text-xs font-normal text-ink-muted">{g.location}</span>
                    </th>
                    <td className="py-1.5 text-right tabular-nums">{g.children ?? 'pending'}</td>
                    <td className="py-1.5 text-right tabular-nums">{g.adults ?? 'pending'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-line-strong font-semibold">
                  <th scope="row" className="pt-2 text-left">So far</th>
                  <td className="pt-2 text-right tabular-nums">{children}</td>
                  <td className="pt-2 text-right tabular-nums">{adults}</td>
                </tr>
              </tfoot>
            </table>
            <p className="mt-2 text-xs text-ink-muted">
              {children + adults} people from the groups, {toppers} toppers among the children. Suma and Mangala Gowri still to confirm.
            </p>
          </section>

          {view === 'duties' && events.length > 0 && (
            <section aria-labelledby="h-runsheet" className="rounded-xl bg-surface p-5 ring-1 ring-line">
              <div className="flex items-baseline justify-between gap-2">
                <h2 id="h-runsheet" className="font-semibold text-ink">
                  Run sheet
                </h2>
                <button type="button" onClick={() => switchView('schedule')} className="inline-flex min-h-9 items-center px-2 text-sm font-semibold text-link hover:underline">
                  Edit
                </button>
              </div>
              <ol className="mt-3 space-y-2.5 text-sm">
                {events.map((e, i) => (
                  <li key={e.id}>
                    {(i === 0 || events[i - 1].date !== e.date) && (
                      <p className="mb-1.5 mt-3 text-xs font-semibold uppercase tracking-wide text-ink-muted first:mt-0">
                        {new Date(`${e.date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                    )}
                    <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] gap-2">
                      <span className="font-semibold tabular-nums text-gold-ink">{formatTime(e.time)}</span>
                      <span className="text-ink">{e.title}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </aside>
      </div>

      {offerTour && (
        <TourOffer
          name={me}
          onStart={() => {
            setTourHandled(true)
            setTouring(true)
          }}
          onSkip={() => {
            markTourSeen('skipped')
            setTourHandled(true)
          }}
        />
      )}
      {touring && (
        <Tour
          steps={TOUR_STEPS}
          onClose={() => {
            markTourSeen('done')
            setTourHandled(true)
            setTouring(false)
          }}
        />
      )}

      {/* Phones: the tabs sit at the bottom, in thumb reach, on every screen. */}
      <nav
        aria-label="View"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden print:hidden"
      >
        <div className="grid grid-cols-3">
          {tabs.map(([key, label, count, countLabel]) => (
            <button
              key={key}
              type="button"
              aria-pressed={view === key}
              data-tour={`tab-${key}`}
              onClick={() => switchView(key)}
              className={`flex min-h-16 flex-col items-center justify-center gap-0.5 border-t-2 text-base font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus ${
                view === key ? 'border-heading text-heading' : 'border-transparent text-ink-muted'
              }`}
            >
              {label}
              <span className="text-xs font-medium">
                {count} {countLabel}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default EventDutiesPage
