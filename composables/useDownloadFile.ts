export const useDownloadFile = () => {
  const client = useSupabaseClient();

  const download = (fileName: string) => {
    const { data } = client.storage
      .from("files/public")
      .getPublicUrl(`${fileName}`, { download: true });

    const link = document.createElement("a");
    link.setAttribute("href", data.publicUrl || "");
    link.setAttribute("download", fileName);
    link.style.display = "none";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return {
    download,
  };
};
