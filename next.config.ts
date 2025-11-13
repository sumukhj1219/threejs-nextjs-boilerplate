import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ["raw-loader"],
    });
    return config;
  },

  typescript:{
    ignoreBuildErrors:true
  },
  eslint:{
    ignoreDuringBuilds:true
  }
};

export default nextConfig;
