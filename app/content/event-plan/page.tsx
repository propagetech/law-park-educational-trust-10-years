import type { Metadata } from 'next'
import EventPlanPage from '@/components/pages/EventPlanPage'

export const metadata: Metadata = {
  title: 'Event Day Plan',
  description: 'High-level plan for the Law Park Educational Trust 10-year celebration event—programme flow, logistics, and preparation checklist.',
  openGraph: {
    title: 'Event Day Plan | Law Park Educational Trust',
    description: 'Programme flow, logistics checklist, and preparation timeline for the 10-year celebration.',
  },
}

export default function EventPlan() {
  return <EventPlanPage />
}
