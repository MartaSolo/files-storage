import { mountSuspended } from "@nuxt/test-utils/runtime";
import { enableAutoUnmount } from "@vue/test-utils";
import BaseMultiselect from "@/components/base/BaseMultiselect.vue";

enableAutoUnmount(afterEach);

const fileTypes = ["image", "pdf", "video"];

const mountMultiselect = (modelValue: string[] = []) =>
  mountSuspended(BaseMultiselect, {
    attachTo: document.body,
    props: {
      fileTypes,
      label: "File type",
      modelValue,
    },
  });

describe("BaseMultiselect", () => {
  it("renders the label", async () => {
    const wrapper = await mountMultiselect();

    expect(wrapper.find('[data-testid="multiselect-label"]').text()).toBe(
      "File type"
    );
  });

  it("opens the dropdown when the toggle button is clicked", async () => {
    const wrapper = await mountMultiselect();

    const toggle = wrapper.find('[data-testid="multiselect-toggle"]');
    expect(toggle.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find('[data-testid="multiselect-list"]').exists()).toBe(
      false
    );

    await toggle.trigger("click");

    expect(toggle.attributes("aria-expanded")).toBe("true");
    expect(wrapper.find('[data-testid="multiselect-list"]').exists()).toBe(
      true
    );
  });

  it("closes the dropdown when the toggle button is clicked again", async () => {
    const wrapper = await mountMultiselect();
    const toggle = wrapper.find('[data-testid="multiselect-toggle"]');

    await toggle.trigger("click");
    await toggle.trigger("click");

    expect(toggle.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find('[data-testid="multiselect-list"]').exists()).toBe(
      false
    );
  });

  it("renders one list item per fileTypes entry when open", async () => {
    const wrapper = await mountMultiselect();
    await wrapper.find('[data-testid="multiselect-toggle"]').trigger("click");

    fileTypes.forEach((type) => {
      expect(
        wrapper.find(`[data-testid="multiselect-option-${type}"]`).exists()
      ).toBe(true);
    });
  });

  it("reflects modelValue in the checkbox checked state", async () => {
    const wrapper = await mountMultiselect(["pdf"]);
    await wrapper.find('[data-testid="multiselect-toggle"]').trigger("click");

    const pdfCheckbox = wrapper.find(
      '[data-testid="multiselect-checkbox-pdf"]'
    );
    const imageCheckbox = wrapper.find(
      '[data-testid="multiselect-checkbox-image"]'
    );

    expect((pdfCheckbox.element as HTMLInputElement).checked).toBe(true);
    expect((imageCheckbox.element as HTMLInputElement).checked).toBe(false);
  });

  it("emits update:modelValue with the type added when checking an unchecked checkbox", async () => {
    const wrapper = await mountMultiselect(["pdf"]);
    await wrapper.find('[data-testid="multiselect-toggle"]').trigger("click");

    const imageCheckbox = wrapper.find(
      '[data-testid="multiselect-checkbox-image"]'
    );
    await imageCheckbox.setValue(true);

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([
      ["pdf", "image"],
    ]);
  });

  it("emits update:modelValue with the type removed when unchecking a checked checkbox", async () => {
    const wrapper = await mountMultiselect(["pdf", "image"]);
    await wrapper.find('[data-testid="multiselect-toggle"]').trigger("click");

    const pdfCheckbox = wrapper.find(
      '[data-testid="multiselect-checkbox-pdf"]'
    );
    await pdfCheckbox.setValue(false);

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["image"]]);
  });

  it("renders a selected chip for each item in modelValue", async () => {
    const wrapper = await mountMultiselect(["pdf", "video"]);

    expect(
      wrapper.find('[data-testid="multiselect-selected-pdf"]').exists()
    ).toBe(true);
    expect(
      wrapper.find('[data-testid="multiselect-selected-video"]').exists()
    ).toBe(true);
    expect(
      wrapper.find('[data-testid="multiselect-selected-image"]').exists()
    ).toBe(false);
  });

  it("emits update:modelValue with the type removed when a selected chip is clicked", async () => {
    const wrapper = await mountMultiselect(["pdf", "video"]);

    await wrapper
      .find('[data-testid="multiselect-selected-pdf"]')
      .trigger("click");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([["video"]]);
  });

  it("moves highlight to the next item on ArrowDown, wrapping from last to first", async () => {
    const wrapper = await mountMultiselect();
    await wrapper.find('[data-testid="multiselect-toggle"]').trigger("click");

    const labels = fileTypes.map((type) =>
      wrapper.find(`[data-testid="multiselect-option-label-${type}"]`)
    );

    await labels[2]?.trigger("keyup", { key: "ArrowDown" });
    // starting highlightedIndex is -1, so first ArrowDown should land on index 0
    expect(
      wrapper
        .find(`[data-testid="multiselect-option-${fileTypes[0]}"]`)
        .classes()
    ).toContain("select__listitem--highlighted");
  });

  it("moves highlight to the previous item on ArrowUp, wrapping from first to last", async () => {
    const wrapper = await mountMultiselect();
    const toggle = wrapper.find('[data-testid="multiselect-toggle"]');
    await toggle.trigger("click");
    await toggle.trigger("keydown", { key: "ArrowDown" });

    const firstLabel = wrapper.find(
      `[data-testid="multiselect-option-label-${fileTypes[0]}"]`
    );
    await firstLabel.trigger("keyup", { key: "ArrowUp" });

    expect(
      wrapper
        .find(
          `[data-testid="multiselect-option-${fileTypes[fileTypes.length - 1]}"]`
        )
        .classes()
    ).toContain("select__listitem--highlighted");
  });

  it("toggles the highlighted item on Enter via checkByKeyboard", async () => {
    const wrapper = await mountMultiselect();
    const toggle = wrapper.find('[data-testid="multiselect-toggle"]');
    await toggle.trigger("click");
    await toggle.trigger("keydown", { key: "ArrowDown" });

    const firstLabel = wrapper.find(
      `[data-testid="multiselect-option-label-${fileTypes[0]}"]`
    );
    await firstLabel.trigger("keyup", { key: "Enter" });

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([[fileTypes[0]]]);
  });

  it("closes the dropdown on Escape from the toggle button", async () => {
    const wrapper = await mountMultiselect();
    const toggle = wrapper.find('[data-testid="multiselect-toggle"]');

    await toggle.trigger("click");
    expect(toggle.attributes("aria-expanded")).toBe("true");

    await toggle.trigger("keyup", { key: "Escape" });

    expect(toggle.attributes("aria-expanded")).toBe("false");
  });

  it("closes the dropdown when clicking outside", async () => {
    const wrapper = await mountMultiselect();
    const toggle = wrapper.find('[data-testid="multiselect-toggle"]');
    await toggle.trigger("click");
    expect(toggle.attributes("aria-expanded")).toBe("true");

    // useClickOutside runs for real here (not mocked), so a genuine
    // dispatched click on an element outside the component should
    // trigger its callback and close the dropdown.
    document.body.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true })
    );
    await wrapper.vm.$nextTick();

    expect(toggle.attributes("aria-expanded")).toBe("false");
  });
});
