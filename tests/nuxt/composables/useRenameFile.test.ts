import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useRenameFile } from "@/composables/useRenameFile";

const { moveMock, fromMock, storageState } = vi.hoisted(() => {
  const moveMock = vi.fn();
  const fromMock = vi.fn(() => ({ move: moveMock }));
  const storageState = {
    value: { bucket: "files", folder: "user-123" },
  };

  return { moveMock, fromMock, storageState };
});

mockNuxtImport("useSupabaseClient", () => () => ({
  storage: { from: fromMock },
}));

mockNuxtImport("useStorage", () => () => ({
  storage: storageState,
}));

describe("useRenameFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storageState.value = { bucket: "files", folder: "user-123" };
    moveMock.mockResolvedValue({
      data: { message: "Successfully moved" },
      error: null,
    });
  });

  it("moves the file to the new name inside the current bucket and folder", async () => {
    const { rename } = useRenameFile();

    await rename("old.png", "new.png");

    expect(fromMock).toHaveBeenCalledWith("files");
    expect(moveMock).toHaveBeenCalledWith(
      "user-123/old.png",
      "user-123/new.png"
    );
  });

  it("uses the folder from storage (e.g. public storage)", async () => {
    storageState.value = { bucket: "files", folder: "public" };
    const { rename } = useRenameFile();

    await rename("old.png", "new.png");

    expect(moveMock).toHaveBeenCalledWith("public/old.png", "public/new.png");
  });

  it("trims whitespace around the new name", async () => {
    const { rename } = useRenameFile();

    await rename("old.png", "  new.png  ");

    expect(moveMock).toHaveBeenCalledWith(
      "user-123/old.png",
      "user-123/new.png"
    );
  });

  it("resolves with no value", async () => {
    const { rename } = useRenameFile();

    await expect(rename("old.png", "new.png")).resolves.toBeUndefined();
  });

  it.each([
    { label: "an empty name", newName: "" },
    { label: "a whitespace-only name", newName: "   " },
    { label: "the same name", newName: "old.png" },
    {
      label: "the same name with surrounding whitespace",
      newName: " old.png ",
    },
  ])("does nothing for $label", async ({ newName }) => {
    const { rename } = useRenameFile();

    await expect(rename("old.png", newName)).resolves.toBeUndefined();

    expect(fromMock).not.toHaveBeenCalled();
    expect(moveMock).not.toHaveBeenCalled();
  });

  it("throws and does not call Supabase when the new name contains a slash", async () => {
    const { rename } = useRenameFile();

    await expect(rename("old.png", "sub/new.png")).rejects.toThrow(
      "File name cannot contain slashes"
    );

    expect(moveMock).not.toHaveBeenCalled();
  });

  it("throws the Supabase error as is", async () => {
    const supabaseError = new Error("The resource already exists");
    moveMock.mockResolvedValue({ data: null, error: supabaseError });
    const { rename } = useRenameFile();

    await expect(rename("old.png", "new.png")).rejects.toBe(supabaseError);
  });
});
