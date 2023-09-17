export const useRetrievePublicFileUrl = (fileName: string) => {
  const client = useSupabaseClient();

  const getPublicUrl = async () => {
    const { data } = await client.storage
      .from("files/public")
      .getPublicUrl(`${fileName}`);
    return data;
  };

  const { data: url } = useAsyncData(fileName, getPublicUrl, {
    server: false,
  });
  // console.log("public url.value", url.value);
  return { url };
};
