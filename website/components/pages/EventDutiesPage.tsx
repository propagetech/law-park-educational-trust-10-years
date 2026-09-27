'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DUTY_SECTIONS, EVENT_FACTS, PILLAR_GROUPS, type Duty } from '@/data/eventDuties'
import {
  PeopleEditor,
  sameName,
  tidy,
  timeAgo,
  type Assignment,
  type EventActivity,
  type Filter,
  type Post,
  type Todo,
} from '@/components/event-duties/shared'
import { Schedule, formatTime, sortActivities } from '@/components/event-duties/Schedule'

interface CustomDuty {
  id: string
  section_id: string
  title: string
  detail: string
  added_by: string
}

interface Activity {
  id: number
  at: string
  by_name: string
  action: string
  duty_id: string | null
  person: string | null
}

interface Member {
  name: string
  mobile: string
}

interface State {
  assignments: Assignment[]
  custom: CustomDuty[]
  activity: Activity[]
  members: Member[]
  events: EventActivity[]
  todos: Todo[]
}

interface User {
  name: string
  mobile: string
}

type View = 'duties' | 'schedule'

const USER_KEY = 'lpet-duties-user'
const VIEW_KEY = 'lpet-duties-view'
const API = '/api/duties'
const VERSION_URL = '/duties-version.json'
const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID || 'dev'
const LOGO_FULL = '/images/event-duties/lawpark-trust-logo.webp' // 480x545, white lettering
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

// Indian mobile numbers: keep the 10 digits, drop +91 or a leading 0.
function cleanMobile(value: unknown) {
  let digits = String(value ?? '').replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  return /^[6-9]\d{9}$/.test(digits) ? digits : ''
}

function showMobile(mobile: string) {
  return `${mobile.slice(0, 5)} ${mobile.slice(5)}`
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
    return localStorage.getItem(VIEW_KEY) === 'schedule' ? 'schedule' : 'duties'
  } catch {
    return 'duties'
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

function NameGate({ initial, onEnter }: { initial: User | null; onEnter: (user: User) => void }) {
  const [draft, setDraft] = useState(initial?.name ?? '')
  const [mobile, setMobile] = useState(initial?.mobile ?? '')
  const [error, setError] = useState<{ field: 'name' | 'mobile'; text: string } | null>(null)

  return (
    <div className="min-h-screen bg-primary-700 flex flex-col items-center justify-center px-4 py-12">
      {/* The full logo has white lettering, so it sits on navy, not on the card. */}
      <Image
        src={LOGO_FULL}
        alt="Law Park Educational Trust, +91 99456 65379"
        width={480}
        height={545}
        priority
        className="mb-8 h-auto w-40 sm:w-48"
      />
      <form
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
        onSubmit={(e) => {
          e.preventDefault()
          const name = tidy(draft)
          if (name.length < 2) {
            setError({ field: 'name', text: 'Please enter your name.' })
            return
          }
          const number = cleanMobile(mobile)
          if (!number) {
            setError({ field: 'mobile', text: 'Please enter a 10-digit mobile number.' })
            return
          }
          onEnter({ name, mobile: number })
        }}
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-700 mb-2">
          10 years · team only
        </p>
        <h1 className="font-serif text-3xl font-bold text-primary-700 mb-3">Event day duties</h1>
        <p className="text-gray-600 mb-6">
          Enter your name and mobile number so the team can see who signed up for what, and call you on the day. No
          password needed. This phone remembers you next time.
        </p>
        <label htmlFor="gate-name" className="block text-sm font-semibold text-gray-800 mb-2">
          Your name
        </label>
        <input
          id="gate-name"
          type="text"
          autoComplete="name"
          maxLength={60}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            setError(null)
          }}
          aria-invalid={error?.field === 'name'}
          aria-describedby={error?.field === 'name' ? 'gate-error' : undefined}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <label htmlFor="gate-mobile" className="mt-5 block text-sm font-semibold text-gray-800 mb-2">
          Mobile number
        </label>
        <div className="flex rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
          <span className="flex items-center border-r border-gray-300 px-3 text-lg text-gray-600" aria-hidden>
            +91
          </span>
          <input
            id="gate-mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={16}
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value)
              setError(null)
            }}
            aria-invalid={error?.field === 'mobile'}
            aria-describedby={error?.field === 'mobile' ? 'gate-error' : undefined}
            className="min-w-0 flex-1 rounded-r-lg px-4 py-3 text-lg focus:outline-none"
          />
        </div>
        {error && (
          <p id="gate-error" role="alert" className="mt-2 text-sm text-red-700">
            {error.text}
          </p>
        )}
        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-primary-700 px-4 py-3 text-lg font-semibold text-white hover:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
        >
          Enter
        </button>
      </form>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function StatusPill({ have, need }: { have: number; need: number }) {
  if (have >= need) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-800 ring-1 ring-green-200">
        <span aria-hidden>✓</span> Covered
      </span>
    )
  }
  if (have === 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-800 ring-1 ring-red-200">
        Needs {need}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-200">
      {have} of {need}
    </span>
  )
}

interface DutyCardProps {
  duty: Duty
  custom?: CustomDuty
  people: Assignment[]
  phones: Map<string, string>
  me: string
  busy: boolean
  post: Post
  onRemoveDuty: (id: string) => void
}

function DutyCard({ duty, custom, people, phones, me, busy, post, onRemoveDuty }: DutyCardProps) {
  return (
    <article className="flex flex-col rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 print:break-inside-avoid print:shadow-none">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900 leading-snug">{duty.title}</h3>
        <div className="shrink-0">
          <StatusPill have={people.length} need={duty.need} />
        </div>
      </div>
      {duty.when && <p className="mt-1 text-sm font-medium text-gold-800">{duty.when}</p>}
      {duty.detail && <p className="mt-2 text-sm text-gray-600 leading-relaxed">{duty.detail}</p>}
      {custom && (
        <p className="mt-2 text-xs text-gray-500">
          Added by {custom.added_by}
          {' · '}
          <button
            type="button"
            onClick={() => onRemoveDuty(custom.id)}
            className="underline hover:text-red-700 print:hidden"
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
        className="flex min-h-32 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-5 text-sm font-semibold text-gray-600 hover:border-primary-400 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 print:hidden"
      >
        + Add a duty we missed
      </button>
    )
  }

  return (
    <form
      className="rounded-xl border-2 border-dashed border-primary-300 bg-white p-5 print:hidden"
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
      <label htmlFor={`new-title-${sectionId}`} className="block text-sm font-semibold text-gray-800">
        Duty
      </label>
      <input
        id={`new-title-${sectionId}`}
        type="text"
        maxLength={120}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        autoFocus
      />
      <label htmlFor={`new-detail-${sectionId}`} className="mt-3 block text-sm font-semibold text-gray-800">
        What it involves <span className="font-normal text-gray-500">(optional)</span>
      </label>
      <textarea
        id={`new-detail-${sectionId}`}
        maxLength={400}
        rows={2}
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={tidy(title).length < 3}
          className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-40"
        >
          Add duty
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
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
  addEvent: 'added the activity',
  updateEvent: 'edited the activity',
  removeEvent: 'removed the activity',
  addTodo: 'added the to-do',
  doneTodo: 'ticked',
  undoTodo: 'unticked',
  removeTodo: 'removed the to-do',
}

const TODO_ACTIONS = new Set(['addTodo', 'doneTodo', 'undoTodo', 'removeTodo'])

function EventDutiesPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [editing, setEditing] = useState(false)
  const [updateReady, setUpdateReady] = useState(false)
  const me = user?.name ?? ''
  const [state, setState] = useState<State | null>(null)
  const [error, setError] = useState('')
  const [busyDuty, setBusyDuty] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [view, setView] = useState<View>('duties')

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
      .register(`/event-duties-sw.js?v=${encodeURIComponent(BUILD_ID)}`, { scope: '/event-duties' })
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

  // Save the name and mobile to the team list each time someone enters.
  useEffect(() => {
    if (!user) return
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'hello', by: user.name, mobile: user.mobile }),
    }).catch(() => {})
  }, [user])

  const load = useCallback(async () => {
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
  const todos = state?.todos ?? []
  const liveEventIds = new Set(events.map((e) => e.id))
  const openTodos = todos.filter((t) => !t.done && liveEventIds.has(t.event_id)).length
  const ownerless = events.filter((e) => !byDuty.get(e.id)?.length).length
  const myEvents = events.filter((e) => byDuty.get(e.id)?.some((p) => sameName(p.person, me))).length

  if (user === undefined) return <div className="min-h-screen bg-primary-700" />
  if (!user || editing) {
    return (
      <NameGate
        initial={user}
        onEnter={(next) => {
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
      people.some((p) => p.person.toLowerCase().includes(q))
    )
  }

  const progress = allItems.length ? Math.round((covered / allItems.length) * 100) : 0
  const knownCounts = PILLAR_GROUPS.filter((g) => g.children !== undefined)
  const children = knownCounts.reduce((n, g) => n + (g.children ?? 0), 0)
  const adults = knownCounts.reduce((n, g) => n + (g.adults ?? 0), 0)
  const toppers = knownCounts.reduce((n, g) => n + (g.toppers ?? 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-20 print:bg-white">
      <datalist id="known-names">
        {everyone.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>

      {updateReady && (
        <div className="bg-gold-100 text-gold-900 print:hidden" role="status">
          <div className="container-custom flex flex-wrap items-center justify-between gap-3 py-3">
            <p className="text-sm font-semibold">A newer version of this page has been published.</p>
            <button
              type="button"
              onClick={() => void reloadLatest()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
            >
              <RefreshIcon className="h-4 w-4" /> Update now
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative bg-primary-700 text-white print:bg-white print:text-black">
        <button
          type="button"
          onClick={() => void reloadLatest()}
          className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 print:hidden"
          aria-label="Reload the latest version"
          title="Reload the latest version"
        >
          <RefreshIcon className="h-5 w-5" />
          {updateReady && <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-gold-400 ring-2 ring-primary-700" aria-hidden />}
        </button>
        <div className="container-custom py-10 md:py-14">
          <div className="flex items-center gap-4 pr-12">
            {/* Brown and green need a light tile to read on navy. */}
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-md md:h-20 md:w-20 print:shadow-none">
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
          <p className="mt-3 max-w-2xl text-lg text-primary-100 print:text-black">
            Pick up a duty, keep the schedule up to date, and tick off to-dos. Every duty needs a name before 3 October.
          </p>
          <dl className="mt-8 grid gap-6 sm:grid-cols-3 text-sm">
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
                  className="text-gold-300 underline underline-offset-2 hover:text-gold-200 print:text-black"
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
      </header>

      {/* Progress + controls */}
      <div className="z-30 border-b md:sticky md:top-0 border-gray-200 bg-white/95 backdrop-blur print:static print:border-0">
        <div className="container-custom py-3">
          <div className="mb-3 flex gap-1 border-b border-gray-200 print:hidden" role="group" aria-label="View">
            {(
              [
                ['duties', 'Duties', empty],
                ['schedule', 'Schedule', openTodos],
              ] as [View, string, number][]
            ).map(([key, label, count]) => (
              <button
                key={key}
                type="button"
                aria-pressed={view === key}
                onClick={() => switchView(key)}
                className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  view === key ? 'border-primary-700 text-primary-700' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
                {count > 0 && (
                  <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                    {count}
                    <span className="sr-only">{key === 'duties' ? ' with nobody' : ' open to-dos'}</span>
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {view === 'schedule' ? (
              <p className="min-w-48 flex-1 text-sm text-gray-700">
                <strong className="text-gray-900">{events.length}</strong> activities
                {' · '}
                <strong className="text-red-800">{ownerless}</strong> without an owner
                {' · '}
                <strong className="text-gray-900">{openTodos}</strong> to-dos open
              </p>
            ) : (
              <div className="min-w-48 flex-1">
                <p className="text-sm text-gray-700">
                  <strong className="text-gray-900">{covered}</strong> of {allItems.length} duties covered
                  {' · '}
                  <strong className="text-red-800">{empty}</strong> with nobody
                  {' · '}
                  {everyone.length} people signed up
                </p>
                <div
                  className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-200"
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
            <div className="flex flex-wrap items-center gap-2 print:hidden" role="group" aria-label="Show">
              {(
                [
                  ['all', 'All'],
                  ['open', view === 'schedule' ? 'No owner' : 'Needs people'],
                  ['mine', `Mine (${view === 'schedule' ? myEvents : mineCount})`],
                ] as [Filter, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={filter === key}
                  onClick={() => setFilter(key)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                    filter === key ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
              <label htmlFor="duty-search" className="sr-only">
                {view === 'schedule' ? 'Search activities, names or to-dos' : 'Search duties or names'}
              </label>
              <input
                id="duty-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-44 rounded-full border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <p className="text-sm text-gray-600 print:hidden">
              You are <strong className="text-gray-900">{me}</strong>
              <span className="text-gray-500"> ({showMobile(user.mobile)})</span>
              {' · '}
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="underline hover:text-primary-700"
              >
                change
              </button>
              {' · '}
              <button type="button" onClick={() => window.print()} className="underline hover:text-primary-700">
                print
              </button>
            </p>
          </div>
          <p role="status" aria-live="polite" className={error ? 'mt-2 text-sm font-semibold text-red-700' : 'sr-only'}>
            {error}
          </p>
        </div>
      </div>

      <div className="container-custom mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
        {view === 'schedule' ? (
          <Schedule
            events={events}
            todos={todos}
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
            {!state && !error && <p className="text-gray-600">Loading duties…</p>}
            <nav aria-label="Sections" className="mb-8 flex flex-wrap gap-2 print:hidden">
              {sections.map((s) => {
                const open = s.items.filter(({ duty }) => (byDuty.get(duty.id)?.length ?? 0) < duty.need).length
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-700 ring-1 ring-gray-200 hover:ring-primary-400"
                  >
                    {s.title}
                    {open > 0 && <span className="ml-1.5 text-red-800">{open} open</span>}
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
                  <h2 id={`h-${section.id}`} className="font-serif text-2xl font-bold text-primary-700">
                    {section.title}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-gray-600">{section.when}</p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {items.map(({ duty, custom }) => (
                      <DutyCard
                        key={duty.id}
                        duty={duty}
                        custom={custom}
                        people={byDuty.get(duty.id) ?? []}
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
              <p className="rounded-xl bg-white p-6 text-gray-700 ring-1 ring-gray-200">
                You are not on any duty yet. Switch to <strong>Needs people</strong> and pick one.
              </p>
            )}
          </div>
        )}

        {/* Side panel */}
        <aside className="space-y-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto print:hidden">
          <section aria-labelledby="h-activity" className="rounded-xl bg-white p-5 ring-1 ring-gray-200">
            <h2 id="h-activity" className="font-semibold text-gray-900">
              Recent changes
            </h2>
            {state && !state.activity.length && <p className="mt-2 text-sm text-gray-500">No changes yet.</p>}
            <ol className="mt-3 space-y-3 text-sm">
              {state?.activity.slice(0, 15).map((a) => (
                <li key={a.id} className="text-gray-700">
                  <strong className="text-gray-900">{a.by_name}</strong> {ACTION_TEXT[a.action] ?? a.action}{' '}
                  {a.action === 'joined' ? null : a.action === 'assign' || a.action === 'unassign' ? (
                    <>
                      <strong className="text-gray-900">{a.person}</strong> {a.action === 'assign' ? 'to' : 'from'}{' '}
                      {titleOf(a.duty_id) || 'a removed item'}
                    </>
                  ) : TODO_ACTIONS.has(a.action) ? (
                    <>
                      <strong className="text-gray-900">{a.person}</strong> on {titleOf(a.duty_id) || 'a removed activity'}
                    </>
                  ) : (
                    <strong className="text-gray-900">{a.person}</strong>
                  )}
                  <span className="block text-xs text-gray-500">{timeAgo(a.at)}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="h-groups" className="rounded-xl bg-white p-5 ring-1 ring-gray-200">
            <h2 id="h-groups" className="font-semibold text-gray-900">
              Groups coming
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Transport for the children is arranged. Team members come on their own.
            </p>
            <table className="mt-3 w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th scope="col" className="pb-1 font-medium">Pillar</th>
                  <th scope="col" className="pb-1 text-right font-medium">Children</th>
                  <th scope="col" className="pb-1 text-right font-medium">Adults</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {PILLAR_GROUPS.map((g) => (
                  <tr key={g.pillar}>
                    <th scope="row" className="py-1.5 text-left font-medium text-gray-900">
                      {g.pillar}
                      <span className="block text-xs font-normal text-gray-500">{g.location}</span>
                    </th>
                    <td className="py-1.5 text-right tabular-nums">{g.children ?? 'pending'}</td>
                    <td className="py-1.5 text-right tabular-nums">{g.adults ?? 'pending'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-300 font-semibold">
                  <th scope="row" className="pt-2 text-left">So far</th>
                  <td className="pt-2 text-right tabular-nums">{children}</td>
                  <td className="pt-2 text-right tabular-nums">{adults}</td>
                </tr>
              </tfoot>
            </table>
            <p className="mt-2 text-xs text-gray-500">
              {children + adults} people from the groups, {toppers} toppers among the children. Suma and Mangala Gowri still to confirm.
            </p>
          </section>

          {view === 'duties' && events.length > 0 && (
            <section aria-labelledby="h-runsheet" className="rounded-xl bg-white p-5 ring-1 ring-gray-200">
              <div className="flex items-baseline justify-between gap-2">
                <h2 id="h-runsheet" className="font-semibold text-gray-900">
                  Run sheet
                </h2>
                <button type="button" onClick={() => switchView('schedule')} className="text-sm font-semibold text-primary-600 hover:underline">
                  Edit
                </button>
              </div>
              <ol className="mt-3 space-y-2.5 text-sm">
                {events.map((e, i) => (
                  <li key={e.id}>
                    {(i === 0 || events[i - 1].date !== e.date) && (
                      <p className="mb-1.5 mt-3 text-xs font-semibold uppercase tracking-wide text-gray-500 first:mt-0">
                        {new Date(`${e.date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </p>
                    )}
                    <div className="grid grid-cols-[4.75rem_1fr] gap-2">
                      <span className="font-semibold tabular-nums text-gold-800">{formatTime(e.time)}</span>
                      <span className="text-gray-800">{e.title}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

export default EventDutiesPage
