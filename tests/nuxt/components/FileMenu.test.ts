import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, type Ref } from "vue";
import { flushPromises } from "@vue/test-utils";
import {
  mockComponent,
  mockNuxtImport,
  mountSuspended,
} from "@nuxt/test-utils/runtime";
import type { FileObject } from "@supabase/storage-js";
import FileMenu from "@/components/FileMenu.vue";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mocks = vi.hoisted(() => ({
  copyFile: vi.fn(),
  copyLink: vi.fn(),
  deleteFile: vi.fn(),
  downloadFile: vi.fn(),
  notify: vi.fn(),
  useClickOutside: vi.fn(),
}));

mockNuxtImport("useCopyFile", () => () => ({ copyFile: mocks.copyFile }));
mockNuxtImport("useCopyLink", () => () => ({ copyLink: mocks.copyLink }));
mockNuxtImport("useDeleteFile", () => () => ({
  deleteFile: mocks.deleteFile,
}));
mockNuxtImport("useDownloadFile", () => () => ({
  downloadFile: mocks.downloadFile,
}));
mockNuxtImport("useNotification", () => () => ({ notify: mocks.notify }));
mockNuxtImport("useClickOutside", () => mocks.useClickOutside);

// The modal has its own tests. Here we only care about the props FileMenu
// passes down and the events it reacts to.
mockComponent("RenameFileModal", async () => {
  const { defineComponent, h } = await import("vue");
  return defineComponent({
    name: "RenameFileModal",
    props: { isOpen: Boolean, fileName: String },
    emits: ["closeRenameFileModal", "fileNameUpdated"],
    render() {
      return h("div", { "data-testid": "rename-modal-stub" });
    },
  });
});

// IntersectionObserver stub: captures the callback so tests can fire entries.
const observeMock = vi.fn();
const disconnectMock = vi.fn();
let observerCallback: IntersectionObserverCallback;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const FILE_NAME = "autumn.jpg";
const fileList = [{ name: FILE_NAME }] as FileObject[];

const LABELS = [
  "Copy link",
  "Copy file",
  "Download file",
  "Delete file",
  "Rename file",
];

const selector = {
  root: '[data-testid="file-menu"]',
  trigger: '[data-testid="file-menu-trigger"]',
  menu: '[role="menu"]',
  item: (index: number) => `[data-testid="file-menu-item-${index}"]`,
  action: (id: string) => `[data-testid="file-menu-action-${id}"]`,
};

const mountMenu = () =>
  mountSuspended(FileMenu, {
    props: { fileName: FILE_NAME, fileList },
    // Transition is stubbed so v-if changes are applied immediately.
    global: { stubs: { transition: true } },
  });

type Wrapper = Awaited<ReturnType<typeof mountMenu>>;

const isOpen = (wrapper: Wrapper) => wrapper.find(selector.menu).exists();

const openMenu = (wrapper: Wrapper) =>
  wrapper.get(selector.trigger).trigger("click");

const press = (wrapper: Wrapper, key: string) =>
  wrapper.get(selector.trigger).trigger("keydown", { key });

const isHighlighted = (wrapper: Wrapper, index: number) =>
  wrapper.get(selector.item(index)).classes("menu__list-item--highlighted");

const fireIntersection = (entry: { intersectionRatio: number; top: number }) =>
  observerCallback(
    [
      {
        intersectionRatio: entry.intersectionRatio,
        boundingClientRect: { top: entry.top } as DOMRectReadOnly,
      } as IntersectionObserverEntry,
    ],
    {} as IntersectionObserver
  );

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("FileMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default every mocked composable to a successful async call, like the real
    // ones. Tests that need a failure or a pending promise override this with
    // mockRejectedValueOnce / mockReturnValueOnce, so state never leaks between tests.
    mocks.copyFile.mockResolvedValue(undefined);
    mocks.copyLink.mockResolvedValue(undefined);
    mocks.deleteFile.mockResolvedValue(undefined);
    mocks.downloadFile.mockResolvedValue(undefined);

    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          observerCallback = callback;
        }
        observe = observeMock;
        disconnect = disconnectMock;
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("opening and closing", () => {
    it("is closed by default and the trigger exposes aria state", async () => {
      const wrapper = await mountMenu();
      const trigger = wrapper.get(selector.trigger);

      expect(isOpen(wrapper)).toBe(false);
      expect(trigger.attributes("aria-haspopup")).toBe("menu");
      expect(trigger.attributes("aria-expanded")).toBe("false");
    });

    it("opens on trigger click and lists all actions in order", async () => {
      const wrapper = await mountMenu();

      await openMenu(wrapper);

      expect(isOpen(wrapper)).toBe(true);
      expect(wrapper.get(selector.trigger).attributes("aria-expanded")).toBe(
        "true"
      );
      const items = wrapper.findAll('[role="menuitem"]');
      expect(items.map((item) => item.text())).toEqual(LABELS);
    });

    it("closes on a second trigger click", async () => {
      const wrapper = await mountMenu();

      await openMenu(wrapper);
      await openMenu(wrapper);

      expect(isOpen(wrapper)).toBe(false);
    });

    it("highlights the first item when opened", async () => {
      const wrapper = await mountMenu();

      await openMenu(wrapper);

      expect(isHighlighted(wrapper, 0)).toBe(true);
      expect(isHighlighted(wrapper, 1)).toBe(false);
    });

    it("highlights an item on mouseover", async () => {
      const wrapper = await mountMenu();
      await openMenu(wrapper);

      await wrapper.get(selector.action("deleteFile")).trigger("mouseover");

      expect(isHighlighted(wrapper, 3)).toBe(true);
      expect(isHighlighted(wrapper, 0)).toBe(false);
    });
  });

  describe.each([
    {
      id: "copyLink",
      mock: mocks.copyLink,
      args: [FILE_NAME],
      emitsFileAction: false,
    },
    {
      id: "copyFile",
      mock: mocks.copyFile,
      args: [FILE_NAME, fileList],
      emitsFileAction: true,
    },
    {
      id: "downloadFile",
      mock: mocks.downloadFile,
      args: [FILE_NAME],
      emitsFileAction: false,
    },
    {
      id: "deleteFile",
      mock: mocks.deleteFile,
      args: [[FILE_NAME]],
      emitsFileAction: true,
    },
  ])("action: $id", ({ id, mock, args, emitsFileAction }) => {
    it("calls the composable, closes the menu and does not notify", async () => {
      const wrapper = await mountMenu();
      await openMenu(wrapper);

      await wrapper.get(selector.action(id)).trigger("click");
      await flushPromises();

      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(...args);
      expect(isOpen(wrapper)).toBe(false);
      expect(mocks.notify).not.toHaveBeenCalled();
      if (emitsFileAction) {
        expect(wrapper.emitted("fileAction")).toHaveLength(1);
      } else {
        expect(wrapper.emitted("fileAction")).toBeUndefined();
      }
    });

    it("closes the menu immediately, before the action finishes", async () => {
      mock.mockReturnValueOnce(new Promise(() => {}));
      const wrapper = await mountMenu();
      await openMenu(wrapper);

      await wrapper.get(selector.action(id)).trigger("click");

      expect(isOpen(wrapper)).toBe(false);
    });

    it("notifies with the error message when it fails", async () => {
      mock.mockRejectedValueOnce(new Error("Something broke"));
      const wrapper = await mountMenu();
      await openMenu(wrapper);

      await wrapper.get(selector.action(id)).trigger("click");
      await flushPromises();

      expect(mocks.notify).toHaveBeenCalledWith("error", "Something broke");
      expect(wrapper.emitted("fileAction")).toBeUndefined();
    });

    it("notifies with a fallback message for non-Error rejections", async () => {
      mock.mockRejectedValueOnce("boom");
      const wrapper = await mountMenu();
      await openMenu(wrapper);

      await wrapper.get(selector.action(id)).trigger("click");
      await flushPromises();

      expect(mocks.notify).toHaveBeenCalledWith(
        "error",
        "Unknown error occurred."
      );
    });
  });

  describe("action: renameFile", () => {
    it("opens the rename modal and closes the menu", async () => {
      const wrapper = await mountMenu();
      const modal = wrapper.findComponent({ name: "RenameFileModal" });
      expect(modal.props("isOpen")).toBe(false);
      expect(modal.props("fileName")).toBe(FILE_NAME);

      await openMenu(wrapper);
      await wrapper.get(selector.action("renameFile")).trigger("click");

      expect(isOpen(wrapper)).toBe(false);
      expect(modal.props("isOpen")).toBe(true);
    });

    it("closes the modal when it asks to be closed", async () => {
      const wrapper = await mountMenu();
      const modal = wrapper.findComponent({ name: "RenameFileModal" });
      await openMenu(wrapper);
      await wrapper.get(selector.action("renameFile")).trigger("click");

      modal.vm.$emit("closeRenameFileModal");
      await nextTick();

      expect(modal.props("isOpen")).toBe(false);
    });

    it("emits fileAction when the file name was updated", async () => {
      const wrapper = await mountMenu();
      const modal = wrapper.findComponent({ name: "RenameFileModal" });

      modal.vm.$emit("fileNameUpdated");
      await nextTick();

      expect(wrapper.emitted("fileAction")).toHaveLength(1);
    });
  });

  describe("keyboard navigation", () => {
    it("opens with Enter and highlights the first item", async () => {
      const wrapper = await mountMenu();

      await press(wrapper, "Enter");

      expect(isOpen(wrapper)).toBe(true);
      expect(isHighlighted(wrapper, 0)).toBe(true);
    });

    it("opens with Space", async () => {
      const wrapper = await mountMenu();

      await press(wrapper, " ");

      expect(isOpen(wrapper)).toBe(true);
    });

    it("prevents the default Space keyup (avoids a second toggle in Firefox)", async () => {
      const wrapper = await mountMenu();
      const event = new KeyboardEvent("keyup", {
        key: " ",
        bubbles: true,
        cancelable: true,
      });

      wrapper.get(selector.trigger).element.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
    });

    it("moves the highlight with ArrowDown and ArrowUp", async () => {
      const wrapper = await mountMenu();
      await openMenu(wrapper);

      await press(wrapper, "ArrowDown");
      expect(isHighlighted(wrapper, 1)).toBe(true);

      await press(wrapper, "ArrowUp");
      expect(isHighlighted(wrapper, 0)).toBe(true);
    });

    it("wraps around at both ends", async () => {
      const wrapper = await mountMenu();
      await openMenu(wrapper);

      await press(wrapper, "ArrowUp");
      expect(isHighlighted(wrapper, LABELS.length - 1)).toBe(true);

      await press(wrapper, "ArrowDown");
      expect(isHighlighted(wrapper, 0)).toBe(true);
    });

    it("ignores ArrowUp and ArrowDown while the menu is closed", async () => {
      const wrapper = await mountMenu();

      await press(wrapper, "ArrowDown");
      await press(wrapper, "ArrowDown");
      expect(isOpen(wrapper)).toBe(false);

      await press(wrapper, "Enter");
      expect(isHighlighted(wrapper, 0)).toBe(true);
    });

    it("runs the highlighted action on Enter", async () => {
      const wrapper = await mountMenu();
      await openMenu(wrapper);
      await press(wrapper, "ArrowDown");

      await press(wrapper, "Enter");
      await flushPromises();

      expect(mocks.copyFile).toHaveBeenCalledWith(FILE_NAME, fileList);
      expect(isOpen(wrapper)).toBe(false);
    });

    it("runs the highlighted action on Space", async () => {
      const wrapper = await mountMenu();
      await openMenu(wrapper);
      await press(wrapper, "ArrowDown");
      await press(wrapper, "ArrowDown");

      await press(wrapper, " ");
      await flushPromises();

      expect(mocks.downloadFile).toHaveBeenCalledWith(FILE_NAME);
    });

    it("closes on Escape", async () => {
      const wrapper = await mountMenu();
      await openMenu(wrapper);

      await press(wrapper, "Escape");

      expect(isOpen(wrapper)).toBe(false);
    });

    it("closes on Tab", async () => {
      const wrapper = await mountMenu();
      await openMenu(wrapper);

      await press(wrapper, "Tab");

      expect(isOpen(wrapper)).toBe(false);
    });

    it("resets the highlight when reopened by keyboard", async () => {
      const wrapper = await mountMenu();
      await openMenu(wrapper);
      await press(wrapper, "ArrowDown");
      await press(wrapper, "ArrowDown");
      await press(wrapper, "Escape");

      await press(wrapper, "Enter");

      expect(isHighlighted(wrapper, 0)).toBe(true);
    });
  });

  describe("click outside", () => {
    it("registers the root element and closes the menu from the callback", async () => {
      const wrapper = await mountMenu();
      await openMenu(wrapper);
      expect(isOpen(wrapper)).toBe(true);

      const [target, onClickOutside] = mocks.useClickOutside.mock.calls[0] as [
        Ref<HTMLElement | null>,
        () => void,
      ];
      expect(target.value).toBe(wrapper.get(selector.root).element);

      onClickOutside();
      await nextTick();

      expect(isOpen(wrapper)).toBe(false);
    });
  });

  describe("list position (IntersectionObserver)", () => {
    it("observes the root element and disconnects on unmount", async () => {
      const wrapper = await mountMenu();

      expect(observeMock).toHaveBeenCalledWith(
        wrapper.get(selector.root).element
      );

      wrapper.unmount();

      expect(disconnectMock).toHaveBeenCalledTimes(1);
    });

    it("opens downwards by default", async () => {
      const wrapper = await mountMenu();

      await openMenu(wrapper);

      expect(wrapper.get(selector.menu).classes()).toContain(
        "menu__list--bottom"
      );
    });

    it("flips to the top when partially visible and far down the page", async () => {
      const wrapper = await mountMenu();
      await openMenu(wrapper);

      fireIntersection({ intersectionRatio: 0.5, top: 500 });
      await nextTick();

      expect(wrapper.get(selector.menu).classes()).toContain("menu__list--top");
    });

    it("stays at the bottom when fully visible", async () => {
      const wrapper = await mountMenu();
      await openMenu(wrapper);

      fireIntersection({ intersectionRatio: 1, top: 500 });
      await nextTick();

      expect(wrapper.get(selector.menu).classes()).toContain(
        "menu__list--bottom"
      );
    });

    it("stays at the bottom when close to the top of the viewport", async () => {
      const wrapper = await mountMenu();
      await openMenu(wrapper);

      fireIntersection({ intersectionRatio: 0.5, top: 100 });
      await nextTick();

      expect(wrapper.get(selector.menu).classes()).toContain(
        "menu__list--bottom"
      );
    });
  });
});
