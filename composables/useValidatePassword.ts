export const useValidatePassword = () => {
  const passwordError = ref("");
  const passwordTouched = ref(false);

  const validatePassword = (password: string) => {
    passwordTouched.value = true;

    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

    if (!passwordRegex.test(password)) {
      passwordError.value = "Please enter valid password";
    } else {
      passwordError.value = "";
    }
    return passwordRegex.test(password);
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
