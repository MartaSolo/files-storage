export const useCreateBucket = () => {
  const client = useSupabaseClient();

  const createBucket = async (bucketName: string) => {
    const { data, error } = await client.storage.createBucket(bucketName, {
      public: false,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  return { createBucket };
};
