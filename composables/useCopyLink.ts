export const useCopyLink = (fileName: string) => {
  const { storage } = useStorage();

  const copyLink = () => {
    let link;
    if (storage.value.bucket === "private") {
      const { privateUrl } = useRetrievePrivateFileUrl(fileName);
      link = privateUrl.value;
    } else {
      const { publicUrl } = useRetrievePublicFileUrl(fileName);
      link = publicUrl.value;
    }
    navigator.clipboard.writeText(link || "");
  };

  return { copyLink };
};
