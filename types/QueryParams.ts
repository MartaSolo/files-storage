import { FileObjectKeys } from "@/types/FileObjectKeys";
import { SortOrder } from "@/types/SortOrder";
import { StoragePath } from "@/types/StoragePath";

export interface QueryParams {
  key: FileObjectKeys;
  order: SortOrder;
  storage: StoragePath;
  name?: string;
  types?: string;
  minSize?: number;
  maxSize?: number;
  dates?: string;
}
