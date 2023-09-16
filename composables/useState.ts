import { FileObjectKeys } from "@/types/FileObjectKeys";
import { SortOrder } from "@/types/SortOrder";
import { LayoutType } from "@/types/LayoutType";
import { UserData } from "@/types/UserData";

export const useSortColumn = () =>
  useState<FileObjectKeys>("sort-column", () => "name");

export const useSortOrder = () =>
  useState<SortOrder>("sort-order", () => "asc");

export const useLayoutType = () =>
  useState<LayoutType>("layout-type", () => "grid");

export const useSelectedFiles = () =>
  useState<string[]>("selected-files", () => []);

export const useUserData = () =>
  useState<UserData>("user-data", () => ({
    id: undefined,
    name: undefined,
    email: undefined,
    lastSignIn: undefined,
    created: undefined,
  }));

export const useIsStoragePublic = () =>
  useState("is-storage-public", () => true);
