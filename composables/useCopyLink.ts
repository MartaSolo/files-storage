export const useCopyLink = (fileName: string) => {
  const getUrl = useRetrievePublicFileUrl(fileName);

  const copy = async () => {
    const link = await getUrl.url.value?.publicUrl;
    navigator.clipboard.writeText(link || "");
  };

  return { copy };
};
