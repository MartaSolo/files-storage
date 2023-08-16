export const useValidatePassword = () => {
  const passwordError = ref<string>("");

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

    if (!passwordRegex.test(password)) {
      passwordError.value = "Please enter valid password";
    }
    return passwordRegex.test(password);
  };

  return { validatePassword, passwordError };
};
