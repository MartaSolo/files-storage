export const useRetrieveUser = () => {
  const client = useSupabaseClient();

  const retrieveUser = async () => {
    const { data, error } = await client.auth.getUser();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  return { retrieveUser };
};
