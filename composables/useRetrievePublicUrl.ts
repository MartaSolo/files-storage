export const useRetrievePublicUrl = (fileName: string) => {
  const client = useSupabaseClient();

  const getPublicUrl = async () => {
    const { data } = await client.storage
      .from("files/public")
      // .getPublicUrl(`${fileName}`);
      .getPublicUrl(`${fileName}`, { download: true });
    return data;
  };

  const { data: url } = useAsyncData(fileName, getPublicUrl, {
    server: false,
  });

  return { url };
};
