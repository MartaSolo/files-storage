import { SIGNED_URL_EXPIRES_IN } from "@/utils/constants/supabaseStorage";

export const useRetrievePrivateFileUrl = () => {
  const client = useSupabaseClient();
  const { storage } = useStorage();

  const getPrivateUrl = async (fileName: string) => {
    const { bucket, folder } = storage.value;

    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUrl(`${folder}/${fileName}`, SIGNED_URL_EXPIRES_IN);

    if (error) throw error;
    return data.signedUrl;
  };

  return { getPrivateUrl };
};
