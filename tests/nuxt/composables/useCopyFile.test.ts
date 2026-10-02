import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useCopyFile } from "@/composables/useCopyFile";
import { mockFileObjectVariants } from "../../fixtures/supabase/fileObject";

const { copyMock, fromMock, storageMock } = vi.hoisted(() => {
  const copyMock = vi.fn();
  const fromMock = vi.fn((_bucket: string) => ({ copy: copyMock }));
  const storageMock = { value: { bucket: "files", folder: "user-1" } };
  return { copyMock, fromMock, storageMock };
});

mockNuxtImport("useSupabaseClient", () => () => ({
  storage: { from: fromMock },
}));

mockNuxtImport("useStorage", () => () => ({
  storage: storageMock,
}));

const filesNamed = (...names: string[]) =>
  mockFileObjectVariants(names.map((name) => ({ name })));

describe("useCopyFile", () => {
  beforeEach(() => {
    fromMock.mockClear();
    copyMock.mockReset();
    copyMock.mockResolvedValue({ data: { path: "copied" }, error: null });
  });

  describe("copyFile", () => {
    it("copies the file inside the configured bucket and folder", async () => {
      const { copyFile } = useCopyFile();

      await copyFile("beach.jpg", filesNamed("beach.jpg"));

      expect(fromMock).toHaveBeenCalledWith("files");
      expect(copyMock).toHaveBeenCalledWith(
        "user-1/beach.jpg",
        "user-1/beach_(1).jpg"
      );
    });

    it("picks the next free copy number", async () => {
      const { copyFile } = useCopyFile();

      await copyFile(
        "beach.jpg",
        filesNamed("beach.jpg", "beach_(1).jpg", "beach_(2).jpg")
      );

      expect(copyMock).toHaveBeenCalledWith(
        "user-1/beach.jpg",
        "user-1/beach_(3).jpg"
      );
    });

    it("returns the data from Supabase", async () => {
      const { copyFile } = useCopyFile();

      const result = await copyFile("beach.jpg", filesNamed("beach.jpg"));

      expect(result).toEqual({ path: "copied" });
    });

    it("throws the Supabase error message when copying fails", async () => {
      copyMock.mockResolvedValue({
        data: null,
        error: { message: "The resource already exists" },
      });
      const { copyFile } = useCopyFile();

      await expect(
        copyFile("beach.jpg", filesNamed("beach.jpg"))
      ).rejects.toThrow("The resource already exists");
    });
  });

  describe("copyFiles", () => {
    it("gives every copy a distinct name", async () => {
      const { copyFiles } = useCopyFile();

      await copyFiles(
        ["beach.jpg", "beach_(1).jpg"],
        filesNamed("beach.jpg", "beach_(1).jpg")
      );

      expect(copyMock).toHaveBeenCalledTimes(2);
      expect(copyMock).toHaveBeenNthCalledWith(
        1,
        "user-1/beach.jpg",
        "user-1/beach_(2).jpg"
      );
      expect(copyMock).toHaveBeenNthCalledWith(
        2,
        "user-1/beach_(1).jpg",
        "user-1/beach_(3).jpg"
      );
    });

    it("numbers copies of different files independently", async () => {
      const { copyFiles } = useCopyFile();

      await copyFiles(
        ["beach.jpg", "report.pdf"],
        filesNamed("beach.jpg", "report.pdf")
      );

      expect(copyMock).toHaveBeenNthCalledWith(
        1,
        "user-1/beach.jpg",
        "user-1/beach_(1).jpg"
      );
      expect(copyMock).toHaveBeenNthCalledWith(
        2,
        "user-1/report.pdf",
        "user-1/report_(1).pdf"
      );
    });

    it("returns one result per copied file", async () => {
      const { copyFiles } = useCopyFile();

      const results = await copyFiles(
        ["beach.jpg", "report.pdf"],
        filesNamed("beach.jpg", "report.pdf")
      );

      expect(results).toHaveLength(2);
    });

    it("rejects when one of the copies fails", async () => {
      copyMock
        .mockResolvedValueOnce({ data: { path: "copied" }, error: null })
        .mockResolvedValueOnce({ data: null, error: { message: "Failed" } });
      const { copyFiles } = useCopyFile();

      await expect(
        copyFiles(
          ["beach.jpg", "report.pdf"],
          filesNamed("beach.jpg", "report.pdf")
        )
      ).rejects.toThrow("Failed");
    });

    it("does nothing for an empty selection", async () => {
      const { copyFiles } = useCopyFile();

      await copyFiles([], filesNamed("beach.jpg"));

      expect(copyMock).not.toHaveBeenCalled();
    });
  });
});
