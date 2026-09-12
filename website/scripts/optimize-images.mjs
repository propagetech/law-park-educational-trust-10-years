import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname, basename } from 'path'
import { existsSync } from 'fs'

const IMAGES_DIRS = ['public/images', 'public']
const QUALITY = 80 // WebP quality (0-100) - reduced for better compression
const MAX_WIDTH = 1920 // Max width for large images (most displays are 1920px or less)
const MAX_HEIGHT = 1080 // Max height for large images

async function optimizeImage(inputPath, outputPath) {
  try {
    const metadata = await sharp(inputPath).metadata()
    const fileSize = (await stat(inputPath)).size
    
    let image = sharp(inputPath)
    
    // Resize if image is larger than max dimensions (maintains aspect ratio)
    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      image = image.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
    }
    
    // Convert to WebP with aggressive optimization
    await image
      .webp({ 
        quality: QUALITY,
        effort: 6, // Maximum effort for best compression
        nearLossless: false, // Allow lossy compression for smaller files
        smartSubsample: true // Better quality at lower file sizes
      })
      .toFile(outputPath)
    
    const optimizedSize = (await stat(outputPath)).size
    const savings = ((fileSize - optimizedSize) / fileSize * 100).toFixed(1)
    
    const resizeInfo = (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) 
      ? ` [resized from ${metadata.width}x${metadata.height}]` 
      : ''
    
    console.log(`✓ ${basename(inputPath)} → ${basename(outputPath)} (${(fileSize / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB, ${savings}% smaller)${resizeInfo}`)
    
    return { original: fileSize, optimized: optimizedSize, savings }
  } catch (error) {
    console.error(`✗ Error optimizing ${inputPath}:`, error.message)
    return null
  }
}

async function processDirectory(dir) {
  const files = await readdir(dir)
  const imageExtensions = ['.jpg', '.jpeg', '.png']
  let totalOriginal = 0
  let totalOptimized = 0
  
  for (const file of files) {
    const filePath = join(dir, file)
    const ext = extname(file).toLowerCase()
    
    if (imageExtensions.includes(ext)) {
      const webpPath = filePath.replace(ext, '.webp')
      
      // Skip if WebP already exists and is newer
      if (existsSync(webpPath)) {
        const originalStat = await stat(filePath)
        const webpStat = await stat(webpPath)
        if (webpStat.mtime > originalStat.mtime) {
          console.log(`⊘ Skipping ${file} (WebP already exists and is newer)`)
          continue
        }
      }
      
      const result = await optimizeImage(filePath, webpPath)
      if (result) {
        totalOriginal += result.original
        totalOptimized += result.optimized
      }
    }
  }
  
  if (totalOriginal > 0) {
    const totalSavings = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1)
    console.log(`\n📊 Total: ${(totalOriginal / 1024).toFixed(1)}KB → ${(totalOptimized / 1024).toFixed(1)}KB (${totalSavings}% smaller)`)
  }
}

async function main() {
  console.log('🖼️  Optimizing images to WebP format...\n')
  for (const dir of IMAGES_DIRS) {
    await processDirectory(dir)
  }
  console.log('\n✅ Image optimization complete!')
}

main().catch(console.error)
