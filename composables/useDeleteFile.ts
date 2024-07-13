import { PROFILE_PLACEHOLDER_SOURCE } from "@/utils/constants/profilePlaceholderSource";

export const useDeleteFile = () => {
  const client = useSupabaseClient();

  const { storage } = useStorage();
  const profileImageSource = useProfileImageSource();
  const { profileImageName } = useProfileImage();

  const deleteFile = async (fileNames: string[]) => {
    if (fileNames.includes(profileImageName.value)) {
      profileImageSource.value = PROFILE_PLACEHOLDER_SOURCE;
      profileImageName.value = "";
    }

    const files = fileNames.map((file) => {
      return `${storage.value.folder}/${file}`;
    });

    const { data, error } = await client.storage
      .from(storage.value.bucket)
      .remove(files);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  return { deleteFile };
};
