export const useDownloadFile = (fileName: string) => {
  const getUrl = useRetrievePublicUrl(fileName);

  const download = () => {
    const link = document.createElement("a");
    link.setAttribute("href", getUrl.url.value?.publicUrl || "");
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
