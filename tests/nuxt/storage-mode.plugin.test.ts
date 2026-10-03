import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { clearNuxtState, useIsStoragePublic, useNuxtApp } from "#imports";
import storageModePlugin from "@/plugins/storage-mode";

const { useSupabaseUserMock } = vi.hoisted(() => ({
  useSupabaseUserMock: vi.fn(() => ({ value: null })),
}));

mockNuxtImport("useSupabaseUser", () => useSupabaseUserMock);

const USER_ID = "user-123";

describe("storage-mode plugin", () => {
  let user: ReturnType<typeof ref<{ sub: string; email?: string } | null>>;

  const runPlugin = async () => {
    const nuxtApp = useNuxtApp();
    await nuxtApp.runWithContext(() => storageModePlugin(nuxtApp));
  };

  beforeEach(() => {
    clearNuxtState("is-storage-public");
    user = ref<{ sub: string; email?: string } | null>(null);
    useSupabaseUserMock.mockReturnValue(user as never);
  });

  it.each([
    { name: "logged out starts in public mode", user: null, expected: true },
    {
      name: "logged in starts in private mode",
      user: { sub: USER_ID },
      expected: false,
    },
  ])("$name", async ({ user: initialUser, expected }) => {
    user.value = initialUser;

    await runPlugin();

    expect(useIsStoragePublic().value).toBe(expected);
  });

  it("switches to private mode on login", async () => {
    await runPlugin();
    expect(useIsStoragePublic().value).toBe(true);

    user.value = { sub: USER_ID };
    await nextTick();

    expect(useIsStoragePublic().value).toBe(false);
  });

  it("switches to public mode on logout", async () => {
    user.value = { sub: USER_ID };
    await runPlugin();
    expect(useIsStoragePublic().value).toBe(false);

    user.value = null;
    await nextTick();

    expect(useIsStoragePublic().value).toBe(true);
  });

  it("does not overwrite the manual toggle when the user object changes but the id stays the same", async () => {
    user.value = { sub: USER_ID };
    await runPlugin();

    // the user manually switches to public storage
    const isStoragePublic = useIsStoragePublic();
    isStoragePublic.value = true;

    // e.g. a token refresh replaces the user object
    user.value = { sub: USER_ID, email: "updated@example.com" };
    await nextTick();

    expect(isStoragePublic.value).toBe(true);
  });
});
