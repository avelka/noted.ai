import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "public/sw.js",
    "public/swe-worker-*.js",
    "public/workbox-*.js",
    "public/fallback-*.js",
    "src/components/ui/**",
  ],
};

export default config;
