import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  output: "export",
  distDir: "dist",
  images: {
    unoptimized: true,
    // @todo: add a loder to optimize images.
  },

  trailingSlash: true,
};

export default nextConfig;
