import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Опции Next.js при необходимости.
  cacheComponents: true,
  partialPrefetching: true,
  transpilePackages: ["@spectaxi/ui", "@spectaxi/theme"],
};

export default nextConfig;
