import { activities } from '../../data/activities'

const NAVY = '#1c1c2e'
const GOLD = '#c9903e'
const CREAM = '#faf8f3'

function Activities() {
  return (
    <section id="activities" style={{ background: CREAM }} className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: 32, height: 2, background: GOLD, borderRadius: 1 }} />
              <span
                className="text-xs font-semibold uppercase"
                style={{ color: GOLD, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.2em' }}
              >
                What We Do
              </span>
            </div>
            <h2
              className="font-serif font-bold"
              style={{ color: NAVY, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', lineHeight: 1.15 }}
            >
              A Full Circle of Support
            </h2>
          </div>
          <p
            className="text-gray-500 leading-relaxed"
            style={{ fontFamily: 'Quicksand, sans-serif', maxWidth: 380, fontSize: '0.95rem' }}
          >
            Scholarships are just the beginning. Every child we support gets supplies, counselling, cultural programmes, and a library — because education is more than fees.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((activity) => (
            <div
              key={activity.title}
              className="bg-white flex flex-col"
              style={{ borderTop: `3px solid ${GOLD}` }}
            >
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-4 text-2xl">{activity.icon}</div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: NAVY, fontFamily: 'Quicksand, sans-serif', fontSize: '0.95rem', fontWeight: 700 }}
                >
                  {activity.title}
                </h3>
                <p
                  className="text-gray-500 text-sm leading-relaxed flex-1"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Activities
