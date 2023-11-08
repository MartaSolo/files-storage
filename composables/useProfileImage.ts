import { PROFILE_PLACEHOLDER_SOURCE } from "@/utils/constants/profilePlaceholderSource";
import { IGNORED_ERROR_CODE } from "@/utils/constants/ignoredErrorCode";

export const useProfileImage = () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const { storage } = useStorage();
  const profileImageSource = useProfileImageSource();

  const profileImageError = ref("");
  const profileImageName = ref("");
  const privateFileList = ref<string[]>([]);
  const privateFileListError = ref("");
  const selectedImage = ref("");
  const isLoading = ref(true);

  const setProfileImageSource = async () => {
    if (profileImageName.value) {
      try {
        const { getPrivateUrl } = useRetrievePrivateFileUrl(
          profileImageName.value
        );
        const link = await getPrivateUrl();
        profileImageSource.value = link;
      } catch (e) {
        profileImageSource.value = PROFILE_PLACEHOLDER_SOURCE;
      }
    } else {
      profileImageSource.value = PROFILE_PLACEHOLDER_SOURCE;
    }
  };

  const checkProfileImage = async () => {
    const { data, error, status } = await client
      .from("profiles")
      .select("avatar")
      .eq("id", user.value?.id)
      .single();

    if (error && status !== IGNORED_ERROR_CODE) {
      profileImageError.value = error.message;
      profileImageName.value = "";
    }

    if (data) profileImageName.value = data?.avatar;
    setProfileImageSource();
  };

  const upsertProfileImage = async (filename: string) => {
    const { data, error, status } = await client
      .from("profiles")
      .upsert({ id: user.value?.id, avatar: filename })
      .select();

    if (error && status !== IGNORED_ERROR_CODE) {
      profileImageError.value = error.message;
      profileImageName.value = "";
    }

    if (data) profileImageName.value = data?.[0].avatar;
    setProfileImageSource();
    getPrivateFileList();
  };

  const getPrivateFileList = async () => {
    const { data, error } = await client.storage
      .from(storage.value.bucket)
      .list(storage.value.folder, {
        limit: 100,
        offset: 0,
      });

    if (error) {
      privateFileListError.value = error.message;
    }

    if (data) {
      privateFileList.value = data.map((file) => file.name);
      setSelectedImage();
    }
  };

  const setSelectedImage = () => {
    if (privateFileList.value.includes(profileImageName.value)) {
      selectedImage.value = profileImageName.value;
    } else {
      selectedImage.value = "";
    }
    isLoading.value = false;
  };

  return {
    checkProfileImage,
    upsertProfileImage,
    getPrivateFileList,
    privateFileList,
    profileImageName,
    profileImageError,
    selectedImage,
    isLoading,
  };
};
