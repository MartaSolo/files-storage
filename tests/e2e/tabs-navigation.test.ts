import { expect, test } from "@nuxt/test-utils/playwright";

test("marks the current page's tab as active", async ({ page, goto }) => {
  await goto("/all-files", { waitUntil: "hydration" });

  const activeLink = page.locator(
    '[data-testid="tabs-link"].tabs__link--active'
  );
  await expect(activeLink).toHaveText("All files");
});
