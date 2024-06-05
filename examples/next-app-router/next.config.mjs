/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en-US/home-page',
        permanent: true,
      },
      {
        source: '/:locale',
        destination: '/:locale/home-page',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
