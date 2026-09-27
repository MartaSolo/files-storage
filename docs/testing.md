# Testing

This project uses two separate test runners:

- **Vitest** for unit tests and Nuxt-runtime component/composable tests
- **Playwright Test Runner** for end-to-end (e2e) tests, run against a real browser

## Test types

Type: Unit
Runner: Vitest
Environment: `happy-dom` (no Nuxt runtime)
Location: `tests/unit/`
Use for: Pure logic (helpers, formatters) and self-contained Vue components that don't rely on Nuxt auto-imports

Type: Nuxt
Runner: Vitest
Environment: Full Nuxt app booted, `happy-dom`
Location: `tests/nuxt/`
Use for: Components/composables using `ref`, `computed`, `useState`, `useRoute`, or any other Nuxt auto-import, without an explicit `import` statement

Type: E2E
Runner: Playwright Test Runner
Environment: Real browser, real Nuxt server
Location: `tests/e2e/`
Use for: Full-page behavior: navigation, route-dependent rendering (e.g. active nav state), anything that depends on real browser/router behavior

**Rule of thumb for unit vs. nuxt:** if a file uses `ref`, `computed`, `watch`, `onMounted`, `useState`, `useRoute`, or any other Nuxt/Vue API without an explicit `import` at the top of the file, it relies on Nuxt's auto-import transform and must run in the `nuxt` project, not `unit`.

## Setup

Install dependencies:

```bash
npm i --save-dev vitest @nuxt/test-utils @vue/test-utils happy-dom @vitejs/plugin-vue
npm i --save-dev @playwright/test
npx playwright install
```

`npx playwright install` downloads the actual browser binaries (Chromium/Firefox/WebKit) Playwright needs, separate from the npm package itself. Run this once locally after installing dependencies.

## Commands

`npm run test` - All Vitest projects (`unit` + `nuxt`), watch mode, with typechecking
`npm run test:ci` - All Vitest projects (`unit` + `nuxt`), single run, with typechecking
`npm run test:unit` - Only the `unit` Vitest project
`npm run test:nuxt`- Only the `nuxt` Vitest project
`npm run test:e2e` - Playwright e2e tests, headless
`npm run test:e2e:headed` - Playwright e2e tests, with a visible browser window
`npm run test:e2e:ui` - Playwright's interactive UI mode (step-by-step, time-travel debugging)

## Configuration

- `vitest.config.mts`, defines the `unit` and `nuxt` Vitest projects.
- `playwright.config.ts`, configures the Playwright Test Runner, points `testDir` at `tests/e2e`, and integrates with `@nuxt/test-utils/playwright` to auto-boot the Nuxt dev server for tests.

## Writing e2e tests

E2E tests import `test`/`expect` from `@nuxt/test-utils/playwright` (not plain `@playwright/test`), which provides a `goto` helper wired to the auto-started Nuxt server:

```ts
import { expect, test } from "@nuxt/test-utils/playwright";

test("marks the current page's tab as active", async ({ page, goto }) => {
  await goto("/all-files", { waitUntil: "hydration" });

  const activeLink = page.locator(
    '[data-testid="tabs-link"].tabs__link--active'
  );
  await expect(activeLink).toHaveText("All files");
});
```

## `data-testid` convention

Components expose stable `data-testid` attributes for elements that tests need to query, so tests don't depend on CSS class names or DOM structure. Add a `data-testid` to:

- The component's root element (useful for scoping queries, e.g. click-outside tests)
- Interactive elements (buttons, links, inputs)
- Repeated elements in a list (e.g. dropdown options, tab links), so tests can assert counts and content across the full set

Skip `data-testid` on pure layout wrappers (a `<div>` with no interactive or assertable content) and on elements already uniquely identifiable by ARIA role where that's simpler (e.g. `role="listbox"`).

## Import alias

Use `@` for imports in test files (not `~`), both resolve to the project root, `@` is the project's chosen convention.

## CI pipeline

The `PR Health Check` GitHub Actions workflow runs on every pull request to `main`, with these jobs:

| Job         | Runs                                                     |
| ----------- | -------------------------------------------------------- |
| `lint`      | `npm run lint`                                           |
| `typecheck` | `npm run typecheck`                                      |
| `test`      | `npm run test:ci` (Vitest: `unit` + `nuxt` projects)     |
| `e2e`       | `npm run test:e2e` (Playwright, headless, Chromium only) |
| `build`     | `npm run build`                                          |

The `e2e` and `build` jobs set placeholder `SUPABASE_URL`/`SUPABASE_KEY` environment variables, since both jobs boot the actual Nuxt app (for the production build and for the Playwright-driven server respectively), and app plugins read these at startup.

The `e2e` job additionally runs `npx playwright install --with-deps chromium` before the tests, installing the Chromium browser binary plus its OS-level dependencies on the CI runner.

## Local vs. CI: dev server vs. production build

`playwright.config.ts` sets `nuxt.dev` based on the `CI` environment
variable:

- **Locally** (`CI` unset): tests run against the Vite dev server, no
  build step, fast startup. This is what makes `test:e2e:headed` and
  `test:e2e:ui` actually useful, the browser opens immediately instead
  of after a full production build.
- **In CI** (`CI` set, e.g. by GitHub Actions): tests run against a
  real production build, the same output that actually ships, so
  build-specific issues (SSR quirks, minification, env-var handling)
  get caught before merge.

### Recommended local workflow

`npm run test:e2e` - quick pass/fail check headless
`npm run test:e2e:headed` - watch a full run happen live in a real browser
`npm run test:e2e:ui` - day-to-day default: interactive debugging, time-travel through steps, DOM snapshots, re-run a single test without re-running the whole suite

## Test artifacts

Running e2e tests generates `test-results/` (traces, screenshots) and,
on failure, `playwright-report/` (HTML report). Both are gitignored,
regenerated on every run. To inspect a trace from a specific run:

\`\`\`bash
npx playwright show-trace test-results/<test-name>/trace.zip
\`\`\`
