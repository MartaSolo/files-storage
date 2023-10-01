export const useRetrieveSession = () => {
  const client = useSupabaseClient();

  const isStoragePublic = useIsStoragePublic();

  const isSessionLoading = ref(true);

  const retrieveSession = async () => {
    const { data, error } = await client.auth.getSession();
    if (error) {
      throw new Error(error.message);
    } else {
      isStoragePublic.value = false;
      isSessionLoading.value = false;
    }
    return data;
  };

  return { isSessionLoading, retrieveSession };
};
