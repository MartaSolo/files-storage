import type { LayoutType } from "@/types/LayoutType";
import { PROFILE_PLACEHOLDER_SOURCE } from "@/utils/constants/profilePlaceholderSource";

export const useLayoutType = () =>
  useState<LayoutType>("layout-type", () => "grid");

export const useSelectedFiles = () =>
  useState<string[]>("selected-files", () => []);

export const useIsStoragePublic = () =>
  useState("is-storage-public", () => true);

export const useProfileImageSource = () =>
  useState("profile-image-source", () => PROFILE_PLACEHOLDER_SOURCE);
