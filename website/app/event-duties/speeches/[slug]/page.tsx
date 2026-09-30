import type { Metadata, Viewport } from 'next'
import { SpeechView } from '@/components/event-duties/SpeechView'
import { SPEECHES } from '@/data/speeches'

// One page per speech, built ahead of time (static export).
export const dynamicParams = false

export function generateStaticParams() {
  return SPEECHES.map((s) => ({ slug: s.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const speech = SPEECHES.find((s) => s.slug === slug)!
  return {
    title: speech.title,
    description: `${speech.title} by ${speech.speakerFull}, for the Law Park Educational Trust 10-year celebration.`,
    robots: { index: false, follow: false },
    manifest: '/event-duties.webmanifest',
  }
}

export const viewport: Viewport = {
  themeColor: '#1c1c2e',
  viewportFit: 'cover',
}

export default async function SpeechPage({ params }: Props) {
  const { slug } = await params
  return <SpeechView slug={slug} />
}
