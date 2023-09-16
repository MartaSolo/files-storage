export const useStorage = () => {
  const userData = useUserData();
  const isStorgePublic = useIsStoragePublic();

  const storage = computed(() => {
    if (!userData.value.id || (userData.value.id && isStorgePublic.value)) {
      return {
        bucket: "files",
        folder: "public",
      };
    } else {
      return {
        bucket: "private",
        folder: userData.value.id,
      };
    }
  });

  return { storage };
};
