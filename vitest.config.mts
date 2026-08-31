import { defineConfig } from "vitest/config";
import { defineVitestProject } from "@nuxt/test-utils/config";
import { playwright } from "@vitest/browser-playwright";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  test: {
    globals: true,
    projects: [
      // UNIT: plain Node, no DOM, no Nuxt runtime.
      // For pure logic: helpers, formatters, sort/filter functions, etc.
      await defineVitestProject({
        test: {
          name: "unit",
          environment: "node",
          globals: true,
          include: ["tests/unit/**/*.{test,spec}.ts"],
        },
      }),

      // BROWSER: real Chromium via Playwright, no Nuxt runtime booted.
      // For plain, self-contained Vue components (Button, Input, Card...)
      // that don't use Nuxt auto-imports/composables.
      {
        plugins: [vue()],
        test: {
          name: "browser",
          include: ["tests/browser/**/*.{test,spec}.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },

      // NUXT: for later. Simulated DOM (happy-dom) with a full Nuxt app
      // booted first. Use for components/composables relying on Nuxt
      // auto-imports, useState, useRoute, #imports, etc. Mount with
      // mountSuspended/renderSuspended from "@nuxt/test-utils/runtime".
      await defineVitestProject({
        test: {
          name: "nuxt",
          environment: "nuxt",
          globals: true,
          include: ["tests/nuxt/**/*.{test,spec}.ts"],
        },
      }),

      // E2E: real server + real browser, via @nuxt/test-utils/e2e.
      // Each test file calls setup() and createPage()/$fetch() itself.
      {
        test: {
          name: "e2e",
          environment: "node",
          globals: true,
          include: ["tests/e2e/**/*.{test,spec}.ts"],
        },
      },
    ],
  },
});
