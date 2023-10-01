export const useDeleteFile = () => {
  const client = useSupabaseClient();

  const { storage } = useStorage();

  const remove = async (fileNames: string[]) => {
    const files = fileNames.map((file) => {
      return `${storage.value.folder}/${file}`;
    });

    const { data, error } = await client.storage
      .from(storage.value.bucket)
      .remove(files);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  return { remove };
};
