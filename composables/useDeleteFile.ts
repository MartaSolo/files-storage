export const useDeleteFile = () => {
  const client = useSupabaseClient();

  const { storage } = useStorage();
  const { profileImageName, resetProfileImage } = useProfileImage();

  const deleteFile = async (fileNames: string[]) => {
    if (!fileNames.length) return [];

    const { bucket, folder } = storage.value;
    const files = fileNames.map((file) => `${folder}/${file}`);

    const { data, error } = await client.storage.from(bucket).remove(files);

    if (error) throw error;

    // Supabase Storage returns an empty data array (and no error) when a file is blocked by RLS policies or doesn't exist.
    if (data.length !== files.length) {
      throw new Error(
        `Expected to delete ${files.length} file(s), but ${data.length} were deleted`
      );
    }

    if (fileNames.includes(profileImageName.value)) {
      resetProfileImage();
    }

    return data;
  };

  return { deleteFile };
};
