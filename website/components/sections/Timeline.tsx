'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { milestones } from '../../data/milestones'
import type { Milestone } from '../../types'
import { getImageSources } from '../../utils/image'

// Create a flat list of all images across all milestones
function getAllImages() {
  const allImages: Array<{ milestone: Milestone; imageIndex: number; globalIndex: number }> = []
  let globalIndex = 0

  milestones.forEach((milestone) => {
    milestone.images.forEach((_, imageIndex) => {
      allImages.push({ milestone, imageIndex, globalIndex })
      globalIndex++
    })
  })

  return allImages
}

// ——— Travel-magazine spread: one column = hero image, other = editorial (year, title, copy, gallery) ———

interface SpreadImageBlockProps {
  milestone: Milestone
  featuredImage: string | undefined
  openLightbox: (milestone: Milestone, index: number) => void
  getImageSources: typeof getImageSources
}

function SpreadImageBlock({ milestone, featuredImage, openLightbox, getImageSources }: SpreadImageBlockProps) {
  if (!featuredImage) return null
  return (
    <button
      type="button"
      onClick={() => openLightbox(milestone, 0)}
      className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100 sm:aspect-[3/2] md:min-h-[320px] md:aspect-auto"
      aria-label={`View ${milestone.title} photos`}
    >
      <picture>
        <source srcSet={getImageSources(`images/${featuredImage}`).webp} type="image/webp" />
        <img
          src={getImageSources(`images/${featuredImage}`).fallback}
          alt={milestone.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 text-left sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
          {milestone.year}
        </p>
        <p className="mt-1 text-lg font-semibold text-white sm:text-xl">
          {milestone.title}
        </p>
        {milestone.location && (
          <p className="mt-0.5 text-sm text-white/80">
            {milestone.location}
          </p>
        )}
      </div>
    </button>
  )
}

interface SpreadEditorialBlockProps {
  milestone: Milestone
  openLightbox: (milestone: Milestone, index: number) => void
  getImageSources: typeof getImageSources
}

function SpreadEditorialBlock({ milestone, openLightbox, getImageSources }: SpreadEditorialBlockProps) {
  return (
    <div className="flex flex-col justify-center px-0 py-4 md:py-6 md:pl-8 lg:pl-10">
      <span className="font-serif text-6xl font-bold tabular-nums text-primary-200 md:text-7xl lg:text-8xl">
        {milestone.year}
      </span>
      <h3 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {milestone.title}
      </h3>
      {milestone.location && (
        <p className="mt-1 text-sm font-medium uppercase tracking-wider text-primary-600">
          {milestone.location}
        </p>
      )}
      <p className="mt-4 font-serif text-gray-700 leading-relaxed">
        {milestone.description}
      </p>
      {milestone.impact && (
        <div
          className="mt-5 flex items-start gap-3 px-4 py-3"
          style={{ background: '#1c1c2e', borderLeft: '3px solid #c9903e' }}
        >
          <span
            className="font-serif italic leading-snug"
            style={{ color: '#e0b06a', fontSize: '0.88rem' }}
          >
            {milestone.impact}
          </span>
        </div>
      )}
      {milestone.images.length > 1 && (
        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Gallery — {milestone.images.length} photos
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {milestone.images.slice(0, 6).map((image, imgIndex) => (
              <button
                key={imgIndex}
                type="button"
                onClick={() => openLightbox(milestone, imgIndex)}
                className="group relative aspect-square overflow-hidden rounded-md"
                aria-label={`View ${milestone.title} - Image ${imgIndex + 1}`}
              >
                <picture>
                  <source srcSet={getImageSources(`images/${image}`).webp} type="image/webp" />
                  <img
                    src={getImageSources(`images/${image}`).fallback}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                    loading="lazy"
                  />
                </picture>
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/25" />
              </button>
            ))}
            {milestone.images.length > 6 && (
              <button
                type="button"
                onClick={() => openLightbox(milestone, 0)}
                className="flex aspect-square items-center justify-center rounded-md bg-primary-600 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                aria-label={`View all ${milestone.images.length} photos`}
              >
                +{milestone.images.length - 6}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Timeline() {
  const [selectedImage, setSelectedImage] = useState<{ milestone: Milestone; index: number; globalIndex: number } | null>(null)
  const [showIntro, setShowIntro] = useState(false)
  const allImages = useMemo(() => getAllImages(), [])

  function openLightbox(milestone: Milestone, index: number) {
    const globalIndex = allImages.findIndex(
      (img) => img.milestone === milestone && img.imageIndex === index
    )
    setSelectedImage({ milestone, index, globalIndex })
    setShowIntro(false)
  }

  const closeLightbox = useCallback(() => {
    if (introTimeoutRef.current) {
      clearTimeout(introTimeoutRef.current)
      introTimeoutRef.current = null
    }
    setSelectedImage(null)
    setShowIntro(false)
  }, [])

  const introTimeoutRef = useRef<number | null>(null)

  // Helper function to clear timeout
  function clearIntroTimeout() {
    const timeoutId = introTimeoutRef.current
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId)
    }
    // Reset ref after clearing - using a separate statement to avoid linter issues
    const ref = introTimeoutRef
    ref.current = null
  }

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    // Clear any pending intro timeout
    clearIntroTimeout()

    setSelectedImage((current) => {
      if (!current) return null

      // If intro is showing and going forward, navigate to first image of current milestone
      if (showIntro && direction === 'next') {
        const firstImageIndex = allImages.findIndex(
          (img) => img.milestone === current.milestone && img.imageIndex === 0
        )
        if (firstImageIndex !== -1) {
          setShowIntro(false)
          return {
            milestone: current.milestone,
            index: 0,
            globalIndex: firstImageIndex,
          }
        }
      }

      // If intro is showing and going backward, go to previous year's last image
      if (showIntro && direction === 'prev') {
        // Find previous year
        const currentYearIndex = milestones.findIndex(m => m.year === current.milestone.year)
        if (currentYearIndex > 0) {
          const prevMilestone = milestones[currentYearIndex - 1]
          const lastImageIndex = prevMilestone.images.length - 1
          const globalIndex = allImages.findIndex(
            (img) => img.milestone === prevMilestone && img.imageIndex === lastImageIndex
          )
          if (globalIndex !== -1) {
            setShowIntro(false)
            return {
              milestone: prevMilestone,
              index: lastImageIndex,
              globalIndex: globalIndex,
            }
          }
        }
        // If no previous year, go to last image overall
        const lastImage = allImages[allImages.length - 1]
        setShowIntro(false)
        return {
          milestone: lastImage.milestone,
          index: lastImage.imageIndex,
          globalIndex: allImages.length - 1,
        }
      }

      const { globalIndex, milestone } = current
      let newGlobalIndex: number

      if (direction === 'prev') {
        newGlobalIndex = globalIndex === 0 ? allImages.length - 1 : globalIndex - 1
      } else {
        newGlobalIndex = globalIndex === allImages.length - 1 ? 0 : globalIndex + 1
      }

      const newImage = allImages[newGlobalIndex]
      
      // Check if we're switching to a different year
      if (newImage.milestone.year !== milestone.year) {
        // Show intro slide for the new year
        setShowIntro(true)
        return {
          milestone: newImage.milestone,
          index: newImage.imageIndex,
          globalIndex: newGlobalIndex,
        }
      }

      // Same year, just navigate to image
      setShowIntro(false)
      return {
        milestone: newImage.milestone,
        index: newImage.imageIndex,
        globalIndex: newGlobalIndex,
      }
    })
  }, [allImages, showIntro])

  // Keyboard navigation
  useEffect(() => {
    if (selectedImage === null) return

    function handleKeyDown(e: KeyboardEvent) {
      // Always allow arrow keys to navigate, even when intro is showing
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        e.stopPropagation()
        navigateImage('prev')
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        e.stopPropagation()
        navigateImage('next')
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        closeLightbox()
        return
      }
      if (showIntro && (e.key === 'Enter' || e.key === ' ')) {
        // Allow Enter or Space to go to first image from intro slide
        e.preventDefault()
        e.stopPropagation()
        navigateImage('next')
      }
    }

    window.addEventListener('keydown', handleKeyDown, true) // Use capture phase
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      if (introTimeoutRef.current) {
        window.clearTimeout(introTimeoutRef.current)
      }
    }
  }, [selectedImage, navigateImage, closeLightbox, showIntro])

  return (
    <>
      <section id="journey" className="bg-white py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our 10-Year Journey
            </h2>
            <p className="mt-4 font-serif text-lg italic text-gray-600">
              From our first scholarship in 2016 to supporting 550+ students across Karnataka.
            </p>
          </div>

          {/* Travel-magazine spread: each row = image | editorial, alternating */}
          <div className="mt-14 md:mt-20">
            {milestones.map((milestone, index) => {
              const isEven = index % 2 === 0
              const featuredImage = milestone.images[0]
              const isFirst = index === 0
              const isLast = index === milestones.length - 1
              const rounding =
                isFirst && isLast
                  ? 'rounded-xl'
                  : isFirst
                    ? 'rounded-t-xl'
                    : isLast
                      ? 'rounded-b-xl'
                      : 'rounded-none'
              return (
                <div
                  key={milestone.year}
                  id={`year-${milestone.year}`}
                  className={`scroll-mt-24 ${rounding} px-2 py-10 sm:px-4 md:py-14 md:px-6 lg:py-16 ${
                    index > 0 ? 'mt-16 border-t border-gray-200/80 md:mt-20' : ''
                  } ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/80 md:bg-primary-50/40'
                  }`}
                >
                  <article
                    className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 md:items-stretch lg:gap-16"
                  >
                  {isEven ? (
                    <>
                      <SpreadImageBlock
                        milestone={milestone}
                        featuredImage={featuredImage}
                        openLightbox={openLightbox}
                        getImageSources={getImageSources}
                      />
                      <SpreadEditorialBlock
                        milestone={milestone}
                        openLightbox={openLightbox}
                        getImageSources={getImageSources}
                      />
                    </>
                  ) : (
                    <>
                      <div className="order-2 md:order-1">
                        <SpreadEditorialBlock
                          milestone={milestone}
                          openLightbox={openLightbox}
                          getImageSources={getImageSources}
                        />
                      </div>
                      <div className="order-1 md:order-2">
                        <SpreadImageBlock
                          milestone={milestone}
                          featuredImage={featuredImage}
                          openLightbox={openLightbox}
                          getImageSources={getImageSources}
                        />
                      </div>
                    </>
                  )}
                  </article>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 pb-8 md:pb-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close lightbox"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Desktop: Side navigation buttons - always visible for cross-year navigation */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('prev')
            }}
            className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white md:block"
            aria-label="Previous image"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('next')
            }}
            className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white md:block"
            aria-label="Next image"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Year Intro Slide - Shows as a separate slide when switching to a new year */}
          {showIntro && selectedImage ? (
            <div
              className="flex max-h-[calc(100vh-180px)] max-w-4xl flex-col items-center justify-center px-6 py-8 md:max-h-[calc(100vh-120px)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full rounded-2xl bg-gradient-to-br from-primary-50 to-white p-8 shadow-2xl">
                <div className="mb-6 text-center">
                  <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-600 text-3xl font-bold text-white shadow-xl">
                    {selectedImage.milestone.year}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                    {selectedImage.milestone.title}
                  </h3>
                  {selectedImage.milestone.location && (
                    <p className="mt-3 text-lg font-medium text-primary-600">
                      📍 {selectedImage.milestone.location}
                    </p>
                  )}
                </div>
                
                <div className="mx-auto max-w-2xl">
                  <p className="mb-6 text-center text-lg leading-relaxed text-gray-700">
                    {selectedImage.milestone.description}
                  </p>
                  
                  {selectedImage.milestone.impact && (
                    <div className="mb-6 flex justify-center">
                      <div className="inline-flex items-center rounded-full bg-primary-100 px-6 py-3">
                        <span className="text-base font-semibold text-primary-700">
                          ✨ Impact: {selectedImage.milestone.impact}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                      Press → or click next to view photos from {selectedImage.milestone.year}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Image container - Only show when not showing intro */
            <div
              className="flex max-h-[calc(100vh-240px)] max-w-full flex-col items-center justify-center md:max-h-[calc(100vh-180px)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              {selectedImage && (
                <picture className="flex max-h-full items-center justify-center">
                  <source srcSet={getImageSources(`images/${selectedImage.milestone.images[selectedImage.index]}`).webp} type="image/webp" />
                  <img
                    src={getImageSources(`images/${selectedImage.milestone.images[selectedImage.index]}`).fallback}
                    alt={`${selectedImage.milestone.title} - Image ${selectedImage.index + 1}`}
                    className="max-h-full max-w-full rounded-lg object-contain"
                  />
                </picture>
              )}
            </div>
          )}

          {/* Title and navigation - Below content, no overlap */}
          {selectedImage && (
            <div
              className="mt-4 flex w-full max-w-3xl flex-col items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile: Bottom navigation arrows with info - always visible */}
              <div className="flex w-full items-center justify-center gap-4 md:hidden">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage('prev')
                  }}
                  className="rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/30 active:bg-white/40 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label={showIntro ? "Previous" : "Previous image"}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="flex-1 rounded-lg bg-black/40 px-4 py-3 text-center text-white backdrop-blur-sm">
                  {showIntro ? (
                    <>
                      <p className="font-semibold text-sm sm:text-base">
                        {selectedImage.milestone.year} - Introduction
                      </p>
                      <p className="text-xs text-white/80 sm:text-sm">
                        Press → to view photos
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-sm sm:text-base">
                        {selectedImage.milestone.year}: {selectedImage.milestone.title}
                      </p>
                      <p className="text-xs text-white/80 sm:text-sm">
                        {selectedImage.globalIndex + 1} of {allImages.length} • Image {selectedImage.index + 1} of {selectedImage.milestone.images.length}
                      </p>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage('next')
                  }}
                  className="rounded-full bg-white/20 p-3 text-white transition-colors hover:bg-white/30 active:bg-white/40 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label={showIntro ? "Next" : "Next image"}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Desktop: Center info with year */}
              <div className="hidden w-full rounded-lg bg-black/40 px-6 py-3 text-center text-white backdrop-blur-sm md:block">
                {showIntro ? (
                  <>
                    <p className="font-semibold">
                      {selectedImage.milestone.year} - Introduction
                    </p>
                    <p className="text-sm text-white/80">
                      Press → to view photos from {selectedImage.milestone.year}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">
                      {selectedImage.milestone.year}: {selectedImage.milestone.title}
                    </p>
                    <p className="text-sm text-white/80">
                      {selectedImage.globalIndex + 1} of {allImages.length} • Image {selectedImage.index + 1} of {selectedImage.milestone.images.length}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Timeline
