export const useValidateBucketName = () => {
  const bucketNameError = ref<string>("");

  const validateBucketName = (bucketName: string) => {
    const bucketNameRegex = /^[a-zA-Z0-9!()-_'.*()]{5,15}$/;
    // const bucketNameRegex = /^[a-zA-Z0-9!_.-*'()]*${2,25}$/;
    // const bucketNameRegex = /^(?!.* .* )[a-zA-Z ]{2,25}$/;
    if (!bucketNameRegex.test(bucketName)) {
      bucketNameError.value = "Bucket name is invalid";
    }
    return bucketNameRegex.test(bucketName);
  };

  return { validateBucketName, bucketNameError };
};
