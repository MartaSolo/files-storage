import {
  PUBLIC_BUCKET,
  PUBLIC_BUCKET_FOLDER,
} from "@/utils/constants/supabaseStorage";

export const useRetrievePublicFileUrl = () => {
  const client = useSupabaseClient();
  const { storage } = useStorage();

  const getFilePublicUrl = (fileName: string): string | undefined => {
    if (storage.value.bucket !== PUBLIC_BUCKET) return undefined;

    const { data } = client.storage
      .from(PUBLIC_BUCKET)
      .getPublicUrl(`${PUBLIC_BUCKET_FOLDER}/${fileName}`);

    return data.publicUrl;
  };

  return { getFilePublicUrl };
};
