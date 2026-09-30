import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref, type Ref } from "vue";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useUploadByDragAndDrop } from "@/composables/useUploadByDragAndDrop";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mocks = vi.hoisted(() => {
  const uploadToSupabase = vi.fn();

  return {
    // Fakes the last link of the chain: client.storage.from(bucket).upload(path, file)
    uploadToSupabase,
    // Fakes the first link: client.storage.from(bucket). Returns an object with `upload`
    fromStorage: vi.fn(() => ({ upload: uploadToSupabase })),
    // Fakes useSupabaseUser(). Placeholder here, a fresh ref is assigned in beforeEach
    user: null as unknown as Ref<{ id: string } | null>,
    // Fakes the value inside useStorage(): where files are uploaded
    storage: { bucket: "files", folder: "user-1" },
  };
});

mockNuxtImport("useSupabaseClient", () => () => ({
  storage: { from: mocks.fromStorage },
}));
mockNuxtImport("useSupabaseUser", () => () => mocks.user);
mockNuxtImport("useStorage", () => () => ({
  storage: { value: mocks.storage },
}));

// ---------------------------------------------------------------------------
// Test limits
// ---------------------------------------------------------------------------

const MAX_SIZE_MB = 1;
const MAX_FILES = 3;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1000000;

// ---------------------------------------------------------------------------
// Composable helper
// ---------------------------------------------------------------------------

// Creates a fresh instance of the composable with the limits above. Needed
// because the composable creates its refs on every call, so each test gets
// its own isolated state and nothing leaks between tests.
const createComposable = () => useUploadByDragAndDrop(MAX_SIZE_MB, MAX_FILES);

type Results = {
  errorMessages: Ref<string[]>;
  uploadedFiles: Ref<string[]>;
  notUploadedFiles: Ref<string[]>;
};

// Puts old results into the state, to prove later that something cleared them
// (or, for "does nothing" tests, that nothing did).
const fillResults = ({
  errorMessages,
  uploadedFiles,
  notUploadedFiles,
}: Results) => {
  errorMessages.value.push("old error");
  uploadedFiles.value.push("old-uploaded.txt");
  notUploadedFiles.value.push("old-failed.txt");
};

const expectResultsToBeEmpty = ({
  errorMessages,
  uploadedFiles,
  notUploadedFiles,
}: Results) => {
  expect(errorMessages.value).toEqual([]);
  expect(uploadedFiles.value).toEqual([]);
  expect(notUploadedFiles.value).toEqual([]);
};

// ---------------------------------------------------------------------------
// File helpers and fixtures
// ---------------------------------------------------------------------------

// Creates a File with the given name and size. The size is overridden with
// defineProperty so no real data is allocated (a "1MB" file costs nothing).
const createFile = (name: string, size = 100) => {
  const file = new File(["x"], name);
  Object.defineProperty(file, "size", { value: size });
  return file;
};

// Creates a file just over the size limit, so the composable must reject it.
const createTooBigFile = (name: string) => createFile(name, MAX_SIZE_BYTES + 1);

// Creates a list of valid, uniquely named files (file-0.txt, file-1.txt, ...).
const createFiles = (count: number) =>
  Array.from({ length: count }, (_, i) => createFile(`file-${i}.txt`));

// Fixtures: ready-made files reused across tests. Safe to share because the
// composable never mutates File objects.
const validFile = createFile("report.pdf");
const tooBigFile = createTooBigFile("huge.zip");
const validFiles = createFiles(2); // a small batch under all limits
const maxAllowedFiles = createFiles(MAX_FILES); // exactly at the file count limit
const tooManyFiles = createFiles(MAX_FILES + 1); // one over the file count limit

// ---------------------------------------------------------------------------
// Event helpers
// ---------------------------------------------------------------------------
// Fake events containing only the fields each composable handler reads.
// Real DragEvent/DataTransfer support in happy-dom is patchy, so plain objects
// are more reliable. Each call returns a fresh object, so spies like
// stopPropagation never leak call counts between tests.

// For handleDrag: reads `type` ("dragenter", "dragover", "dragleave").
const createDragEvent = (type: string) => ({ type }) as DragEvent;

// For handleUpload: reads `target.files` (the native file input path).
const createUploadEvent = (files: File[]) =>
  ({ target: { files } }) as unknown as Event;

// For handleDrop, first branch: reads `dataTransfer.items`.
// Each item exposes `kind` and `getAsFile()` like a real DataTransferItem.
const createItemsDropEvent = (files: File[]) =>
  ({
    stopPropagation: vi.fn(),
    dataTransfer: {
      items: files.map((file) => ({
        kind: "file",
        getAsFile: () => file,
      })),
    },
  }) as unknown as DragEvent;

// For handleDrop, fallback branch: reads `dataTransfer.files`
// (used when `dataTransfer.items` is not available).
const createFilesDropEvent = (files: File[]) =>
  ({
    stopPropagation: vi.fn(),
    dataTransfer: { files },
  }) as unknown as DragEvent;

// For handleKeydown: reads `code` (only "Enter" does anything).
const createKeydownEvent = (code: string) => ({ code }) as KeyboardEvent;

// Gives the composable a root element containing the hidden file input, like
// the real template does, and returns a spy on the input's click().
const attachFileInputToRoot = (root: Ref<HTMLElement | null>) => {
  const container = document.createElement("div");
  const input = document.createElement("input");
  input.id = "file";
  input.type = "file";
  container.appendChild(input);
  root.value = container;
  return vi.spyOn(input, "click");
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  mocks.user = ref(null);
  mocks.fromStorage.mockClear();
  mocks.uploadToSupabase.mockReset();
  mocks.uploadToSupabase.mockResolvedValue({ error: null });
});

describe("useUploadByDragAndDrop", () => {
  describe("dropzone highlight while dragging (handleDrag)", () => {
    it.each(["dragenter", "dragover"])(
      "activates the dropzone and clears old results on %s",
      (type) => {
        const {
          handleDrag,
          isDragActive,
          errorMessages,
          uploadedFiles,
          notUploadedFiles,
        } = createComposable();
        fillResults({ errorMessages, uploadedFiles, notUploadedFiles });

        handleDrag(createDragEvent(type));

        expect(isDragActive.value).toBe(true);
        expectResultsToBeEmpty({
          errorMessages,
          uploadedFiles,
          notUploadedFiles,
        });
      }
    );

    it("deactivates the dropzone on dragleave", () => {
      const { handleDrag, isDragActive } = createComposable();
      handleDrag(createDragEvent("dragenter"));

      handleDrag(createDragEvent("dragleave"));

      expect(isDragActive.value).toBe(false);
    });
  });

  describe("uploading files via the file input (handleUpload)", () => {
    it("uploads a single valid file to the user's folder", async () => {
      const { handleUpload, uploadedFiles, notUploadedFiles, errorMessages } =
        createComposable();

      await handleUpload(createUploadEvent([validFile]));

      expect(mocks.fromStorage).toHaveBeenCalledWith(mocks.storage.bucket);
      expect(mocks.uploadToSupabase).toHaveBeenCalledWith(
        `${mocks.storage.folder}/${validFile.name}`,
        validFile
      );
      expect(uploadedFiles.value).toEqual([validFile.name]);
      expect(notUploadedFiles.value).toEqual([]);
      expect(errorMessages.value).toEqual([]);
    });

    it("uploads multiple valid files", async () => {
      const { handleUpload, uploadedFiles, errorMessages } = createComposable();

      await handleUpload(createUploadEvent(validFiles));

      expect(mocks.uploadToSupabase).toHaveBeenCalledTimes(validFiles.length);
      expect(uploadedFiles.value).toHaveLength(validFiles.length);
      expect(uploadedFiles.value).toEqual(
        expect.arrayContaining(validFiles.map((file) => file.name))
      );
      expect(errorMessages.value).toEqual([]);
    });

    it("skips a file over the size limit and shows a size error", async () => {
      const { handleUpload, uploadedFiles, notUploadedFiles, errorMessages } =
        createComposable();

      await handleUpload(createUploadEvent([tooBigFile]));

      expect(mocks.uploadToSupabase).not.toHaveBeenCalled();
      expect(uploadedFiles.value).toEqual([]);
      expect(notUploadedFiles.value).toEqual([tooBigFile.name]);
      expect(errorMessages.value).toEqual([
        "Error: some files have exceeded size",
      ]);
    });

    it("uploads the valid files and skips only the oversized one in a mixed batch", async () => {
      const { handleUpload, uploadedFiles, notUploadedFiles, errorMessages } =
        createComposable();

      await handleUpload(createUploadEvent([validFile, tooBigFile]));

      expect(uploadedFiles.value).toEqual([validFile.name]);
      expect(notUploadedFiles.value).toEqual([tooBigFile.name]);
      expect(errorMessages.value).toEqual([
        "Error: some files have exceeded size",
      ]);
    });

    it("accepts exactly the maximum number of files", async () => {
      const { handleUpload, uploadedFiles, errorMessages } = createComposable();

      await handleUpload(createUploadEvent(maxAllowedFiles));

      expect(uploadedFiles.value).toHaveLength(MAX_FILES);
      expect(errorMessages.value).toEqual([]);
    });

    it("uploads nothing and shows an error when over the maximum number of files", async () => {
      const { handleUpload, uploadedFiles, errorMessages } = createComposable();

      await handleUpload(createUploadEvent(tooManyFiles));

      expect(mocks.uploadToSupabase).not.toHaveBeenCalled();
      expect(uploadedFiles.value).toEqual([]);
      expect(errorMessages.value).toEqual([
        `You can upload up to ${MAX_FILES} files at a time!`,
      ]);
    });

    it("records a Supabase error for a failed upload without throwing", async () => {
      mocks.uploadToSupabase.mockResolvedValue({
        error: { message: "Duplicate" },
      });
      const { handleUpload, uploadedFiles, notUploadedFiles, errorMessages } =
        createComposable();

      await expect(
        handleUpload(createUploadEvent([validFile]))
      ).resolves.toBeUndefined();

      expect(uploadedFiles.value).toEqual([]);
      expect(notUploadedFiles.value).toEqual([validFile.name]);
      expect(errorMessages.value).toEqual(["Error: Duplicate"]);
    });

    it("still uploads the other files when one upload fails", async () => {
      mocks.uploadToSupabase
        .mockResolvedValueOnce({ error: null })
        .mockResolvedValueOnce({ error: { message: "Duplicate" } });
      const [firstFile, secondFile] = validFiles;
      const { handleUpload, uploadedFiles, notUploadedFiles, errorMessages } =
        createComposable();

      await handleUpload(createUploadEvent(validFiles));

      expect(uploadedFiles.value).toEqual([firstFile?.name]);
      expect(notUploadedFiles.value).toEqual([secondFile?.name]);
      expect(errorMessages.value).toEqual(["Error: Duplicate"]);
    });

    it("does nothing when no files are provided", async () => {
      const { handleUpload, errorMessages, uploadedFiles, notUploadedFiles } =
        createComposable();

      await handleUpload(createUploadEvent([]));

      expect(mocks.uploadToSupabase).not.toHaveBeenCalled();
      expectResultsToBeEmpty({
        errorMessages,
        uploadedFiles,
        notUploadedFiles,
      });
    });
  });

  describe("dropping files via dataTransfer.items (handleDrop)", () => {
    it("deactivates the dropzone and stops propagation", async () => {
      const { handleDrag, handleDrop, isDragActive } = createComposable();
      handleDrag(createDragEvent("dragenter"));
      const event = createItemsDropEvent([validFile]);

      await handleDrop(event);

      expect(isDragActive.value).toBe(false);
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it("uploads a single valid file to the user's folder", async () => {
      const { handleDrop, uploadedFiles, notUploadedFiles, errorMessages } =
        createComposable();

      await handleDrop(createItemsDropEvent([validFile]));

      expect(mocks.uploadToSupabase).toHaveBeenCalledWith(
        `${mocks.storage.folder}/${validFile.name}`,
        validFile
      );
      expect(uploadedFiles.value).toEqual([validFile.name]);
      expect(notUploadedFiles.value).toEqual([]);
      expect(errorMessages.value).toEqual([]);
    });

    it("uploads multiple valid files", async () => {
      const { handleDrop, uploadedFiles, errorMessages } = createComposable();

      await handleDrop(createItemsDropEvent(validFiles));

      expect(uploadedFiles.value).toHaveLength(validFiles.length);
      expect(uploadedFiles.value).toEqual(
        expect.arrayContaining(validFiles.map((file) => file.name))
      );
      expect(errorMessages.value).toEqual([]);
    });

    it("skips a file over the size limit and shows a size error", async () => {
      const { handleDrop, uploadedFiles, notUploadedFiles, errorMessages } =
        createComposable();

      await handleDrop(createItemsDropEvent([tooBigFile]));

      expect(mocks.uploadToSupabase).not.toHaveBeenCalled();
      expect(uploadedFiles.value).toEqual([]);
      expect(notUploadedFiles.value).toEqual([tooBigFile.name]);
      expect(errorMessages.value).toEqual([
        "Error: some files have exceeded size",
      ]);
    });

    it("uploads the valid files and skips only the oversized one in a mixed batch", async () => {
      const { handleDrop, uploadedFiles, notUploadedFiles, errorMessages } =
        createComposable();

      await handleDrop(createItemsDropEvent([validFile, tooBigFile]));

      expect(uploadedFiles.value).toEqual([validFile.name]);
      expect(notUploadedFiles.value).toEqual([tooBigFile.name]);
      expect(errorMessages.value).toEqual([
        "Error: some files have exceeded size",
      ]);
    });

    it("accepts exactly the maximum number of files", async () => {
      const { handleDrop, uploadedFiles, errorMessages } = createComposable();

      await handleDrop(createItemsDropEvent(maxAllowedFiles));

      expect(uploadedFiles.value).toHaveLength(MAX_FILES);
      expect(errorMessages.value).toEqual([]);
    });

    it("uploads nothing and shows an error when over the maximum number of files", async () => {
      const { handleDrop, uploadedFiles, errorMessages } = createComposable();

      await handleDrop(createItemsDropEvent(tooManyFiles));

      expect(mocks.uploadToSupabase).not.toHaveBeenCalled();
      expect(uploadedFiles.value).toEqual([]);
      expect(errorMessages.value).toEqual([
        `You can upload up to ${MAX_FILES} files at a time!`,
      ]);
    });

    it("records a Supabase error for a failed upload without throwing", async () => {
      mocks.uploadToSupabase.mockResolvedValue({
        error: { message: "Duplicate" },
      });
      const { handleDrop, uploadedFiles, notUploadedFiles, errorMessages } =
        createComposable();

      await expect(
        handleDrop(createItemsDropEvent([validFile]))
      ).resolves.toBeUndefined();

      expect(uploadedFiles.value).toEqual([]);
      expect(notUploadedFiles.value).toEqual([validFile.name]);
      expect(errorMessages.value).toEqual(["Error: Duplicate"]);
    });

    it("still uploads the other files when one upload fails", async () => {
      mocks.uploadToSupabase
        .mockResolvedValueOnce({ error: null })
        .mockResolvedValueOnce({ error: { message: "Duplicate" } });
      const [firstFile, secondFile] = validFiles;
      const { handleDrop, uploadedFiles, notUploadedFiles, errorMessages } =
        createComposable();

      await handleDrop(createItemsDropEvent(validFiles));

      expect(uploadedFiles.value).toEqual([firstFile.name]);
      expect(notUploadedFiles.value).toEqual([secondFile.name]);
      expect(errorMessages.value).toEqual(["Error: Duplicate"]);
    });

    it("does nothing when no files are provided", async () => {
      const { handleDrop, errorMessages, uploadedFiles, notUploadedFiles } =
        createComposable();

      await handleDrop(createItemsDropEvent([]));

      expect(mocks.uploadToSupabase).not.toHaveBeenCalled();
      expectResultsToBeEmpty({
        errorMessages,
        uploadedFiles,
        notUploadedFiles,
      });
    });

    it("ignores dropped items that are not files", async () => {
      const { handleDrop, errorMessages, uploadedFiles, notUploadedFiles } =
        createComposable();
      // Built inline: needs an item of kind "string", which no helper produces.
      const event = {
        stopPropagation: vi.fn(),
        dataTransfer: {
          items: [{ kind: "string", getAsFile: () => null }],
        },
      } as unknown as DragEvent;

      await handleDrop(event);

      expect(mocks.uploadToSupabase).not.toHaveBeenCalled();
      expectResultsToBeEmpty({
        errorMessages,
        uploadedFiles,
        notUploadedFiles,
      });
    });
  });

  describe("dropping files via dataTransfer.files (handleDrop fallback)", () => {
    // This branch only runs when dataTransfer.items is unavailable. Its logic
    // mirrors the items branch above, so it gets a smaller smoke-test set
    // rather than the full scenario list.
    it("uploads a single valid file to the user's folder", async () => {
      const { handleDrop, uploadedFiles, notUploadedFiles, errorMessages } =
        createComposable();

      await handleDrop(createFilesDropEvent([validFile]));

      expect(mocks.uploadToSupabase).toHaveBeenCalledWith(
        `${mocks.storage.folder}/${validFile.name}`,
        validFile
      );
      expect(uploadedFiles.value).toEqual([validFile.name]);
      expect(notUploadedFiles.value).toEqual([]);
      expect(errorMessages.value).toEqual([]);
    });

    it("deactivates the dropzone and stops propagation", async () => {
      const { handleDrag, handleDrop, isDragActive } = createComposable();
      handleDrag(createDragEvent("dragenter"));
      const event = createFilesDropEvent([validFile]);

      await handleDrop(event);

      expect(isDragActive.value).toBe(false);
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it("uploads nothing and shows an error when over the maximum number of files", async () => {
      const { handleDrop, uploadedFiles, errorMessages } = createComposable();

      await handleDrop(createFilesDropEvent(tooManyFiles));

      expect(mocks.uploadToSupabase).not.toHaveBeenCalled();
      expect(uploadedFiles.value).toEqual([]);
      expect(errorMessages.value).toEqual([
        `You can upload up to ${MAX_FILES} files at a time!`,
      ]);
    });
  });

  describe("opening the file dialog with the keyboard (handleKeydown)", () => {
    it("opens the file dialog and clears old results on Enter", () => {
      const {
        handleKeydown,
        root,
        errorMessages,
        uploadedFiles,
        notUploadedFiles,
      } = createComposable();
      const clickSpy = attachFileInputToRoot(root);
      fillResults({ errorMessages, uploadedFiles, notUploadedFiles });

      handleKeydown(createKeydownEvent("Enter"));

      expect(clickSpy).toHaveBeenCalledOnce();
      expectResultsToBeEmpty({
        errorMessages,
        uploadedFiles,
        notUploadedFiles,
      });
    });

    it("does nothing on other keys", () => {
      const {
        handleKeydown,
        root,
        errorMessages,
        uploadedFiles,
        notUploadedFiles,
      } = createComposable();
      const clickSpy = attachFileInputToRoot(root);
      fillResults({ errorMessages, uploadedFiles, notUploadedFiles });

      handleKeydown(createKeydownEvent("KeyA"));

      expect(clickSpy).not.toHaveBeenCalled();
      expect(errorMessages.value).toEqual(["old error"]);
    });
  });

  describe("clearing the upload results (resetState)", () => {
    it("empties errors, uploaded files and not uploaded files", () => {
      const { resetState, errorMessages, uploadedFiles, notUploadedFiles } =
        createComposable();
      fillResults({ errorMessages, uploadedFiles, notUploadedFiles });

      resetState();

      expectResultsToBeEmpty({
        errorMessages,
        uploadedFiles,
        notUploadedFiles,
      });
    });
  });

  describe("clearing the upload results when the user changes (watch on user)", () => {
    it("resets the state when the logged in user changes", async () => {
      const { errorMessages, uploadedFiles, notUploadedFiles } =
        createComposable();
      fillResults({ errorMessages, uploadedFiles, notUploadedFiles });

      mocks.user.value = { id: "another-user" };
      await nextTick();

      expectResultsToBeEmpty({
        errorMessages,
        uploadedFiles,
        notUploadedFiles,
      });
    });
  });
});
