import type { Metadata, Viewport } from 'next'
import { GuestProfile } from '@/components/event-duties/GuestProfile'
import { CHIEF_GUESTS } from '@/data/chiefGuests'

// One page per chief guest, built ahead of time (static export).
export const dynamicParams = false

export function generateStaticParams() {
  return CHIEF_GUESTS.map((g) => ({ slug: g.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guest = CHIEF_GUESTS.find((g) => g.slug === slug)!
  return {
    title: guest.short,
    description: `${guest.name}, ${guest.role}. Chief guest at the Law Park Educational Trust 10-year celebration, 4 October 2026.`,
    robots: { index: false, follow: false },
    manifest: '/event-duties.webmanifest',
  }
}

export const viewport: Viewport = {
  themeColor: '#1c1c2e',
  viewportFit: 'cover',
}

export default async function GuestPage({ params }: Props) {
  const { slug } = await params
  return <GuestProfile slug={slug} />
}
