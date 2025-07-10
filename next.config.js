/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone', // Removido temporariamente para deploy
  experimental: {
    // Desabilitar build estático para evitar problemas com Prisma
    staticPageGenerationTimeout: 0,
  },
  images: {
    domains: ['localhost', '31.97.250.28'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 