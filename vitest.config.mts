import { defineConfig } from "vitest/config";
import { defineVitestProject } from "@nuxt/test-utils/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    globals: true,
    projects: [
      // UNIT: happy-dom (no Nuxt runtime).
      // For pure logic (helpers, formatters, sort/filter functions) and
      // self-contained Vue components that don't use Nuxt auto-imports.
      {
        plugins: [vue()],
        resolve: {
          alias: {
            "@": fileURLToPath(new URL("./", import.meta.url)),
          },
        },
        test: {
          name: "unit",
          environment: "happy-dom",
          globals: true,
          include: ["tests/unit/**/*.{test,spec}.ts"],
        },
      },

      // NUXT: simulated DOM (happy-dom) with a full Nuxt app
      // booted first. Used for components/composables relying on Nuxt
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
    ],
  },
});
