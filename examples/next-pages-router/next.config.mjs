/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home-page',
        permanent: true,
      },
    ];
  },
  i18n: {
    locales: ['en-US', 'de'],
    defaultLocale: 'en-US',
  },
  reactStrictMode: true,
};

export default nextConfig;
