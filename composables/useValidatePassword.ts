import { validation } from "@/utils/constants/validation";

export const useValidatePassword = () => {
  const password = ref("");
  const passwordError = ref("");
  const passwordTouched = ref(false);
  const passwordSuccess = ref(false);

  watch([password, passwordTouched], () => {
    if (!passwordTouched.value) return;

    if (!password.value) {
      passwordError.value = validation.password.error.empty;
      passwordSuccess.value = false;
      return;
    }

    if (password.value.length < validation.password.minChar) {
      passwordError.value = validation.password.error.tooShort;
      passwordSuccess.value = false;
      return;
    }

    if (password.value.length > validation.password.maxChar) {
      passwordError.value = validation.password.error.tooLong;
      passwordSuccess.value = false;
      return;
    }

    if (!validation.password.regex.digit.test(password.value)) {
      passwordError.value = validation.password.error.noDigit;
      passwordSuccess.value = false;
      return;
    }

    if (!validation.password.regex.lowerCase.test(password.value)) {
      passwordError.value = validation.password.error.noLowerCase;
      passwordSuccess.value = false;
      return;
    }

    if (!validation.password.regex.upperCase.test(password.value)) {
      passwordError.value = validation.password.error.noUpperCase;
      passwordSuccess.value = false;
      return;
    }

    if (!validation.password.regex.specialChar.test(password.value)) {
      passwordError.value = validation.password.error.noSpecialChar;
      passwordSuccess.value = false;
      return;
    }

    if (!validation.password.regex.noSpace.test(password.value)) {
      passwordError.value = validation.password.error.containsSpace;
      passwordSuccess.value = false;
      return;
    }

    passwordSuccess.value = true;
    passwordError.value = "";
  });

  const isPasswordValid = computed(
    () => password.value && passwordTouched.value && !passwordError.value
  );

  return {
    password,
    passwordTouched,
    passwordError,
    passwordSuccess,
    isPasswordValid,
  };
};
