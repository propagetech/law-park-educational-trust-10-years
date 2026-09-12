import type { Metadata } from 'next'
import DonorInviteContentPage from '@/components/pages/DonorInviteContentPage'

export const metadata: Metadata = {
  title: 'Donor Invite',
  description: 'Sponsorship invite letter for Law Park Educational Trust 10-year celebration—bringing children to Bengaluru. Copy and share with donors.',
  openGraph: {
    title: 'Donor Invite | Law Park Educational Trust',
    description: 'Sponsorship invite for the 10-year celebration event. Copy and share with donors.',
  },
}

export default function DonorInvite() {
  return <DonorInviteContentPage />
}
