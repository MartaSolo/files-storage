export const useRenameFile = () => {
  const client = useSupabaseClient();

  const rename = async (fileName: string, newFileName: string) => {
    const { data, error } = await client.storage
      .from("files")
      .move(`public/${fileName}`, `public/${newFileName}`);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  return { rename };
};
