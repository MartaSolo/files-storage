export const useRenameFile = () => {
  const client = useSupabaseClient();
  const { storage } = useStorage();

  const rename = async (fileName: string, newFileName: string) => {
    const trimmedName = newFileName.trim();

    if (!trimmedName || trimmedName === fileName) return;

    if (trimmedName.includes("/")) {
      throw new Error("File name cannot contain slashes");
    }

    const { bucket, folder } = storage.value;

    const { error } = await client.storage
      .from(bucket)
      .move(`${folder}/${fileName}`, `${folder}/${trimmedName}`);

    if (error) throw error;
  };

  return { rename };
};
