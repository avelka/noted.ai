export default {
  // Run biome check and format on staged TypeScript, JavaScript, and JSON files
  "*.{ts,tsx,js,jsx,json}": ["biome check --write"],
};
