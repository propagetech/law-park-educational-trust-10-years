'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { CHIEF_GUESTS, ORDINAL } from '@/data/chiefGuests'
import { PreferenceButtons, usePreferences } from './Preferences'

const card = 'rounded-xl bg-surface p-5 ring-1 ring-line sm:p-6'
const h2 = 'text-sm font-semibold uppercase tracking-wide text-ink-muted'

export function GuestProfile({ slug }: { slug: string }) {
  const prefs = usePreferences()
  const guest = CHIEF_GUESTS.find((g) => g.slug === slug)!
  const others = CHIEF_GUESTS.filter((g) => g.slug !== slug)
  const introRef = useRef<HTMLParagraphElement>(null)
  const [copied, setCopied] = useState<'yes' | 'select' | null>(null)

  async function copyIntro() {
    try {
      await navigator.clipboard.writeText(guest.emceeIntro)
      setCopied('yes')
    } catch {
      // No clipboard: select the text so it can be copied by hand.
      const range = document.createRange()
      if (introRef.current) range.selectNodeContents(introRef.current)
      window.getSelection()?.removeAllRanges()
      window.getSelection()?.addRange(range)
      setCopied('select')
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
          <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-gold-300">
            Chief guest · honoured {ORDINAL[guest.honourOrder]} of {CHIEF_GUESTS.length}
          </p>
          {/* Long names (and big text settings) wrap inside the screen rather than run off it. */}
          <h1 className="mt-2 font-serif text-2xl font-bold text-white [overflow-wrap:anywhere] min-[400px]:text-3xl sm:text-4xl md:text-5xl">{guest.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-primary-100">{guest.role}</p>
        </div>
      </header>

      <div className="container-custom mt-8 grid max-w-3xl gap-6">
        {!guest.complete && (
          <p className="rounded-xl bg-warn-soft p-4 text-sm text-warn-ink">
            Only the confirmed basics are here so far. A fuller profile will be added once the trust has the details.
          </p>
        )}

        <section className={card} aria-labelledby="h-glance">
          <h2 id="h-glance" className={h2}>
            At a glance
          </h2>
          <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
            {guest.glance.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="font-semibold text-ink-soft">{k}</dt>
                <dd className="text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {guest.career && (
          <section className={card} aria-labelledby="h-career">
            <h2 id="h-career" className={h2}>
              Career
            </h2>
            <ol className="mt-4 grid gap-4">
              {guest.career.map((c) => (
                <li key={c.position + c.when} className="grid gap-0.5 border-l-2 border-gold-500 pl-4">
                  <span className="font-semibold text-ink">{c.position}</span>
                  <span className="text-ink-soft">{c.where}</span>
                  <span className="text-sm text-gold-ink">{c.when}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {guest.sections?.map((s) => (
          <section key={s.title} className={card} aria-label={s.title}>
            <h2 className={h2}>{s.title}</h2>
            <ul className="mt-4 grid list-disc gap-2 pl-5 text-ink marker:text-gold-500">
              {s.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className={`${card} ring-2 ring-focus`} aria-labelledby="h-intro">
          <h2 id="h-intro" className={h2}>
            For the emcee: a short introduction
          </h2>
          <p ref={introRef} className="mt-4 text-lg leading-relaxed text-ink">
            {guest.emceeIntro}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void copyIntro()}
              className="min-h-11 rounded-lg bg-action px-5 text-sm font-semibold text-on-action hover:bg-action-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
            >
              Copy the introduction
            </button>
            <span role="status" aria-live="polite" className="text-sm text-ink-muted">
              {copied === 'yes' ? 'Copied.' : copied === 'select' ? 'Selected: copy it from your phone’s menu.' : 'A draft: please check it before the event.'}
            </span>
          </div>
        </section>

        <section className={card} aria-labelledby="h-others">
          <h2 id="h-others" className={h2}>
            Honouring order on 4 October
          </h2>
          <ol className="mt-4 grid gap-2">
            {CHIEF_GUESTS.map((g) => (
              <li key={g.slug} className="flex items-baseline gap-3">
                <span className="w-9 shrink-0 font-semibold tabular-nums text-gold-ink">{ORDINAL[g.honourOrder]}</span>
                {g.slug === slug ? (
                  <span className="font-semibold text-ink" aria-current="page">
                    {g.short} <span className="font-normal text-ink-muted">(this page)</span>
                  </span>
                ) : (
                  <Link href={`/event-duties/guests/${g.slug}`} className="inline-flex min-h-9 items-center font-semibold text-link underline underline-offset-2">
                    {g.short}
                  </Link>
                )}
              </li>
            ))}
          </ol>
          {others.length > 0 && <p className="mt-3 text-sm text-ink-muted">Tap a name to read about them.</p>}
        </section>

        {guest.sources && (
          <section className="px-1 text-sm text-ink-muted" aria-labelledby="h-sources">
            <h2 id="h-sources" className="font-semibold text-ink-soft">
              Sources
            </h2>
            <p className="mt-1">Gathered from public sources shared by the team. Please check before printing or reading aloud.</p>
            <ul className="mt-2 grid gap-1">
              {guest.sources.map((s) => (
                <li key={s.label}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center text-link underline underline-offset-2">
                      {s.label}
                    </a>
                  ) : (
                    s.label
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
