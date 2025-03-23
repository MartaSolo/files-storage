import { validation } from "@/utils/constants/validation";

export const useValidateName = () => {
  const name = ref("");
  const nameError = ref("");
  const nameTouched = ref(false);
  const nameSuccess = ref(false);

  watch([name, nameTouched], () => {
    if (!nameTouched.value) return;

    if (!name.value) {
      nameError.value = validation.name.error.empty;
      nameSuccess.value = false;
      return;
    }

    if (name.value.length < validation.name.minChar) {
      nameError.value = validation.name.error.tooShort;
      nameSuccess.value = false;
      return;
    }

    if (name.value.length > validation.name.maxChar) {
      nameError.value = validation.name.error.tooLong;
      nameSuccess.value = false;
      return;
    }

    if (!validation.name.regex.test(name.value)) {
      nameError.value = validation.name.error.invalid;
      nameSuccess.value = false;
      return;
    }

    nameSuccess.value = true;
    nameError.value = "";
  });

  const isNameValid = computed(
    () => name.value && nameTouched.value && !nameError.value
  );

  return { name, nameTouched, nameError, nameSuccess, isNameValid };
};
