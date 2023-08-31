export const useRetrieveSession = () => {
  const isUserLoggedIn = useIsUserLoggedIn();
  const userId = useUserId();

  const client = useSupabaseClient();

  const retrieveSession = async () => {
    const { data, error } = await client.auth.getSession();
    if (error) {
      throw new Error(error.message);
    } else {
      isUserLoggedIn.value = true;
      userId.value = data.session?.user.id;
    }
    return data;
  };

  return { retrieveSession };
};
