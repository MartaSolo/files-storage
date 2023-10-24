export const useRetrieveSession = () => {
  const client = useSupabaseClient();

  const isStoragePublic = useIsStoragePublic();

  const isSessionLoading = ref(true);
  const sessionError = ref("");

  const retrieveSession = async () => {
    const { data, error } = await client.auth.getSession();
    if (error) {
      sessionError.value = error.message;
    } else {
      isStoragePublic.value = false;
      isSessionLoading.value = false;
    }
    return data;
  };

  return { isSessionLoading, sessionError, retrieveSession };
};
