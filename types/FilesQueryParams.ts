import type { FileObjectKeys } from "@/types/FileObjectKeys";
import type { SortOrder } from "@/types/SortOrder";
import type { StoragePath } from "@/types/StoragePath";

export interface FilesQueryParams {
  key: FileObjectKeys;
  order: SortOrder;
  storage: StoragePath;
  name?: string;
  types?: string;
  minSize?: number;
  maxSize?: number;
  dates?: string;
}
