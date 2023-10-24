export const useLogoutUser = () => {
  const client = useSupabaseClient();

  const logout = async () => {
    const { error } = await client.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  };

  return { logout };
};
