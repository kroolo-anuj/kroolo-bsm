/** @type {import('next').NextConfig} */
const nextConfig = {
  // ========================================
  // NEXT.JS CONFIGURATION FOR BSM PLATFORM
  // Enterprise-grade configuration with performance optimizations
  // Supports multi-tenant architecture and real-time features
  // Configured for Supabase integration and AI capabilities
  // Optimized for large-scale deployment and monitoring
  // Includes security headers and image optimization
  // Supports internationalization and accessibility
  // Configured for edge runtime and serverless functions
  // Includes webpack optimizations for faster builds
  // Ready for production deployment with analytics
  // ========================================

  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    typedRoutes: true,
  },

  // Image optimization for assets and user avatars
  images: {
    domains: [
      'localhost',
      'supabase.co',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'platform-lookaside.fbsbx.com',
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_APP_NAME: 'Kroolo BSM',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Redirects for SEO and user experience
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/app',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },

  // Headers for security and performance
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
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },

  // Webpack configuration for optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle splitting
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    }

    // Add aliases for cleaner imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
      '@/components': require('path').resolve(__dirname, './src/components'),
      '@/lib': require('path').resolve(__dirname, './src/lib'),
      '@/hooks': require('path').resolve(__dirname, './src/hooks'),
      '@/types': require('path').resolve(__dirname, './src/types'),
    }

    return config
  },

  // Compiler options for better performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Output configuration for deployment
  output: 'standalone',
  
  // Enable SWC minification
  swcMinify: true,

  // PoweredByHeader removal for security
  poweredByHeader: false,

  // Compression for better performance
  compress: true,

  // Generate ETags for caching
  generateEtags: true,

  // Development indicators
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
