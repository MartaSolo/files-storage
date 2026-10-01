import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useDownloadFile } from "@/composables/useDownloadFile";
import {
  PRIVATE_BUCKET,
  PUBLIC_BUCKET,
  PUBLIC_BUCKET_FOLDER,
} from "@/utils/constants/supabaseStorage";

const { downloadMock, getPublicUrlMock, fromMock, storageState } = vi.hoisted(
  () => {
    const downloadMock = vi.fn();
    const getPublicUrlMock = vi.fn();
    const fromMock = vi.fn(() => ({
      download: downloadMock,
      getPublicUrl: getPublicUrlMock,
    }));
    const storageState = { value: { bucket: "", folder: "" } };
    return { downloadMock, getPublicUrlMock, fromMock, storageState };
  }
);

mockNuxtImport("useSupabaseClient", () => () => ({
  storage: { from: fromMock },
}));
mockNuxtImport("useStorage", () => () => ({ storage: storageState }));

const BLOB_URL = "blob:mock-url";
const PUBLIC_URL = "https://example.supabase.co/files/public/a.png?download=";

type ClickedLink = {
  href: string | null;
  download: string | null;
  inBody: boolean;
};

describe("useDownloadFile", () => {
  let clicked: ClickedLink[];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    URL.createObjectURL = vi.fn(() => BLOB_URL);
    URL.revokeObjectURL = vi.fn();

    clicked = [];
    // Capture state at click time, the anchor is removed right afterwards
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      clicked.push({
        href: this.getAttribute("href"),
        download: this.getAttribute("download"),
        inBody: document.body.contains(this),
      });
    });

    getPublicUrlMock.mockReturnValue({ data: { publicUrl: PUBLIC_URL } });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("private bucket", () => {
    beforeEach(() => {
      storageState.value = { bucket: PRIVATE_BUCKET, folder: "user-123" };
    });

    it("downloads from the user's folder and clicks an anchor with the object url", async () => {
      const blob = new Blob(["content"]);
      downloadMock.mockResolvedValue({ data: blob, error: null });

      await useDownloadFile().downloadFile("a.png");

      expect(fromMock).toHaveBeenCalledWith(PRIVATE_BUCKET);
      expect(downloadMock).toHaveBeenCalledWith("user-123/a.png");
      expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
      expect(clicked).toEqual([
        { href: BLOB_URL, download: "a.png", inBody: true },
      ]);
    });

    it("revokes the object url after the click, not synchronously", async () => {
      downloadMock.mockResolvedValue({ data: new Blob(["x"]), error: null });

      await useDownloadFile().downloadFile("a.png");
      expect(URL.revokeObjectURL).not.toHaveBeenCalled();

      vi.runAllTimers();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(BLOB_URL);
    });

    it("throws the supabase error message and clicks nothing", async () => {
      downloadMock.mockResolvedValue({
        data: null,
        error: { message: "boom" },
      });

      await expect(useDownloadFile().downloadFile("a.png")).rejects.toThrow(
        "boom"
      );
      expect(clicked).toHaveLength(0);
      expect(URL.createObjectURL).not.toHaveBeenCalled();
    });

    it("throws when no data is returned", async () => {
      downloadMock.mockResolvedValue({ data: null, error: null });

      await expect(useDownloadFile().downloadFile("a.png")).rejects.toThrow(
        "File not found"
      );
      expect(clicked).toHaveLength(0);
    });
  });

  describe("public bucket", () => {
    beforeEach(() => {
      storageState.value = {
        bucket: PUBLIC_BUCKET,
        folder: PUBLIC_BUCKET_FOLDER,
      };
    });

    it("requests a download url and clicks an anchor with it", async () => {
      await useDownloadFile().downloadFile("a.png");

      expect(fromMock).toHaveBeenCalledWith(PUBLIC_BUCKET);
      expect(getPublicUrlMock).toHaveBeenCalledWith(
        `${PUBLIC_BUCKET_FOLDER}/a.png`,
        { download: true }
      );
      expect(clicked).toEqual([
        { href: PUBLIC_URL, download: "a.png", inBody: true },
      ]);
    });

    it("does not create or revoke object urls", async () => {
      await useDownloadFile().downloadFile("a.png");
      vi.runAllTimers();

      expect(URL.createObjectURL).not.toHaveBeenCalled();
      expect(URL.revokeObjectURL).not.toHaveBeenCalled();
    });
  });

  it("throws for an unsupported bucket and clicks nothing", async () => {
    storageState.value = { bucket: "other", folder: "x" };

    await expect(useDownloadFile().downloadFile("a.png")).rejects.toThrow(
      "Unsupported bucket: other"
    );
    expect(clicked).toHaveLength(0);
  });

  it("removes the anchor from the document after the click", async () => {
    storageState.value = {
      bucket: PUBLIC_BUCKET,
      folder: PUBLIC_BUCKET_FOLDER,
    };

    await useDownloadFile().downloadFile("a.png");

    expect(document.querySelector("a[download]")).toBeNull();
  });
});
