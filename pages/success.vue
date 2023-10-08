<script setup lang="ts">
definePageMeta({
  layout: "login-layout",
});
</script>

<template>
  <section class="success">
    <div class="success__content">
      <h1 class="success__title">You have been registered successfully!</h1>
      <div class="success__actions">
        <BaseButton theme="white" to="/your-profile"
          >Go to user page</BaseButton
        >
        <BaseButton to="/">Go to your storage</BaseButton>
      </div>
    </div>
  </section>
</template>

<style lang="css" scoped>
.success {
  display: flex;
  justify-content: center;
  padding-top: 150px;
}

.success__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  width: 500px;
}

.success__title {
  font-size: 2rem;
  text-align: center;
  padding: 2rem;
  color: $text-color-secondary;
}

.success__actions {
  display: flex;
  gap: 1rem;
}
</style>
