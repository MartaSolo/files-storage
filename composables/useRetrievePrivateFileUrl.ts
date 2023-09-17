export const useRetrievePrivateFileUrl = (fileName: string) => {
  const client = useSupabaseClient();
  const { storage } = useStorage();

  const getPrivateUrl = async () => {
    const { data } = await client.storage
      .from(`${storage.value.bucket}`)
      .createSignedUrl(`${storage.value.folder}/${fileName}`, 6000);
    // return data?.signedURL;
    return data?.signedUrl;
  };

  const { data: url } = useAsyncData(fileName, getPrivateUrl);

  console.log("private storage", storage.value);
  console.log("private url.value", url.value);

  watch(storage, () => {
    getPrivateUrl();
  });

  return { url };
};
