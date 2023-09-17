import type { StoragePath } from "@/types/StoragePath";

export const useStorage = () => {
  const userData = useUserData();
  const isStorgePublic = useIsStoragePublic();

  const setStorage = (): StoragePath => {
    if (!userData.value.id || (userData.value.id && isStorgePublic.value)) {
      return {
        bucket: "files",
        folder: "public",
      };
    } else {
      return {
        bucket: "private",
        folder: userData.value.id,
      };
    }
  };

  const storage = ref<StoragePath>(setStorage());

  const updateStorage = () => {
    if (!userData.value.id || (userData.value.id && isStorgePublic.value)) {
      storage.value.bucket = "files";
      storage.value.folder = "public";
    } else {
      storage.value.bucket = "private";
      storage.value.folder = userData.value.id;
    }
  };

  watch(isStorgePublic, () => {
    updateStorage();
  });

  watch(userData, () => {
    updateStorage();
  });

  return { storage };
};
