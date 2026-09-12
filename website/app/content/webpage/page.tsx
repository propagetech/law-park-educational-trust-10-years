import type { Metadata } from 'next'
import WebpageContentPage from '@/components/pages/WebpageContentPage'

export const metadata: Metadata = {
  title: 'Webpage',
  description: 'Ready-to-use copy for a standalone invite or fundraising webpage for the 10-year celebration. Hero, CTA, and donation link included.',
  openGraph: {
    title: 'Webpage | Law Park Educational Trust',
    description: 'Ready-to-use copy for a standalone invite or fundraising webpage.',
  },
}

export default function WebpageContent() {
  return <WebpageContentPage />
}
