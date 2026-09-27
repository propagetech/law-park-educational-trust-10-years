'use client'

import Image from 'next/image'
import { useEffect, useId, useMemo, useState } from 'react'
import { cleanMobile, inputClass, tidy, type Member } from './shared'

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

const buttonClass =
  'mt-6 w-full rounded-lg bg-primary-700 px-4 py-3 text-lg font-semibold text-white hover:bg-primary-600 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2'

export function SignIn({ onSignedIn }: { onSignedIn: (user: Member) => void }) {
  const listId = useId()
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
    <div className="min-h-screen bg-primary-700 flex flex-col items-center justify-center px-4 py-12">
      <Logo />
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gold-700">10 years · team only</p>
        <h1 className="mb-3 font-serif text-3xl font-bold text-primary-700">Event day duties</h1>

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
            <p className="mb-6 text-gray-600">Find yourself by name or mobile number. No password needed.</p>
            <label htmlFor="signin-search" className="mb-2 block text-sm font-semibold text-gray-800">
              Your name or mobile number
            </label>
            <div className="relative">
              <input
                id="signin-search"
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
                onFocus={() => setOpen(true)}
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {open && members && (
                <ul
                  id={listId}
                  role="listbox"
                  aria-label="Team members"
                  className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-gray-200"
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
                        i === active ? 'bg-primary-50' : ''
                      }`}
                    >
                      <span className="font-semibold text-gray-900">{m.name}</span>
                      <span className="text-sm tabular-nums text-gray-500">{lastDigits(m.mobile)}</span>
                    </li>
                  ))}
                  {tidy(query) && !results.length && (
                    <li className="px-4 py-2.5 text-sm text-gray-500" aria-hidden>
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
                    className={`cursor-pointer border-t border-gray-100 px-4 py-2.5 font-semibold text-primary-600 ${
                      active === results.length ? 'bg-primary-50' : ''
                    }`}
                  >
                    + I am not on the list
                  </li>
                </ul>
              )}
            </div>
            {selected && (
              <p className="mt-2 text-sm text-gray-600">
                Signing in as <strong className="text-gray-900">{selected.name}</strong>, mobile {lastDigits(selected.mobile)}.
              </p>
            )}
            {error && (
              <p role="alert" className="mt-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy || members === null} className={buttonClass}>
              {busy ? 'Signing in…' : selected ? `Continue as ${selected.name}` : 'Continue'}
            </button>
            <button
              type="button"
              onClick={startNew}
              className="mt-4 w-full text-center text-sm font-semibold text-primary-600 hover:underline"
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
            <p className="mb-6 text-gray-600">
              Add yourself to the team. This phone remembers you next time.
            </p>
            <label htmlFor="new-name" className="mb-2 block text-sm font-semibold text-gray-800">
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
              className={`w-full py-3 text-lg ${inputClass}`}
            />
            <label htmlFor="new-mobile" className="mb-2 mt-5 block text-sm font-semibold text-gray-800">
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
              className={`w-full py-3 text-lg ${inputClass}`}
            />
            <p id="new-mobile-hint" className="mt-1.5 text-sm text-gray-500">
              Outside India? Start with the country code, like +1.
            </p>
            {error && (
              <p role="alert" className="mt-2 text-sm text-red-700">
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
              className="mt-4 w-full text-center text-sm font-semibold text-primary-600 hover:underline"
            >
              Back to the team list
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
