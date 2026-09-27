import { mountSuspended } from "@nuxt/test-utils/runtime";
import BaseAccordion from "@/components/base/BaseAccordion.vue";

describe("BaseAccordion", () => {
  let wrapper: Awaited<ReturnType<typeof mountSuspended>>;
  let button: ReturnType<typeof wrapper.find>;

  beforeEach(async () => {
    wrapper = await mountSuspended(BaseAccordion, {
      props: {
        title: "My Title",
        content: "My Content",
      },
    });

    button = wrapper.find('[data-testid="accordion-button"]');
  });

  it("renders the title and does not show content initially", () => {
    expect(wrapper.text()).toContain("My Title");
    expect(wrapper.find('[data-testid="accordion-content"]').exists()).toBe(
      false
    );
    expect(button.attributes("aria-expanded")).toBe("false");
  });

  it("shows content and updates aria-expanded when clicked", async () => {
    await button.trigger("click");

    const content = wrapper.find('[data-testid="accordion-content"]');
    expect(content.exists()).toBe(true);
    expect(content.text()).toContain("My Content");
    expect(button.attributes("aria-expanded")).toBe("true");
  });

  it("hides content again on a second click", async () => {
    await button.trigger("click");
    await button.trigger("click");

    expect(wrapper.find('[data-testid="accordion-content"]').exists()).toBe(
      false
    );
    expect(button.attributes("aria-expanded")).toBe("false");
  });

  it("renders the ArrowIcon component", () => {
    expect(wrapper.findComponent({ name: "ArrowIcon" }).exists()).toBe(true);
  });
});
