import type { Metadata, Viewport } from 'next'
import EventDutiesPage from '@/components/pages/EventDutiesPage'

export const metadata: Metadata = {
  title: 'Event Day Duties',
  description: 'Team sign-up sheet for the Law Park Educational Trust 10-year celebration on 4 October 2026.',
  robots: { index: false, follow: false },
  manifest: '/event-duties.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'LPET Duties',
    statusBarStyle: 'default',
  },
}

export const viewport: Viewport = {
  themeColor: '#1c1c2e',
}

export default function EventDuties() {
  return <EventDutiesPage />
}
