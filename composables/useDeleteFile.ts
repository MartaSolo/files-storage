export const useDeleteFile = (fileName?: String, fileNames?: string[]) => {
  const client = useSupabaseClient();

  let files: string[];

  if (fileName) {
    files = [`public/${fileName}`];
  } else {
    fileNames?.forEach((file) => {
      const path = `public/${file}`;
      files.push(path);
    });
  }

  const remove = async () => {
    const { data, error } = await client.storage.from("files").remove(files);
    if (error) throw error;
    return data;
  };

  return { remove };
};
