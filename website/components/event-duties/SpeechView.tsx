'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { SPEECHES } from '@/data/speeches'
import { PreferenceButtons, usePreferences } from './Preferences'

// Kannada runs (with the spaces and punctuation inside them) are marked
// lang="kn", so screen readers switch voice; {{ }} marks a filled-in blank.
function render(text: string): ReactNode[] {
  const out: ReactNode[] = []
  text.split(/(\{\{.*?\}\})/).forEach((part, i) => {
    const filled = part.startsWith('{{') && part.endsWith('}}')
    const body = filled ? part.slice(2, -2) : part
    const pieces = body.split(/([ಀ-೿][ಀ-೿\s.,!?…"'”“-]*[ಀ-೿.!?…])/).map((seg, j) =>
      /[ಀ-೿]/.test(seg) ? (
        <span key={j} lang="kn">
          {seg}
        </span>
      ) : (
        seg
      ),
    )
    out.push(
      filled ? (
        <mark key={i} className="rounded bg-mine px-1 text-mine-ink" title="Filled in: please check">
          {pieces}
        </mark>
      ) : (
        <span key={i}>{pieces}</span>
      ),
    )
  })
  return out
}

export function SpeechView({ slug }: { slug: string }) {
  const prefs = usePreferences()
  const speech = SPEECHES.find((s) => s.slug === slug)!
  const [awake, setAwake] = useState(false)
  const [canWake, setCanWake] = useState(false)
  const lock = useRef<{ release: () => Promise<void> } | null>(null)

  // "Keep the screen on" for reading at the podium; not every phone allows it.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only check after load
    setCanWake('wakeLock' in navigator)
    return () => void lock.current?.release().catch(() => {})
  }, [])

  async function toggleAwake() {
    if (awake) {
      await lock.current?.release().catch(() => {})
      lock.current = null
      setAwake(false)
      return
    }
    try {
      lock.current = await (navigator as Navigator & { wakeLock: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } }).wakeLock.request('screen')
      setAwake(true)
    } catch {
      setAwake(false)
    }
  }

  return (
    <div className="duties-app min-h-screen bg-canvas pb-16 text-ink">
      <header className="bg-primary-700 text-white">
        <div className="container-custom pb-10 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              href="/event-duties"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
            >
              <span aria-hidden>←</span> Back to duties
            </Link>
            <div className="flex gap-2">
              <PreferenceButtons prefs={prefs} />
            </div>
          </div>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-gold-300">Speech · {speech.length}</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-white [overflow-wrap:anywhere] sm:text-4xl md:text-5xl">{speech.title}</h1>
          <p className="mt-3 text-lg text-primary-100">{speech.speakerFull}</p>
          <p className="mt-1 text-primary-200">
            {speech.when} · {speech.language}
          </p>
        </div>
      </header>

      <div className="container-custom mt-8 grid max-w-3xl gap-6">
        <section className="rounded-xl bg-warn-soft p-4 text-warn-ink" aria-label="Before you read">
          <ul className="grid list-disc gap-1 pl-5">
            {speech.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          {canWake && (
            <button
              type="button"
              aria-pressed={awake}
              onClick={() => void toggleAwake()}
              className={`mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold ring-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                awake ? 'bg-action text-on-action ring-transparent' : 'bg-surface text-ink ring-line'
              }`}
            >
              {awake ? '✓ Screen stays on' : 'Keep the screen on while reading'}
            </button>
          )}
        </section>

        <article className="rounded-xl bg-surface p-5 ring-1 ring-line sm:p-8" aria-label={`${speech.title} script`}>
          <div className="grid gap-6 text-xl leading-relaxed text-ink">
            {speech.paragraphs.map((p, i) =>
              p.startsWith('OPTIONAL: ') ? (
                <p key={i} className="rounded-lg border-2 border-dashed border-gold-500 p-4 text-lg text-ink-soft">
                  <span className="mb-1 block text-sm font-semibold uppercase tracking-wide text-gold-ink">Optional</span>
                  {render(p.slice('OPTIONAL: '.length))}
                </p>
              ) : (
                <p key={i}>{render(p)}</p>
              ),
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
