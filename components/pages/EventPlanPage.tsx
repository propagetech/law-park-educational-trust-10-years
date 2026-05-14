'use client'

import Card from '../ui/Card'

const NAVY = '#1c1c2e'
const GOLD = '#c9903e'

const programmeFlow = [
  {
    time: '~30 min',
    title: 'Welcome & Lamp Lighting',
    details: 'Traditional lamp lighting ceremony with trustees, chief guest, and selected children on stage.',
  },
  {
    time: '5–7 min',
    title: 'About Law Park Educational Trust',
    details: 'Short video or talk covering the 10-year journey — can draw from the anniversary magazine content.',
  },
  {
    time: '20–30 min',
    title: 'Children\'s Cultural Programme',
    details: 'Songs, a short skit on "right to education", and performances by children from the trust\'s schools.',
  },
  {
    time: '30–40 min',
    title: 'Chief Guest Address & Interaction',
    details: 'Chief guest (Sudha Murty, if confirmed) speaks and interacts with selected children on stage.',
  },
  {
    time: '15–20 min',
    title: 'Felicitation & Magazine Launch',
    details: 'Launch of the 10-year anniversary magazine. Highlight the Bharat Shiksha Ratan Award. Felicitate key supporters.',
  },
  {
    time: '10–15 min',
    title: 'Donor & Volunteer Recognition',
    details: 'Recognise donors, volunteers, and partner NGOs by name. Keep it warm and personal — no generic lists.',
  },
  {
    time: '5 min',
    title: 'Vote of Thanks',
    details: 'Closing remarks by the founder, Charulatha M.R.',
  },
]

const logistics = [
  {
    category: 'Chief Guest',
    items: [
      'Confirm Sudha Murty\'s availability via formal letter',
      'Follow up with her office for scheduling',
      'Prepare a brief on Law Park for her team',
      'Have a backup plan if availability doesn\'t work out',
    ],
  },
  {
    category: 'Children\'s Travel & Stay',
    items: [
      'Arrange transport from rural areas (prioritise safety)',
      'Plan first-time city visit experience — this is special for them',
      'Coordinate with schools and families for permissions',
      'Organise accommodation if overnight stay is needed',
      'Assign volunteer chaperones for each group',
    ],
  },
  {
    category: 'Venue & Stage',
    items: [
      'Book venue in Bengaluru (capacity for children + donors + volunteers + media)',
      'Simple stage design with 10-year journey timeline and student photos from gallery',
      'Audio/visual setup for video playback and mic for speakers',
      'Seating plan: children in front, donors/volunteers, media section',
    ],
  },
  {
    category: 'Print & Invitations',
    items: [
      'Print anniversary magazine — small run for guests (use template-06 PDF)',
      'Design and print invitation cards',
      'Send invitations at least 1–2 weeks before the event',
      'Digital invite via WhatsApp/email for wider reach',
    ],
  },
  {
    category: 'On the Day',
    items: [
      'Registration desk with volunteer sign-in',
      'Refreshments for children and guests',
      'Photographer / videographer for documentation',
      'Copies of the magazine at each seat or as a takeaway',
      'Thank-you notes or small mementos for donors',
    ],
  },
]

function EventPlanPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Event Day Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            High-level plan for the 10-year celebration event in Bengaluru — programme flow, logistics, and preparation checklist.
          </p>
        </div>

        {/* Objectives */}
        <Card className="p-8 mb-8" style={{ borderTop: `4px solid ${GOLD}` }}>
          <h2 className="text-2xl font-bold mb-5" style={{ color: NAVY }}>
            Event Objectives
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="mt-1 shrink-0 w-2 h-2 rounded-full" style={{ background: GOLD }} />
              Celebrate 10 years of Law Park Educational Trust
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 shrink-0 w-2 h-2 rounded-full" style={{ background: GOLD }} />
              Thank donors, volunteers, and partner organisations
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 shrink-0 w-2 h-2 rounded-full" style={{ background: GOLD }} />
              Inspire children through interaction with the chief guest (Sudha Murty)
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 shrink-0 w-2 h-2 rounded-full" style={{ background: GOLD }} />
              Showcase the 10-year journey and the Bharat Shiksha Ratan Award
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 shrink-0 w-2 h-2 rounded-full" style={{ background: GOLD }} />
              Launch the anniversary magazine
            </li>
          </ul>
        </Card>

        {/* Format & Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: NAVY }}>Format</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Duration:</strong> Half-day or 3–4 hour programme</p>
              <p><strong>Location:</strong> Bengaluru</p>
              <p><strong>Style:</strong> Warm celebration — not a formal gala. Children should feel at home.</p>
            </div>
          </Card>
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: NAVY }}>Audience</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Children from villages and rural schools (trust beneficiaries)</li>
              <li>Local students</li>
              <li>Donors and supporters</li>
              <li>Volunteers and team members</li>
              <li>Partner NGOs</li>
              <li>Media (if possible)</li>
            </ul>
          </Card>
        </div>

        {/* Programme Flow */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: NAVY }}>
            Programme Flow (Tentative)
          </h2>
          <div className="space-y-0">
            {programmeFlow.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 relative"
              >
                {/* Timeline spine */}
                <div className="flex flex-col items-center shrink-0" style={{ width: 24 }}>
                  <div
                    className="w-3 h-3 rounded-full shrink-0 mt-1.5 z-10"
                    style={{ background: GOLD }}
                  />
                  {index < programmeFlow.length - 1 && (
                    <div className="w-px flex-1" style={{ background: '#e5e7eb' }} />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8 flex-1">
                  <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                    <h3 className="font-bold text-lg" style={{ color: NAVY }}>
                      {item.title}
                    </h3>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: '#fdf6ea', color: GOLD }}
                    >
                      {item.time}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Logistics & Preparation */}
        <h2 className="text-2xl font-bold mb-6" style={{ color: NAVY }}>
          Logistics & Preparation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {logistics.map((section, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-bold text-lg mb-4" style={{ color: NAVY }}>
                {section.category}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                    <span
                      className="mt-1.5 shrink-0 w-4 h-4 rounded flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: GOLD, fontSize: '0.6rem' }}
                    >
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Notes */}
        <Card className="p-8 mb-8" style={{ background: '#fdf6ea' }}>
          <h2 className="text-2xl font-bold mb-4" style={{ color: NAVY }}>
            Notes
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li>
              <strong>Magazine:</strong> Use template-06 for the print run — export to PDF from Chrome (File &rarr; Print &rarr; Save as PDF).
            </li>
            <li>
              <strong>Stage design:</strong> Keep it simple — journey timeline banner and student photos from the existing gallery. Navy + gold + cream palette.
            </li>
            <li>
              <strong>Children first:</strong> The event should feel like a celebration <em>for</em> the children, not a donor showcase. Seating, food, and schedule should prioritise their comfort.
            </li>
            <li>
              <strong>No hard sell:</strong> Consistent with the trust&apos;s approach — no donation ask from stage. Razorpay link can be on printed materials as a quiet contact detail.
            </li>
          </ul>
        </Card>

      </div>
    </div>
  )
}

export default EventPlanPage
