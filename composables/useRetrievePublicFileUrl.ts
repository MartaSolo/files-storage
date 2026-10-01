export const useRetrievePublicFileUrl = () => {
  const client = useSupabaseClient();
  const { storage } = useStorage();

  const getPublicUrl = (fileName: string) => {
    if (storage.value.bucket !== "files") return undefined;

    const { data } = client.storage.from("files/public").getPublicUrl(fileName);

    return data.publicUrl;
  };

  return { getPublicUrl };
};
