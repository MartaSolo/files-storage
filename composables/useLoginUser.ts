export const useLoginUser = () => {
  const client = useSupabaseClient();

  const login = async (userEmail: string, userPassword: string) => {
    const { data, error } = await client.auth.signInWithPassword({
      email: userEmail,
      password: userPassword,
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  return { login };
};
