import { mountSuspended } from "@nuxt/test-utils/runtime";
import FileCheckbox from "@/components/FileCheckbox.vue";
import { FILE_TYPES } from "@/types/fileTypes";
import { defineComponent, h } from "vue";

const INPUT = '[data-testid="file-checkbox-input"]';
const ROOT = '[data-testid="file-checkbox"]';

async function mountCheckbox(
  props: Partial<InstanceType<typeof FileCheckbox>["$props"]> = {}
) {
  return mountSuspended(FileCheckbox, {
    props: {
      modelValue: false,
      name: "report.pdf",
      type: "pdf",
      ...props,
    },
  });
}

describe("FileCheckbox", () => {
  it("renders the root element and the input", async () => {
    const wrapper = await mountCheckbox();

    expect(wrapper.find(ROOT).exists()).toBe(true);
    expect(wrapper.find(INPUT).exists()).toBe(true);
    expect(wrapper.find(INPUT).attributes("type")).toBe("checkbox");
  });

  describe("modelValue", () => {
    it("is unchecked when modelValue is false", async () => {
      const wrapper = await mountCheckbox({ modelValue: false });

      expect((wrapper.find(INPUT).element as HTMLInputElement).checked).toBe(
        false
      );
    });

    it("is checked when modelValue is true", async () => {
      const wrapper = await mountCheckbox({ modelValue: true });

      expect((wrapper.find(INPUT).element as HTMLInputElement).checked).toBe(
        true
      );
    });

    it("reflects a modelValue change after mount", async () => {
      const wrapper = await mountCheckbox({ modelValue: false });

      await wrapper.setProps({ modelValue: true });

      expect((wrapper.find(INPUT).element as HTMLInputElement).checked).toBe(
        true
      );
    });
  });

  describe("update:modelValue", () => {
    it("emits true when an unchecked box is checked", async () => {
      const wrapper = await mountCheckbox({ modelValue: false });

      await wrapper.find(INPUT).setValue(true);

      expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
    });

    it("emits false when a checked box is unchecked", async () => {
      const wrapper = await mountCheckbox({ modelValue: true });

      await wrapper.find(INPUT).setValue(false);

      expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
    });

    it("does not emit on mount", async () => {
      const wrapper = await mountCheckbox();

      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });
  });

  describe("type", () => {
    it.each(FILE_TYPES)(
      "applies the modifier class for type %s",
      async (type) => {
        const wrapper = await mountCheckbox({ type });
        const classes = wrapper.find(INPUT).classes();

        expect(classes).toContain("checkbox__input");
        expect(classes).toContain(`checkbox__input--${type}`);
      }
    );
  });

  describe("accessibility", () => {
    it("uses the name as the aria-label of the input", async () => {
      const wrapper = await mountCheckbox({ name: "holiday-photo.png" });

      expect(wrapper.find(INPUT).attributes("aria-label")).toBe(
        "holiday-photo.png"
      );
    });

    it("links the label to the input via a generated id", async () => {
      const wrapper = await mountCheckbox();
      const inputId = wrapper.find(INPUT).attributes("id");

      expect(inputId).toBeTruthy();
      expect(wrapper.find("label").attributes("for")).toBe(inputId);
    });

    it("generates a unique id per instance, even with the same name", async () => {
      const Wrapper = defineComponent({
        render: () =>
          h("div", [
            h(FileCheckbox, {
              modelValue: false,
              name: "same.pdf",
              type: "pdf",
            }),
            h(FileCheckbox, {
              modelValue: false,
              name: "same.pdf",
              type: "pdf",
            }),
          ]),
      });

      const wrapper = await mountSuspended(Wrapper);
      const [first, second] = wrapper.findAll(INPUT);

      expect(first?.attributes("id")).toBeTruthy();
      expect(second?.attributes("id")).toBeTruthy();
      expect(first?.attributes("id")).not.toBe(second?.attributes("id"));
    });
  });
});
