/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: process.env.GITHUB_PAGES ? '/nlp-auto-eval-react' : '',
}

module.exports = nextConfig
