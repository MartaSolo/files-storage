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
    }

    return {
      bucket: "private",
      folder: user.value.sub,
    };
  };

  const storage = useState<StoragePath>("storage", setStorage);

  const updateStorage = () => {
    storage.value = setStorage();
  };

  watch(isStoragePublic, updateStorage);
  watch(user, updateStorage);

  return {
    storage,
    updateStorage,
  };
};
