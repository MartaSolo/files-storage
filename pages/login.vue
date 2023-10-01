<script setup lang="ts">
definePageMeta({
  layout: "login-layout",
});

const EyeIcon = resolveComponent("EyeIcon");

const router = useRouter();
const { validateEmail, emailError } = useValidateEmail();
const { validatePassword, passwordError } = useValidatePassword();
const { login } = useLoginUser();
const isStoragePublic = useIsStoragePublic();
const user = useSupabaseUser();

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

const handleEmailInput = () => {
  if (emailError.value) validateEmail(email.value);
  if (validateEmail(email.value)) emailError.value = "";
};

const handlePasswordInput = () => {
  if (passwordError.value) validatePassword(password.value);
  if (validatePassword(password.value)) passwordError.value = "";
};

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

onMounted(() => {
  if (user.value?.id) {
    router.push({ path: "/" });
  }
});
</script>

<template>
  <form class="login" @submit.prevent="loginUser">
    <h2 class="login__title">Login to have access to your private files.</h2>
    <div class="login__content">
      <div class="login__inputs">
        <BaseInput
          v-model.trim="email"
          name="email"
          label="Email"
          class="login__email"
          :class="validationClasses(emailError, email)"
          @input="handleEmailInput"
          @blur="validateEmail(email)"
        />
        <span v-if="emailError" class="error__message">{{ emailError }}</span>
        <BaseInput
          v-model.trim="password"
          :type="passwordInputType"
          name="password"
          label="Password"
          class="login__password"
          :class="validationClasses(passwordError, password)"
          @input="handlePasswordInput"
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
        <span v-if="passwordError" class="error__message">{{
          passwordError
        }}</span>
      </div>
      <div class="login__actions">
        <BaseButton label="Cancel" theme="white" to="/" />
        <BaseButton type="submit" label="Confirm" :disabled="!isFormValid" />
      </div>
      <div class="login__redirect">
        <h3 class="login__redirect--title">Don't have an account yet?</h3>
        <BaseButton
          label="Register"
          to="/register"
          class="login__redirect--link"
          theme="light-green"
        />
      </div>
      <span v-if="loginError" class="error__message--action">{{
        loginError
      }}</span>
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
  padding: 0 2rem 0 2rem;
}

.login__email,
.login__password {
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 2rem;
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
  padding-bottom: 1rem;
  text-align: center;
  color: $text-color-secondary;
}

.login__redirect--link {
  width: 100%;
}

.error__message {
  font-size: 0.8rem;
  color: $text-color-error;
  display: block;
  padding-bottom: 0.6rem;
}
.error__message--action {
  font-size: 1.3rem;
  color: $text-color-error;
  display: block;
  text-align: center;
  padding-bottom: 0.6rem;
}
</style>

<style lang="scss">
.login__email.input__input,
.login__password.input__input {
  width: 100%;
}

.error.login__email.input__input,
.error.login__password.input__input {
  border: 1px solid $text-color-error;
}

.success.login__email.input__input,
.success.login__password.input__input {
  border: 1px solid $text-color-success;
}

.login__password {
  position: relative;
}
</style>
