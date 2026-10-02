import type { FileObject } from "@supabase/storage-js";
import { getCopyName } from "@/utils/helpers/getCopyName";

export const useCopyFile = () => {
  const client = useSupabaseClient();
  const { storage } = useStorage();

  const copyTo = async (fileName: string, newName: string) => {
    const { bucket, folder } = storage.value;

    const { data, error } = await client.storage
      .from(bucket)
      .copy(`${folder}/${fileName}`, `${folder}/${newName}`);

    if (error) throw new Error(error.message);

    return data;
  };

  const copyFile = (fileName: string, files: FileObject[]) => {
    const existingNames = files.map((file) => file.name);
    return copyTo(fileName, getCopyName(fileName, existingNames));
  };

  const copyFiles = (fileNames: string[], files: FileObject[]) => {
    const takenNames = files.map((file) => file.name);

    // first decide all new names, one after another
    const copies = fileNames.map((fileName) => {
      const newName = getCopyName(fileName, takenNames);
      takenNames.push(newName);
      return { fileName, newName };
    });

    // then copy in parallel, names are already distinct
    return Promise.all(
      copies.map(({ fileName, newName }) => copyTo(fileName, newName))
    );
  };

  return { copyFile, copyFiles };
};
