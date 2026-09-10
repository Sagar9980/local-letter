import type { NextConfig } from 'next'
import { site } from './lib/site'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    // The docs used to live here as a placeholder page; they now ship from
    // apps/docs on their own domain. Kept as a permanent redirect so older
    // links, bookmarks and anything already indexed still land somewhere real.
    return [
      { source: '/docs', destination: site.docsUrl, permanent: true },
      { source: '/docs/:path*', destination: `${site.docsUrl}/:path*`, permanent: true },
    ]
  },
}

export default nextConfig
