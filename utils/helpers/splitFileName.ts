export const splitFileName = (fileName: string) => {
  const dotIndex = fileName.lastIndexOf(".");

  // no extension (README) or a dotfile (.env)
  if (dotIndex <= 0) return { name: fileName, extension: "" };

  return {
    name: fileName.slice(0, dotIndex),
    extension: fileName.slice(dotIndex),
  };
};
