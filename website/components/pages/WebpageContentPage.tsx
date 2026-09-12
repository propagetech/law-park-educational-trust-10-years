'use client'

import { useState } from 'react'
import Card from '../ui/Card'
import { DONATION_URL } from '@/data/constants'

const webpageHeroHeadline = '10 Years of Service – Help Us Bring Children to Bengaluru'
const webpageSubheadline = 'Sponsor our celebration event and give children their first trip to the city. Your support brings smiles and lasting change.'
const webpageAboutIntro = `Law Park Educational Trust is completing 10 years of service to our Nation. We help children across India—in rural areas, tribal communities, and children of HIV patients and acid-attack survivors—by supporting their education so no child under our care is left unschooled.

To celebrate this milestone, we want to bring all the children under our care to Bengaluru: an event, a one-day educational tour, surprise gifts, and lasting memories. For many of these children, it will be their first time visiting Bengaluru—in fact, their first time stepping out of their abode.

We need your sponsorship to make this happen. Your support will be heartwarming for all of us and will create a great change in these children's lives.`
const webpageKeyPoints = `• Law Park Educational Trust – 10 years of service to the Nation
• Supporting children across India: rural, tribal, HIV-affected, acid-attack survivors
• No child under our care left unschooled – we pay school fees and provide essentials
• Celebrating with a Bengaluru event: one-day tour, surprise gifts, memories for a lifetime
• For many children, this will be their first time visiting Bengaluru—first time stepping out of their abode
• We request sponsorship to make this event possible. Together we can create a great change.`
const webpageCtaBlock = `Your support can bring smiles and create lasting change in these children's lives. We request your financial help for this noble cause.

Donate here: ${DONATION_URL}

Or contact us: +919945665379 | lawparktrust@gmail.com`
const webpageFooterContact = `Charulatha M. R.
Founder, Law Park Educational Trust
Representing our entire Team
+919945665379`

const webpageEmailSubjects = [
  '10-Year Celebration – Sponsor Our Children\'s First Trip to Bengaluru',
  'Request for Sponsorship: Law Park Educational Trust 10-Year Event',
  'Bring Smiles to Children – Support Our Bengaluru Celebration',
  'Your Support Can Change Lives: 10-Year Milestone Event',
]

function CopyButton({
  onClick,
  copied,
  label = 'Copy',
}: {
  onClick: () => void
  copied: boolean
  label?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
        copied ? 'bg-green-600 text-white' : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
      }`}
    >
      {copied ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  )
}

function WebpageContentPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }).catch(() => {
      alert('Failed to copy. Please select and copy manually.')
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Webpage
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Ready-to-use copy for a standalone invite or fundraising webpage.
          </p>

          <Card className="p-6 bg-blue-50 border-2 border-blue-200 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-3 text-blue-900">📋 How to Use This Page</h3>
            <div className="text-left text-gray-700 space-y-2">
              <p><strong>Option 1 - Quick Copy:</strong> Click the &quot;Copy&quot; button next to any content section. The content will be copied to your clipboard instantly!</p>
              <p><strong>Option 2 - Manual Selection:</strong> You can also select and copy any text directly from the content boxes below.</p>
              <p className="text-sm text-gray-600 mt-3">💡 <strong>Tip:</strong> After clicking &quot;Copy&quot;, you&apos;ll see a confirmation message. Then simply paste (Ctrl+V / Cmd+V) into your webpage or editor!</p>
            </div>
          </Card>

          <div className="mt-6 flex justify-center">
            <a
              href={DONATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Donate
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Webpage Information */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-primary-50 to-primary-100">
          <h2 className="text-3xl font-bold mb-6 text-center">🌐 Webpage Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <span className="font-semibold">Occasion:</span> 10-year celebration of service
            </div>
            <div>
              <span className="font-semibold">From:</span> Charulatha M. R. (Founder)
            </div>
            <div>
              <span className="font-semibold">Organization:</span> Law Park Educational Trust, Bengaluru
            </div>
            <div>
              <span className="font-semibold">Ask:</span> Sponsorship for children&apos;s event and Bengaluru visit
            </div>
            <div>
              <span className="font-semibold">Highlights:</span> First-time Bengaluru visit for many children; event, tour, gifts
            </div>
            <div>
              <span className="font-semibold">Contact:</span> +919945665379
            </div>
          </div>
        </Card>

        {/* Hero / Headline */}
        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-3xl font-bold">Hero / Headline</h2>
            <CopyButton
              onClick={() => copyToClipboard(webpageHeroHeadline, 'hero')}
              copied={copiedId === 'hero'}
            />
          </div>
          <div className="bg-primary-50 p-4 rounded-lg border-2 border-primary-200">
            <p className="text-lg font-bold text-primary-600 select-all">{webpageHeroHeadline}</p>
          </div>
        </Card>

        {/* Subheadline */}
        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-3xl font-bold">Subheadline</h2>
            <CopyButton
              onClick={() => copyToClipboard(webpageSubheadline, 'subheadline')}
              copied={copiedId === 'subheadline'}
            />
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 select-all cursor-text hover:border-primary-300 transition-colors text-gray-700">
            {webpageSubheadline}
          </div>
        </Card>

        {/* About / Intro */}
        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-3xl font-bold">About / Intro</h2>
            <CopyButton
              onClick={() => copyToClipboard(webpageAboutIntro, 'about')}
              copied={copiedId === 'about'}
            />
          </div>
          <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap text-gray-700 leading-relaxed border-2 border-gray-200 select-all cursor-text hover:border-primary-300 transition-colors">
            {webpageAboutIntro}
          </div>
        </Card>

        {/* Key points */}
        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-3xl font-bold">Key Points</h2>
            <CopyButton
              onClick={() => copyToClipboard(webpageKeyPoints, 'keypoints')}
              copied={copiedId === 'keypoints'}
            />
          </div>
          <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap text-gray-700 leading-relaxed border-2 border-gray-200 select-all cursor-text hover:border-primary-300 transition-colors">
            {webpageKeyPoints}
          </div>
        </Card>

        {/* Call-to-action block */}
        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-3xl font-bold">Call-to-Action Block</h2>
            <div className="flex gap-3 flex-wrap">
              <CopyButton
                onClick={() => copyToClipboard(webpageCtaBlock, 'cta')}
                copied={copiedId === 'cta'}
              />
              <a
                href={DONATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Donate
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap text-gray-700 leading-relaxed border-2 border-gray-200 select-all cursor-text hover:border-primary-300 transition-colors">
            {webpageCtaBlock}
          </div>
        </Card>

        {/* Footer / Contact snippet */}
        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-3xl font-bold">Footer / Contact Snippet</h2>
            <CopyButton
              onClick={() => copyToClipboard(webpageFooterContact, 'footer')}
              copied={copiedId === 'footer'}
            />
          </div>
          <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap text-gray-700 leading-relaxed border-2 border-gray-200 select-all cursor-text hover:border-primary-300 transition-colors">
            {webpageFooterContact}
          </div>
        </Card>

        {/* Email Subject Lines */}
        <Card className="p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">📧 Email Subject Lines</h2>
          <div className="space-y-3">
            {webpageEmailSubjects.map((subject, index) => {
              const emailId = `email-${index}`
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-colors">
                  <span className="text-gray-700 select-all flex-1 mr-4">{subject}</span>
                  <button
                    onClick={() => copyToClipboard(subject, emailId)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm whitespace-nowrap ${
                      copiedId === emailId
                        ? 'bg-green-600 text-white'
                        : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
                    }`}
                  >
                    {copiedId === emailId ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Key Messages */}
        <Card className="p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">🎯 Key Messages to Emphasize</h2>
          <ul className="space-y-3 list-disc list-inside text-gray-700">
            <li><strong>Milestone:</strong> 10 years of service to the Nation</li>
            <li><strong>Reach:</strong> Children across India—rural, tribal, HIV-affected, acid-attack survivors</li>
            <li><strong>Impact:</strong> School fees and essentials so no child under our care is left unschooled</li>
            <li><strong>Celebration:</strong> Bringing all children to Bengaluru—event, tour, gifts</li>
            <li><strong>First time:</strong> For many, first time visiting Bengaluru and stepping out of their abode</li>
            <li><strong>Ask:</strong> Sponsorship to make the event possible</li>
            <li><strong>Call to action:</strong> Donate or contact for sponsorship; link to donation page</li>
          </ul>
        </Card>

        {/* Notes */}
        <Card className="p-8 bg-blue-50">
          <h2 className="text-3xl font-bold mb-6">📝 Notes for Content Creation</h2>
          <ul className="space-y-3 text-gray-700">
            <li><strong>Donate button:</strong> Add a Donate button or link pointing to {DONATION_URL} so visitors can give in one click.</li>
            <li><strong>Event date:</strong> Add the event date and venue once confirmed.</li>
            <li><strong>Contact:</strong> Include phone +919945665379 and email lawparktrust@gmail.com for sponsorship inquiries.</li>
            <li><strong>Images:</strong> Use photos of children, tribal visits, or previous events to make the webpage more engaging.</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default WebpageContentPage
