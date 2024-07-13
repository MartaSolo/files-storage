import { FileObject } from "@supabase/storage-js";
import { getSortType } from "@/utils/helpers/getSortTypes";

export const useSortType = (file?: FileObject, files?: FileObject[]) => {
  let type: string | string[];

  type = getSortType(file, files);

  return { type };
};
