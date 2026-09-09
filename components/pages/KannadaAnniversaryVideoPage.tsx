'use client'

import { useState } from 'react'
import Link from 'next/link'
import Card from '../ui/Card'
import { DONATION_URL } from '@/data/constants'

function KannadaAnniversaryVideoPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }).catch(() => {
      alert('Failed to copy. Please select and copy manually.')
    })
  }

  const youtubeCaption = `ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ · ಹತ್ತು ವರ್ಷ

ಕರ್ನಾಟಕದ ಹಳ್ಳಿ ಮತ್ತು ಬುಡಕಟ್ಟು ಶಾಲೆಗಳ ಮಕ್ಕಳಿಗೆ ವಿದ್ಯಾರ್ಥಿವೇತನ, ಶಾಲಾ ಚೀಲ, ಗ್ರಂಥಾಲಯ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ. 2016 ರಿಂದ.

ಒಂದು ಮಗು. ಒಂದು ವಿದ್ಯಾರ್ಥಿವೇತನ. ಸದ್ದಿಲ್ಲದೆ ಮುಂದುವರಿದ ಒಂದು ದಶಕ.

Law Park Educational Trust · 10 years
Supporting children's education in rural and tribal Karnataka.

Donate: ${DONATION_URL}
journey.lawparkeducationaltrust.org`

  const whatsappShare = `ನಮಸ್ಕಾರ,

ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್‌ನ ಹತ್ತು ವರ್ಷದ ಪ್ರಯಾಣವನ್ನು ಕನ್ನಡದಲ್ಲಿ ಹೇಳುವ ಸಣ್ಣ ಚಿತ್ರವಿದೆ (~5.5 ನಿಮಿಷ). ಹಳ್ಳಿ ಮತ್ತು ಬುಡಕಟ್ಟು ಶಾಲೆಗಳ ಮಕ್ಕಳ ಶಿಕ್ಷಣಕ್ಕೆ ನಾವು ಹೇಗೆ ನಿಲ್ಲುತ್ತೇವೆ ಎಂಬುದು.

ನೋಡಿ, ಹಂಚಿಕೊಳ್ಳಿ. ಸಾಧ್ಯವಾದರೆ ಒಂದು ಮಗುವಿನ ಹೆಸರನ್ನು ಸೂಚಿಸಿ ಅಥವಾ ಸ್ವಯಂಸೇವಕರಾಗಿ.

${DONATION_URL}

ಧನ್ಯವಾದಗಳು.
ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್`

  const eventAvNote = `Kannada anniversary film: hall playback

• File: 1080p EVENT master (H.264, stereo, burned-in Kannada subtitles)
• Loudness: −23 LUFS for hall PA (not the online −16 mix)
• Duration: about 5 min 38 s
• Play from a local file on the event laptop (not Drive / browser streaming)
• Test on the actual PA before the audience is seated
• Confirm 16:9 fullscreen, no player UI on the projected image

Consent gate: do not screen the warm cut with identifiable children until written guardian consent is on file. Use the face-free fallback master if guardian consent is still open.`

  const youtubeTitle = `ಲಾ ಪಾರ್ಕ್ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ · ಹತ್ತು ವರ್ಷ | Law Park Educational Trust · 10 Years`

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="mb-8">
          <Link
            href="/content"
            className="inline-flex items-center gap-2 text-primary-700 font-medium hover:text-primary-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Shareable Content
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Kannada Anniversary Video
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Five-and-a-half-minute Kannada film for the 10-year celebration: event projection, YouTube captions, and WhatsApp share text.
          </p>

          <Card className="p-6 bg-amber-50 border-2 border-amber-200 max-w-4xl mx-auto text-left">
            <h2 className="text-lg font-bold mb-2 text-amber-950">Before you publish or project</h2>
            <p className="text-gray-800 text-sm leading-relaxed">
              Guardian consent for identifiable children, Udayavani permission for the newspaper clip, and a music licence must be signed before any public screening or YouTube upload. Until then, use only the face-free event fallback for hall playback, and do not post the warm cut.
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <Card className="p-6">
            <p className="text-sm font-semibold text-primary-700 mb-1">Runtime</p>
            <p className="text-2xl font-bold text-gray-900">~5:38</p>
            <p className="text-sm text-gray-600 mt-1">Fits the 5 to 7 min slot in the event day plan</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-semibold text-primary-700 mb-1">Language</p>
            <p className="text-2xl font-bold text-gray-900">Kannada</p>
            <p className="text-sm text-gray-600 mt-1">Burned-in Kannada captions on the event master</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-semibold text-primary-700 mb-1">Hall audio</p>
            <p className="text-2xl font-bold text-gray-900">−23 LUFS</p>
            <p className="text-sm text-gray-600 mt-1">Stereo H.264 1080p for house projectors</p>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-6 bg-blue-50 border-2 border-blue-200">
            <h2 className="text-xl font-bold mb-3 text-blue-900">How to use this page</h2>
            <div className="text-gray-700 space-y-2 text-sm">
              <p><strong>Copy:</strong> use the button on each block, then paste into YouTube, WhatsApp, or your AV run sheet.</p>
              <p><strong>Event:</strong> the AV note is for the laptop operator on the day: local file only, test the PA early.</p>
              <p><strong>Related:</strong>{' '}
                <Link href="/content/event-plan" className="text-primary-700 font-semibold underline">
                  Event Day Plan
                </Link>
                {' '}lists where this film sits in the programme.
              </p>
            </div>
          </Card>

          <CopyBlock
            id="yt-title"
            title="YouTube title"
            text={youtubeTitle}
            copiedId={copiedId}
            onCopy={copyToClipboard}
          />
          <CopyBlock
            id="yt-desc"
            title="YouTube description / caption"
            text={youtubeCaption}
            copiedId={copiedId}
            onCopy={copyToClipboard}
          />
          <CopyBlock
            id="wa"
            title="WhatsApp share (Kannada)"
            text={whatsappShare}
            copiedId={copiedId}
            onCopy={copyToClipboard}
          />
          <CopyBlock
            id="av"
            title="Event AV run sheet"
            text={eventAvNote}
            copiedId={copiedId}
            onCopy={copyToClipboard}
          />

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-3 text-gray-900">Production pack (trustees / editors)</h2>
            <p className="text-gray-700 text-sm mb-4">
              Open the team handoff for the reference cut, feedback form, rights gates, and file list.
              Relative links from that page open the Kannada scripts, EDL, and research checklists.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/anniversary-video-production/kannada/team-handoff.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 font-semibold text-white hover:bg-primary-700"
              >
                Open team-handoff.html
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href={DONATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-primary-600 px-5 py-2.5 font-semibold text-primary-700 hover:bg-primary-50"
              >
                Donate
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Path: <code className="bg-gray-100 px-1.5 py-0.5 rounded">/anniversary-video-production/kannada/team-handoff.html</code>
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface CopyBlockProps {
  id: string
  title: string
  text: string
  copiedId: string | null
  onCopy: (text: string, id: string) => void
}

function CopyBlock({ id, title, text, copiedId, onCopy }: CopyBlockProps) {
  const isCopied = copiedId === id
  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <button
          type="button"
          onClick={() => onCopy(text, id)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          {isCopied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-white border border-gray-200 rounded-lg p-4 font-sans leading-relaxed">
        {text}
      </pre>
    </Card>
  )
}

export default KannadaAnniversaryVideoPage
