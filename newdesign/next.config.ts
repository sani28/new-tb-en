import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // This repo is the Next.js project root.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
