import type { Award } from '@/types'

interface AwardsProps {
  awards: Award[]
}

const NAVY = '#1c1c2e'
const NAVY_MID = '#2d2d44'
const GOLD = '#c9903e'
const GOLD_LIGHT = '#e0b06a'

export function Awards({ awards }: AwardsProps) {
  return (
    <section id="awards" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

        <div className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div style={{ width: 32, height: 2, background: GOLD, borderRadius: 1 }} />
            <span
              className="text-xs font-semibold uppercase"
              style={{ color: GOLD, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.2em' }}
            >
              Recognition
            </span>
          </div>
          <h2
            className="font-serif font-bold"
            style={{ color: NAVY, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', lineHeight: 1.15 }}
          >
            A Decade Recognised
          </h2>
        </div>

        <div className="space-y-10">
          {awards.map((award, index) => (
            <div key={index} className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

              {/* Left — navy panel */}
              <div className="flex flex-col justify-between p-8 md:p-10" style={{ background: NAVY }}>
                <div>
                  <span
                    className="inline-block text-xs font-semibold uppercase tracking-widest mb-5 px-3 py-1"
                    style={{ color: NAVY, background: GOLD, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.14em' }}
                  >
                    {award.organization}
                  </span>
                  <h3
                    className="font-serif font-bold mb-4 leading-tight"
                    style={{ color: GOLD_LIGHT, fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}
                  >
                    {award.title}
                  </h3>
                  <p
                    className="leading-relaxed mb-6"
                    style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Quicksand, sans-serif', fontSize: '0.95rem' }}
                  >
                    {award.description}
                  </p>
                </div>

                <div style={{ borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: '1.5rem' }}>
                  {[
                    { label: 'Recipient', value: award.recipient },
                    { label: 'Date', value: award.date },
                    { label: 'Location', value: award.location },
                    ...(award.presentedBy ? [{ label: 'Presented by', value: award.presentedBy }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3 mb-2">
                      <span
                        className="shrink-0 text-xs font-semibold uppercase tracking-wider w-[100px]"
                        style={{ color: GOLD, fontFamily: 'Quicksand, sans-serif', minWidth: 101, paddingTop: 2, letterSpacing: '0.1em' }}
                      >
                        {label}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Quicksand, sans-serif', fontSize: '0.88rem' }}>
                        {value}
                      </span>
                    </div>
                  ))}

                  {award.videoUrl && (
                    <a
                      href={award.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-5 font-semibold text-sm transition-opacity hover:opacity-80"
                      style={{ color: GOLD_LIGHT, fontFamily: 'Quicksand, sans-serif' }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Watch Ceremony
                    </a>
                  )}
                </div>
              </div>

              {/* Right — images */}
              <div className="flex flex-col" style={{ background: NAVY_MID }}>
                {award.certificateImage && (
                  <div
                    className="overflow-hidden flex-1 p-4"
                    style={{ border: `3px solid ${GOLD}40`, margin: 12 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- static export; images unoptimized */}
                    <img
                      src={award.certificateImage}
                      alt={`${award.title} Certificate`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                )}
                {award.images && award.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 p-3 pt-0">
                    {award.images.map((image, imgIndex) => (
                      <div key={imgIndex} className="overflow-hidden" style={{ height: 120 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- static export; images unoptimized */}
                        <img
                          src={image}
                          alt={`${award.title} - ${imgIndex + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

