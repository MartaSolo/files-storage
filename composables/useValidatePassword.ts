import { validation } from "@/utils/constants/validation";

export const useValidatePassword = () => {
  const passwordError = ref("");
  const passwordTouched = ref(false);

  const validatePassword = (password: string) => {
    passwordTouched.value = true;

    if (!validation.passwordRegex.test(password)) {
      passwordError.value = validation.passwordError;
    } else {
      passwordError.value = "";
    }
    return validation.passwordRegex.test(password);
  };

  const handlePasswordInput = (password: string) => {
    if (passwordTouched.value && passwordError.value) {
      validatePassword(password);
    }
  };

  return {
    validatePassword,
    handlePasswordInput,
    passwordError,
  };
};
