export interface SortOption {
  name: string;
  column: "name" | "mimetype" | "size" | "created_at";
  order: "asc" | "desc";
}
