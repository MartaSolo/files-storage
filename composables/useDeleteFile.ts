export const useDeleteFile = () => {
  const client = useSupabaseClient();

  const remove = async (fileNames: string[]) => {
    const files = fileNames.map((file) => {
      return `public/${file}`;
    });

    const { data, error } = await client.storage.from("files").remove(files);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  return { remove };
};
