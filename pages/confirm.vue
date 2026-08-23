<script setup lang="ts">
definePageMeta({
  layout: "no-tabs-layout",
});

const user = useSupabaseUser();

watch(
  user,
  () => {
    if (user.value) {
      return navigateTo("/success");
    }
  },
  { immediate: true }
);
</script>

<template>
  <section class="confirm">
    <div class="confirm__content">
      <h1 class="confirm__title">You have been logged in successfully!</h1>
      <div class="confirm__actions">
        <BaseButton theme="white" to="/your-profile">
          Go to user page
        </BaseButton>
        <BaseButton to="/">Go to your storage</BaseButton>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.confirm {
  display: flex;
  justify-content: center;
  padding-top: 150px;
}

.confirm__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  width: 500px;
}

.confirm__title {
  font-size: 2rem;
  text-align: center;
  padding: 2rem;
  color: $text-color-secondary;
}

.confirm__actions {
  display: flex;
  gap: 1rem;
}
</style>
