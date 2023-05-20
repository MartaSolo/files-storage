export const useRetrievePublicUrl = (fileName: String, fileId: string) => {
  const client = useSupabaseClient();

  const getPublicUrl = async () => {
    const { data } = await client.storage
      .from("files/public")
      .getPublicUrl(`${fileName}`);
    return data;
  };

  const { data: url } = useAsyncData(fileId, getPublicUrl, {
    server: false,
  });

  return { url };
};
