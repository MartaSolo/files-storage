import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import type { ConfigOptions } from "@nuxt/test-utils/playwright";

export default defineConfig<ConfigOptions>({
  testDir: "./tests/e2e",
  testMatch: "**/*.test.ts",
  use: {
    nuxt: {
      rootDir: fileURLToPath(new URL(".", import.meta.url)),
      // Locally e2e tests run against the Vite dev server (fast startup, no long build step).
      // In CI: a real production build is used.
      dev: !process.env.CI,
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
