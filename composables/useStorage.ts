import type { StoragePath } from "@/types/StoragePath";
import { useSupabaseUser } from "#imports";

export const useStorage = () => {
  const user = useSupabaseUser();
  const isStoragePublic = useIsStoragePublic();

  const setStorage = (): StoragePath => {
    if (!user.value?.sub || (user.value.sub && isStoragePublic.value)) {
      return {
        bucket: "files",
        folder: "public",
      };
    } else {
      return {
        bucket: "private",
        folder: user.value.sub,
      };
    }
  };

  const storage = ref<StoragePath>(setStorage());

  const updateStorage = () => {
    if (!user.value?.sub || (user.value.sub && isStoragePublic.value)) {
      storage.value.bucket = "files";
      storage.value.folder = "public";
    } else {
      storage.value.bucket = "private";
      storage.value.folder = user.value.sub;
    }
  };

  watch(isStoragePublic, () => {
    updateStorage();
  });

  watch(user, () => {
    updateStorage();
  });

  return { storage, updateStorage };
};
