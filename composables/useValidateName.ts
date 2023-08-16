export const useValidateName = () => {
  const nameError = ref<string>("");

  const validateName = (name: string) => {
    const nameRegex = /^(?!.* .* )[a-zA-Z ]{2,25}$/;
    if (!nameRegex.test(name)) {
      nameError.value =
        "Name should be at least 2 characters long and contain only letters";
    }
    return nameRegex.test(name);
  };

  return { validateName, nameError };
};
