'use client'

import Image from 'next/image'
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { cleanMobile, tidy, type Member } from './shared'

const API = '/api/duties'
const LOGO_FULL = '/images/event-duties/lawpark-trust-logo.webp' // 480x545, white lettering

function digitsOf(value: string) {
  return value.replace(/\D/g, '')
}

// "ending 1717": enough to tell two people with the same name apart, without
// listing everyone's number on the sign-in screen.
function lastDigits(mobile: string) {
  return `ending ${digitsOf(mobile).slice(-4)}`
}

// A name matches on any part of it; a number matches on any run of digits,
// so it works with or without the country code or a leading 0.
function search(members: Member[], query: string) {
  const q = tidy(query).toLowerCase()
  if (!q) return members
  if (/[a-z]/i.test(q)) {
    const hits = members.filter((m) => m.name.toLowerCase().includes(q))
    return hits.sort((a, b) => Number(!a.name.toLowerCase().startsWith(q)) - Number(!b.name.toLowerCase().startsWith(q)))
  }
  const digits = digitsOf(q).replace(/^0+/, '')
  if (digits.length < 3) return []
  return members.filter((m) => digitsOf(m.mobile).includes(digits))
}

function Logo() {
  return (
    // The logo's lettering is white, so it stays on navy; a soft light circle
    // sits behind the tree only, so its brown and black read. Geometry is
    // measured from the logo: centred on the tree, fading out just above the
    // lettering.
    <div className="relative mb-8 mt-2 w-40 sm:w-48">
      <span
        aria-hidden
        className="absolute aspect-square rounded-full"
        style={{
          left: '5%',
          top: '-2.3%',
          width: '90%',
          background: 'radial-gradient(circle closest-side, rgb(253 246 234) 0, rgb(253 246 234) 92%, rgb(253 246 234 / 0) 100%)',
        }}
      />
      <Image
        src={LOGO_FULL}
        alt="Law Park Educational Trust, +91 99456 65379"
        width={480}
        height={545}
        priority
        className="relative h-auto w-full"
      />
    </div>
  )
}

const bigInputClass =
  'w-full rounded-lg border border-line-strong px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-focus focus:border-focus'

const linkButtonClass = 'mt-2 inline-flex min-h-11 w-full items-center justify-center text-sm font-semibold text-link hover:underline'

const buttonClass =
  'mt-6 w-full rounded-lg bg-action px-4 py-3 text-lg font-semibold text-on-action hover:bg-action-hover disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2'

export function SignIn({ onSignedIn, toolbar }: { onSignedIn: (user: Member) => void; toolbar?: ReactNode }) {
  const listId = useId()
  const searchRef = useRef<HTMLInputElement>(null)
  const [members, setMembers] = useState<Member[] | null>(null)
  const [mode, setMode] = useState<'pick' | 'new'>('pick')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [selected, setSelected] = useState<Member | null>(null)
  const [newName, setNewName] = useState('')
  const [newMobile, setNewMobile] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch(API, { cache: 'no-store' })
      .then(async (res) => {
        const body = await res.json()
        if (!res.ok) throw new Error(body.error || 'Could not load the team list.')
        setMembers(body.members ?? [])
      })
      .catch((err) => {
        setMembers([])
        setError(err instanceof Error ? err.message : 'Could not load the team list.')
      })
  }, [])

  const results = useMemo(() => search(members ?? [], query).slice(0, 8), [members, query])
  // The last option is always "not on the list".
  const optionCount = results.length + 1

  async function signIn(name: string, mobile: string) {
    setBusy(true)
    setError('')
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'hello', by: name, mobile }),
      })
      const body = await res.json()
      if (!res.ok || !body.me) throw new Error(body.error || 'Could not sign in.')
      onSignedIn(body.me)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in. Check your connection and try again.')
      setBusy(false)
    }
  }

  function startNew() {
    const q = tidy(query)
    if (q && !/[a-z]/i.test(q)) {
      setNewMobile(q)
      setNewName('')
    } else {
      setNewName(q)
      setNewMobile('')
    }
    setMode('new')
    setOpen(false)
    setError('')
  }

  function choose(index: number) {
    if (index >= results.length) {
      startNew()
      return
    }
    const m = results[index]
    setSelected(m)
    setQuery(m.name)
    setOpen(false)
    setError('')
  }

  return (
    // Phones: content starts at the top (not centred), and while the list is
    // open there is room below to scroll the search box up above the keyboard.
    <div
      className={`duties-app relative flex min-h-screen flex-col items-center justify-start bg-primary-700 px-4 pt-16 md:justify-center md:py-12 ${
        open ? 'pb-[70vh] md:pb-12' : 'pb-12'
      }`}
    >
      {toolbar && <div className="absolute right-4 top-4 flex gap-2">{toolbar}</div>}
      <Logo />
      <div className="w-full max-w-md rounded-xl bg-surface p-6 text-ink shadow-lg sm:p-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gold-ink">10 years · team only</p>
        <h1 className="mb-3 font-serif text-3xl font-bold text-heading">Event day duties</h1>

        {mode === 'pick' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (selected) {
                void signIn(selected.name, selected.mobile)
              } else if (open && results.length && active < results.length) {
                choose(active)
              } else if (results.length === 1) {
                choose(0)
              } else if (tidy(query)) {
                startNew()
              } else {
                setError('Type your name or mobile number.')
              }
            }}
          >
            <p className="mb-6 text-ink-soft">Find yourself by name or mobile number. No password needed.</p>
            <label htmlFor="signin-search" className="mb-2 block text-sm font-semibold text-ink">
              Your name or mobile number
            </label>
            <div className="relative">
              <input
                id="signin-search"
                ref={searchRef}
                type="text"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls={listId}
                aria-activedescendant={open ? `${listId}-${active}` : undefined}
                autoComplete="off"
                maxLength={60}
                value={query}
                placeholder="e.g. Chetan or 98765 43210"
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelected(null)
                  setOpen(true)
                  setActive(0)
                  setError('')
                }}
                onFocus={() => {
                  setOpen(true)
                  // Phones: lift the box to the top so the list is not under the keyboard.
                  if (window.innerWidth < 768) {
                    setTimeout(() => searchRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 300)
                  }
                }}
                onBlur={() => setOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setOpen(true)
                    setActive((i) => Math.min(i + 1, optionCount - 1))
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setActive((i) => Math.max(i - 1, 0))
                  } else if (e.key === 'Escape') {
                    setOpen(false)
                  }
                }}
                className="w-full scroll-mt-4 rounded-lg border border-line-strong bg-surface px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-focus focus:border-focus"
              />
              {open && members && (
                <ul
                  id={listId}
                  role="listbox"
                  aria-label="Team members"
                  className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg bg-surface py-1 shadow-lg ring-1 ring-line"
                >
                  {results.map((m, i) => (
                    <li
                      key={m.mobile}
                      id={`${listId}-${i}`}
                      role="option"
                      aria-selected={i === active}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => choose(i)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex cursor-pointer items-baseline justify-between gap-3 px-4 py-2.5 ${
                        i === active ? 'bg-accent-soft' : ''
                      }`}
                    >
                      <span className="font-semibold text-ink">{m.name}</span>
                      <span className="text-sm tabular-nums text-ink-muted">{lastDigits(m.mobile)}</span>
                    </li>
                  ))}
                  {tidy(query) && !results.length && (
                    <li className="px-4 py-2.5 text-sm text-ink-muted" aria-hidden>
                      Nobody matches that.
                    </li>
                  )}
                  <li
                    id={`${listId}-${results.length}`}
                    role="option"
                    aria-selected={active === results.length}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(results.length)}
                    onMouseEnter={() => setActive(results.length)}
                    className={`cursor-pointer border-t border-line px-4 py-2.5 font-semibold text-link ${
                      active === results.length ? 'bg-accent-soft' : ''
                    }`}
                  >
                    + I am not on the list
                  </li>
                </ul>
              )}
            </div>
            {selected && (
              <p className="mt-2 text-sm text-ink-soft">
                Signing in as <strong className="text-ink">{selected.name}</strong>, mobile {lastDigits(selected.mobile)}.
              </p>
            )}
            {error && (
              <p role="alert" className="mt-2 text-sm text-danger-ink">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy || members === null} className={buttonClass}>
              {busy ? 'Signing in…' : selected ? `Continue as ${selected.name}` : 'Continue'}
            </button>
            <button
              type="button"
              onClick={startNew}
              className={linkButtonClass}
            >
              Not on the list? Add yourself
            </button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const name = tidy(newName)
              const mobile = cleanMobile(newMobile)
              if (name.length < 2) {
                setError('Please enter your name.')
                return
              }
              if (!mobile) {
                setError('Enter a mobile number. Add the country code, like +1, if it is not an Indian number.')
                return
              }
              void signIn(name, mobile)
            }}
          >
            <p className="mb-6 text-ink-soft">
              Add yourself to the team. This phone remembers you next time.
            </p>
            <label htmlFor="new-name" className="mb-2 block text-sm font-semibold text-ink">
              Your name
            </label>
            <input
              id="new-name"
              type="text"
              autoComplete="name"
              maxLength={60}
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value)
                setError('')
              }}
              autoFocus={!newName}
              className={bigInputClass}
            />
            <label htmlFor="new-mobile" className="mb-2 mt-5 block text-sm font-semibold text-ink">
              Mobile number
            </label>
            <input
              id="new-mobile"
              type="tel"
              autoComplete="tel"
              maxLength={20}
              value={newMobile}
              placeholder="98765 43210"
              aria-describedby="new-mobile-hint"
              onChange={(e) => {
                setNewMobile(e.target.value)
                setError('')
              }}
              autoFocus={Boolean(newName)}
              className={bigInputClass}
            />
            <p id="new-mobile-hint" className="mt-1.5 text-sm text-ink-muted">
              Outside India? Start with the country code, like +1.
            </p>
            {error && (
              <p role="alert" className="mt-2 text-sm text-danger-ink">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} className={buttonClass}>
              {busy ? 'Adding you…' : 'Add me and continue'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('pick')
                setError('')
              }}
              className={linkButtonClass}
            >
              Back to the team list
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
