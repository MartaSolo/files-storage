import { FileObject } from "@supabase/storage-js";

export const getSortType = (file?: FileObject, files?: FileObject[]) => {
  let type: string[] = [];

  if (file) {
    type.push(file.metadata.mimetype.split("/")[0]);
  } else {
    const allTypes = files?.map((file) => file.metadata.mimetype.split("/")[0]);
    const uniqueTypes = allTypes?.filter(
      (type, index, array) => array.indexOf(type) === index
    );
    if (uniqueTypes?.length) type = uniqueTypes;
  }

  return type;
};
