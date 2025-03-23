import { validation } from "@/utils/constants/validation";

export const useValidateEmail = () => {
  const email = ref("");
  const emailError = ref("");
  const emailTouched = ref(false);
  const emailSuccess = ref(false);

  watch([email, emailTouched], () => {
    if (!emailTouched.value) return;

    if (!email.value) {
      emailError.value = validation.email.error.empty;
      emailSuccess.value = false;
      return;
    }

    if (!validation.email.regex.test(email.value)) {
      emailError.value = validation.email.error.invalid;
      emailSuccess.value = false;
      return;
    }

    emailSuccess.value = true;
    emailError.value = "";
  });

  const isEmailValid = computed(
    () => email.value && emailTouched.value && !emailError.value
  );

  return { email, emailTouched, emailError, emailSuccess, isEmailValid };
};
