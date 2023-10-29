export const useValidateName = () => {
  const nameError = ref("");
  const nameTouched = ref(false);

  const validateName = (name: string) => {
    nameTouched.value = true;

    const nameRegex = /^(?!.* .* )[a-zA-Z ]{2,25}$/;
    if (!nameRegex.test(name)) {
      nameError.value =
        "Name should be at least 2 characters long and contain only letters";
    } else {
      nameError.value = "";
    }
    return nameRegex.test(name);
  };

  const handleNameInput = (name: string) => {
    if (nameTouched.value && nameError.value) {
      validateName(name);
    }
  };

  return { validateName, handleNameInput, nameError };
};
