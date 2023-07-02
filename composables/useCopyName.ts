import { FileObject } from "@supabase/storage-js";

export const useCopyName = () => {
  const copyName = (fileName: string, files: FileObject[]) => {
    const fileETag = () =>
      files.filter((file) => file.name === fileName)[0].metadata.eTag;

    // sorted files with the same etag, where file at 1 index is the latest copy (highest number) of the original file at 0 index
    const filesWithSameETag = () =>
      files
        .filter((file) => file.metadata.eTag === fileETag())
        .sort((a, b) => b.name.localeCompare(a.name));

    const name = useFileName(fileName);

    let newCopyName: string;

    if (filesWithSameETag().length === 1) {
      newCopyName = `${name.name}_(1)${name.extension}`;
    } else {
      const prevCopy = filesWithSameETag()[1].name;

      const prevCopyName = useFileName(prevCopy);

      const prevCopyNumber = Number(
        prevCopyName.name.substring(
          prevCopyName.name.length - 2,
          prevCopyName.name.length - 1
        )
      );

      newCopyName = `${name.name}_(${prevCopyNumber + 1})${name.extension}`;
    }
    return newCopyName;
  };

  return { copyName };
};
