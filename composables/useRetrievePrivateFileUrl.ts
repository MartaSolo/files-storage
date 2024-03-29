export const useRetrievePrivateFileUrl = (fileName: string) => {
  const client = useSupabaseClient();

  const { storage } = useStorage();

  const privateUrlError = ref("");

  const getPrivateUrl = async () => {
    if (storage.value.bucket === "private") {
      const { data, error } = await client.storage
        .from(`${storage.value.bucket}`)
        .createSignedUrl(`${storage.value.folder}/${fileName}`, 6000);

      if (error) {
        privateUrlError.value = error.message;
      }
      return data?.signedUrl;
    }
  };

  const { data: privateUrl } = useAsyncData(fileName, getPrivateUrl, {
    server: false,
  });

  return { privateUrl, privateUrlError, getPrivateUrl };
};
