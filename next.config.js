const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    contentDir: path.resolve(__dirname, './content'),
    rootDir: __dirname,
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/folders/',
        permanent: false,
      }
    ]
  }
};

module.exports = nextConfig;
