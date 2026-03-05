/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'pktlucrbkljicperffne.supabase.co', // ✅ teu domínio do Supabase Storage
    ],
  },
};

module.exports = nextConfig;