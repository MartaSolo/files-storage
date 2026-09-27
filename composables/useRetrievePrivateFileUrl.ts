export const useRetrievePrivateFileUrl = (fileName: string) => {
  const client = useSupabaseClient();
  const { storage } = useStorage();

  const privateUrlError = ref("");
  const privateUrl = ref<string | undefined>();

  const getPrivateUrl = async () => {
    if (storage.value.bucket === "private") {
      const { data, error } = await client.storage
        .from(`${storage.value.bucket}`)
        .createSignedUrl(`${storage.value.folder}/${fileName}`, 6000);

      if (error) {
        privateUrlError.value = error.message;
      }
      privateUrl.value = data?.signedUrl;
      return data?.signedUrl;
    }
  };

  getPrivateUrl();

  return { privateUrl, privateUrlError, getPrivateUrl };
};
