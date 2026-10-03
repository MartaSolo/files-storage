import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { clearNuxtState, useIsStoragePublic } from "#imports";
import { useStorage } from "@/composables/useStorage";
import {
  PRIVATE_BUCKET,
  PUBLIC_BUCKET,
  PUBLIC_BUCKET_FOLDER,
} from "@/utils/constants/supabaseStorage";

const { useSupabaseUserMock } = vi.hoisted(() => ({
  useSupabaseUserMock: vi.fn(() => ({ value: null })),
}));

mockNuxtImport("useSupabaseUser", () => useSupabaseUserMock);

const USER_ID = "user-123";

const publicStorage = {
  bucket: PUBLIC_BUCKET,
  folder: PUBLIC_BUCKET_FOLDER,
};

const privateStorage = { bucket: PRIVATE_BUCKET, folder: USER_ID };

describe("useStorage", () => {
  let user: ReturnType<typeof ref<{ sub: string } | null>>;

  beforeEach(() => {
    clearNuxtState("is-storage-public");
    user = ref<{ sub: string } | null>(null);
    useSupabaseUserMock.mockReturnValue(user as never);
  });

  it.each([
    {
      name: "logged out, public mode",
      user: null,
      isStoragePublic: true,
      expected: publicStorage,
    },
    {
      name: "logged out is always public, even if the flag is false",
      user: null,
      isStoragePublic: false,
      expected: publicStorage,
    },
    {
      name: "logged in, public mode",
      user: { sub: USER_ID },
      isStoragePublic: true,
      expected: publicStorage,
    },
    {
      name: "logged in, private mode",
      user: { sub: USER_ID },
      isStoragePublic: false,
      expected: privateStorage,
    },
  ])("$name", ({ user: currentUser, isStoragePublic, expected }) => {
    user.value = currentUser;
    useIsStoragePublic().value = isStoragePublic;

    const { storage } = useStorage();

    expect(storage.value).toEqual(expected);
  });

  it("updates when the user toggles between public and private", async () => {
    user.value = { sub: USER_ID };
    const isStoragePublic = useIsStoragePublic();
    isStoragePublic.value = false;

    const { storage } = useStorage();
    expect(storage.value).toEqual(privateStorage);

    isStoragePublic.value = true;
    await nextTick();
    expect(storage.value).toEqual(publicStorage);

    isStoragePublic.value = false;
    await nextTick();
    expect(storage.value).toEqual(privateStorage);
  });

  it("updates on login and logout", async () => {
    useIsStoragePublic().value = false;

    const { storage } = useStorage();
    expect(storage.value).toEqual(publicStorage);

    user.value = { sub: USER_ID };
    await nextTick();
    expect(storage.value).toEqual(privateStorage);

    user.value = null;
    await nextTick();
    expect(storage.value).toEqual(publicStorage);
  });

  it("stays in sync across separate useStorage calls", async () => {
    user.value = { sub: USER_ID };
    const isStoragePublic = useIsStoragePublic();
    isStoragePublic.value = false;

    const first = useStorage().storage;
    isStoragePublic.value = true;
    await nextTick();

    // a component mounting later must not get a stale value
    const second = useStorage().storage;

    expect(first.value).toEqual(publicStorage);
    expect(second.value).toEqual(publicStorage);
  });
});
