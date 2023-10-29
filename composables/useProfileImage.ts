import { PROFILE_PLACEHOLDER_SOURCE } from "@/utils/constants/profilePlaceholderSource";

export const useProfileImage = () => {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const profileImageSource = useProfileImageSource();

  const profileImageError = ref("");
  const profileImageName = ref("");

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

    if (error && status !== 406) {
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

    if (error && status !== 406) {
      profileImageError.value = error.message;
      profileImageName.value = "";
    }

    if (data) profileImageName.value = data?.[0].avatar;
    setProfileImageSource();
  };

  return {
    checkProfileImage,
    upsertProfileImage,
    profileImageName,
    profileImageError,
  };
};
