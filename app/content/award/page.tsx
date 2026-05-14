import type { Metadata } from 'next'
import SocialMediaContentPage from '@/components/pages/SocialMediaContentPage'

export const metadata: Metadata = {
  title: 'Bharat Shiksha Ratan Award',
  description: 'Ready-to-use content for sharing the Bharat Shiksha Ratan Award achievement across Instagram, Facebook, YouTube, and WhatsApp.',
  openGraph: {
    title: 'Bharat Shiksha Ratan Award | Law Park Educational Trust',
    description: 'Ready-to-use content for sharing the Bharat Shiksha Ratan Award achievement.',
  },
}

export default function AwardContent() {
  return <SocialMediaContentPage />
}
