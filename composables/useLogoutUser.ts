export const useLogoutUser = () => {
  const client = useSupabaseClient();

  const userData = useUserData();

  const logout = async () => {
    const { error } = await client.auth.signOut();
    if (error) {
      throw new Error(error.message);
    } else {
      userData.value.id = undefined;
      userData.value.name = undefined;
      userData.value.email = undefined;
      userData.value.lastSignIn = undefined;
      userData.value.created = undefined;
    }
  };

  return { logout };
};
