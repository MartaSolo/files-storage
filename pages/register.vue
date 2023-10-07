<script setup lang="ts">
definePageMeta({
  layout: "login-layout",
  middleware: "auth",
});

const EyeIcon = resolveComponent("EyeIcon");

const router = useRouter();
const { validateName, nameError } = useValidateName();
const { validateEmail, emailError } = useValidateEmail();
const { validatePassword, passwordError } = useValidatePassword();
const { register } = useCreateUser();

const name = ref("");
const email = ref("");
const password = ref("");
const passwordInputType = ref("password");
const registerError = ref("");

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

const handleNameInput = () => {
  if (nameError.value) validateName(name.value);
  if (validateName(name.value)) nameError.value = "";
};

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
  return (
    validateName(name.value) &&
    validateEmail(email.value) &&
    validatePassword(password.value)
  );
};

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
    router.push("/");
  } catch (error: any) {
    registerError.value = error.message;
  }
};
</script>

<template>
  <form class="register" @submit.prevent="registerUser">
    <h2 class="register__title">Register and create your private storage.</h2>
    <div class="register__content">
      <div class="register__inputs">
        <BaseInput
          v-model.trim="name"
          name="name"
          label="Name"
          class="register__name"
          :class="validationClasses(nameError, name)"
          @input="handleNameInput"
          @blur="validateName(name)"
        />
        <span v-if="nameError" class="error__message">{{ nameError }}</span>
        <BaseInput
          v-model.trim="email"
          name="email"
          label="Email"
          class="register__email"
          :class="validationClasses(emailError, email)"
          @input="handleEmailInput"
          @blur="validateEmail(email)"
        />
        <span v-if="emailError" class="error__message">{{ emailError }}</span>
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
          :class="validationClasses(passwordError, password)"
          @input="handlePasswordInput"
          @blur="validatePassword(password)"
          ><button
            type="button"
            class="register__password--button"
            @click="toggleShowPassword"
          >
            <EyeIcon />
          </button>
        </BaseInput>
        <span v-if="passwordError" class="error__message">{{
          passwordError
        }}</span>
      </div>
      <div class="register__actions">
        <BaseButton theme="white" to="/">Cancel</BaseButton>
        <BaseButton type="submit" :disabled="!isFormValid">Confirm</BaseButton>
      </div>
      <span v-if="registerError" class="error__message--action">{{
        registerError
      }}</span>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.register {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.register__title {
  font-size: 2rem;
  text-align: center;
  padding: 2rem;
  color: $text-color-secondary;
}

.register__content {
  width: 100%;
  max-width: 500px;
  padding: 0 2rem 0 2rem;
  margin-bottom: 2rem;
}

.register__name,
.register__email,
.register__password,
.register__bucket {
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 2rem;
}

.error.register__name,
.error.register__email,
.error.register__password,
.error.register__bucket {
  padding-bottom: 0.2rem;
}

.register__actions {
  padding: 1rem 0;
  display: flex;
  justify-content: space-around;
}

.register__redirect {
  padding: 2rem 0;
}

.register__redirect--title {
  font-size: 1.5rem;
  padding-bottom: 1rem;
  text-align: center;
}

.register__redirect--link {
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

.register__password--info {
  font-size: 0.9rem;
  color: $color-green-dark-hover;
  padding-bottom: 1rem;
}

.register__password--button {
  border-radius: 8px;
  position: absolute;
  right: 7px;
  top: 32px;
}
</style>

<style lang="scss">
.register__name.input__input,
.register__email.input__input,
.register__password.input__input,
.register__bucket.input__input {
  width: 100%;
}

.error.register__name.input__input,
.error.register__email.input__input,
.error.register__password.input__input,
.error.register__bucket.input__input {
  border: 1px solid $text-color-error;
}

.success.register__name.input__input,
.success.register__email.input__input,
.success.register__password.input__input,
.success.register__bucket.input__input {
  border: 1px solid $text-color-success;
}

.register__password {
  position: relative;
}
</style>
