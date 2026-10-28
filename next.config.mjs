/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  webpack: (config, { dev }) => {
    // Node 25's V8 crashes during webpack's disk-cache serialization
    // ("Lazy deopt after a fast API call..."). Disabling the filesystem cache
    // in dev avoids that code path. Safe to remove on Node 20/22 LTS.
    if (dev) config.cache = false;
    return config;
  },
};

export default nextConfig;
