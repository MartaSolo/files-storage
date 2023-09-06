export const useRetrieveSession = () => {
  const userData = useUserData();

  const client = useSupabaseClient();

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
    }
    return data;
  };

  return { retrieveSession };
};
