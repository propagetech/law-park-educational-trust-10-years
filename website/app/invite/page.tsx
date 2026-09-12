import type { Metadata } from 'next'
import InviteWebpage from '@/components/pages/InviteWebpage'

export const metadata: Metadata = {
  title: '10-Year Celebration – Sponsor Our Children\'s Trip to Bengaluru',
  description: 'Law Park Educational Trust is completing 10 years of service. Sponsor our celebration event and bring children to Bengaluru for the first time. Donate or get in touch.',
  openGraph: {
    title: '10-Year Celebration | Law Park Educational Trust',
    description: 'Sponsor our celebration event and bring children to Bengaluru for the first time.',
  },
}

export default function Invite() {
  return <InviteWebpage />
}
