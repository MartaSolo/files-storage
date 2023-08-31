import { FileObjectKeys } from "@/types/FileObjectKeys";
import { SortOrder } from "@/types/SortOrder";
import { LayoutType } from "@/types/LayoutType";

export const useSortColumn = () =>
  useState<FileObjectKeys>("sort-column", () => "name");

export const useSortOrder = () =>
  useState<SortOrder>("sort-order", () => "asc");

export const useLayoutType = () =>
  useState<LayoutType>("layout-type", () => "grid");

export const useSelectedFiles = () =>
  useState<string[]>("selected-files", () => []);

export const useIsUserLoggedIn = () =>
  useState<boolean>("is-user-logged-in", () => false);

export const useUserId = () =>
  useState<string | undefined>("user-id", () => "");
