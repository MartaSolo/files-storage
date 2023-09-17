export const useRetrievePrivateFileUrl = (fileName: string) => {
  const client = useSupabaseClient();

  const { storage } = useStorage();

  const getPrivateUrl = async () => {
    const { data } = await client.storage
      .from(`${storage.value.bucket}`)
      .createSignedUrl(`${storage.value.folder}/${fileName}`, 6000);
    return data?.signedUrl;
  };

  const { data: privateUrl } = useAsyncData(fileName, getPrivateUrl, {
    server: false,
  });

  watch(storage, () => {
    getPrivateUrl();
  });

  return { privateUrl };
};
