import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { useRetrievePrivateFileUrl } from "@/composables/useRetrievePrivateFileUrl";
import { SIGNED_URL_EXPIRES_IN } from "@/utils/constants/supabaseStorage";

const { createSignedUrl, from, storage } = vi.hoisted(() => {
  const createSignedUrl = vi.fn();
  return {
    createSignedUrl,
    from: vi.fn(() => ({ createSignedUrl })),
    storage: { value: { bucket: "private", folder: "user-1" } },
  };
});

mockNuxtImport("useSupabaseClient", () => () => ({ storage: { from } }));
mockNuxtImport("useStorage", () => () => ({ storage }));

describe("useRetrievePrivateFileUrl", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns the signed url", async () => {
    createSignedUrl.mockResolvedValue({
      data: { signedUrl: "https://x" },
      error: null,
    });
    const { getPrivateUrl } = useRetrievePrivateFileUrl();

    await expect(getPrivateUrl("a.png")).resolves.toBe("https://x");
    expect(from).toHaveBeenCalledWith("private");
    expect(createSignedUrl).toHaveBeenCalledWith(
      "user-1/a.png",
      SIGNED_URL_EXPIRES_IN
    );
  });

  it("throws when supabase returns an error", async () => {
    const error = new Error("nope");
    createSignedUrl.mockResolvedValue({ data: null, error });
    const { getPrivateUrl } = useRetrievePrivateFileUrl();

    await expect(getPrivateUrl("a.png")).rejects.toBe(error);
  });
});
