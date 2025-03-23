<template>
  <form class="login" @submit.prevent="loginUser">
    <h1 class="login__title">Login to have access to your private files.</h1>
    <div class="login__content">
      <div class="login__inputs">
        <BaseInput
          v-model.trim="email"
          name="email"
          label="Email"
          class="login__email"
          :error-message="emailError"
          :valid="emailSuccess"
          @blur="emailTouched = true"
        />
        <BaseInput
          v-model.trim="password"
          :type="passwordInputType"
          name="password"
          label="Password"
          class="login__password"
          :error-message="passwordError"
          :valid="passwordSuccess"
          @blur="passwordTouched = true"
        >
          <button type="button" class="login__icon" @click="toggleShowPassword">
            <EyeIcon />
          </button>
        </BaseInput>
      </div>
      <div class="login__actions">
        <BaseButton theme="white" to="/">Cancel</BaseButton>
        <BaseButton type="submit" :disabled="!isFormValid">
          Confirm
        </BaseButton>
      </div>
      <div class="login__redirect">
        <h3 class="login__redirect-title">Don't have an account yet?</h3>
        <BaseButton
          to="/register"
          class="login__redirect-link"
          theme="light-green"
          size="large"
        >
          Register
        </BaseButton>
      </div>
      <span v-if="loginError" class="login__error">
        {{ loginError }}
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

const router = useRouter();
const { email, emailTouched, emailError, emailSuccess, isEmailValid } =
  useValidateEmail();
const {
  password,
  passwordTouched,
  passwordError,
  passwordSuccess,
  isPasswordValid,
} = useValidatePassword();
const { login } = useLoginUser();
const isStoragePublic = useIsStoragePublic();

const passwordInputType = ref("password");
const loginError = ref("");

const isFormValid = computed(() => {
  return !!(
    email.value &&
    password.value &&
    !emailError.value &&
    !passwordError.value
  );
});

const toggleShowPassword = () => {
  return passwordInputType.value === "password"
    ? (passwordInputType.value = "text")
    : (passwordInputType.value = "password");
};

const validateForm = () => isEmailValid.value && isPasswordValid.value;

const resetForm = () => {
  email.value = "";
  password.value = "";
};

const loginUser = async () => {
  if (!validateForm()) return;
  try {
    await login(email.value, password.value);
    resetForm();
    isStoragePublic.value = false;
    router.push("/");
  } catch (error: any) {
    loginError.value = error.message;
  }
};
</script>

<style lang="scss" scoped>
.login {
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
    padding: 0 1rem;
  }

  &__password {
    position: relative;
  }

  &__icon {
    border-radius: 8px;
    position: absolute;
    right: 7px;
    top: 36px;
  }

  &__actions {
    padding: 1rem 0;
    display: flex;
    justify-content: space-around;
  }

  &__redirect {
    padding: 2rem 0;
  }

  &__redirect-title {
    font-size: 1.5rem;
    padding-bottom: 2rem;
    text-align: center;
    color: $text-color-secondary;
  }

  &__redirect-link {
    width: 100%;
  }

  &__error {
    font-size: 1.3rem;
    color: $text-color-error;
    display: block;
    text-align: center;
    padding-bottom: 0.6rem;
  }
}
</style>
