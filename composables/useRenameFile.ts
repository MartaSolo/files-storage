export const useRenameFile = () => {
  const client = useSupabaseClient();
  const { storage } = useStorage();

  const rename = async (fileName: string, newFileName: string) => {
    const { data, error } = await client.storage
      .from(storage.value.bucket)
      .move(
        `${storage.value.folder}/${fileName}`,
        `${storage.value.folder}/${newFileName}`
      );
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  return { rename };
};
