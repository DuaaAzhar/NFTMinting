/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
    };
    config.node = {
      fs: 'empty'
    }
  
    return config;
  },
};
module.exports = nextConfig;
