export const useRenameFile = (fileName: String, newFileName: String) => {
  const client = useSupabaseClient();

  const renameError = ref("");

  const rename = async () => {
    const { data, error } = await client.storage
      .from("files")
      .move(`public/${fileName}`, `public/${newFileName}`);
    if (error) {
      renameError.value = error?.message;
      console.log("composable error", renameError.value);
    }
    return data;
  };

  return { rename, renameError };
};
