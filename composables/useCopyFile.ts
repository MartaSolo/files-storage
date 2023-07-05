import { FileObject } from "@supabase/storage-js";

export const useCopyFile = () => {
  const client = useSupabaseClient();

  const copy = async (fileName: string, files: FileObject[]) => {
    const copyName = useCopyName();
    const newCopyName = copyName.copyName(fileName, files);

    const { data, error } = await client.storage
      .from("files")
      .copy(`public/${fileName}`, `public/${newCopyName}`);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  return { copy };
};
