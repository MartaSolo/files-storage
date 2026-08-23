import type { FileObject } from "@supabase/storage-js";

export const getSortType = (file?: FileObject, files?: FileObject[]) => {
  let type: string[] = [];

  if (file) {
    const fileType = file.metadata?.mimetype.split("/")[0];
    if (fileType) type.push(fileType);
  } else {
    const allTypes = files
      ?.map((file) => file.metadata?.mimetype.split("/")[0])
      .filter((type): type is string => type !== undefined);

    const uniqueTypes = [...new Set(allTypes)];

    if (uniqueTypes?.length) type = uniqueTypes;
  }

  return type;
};
