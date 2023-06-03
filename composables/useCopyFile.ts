export const useCopyFile = (fileName: string) => {
  const client = useSupabaseClient();

  const copyName = useFileName(fileName);

  const copy = async () => {
    const { data, error } = await client.storage
      .from("files")
      .copy(
        `public/${fileName}`,
        `public/${copyName.name}_Copy${copyName.extension}`
      );
    if (error) throw error;
    return data;
  };

  return { copy };
};
