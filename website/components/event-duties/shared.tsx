'use client'

import { useState } from 'react'

// Shapes returned by /api/duties (functions/api/duties.js).

export interface Assignment {
  id: number
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

export interface Todo {
  id: number
  event_id: string
  text: string
  done: number
  done_by: string | null
  added_by: string
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

export const inputClass =
  'rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'

export const primaryButtonClass =
  'rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2'

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
                sameName(p.person, me) ? 'bg-gold-100 text-gold-900' : 'bg-primary-50 text-primary-700'
              }`}
              title={`Added by ${p.added_by}, ${timeAgo(p.added_at)}`}
            >
              {phone ? (
                <a
                  href={`tel:+91${phone}`}
                  className="underline decoration-dotted underline-offset-2 hover:decoration-solid"
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
                className="ml-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-base leading-none hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 print:hidden"
                aria-label={`Remove ${p.person} from ${label}`}
              >
                ×
              </button>
            </li>
          )
        })}
        {!people.length && <li className="text-sm italic text-gray-500">{emptyText}</li>}
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
            className="mt-1 py-1.5 text-sm font-semibold text-primary-600 underline-offset-2 hover:underline disabled:opacity-40"
          >
            + Add me ({me})
          </button>
        )}
      </form>
    </div>
  )
}
