export interface SortOptions {
  name: string;
  column: "name" | "mimetype" | "size" | "created_at";
  order: "asc" | "desc";
}

export type Keys = keyof SortOptions;
