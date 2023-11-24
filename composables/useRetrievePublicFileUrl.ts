export const useRetrievePublicFileUrl = (fileName: string) => {
  const client = useSupabaseClient();

  const { storage } = useStorage();
  const publicUrl = ref("");

  if (storage.value.bucket === "files") {
    const { data } = client.storage
      .from("files/public")
      .getPublicUrl(`${fileName}`);

    publicUrl.value = data.publicUrl;
  }

  return { publicUrl };
};
