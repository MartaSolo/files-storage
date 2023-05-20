export const useFileName = (fileName: String) => {
  const indexToSplitFileName = fileName.lastIndexOf(".");

  const name = fileName.substring(0, indexToSplitFileName);

  const extension = fileName.substring(indexToSplitFileName);

  return {
    name,
    extension,
  };
};
