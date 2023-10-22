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

export const useIsStoragePublic = () =>
  useState("is-storage-public", () => true);

// export const useProfileImageSource = () =>
//   useState("profile-image-source", () => "https://resvibgtwucmhpdbacog.supabase.co/storage/v1/object/sign/private/1b7a52b7-5877-4c31-9682-f65fea1be952/Marta.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcml2YXRlLzFiN2E1MmI3LTU4NzctNGMzMS05NjgyLWY2NWZlYTFiZTk1Mi9NYXJ0YS5wbmciLCJpYXQiOjE2OTc5OTU2MTksImV4cCI6MTY5ODAwMTYxOX0.NzmJAI5-YNiMx1GzPF7oAZmZSXZpzg2K5z5UrcLjOr4");
export const useProfileImageSource = () =>
  useState("profile-image-source", () => "");
