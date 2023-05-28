export const useRenameFile = (fileName: String, newFileName: String) => {
  const client = useSupabaseClient();

  const rename = async () => {
    const { data, error } = await client.storage
      .from("files")
      .move(`public/${fileName}`, `public/${newFileName}`);
    if (error) return error;
    // if (error) throw error;
    return data;
  };

  return { rename };
};
