import type { SortOrder } from "@/types/SortOrder";
import type { SortColumn } from "@/types/SortOptions";
import type { StoragePath } from "@/types/StoragePath";

export interface FilesQueryParams {
  key: SortColumn;
  order: SortOrder;
  storage: StoragePath;
  name?: string;
  types?: string;
  minSize?: number;
  maxSize?: number;
  dates?: string;
}
