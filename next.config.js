/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.BACKEND_API_URL ||
          "https://better-monopoly-server-d57d.onrender.com"
        }/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
