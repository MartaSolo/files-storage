export const useCopyLink = (fileName: string) => {
  const { storage } = useStorage();

  const copy = async () => {
    let link;
    if (storage.value.bucket === "private") {
      const getPrivateUrl = useRetrievePrivateFileUrl(fileName);
      link = await getPrivateUrl.privateUrl.value;
    } else {
      const getPublicUrl = useRetrievePublicFileUrl(fileName);
      link = await getPublicUrl.url;
    }
    navigator.clipboard.writeText(link || "");
  };

  return { copy };
};
