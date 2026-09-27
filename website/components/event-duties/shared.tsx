'use client'

import { useState } from 'react'

// Where the duties API lives (AWS: backend/ in this repo), set at build time.
// Empty means the page was built without it and shows "not connected".
export const DUTIES_API = process.env.NEXT_PUBLIC_DUTIES_API || ''
export const NOT_CONNECTED = 'The app is not connected to its server yet.'

// Shapes returned by the duties API (backend/src/handlers/duties.js).
// Ids are strings: DynamoDB has no auto-numbering.

export interface Assignment {
  id: string
  duty_id: string
  person: string
  added_by: string
  added_at: string
}

export interface EventActivity {
  id: string
  date: string
  time: string
  title: string
  description: string
  updated_by: string
  updated_at: string
}

export type TodoStatus = 'todo' | 'doing' | 'stuck' | 'done'

export interface Todo {
  id: string
  event_id: string
  text: string
  done: number
  done_by: string | null
  added_by: string
  assignee: string | null
  status: TodoStatus
  updated_by: string | null
  updated_at: string | null
}

export interface Comment {
  id: string
  todo_id: string
  by_name: string
  text: string
  at: string
}

export interface Member {
  name: string
  mobile: string
}

export type Filter = 'all' | 'open' | 'mine'

export type Post = (payload: Record<string, unknown>, busyKey?: string) => Promise<boolean>

export function tidy(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

export function splitNames(value: string) {
  return value
    .split(/[,\n;]/)
    .map(tidy)
    .filter((n) => n.length >= 2)
}

// Mobile numbers are kept with their country code, like +919876543210.
// Without a + (or 00) prefix a number is read as Indian. Mirrors cleanMobile
// in backend/src/handlers/duties.js.
export function cleanMobile(value: unknown) {
  const raw = String(value ?? '').trim()
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

// +919876543210 -> +91 98765 43210, +12025550123 -> +1 202 555 0123
export function formatMobile(mobile: string) {
  const d = mobile.replace(/\D/g, '')
  if (d.startsWith('91') && d.length === 12) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`
  if (d.startsWith('1') && d.length === 11) return `+1 ${d.slice(1, 4)} ${d.slice(4, 7)} ${d.slice(7)}`
  return mobile.startsWith('+') ? mobile : `+${d}`
}

export function sameName(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase()
}

export function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} h ago`
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// 16px text on phones: iOS Safari zooms the page into any smaller field.
export const inputClass =
  'rounded-lg border border-line-strong px-3 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-focus focus:border-focus'

export const primaryButtonClass =
  'rounded-lg bg-action px-4 py-2 text-sm font-semibold text-on-action hover:bg-action-hover disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2'

interface PeopleEditorProps {
  id: string
  label: string
  people: Assignment[]
  phones: Map<string, string>
  me: string
  busy: boolean
  post: Post
  emptyText?: string
  className?: string
}

// Name chips (tap to call when the person gave a mobile) plus an input that
// takes several names at once, and a one-tap "Add me".
export function PeopleEditor({ id, label, people, phones, me, busy, post, emptyText = 'Nobody yet', className = '' }: PeopleEditorProps) {
  const [draft, setDraft] = useState('')
  const inputId = `add-${id}`
  const iAmOn = people.some((p) => sameName(p.person, me))

  async function add(names: string[]) {
    if (!names.length) return
    if (await post({ action: 'assign', dutyId: id, people: names }, id)) setDraft('')
  }

  return (
    <div className={className}>
      <ul className="flex flex-wrap gap-2" aria-label={`People on ${label}`}>
        {people.map((p) => {
          const phone = phones.get(p.person.toLowerCase())
          return (
            <li
              key={p.id}
              className={`inline-flex items-center gap-1 rounded-full py-1 pl-3 pr-1 text-sm font-medium ${
                sameName(p.person, me) ? 'bg-mine text-mine-ink' : 'bg-accent-soft text-heading'
              }`}
              title={`Added by ${p.added_by}, ${timeAgo(p.added_at)}`}
            >
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex min-h-6 items-center underline decoration-dotted underline-offset-2 hover:decoration-solid"
                  aria-label={`Call ${p.person}`}
                >
                  {p.person}
                </a>
              ) : (
                p.person
              )}
              <button
                type="button"
                onClick={() => void post({ action: 'unassign', id: p.id }, id)}
                className="ml-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-base leading-none hover:bg-surface/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus print:hidden"
                aria-label={`Remove ${p.person} from ${label}`}
              >
                ×
              </button>
            </li>
          )
        })}
        {!people.length && <li className="text-sm italic text-ink-muted">{emptyText}</li>}
      </ul>

      <form
        className="mt-auto pt-4 print:hidden"
        onSubmit={(e) => {
          e.preventDefault()
          void add(splitNames(draft))
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          Add names to {label}
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            type="text"
            list="known-names"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Names, comma separated"
            maxLength={400}
            className={`min-w-0 flex-1 ${inputClass}`}
          />
          <button type="submit" disabled={busy || !tidy(draft)} className={primaryButtonClass}>
            Add
          </button>
        </div>
        {!iAmOn && (
          <button
            type="button"
            disabled={busy}
            onClick={() => void add([me])}
            className="mt-1 inline-flex min-h-9 items-center text-sm font-semibold text-link underline-offset-2 hover:underline disabled:opacity-40"
          >
            + Add me ({me})
          </button>
        )}
      </form>
    </div>
  )
}
