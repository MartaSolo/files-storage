export const useRetrievePrivateFileUrl = (fileName: string) => {
  const client = useSupabaseClient();

  const { storage } = useStorage();

  const getPrivateUrl = async () => {
    const { data, error } = await client.storage
      .from(`${storage.value.bucket}`)
      .createSignedUrl(`${storage.value.folder}/${fileName}`, 6000);

    if (error) {
      throw new Error(error.message);
    }
    return data?.signedUrl;
  };

  const { data: privateUrl } = useAsyncData(fileName, getPrivateUrl, {
    server: false,
  });

  return { privateUrl, getPrivateUrl };
};
