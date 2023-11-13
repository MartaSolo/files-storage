import { validation } from "@/utils/constants/validation";

export const useValidateName = () => {
  const nameError = ref("");
  const nameTouched = ref(false);

  const validateName = (name: string) => {
    nameTouched.value = true;

    if (!validation.nameRegex.test(name)) {
      nameError.value = validation.nameError;
    } else {
      nameError.value = "";
    }

    return validation.nameRegex.test(name);
  };

  const handleNameInput = (name: string) => {
    if (nameTouched.value && nameError.value) {
      validateName(name);
    }
  };

  return { validateName, handleNameInput, nameError };
};
