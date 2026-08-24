// Block shipping mock authentication in production builds.
// The mock auth path (lib/auth/authService.ts) must never be deployable
// in a production build, so fail the build if it is explicitly enabled.
if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true') {
  throw new Error(
    'NEXT_PUBLIC_ENABLE_MOCK_AUTH=true is not allowed in production builds. ' +
      'Remove the flag or configure a real authentication backend.'
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable webpack bundle analyzer
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 20,
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },

  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Enable compression
  compress: true,

  // Optimize fonts
  optimizeFonts: true,

  // Enable experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@soroban-scanner/ui-components'],
  },

  // Static optimization
  trailingSlash: false,
  
  // Enable SWC minification
  swcMinify: true,

  // Production source maps (disabled for smaller bundles)
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
