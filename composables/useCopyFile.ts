import { FileObject } from "@supabase/storage-js";

export const useCopyFile = () => {
  const client = useSupabaseClient();

  const copyFile = async (fileName: string, files: FileObject[]) => {
    const { copyName } = useCopyName();
    const newCopyName = copyName(fileName, files);

    const { storage } = useStorage();

    const { data, error } = await client.storage
      .from(storage.value.bucket)
      .copy(
        `${storage.value.folder}/${fileName}`,
        `${storage.value.folder}/${newCopyName}`
      );

    if (error) throw new Error(error.message);

    return data;
  };

  return { copyFile };
};
