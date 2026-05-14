import type { Metadata } from 'next'
import ContentLandingPage from '@/components/pages/ContentLandingPage'

export const metadata: Metadata = {
  title: 'Shareable Content',
  description: 'Ready-to-use content for the Trust: Bharat Shiksha Ratan Award social media content and Donor Invite letter for the 10-year celebration.',
  openGraph: {
    title: 'Shareable Content | Law Park Educational Trust',
    description: 'Ready-to-use content for the Trust: Award social media content and Donor Invite letter.',
  },
}

export default function Content() {
  return <ContentLandingPage />
}
