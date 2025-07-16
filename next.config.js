/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
  // For static export
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig