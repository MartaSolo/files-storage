import type { SortOrder } from "@/types/SortOrder";
import type { FileObject } from "@supabase/storage-js";

export const sortValueGetters = {
  name: (file: FileObject) => file.name,
  created_at: (file: FileObject) => file.created_at,
  mimetype: (file: FileObject) => file.metadata?.mimetype,
  size: (file: FileObject) => file.metadata?.size,
};

export type SortColumn = keyof typeof sortValueGetters;

export interface SortOption {
  label: string;
  column: SortColumn;
  order: SortOrder;
}
