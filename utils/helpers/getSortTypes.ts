import type { FileObject } from "@supabase/storage-js";

export const getSortType = (input: FileObject | FileObject[]): string[] => {
  if (Array.isArray(input)) {
    const allTypes = input
      .map((file) => file.metadata?.mimetype?.split("/")[0])
      .filter((type): type is string => type !== undefined);

    return [...new Set(allTypes)];
  }

  const fileType = input.metadata?.mimetype?.split("/")[0];
  return fileType ? [fileType] : [];
};
