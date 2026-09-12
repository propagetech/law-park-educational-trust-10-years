import Image from 'next/image'
import type { ChildStory } from '../../types'
import { childrenStories } from '../../data/childrenStories'

const NAVY = '#1c1c2e'
const GOLD = '#c9903e'
const CREAM = '#faf8f3'

export function ChildrenStories() {
  return (
    <section id="stories-of-the-children" style={{ background: CREAM }} className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">

        <div className="mb-14">
          <div className="flex items-center gap-3 mb-3">
            <div style={{ width: 32, height: 2, background: GOLD, borderRadius: 1 }} />
            <span
              className="text-xs font-semibold uppercase"
              style={{ color: GOLD, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.2em' }}
            >
              Impact
            </span>
          </div>
          <h2
            className="font-serif font-bold"
            style={{ color: NAVY, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', lineHeight: 1.15 }}
          >
            Stories of the Children
          </h2>
          <p
            className="mt-4 text-gray-600 leading-relaxed"
            style={{ fontFamily: 'Quicksand, sans-serif', maxWidth: 560, fontSize: '0.95rem' }}
          >
            Names have been withheld to protect privacy. These are real stories of children and families we support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {childrenStories.map((story, index) => (
            <StoryCard key={index} story={story} />
          ))}
        </div>

      </div>
    </section>
  )
}

function StoryCard({ story }: { story: ChildStory }) {
  return (
    <div
      className="p-6 bg-white overflow-hidden"
      style={{ borderLeft: `4px solid ${GOLD}`, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      <div className="flex gap-4">
        {story.image && (
          <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 relative rounded overflow-hidden bg-gray-100">
            <Image
              src={story.image}
              alt=""
              width={112}
              height={112}
              className="object-cover w-full h-full"
              sizes="112px"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: GOLD, fontFamily: 'Quicksand, sans-serif', letterSpacing: '0.1em' }}
            >
              Child
            </span>
            {story.gender && (
              <span
                className="text-xs text-gray-500"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                {story.gender}
              </span>
            )}
          </div>
          <p
            className="leading-relaxed"
            style={{ color: NAVY, fontFamily: 'Quicksand, sans-serif', fontSize: '0.9rem' }}
          >
            {story.summary}
          </p>
        </div>
      </div>
    </div>
  )
}
