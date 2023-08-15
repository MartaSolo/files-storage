<script setup lang="ts">
definePageMeta({
  layout: "login-layout",
});

const name = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
</script>

<template>
  <section class="register">
    <h2 class="register__title">Register to create your private storage.</h2>
    <div class="register__content">
      <div class="register__inputs">
        <BaseInput
          v-model="name"
          name="name"
          label="Name"
          class="register__name"
        />
        <BaseInput
          v-model="email"
          name="email"
          label="Email"
          class="register__email"
        />
        <BaseInput
          v-model="password"
          name="password"
          label="Password"
          class="register__password"
        />
      </div>
      <div class="register__actions">
        <BaseButton label="Cancel" theme="white" to="/" />
        <BaseButton label="Confirm" />
      </div>
    </div>
  </section>
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
}

.register__name,
.register__email,
.register__password {
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 2rem;
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
</style>
