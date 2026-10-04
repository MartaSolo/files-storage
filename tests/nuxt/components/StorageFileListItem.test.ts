import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  mockComponent,
  mockNuxtImport,
  mountSuspended,
} from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import type { FileObject } from "@supabase/storage-js";
import StorageFileListItem from "@/components/StorageFileListItem.vue";
import { getSortType } from "@/utils/helpers/getSortTypes";
import {
  mockFileObject,
  mockFileObjectList,
} from "@/tests/fixtures/supabase/fileObject"; // adjust to where your helpers live

const { getFilePublicUrlMock, getPrivateUrlMock } = vi.hoisted(() => ({
  getFilePublicUrlMock: vi.fn(),
  getPrivateUrlMock: vi.fn(),
}));

mockNuxtImport("useRetrievePublicFileUrl", () => () => ({
  getFilePublicUrl: getFilePublicUrlMock,
}));

mockNuxtImport("useRetrievePrivateFileUrl", () => () => ({
  getPrivateUrl: getPrivateUrlMock,
}));

mockNuxtImport("useStorage", () => () => ({
  storage: { value: { bucket: "files", folder: "public" } },
}));

// Children have their own tests, here they are replaced by minimal stand-ins
// that keep the same root data-testid.
mockComponent("FileCheckbox", async () => {
  const { defineComponent, h } = await import("vue");
  return defineComponent({
    name: "FileCheckbox",
    props: { modelValue: Boolean, name: String, type: String },
    emits: ["update:modelValue"],
    setup: () => () => h("div", { "data-testid": "file-checkbox" }),
  });
});

mockComponent("FileMenu", async () => {
  const { defineComponent, h } = await import("vue");
  return defineComponent({
    name: "FileMenu",
    props: { fileName: String, fileList: Array },
    emits: ["file-action"],
    setup: () => () => h("div", { "data-testid": "file-menu" }),
  });
});

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

const PUBLIC_URL = "https://example.com/public/file";
const PRIVATE_URL = "https://example.com/private/file";

const testId = (id: string) => `[data-testid="${id}"]`;

// A file with no preview url needed, for tests that do not care about the type.
const textFile = (name = "notes.txt") =>
  mockFileObject({
    name,
    metadata: { size: 1500, mimetype: "text/plain" },
  });

const imageFile = () =>
  mockFileObject({
    name: "photo.png",
    metadata: { size: 1000, mimetype: "image/png" },
  });

const mountItem = (
  file: FileObject,
  props: { isSelected?: boolean; fileList?: FileObject[] } = {}
) =>
  mountSuspended(StorageFileListItem, {
    props: { file, fileList: [file], isSelected: false, ...props },
  });

describe("StorageFileListItem", () => {
  beforeEach(() => {
    clearNuxtData();
    useLayoutType().value = "grid";

    getFilePublicUrlMock.mockReset().mockReturnValue(PUBLIC_URL);
    getPrivateUrlMock.mockReset().mockResolvedValue(PRIVATE_URL);
  });

  describe("details", () => {
    it("renders the file name, size and type", async () => {
      const file = mockFileObject({
        name: "photo.png",
        metadata: { size: 1500, mimetype: "image/png" },
      });
      const wrapper = await mountItem(file);

      const typeText = wrapper.get(testId("file-item-type")).text();

      expect(wrapper.get(testId("file-item-name")).text()).toBe("photo.png");
      expect(wrapper.get(testId("file-item-size")).text()).toBe("size: 1.5KB");
      expect(typeText).toBe(`type: ${getSortType(file)}`);
      expect(typeText).not.toContain("}");
    });

    it.each([
      { size: undefined, expected: "size: unknown" },
      { size: 0, expected: "size: 0.0KB" },
      { size: 1500, expected: "size: 1.5KB" },
      { size: 999_999, expected: "size: 1000.0KB" },
      { size: 1_000_000, expected: "size: 1.0MB" },
      { size: 2_500_000, expected: "size: 2.5MB" },
    ])("formats size $size as '$expected'", async ({ size, expected }) => {
      const wrapper = await mountItem(
        mockFileObject({
          name: "notes.txt",
          metadata: { size, mimetype: "text/plain" },
        })
      );

      expect(wrapper.get(testId("file-item-size")).text()).toBe(expected);
    });

    it.each([
      { layout: "grid", expectedClass: "file--grid" },
      { layout: "list", expectedClass: "file--list" },
    ] as const)(
      "uses the $expectedClass class in $layout layout",
      async ({ layout, expectedClass }) => {
        useLayoutType().value = layout;
        const wrapper = await mountItem(textFile());

        expect(wrapper.get(testId("file-item")).classes()).toContain(
          expectedClass
        );
      }
    );
  });

  describe("selection", () => {
    it("passes isSelected, the name and the preview type to the checkbox", async () => {
      const wrapper = await mountItem(imageFile(), { isSelected: true });

      const checkbox = wrapper.getComponent({ name: "FileCheckbox" });

      expect(checkbox.props("modelValue")).toBe(true);
      expect(checkbox.props("name")).toBe("photo.png");
      expect(checkbox.props("type")).toBe("image");
    });

    it("emits addFile with the file name when the checkbox is checked", async () => {
      const wrapper = await mountItem(textFile("a.txt"));

      wrapper
        .getComponent({ name: "FileCheckbox" })
        .vm.$emit("update:modelValue", true);

      expect(wrapper.emitted("addFile")).toEqual([["a.txt"]]);
      expect(wrapper.emitted("removeFile")).toBeUndefined();
    });

    it("emits removeFile with the file name when the checkbox is unchecked", async () => {
      const wrapper = await mountItem(textFile("a.txt"), {
        isSelected: true,
      });

      wrapper
        .getComponent({ name: "FileCheckbox" })
        .vm.$emit("update:modelValue", false);

      expect(wrapper.emitted("removeFile")).toEqual([["a.txt"]]);
      expect(wrapper.emitted("addFile")).toBeUndefined();
    });
  });

  describe("file menu", () => {
    it("passes the file name and the file list to the menu", async () => {
      const file = mockFileObject({ name: "a.txt" });
      const fileList = [file, ...mockFileObjectList(2)];
      const wrapper = await mountItem(file, { fileList });

      const menu = wrapper.getComponent({ name: "FileMenu" });

      expect(menu.props("fileName")).toBe("a.txt");
      expect(menu.props("fileList")).toEqual(fileList);
    });

    it("emits updateFileList when the menu emits file-action", async () => {
      const wrapper = await mountItem(textFile());

      wrapper.getComponent({ name: "FileMenu" }).vm.$emit("file-action");

      expect(wrapper.emitted("updateFileList")).toHaveLength(1);
    });
  });

  describe("preview", () => {
    it("does not render the preview in list layout", async () => {
      useLayoutType().value = "list";
      const wrapper = await mountItem(textFile());

      expect(wrapper.find(testId("file-item-preview")).exists()).toBe(false);
    });

    it("renders the preview in grid layout", async () => {
      const wrapper = await mountItem(textFile());

      expect(wrapper.find(testId("file-item-preview")).exists()).toBe(true);
    });

    it.each([
      {
        name: "photo.png",
        mimetype: "image/png",
        expectedTestId: "file-item-preview-link",
      },
      {
        name: "clip.mp4",
        mimetype: "video/mp4",
        expectedTestId: "file-item-preview-video",
      },
      {
        name: "doc.pdf",
        mimetype: "application/pdf",
        expectedTestId: "file-item-preview-pdf",
      },
      {
        name: "REPORT.PDF",
        mimetype: "application/pdf",
        expectedTestId: "file-item-preview-pdf",
      },
    ])(
      "renders $expectedTestId for $name",
      async ({ name, mimetype, expectedTestId }) => {
        const wrapper = await mountItem(
          mockFileObject({ name, metadata: { size: 1000, mimetype } })
        );

        await vi.waitFor(() =>
          expect(wrapper.find(testId(expectedTestId)).exists()).toBe(true)
        );
        expect(
          wrapper.find(testId("file-item-preview-placeholder")).exists()
        ).toBe(false);
        expect(
          wrapper.find(testId("file-item-preview-component")).exists()
        ).toBe(false);
      }
    );

    it.each([
      { name: "report.docx", mimetype: DOCX_MIME, component: "DocxFile" },
      {
        name: "REPORT.DOCX",
        mimetype: "application/octet-stream",
        component: "DocxFile",
      },
      { name: "sheet.xlsx", mimetype: XLSX_MIME, component: "XlsxFile" },
      { name: "notes.txt", mimetype: "text/plain", component: "SomeFile" },
      { name: "mystery.bin", mimetype: undefined, component: "SomeFile" },
    ])(
      "renders $component for $name",
      async ({ name, mimetype, component }) => {
        const wrapper = await mountItem(
          mockFileObject({ name, metadata: { size: 1000, mimetype } })
        );

        expect(
          wrapper.find(testId("file-item-preview-component")).exists()
        ).toBe(true);
        expect(wrapper.findComponent({ name: component }).exists()).toBe(true);
        expect(
          wrapper.find(testId("file-item-preview-placeholder")).exists()
        ).toBe(false);
      }
    );

    it("sets href and alt on the image preview", async () => {
      const wrapper = await mountItem(imageFile());

      await vi.waitFor(() =>
        expect(wrapper.find(testId("file-item-preview-link")).exists()).toBe(
          true
        )
      );

      expect(
        wrapper.get(testId("file-item-preview-link")).attributes("href")
      ).toBe(PUBLIC_URL);
      expect(
        wrapper.get(testId("file-item-preview-image")).attributes("alt")
      ).toBe("photo.png");
    });

    it("sets src and type on the video source", async () => {
      const wrapper = await mountItem(
        mockFileObject({
          name: "clip.mp4",
          metadata: { size: 1000, mimetype: "video/mp4" },
        })
      );

      await vi.waitFor(() =>
        expect(
          wrapper.find(testId("file-item-preview-video-source")).exists()
        ).toBe(true)
      );

      const source = wrapper.get(testId("file-item-preview-video-source"));
      expect(source.attributes("src")).toBe(PUBLIC_URL);
      expect(source.attributes("type")).toBe("video/mp4");
    });

    it("sets data and type on the pdf object", async () => {
      const wrapper = await mountItem(
        mockFileObject({
          name: "doc.pdf",
          metadata: { size: 1000, mimetype: "application/pdf" },
        })
      );

      await vi.waitFor(() =>
        expect(wrapper.find(testId("file-item-preview-pdf")).exists()).toBe(
          true
        )
      );

      const pdf = wrapper.get(testId("file-item-preview-pdf"));
      expect(pdf.attributes("data")).toBe(PUBLIC_URL);
      expect(pdf.attributes("type")).toBe("application/pdf");
    });
  });

  describe("preview url fetching", () => {
    it("does not fetch any url in list layout", async () => {
      useLayoutType().value = "list";
      await mountItem(imageFile());
      await flushPromises();

      expect(getFilePublicUrlMock).not.toHaveBeenCalled();
      expect(getPrivateUrlMock).not.toHaveBeenCalled();
    });

    it("uses the public url when it is available", async () => {
      const wrapper = await mountItem(imageFile());

      await vi.waitFor(() =>
        expect(wrapper.find(testId("file-item-preview-link")).exists()).toBe(
          true
        )
      );

      expect(getFilePublicUrlMock).toHaveBeenCalledWith("photo.png");
      expect(getPrivateUrlMock).not.toHaveBeenCalled();
      expect(
        wrapper.get(testId("file-item-preview-link")).attributes("href")
      ).toBe(PUBLIC_URL);
    });

    it("falls back to the private url when there is no public url", async () => {
      getFilePublicUrlMock.mockReturnValue(undefined);
      const wrapper = await mountItem(imageFile());

      await vi.waitFor(() =>
        expect(wrapper.find(testId("file-item-preview-link")).exists()).toBe(
          true
        )
      );

      expect(getPrivateUrlMock).toHaveBeenCalledWith("photo.png");
      expect(
        wrapper.get(testId("file-item-preview-link")).attributes("href")
      ).toBe(PRIVATE_URL);
    });

    it.each([
      { name: "report.docx", mimetype: DOCX_MIME },
      { name: "sheet.xlsx", mimetype: XLSX_MIME },
      { name: "notes.txt", mimetype: "text/plain" },
    ])(
      "does not fetch any url for $name in grid layout",
      async ({ name, mimetype }) => {
        await mountItem(
          mockFileObject({ name, metadata: { size: 1000, mimetype } })
        );
        await flushPromises();

        expect(getFilePublicUrlMock).not.toHaveBeenCalled();
        expect(getPrivateUrlMock).not.toHaveBeenCalled();
      }
    );

    it("fetches the url once the layout switches from list to grid", async () => {
      useLayoutType().value = "list";
      const wrapper = await mountItem(imageFile());
      await flushPromises();
      expect(getFilePublicUrlMock).not.toHaveBeenCalled();

      useLayoutType().value = "grid";

      await vi.waitFor(() =>
        expect(getFilePublicUrlMock).toHaveBeenCalledWith("photo.png")
      );
      await vi.waitFor(() =>
        expect(wrapper.find(testId("file-item-preview-link")).exists()).toBe(
          true
        )
      );
    });

    it("renders the placeholder when no url can be resolved", async () => {
      getFilePublicUrlMock.mockReturnValue(undefined);
      getPrivateUrlMock.mockResolvedValue(undefined);
      const wrapper = await mountItem(
        mockFileObject({
          name: "doc.pdf",
          metadata: { size: 1000, mimetype: "application/pdf" },
        })
      );

      await vi.waitFor(() => expect(getPrivateUrlMock).toHaveBeenCalled());
      await flushPromises();

      expect(
        wrapper.find(testId("file-item-preview-placeholder")).exists()
      ).toBe(true);
      expect(wrapper.find(testId("file-item-preview-pdf")).exists()).toBe(
        false
      );
    });

    it("renders the placeholder when fetching the private url fails", async () => {
      getFilePublicUrlMock.mockReturnValue(undefined);
      getPrivateUrlMock.mockRejectedValue(new Error("boom"));
      const wrapper = await mountItem(imageFile());

      await vi.waitFor(() => expect(getPrivateUrlMock).toHaveBeenCalled());
      await flushPromises();

      expect(
        wrapper.find(testId("file-item-preview-placeholder")).exists()
      ).toBe(true);
      expect(wrapper.find(testId("file-item-preview-link")).exists()).toBe(
        false
      );
    });
  });

  describe("preview errors", () => {
    it("marks the video as a placeholder when the source fails to load", async () => {
      const wrapper = await mountItem(
        mockFileObject({
          name: "clip.mp4",
          metadata: { size: 1000, mimetype: "video/mp4" },
        })
      );

      await vi.waitFor(() =>
        expect(
          wrapper.find(testId("file-item-preview-video-source")).exists()
        ).toBe(true)
      );
      expect(
        wrapper.get(testId("file-item-preview-video")).classes()
      ).not.toContain("file__preview--placeholder");

      await wrapper
        .get(testId("file-item-preview-video-source"))
        .trigger("error");

      expect(
        wrapper.get(testId("file-item-preview-video")).classes()
      ).toContain("file__preview--placeholder");
    });

    it("marks the image link as a placeholder when the image fails to load", async () => {
      const wrapper = await mountItem(imageFile());

      await vi.waitFor(() =>
        expect(wrapper.find(testId("file-item-preview-image")).exists()).toBe(
          true
        )
      );
      expect(
        wrapper.get(testId("file-item-preview-link")).classes()
      ).not.toContain("file__preview--placeholder");

      await wrapper.get(testId("file-item-preview-image")).trigger("error");

      expect(wrapper.get(testId("file-item-preview-link")).classes()).toContain(
        "file__preview--placeholder"
      );
    });
  });
});
