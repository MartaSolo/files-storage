import { PROFILE_PLACEHOLDER_SOURCE } from "@/utils/constants/profilePlaceholderSource";
import { IGNORED_ERROR_CODE } from "@/utils/constants/ignoredErrorCode";

const profileImageName = ref("");

export const useProfileImage = () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const { storage } = useStorage();
  const profileImageSource = useProfileImageSource();

  const profileImageError = ref("");
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
        if (link) profileImageSource.value = link;
      } catch (e) {
        profileImageSource.value = PROFILE_PLACEHOLDER_SOURCE;
        profileImageName.value = "";
      }
    } else {
      profileImageSource.value = PROFILE_PLACEHOLDER_SOURCE;
      profileImageName.value = "";
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
      const images = data.filter(
        (file) => file.metadata.mimetype.split("/")[0] === "image"
      );
      privateFileList.value = images.map((file) => file.name);
      privateFileList.value.sort((a, b) => a.localeCompare(b));
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
