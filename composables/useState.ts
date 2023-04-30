export const useSortColumn = () => useState("sort-column", () => "name");

export const useSortOrder = () => useState("sort-order", () => "asc");

export const useFileView = () => useState("file-view", () => "grid");
