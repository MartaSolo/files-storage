<script setup lang="ts">
definePageMeta({
  layout: "no-tabs-layout",
  middleware: "auth",
});

const EyeIcon = resolveComponent("EyeIcon");

const router = useRouter();
const { validateEmail, handleEmailInput, emailError } = useValidateEmail();
const { validatePassword, handlePasswordInput, passwordError } =
  useValidatePassword();
const { login } = useLoginUser();
const isStoragePublic = useIsStoragePublic();

const email = ref("");
const password = ref("");
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

const validationClasses = (error: string, inputValue: string) => {
  return [error ? "error" : "", inputValue && !error ? "success" : ""];
};

const toggleShowPassword = () => {
  return passwordInputType.value === "password"
    ? (passwordInputType.value = "text")
    : (passwordInputType.value = "password");
};

const validateForm = () => {
  return validateEmail(email.value) && validatePassword(password.value);
};

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
          :class="validationClasses(emailError, email)"
          @input="handleEmailInput(email)"
          @blur="validateEmail(email)"
        />
        <span v-if="emailError" class="login__error">{{ emailError }}</span>
        <BaseInput
          v-model.trim="password"
          :type="passwordInputType"
          name="password"
          label="Password"
          class="login__password"
          :class="validationClasses(passwordError, password)"
          @input="handlePasswordInput(password)"
          @blur="validatePassword(password)"
        >
          <button
            type="button"
            class="login__password--button"
            @click="toggleShowPassword"
          >
            <EyeIcon />
          </button>
        </BaseInput>
        <span v-if="passwordError" class="login__error">{{
          passwordError
        }}</span>
      </div>
      <div class="login__actions">
        <BaseButton theme="white" to="/">Cancel</BaseButton>
        <BaseButton type="submit" :disabled="!isFormValid">
          Confirm
        </BaseButton>
      </div>
      <div class="login__redirect">
        <h3 class="login__redirect--title">Don't have an account yet?</h3>
        <BaseButton
          to="/register"
          class="login__redirect--link"
          theme="light-green"
          size="large"
        >
          Register
        </BaseButton>
      </div>
      <span v-if="loginError" class="login__error--action">
        {{ loginError }}
      </span>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login__title {
  font-size: 2rem;
  text-align: center;
  padding: 2rem;
  color: $text-color-secondary;
}

.login__content {
  width: 100%;
  max-width: 500px;
  padding: 0 1rem;
}

.login__email,
.login__password {
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 2rem;
}

.login__password {
  position: relative;
}

.login__password--button {
  border-radius: 8px;
  position: absolute;
  right: 7px;
  top: 32px;
}

.error.login__email,
.error.login__password {
  padding-bottom: 0.2rem;
}

.login__actions {
  padding: 1rem 0;
  display: flex;
  justify-content: space-around;
}

.login__redirect {
  padding: 2rem 0;
}

.login__redirect--title {
  font-size: 1.5rem;
  padding-bottom: 2rem;
  text-align: center;
  color: $text-color-secondary;
}

.login__redirect--link {
  width: 100%;
}

.login__error {
  font-size: 0.8rem;
  color: $text-color-error;
  display: block;
  padding-bottom: 0.6rem;
}

.login__error--action {
  font-size: 1.3rem;
  color: $text-color-error;
  display: block;
  text-align: center;
  padding-bottom: 0.6rem;
}
</style>
