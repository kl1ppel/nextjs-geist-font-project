/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      enabled: true
    }
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        'qrcode',
        'puppeteer',
        'puppeteer-core'
      ];
    }
    return config;
  },
  env: {
    PORT: process.env.PORT || '8000'
  },
  server: {
    port: parseInt(process.env.PORT || '8000', 10)
  }
}

export default nextConfig;
