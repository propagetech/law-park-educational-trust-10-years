export interface ProcessStep {
  title: string
  description: string
}

interface ProcessProps {
  process: {
    title: string
    steps: ProcessStep[]
  }
}

const NAVY = '#1c1c2e'
const GOLD = '#c9903e'
const GOLD_LIGHT = '#e0b06a'

export function Process({ process }: ProcessProps) {
  return (
    <section id="process" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div style={{ width: 32, height: 2, background: GOLD, borderRadius: 1 }} />
            <span
              className="text-xs font-semibold uppercase"
              style={{ color: GOLD, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.2em' }}
            >
              How We Work
            </span>
            <div style={{ width: 32, height: 2, background: GOLD, borderRadius: 1 }} />
          </div>
          <h2
            className="font-serif font-bold"
            style={{ color: NAVY, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', lineHeight: 1.15 }}
          >
            {process.title}
          </h2>
        </div>

        {/* Steps with connecting line */}
        <div className="relative">
          {/* Horizontal connector line (desktop) */}
          <div
            className="hidden lg:block absolute top-6.5 left-0 right-0"
            style={{
              height: 1,
              background: `linear-gradient(to right, transparent, ${GOLD}60, ${GOLD}60, transparent)`,
              zIndex: 0,
              marginLeft: '12.5%',
              marginRight: '12.5%',
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {process.steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Gold circle */}
                <div
                  className="flex items-center justify-center font-serif font-black text-white mb-6 shrink-0"
                  style={{
                    width: 52,
                    height: 52,
                    background: NAVY,
                    border: `2px solid ${GOLD}`,
                    borderRadius: '50%',
                    fontSize: '1.3rem',
                    color: GOLD_LIGHT,
                  }}
                >
                  {index + 1}
                </div>
                <h3
                  className="font-semibold mb-3"
                  style={{ color: NAVY, fontFamily: 'Quicksand, sans-serif', fontSize: '1rem', fontWeight: 700 }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-gray-500 text-sm leading-relaxed"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
