export const useDeleteFile = () => {
  const client = useSupabaseClient();

  const remove = async (fileName: string) => {
    const { data, error } = await client.storage
      .from("files")
      .remove([`public/${fileName}`]);
    if (error) throw error;
    return data;
  };

  return { remove };
};
