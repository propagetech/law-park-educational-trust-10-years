/**
 * Get image sources for <picture> element with WebP and fallback
 */
export function getImageSources(originalPath: string): {
  webp: string
  fallback: string
} {
  // Handle paths (Next.js public folder paths start with /)
  let cleanPath = originalPath
  if (originalPath.startsWith('/')) {
    cleanPath = originalPath.slice(1)
  }
  
  // Remove base path if present
  if (!cleanPath.startsWith('images/') && !cleanPath.includes('/')) {
    cleanPath = `images/${cleanPath}`
  }
  
  // Get file name without extension
  const nameWithoutExt = cleanPath.substring(0, cleanPath.lastIndexOf('.'))
  
  return {
    webp: `/${nameWithoutExt}.webp`,
    fallback: `/${cleanPath}`,
  }
}

