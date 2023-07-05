import { FileObject } from "@supabase/storage-js";

export const useCopyName = () => {
  const copyName = (fileName: string, files: FileObject[]) => {
    const fileETag = () =>
      files.filter((file) => file.name === fileName)[0].metadata.eTag;

    // sorted files with the same etag, where file at 0 index is original file and at 1 index is the latest copy (highest number)
    const filesWithSameETag = () =>
      files
        .filter((file) => file.metadata.eTag === fileETag())
        .sort((a, b) => b.name.localeCompare(a.name));

    const originalFile = filesWithSameETag()[0].name;

    const name = useFileName(fileName);

    let newCopyName: string | null;

    if (
      (filesWithSameETag().length === 1 && fileName === originalFile) ||
      (filesWithSameETag().length > 1 && fileName !== originalFile)
    ) {
      newCopyName = `${name.name}_(1)${name.extension}`;
    } else if (filesWithSameETag().length > 1 && fileName === originalFile) {
      const prevCopy = filesWithSameETag()[1].name || null;

      const prevCopyFullName = useFileName(prevCopy || "");

      const prevCopyNumber = Number(
        prevCopyFullName.name.substring(
          prevCopyFullName.name.length - 2,
          prevCopyFullName.name.length - 1
        )
      );

      newCopyName = `${name.name}_(${prevCopyNumber + 1})${name.extension}`;
    } else {
      newCopyName = null;
    }

    return newCopyName;
  };

  return { copyName };
};
