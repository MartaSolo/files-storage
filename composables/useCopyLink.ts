export const useCopyLink = () => {
  const { storage } = useStorage();
  const { getPrivateUrl } = useRetrievePrivateFileUrl();
  const { getFilePublicUrl } = useRetrievePublicFileUrl();

  const copyLink = async (fileName: string) => {
    let link;
    if (storage.value.bucket === "private") {
      link = await getPrivateUrl(fileName);
    } else {
      link = getFilePublicUrl(fileName);
    }

    if (!link) throw new Error("Could not create link.");

    await navigator.clipboard.writeText(link || "");
  };

  return { copyLink };
};
