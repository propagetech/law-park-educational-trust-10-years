const NAVY = '#1c1c2e'
const GOLD = '#c9903e'
const GOLD_LIGHT = '#e0b06a'

function Hero() {
  const imagePath = '/images/steel-plate-and-glass-distributed-to-these-children.webp'

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '92vh' }}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={imagePath}
          alt="Children learning and education"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          width={1920}
          height={1080}
          decoding="async"
        />
        {/* Vogue-style gradient: photo visible top-right, dark bottom-left for text */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${NAVY}ee 0%, ${NAVY}bb 40%, ${NAVY}55 70%, transparent 100%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${NAVY}cc 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Editorial content — left-aligned */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 w-full h-full flex flex-col justify-center" style={{ paddingTop: '18vh', paddingBottom: '120px' }}>
        <div className="max-w-2xl">

          {/* Gold overline */}
          <div className="flex items-center gap-3 mb-6">
            <div style={{ width: 40, height: 2, background: GOLD, borderRadius: 1 }} />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: GOLD_LIGHT, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.22em' }}
            >
              10-Year Anniversary · 2016 – 2025
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-serif font-black text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)', lineHeight: 1.05 }}
          >
            A Decade of<br />
            <span style={{ color: GOLD_LIGHT }}>Believing in</span><br />
            Every Child
          </h1>

          {/* Gold rule */}
          <div style={{ width: 56, height: 3, background: GOLD, marginBottom: '1.4rem', borderRadius: 2 }} />

          {/* Subtext */}
          <p
            className="text-white/85 leading-relaxed mb-10"
            style={{ fontSize: '1.1rem', maxWidth: 480, fontFamily: 'Quicksand, sans-serif', fontWeight: 400 }}
          >
            Law Park Educational Trust reaches children in rural India — providing scholarships, supplies, and the belief that no child should be left behind.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#journey"
              className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-3 transition-all"
              style={{
                background: GOLD,
                color: NAVY,
                fontFamily: 'Quicksand, sans-serif',
                letterSpacing: '0.04em',
              }}
            >
              Our Journey
            </a>
            <a
              href="#impact"
              className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-3 transition-all border"
              style={{
                borderColor: 'rgba(255,255,255,0.4)',
                color: 'rgba(255,255,255,0.9)',
                fontFamily: 'Quicksand, sans-serif',
                letterSpacing: '0.04em',
              }}
            >
              See Our Impact →
            </a>
          </div>
        </div>
      </div>

      {/* Bottom stat strip — anchored to bottom of hero */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ background: `${NAVY}f0`, borderTop: `2px solid ${GOLD}40` }}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-3 divide-x" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            {[
              { num: '500+', label: 'Students Supported' },
              { num: '10 Yrs', label: 'Of Continuous Impact' },
              { num: '5+ Districts', label: 'Across Karnataka' },
            ].map((s) => (
              <div key={s.label} className="text-center py-5 px-4">
                <div
                  className="font-serif font-black"
                  style={{ fontSize: '1.6rem', color: GOLD_LIGHT, lineHeight: 1 }}
                >
                  {s.num}
                </div>
                <div
                  className="mt-1 font-medium uppercase tracking-wider"
                  style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.55)', fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.14em' }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
