'use client'

import { useState, useEffect, useCallback } from 'react'
import { milestones } from '../../data/milestones'
import { getImageSources } from '../../utils/image'

function Gallery() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Collect all images from milestones
  const allImages = milestones.flatMap((milestone) =>
    milestone.images.map((img) => ({
      src: img,
      alt: `${milestone.title} - ${milestone.year}`,
      year: milestone.year,
      location: milestone.location,
    }))
  )

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return

    if (direction === 'prev') {
      setSelectedImageIndex(selectedImageIndex === 0 ? allImages.length - 1 : selectedImageIndex - 1)
    } else {
      setSelectedImageIndex(selectedImageIndex === allImages.length - 1 ? 0 : selectedImageIndex + 1)
    }
  }, [selectedImageIndex, allImages.length])

  const closeLightbox = useCallback(() => {
    setSelectedImageIndex(null)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    if (selectedImageIndex === null) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        navigateImage('prev')
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        navigateImage('next')
      } else if (e.key === 'Escape') {
        e.preventDefault()
        closeLightbox()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImageIndex, navigateImage, closeLightbox])

  // Touch/swipe navigation
  const minSwipeDistance = 50

  function onTouchStart(e: React.TouchEvent) {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  function onTouchMove(e: React.TouchEvent) {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  function onTouchEnd() {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      navigateImage('next')
    } else if (isRightSwipe) {
      navigateImage('prev')
    }
  }

  return (
    <>
      <section id="gallery" className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Gallery
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Moments from our journey - the smiles, the learning, and the impact we&apos;ve created together.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {allImages.map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-200 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <picture>
                  <source srcSet={getImageSources(`images/${image.src}`).webp} type="image/webp" />
                  <img
                    src={getImageSources(`images/${image.src}`).fallback}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </picture>
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 pb-8 md:pb-4"
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Desktop: Side navigation buttons - hidden on mobile */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('prev')
            }}
            className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white md:block"
            aria-label="Previous image"
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

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navigateImage('next')
            }}
            className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white md:block"
            aria-label="Next image"
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

          {/* Image container */}
          <div 
            className="flex max-h-[calc(100vh-240px)] max-w-[calc(100vw-2rem)] flex-col items-center justify-center md:max-h-[calc(100vh-180px)] md:max-w-[calc(100vw-8rem)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <picture className="flex max-h-full items-center justify-center">
              <source srcSet={getImageSources(`images/${allImages[selectedImageIndex].src}`).webp} type="image/webp" />
              <img
                src={getImageSources(`images/${allImages[selectedImageIndex].src}`).fallback}
                alt={allImages[selectedImageIndex].alt}
                className="max-h-full max-w-full rounded-lg object-contain"
              />
            </picture>
          </div>

          {/* Title and navigation - Below image, no overlap */}
          <div 
            className="mt-4 flex w-full max-w-3xl flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile: Bottom navigation arrows */}
            <div className="flex w-full items-center justify-center gap-4 md:hidden">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage('prev')
                }}
                className="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 active:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Previous image"
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
                <p className="font-semibold text-sm sm:text-base">{allImages[selectedImageIndex].alt}</p>
                <p className="text-xs text-white/80 sm:text-sm">
                  {selectedImageIndex + 1} of {allImages.length}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage('next')
                }}
                className="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 active:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Next image"
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

            {/* Desktop: Center info only */}
            <div className="hidden w-full rounded-lg bg-black/40 px-6 py-3 text-center text-white backdrop-blur-sm md:block">
              <p className="font-semibold">{allImages[selectedImageIndex].alt}</p>
              <p className="text-sm text-white/80">
                {selectedImageIndex + 1} of {allImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Gallery
