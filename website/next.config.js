const fs = require('fs')
const path = require('path')

// Written by scripts/write-build-version.mjs in prebuild; 'dev' otherwise.
function buildId() {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'duties-version.json'), 'utf8')).version
  } catch {
    return 'dev'
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export for Cloudflare Pages
  env: {
    NEXT_PUBLIC_BUILD_ID: buildId(),
  },
  turbopack: {
    root: __dirname, // Silence "inferred workspace root" when multiple lockfiles exist
  },
  images: {
    unoptimized: true, // Required for static export
  },
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header for security
  staticPageGenerationTimeout: 120, // Increase timeout to 120 seconds
  // If deploying to GitHub Pages subdirectory:
  // basePath: '/law-park-educational-trust',
  // trailingSlash: true,
}

module.exports = nextConfig
