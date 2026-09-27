// tests/nuxt/BaseSelect.nuxt.test.ts
import { describe, it, expect } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import BaseSelect from "@/components/base/BaseSelect.vue";

describe("BaseSelect", () => {
  const options = ["Apple", "Banana", "Cherry"];

  const mountSelect = (modelValue = "") =>
    mountSuspended(BaseSelect, {
      props: { options, modelValue, placeholder: "Select a fruit" },
    });

  it("shows the placeholder when no modelValue is set", async () => {
    const wrapper = await mountSelect();

    expect(wrapper.find('[data-testid="select-button"]').text()).toContain(
      "Select a fruit"
    );
  });

  it("shows the modelValue text when one is set", async () => {
    const wrapper = await mountSelect("Banana");

    expect(wrapper.find('[data-testid="select-button"]').text()).toContain(
      "Banana"
    );
  });

  it("opens the dropdown on click and lists all options", async () => {
    const wrapper = await mountSelect();
    const button = wrapper.find('[data-testid="select-button"]');

    await button.trigger("click");

    expect(button.attributes("aria-expanded")).toBe("true");
    const optionEls = wrapper.findAll('[data-testid="select-option"]');
    expect(optionEls.map((el) => el.text())).toEqual(options);
  });

  it("emits update:modelValue and closes the dropdown when an option is clicked", async () => {
    const wrapper = await mountSelect();
    await wrapper.find('[data-testid="select-button"]').trigger("click");

    const optionEls = wrapper.findAll('[data-testid="select-option"]');
    await optionEls[1]?.trigger("click"); // Banana

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["Banana"]);
    expect(
      wrapper.find('[data-testid="select-button"]').attributes("aria-expanded")
    ).toBe("false");
  });

  it("starts the keyboard highlight on the selected option, not always index 0", async () => {
    const wrapper = await mountSelect("Cherry");
    await wrapper.find('[data-testid="select-button"]').trigger("click");

    const optionEls = wrapper.findAll('[data-testid="select-option"]');
    expect(optionEls[2]?.classes()).toContain("active"); // Cherry is index 2
  });

  it("moves the highlight with arrow keys and wraps at both ends", async () => {
    const wrapper = await mountSelect(); // starts highlighted at index 0
    const button = wrapper.find('[data-testid="select-button"]');
    await button.trigger("click");

    await button.trigger("keydown.up"); // wraps to the last option
    let optionEls = wrapper.findAll('[data-testid="select-option"]');
    expect(optionEls[options.length - 1]?.classes()).toContain("active");

    await button.trigger("keydown.down"); // wraps back to the first
    optionEls = wrapper.findAll('[data-testid="select-option"]');
    expect(optionEls[0]?.classes()).toContain("active");
  });

  it("selects the highlighted option on Enter without reopening the dropdown", async () => {
    const wrapper = await mountSelect();
    const button = wrapper.find('[data-testid="select-button"]');
    await button.trigger("click");
    await button.trigger("keydown.down"); // highlight Banana

    await button.trigger("keydown.enter");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["Banana"]);
    expect(button.attributes("aria-expanded")).toBe("false");
  });

  it("opens the dropdown on Enter when closed, without selecting anything", async () => {
    const wrapper = await mountSelect();
    const button = wrapper.find('[data-testid="select-button"]');

    await button.trigger("keydown.enter");

    expect(button.attributes("aria-expanded")).toBe("true");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("closes the dropdown on Escape", async () => {
    const wrapper = await mountSelect();
    const button = wrapper.find('[data-testid="select-button"]');
    await button.trigger("click");

    await button.trigger("keydown.esc");

    expect(button.attributes("aria-expanded")).toBe("false");
  });

  it("sets aria-activedescendant to the highlighted option only while open", async () => {
    const wrapper = await mountSelect();
    const button = wrapper.find('[data-testid="select-button"]');

    expect(button.attributes("aria-activedescendant")).toBeUndefined();

    await button.trigger("click");
    expect(button.attributes("aria-activedescendant")).toBe("select-option-0");
  });
});
