import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDeleteFile } from "@/composables/useDeleteFile";

const { removeMock, fromMock, resetProfileImageMock, profileImageName } =
  vi.hoisted(() => {
    const removeMock = vi.fn();
    const fromMock = vi.fn(() => ({ remove: removeMock }));
    return {
      removeMock,
      fromMock,
      resetProfileImageMock: vi.fn(),
      profileImageName: { value: "" },
    };
  });

mockNuxtImport("useSupabaseClient", () => () => ({
  storage: { from: fromMock },
}));

mockNuxtImport("useStorage", () => () => ({
  storage: { value: { bucket: "private", folder: "user-1" } },
}));

mockNuxtImport("useProfileImage", () => () => ({
  profileImageName,
  resetProfileImage: resetProfileImageMock,
}));

describe("useDeleteFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    profileImageName.value = "avatar.png";
  });

  it("removes the files from the bucket, prefixed with the folder", async () => {
    removeMock.mockResolvedValue({
      data: [{ name: "a.png" }, { name: "b.png" }],
      error: null,
    });

    const { deleteFile } = useDeleteFile();
    await deleteFile(["a.png", "b.png"]);

    expect(fromMock).toHaveBeenCalledWith("private");
    expect(removeMock).toHaveBeenCalledWith(["user-1/a.png", "user-1/b.png"]);
  });

  it("returns the data from the remove call", async () => {
    const data = [{ name: "a.png" }];
    removeMock.mockResolvedValue({ data, error: null });

    const { deleteFile } = useDeleteFile();

    await expect(deleteFile(["a.png"])).resolves.toEqual(data);
  });

  it("returns an empty array and skips the request when no file names are given", async () => {
    const { deleteFile } = useDeleteFile();

    await expect(deleteFile([])).resolves.toEqual([]);
    expect(removeMock).not.toHaveBeenCalled();
    expect(resetProfileImageMock).not.toHaveBeenCalled();
  });

  it("throws the Supabase error and does not reset the profile image", async () => {
    const error = new Error("Permission denied");
    removeMock.mockResolvedValue({ data: null, error });

    const { deleteFile } = useDeleteFile();

    await expect(deleteFile(["avatar.png"])).rejects.toBe(error);
    expect(resetProfileImageMock).not.toHaveBeenCalled();
  });

  it("throws when fewer files were deleted than requested and does not reset the profile image", async () => {
    removeMock.mockResolvedValue({ data: [{ name: "a.png" }], error: null });

    const { deleteFile } = useDeleteFile();

    await expect(deleteFile(["a.png", "avatar.png"])).rejects.toThrow();
    expect(resetProfileImageMock).not.toHaveBeenCalled();
  });

  it("resets the profile image when the deleted files include it", async () => {
    removeMock.mockResolvedValue({
      data: [{ name: "a.png" }, { name: "avatar.png" }],
      error: null,
    });

    const { deleteFile } = useDeleteFile();
    await deleteFile(["a.png", "avatar.png"]);

    expect(resetProfileImageMock).toHaveBeenCalledTimes(1);
  });

  it("does not reset the profile image when it is not among the deleted files", async () => {
    removeMock.mockResolvedValue({ data: [{ name: "a.png" }], error: null });

    const { deleteFile } = useDeleteFile();
    await deleteFile(["a.png"]);

    expect(resetProfileImageMock).not.toHaveBeenCalled();
  });
});
