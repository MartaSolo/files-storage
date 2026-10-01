export const useRetrievePrivateFileUrl = () => {
  const client = useSupabaseClient();
  const { storage } = useStorage();

  const getPrivateUrl = async (fileName: string) => {
    const { data, error } = await client.storage
      .from(storage.value.bucket)
      .createSignedUrl(`${storage.value.folder}/${fileName}`, 6000);

    if (error) throw error;
    return data.signedUrl;
  };

  return { getPrivateUrl };
};
