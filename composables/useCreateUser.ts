export const useCreateUser = () => {
  const client = useSupabaseClient();

  const register = async (
    userName: string,
    userEmail: string,
    userPassword: string
  ) => {
    const { data, error } = await client.auth.signUp({
      email: userEmail,
      password: userPassword,
      options: {
        data: {
          first_name: userName,
        },
      },
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  return { register };
};
