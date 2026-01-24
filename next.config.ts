import withPWA from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

// Extract repository name from environment variable for GitHub Pages basePath
// Format: owner/repo-name -> /repo-name
const getBasePath = () => {
  if (process.env.GITHUB_REPOSITORY_NAME) {
    return `/${process.env.GITHUB_REPOSITORY_NAME}`;
  }
  // Default fallback for local development
  return "";
};

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  basePath: getBasePath(),
  webpack: (config) => {
    return config;
  },
  turbopack: {},
};

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "offlineCache",
          expiration: {
            maxEntries: 200,
          },
        },
      },
    ],
  },
  fallbacks: {
    document: "/offline.html",
  },
})(nextConfig);
