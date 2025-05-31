/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NMKR_API_KEY: process.env.NMKR_API_KEY,
    BLOCKFROST_API_KEY: process.env.BLOCKFROST_API_KEY,
    TARGET_POLICY_ID: process.env.TARGET_POLICY_ID,
  },
}

module.exports = nextConfig