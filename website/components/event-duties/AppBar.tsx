'use client'

import Image from 'next/image'
import { useEffect, useState, type ReactNode, type RefObject } from 'react'

const NUDGE = 4 // px of scroll that counts as a change of direction

// Standard "hide on scroll down, show on scroll up" for a slim top bar.
// It stays hidden while the full header (passed in) is still on screen, so
// the two never show at once, and never moves layout: the bar is fixed.
export function useRevealOnScrollUp(header: RefObject<HTMLElement | null>) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    let queued = false
    function update() {
      queued = false
      const y = window.scrollY
      const headerBottom = header.current ? header.current.offsetTop + header.current.offsetHeight : 0
      if (y <= headerBottom) setShown(false)
      else if (y < last - NUDGE) setShown(true)
      else if (y > last + NUDGE) setShown(false)
      else return // too small to count; keep comparing against the same point
      last = y
    }
    function onScroll() {
      if (!queued) {
        queued = true
        requestAnimationFrame(update)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [header])

  return shown
}

// title: the current tab's name, which is short and says where you are.
export function AppBar({ shown, icon, title, children }: { shown: boolean; icon: string; title: string; children: ReactNode }) {
  return (
    <div
      // Off screen it is also out of reach for keyboard and screen readers.
      aria-hidden={!shown}
      inert={!shown}
      className={`fixed inset-x-0 top-0 z-50 bg-primary-700 pt-[env(safe-area-inset-top)] text-white shadow-md transition-transform duration-200 ease-out motion-reduce:transition-none print:hidden ${
        shown ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container-custom flex h-14 items-center gap-2 sm:gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-1">
          <Image src={icon} alt="" width={252} height={256} className="h-full w-auto" />
        </span>
        <p className="min-w-0 flex-1 truncate font-serif text-lg font-bold text-white">{title}</p>
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">{children}</div>
      </div>
    </div>
  )
}
