<template>
  <form class="register" @submit.prevent="registerUser">
    <h1 class="register__title">Register and create your private storage.</h1>
    <div class="register__content">
      <div class="register__inputs">
        <BaseInput
          v-model.trim="name"
          name="name"
          label="Name"
          class="register__name"
          :error-message="nameError"
          :valid="nameSuccess"
          @blur="nameTouched = true"
        />
        <BaseInput
          v-model.trim="email"
          name="email"
          label="Email"
          class="register__email"
          :error-message="emailError"
          :valid="emailSuccess"
          @blur="emailTouched = true"
        />
        <BaseAccordion
          title="Password hint"
          content="Password must consist of 8 to 15 characters and contain at least one
          lowercase letter, one uppercase letter, one numeric digit, and one
          special character."
        />
        <BaseInput
          v-model.trim="password"
          :type="passwordInputType"
          name="password"
          label="Password"
          class="register__password"
          :error-message="passwordError"
          :valid="passwordSuccess"
          @blur="passwordTouched = true"
          ><button
            type="button"
            class="register__icon"
            @click="toggleShowPassword"
          >
            <EyeIcon />
          </button>
        </BaseInput>
      </div>
      <div class="register__actions">
        <BaseButton theme="white" to="/">Cancel</BaseButton>
        <BaseButton type="submit" :disabled="!isFormValid">
          Confirm
        </BaseButton>
      </div>
      <span v-if="registerError" class="register__error">
        {{ registerError }}
      </span>
    </div>
  </form>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "no-tabs-layout",
  middleware: "auth",
});

const EyeIcon = resolveComponent("EyeIcon");

const passwordInputType = ref("password");
const registerError = ref("");

const router = useRouter();
const { name, nameError, nameSuccess, nameTouched, isNameValid } =
  useValidateName();
const { email, emailTouched, emailError, emailSuccess, isEmailValid } =
  useValidateEmail();
const {
  password,
  passwordTouched,
  passwordError,
  passwordSuccess,
  isPasswordValid,
} = useValidatePassword();
const { register } = useCreateUser();

const isFormValid = computed(() => {
  return !!(
    name.value &&
    email.value &&
    password.value &&
    !nameError.value &&
    !emailError.value &&
    !passwordError.value
  );
});

const toggleShowPassword = () => {
  return passwordInputType.value === "password"
    ? (passwordInputType.value = "text")
    : (passwordInputType.value = "password");
};

const validateForm = () =>
  isNameValid.value && isEmailValid.value && isPasswordValid.value;

const resetForm = () => {
  name.value = "";
  email.value = "";
  password.value = "";
};

const registerUser = async () => {
  if (!validateForm()) return;
  try {
    await register(name.value, email.value, password.value);
    resetForm();
    router.push("/success");
  } catch (error: any) {
    registerError.value = error.message;
  }
};
</script>

<style lang="scss" scoped>
.register {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__title {
    font-size: 2rem;
    text-align: center;
    padding: 2rem;
    color: $text-color-secondary;
  }

  &__content {
    width: 100%;
    max-width: 500px;
    padding: 0 2rem 0 2rem;
    margin-bottom: 2rem;
  }

  &__password {
    position: relative;
  }

  &__actions {
    padding: 1rem 0;
    display: flex;
    justify-content: space-around;
  }

  &__error {
    font-size: 1.3rem;
    color: $text-color-error;
    display: block;
    text-align: center;
    padding-bottom: 0.6rem;
  }

  &__icon {
    border-radius: 8px;
    position: absolute;
    right: 7px;
    top: 36px;
  }
}
</style>
