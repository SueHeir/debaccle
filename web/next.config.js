/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  images: {
    domains: ["localhost", "debaccle.com", "storage.googleapis.com"],
  },
};

module.exports = nextConfig;
