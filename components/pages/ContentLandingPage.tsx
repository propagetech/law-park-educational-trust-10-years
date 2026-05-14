'use client'

import Link from 'next/link'
import Card from '../ui/Card'

function ContentLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Shareable Content
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready-to-use content for sharing with donors and on social media. Choose a category to view and copy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Link href="/content/magazine" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-lg">
            <Card className="p-8 h-full" hover>
              <div className="flex flex-col h-full">
                <div className="mb-4 text-4xl" aria-hidden>
                  📖
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900">
                  Magazine
                </h2>
                <p className="text-gray-600 flex-1 mb-6">
                  Print-ready A4 magazine for the 10-year anniversary. Open and export to PDF from the browser.
                </p>
                <span className="text-primary-600 font-semibold inline-flex items-center gap-2">
                  View magazine
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Card>
          </Link>

          <Link href="/content/award" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-lg">
            <Card className="p-8 h-full" hover>
              <div className="flex flex-col h-full">
                <div className="mb-4 text-4xl" aria-hidden>
                  🏆
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900">
                  Bharat Shiksha Ratan Award
                </h2>
                <p className="text-gray-600 flex-1 mb-6">
                  Social media and email content for sharing the Bharat Shiksha Ratan Award achievement across Instagram, Facebook, YouTube, and WhatsApp.
                </p>
                <span className="text-primary-600 font-semibold inline-flex items-center gap-2">
                  View content
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Card>
          </Link>

          <Link href="/content/donor-invite" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-lg">
            <Card className="p-8 h-full" hover>
              <div className="flex flex-col h-full">
                <div className="mb-4 text-4xl" aria-hidden>
                  💌
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900">
                  Donor Invite
                </h2>
                <p className="text-gray-600 flex-1 mb-6">
                  Sponsorship invite letter for the 10-year celebration event—bringing children to Bengaluru for the first time. Copy and share with donors.
                </p>
                <span className="text-primary-600 font-semibold inline-flex items-center gap-2">
                  View content
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Card>
          </Link>

          <Link href="/invite" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-lg">
            <Card className="p-8 h-full" hover>
              <div className="flex flex-col h-full">
                <div className="mb-4 text-4xl" aria-hidden>
                  🌐
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900">
                  Invite Webpage
                </h2>
                <p className="text-gray-600 flex-1 mb-6">
                  The live invite and fundraising page for the 10-year celebration. Share this link with donors.
                </p>
                <span className="text-primary-600 font-semibold inline-flex items-center gap-2">
                  View webpage
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Card>
          </Link>

          <Link href="/content/webpage" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-lg">
            <Card className="p-8 h-full" hover>
              <div className="flex flex-col h-full">
                <div className="mb-4 text-4xl" aria-hidden>
                  📋
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900">
                  Webpage Copy
                </h2>
                <p className="text-gray-600 flex-1 mb-6">
                  Ready-to-use copy for a standalone invite or fundraising webpage—hero, CTA, and donation link to paste elsewhere.
                </p>
                <span className="text-primary-600 font-semibold inline-flex items-center gap-2">
                  View content
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Card>
          </Link>

          <Link href="/content/event-plan" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 rounded-lg">
            <Card className="p-8 h-full" hover>
              <div className="flex flex-col h-full">
                <div className="mb-4 text-4xl" aria-hidden>
                  🎪
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900">
                  Event Day Plan
                </h2>
                <p className="text-gray-600 flex-1 mb-6">
                  High-level plan for the 10-year celebration event—programme flow, logistics checklist, and preparation timeline.
                </p>
                <span className="text-primary-600 font-semibold inline-flex items-center gap-2">
                  View plan
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ContentLandingPage
