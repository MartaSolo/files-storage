import { FileObjectKeys } from "@/types/FileObjectKeys";
import { SortOrder } from "@/types/SortOrder";
import { LayoutType } from "@/types/LayoutType";
import { PROFILE_PLACEHOLDER_SOURCE } from "@/utils/constants/profilePlaceholderSource";

export const useSortColumn = () =>
  useState<FileObjectKeys>("sort-column", () => "name");

export const useSortOrder = () =>
  useState<SortOrder>("sort-order", () => "asc");

export const useLayoutType = () =>
  useState<LayoutType>("layout-type", () => "grid");

export const useSelectedFiles = () =>
  useState<string[]>("selected-files", () => []);

export const useIsStoragePublic = () =>
  useState("is-storage-public", () => true);

export const useProfileImageSource = () =>
  useState("profile-image-source", () => PROFILE_PLACEHOLDER_SOURCE);
