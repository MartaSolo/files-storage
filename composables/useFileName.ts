export const useFileName = (fileName: string) => {
  const indexToSplitFileName = fileName.lastIndexOf(".");

  const name = fileName.substring(0, indexToSplitFileName);

  const extension = fileName.substring(indexToSplitFileName);

  return {
    name,
    extension,
  };
};
