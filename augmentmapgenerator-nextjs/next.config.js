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

    // Add specific alias for us-states.json
    config.resolve.alias = {
      ...config.resolve.alias,
      '../data/us-states.json': require.resolve('./src/data/us-states.json'),
    };

    return config;
  },
};

module.exports = nextConfig;
