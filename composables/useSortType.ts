import type { FileObject } from "@supabase/storage-js";
import { getSortType } from "@/utils/helpers/getSortTypes";

export const useSortType = (input: FileObject | FileObject[]) => {
  const type = ref<string[]>(getSortType(input));
  return { type };
};
