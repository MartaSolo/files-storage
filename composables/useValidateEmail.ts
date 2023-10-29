export const useValidateEmail = () => {
  const emailError = ref("");
  const emailTouched = ref(false);

  const validateEmail = (email: string) => {
    emailTouched.value = true;

    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(email)) {
      emailError.value = "Please enter valid email address";
    } else {
      emailError.value = "";
    }
    return emailRegex.test(email);
  };

  const handleEmailInput = (email: string) => {
    if (emailTouched.value && emailError.value) {
      validateEmail(email);
    }
  };

  return { validateEmail, handleEmailInput, emailError };
};
