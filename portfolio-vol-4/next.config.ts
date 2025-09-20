/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  nextConfig,
  images: {
    domains: [
      'i.imgur.com',
    ],
  },
  customColors: {
    primary: '#0A0A0A',
  },
}

