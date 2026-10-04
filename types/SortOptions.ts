import type { SortOrder } from "@/types/SortOrder";
import type {
  FileObjectKeys,
  FileObjectMetadataKeys,
} from "@/types/FileObjectKeys";

export type SortColumn =
  Extract<FileObjectKeys, "name" | "created_at"> | FileObjectMetadataKeys;

export interface SortOption {
  label: string;
  column: SortColumn;
  order: SortOrder;
}
