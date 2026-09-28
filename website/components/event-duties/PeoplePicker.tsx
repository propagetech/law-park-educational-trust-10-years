'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { sameName, tidy } from './shared'

export interface PersonOption {
  name: string
  detail: string // what they have on, e.g. "1 duty, 3 open tasks"
}

interface PeoplePickerProps {
  id: string
  options: PersonOption[]
  selected: string[]
  onChange: (names: string[]) => void
}

// Type to find people and pick several; each pick becomes a chip.
// Keyboard: arrows move, Enter picks, Escape closes, Backspace on an empty
// box removes the last chip.
export function PeoplePicker({ id, options, selected, onChange }: PeoplePickerProps) {
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const matches = useMemo(() => {
    const q = tidy(query).toLowerCase()
    const left = options.filter((o) => !selected.some((n) => sameName(n, o.name)))
    if (!q) return left
    return left
      .filter((o) => o.name.toLowerCase().includes(q))
      .sort((a, b) => Number(!a.name.toLowerCase().startsWith(q)) - Number(!b.name.toLowerCase().startsWith(q)))
  }, [options, selected, query])

  function pick(name: string) {
    onChange([...selected, name])
    setQuery('')
    setActive(0)
    inputRef.current?.focus()
  }

  function remove(name: string) {
    onChange(selected.filter((n) => n !== name))
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      {/* The whole box focuses the input, like one text field. */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="mt-1 flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg border border-line-strong bg-surface px-2 py-1.5 focus-within:border-focus focus-within:ring-2 focus-within:ring-focus"
      >
        {selected.map((name) => (
          <span key={name} className="inline-flex items-center gap-1 rounded-full bg-mine py-0.5 pl-2.5 pr-1 text-sm font-semibold text-mine-ink">
            {name}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                remove(name)
              }}
              aria-label={`Remove ${name}`}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full leading-none hover:bg-surface/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && matches.length ? `${listId}-${active}` : undefined}
          autoComplete="off"
          value={query}
          placeholder={selected.length ? 'Add another' : 'Type a name'}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActive(0)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setOpen(true)
              setActive((i) => Math.min(i + 1, Math.max(matches.length - 1, 0)))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((i) => Math.max(i - 1, 0))
            } else if (e.key === 'Enter') {
              if (open && matches[active]) {
                e.preventDefault()
                pick(matches[active].name)
              }
            } else if (e.key === 'Escape') {
              setOpen(false)
            } else if (e.key === 'Backspace' && !query && selected.length) {
              onChange(selected.slice(0, -1))
            }
          }}
          className="min-h-8 min-w-32 flex-1 bg-transparent px-1 text-base focus:outline-none sm:text-sm"
        />
      </div>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="People"
          aria-multiselectable="true"
          className="absolute z-40 mt-1 max-h-64 w-full overflow-auto rounded-lg bg-surface py-1 shadow-lg ring-1 ring-line"
        >
          {matches.map((o, i) => (
            <li
              key={o.name}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(o.name)}
              onMouseEnter={() => setActive(i)}
              className={`flex min-h-11 cursor-pointer flex-wrap items-baseline justify-between gap-x-3 px-3 py-2 ${i === active ? 'bg-accent-soft' : ''}`}
            >
              <span className="font-semibold text-ink">{o.name}</span>
              <span className="text-sm text-ink-muted">{o.detail}</span>
            </li>
          ))}
          {!matches.length && (
            <li className="px-3 py-2 text-sm text-ink-muted" aria-hidden>
              {tidy(query) ? 'Nobody matches that.' : 'Everyone is already chosen.'}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
