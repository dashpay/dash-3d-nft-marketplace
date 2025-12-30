/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for dynamic routes
  // output: 'export',
  
  // For static export
  // trailingSlash: true,
  
  // Image optimization settings
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig