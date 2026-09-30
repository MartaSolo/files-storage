import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import FileList from "@/components/FileList.vue";

const defaultItems = ["report.pdf", "photo.png", "notes.txt"];

type FileListProps = InstanceType<typeof FileList>["$props"];

const createWrapper = (
  props: Partial<FileListProps> = {},
  attrs: Record<string, string> = {}
) =>
  mount(FileList, {
    props: {
      title: "Uploaded files:",
      items: defaultItems,
      ...props,
    },
    attrs,
  });

describe("FileList", () => {
  it("renders the title prop", () => {
    const wrapper = createWrapper({ title: "My files:" });

    expect(wrapper.find(".list__title").text()).toBe("My files:");
  });

  it("renders one list item per entry with the correct text", () => {
    const wrapper = createWrapper();

    const listItems = wrapper.findAll('[data-testid="list-item"]');

    expect(listItems).toHaveLength(defaultItems.length);
    expect(listItems.map((li) => li.text())).toEqual(defaultItems);
  });

  it("renders no list items when items is empty", () => {
    const wrapper = createWrapper({ items: [] });

    expect(wrapper.findAll('[data-testid="list-item"]')).toHaveLength(0);
  });

  it.each(["success", "failure", "default"] as const)(
    "applies the list--%s class for the %s theme",
    (theme) => {
      const wrapper = createWrapper({ theme });

      expect(wrapper.classes()).toContain(`list--${theme}`);
    }
  );

  it("falls back to the default theme when theme is omitted", () => {
    const wrapper = createWrapper();

    expect(wrapper.classes()).toContain("list--default");
  });

  it("forwards data-testid from the parent onto its root element", () => {
    const wrapper = createWrapper({}, { "data-testid": "uploaded-file-list" });

    expect(wrapper.attributes("data-testid")).toBe("uploaded-file-list");
  });
});
