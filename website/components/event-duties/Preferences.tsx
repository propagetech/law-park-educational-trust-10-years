'use client'

import { useCallback, useEffect, useState } from 'react'

// Per-phone display preferences for /event-duties: light or dark theme, and
// a larger text size for anyone who finds the default small. Both are kept
// in localStorage and applied to <html>, and undone when the app unmounts so
// no other page on the site changes. Pinch zoom stays available regardless.

type Theme = 'light' | 'dark'

const THEME_KEY = 'lpet-duties-theme'
const TEXT_KEY = 'lpet-duties-text'
export const TEXT_STEPS = [100, 115, 130, 150] // percent of the default size

function read(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Private mode: the choice lasts for this visit only.
  }
}

export interface Preferences {
  theme: Theme
  textStep: number
  toggleTheme: () => void
  smaller: () => void
  larger: () => void
}

export function usePreferences(): Preferences {
  // null follows the phone's own light or dark setting.
  const [chosen, setChosen] = useState<Theme | null>(null)
  const [systemDark, setSystemDark] = useState(false)
  const [textStep, setTextStep] = useState(0)

  // Saved choices live in the browser only, so they are read after the
  // static page loads, not during the build-time render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const saved = read(THEME_KEY)
    if (saved === 'light' || saved === 'dark') setChosen(saved)
    const step = Number(read(TEXT_KEY))
    if (Number.isInteger(step) && step > 0 && step < TEXT_STEPS.length) setTextStep(step)
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemDark(media.matches)
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const html = document.documentElement
    if (chosen) html.dataset.theme = chosen
    else delete html.dataset.theme
    return () => {
      delete html.dataset.theme
    }
  }, [chosen])

  useEffect(() => {
    const html = document.documentElement
    html.style.fontSize = textStep ? `${TEXT_STEPS[textStep]}%` : ''
    return () => {
      html.style.fontSize = ''
    }
  }, [textStep])

  const theme: Theme = chosen ?? (systemDark ? 'dark' : 'light')

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setChosen(next)
    write(THEME_KEY, next)
  }, [theme])

  const setStep = useCallback((step: number) => {
    const clamped = Math.max(0, Math.min(TEXT_STEPS.length - 1, step))
    setTextStep(clamped)
    write(TEXT_KEY, String(clamped))
  }, [])

  return {
    theme,
    textStep,
    toggleTheme,
    smaller: () => setStep(textStep - 1),
    larger: () => setStep(textStep + 1),
  }
}

function SunIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

// Round buttons for the navy header and sign-in screen.
export const toolbarButtonClass =
  'relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300'

export function PreferenceButtons({ prefs }: { prefs: Preferences }) {
  const atMin = prefs.textStep === 0
  const atMax = prefs.textStep === TEXT_STEPS.length - 1
  return (
    <>
      <div role="group" aria-label="Text size" className="flex gap-1">
        <button type="button" onClick={prefs.smaller} disabled={atMin} className={toolbarButtonClass} aria-label="Smaller text" title="Smaller text">
          <span aria-hidden className="text-sm font-bold">A−</span>
        </button>
        <button type="button" onClick={prefs.larger} disabled={atMax} className={toolbarButtonClass} aria-label="Larger text" title="Larger text">
          <span aria-hidden className="text-lg font-bold">A+</span>
        </button>
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        Text size {TEXT_STEPS[prefs.textStep]}%
      </span>
      <button
        type="button"
        onClick={prefs.toggleTheme}
        className={toolbarButtonClass}
        aria-label={prefs.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        title={prefs.theme === 'dark' ? 'Light theme' : 'Dark theme'}
      >
        {prefs.theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </>
  )
}
