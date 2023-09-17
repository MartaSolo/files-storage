export const useRetrieveSession = () => {
  const client = useSupabaseClient();

  const userData = useUserData();
  const isStoragePublic = useIsStoragePublic();

  const isSessionLoading = ref(true);

  const retrieveSession = async () => {
    const { data, error } = await client.auth.getSession();
    if (error) {
      throw new Error(error.message);
    } else {
      userData.value.id = data.session?.user.id;
      userData.value.name = data.session?.user.user_metadata.first_name;
      userData.value.email = data.session?.user.email;
      userData.value.lastSignIn = data.session?.user.last_sign_in_at;
      userData.value.created = data.session?.user.created_at;

      isStoragePublic.value = false;

      isSessionLoading.value = false;
    }
    return data;
  };

  return { isSessionLoading, retrieveSession };
};
