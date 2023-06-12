export const useSortColumn = () => useState("sort-column", () => "name");

export const useSortOrder = () => useState("sort-order", () => "asc");

export const useLayoutType = () => useState("layout-type", () => "grid");

export const useSelectedFiles = () =>
  useState("selected-files", () => <string[]>[]);
