export const useRetrievePublicFileUrl = (fileName: string) => {
  const client = useSupabaseClient();

  const { data } = client.storage
    .from("files/public")
    .getPublicUrl(`${fileName}`);

  return { url: data.publicUrl };
};
