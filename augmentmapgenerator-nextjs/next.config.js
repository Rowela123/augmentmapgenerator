/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    // Handle JSON imports
    config.module.rules.push({
      test: /\.json$/,
      type: 'javascript/auto',
      resolve: {
        fallback: {
          fs: false,
          path: false,
        },
      },
    });
    return config;
  },
};

module.exports = nextConfig;
