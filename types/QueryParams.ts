import { FileObjectKeys } from "@/types/FileObjectKeys";
import { SortOrder } from "@/types/SortOrder";

export interface QueryParams {
  key: FileObjectKeys;
  order: SortOrder;
  name?: string;
  types?: string;
  minSize?: number;
  maxSize?: number;
  dates?: string;
}
