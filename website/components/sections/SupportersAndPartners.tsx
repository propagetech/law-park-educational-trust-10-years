import type { Supporter, PartnerNGO } from '../../types'

interface SupportersAndPartnersProps {
  supporters: Supporter[]
  teamMembers?: string[]
  donors?: string[]
  partnerNGOs: PartnerNGO[]
}

const NAVY = '#1c1c2e'
const GOLD = '#c9903e'
const CREAM = '#faf8f3'

export function SupportersAndPartners({ supporters, teamMembers, donors = [], partnerNGOs }: SupportersAndPartnersProps) {
  const teamList = teamMembers && teamMembers.length > 0 ? teamMembers : supporters.map((s) => s.name)
  const sortedTeamList = [...teamList].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  const sortedSupportersWithQuotes = [...supporters]
    .filter((s) => s.quote)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
  return (
    <section id="supporters-partners" style={{ background: CREAM }} className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

        <div className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div style={{ width: 32, height: 2, background: GOLD, borderRadius: 1 }} />
            <span
              className="text-xs font-semibold uppercase"
              style={{ color: GOLD, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.2em' }}
            >
              Our Community
            </span>
          </div>
          <h2
            className="font-serif font-bold"
            style={{ color: NAVY, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', lineHeight: 1.15 }}
          >
            The People Who Make It Possible
          </h2>
        </div>

        {/* Team — chip style */}
        <div className="mb-16">
          <h3
            className="font-semibold uppercase tracking-widest text-xs mb-6"
            style={{ color: GOLD, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.18em' }}
          >
            Our Team
          </h3>
          <div className="flex flex-wrap gap-2">
            {sortedTeamList.map((name, index) => (
              <div
                key={index}
                className="bg-white flex items-center gap-2 px-4 py-2"
                style={{ border: `1px solid rgba(201,144,62,0.25)` }}
              >
                <div
                  className="font-semibold leading-tight"
                  style={{ color: NAVY, fontFamily: 'Quicksand, sans-serif', fontSize: '0.82rem' }}
                >
                  {name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team pull-quotes */}
        {supporters.some((s) => s.quote) && (
          <div className="mb-16">
            <h3
              className="font-semibold uppercase tracking-widest text-xs mb-8"
              style={{ color: GOLD, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.18em' }}
            >
              Voices from Our Team
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedSupportersWithQuotes.map((supporter, index) => (
                  <div
                    key={index}
                    className="p-5"
                    style={{ background: NAVY, borderLeft: `3px solid ${GOLD}` }}
                  >
                    <p
                      className="font-serif italic leading-relaxed mb-4"
                      style={{ color: '#e0b06a', fontSize: '0.92rem' }}
                    >
                      &ldquo;{supporter.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        style={{ width: 20, height: 2, background: GOLD, borderRadius: 1 }}
                      />
                      <div>
                        <span
                          className="font-semibold"
                          style={{ color: '#fff', fontFamily: 'Quicksand, sans-serif', fontSize: '0.78rem' }}
                        >
                          {supporter.name}
                        </span>
                        {supporter.contribution && (
                          <span
                            style={{ color: '#9a9aaa', fontFamily: 'Quicksand, sans-serif', fontSize: '0.7rem' }}
                          >
                            {' '}&middot; {supporter.contribution}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Our Donors — chip style */}
        {donors.length > 0 && (
          <div className="mb-16">
            <h3
              className="font-semibold uppercase tracking-widest text-xs mb-6"
              style={{ color: GOLD, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.18em' }}
            >
              Our Donors
            </h3>
            <div className="flex flex-wrap gap-2">
              {donors.map((label, index) => (
                <div
                  key={index}
                  className="bg-white flex items-center gap-2 px-4 py-2"
                  style={{ border: `1px solid rgba(201,144,62,0.25)` }}
                >
                  <div
                    className="font-semibold leading-tight"
                    style={{ color: NAVY, fontFamily: 'Quicksand, sans-serif', fontSize: '0.82rem' }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Partner NGOs */}
        <div>
          <h3
            className="font-semibold uppercase tracking-widest text-xs mb-6"
            style={{ color: GOLD, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.18em' }}
          >
            Partner Organisations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-full">
            {partnerNGOs.map((partner, index) => (
              <div
                key={index}
                className="bg-white p-6"
                style={{ borderTop: `3px solid ${GOLD}` }}
              >
                <h4
                  className="font-serif font-bold mb-2"
                  style={{ color: NAVY, fontSize: '1.05rem' }}
                >
                  {partner.name}
                </h4>
                {partner.focus && (
                  <span
                    className="inline-block text-xs font-semibold uppercase tracking-wider mb-3 px-2 py-0.5"
                    style={{ color: GOLD, background: '#fdf6ea', letterSpacing: '0.1em', fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {partner.focus}
                  </span>
                )}
                <p
                  className="text-gray-500 text-sm leading-relaxed"
                  style={{ fontFamily: 'Quicksand, sans-serif' }}
                >
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
