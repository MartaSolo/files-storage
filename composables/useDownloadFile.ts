export const useDownloadFile = () => {
  const client = useSupabaseClient();
  const { storage } = useStorage();

  const downloadFile = async (fileName: string) => {
    let url;

    if (storage.value.bucket === "private") {
      const { data, error } = await client.storage
        .from(storage.value.bucket)
        .download(`${storage.value.folder}/${fileName}`);

      if (error) throw new Error(error.message);

      if (data) {
        const file = new File([data], data.type);
        url = URL.createObjectURL(file);
      }
    }

    if (storage.value.bucket === "files") {
      const { data } = await client.storage
        .from(`${storage.value.bucket}/${storage.value.folder}`)
        .getPublicUrl(`${fileName}`, { download: true });

      url = data.publicUrl;
    }

    const link = document.createElement("a");
    link.setAttribute("href", url || "");
    link.setAttribute("download", fileName);
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    downloadFile,
  };
};
