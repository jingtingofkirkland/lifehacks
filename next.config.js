/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // For GitHub Pages deployment - set this to your repo name if not using custom domain
  // basePath: '/lifehacks',
  // assetPrefix: '/lifehacks/',
};

module.exports = nextConfig;
