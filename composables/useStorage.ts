import type { StoragePath } from "@/types/StoragePath";
import { useSupabaseUser } from "#imports";
import {
  PRIVATE_BUCKET,
  PUBLIC_BUCKET,
  PUBLIC_BUCKET_FOLDER,
} from "@/utils/constants/supabaseStorage";

export const useStorage = () => {
  const user = useSupabaseUser();
  const isStoragePublic = useIsStoragePublic();

  const storage = computed<StoragePath>(() => {
    if (!user.value?.sub || isStoragePublic.value) {
      return {
        bucket: PUBLIC_BUCKET,
        folder: PUBLIC_BUCKET_FOLDER,
      };
    }

    return {
      bucket: PRIVATE_BUCKET,
      folder: user.value.sub,
    };
  });

  return { storage };
};
