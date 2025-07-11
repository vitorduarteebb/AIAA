/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  images: {
    domains: ['localhost', '31.97.250.28'],
  },
  experimental: {
    // Desabilitar build estático
    staticPageGenerationTimeout: 0,
  },
}

module.exports = nextConfig 