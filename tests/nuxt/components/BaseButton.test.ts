import { mountSuspended } from "@nuxt/test-utils/runtime";
import BaseButton from "@/components/base/BaseButton.vue";

describe("BaseButton", () => {
  it("renders as a native button by default", async () => {
    const wrapper = await mountSuspended(BaseButton);

    const button = wrapper.find('[data-testid="base-button"]');
    expect(button.element.tagName).toBe("BUTTON");
    expect(button.attributes("type")).toBe("button");
  });

  it("renders as NuxtLink when the 'to' prop is provided", async () => {
    const wrapper = await mountSuspended(BaseButton, {
      props: { to: "/some-path" },
    });

    const link = wrapper.findComponent({ name: "NuxtLink" });
    expect(link.exists()).toBe(true);
    expect(link.props("to")).toBe("/some-path");

    const button = wrapper.find('[data-testid="base-button"]');
    expect(button.attributes("type")).toBeUndefined();
  });

  it("applies default theme and size classes, without loading class", async () => {
    const wrapper = await mountSuspended(BaseButton);

    const button = wrapper.find('[data-testid="base-button"]');
    expect(button.classes()).toContain("button");
    expect(button.classes()).toContain("button--green");
    expect(button.classes()).toContain("button--medium");
    expect(button.classes()).not.toContain("button--loading");
  });

  it("applies custom theme and size classes", async () => {
    const wrapper = await mountSuspended(BaseButton, {
      props: { theme: "white", size: "large" },
    });

    const button = wrapper.find('[data-testid="base-button"]');
    expect(button.classes()).toContain("button--white");
    expect(button.classes()).toContain("button--large");
  });

  it("shows loader and aria-disabled when loading is true", async () => {
    const wrapper = await mountSuspended(BaseButton, {
      props: { loading: true },
    });

    const button = wrapper.find('[data-testid="base-button"]');
    expect(button.classes()).toContain("button--loading");
    expect(button.attributes("aria-disabled")).toBe("true");
    expect(wrapper.find('[data-testid="button-loader"]').exists()).toBe(true);
  });

  it("hides loader and sets aria-disabled false when loading is false", async () => {
    const wrapper = await mountSuspended(BaseButton, {
      props: { loading: false },
    });

    const button = wrapper.find('[data-testid="base-button"]');
    expect(button.attributes("aria-disabled")).toBe("false");
    expect(wrapper.find('[data-testid="button-loader"]').exists()).toBe(false);
  });

  it("renders slot content", async () => {
    const wrapper = await mountSuspended(BaseButton, {
      slots: {
        default: () => "Click me",
      },
    });

    expect(wrapper.text()).toContain("Click me");
  });

  it("respects a custom type prop on the native button", async () => {
    const wrapper = await mountSuspended(BaseButton, {
      props: { type: "submit" },
    });

    const button = wrapper.find('[data-testid="base-button"]');
    expect(button.attributes("type")).toBe("submit");
  });
});
