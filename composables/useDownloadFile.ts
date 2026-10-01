import {
  PRIVATE_BUCKET,
  PUBLIC_BUCKET,
  PUBLIC_BUCKET_FOLDER,
} from "@/utils/constants/supabaseStorage";

export const useDownloadFile = () => {
  const client = useSupabaseClient();
  const { storage } = useStorage();

  const downloadFile = async (fileName: string) => {
    const { bucket, folder } = storage.value;

    let url: string;
    let isObjectUrl = false;

    if (bucket === PRIVATE_BUCKET) {
      const { data, error } = await client.storage
        .from(bucket)
        .download(`${folder}/${fileName}`);

      if (error) throw new Error(error.message);
      if (!data) throw new Error("File not found");

      url = URL.createObjectURL(data);
      isObjectUrl = true;
    } else if (bucket === PUBLIC_BUCKET) {
      const { data } = client.storage
        .from(bucket)
        .getPublicUrl(`${PUBLIC_BUCKET_FOLDER}/${fileName}`, {
          download: true,
        });

      url = data.publicUrl;
    } else {
      throw new Error(`Unsupported bucket: ${bucket}`);
    }

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (isObjectUrl) setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return { downloadFile };
};
