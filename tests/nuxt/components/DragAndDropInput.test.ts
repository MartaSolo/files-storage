import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import DragAndDropInput from "@/components/DragAndDropInput.vue";

const composableMock = vi.hoisted(() => ({
  handleDrag: vi.fn(),
  handleDrop: vi.fn(),
  handleKeydown: vi.fn(),
  handleUpload: vi.fn(),
  resetState: vi.fn(),
  // Placeholders. `ref` isn't safe to call inside vi.hoisted (the `vue`
  // import isn't initialized yet at this point), so these become real refs
  // in beforeEach instead.
  isDragActive: null as unknown as Ref<boolean>,
  errorMessages: null as unknown as Ref<string[]>,
  uploadedFiles: null as unknown as Ref<string[]>,
  notUploadedFiles: null as unknown as Ref<string[]>,
  root: null as unknown as Ref<HTMLElement | null>,
}));

const useUploadByDragAndDropMock = vi.hoisted(() =>
  vi.fn(() => composableMock)
);

mockNuxtImport("useUploadByDragAndDrop", () => useUploadByDragAndDropMock);

// Arbitrary and distinct from each other, so a call-argument-order bug
// (passing maxFilesNumber where maxFileSizeMB is expected) would be caught.
const testProps = {
  maxFilesNumber: 5,
  maxFileSizeMB: 2,
};

const mountComponent = () =>
  mountSuspended(DragAndDropInput, { props: testProps });

beforeEach(() => {
  composableMock.isDragActive = ref(false);
  composableMock.errorMessages = ref([]);
  composableMock.uploadedFiles = ref([]);
  composableMock.notUploadedFiles = ref([]);
  composableMock.root = ref(null);

  composableMock.handleDrag.mockClear();
  composableMock.handleDrop.mockClear();
  composableMock.handleKeydown.mockClear();
  composableMock.handleUpload.mockClear();
  composableMock.resetState.mockClear();

  useUploadByDragAndDropMock.mockClear();
});

describe("DragAndDropInput", () => {
  describe("props to composable wiring", () => {
    it("calls useUploadByDragAndDrop with maxFileSizeMB then maxFilesNumber", async () => {
      await mountComponent();

      expect(useUploadByDragAndDropMock).toHaveBeenCalledWith(
        testProps.maxFileSizeMB,
        testProps.maxFilesNumber
      );
    });

    it("renders the max-files/max-size info text from props", async () => {
      const wrapper = await mountComponent();

      const info = wrapper.find(".drag-and-drop__info");

      expect(info.text()).toContain(String(testProps.maxFilesNumber));
      expect(info.text()).toContain(String(testProps.maxFileSizeMB));
    });
  });

  describe("dropzone state", () => {
    it("applies the active class when isDragActive is true", async () => {
      composableMock.isDragActive.value = true;
      const wrapper = await mountComponent();

      expect(wrapper.find('[data-testid="dropzone"]').classes()).toContain(
        "drag-and-drop__dropzone--active"
      );
    });

    it("does not apply the active class when isDragActive is false", async () => {
      const wrapper = await mountComponent();

      expect(wrapper.find('[data-testid="dropzone"]').classes()).not.toContain(
        "drag-and-drop__dropzone--active"
      );
    });

    it("calls handleDrag on dragenter, dragover and dragleave", async () => {
      const wrapper = await mountComponent();
      const dropzone = wrapper.find('[data-testid="dropzone"]');

      await dropzone.trigger("dragenter");
      await dropzone.trigger("dragover");
      await dropzone.trigger("dragleave");

      expect(composableMock.handleDrag).toHaveBeenCalledTimes(3);
    });

    it("calls handleDrop on drop", async () => {
      const wrapper = await mountComponent();

      await wrapper.find('[data-testid="dropzone"]').trigger("drop");

      expect(composableMock.handleDrop).toHaveBeenCalledOnce();
    });
  });

  describe("upload label", () => {
    it("calls handleKeydown on keydown", async () => {
      const wrapper = await mountComponent();

      await wrapper.find('[data-testid="upload-label"]').trigger("keydown");

      expect(composableMock.handleKeydown).toHaveBeenCalledOnce();
    });

    it("calls resetState on click", async () => {
      const wrapper = await mountComponent();

      await wrapper.find('[data-testid="upload-label"]').trigger("click");

      expect(composableMock.resetState).toHaveBeenCalledOnce();
    });
  });

  describe("file input", () => {
    it("calls handleUpload on change", async () => {
      const wrapper = await mountComponent();

      await wrapper.find('[data-testid="file-input"]').trigger("change");

      expect(composableMock.handleUpload).toHaveBeenCalledOnce();
    });
  });

  describe("conditional rendering", () => {
    it("renders the uploaded file list when uploadedFiles is non-empty", async () => {
      composableMock.uploadedFiles.value = ["report.pdf"];
      const wrapper = await mountComponent();

      const list = wrapper.find('[data-testid="uploaded-file-list"]');

      expect(list.exists()).toBe(true);
      expect(list.text()).toContain("report.pdf");
    });

    it("does not render the uploaded file list when uploadedFiles is empty", async () => {
      const wrapper = await mountComponent();

      expect(wrapper.find('[data-testid="uploaded-file-list"]').exists()).toBe(
        false
      );
    });

    it("renders the not-uploaded file list when notUploadedFiles is non-empty", async () => {
      composableMock.notUploadedFiles.value = ["huge.zip"];
      const wrapper = await mountComponent();

      const list = wrapper.find('[data-testid="not-uploaded-file-list"]');

      expect(list.exists()).toBe(true);
      expect(list.text()).toContain("huge.zip");
    });

    it("does not render the not-uploaded file list when notUploadedFiles is empty", async () => {
      const wrapper = await mountComponent();

      expect(
        wrapper.find('[data-testid="not-uploaded-file-list"]').exists()
      ).toBe(false);
    });

    it("renders one error message per entry in errorMessages", async () => {
      composableMock.errorMessages.value = [
        "Error: too big",
        "Error: too many",
      ];
      const wrapper = await mountComponent();

      const messages = wrapper.findAll('[data-testid="error-message"]');

      expect(messages).toHaveLength(2);
      expect(messages.map((m) => m.text())).toEqual([
        "Error: too big",
        "Error: too many",
      ]);
    });

    it("does not render error messages when errorMessages is empty", async () => {
      const wrapper = await mountComponent();

      expect(wrapper.find('[data-testid="error-messages"]').exists()).toBe(
        false
      );
    });
  });
});
