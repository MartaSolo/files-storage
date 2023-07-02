// option 1: recursion to have multiple api calls if the passed file name is already taken

export const useCopyFile = () => {
  const client = useSupabaseClient();

  const copy = async (fileName: string, copyNumber: number) => {
    const copyName = useFileName(fileName);

    const { data, error } = await client.storage
      .from("files")
      .copy(
        `public/${fileName}`,
        `public/${copyName.name}_(${copyNumber})${copyName.extension}`
      );
    if (error) {
      copyNumber = copyNumber + 1;
      copy(fileName, copyNumber);
    }
    return data;
  };
  return { copy };
};
