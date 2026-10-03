import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import type { FileObject } from "@supabase/storage-js";
import MultipleFilesMenu from "@/components/MultipleFilesMenu.vue";

const { deleteFileMock, downloadFileMock, copyFilesMock, notifyMock } =
  vi.hoisted(() => ({
    deleteFileMock: vi.fn(),
    downloadFileMock: vi.fn(),
    copyFilesMock: vi.fn(),
    notifyMock: vi.fn(),
  }));

mockNuxtImport("useDeleteFile", () => () => ({ deleteFile: deleteFileMock }));
mockNuxtImport("useDownloadFile", () => () => ({
  downloadFile: downloadFileMock,
}));
mockNuxtImport("useCopyFile", () => () => ({ copyFiles: copyFilesMock }));
mockNuxtImport("useNotification", () => () => ({ notify: notifyMock }));

const fileList = [{ name: "a.png" }, { name: "b.png" }] as FileObject[];
const selectedFiles = ["a.png", "b.png"];

type ButtonName = "clear" | "copy" | "download" | "delete";
const buttonNames: ButtonName[] = ["clear", "copy", "download", "delete"];

let events: string[] = [];

const mountMenu = (props: { selectedFiles?: string[] } = {}) =>
  mountSuspended(MultipleFilesMenu, {
    props: {
      fileList,
      selectedFiles,
      onClearSelection: () => events.push("clearSelection"),
      onFilesAction: () => events.push("filesAction"),
      ...props,
    },
  });

type MenuWrapper = Awaited<ReturnType<typeof mountMenu>>;

const getButton = (wrapper: MenuWrapper, name: ButtonName) =>
  wrapper.get(`[data-testid="multiple-files-menu-${name}"]`);

const isButtonDisabled = (wrapper: MenuWrapper, name: ButtonName) =>
  (getButton(wrapper, name).element as HTMLButtonElement).disabled;

describe("MultipleFilesMenu", () => {
  beforeEach(() => {
    events = [];
    vi.resetAllMocks();
    copyFilesMock.mockResolvedValue(undefined);
    deleteFileMock.mockResolvedValue(undefined);
    downloadFileMock.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("label", () => {
    it.each([
      { label: "0 files selected", selectedFiles: [] as string[] },
      { label: "1 file selected", selectedFiles: ["a.png"] },
      { label: "3 files selected", selectedFiles: ["a.png", "b.png", "c.png"] },
    ])(
      'shows "$label" when $selectedFiles.length files are selected',
      async ({ selectedFiles, label }) => {
        const wrapper = await mountMenu({ selectedFiles });

        expect(
          wrapper.get('[data-testid="multiple-files-menu-label"]').text()
        ).toBe(label);
      }
    );
  });

  describe("disabled state", () => {
    it("marks the menu inactive and disables all buttons when nothing is selected", async () => {
      const wrapper = await mountMenu({ selectedFiles: [] });

      expect(
        wrapper.get('[data-testid="multiple-files-menu"]').classes()
      ).toContain("inactive");
      buttonNames.forEach((name) => {
        expect(isButtonDisabled(wrapper, name)).toBe(true);
      });
    });

    it("enables all buttons when files are selected", async () => {
      const wrapper = await mountMenu();

      expect(
        wrapper.get('[data-testid="multiple-files-menu"]').classes()
      ).not.toContain("inactive");
      buttonNames.forEach((name) => {
        expect(isButtonDisabled(wrapper, name)).toBe(false);
      });
    });
  });

  describe("clear selection", () => {
    it("emits clearSelection once", async () => {
      const wrapper = await mountMenu();

      await getButton(wrapper, "clear").trigger("click");

      expect(events).toEqual(["clearSelection"]);
    });
  });

  describe.each([
    {
      action: "copy",
      button: "copy" as ButtonName,
      mock: copyFilesMock,
      expectedArgs: [selectedFiles, fileList],
    },
    {
      action: "delete",
      button: "delete" as ButtonName,
      mock: deleteFileMock,
      expectedArgs: [selectedFiles],
    },
  ])("$action files", ({ button, mock, expectedArgs }) => {
    it("calls the composable with the right arguments", async () => {
      const wrapper = await mountMenu();

      await getButton(wrapper, button).trigger("click");
      await flushPromises();

      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(...expectedArgs);
    });

    it("emits clearSelection and then filesAction on success", async () => {
      const wrapper = await mountMenu();

      await getButton(wrapper, button).trigger("click");
      await flushPromises();

      expect(events).toEqual(["clearSelection", "filesAction"]);
      expect(notifyMock).not.toHaveBeenCalled();
    });

    it("notifies the error message, keeps the selection and still emits filesAction when it fails", async () => {
      mock.mockRejectedValue(new Error("Boom"));
      const wrapper = await mountMenu();

      await getButton(wrapper, button).trigger("click");
      await flushPromises();

      expect(notifyMock).toHaveBeenCalledWith("error", "Boom");
      expect(events).toEqual(["filesAction"]);
    });

    it("notifies a generic message when a non-Error value is thrown", async () => {
      mock.mockRejectedValue("nope");
      const wrapper = await mountMenu();

      await getButton(wrapper, button).trigger("click");
      await flushPromises();

      expect(notifyMock).toHaveBeenCalledWith(
        "error",
        "Unknown error occurred."
      );
    });

    it("disables all buttons while pending and enables them again afterwards", async () => {
      let resolve!: () => void;
      mock.mockReturnValue(
        new Promise<void>((res) => {
          resolve = res;
        })
      );
      const wrapper = await mountMenu();

      await getButton(wrapper, button).trigger("click");

      buttonNames.forEach((name) => {
        expect(isButtonDisabled(wrapper, name)).toBe(true);
      });

      resolve();
      await flushPromises();

      buttonNames.forEach((name) => {
        expect(isButtonDisabled(wrapper, name)).toBe(false);
      });
    });

    it("re-enables the buttons after a failure", async () => {
      mock.mockRejectedValue(new Error("Boom"));
      const wrapper = await mountMenu();

      await getButton(wrapper, button).trigger("click");
      await flushPromises();

      buttonNames.forEach((name) => {
        expect(isButtonDisabled(wrapper, name)).toBe(false);
      });
    });
  });

  describe("download files", () => {
    const threeFiles = ["a.png", "b.png", "c.png"];

    it("downloads each file with a one second delay between them", async () => {
      const wrapper = await mountMenu({ selectedFiles: threeFiles });
      vi.useFakeTimers();

      await getButton(wrapper, "download").trigger("click");
      expect(downloadFileMock).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(0);
      expect(downloadFileMock).toHaveBeenCalledTimes(1);
      expect(downloadFileMock).toHaveBeenLastCalledWith("a.png");

      await vi.advanceTimersByTimeAsync(999);
      expect(downloadFileMock).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(1);
      expect(downloadFileMock).toHaveBeenCalledTimes(2);
      expect(downloadFileMock).toHaveBeenLastCalledWith("b.png");

      await vi.advanceTimersByTimeAsync(1000);
      expect(downloadFileMock).toHaveBeenCalledTimes(3);
      expect(downloadFileMock).toHaveBeenLastCalledWith("c.png");
    });

    it("emits clearSelection exactly once, immediately, and never filesAction", async () => {
      const wrapper = await mountMenu({ selectedFiles: threeFiles });
      vi.useFakeTimers();

      await getButton(wrapper, "download").trigger("click");
      expect(events).toEqual(["clearSelection"]);

      await vi.advanceTimersByTimeAsync(3000);
      expect(events).toEqual(["clearSelection"]);
    });

    it("notifies the error and keeps downloading the remaining files when one fails", async () => {
      downloadFileMock.mockRejectedValueOnce(new Error("Download failed"));
      const wrapper = await mountMenu({ selectedFiles: threeFiles });
      vi.useFakeTimers();

      await getButton(wrapper, "download").trigger("click");
      await vi.advanceTimersByTimeAsync(0);

      expect(notifyMock).toHaveBeenCalledWith("error", "Download failed");

      await vi.advanceTimersByTimeAsync(2000);
      expect(downloadFileMock).toHaveBeenCalledTimes(3);
    });
  });
});
