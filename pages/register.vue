<script setup lang="ts">
definePageMeta({
  layout: "login-layout",
});

const EyeIcon = resolveComponent("EyeIcon");

const { validateName, nameError } = useValidateName();
const { validateEmail, emailError } = useValidateEmail();
const { validatePassword, passwordError } = useValidatePassword();
const { validateBucketName, bucketNameError } = useValidateBucketName();
const { register } = useCreateUser();
const { createBucket } = useCreateBucket();
const isUserLoggedIn = useIsUserLoggedIn();

const name = ref("");
const email = ref("");
const password = ref("");
const bucket = ref("");
const passwordInputType = ref("password");
const registerError = ref("");
const createBucketError = ref("");

const handleNameFocus = () => {
  if (nameError.value) nameError.value = "";
};

const handleEmailFocus = () => {
  if (emailError.value) emailError.value = "";
};

const handlePasswordFocus = () => {
  if (passwordError.value) passwordError.value = "";
};

const handleBucketFocus = () => {
  if (bucketNameError.value) bucketNameError.value = "";
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

const registerUser = async () => {
  try {
    await register(name.value, email.value, password.value);
    isUserLoggedIn.value = true;
    // await createBucket(bucket.value);
    // redirect to user page
  } catch (error: any) {
    registerError.value = error.message;
    createBucketError.value = error.message;
  }
};

// utworzenie buycketa??

const handleSubmit = () => {
  if (!validateForm()) return;
  console.log("handleSubmit");
  registerUser();
  // if (!registerError.value) {
    // createBucket();
  // }
};
</script>

<template>
  <form class="register" @submit.prevent="handleSubmit">
    <h2 class="register__title">Register and create your private storage.</h2>
    <div class="register__content">
      <div class="register__inputs">
        <BaseInput
          v-model="name"
          name="name"
          label="Name"
          class="register__name"
          :class="validationClasses(nameError, name)"
          @focus="handleNameFocus"
          @blur="validateName(name)"
        />
        <span v-if="nameError" class="error__message">{{ nameError }}</span>
        <BaseInput
          v-model="email"
          name="email"
          label="Email"
          class="register__email"
          :class="validationClasses(emailError, email)"
          @focus="handleEmailFocus"
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
          v-model="password"
          :type="passwordInputType"
          name="password"
          label="Password"
          class="register__password"
          :class="validationClasses(passwordError, password)"
          @focus="handlePasswordFocus"
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
        <BaseAccordion
          title="Storage name hint"
          content="Storage name must consist of 5 to 15 and can contain lowercase and uppercase letters, numbers and some special characters: exclamation point (!), hyphen (-), underscore (_), period (.), asterisk (*), single quote ('), open parenthesis ((), close parenthesis ())."
        />
        <BaseInput
          v-model="bucket"
          name="bucket"
          label="Private storage name"
          class="register__bucket"
          :class="validationClasses(bucketNameError, bucket)"
          @focus="handleBucketFocus"
          @blur="validateBucketName(bucket)"
        />
        <span v-if="bucketNameError" class="error__message">{{
          bucketNameError
        }}</span>
      </div>
      <div class="register__actions">
        <BaseButton label="Cancel" theme="white" to="/" />
        <BaseButton type="submit" label="Confirm" />
      </div>
      <span v-if="registerError">{{ registerError }}</span>
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
