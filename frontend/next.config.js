/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['upload.wikimedia.org'],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
    }];
  },
};
