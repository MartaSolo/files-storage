import { afterEach, describe, expect, it } from "vitest";
import { enableAutoUnmount } from "@vue/test-utils";
import { nextTick } from "vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import SortFileList from "@/components/SortFileList.vue";
import type { SortColumn, SortOption } from "@/types/SortOptions";
import type { SortOrder } from "@/types/SortOrder";

type Props = { sortColumn: SortColumn; sortOrder: SortOrder };

const sortOptions: SortOption[] = [
  { label: "name ascending", column: "name", order: "asc" },
  { label: "name descending", column: "name", order: "desc" },
  { label: "type ascending", column: "mimetype", order: "asc" },
  { label: "type descending", column: "mimetype", order: "desc" },
  { label: "size ascending", column: "size", order: "asc" },
  { label: "size descending", column: "size", order: "desc" },
  { label: "time created ascending", column: "created_at", order: "asc" },
  { label: "time created descending", column: "created_at", order: "desc" },
];

const selectors = {
  root: '[data-testid="sort"]',
  button: '[data-testid="sort-button"]',
  option: '[data-testid="sort-option"]',
  listbox: '[role="listbox"]',
};

// Registers a hook that unmounts every wrapper created in a test once it ends.
// Without it, components stay alive between tests, and listeners such as
// useClickOutside on `document` (or components attached to document.body)
// would leak into later tests.
enableAutoUnmount(afterEach);

const mountSort = async (props: Partial<Props> = {}, attachToBody = false) =>
  mountSuspended(SortFileList, {
    props: { sortColumn: "name", sortOrder: "asc", ...props },
    attachTo: attachToBody ? document.body : undefined,
  });

type SortWrapper = Awaited<ReturnType<typeof mountSort>>;

const getButton = (wrapper: SortWrapper) =>
  wrapper.get<HTMLElement>(selectors.button);

type Button = ReturnType<typeof getButton>;

const getOptions = (wrapper: SortWrapper) =>
  wrapper.findAll<HTMLElement>(selectors.option);

const getOption = (wrapper: SortWrapper, index: number) =>
  getOptions(wrapper)[index]!;

const isOpen = (wrapper: SortWrapper) =>
  wrapper.find(selectors.listbox).exists();

const press = (button: Button, key: string) =>
  button.trigger("keydown", { key });

// Index of the option referenced by aria-activedescendant (-1 if none)
const getHighlightedIndex = (wrapper: SortWrapper) => {
  const activeId = getButton(wrapper).attributes("aria-activedescendant");
  return getOptions(wrapper).findIndex(
    (option) => option.attributes("id") === activeId
  );
};

const openers = [
  { name: "click", open: (button: Button) => button.trigger("click") },
  { name: "Enter", open: (button: Button) => press(button, "Enter") },
  { name: "Space", open: (button: Button) => press(button, " ") },
  { name: "ArrowDown", open: (button: Button) => press(button, "ArrowDown") },
  { name: "ArrowUp", open: (button: Button) => press(button, "ArrowUp") },
];

describe("SortFileList", () => {
  describe("closed state", () => {
    it.each(sortOptions)(
      "shows $label when sortColumn is $column and sortOrder is $order",
      async ({ label, column, order }) => {
        const wrapper = await mountSort({
          sortColumn: column,
          sortOrder: order,
        });

        expect(getButton(wrapper).text()).toContain(label);
      }
    );

    it("falls back to the first option when the props match no option", async () => {
      const wrapper = await mountSort({
        sortColumn: "unknown" as SortColumn,
      });

      expect(getButton(wrapper).text()).toContain("name ascending");
    });

    it("starts closed", async () => {
      const wrapper = await mountSort();

      expect(isOpen(wrapper)).toBe(false);
      expect(getButton(wrapper).attributes("aria-expanded")).toBe("false");
      expect(
        getButton(wrapper).attributes("aria-activedescendant")
      ).toBeUndefined();
    });

    it("follows the props when the parent changes them", async () => {
      const wrapper = await mountSort();

      await wrapper.setProps({ sortColumn: "size", sortOrder: "desc" });

      expect(getButton(wrapper).text()).toContain("size descending");
    });
  });

  describe("opening and closing", () => {
    it("toggles the dropdown when the button is clicked", async () => {
      const wrapper = await mountSort();
      const button = getButton(wrapper);

      await button.trigger("click");
      expect(isOpen(wrapper)).toBe(true);
      expect(button.attributes("aria-expanded")).toBe("true");

      await button.trigger("click");
      expect(isOpen(wrapper)).toBe(false);
      expect(button.attributes("aria-expanded")).toBe("false");
    });

    it("renders all options in order when open", async () => {
      const wrapper = await mountSort();

      await getButton(wrapper).trigger("click");

      expect(getOptions(wrapper).map((option) => option.text())).toEqual(
        sortOptions.map((option) => option.label)
      );
    });

    it("marks only the selected option as aria-selected", async () => {
      const wrapper = await mountSort({
        sortColumn: "size",
        sortOrder: "desc",
      });

      await getButton(wrapper).trigger("click");

      const selected = getOptions(wrapper)
        .filter((option) => option.attributes("aria-selected") === "true")
        .map((option) => option.text());
      expect(selected).toEqual(["size descending"]);
    });

    it.each(["Escape", "Tab"])("closes when %s is pressed", async (key) => {
      const wrapper = await mountSort();
      const button = getButton(wrapper);
      await button.trigger("click");

      await press(button, key);

      expect(isOpen(wrapper)).toBe(false);
    });

    it.each(openers)(
      "opens with the selected option highlighted when opened by $name",
      async ({ open }) => {
        const wrapper = await mountSort({
          sortColumn: "size",
          sortOrder: "asc",
        });

        await open(getButton(wrapper));

        expect(isOpen(wrapper)).toBe(true);
        expect(getHighlightedIndex(wrapper)).toBe(4);
        expect(wrapper.emitted("setSortOptions")).toBeUndefined();
      }
    );

    it.each(openers)(
      "resets the highlight to the selected option when reopened by $name",
      async ({ open }) => {
        const wrapper = await mountSort({
          sortColumn: "size",
          sortOrder: "asc",
        });
        const button = getButton(wrapper);
        await button.trigger("click");
        await press(button, "ArrowDown");
        await press(button, "ArrowDown");
        expect(getHighlightedIndex(wrapper)).toBe(6);
        await press(button, "Escape");
        expect(isOpen(wrapper)).toBe(false);

        await open(button);

        expect(getHighlightedIndex(wrapper)).toBe(4);
      }
    );
  });

  describe("selecting an option", () => {
    // sortOptions[0] ("name ascending") is the selected one, so skip it
    it.each(sortOptions.slice(1))(
      "emits setSortOptions with $column and $order when '$label' is clicked",
      async ({ label, column, order }) => {
        const wrapper = await mountSort();
        await getButton(wrapper).trigger("click");

        await getOptions(wrapper)
          .find((option) => option.text() === label)!
          .trigger("click");

        expect(wrapper.emitted("setSortOptions")).toEqual([[column, order]]);
        expect(isOpen(wrapper)).toBe(false);
      }
    );

    it("keeps showing the old label until the parent updates the props", async () => {
      const wrapper = await mountSort();
      await getButton(wrapper).trigger("click");

      await getOption(wrapper, 1).trigger("click");

      expect(getButton(wrapper).text()).toContain("name ascending");
    });

    it("closes without emitting when the selected option is clicked", async () => {
      const wrapper = await mountSort();
      await getButton(wrapper).trigger("click");

      await getOption(wrapper, 0).trigger("click");

      expect(wrapper.emitted("setSortOptions")).toBeUndefined();
      expect(isOpen(wrapper)).toBe(false);
    });

    it.each([
      { name: "Enter", key: "Enter" },
      { name: "Space", key: " " },
    ])(
      "emits the highlighted option when $name is pressed while open",
      async ({ key }) => {
        const wrapper = await mountSort();
        const button = getButton(wrapper);
        await button.trigger("click");
        await press(button, "ArrowDown");

        await press(button, key);

        expect(wrapper.emitted("setSortOptions")).toEqual([["name", "desc"]]);
        expect(isOpen(wrapper)).toBe(false);
      }
    );

    it("closes without emitting when Enter is pressed on the selected option", async () => {
      const wrapper = await mountSort();
      const button = getButton(wrapper);
      await button.trigger("click");

      await press(button, "Enter");

      expect(wrapper.emitted("setSortOptions")).toBeUndefined();
      expect(isOpen(wrapper)).toBe(false);
    });
  });

  describe("keyboard navigation", () => {
    const navigationCases: (Props & { key: string; expected: number })[] = [
      { key: "ArrowDown", sortColumn: "name", sortOrder: "asc", expected: 1 },
      { key: "ArrowUp", sortColumn: "name", sortOrder: "asc", expected: 7 },
      {
        key: "ArrowDown",
        sortColumn: "created_at",
        sortOrder: "desc",
        expected: 0,
      },
      {
        key: "ArrowUp",
        sortColumn: "created_at",
        sortOrder: "desc",
        expected: 6,
      },
    ];

    it.each(navigationCases)(
      "highlights option $expected when $key is pressed from $sortColumn $sortOrder",
      async ({ key, sortColumn, sortOrder, expected }) => {
        const wrapper = await mountSort({ sortColumn, sortOrder });
        const button = getButton(wrapper);
        await button.trigger("click");

        await press(button, key);

        expect(getHighlightedIndex(wrapper)).toBe(expected);
      }
    );

    it("moves the highlight without changing the selected option", async () => {
      const wrapper = await mountSort();
      const button = getButton(wrapper);
      await button.trigger("click");

      await press(button, "ArrowDown");

      expect(button.text()).toContain("name ascending");
      expect(getOption(wrapper, 0).attributes("aria-selected")).toBe("true");
    });
  });

  describe("mouse interaction", () => {
    it("highlights an option on mouseenter", async () => {
      const wrapper = await mountSort();
      await getButton(wrapper).trigger("click");

      await getOption(wrapper, 3).trigger("mouseenter");

      expect(getHighlightedIndex(wrapper)).toBe(3);
    });

    it("continues keyboard navigation from the hovered option", async () => {
      const wrapper = await mountSort();
      const button = getButton(wrapper);
      await button.trigger("click");
      await getOption(wrapper, 3).trigger("mouseenter");

      await press(button, "ArrowDown");

      expect(getHighlightedIndex(wrapper)).toBe(4);
    });

    it("prevents the default mousedown on options so focus stays on the button", async () => {
      const wrapper = await mountSort();
      await getButton(wrapper).trigger("click");
      const event = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
      });

      getOption(wrapper, 0).element.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe("click outside", () => {
    it("closes the dropdown when clicking outside the component", async () => {
      const wrapper = await mountSort({}, true);
      await getButton(wrapper).trigger("click");
      expect(isOpen(wrapper)).toBe(true);

      document.body.click();
      await nextTick();

      expect(isOpen(wrapper)).toBe(false);
    });

    it("keeps the dropdown open when clicking inside the component", async () => {
      const wrapper = await mountSort({}, true);
      await getButton(wrapper).trigger("click");

      await wrapper.get(selectors.root).trigger("click");

      expect(isOpen(wrapper)).toBe(true);
    });
  });

  describe("accessibility", () => {
    it("exposes the button as a combobox named by the 'Sort by:' label", async () => {
      const wrapper = await mountSort();
      const button = getButton(wrapper);
      const labelId = button.attributes("aria-labelledby")!;

      expect(button.attributes("role")).toBe("combobox");
      expect(wrapper.get(`[id="${labelId}"]`).text()).toBe("Sort by:");
    });

    it("links the button to the listbox and labels the listbox with the same label", async () => {
      const wrapper = await mountSort();
      const button = getButton(wrapper);
      await button.trigger("click");

      const listbox = wrapper.get(selectors.listbox);
      expect(button.attributes("aria-controls")).toBe(listbox.attributes("id"));
      expect(listbox.attributes("aria-labelledby")).toBe(
        button.attributes("aria-labelledby")
      );
    });

    it("gives every option a unique id", async () => {
      const wrapper = await mountSort();
      await getButton(wrapper).trigger("click");

      const ids = getOptions(wrapper).map((option) => option.attributes("id"));

      expect(new Set(ids).size).toBe(sortOptions.length);
    });
  });
});
