'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { primaryButtonClass } from './shared'

// A short guided tour, offered once on a phone's first sign-in and available
// again from Help. Each step outlines one control, found by its data-tour
// attribute; when a control exists twice (top tabs on a computer, bottom tabs
// on a phone) the visible one is used.

export interface TourStep {
  target: string
  title: string
  body: string
}

export const TOUR_STEPS: TourStep[] = [
  {
    target: 'tab-mine',
    title: 'My tasks',
    body: 'Everything given to you is here. Tap the circle when a task is done. Tap the task itself to choose who is doing it, say how it is going, or leave a comment.',
  },
  {
    target: 'tab-schedule',
    title: 'Schedule',
    body: 'Every activity on 3 and 4 October, each with its list of tasks. Any task with no one yet can be yours: tap it and choose "I will do it".',
  },
  {
    target: 'tab-duties',
    title: 'Duties',
    body: 'Roles for the day, like usher or first aid. Tap "Add me" on any duty you can do. Tap "Tasks" on a duty to see its steps.',
  },
  { target: 'text-size', title: 'Bigger text', body: 'Tap A+ to make the words bigger, and A− to make them smaller.' },
  { target: 'theme', title: 'Light or dark', body: 'Tap here to switch between a light screen and a dark one.' },
  { target: 'refresh', title: 'Get the latest', body: 'If something looks out of date, tap here to load the newest version.' },
  { target: 'help', title: 'That is all', body: 'Tap Help any time to see this tour again.' },
]

function findTarget(name: string): HTMLElement | null {
  const all = document.querySelectorAll<HTMLElement>(`[data-tour="${name}"]`)
  for (const el of all) if (el.getClientRects().length && el.offsetParent !== null) return el
  return null
}

export function TourOffer({ name, onStart, onSkip }: { name: string; onStart: () => void; onSkip: () => void }) {
  const startRef = useRef<HTMLButtonElement>(null)
  useEffect(() => startRef.current?.focus(), [])
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center" onKeyDown={(e) => e.key === 'Escape' && onSkip()}>
      <div role="dialog" aria-modal="true" aria-labelledby="tour-offer-title" className="w-full max-w-md rounded-2xl bg-surface p-6 text-ink shadow-xl">
        <h2 id="tour-offer-title" className="font-serif text-2xl font-bold text-heading">
          Welcome, {name}!
        </h2>
        <p className="mt-2 text-ink-soft">Would you like a quick tour of the app? It takes less than a minute.</p>
        <div className="mt-6 grid gap-2">
          <button ref={startRef} type="button" onClick={onStart} className={`min-h-12 text-base ${primaryButtonClass}`}>
            Show me around
          </button>
          <button type="button" onClick={onSkip} className="min-h-12 rounded-lg text-base font-semibold text-ink-soft hover:bg-muted">
            No thanks, skip
          </button>
        </div>
      </div>
    </div>
  )
}

export function Tour({ steps, onClose }: { steps: TourStep[]; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const step = steps[index]
  const last = index === steps.length - 1

  const measure = useCallback(() => {
    const el = findTarget(step.target)
    setRect(el ? el.getBoundingClientRect() : null)
  }, [step.target])

  useLayoutEffect(() => {
    const el = findTarget(step.target)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el?.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' })
    const now = setTimeout(measure, 0)
    const settled = setTimeout(measure, 400) // after a smooth scroll settles
    titleRef.current?.focus()
    return () => {
      clearTimeout(now)
      clearTimeout(settled)
    }
  }, [step.target, measure])

  useEffect(() => {
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [measure])

  // The card sits in the half of the screen away from the control it explains.
  const cardAtTop = rect ? rect.top + rect.height / 2 > window.innerHeight / 2 : false
  const pad = 6

  return (
    <div className="fixed inset-0 z-50" onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      {rect ? (
        <div
          aria-hidden
          className="pointer-events-none fixed rounded-xl ring-4 ring-gold-400 transition-all duration-200"
          style={{
            // Kept inside the screen for controls that touch its edge.
            top: Math.max(2, rect.top - pad),
            left: Math.max(2, rect.left - pad),
            width: Math.min(window.innerWidth - 4, rect.right + pad) - Math.max(2, rect.left - pad),
            height: Math.min(window.innerHeight - 4, rect.bottom + pad) - Math.max(2, rect.top - pad),
            boxShadow: '0 0 0 9999px rgb(0 0 0 / 0.6)',
          }}
        />
      ) : (
        <div aria-hidden className="fixed inset-0 bg-black/60" />
      )}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-body"
        className={`fixed inset-x-4 mx-auto max-w-md rounded-2xl bg-surface p-5 text-ink shadow-xl ${
          cardAtTop ? 'top-4' : 'bottom-[calc(1rem+env(safe-area-inset-bottom))]'
        }`}
      >
        <p className="text-sm font-semibold text-gold-ink">
          Step {index + 1} of {steps.length}
        </p>
        <h2 id="tour-title" ref={titleRef} tabIndex={-1} className="mt-1 text-xl font-bold text-heading focus:outline-none">
          {step.title}
        </h2>
        <p id="tour-body" className="mt-2 text-ink-soft">
          {step.body}
        </p>
        <div className="mt-5 flex items-center gap-2">
          {!last && (
            <button type="button" onClick={onClose} className="mr-auto min-h-11 rounded-lg px-3 text-sm font-semibold text-ink-muted hover:bg-muted">
              Skip tour
            </button>
          )}
          {index > 0 && (
            <button
              type="button"
              onClick={() => setIndex(index - 1)}
              className={`min-h-11 rounded-lg px-4 font-semibold text-ink-soft hover:bg-muted ${last ? 'mr-auto' : ''}`}
            >
              Back
            </button>
          )}
          <button type="button" onClick={() => (last ? onClose() : setIndex(index + 1))} className={`min-h-11 px-5 text-base ${primaryButtonClass}`}>
            {last ? 'Done' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
