'use client'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  width?: number
  height?: number
  sizes?: string
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
}

/**
 * OptimizedImage component that uses WebP with automatic fallback
 * Implements Core Web Vitals best practices:
 * - WebP format for better compression
 * - Width/height attributes to prevent layout shift
 * - Responsive images with sizes attribute
 * - Proper lazy loading
 */
export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  loading = 'lazy',
  width,
  height,
  sizes,
  onError 
}: OptimizedImageProps) {
  // Extract path (Next.js public folder paths start with /)
  const cleanPath = src.startsWith('/') ? src.slice(1) : src
  const nameWithoutExt = cleanPath.substring(0, cleanPath.lastIndexOf('.'))
  
  const webpSrc = `/${nameWithoutExt}.webp`
  const fallbackSrc = `/${cleanPath}`
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget
    // If WebP fails, try fallback
    if (img.src === webpSrc || img.src.endsWith('.webp')) {
      img.src = fallbackSrc
    } else if (onError) {
      onError(e)
    }
  }
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
        sizes={sizes}
        onError={handleError}
        decoding="async"
      />
    </picture>
  )
}
