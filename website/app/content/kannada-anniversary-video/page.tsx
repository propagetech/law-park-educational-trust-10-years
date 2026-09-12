import type { Metadata } from 'next'
import KannadaAnniversaryVideoPage from '@/components/pages/KannadaAnniversaryVideoPage'

export const metadata: Metadata = {
  title: 'Kannada Anniversary Video',
  description:
    'Shareable captions and event playback notes for Law Park Educational Trust Kannada 10-year anniversary film.',
  openGraph: {
    title: 'Kannada Anniversary Video | Law Park Educational Trust',
    description:
      'YouTube and WhatsApp copy, plus hall AV notes for the Kannada 10-year film.',
  },
}

export default function KannadaAnniversaryVideoRoute() {
  return <KannadaAnniversaryVideoPage />
}
