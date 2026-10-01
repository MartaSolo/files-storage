import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useRetrievePublicFileUrl } from "@/composables/useRetrievePublicFileUrl";
import {
  PRIVATE_BUCKET,
  PUBLIC_BUCKET,
  PUBLIC_BUCKET_FOLDER,
} from "@/utils/constants/supabaseStorage";

const { getPublicUrlMock, fromMock, storageState } = vi.hoisted(() => {
  const getPublicUrlMock = vi.fn();
  const fromMock = vi.fn(() => ({ getPublicUrl: getPublicUrlMock }));
  const storageState = { value: { bucket: "", folder: "" } };
  return { getPublicUrlMock, fromMock, storageState };
});

mockNuxtImport("useSupabaseClient", () => () => ({
  storage: { from: fromMock },
}));

mockNuxtImport("useStorage", () => () => ({ storage: storageState }));

const PUBLIC_URL = "https://example.supabase.co/storage/v1/object/public/a.png";

describe("useRetrievePublicFileUrl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getPublicUrlMock.mockReturnValue({ data: { publicUrl: PUBLIC_URL } });
  });

  it("returns the public url when the public bucket is active", () => {
    storageState.value = {
      bucket: PUBLIC_BUCKET,
      folder: PUBLIC_BUCKET_FOLDER,
    };
    const { getFilePublicUrl } = useRetrievePublicFileUrl();

    expect(getFilePublicUrl("a.png")).toBe(PUBLIC_URL);
    expect(fromMock).toHaveBeenCalledWith(PUBLIC_BUCKET);
    expect(getPublicUrlMock).toHaveBeenCalledWith(
      `${PUBLIC_BUCKET_FOLDER}/a.png`
    );
  });

  it("returns undefined and skips the client for the private bucket", () => {
    storageState.value = { bucket: PRIVATE_BUCKET, folder: "user-123" };
    const { getFilePublicUrl } = useRetrievePublicFileUrl();

    expect(getFilePublicUrl("a.png")).toBeUndefined();
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("returns undefined for an unknown bucket", () => {
    storageState.value = { bucket: "other", folder: "" };
    const { getFilePublicUrl } = useRetrievePublicFileUrl();

    expect(getFilePublicUrl("a.png")).toBeUndefined();
    expect(fromMock).not.toHaveBeenCalled();
  });
});
