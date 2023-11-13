import { validation } from "@/utils/constants/validation";

export const useValidateEmail = () => {
  const emailError = ref("");
  const emailTouched = ref(false);

  const validateEmail = (email: string) => {
    emailTouched.value = true;

    if (!validation.emailRegex.test(email)) {
      emailError.value = validation.emailError;
    } else {
      emailError.value = "";
    }
    return validation.emailRegex.test(email);
  };

  const handleEmailInput = (email: string) => {
    if (emailTouched.value && emailError.value) {
      validateEmail(email);
    }
  };

  return { validateEmail, handleEmailInput, emailError };
};
