export interface Trustee {
  name: string
  role: string
  bio: string
  image?: string
}

interface TrusteesProps {
  trustees: Trustee[]
}

const NAVY = '#1c1c2e'
const GOLD = '#c9903e'
const CREAM = '#faf8f3'

function sortByName(a: { name: string }, b: { name: string }) {
  return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
}

export function Trustees({ trustees }: TrusteesProps) {
  const sortedTrustees = [...trustees].sort(sortByName)
  return (
    <section id="trustees" style={{ background: CREAM }} className="pt-20 sm:pt-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

        <div className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div style={{ width: 32, height: 2, background: GOLD, borderRadius: 1 }} />
            <span
              className="text-xs font-semibold uppercase"
              style={{ color: GOLD, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.2em' }}
            >
              Leadership
            </span>
          </div>
          <h2
            className="font-serif font-bold"
            style={{ color: NAVY, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', lineHeight: 1.15 }}
          >
            The People Behind the Work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedTrustees.map((trustee, index) => (
            <div
              key={index}
              className="bg-white flex gap-5 p-6"
              style={{ borderTop: `3px solid ${GOLD}` }}
            >
              {trustee.image && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element -- static export; images unoptimized */}
                  <img
                    src={trustee.image}
                    alt={trustee.name}
                    className="w-20 h-20 object-cover shrink-0"
                    style={{ borderRadius: 2 }}
                    loading="lazy"
                  />
                </>
              )}
              <div>
                <span
                  className="text-xs font-semibold uppercase tracking-widest block mb-1"
                  style={{ color: GOLD, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.16em' }}
                >
                  {trustee.role}
                </span>
                <h3
                  className="font-serif font-bold mb-2"
                  style={{ color: NAVY, fontSize: '1.15rem' }}
                >
                  {trustee.name}
                </h3>
                <p
                  className="text-gray-500 text-sm leading-relaxed"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {trustee.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
