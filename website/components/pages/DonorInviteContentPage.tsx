'use client'

import { useState } from 'react'
import Card from '../ui/Card'
import { DONATION_URL } from '@/data/constants'

const donorInviteFullLetter = `Dear Madam,

With all respect I introduce myself as Charulatha. M. R, Founder of Law Park Educational Trust, Bengaluru. We as a team are helping children across India for their education. We have been helping children residing in the rural sector, children of HIV patients, children of acid-attack victims, tribal children and many such children. We help these children by paying their school fees so no child under our care is left unschooled.

With tribal children, we stay with the children for a few days and we teach and learn many activities and finally distribute school essentials to these children.

We now want to create an opportunity for these little ones to meet and interact with you. Not everybody gets a chance to meet you, but we are putting our best efforts to organize an event where children from several districts come together and have their most treasured, memorable time with you. This will be their life achievement.

Thus on ________________ we would like to invite you to our 10 years of our noble service in the field of education for mankind and to organize an interaction session with children from rural and tribal areas, children of HIV patients and many children longing to meet you.

We will be immensely happy to receive you and our goal achieved in creating this event where little ones with extraordinary intelligence interact with you.

Thank You

Regards
Charulatha. M.R.
Representing our entire Law Park Educational Trust's Team.
+919945665379`

const donorInviteInstagramTitle = '💌 10 Years of Service – Help Us Bring Smiles to Children'
const donorInviteInstagramCaption = `We're completing 10 years of serving our Nation through Law Park Educational Trust! 🌟

We help children across India—rural, tribal, children of HIV patients and acid-attack survivors—by supporting their education so no child under our care is left unschooled.

This year we want to celebrate by bringing ALL the children under our care to Bengaluru: an event, a day tour, surprise gifts, and memories for a lifetime. For many, it will be their first time stepping out of their abode. 💫

We're excited but need sponsorship to make it happen. Your support can bring smiles and change lives.

🙏 We request your financial help for this noble cause. Together we can create a great change.

💝 Donate: ${DONATION_URL}

Contact: +919945665379
#LawParkEducationalTrust #10YearsOfService #EducationForAll #Sponsorship #DonateForEducation #Bengaluru #RuralEducation #NGOIndia #SupportChildren`

const donorInviteFacebookTitle = '10-Year Celebration – Sponsor Our Children\'s First Trip to Bengaluru'
const donorInviteFacebookContent = `Dear Friends and Supporters,

Law Park Educational Trust is completing 10 years of service to our Nation. We help children across India—in rural areas, tribal communities, and children of HIV patients and acid-attack survivors—by supporting their education so no child under our care is left unschooled.

To celebrate this milestone, we want to bring all the children under our care to Bengaluru: an event, a one-day educational tour, surprise gifts, and lasting memories. For many of these children, it will be their first time visiting Bengaluru—in fact, their first time stepping out of their abode.

We are happy and excited to make this happen, but finance is our only constraint. We request your sponsorship for this event. It will be heartwarming for all of us to bring smiles to these children, and together we can create a great change in their lives.

Hence we request your financial help for this noble cause. Awaiting a positive response from you.

💝 Donate: ${DONATION_URL}

Thank you.

Regards,
Charulatha M. R.
Representing Law Park Educational Trust's Team
+919945665379`

const donorInviteYoutubeTitle = '10-Year Celebration | Sponsor Children\'s First Trip to Bengaluru | Law Park Educational Trust'
const donorInviteYoutubeDescription = `Law Park Educational Trust is completing 10 years of service. We help children across India—rural, tribal, children of HIV patients and acid-attack survivors—through education support so no child under our care is left unschooled.

To celebrate, we want to bring all the children under our care to Bengaluru: an event, a one-day tour, surprise gifts, and memories for a lifetime. For many, it will be their first time visiting Bengaluru—their first time stepping out of their abode.

We need sponsorship to make this happen. Your support will bring smiles and create lasting change in these children's lives.

We request your financial help for this noble cause.

💝 Donate: ${DONATION_URL}

Contact: +919945665379

#LawParkEducationalTrust #10YearsOfService #EducationForAll #Sponsorship #DonateForEducation #Bengaluru #NGOIndia #SupportChildren`

const donorInviteWhatsappShort = `*10-Year Celebration – Sponsor Our Children's Trip to Bengaluru* 💌

Law Park Educational Trust is completing *10 years* of service. We help children across India with education support.

To celebrate, we want to bring *all children under our care* to Bengaluru—event, tour, gifts. For many, it will be their *first time* stepping out of their abode.

We need *sponsorship* to make it happen. Your support can bring smiles and change lives.

🙏 Requesting financial help for this noble cause.

💝 Donate: ${DONATION_URL}

Contact: +919945665379`

const donorInviteWhatsappLong = `*Dear Donor,* 💌

With all due respect I introduce myself as *Charulatha M. R*, Founder of *Law Park Educational Trust*, Bengaluru. Along with my husband *Mr. Manjunatha S. M* we started this Trust in 2012 (registered 2016). We, with like-minded individuals, are successfully carrying the trust forward.

Under our trust we help *children across India* with their education—rural sector, children of HIV patients, acid-attack victims, tribal children. We pay school fees so no child under our care is left unschooled.

*This year we complete 10 years* of service. To celebrate, we want *all children under our care* to visit Bengaluru: an event, one-day Bengaluru tour, surprise gifts. For many, it will be their *first time* visiting Bengaluru—first time stepping out of their abode.

We are happy and excited but *finance is our only constraint*. We request *sponsorship* for this event. It will be heartwarming to bring smiles to these children. Together we can create a great change.

Hence we request *financial help* for this noble cause. Awaiting a positive response from you.

💝 Donate: ${DONATION_URL}

Thank You

Regards
*Charulatha M. R.*
Representing Law Park Educational Trust's Team
+919945665379`

const donorInviteEmailSubjects = [
  '10-Year Celebration – Sponsor Our Children\'s First Trip to Bengaluru',
  'Request for Sponsorship: Law Park Educational Trust 10-Year Event',
  'Bring Smiles to Children – Support Our Bengaluru Celebration',
  'Your Support Can Change Lives: 10-Year Milestone Event',
]

function DonorInviteContentPage() {
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
            Donor Invite
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Invitation to our 10 years of noble service—interaction session with children from rural, tribal, and other communities
          </p>

          <Card className="p-6 bg-blue-50 border-2 border-blue-200 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-3 text-blue-900">📋 How to Use This Page</h3>
            <div className="text-left text-gray-700 space-y-2">
              <p><strong>Option 1 - Quick Copy:</strong> Click the &quot;Copy&quot; button next to any content section. The content will be copied to your clipboard instantly!</p>
              <p><strong>Option 2 - Manual Selection:</strong> You can also select and copy any text directly from the content boxes below.</p>
              <p className="text-sm text-gray-600 mt-3">💡 <strong>Tip:</strong> After clicking &quot;Copy&quot;, you&apos;ll see a confirmation message. Then simply paste (Ctrl+V / Cmd+V) into your email, social media, or messaging app!</p>
            </div>
          </Card>

          <div className="mt-6 flex justify-center">
            <a
              href={DONATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Donate here
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Invite Information */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-primary-50 to-primary-100">
          <h2 className="text-3xl font-bold mb-6 text-center">💌 Invite Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <span className="font-semibold">Occasion:</span> 10 years of noble service in the field of education for mankind
            </div>
            <div>
              <span className="font-semibold">From:</span> Charulatha M. R. (Founder)
            </div>
            <div>
              <span className="font-semibold">Organization:</span> Law Park Educational Trust, Bengaluru
            </div>
            <div>
              <span className="font-semibold">Ask:</span> Invitation to an interaction session with children
            </div>
            <div>
              <span className="font-semibold">Highlights:</span> Children from rural, tribal, HIV-affected and other communities; most treasured, memorable time
            </div>
            <div>
              <span className="font-semibold">Contact:</span> +919945665379
            </div>
          </div>
        </Card>

        {/* Full Letter */}
        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-3xl font-bold">📄 Full Letter (Invite to Dignitary)</h2>
            <button
              onClick={() => copyToClipboard(donorInviteFullLetter, 'full-letter')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                copiedId === 'full-letter'
                  ? 'bg-green-600 text-white'
                  : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
              }`}
            >
              {copiedId === 'full-letter' ? (
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
                  Copy letter
                </>
              )}
            </button>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap text-gray-700 leading-relaxed border-2 border-gray-200 select-all cursor-text hover:border-primary-300 transition-colors">
            {donorInviteFullLetter}
          </div>
        </Card>

        {/* Instagram Section */}
        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-3xl font-bold">📱 Instagram Post</h2>
            <div className="flex gap-3">
              <button
                onClick={() => copyToClipboard(donorInviteInstagramCaption, 'instagram')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  copiedId === 'instagram'
                    ? 'bg-green-600 text-white'
                    : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
                }`}
              >
                {copiedId === 'instagram' ? (
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
                    Copy Content
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Title/Headline:</h3>
              <div className="bg-primary-50 p-4 rounded-lg border-2 border-primary-200">
                <p className="text-lg font-bold text-primary-600 select-all">
                  {donorInviteInstagramTitle}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Caption:</h3>
              <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap text-gray-700 leading-relaxed border-2 border-gray-200 select-all cursor-text hover:border-primary-300 transition-colors">
                {donorInviteInstagramCaption}
              </div>
            </div>
          </div>
        </Card>

        {/* Facebook Section */}
        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-3xl font-bold">📘 Facebook Post</h2>
            <div className="flex gap-3">
              <button
                onClick={() => copyToClipboard(donorInviteFacebookContent, 'facebook')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  copiedId === 'facebook'
                    ? 'bg-green-600 text-white'
                    : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
                }`}
              >
                {copiedId === 'facebook' ? (
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
                    Copy Content
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Title:</h3>
              <div className="bg-primary-50 p-4 rounded-lg border-2 border-primary-200">
                <p className="text-lg font-bold text-primary-600 select-all">
                  {donorInviteFacebookTitle}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Post Content:</h3>
              <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap text-gray-700 leading-relaxed border-2 border-gray-200 select-all cursor-text hover:border-primary-300 transition-colors">
                {donorInviteFacebookContent}
              </div>
            </div>
          </div>
        </Card>

        {/* YouTube Section */}
        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-3xl font-bold">📺 YouTube Video</h2>
            <div className="flex gap-3">
              <button
                onClick={() => copyToClipboard(donorInviteYoutubeDescription, 'youtube')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  copiedId === 'youtube'
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg'
                }`}
              >
                {copiedId === 'youtube' ? (
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
                    Copy Description
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Video Title:</h3>
              <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                <p className="text-lg font-bold text-red-600 select-all">
                  {donorInviteYoutubeTitle}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Video Description:</h3>
              <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap text-gray-700 leading-relaxed text-sm border-2 border-gray-200 select-all cursor-text hover:border-red-300 transition-colors">
                {donorInviteYoutubeDescription}
              </div>
            </div>
          </div>
        </Card>

        {/* WhatsApp Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="text-2xl font-bold">💬 WhatsApp (Short)</h2>
              <button
                onClick={() => copyToClipboard(donorInviteWhatsappShort, 'whatsapp-short')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm ${
                  copiedId === 'whatsapp-short'
                    ? 'bg-green-700 text-white'
                    : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
                }`}
              >
                {copiedId === 'whatsapp-short' ? (
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
            <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap text-gray-700 leading-relaxed text-sm border-2 border-gray-200 select-all cursor-text hover:border-green-300 transition-colors">
              {donorInviteWhatsappShort}
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h2 className="text-2xl font-bold">💬 WhatsApp (Long)</h2>
              <button
                onClick={() => copyToClipboard(donorInviteWhatsappLong, 'whatsapp-long')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm ${
                  copiedId === 'whatsapp-long'
                    ? 'bg-green-700 text-white'
                    : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
                }`}
              >
                {copiedId === 'whatsapp-long' ? (
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
            <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap text-gray-700 leading-relaxed text-sm border-2 border-gray-200 select-all cursor-text hover:border-green-300 transition-colors">
              {donorInviteWhatsappLong}
            </div>
          </Card>
        </div>

        {/* Email Subject Lines */}
        <Card className="p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">📧 Email Subject Lines</h2>
          <div className="space-y-3">
            {donorInviteEmailSubjects.map((subject, index) => {
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
            <li><strong>Milestone:</strong> 10 years of noble service in the field of education for mankind</li>
            <li><strong>Reach:</strong> Children across India—rural, tribal, HIV-affected, acid-attack survivors</li>
            <li><strong>Impact:</strong> School fees and essentials so no child under our care is left unschooled</li>
            <li><strong>Event:</strong> Interaction session where children from several districts meet and interact with you</li>
            <li><strong>Opportunity:</strong> Most treasured, memorable time—their life achievement</li>
            <li><strong>Ask:</strong> Invitation to the event on the date to be filled</li>
            <li><strong>Closing:</strong> Immensely happy to receive you; goal achieved in creating this event</li>
          </ul>
        </Card>

        {/* Notes */}
        <Card className="p-8 bg-blue-50">
          <h2 className="text-3xl font-bold mb-6">📝 Notes for Content Creation</h2>
          <ul className="space-y-3 text-gray-700">
            <li><strong>Donate link:</strong> Share the donation page with donors: {DONATION_URL}</li>
            <li><strong>Personalise:</strong> When emailing donors, you can add a short personal note before the main letter.</li>
            <li><strong>Follow-up:</strong> Share event date and venue once confirmed; send a thank-you after the event to sponsors.</li>
            <li><strong>Images:</strong> Use photos of children, tribal visits, or previous events to make posts and emails more engaging.</li>
            <li><strong>Contact:</strong> Include phone number +919945665379 in all outreach so donors can respond easily.</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default DonorInviteContentPage
