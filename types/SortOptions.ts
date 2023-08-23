import { SortOrder } from "@/types/SortOrder";

export interface SortOption {
  label: string;
  column: "name" | "mimetype" | "size" | "created_at";
  order: SortOrder;
}
