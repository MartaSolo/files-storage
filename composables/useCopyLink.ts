export const useCopyLink = (fileName: string) => {
  const getUrl = useRetrievePublicUrl(fileName);

  const link = getUrl.url.value?.publicUrl;

  const copy = () => {
    navigator.clipboard.writeText(link || "");
  };

  return { copy };
};
