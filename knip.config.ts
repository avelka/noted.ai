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
    "src/components/ui/**",
  ],
  ignoreDependencies: ["@types/node", "@types/react", "@types/react-dom"],
};

export default config;
