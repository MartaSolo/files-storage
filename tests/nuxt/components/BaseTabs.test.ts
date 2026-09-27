import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import BaseTabs from "@/components/base/BaseTabs.vue";

describe("BaseTabs", () => {
  const tabs = [
    { label: "Add new files", path: "/" },
    { label: "All files", path: "/all-files" },
  ];

  it("renders a link for each tab with the correct label and path", async () => {
    const wrapper = await mountSuspended(BaseTabs, { props: { tabs } });

    const links = wrapper.findAll('[data-testid="tabs-link"]');
    expect(links).toHaveLength(tabs.length);
    expect(links.map((link) => link.text())).toEqual(
      tabs.map((tab) => tab.label)
    );
    expect(links.map((link) => link.attributes("href"))).toEqual(
      tabs.map((tab) => tab.path)
    );
  });
});
