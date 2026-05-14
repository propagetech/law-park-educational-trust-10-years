import Image from 'next/image'

export interface Testimonial {
  text: string
  author: string
  role: string
  image?: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
}

const NAVY = '#1c1c2e'
const GOLD = '#c9903e'
const GOLD_LIGHT = '#e0b06a'

export function Testimonials({ testimonials }: TestimonialsProps) {
  const displayTestimonials = testimonials.slice(0, 12)

  return (
    <section id="testimonials" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: 32, height: 2, background: GOLD, borderRadius: 1 }} />
              <span
                className="text-xs font-semibold uppercase"
                style={{ color: GOLD, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.2em' }}
              >
                Voices
              </span>
            </div>
            <h2
              className="font-serif font-bold"
              style={{ color: NAVY, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', lineHeight: 1.15 }}
            >
              In Their Own Words
            </h2>
          </div>
          <p
            className="text-gray-500 leading-relaxed"
            style={{ fontFamily: 'Quicksand, sans-serif', maxWidth: 360, fontSize: '0.95rem' }}
          >
            Donors, volunteers, and community members on what this work means to them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white flex flex-col relative p-6"
              style={{ borderBottom: `2px solid #fdf6ea`, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              {/* Decorative open-quote */}
              <div
                className="font-serif absolute top-3 left-5 leading-none select-none pointer-events-none"
                style={{ fontSize: '3.5rem', color: GOLD_LIGHT, opacity: 0.35, lineHeight: 1 }}
                aria-hidden="true"
              >
                &ldquo;
              </div>

              <p
                className="font-serif italic leading-relaxed flex-1 pt-6 pb-5"
                style={{ color: '#3a3a4a', fontSize: '0.95rem' }}
              >
                {testimonial.text}
              </p>

              {/* Gold bar citation + optional photo */}
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid #f0ece4` }}>
                {testimonial.image && (
                  <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-100 relative">
                    <Image
                      src={testimonial.image}
                      alt=""
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div style={{ width: 20, height: 2, background: GOLD, borderRadius: 1, flexShrink: 0 }} />
                <div className="min-w-0 flex-1">
                  <div
                    className="font-semibold text-sm"
                    style={{ color: NAVY, fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {testimonial.author}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: '#9a9aaa', fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
