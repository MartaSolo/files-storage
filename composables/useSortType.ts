import { FileObject } from "@supabase/storage-js";

export const useSortType = (file?: FileObject, files?: FileObject[]) => {
  let type: string | string[];
  if (file) {
    type = file.metadata.mimetype.split("/")[0];
  } else if (files) {
    const allTypes = files.map((file) => {
      return file.metadata.mimetype.split("/")[0];
    });
    const uniqueTypes = allTypes.filter((type, index, array) => {
      return array.indexOf(type) === index;
    });
    type = uniqueTypes;
  } else {
    type = "";
  }

  return { type };
};
