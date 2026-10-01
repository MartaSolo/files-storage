import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import FileFilters from "@/components/FileFilters.vue";
import { MAX_FILE_SIZE_MB } from "@/utils/constants/maxFileSizeMB";
import type { FilterParams } from "@/types/FilterParams";

const mocks = vi.hoisted(() => ({
  storage: undefined as unknown as { value: { files: string[] } },
}));

mockNuxtImport("useStorage", () => () => ({ storage: mocks.storage }));

const TOGGLE = '[data-testid="file-filters-toggle"]';
const COUNT = '[data-testid="file-filters-count"]';
const PANEL = '[data-testid="file-filters-panel"]';
const CLOSE = '[data-testid="file-filters-close"]';
const CLEAR = '[data-testid="file-filters-clear"]';
const CONFIRM = '[data-testid="file-filters-confirm"]';

const NAME = "file-filters-name";
const TYPES = "file-filters-types";
const SIZE = "file-filters-size";
const DATES = "file-filters-dates";

const from = new Date("2026-01-01T00:00:00Z");
const to = new Date("2026-01-31T00:00:00Z");

const defaultFilters = (): FilterParams => ({
  name: "",
  types: [],
  sizeMin: 0,
  sizeMax: MAX_FILE_SIZE_MB,
  dates: [],
});

const appliedFilters = (): FilterParams => ({
  name: "report",
  types: ["pdf"],
  sizeMin: 1,
  sizeMax: MAX_FILE_SIZE_MB - 1,
  dates: [from, to],
});

const mountFilters = (modelValue: Partial<FilterParams> = {}) =>
  mountSuspended(FileFilters, {
    props: {
      fileTypes: ["image", "pdf"],
      modelValue: { ...defaultFilters(), ...modelValue },
    },
    global: {
      stubs: {
        BaseInput: true,
        BaseMultiselect: true,
        BaseMinMaxSlider: true,
        TimeCreatedDatepicker: true,
      },
    },
  });

type Wrapper = Awaited<ReturnType<typeof mountFilters>>;

const openPanel = async (wrapper: Wrapper) => {
  await wrapper.find(TOGGLE).trigger("click");
};

const child = (wrapper: Wrapper, testId: string) =>
  wrapper.findComponent(`[data-testid="${testId}"]`) as VueWrapper;

const childProp = (wrapper: Wrapper, testId: string, prop: string) =>
  (child(wrapper, testId).props() as Record<string, unknown>)[prop];

const emitFrom = async (
  wrapper: Wrapper,
  testId: string,
  event: string,
  payload: unknown
) => {
  child(wrapper, testId).vm.$emit(event, payload);
  await nextTick();
};

const isConfirmDisabled = (wrapper: Wrapper) =>
  (wrapper.find(CONFIRM).element as HTMLButtonElement).disabled;

const lastEmitted = (wrapper: Wrapper) => {
  const events = wrapper.emitted("update:modelValue") ?? [];
  return events[events.length - 1]?.[0] as FilterParams;
};

describe("FileFilters", () => {
  beforeEach(() => {
    mocks.storage = ref({ files: [] as string[] });
  });

  describe("panel", () => {
    it("is closed by default", async () => {
      const wrapper = await mountFilters();

      expect(wrapper.find(PANEL).exists()).toBe(false);
      expect(wrapper.find(TOGGLE).attributes("aria-expanded")).toBe("false");
    });

    it("opens when the toggle is clicked", async () => {
      const wrapper = await mountFilters();

      await openPanel(wrapper);

      expect(wrapper.find(PANEL).exists()).toBe(true);
      expect(wrapper.find(TOGGLE).attributes("aria-expanded")).toBe("true");
    });

    it("closes when the toggle is clicked again", async () => {
      const wrapper = await mountFilters();

      await openPanel(wrapper);
      await openPanel(wrapper);

      expect(wrapper.find(PANEL).exists()).toBe(false);
      expect(wrapper.find(TOGGLE).attributes("aria-expanded")).toBe("false");
    });

    it("closes when the close button is clicked", async () => {
      const wrapper = await mountFilters();

      await openPanel(wrapper);
      await wrapper.find(CLOSE).trigger("click");

      expect(wrapper.find(PANEL).exists()).toBe(false);
    });
  });

  describe("active filters badge", () => {
    it("is hidden when no filters are applied", async () => {
      const wrapper = await mountFilters();

      expect(wrapper.find(COUNT).exists()).toBe(false);
    });

    const singleFilters: [string, Partial<FilterParams>][] = [
      ["name", { name: "report" }],
      ["types", { types: ["pdf"] }],
      ["min size", { sizeMin: 1 }],
      ["max size", { sizeMax: MAX_FILE_SIZE_MB - 1 }],
      ["dates", { dates: [from, to] }],
    ];

    it.each(singleFilters)(
      "shows 1 when only %s is applied",
      async (_, filters) => {
        const wrapper = await mountFilters(filters);

        expect(wrapper.find(COUNT).text()).toBe("1");
      }
    );

    it("counts every kind of applied filter", async () => {
      const wrapper = await mountFilters(appliedFilters());

      expect(wrapper.find(COUNT).text()).toBe("4");
    });

    it("does not count an incomplete date range", async () => {
      const wrapper = await mountFilters({
        dates: [from, null] as unknown as Date[],
      });

      expect(wrapper.find(COUNT).exists()).toBe(false);
    });
  });
  // TODO: name
  describe("draft", () => {
    it("starts from the applied filters when the panel opens", async () => {
      const applied = appliedFilters();
      const wrapper = await mountFilters(applied);

      await openPanel(wrapper);

      expect(childProp(wrapper, NAME, "modelValue")).toBe(applied.name);
      expect(childProp(wrapper, TYPES, "modelValue")).toEqual(applied.types);
      expect(childProp(wrapper, SIZE, "minValue")).toBe(applied.sizeMin);
      expect(childProp(wrapper, SIZE, "maxValue")).toBe(applied.sizeMax);
      expect(childProp(wrapper, DATES, "modelValue")).toEqual(applied.dates);
    });

    it("discards unconfirmed changes when the panel is closed and reopened", async () => {
      const applied = appliedFilters();
      const wrapper = await mountFilters(applied);

      await openPanel(wrapper);
      await emitFrom(wrapper, NAME, "update:modelValue", "something else");
      await emitFrom(wrapper, TYPES, "update:modelValue", ["image"]);
      await wrapper.find(CLOSE).trigger("click");
      await openPanel(wrapper);

      expect(childProp(wrapper, NAME, "modelValue")).toBe(applied.name);
      expect(childProp(wrapper, TYPES, "modelValue")).toEqual(applied.types);
    });

    it("treats a null from the datepicker as an empty range", async () => {
      const wrapper = await mountFilters();

      await openPanel(wrapper);
      await emitFrom(wrapper, DATES, "update:modelValue", null);

      expect(childProp(wrapper, DATES, "modelValue")).toEqual([]);
      expect(isConfirmDisabled(wrapper)).toBe(true);
    });
  });

  describe("confirm button", () => {
    it("is disabled right after opening with no filters applied", async () => {
      const wrapper = await mountFilters();

      await openPanel(wrapper);

      expect(isConfirmDisabled(wrapper)).toBe(true);
    });

    it("is disabled right after opening with filters applied", async () => {
      const wrapper = await mountFilters(appliedFilters());

      await openPanel(wrapper);

      expect(isConfirmDisabled(wrapper)).toBe(true);
    });

    const changes: [string, string, string, unknown][] = [
      ["name", NAME, "update:modelValue", "report"],
      ["types", TYPES, "update:modelValue", ["pdf"]],
      ["min size", SIZE, "update:min-value", 5],
      ["max size", SIZE, "update:max-value", MAX_FILE_SIZE_MB - 1],
      ["dates", DATES, "update:modelValue", [from, to]],
    ];

    it.each(changes)(
      "is enabled after changing %s",
      async (_, testId, event, payload) => {
        const wrapper = await mountFilters();

        await openPanel(wrapper);
        await emitFrom(wrapper, testId, event, payload);

        expect(isConfirmDisabled(wrapper)).toBe(false);
      }
    );

    it("is disabled again when the change is reverted", async () => {
      const wrapper = await mountFilters();

      await openPanel(wrapper);
      await emitFrom(wrapper, NAME, "update:modelValue", "report");
      await emitFrom(wrapper, NAME, "update:modelValue", "");

      expect(isConfirmDisabled(wrapper)).toBe(true);
    });

    it("is enabled when the only change is clearing an applied filter", async () => {
      const wrapper = await mountFilters({ name: "report" });

      await openPanel(wrapper);
      await emitFrom(wrapper, NAME, "update:modelValue", "");

      expect(isConfirmDisabled(wrapper)).toBe(false);
    });

    it("is disabled while the date range is incomplete", async () => {
      const wrapper = await mountFilters();

      await openPanel(wrapper);
      await emitFrom(wrapper, NAME, "update:modelValue", "report");
      await emitFrom(wrapper, DATES, "update:modelValue", [from, null]);

      expect(isConfirmDisabled(wrapper)).toBe(true);
    });
  });

  describe("confirming", () => {
    it("emits the draft filters and closes the panel", async () => {
      const wrapper = await mountFilters();

      await openPanel(wrapper);
      await emitFrom(wrapper, NAME, "update:modelValue", "report");
      await emitFrom(wrapper, TYPES, "update:modelValue", ["pdf"]);
      await emitFrom(wrapper, SIZE, "update:min-value", 2);
      await emitFrom(wrapper, SIZE, "update:max-value", 8);
      await emitFrom(wrapper, DATES, "update:modelValue", [from, to]);
      await wrapper.find(CONFIRM).trigger("click");

      expect(wrapper.emitted("update:modelValue")).toHaveLength(1);
      expect(lastEmitted(wrapper)).toEqual({
        name: "report",
        types: ["pdf"],
        sizeMin: 2,
        sizeMax: 8,
        dates: [from, to],
      });
      expect(wrapper.find(PANEL).exists()).toBe(false);
    });

    it("emits copies of the arrays, not the draft's own arrays", async () => {
      const wrapper = await mountFilters();
      const types = ["pdf"];
      const dates = [from, to];

      await openPanel(wrapper);
      await emitFrom(wrapper, TYPES, "update:modelValue", types);
      await emitFrom(wrapper, DATES, "update:modelValue", dates);
      await wrapper.find(CONFIRM).trigger("click");

      expect(lastEmitted(wrapper).types).toEqual(types);
      expect(lastEmitted(wrapper).types).not.toBe(types);
      expect(lastEmitted(wrapper).dates).toEqual(dates);
      expect(lastEmitted(wrapper).dates).not.toBe(dates);
    });
  });

  describe("clearing", () => {
    it("resets to the defaults, emits and closes when filters are applied", async () => {
      const wrapper = await mountFilters(appliedFilters());

      await openPanel(wrapper);
      await wrapper.find(CLEAR).trigger("click");

      expect(wrapper.emitted("update:modelValue")).toHaveLength(1);
      expect(lastEmitted(wrapper)).toEqual(defaultFilters());
      expect(wrapper.find(PANEL).exists()).toBe(false);
    });

    it("does not emit when no filters are applied, but still closes", async () => {
      const wrapper = await mountFilters();

      await openPanel(wrapper);
      await emitFrom(
        wrapper,
        NAME,
        "update:modelValue",
        "typed but not applied"
      );
      await wrapper.find(CLEAR).trigger("click");

      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
      expect(wrapper.find(PANEL).exists()).toBe(false);
    });
  });

  describe("storage changes", () => {
    it("clears the applied filters when the storage changes", async () => {
      const wrapper = await mountFilters(appliedFilters());

      mocks.storage.value.files = ["new-file.pdf"];
      await nextTick();

      expect(wrapper.emitted("update:modelValue")).toHaveLength(1);
      expect(lastEmitted(wrapper)).toEqual(defaultFilters());
    });

    it("does not emit when the storage changes and no filters are applied", async () => {
      const wrapper = await mountFilters();

      mocks.storage.value.files = ["new-file.pdf"];
      await nextTick();

      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });

    it("closes an open panel when the storage changes", async () => {
      const wrapper = await mountFilters();

      await openPanel(wrapper);
      mocks.storage.value.files = ["new-file.pdf"];
      await nextTick();

      expect(wrapper.find(PANEL).exists()).toBe(false);
    });
  });
});
