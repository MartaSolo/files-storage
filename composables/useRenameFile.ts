export const useRenameFile = () => {
  const client = useSupabaseClient();

  // const renameError = ref("");

  const rename = async (fileName: String, newFileName: String) => {
    const { data, error } = await client.storage
      .from("files")
      .move(`public/${fileName}`, `public/${newFileName}`);
    if (error) {
      // renameError.value = error?.message;
      throw new Error(error.message);
    }
    return data;
  };

  // return { rename, renameError };
  return { rename };
};
