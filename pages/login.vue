<script setup lang="ts">
definePageMeta({
  layout: "login-layout",
});

const email = ref<string>("");
const password = ref<string>("");
</script>

<template>
  <section class="login">
    <h2 class="login__title">Login to have access to your private files.</h2>
    <div class="login__content">
      <div class="login__inputs">
        <BaseInput
          v-model="email"
          name="email"
          label="Email"
          class="login__email"
        />
        <BaseInput
          v-model="password"
          name="password"
          label="Password"
          class="login__password"
        />
      </div>
      <div class="login__actions">
        <BaseButton label="Cancel" theme="white" to="/" />
        <BaseButton label="Confirm" />
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
    </div>
  </section>
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
</style>

<style lang="scss">
.login__email.input__input,
.login__password.input__input {
  width: 100%;
}
</style>
