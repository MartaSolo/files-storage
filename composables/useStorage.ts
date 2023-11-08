import type { StoragePath } from "@/types/StoragePath";

export const useStorage = () => {
  const user = useSupabaseUser();
  const isStoragePublic = useIsStoragePublic();

  const setStorage = (): StoragePath => {
    if (!user.value?.id || (user.value.id && isStoragePublic.value)) {
      return {
        bucket: "files",
        folder: "public",
      };
    } else {
      return {
        bucket: "private",
        folder: user.value.id,
      };
    }
  };

  const storage = ref<StoragePath>(setStorage());

  const updateStorage = () => {
    if (!user.value?.id || (user.value.id && isStoragePublic.value)) {
      storage.value.bucket = "files";
      storage.value.folder = "public";
    } else {
      storage.value.bucket = "private";
      storage.value.folder = user.value.id;
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
