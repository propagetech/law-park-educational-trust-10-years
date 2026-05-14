'use client'

import { useEffect, useState } from 'react'
import { stats } from '../../data/stats'

function StatCard({ label, value, suffix, customText }: { label: string; value: number; suffix?: string; customText?: string }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated || customText) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasAnimated(true)
            const duration = 2000
            const steps = 60
            const increment = value / steps
            let current = 0

            const timer = setInterval(() => {
              current += increment
              if (current >= value) {
                setCount(value)
                clearInterval(timer)
              } else {
                setCount(Math.floor(current))
              }
            }, duration / steps)
          }
        })
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById(`stat-impact-${label}`)
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [value, label, hasAnimated, customText])

  return (
    <div id={`stat-impact-${label}`} className="text-center">
      <div
        className="font-serif font-black"
        style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', color: '#e0b06a', lineHeight: 1 }}
      >
        {customText || `${count.toLocaleString()}${suffix || ''}`}
      </div>
      <div
        className="mt-3 font-medium uppercase tracking-wider"
        style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.14em' }}
      >
        {label}
      </div>
    </div>
  )
}

const NAVY = '#1c1c2e'
const GOLD = '#c9903e'
const GOLD_LIGHT = '#e0b06a'

function ImpactOverview() {
  return (
    <section id="impact" style={{ background: NAVY }} className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-3">
          <div style={{ width: 32, height: 2, background: GOLD, borderRadius: 1 }} />
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: GOLD, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.2em' }}
          >
            Our Impact
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <h2
            className="font-serif font-bold text-white"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.15, maxWidth: 480 }}
          >
            Ten years of showing up,<br />
            <span style={{ color: GOLD_LIGHT }}>one child at a time.</span>
          </h2>
          <p
            className="text-white/60 leading-relaxed"
            style={{ fontFamily: 'Quicksand, sans-serif', maxWidth: 360, fontSize: '0.95rem' }}
          >
            From a single scholarship in Chickaballapur in 2016 to 10+ districts across Karnataka — here is what a decade looks like in numbers.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px" style={{ background: 'rgba(255,255,255,0.08)' }}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              id={`stat-${stat.label}`}
              style={{ background: NAVY }}
              className="px-8 py-10 text-center"
            >
              <StatCard
                label={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                customText={stat.customText}
              />
            </div>
          ))}
        </div>

        {/* Pull quote */}
        <div
          className="mt-12 text-center"
          style={{ borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: '2rem' }}
        >
          <p
            className="font-serif italic"
            style={{ color: GOLD_LIGHT, fontSize: '1.1rem', maxWidth: 560, margin: '0 auto' }}
          >
            &quot;When it comes to education, no child deserves to be left behind.&quot;
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div style={{ width: 20, height: 1.5, background: GOLD, borderRadius: 1 }} />
            <span style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Quicksand, sans-serif', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              Charulatha M. R., Founder
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}

export default ImpactOverview
