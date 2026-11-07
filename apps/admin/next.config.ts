import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Опции Next.js при необходимости.
  cacheComponents: true,
  partialPrefetching: true,
  transpilePackages: ["@spectaxi/theme"],
};

export default nextConfig;
