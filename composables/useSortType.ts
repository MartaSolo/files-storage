import { FileObject } from "@supabase/storage-js";
import { getSortType } from "@/utils/helpers/getSortTypes";

export const useSortType = (file?: FileObject, files?: FileObject[]) => {
  const type = ref<string[]>(getSortType(file, files));
  return { type };
};
