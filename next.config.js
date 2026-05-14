/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export for GitHub Pages
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
