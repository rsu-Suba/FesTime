import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config, { isServer }) {
    config.resolve.alias = {
      ...config.resolve.alias,
      antd: path.resolve(__dirname, 'node_modules/antd'),
      '@emotion/react': path.resolve(__dirname, 'node_modules/@emotion/react'),
      '@emotion/styled': path.resolve(__dirname, 'node_modules/@emotion/styled'),
      '@/components/Layout/CardComp': path.resolve(__dirname, '../src/components/Layout/CardComp'),
      '@/components/Layout/MusicPlayerBar': path.resolve(__dirname, '../src/components/Layout/MusicPlayerBar'),
      '@/features': path.resolve(__dirname, '../src/features'),
      '@/styles': path.resolve(__dirname, '../src/styles'),
      '@/contexts': path.resolve(__dirname, 'src/contexts'),
      '@/constants': path.resolve(__dirname, 'src/constants'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/mock': path.resolve(__dirname, 'src/mock'),
      '@/i18n': path.resolve(__dirname, 'src/i18n'),
      '@festime': path.resolve(__dirname, '../src'),
      '@': path.resolve(__dirname, 'src'),
    }

    if (!isServer) {
      config.resolve.alias['react-i18next'] = path.resolve(__dirname, '../node_modules/react-i18next');
      config.resolve.alias['i18next'] = path.resolve(__dirname, '../node_modules/i18next');
    }

    return config
  },
}

export default nextConfig
