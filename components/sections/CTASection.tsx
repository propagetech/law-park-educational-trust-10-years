import Image from 'next/image'

const NAVY = '#1c1c2e'
const GOLD = '#c9903e'
const GOLD_LIGHT = '#e0b06a'

function CTASection() {
  return (
    <section id="get-involved" style={{ background: NAVY }} className="py-20 sm:py-28 relative overflow-hidden">

      {/* Subtle gold grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${GOLD}18 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
      <div className="flex items-center gap-3 mb-4">
              <div style={{ width: 32, height: 2, background: GOLD, borderRadius: 1 }} />
              <span
                className="text-xs font-semibold uppercase"
                style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.2em' }}
              >
                Walk With Us
              </span>
            </div>
        {/* Three columns on lg: message | action cards | contact */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr] gap-12 lg:gap-16 items-start">

          {/* Left — message */}
          <div>
            
            <h2
              className="font-serif font-bold text-white mb-5 leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
            >
              Ten years in,<br />
              <span style={{ color: GOLD_LIGHT }}>the work continues.</span>
            </h2>
            <p
              className="leading-relaxed mb-3"
              style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Quicksand, sans-serif', fontSize: '1rem', maxWidth: 440 }}
            >
              Every child we&apos;ve supported was found because someone cared enough to reach out. If you know a child who needs help, tell us. If you can give your time, we welcome you. If you want to be part of this story, there&apos;s a place for you here.
            </p>

            <p
              className="font-serif italic"
              style={{ color: GOLD_LIGHT, fontSize: '1rem', marginTop: '1.5rem' }}
            >
              &quot;When it comes to education, no child deserves to be left behind.&quot;
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div style={{ width: 16, height: 1.5, background: GOLD, borderRadius: 1 }} />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Quicksand, sans-serif', fontSize: '0.72rem', letterSpacing: '0.1em' }}>
                Charulatha M. R., Founder
              </span>
            </div>
          </div>

          {/* Middle — action cards */}
          <div className="flex flex-col gap-5">
            {[
              {
                href: 'mailto:lawparktrust@gmail.com?subject=Child%20Nomination',
                label: 'Nominate a Child',
                sub: 'Know a child in a rural school who needs support? Tell us.',
                primary: true,
              },
              {
                href: 'mailto:lawparktrust@gmail.com?subject=Volunteer%20Inquiry',
                label: 'Volunteer',
                sub: 'Give your time, skills, or expertise to our programmes.',
                primary: false,
              },
              {
                href: 'mailto:lawparktrust@gmail.com?subject=Partnership%20Inquiry',
                label: 'Partner With Us',
                sub: 'CSR programmes, supply drives, and joint events welcome.',
                primary: false,
              },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center justify-between gap-4 px-6 py-4 rounded-lg transition-opacity hover:opacity-90"
                style={
                  action.primary
                    ? { background: GOLD }
                    : { background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.12)` }
                }
              >
                <div>
                  <div
                    className="font-semibold text-sm"
                    style={{ color: action.primary ? '#fff' : 'rgba(255,255,255,0.9)', fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {action.label}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: action.primary ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)', fontFamily: 'Quicksand, sans-serif' }}
                  >
                    {action.sub}
                  </div>
                </div>
                <span style={{ color: action.primary ? '#fff' : GOLD_LIGHT, fontSize: '1.1rem' }}>→</span>
              </a>
            ))}
          </div>

          {/* Right — contact and support */}
          <div
            className="text-xs flex flex-col gap-5 pt-6 lg:pt-0 border-t border-white/10 lg:border-t-0"
            style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Quicksand, sans-serif' }}
          >
            {/* <div>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Email</span>
              <a href="mailto:lawparktrust@gmail.com" className="text-white hover:underline">lawparktrust@gmail.com</a>
            </div> */}
            <div>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Support</span>
              <a href="https://razorpay.me/@lawparkeducationaltrust" target="_blank" rel="noopener noreferrer" className="text-white hover:underline block break-all">
                razorpay.me/@lawparkeducationaltrust
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600, display: 'block' }}>Scan to support (UPI)</span>
              <div className="bg-white rounded-lg p-2 w-[200px] aspect-square flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/mhaks.16@oksbi.jpg"
                  alt="Scan to support with any UPI app — Law Park Educational Trust"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>UPI ID: mhaks.16@oksbi</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default CTASection
