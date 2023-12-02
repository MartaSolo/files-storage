<script setup lang="ts">
definePageMeta({
  layout: "no-tabs-layout",
  middleware: "no-auth",
});

onMounted(() => {
  const isStoragePublic = useIsStoragePublic();
  isStoragePublic.value = false;
});
</script>

<template>
  <section class="profile">
    <h1 class="profile__title">Your personal information</h1>
    <div class="profile__content">
      <ProfileUpdateForm />
      <ProfileUploadPhoto />
    </div>
    <div class="profile__action">
      <BaseButton theme="light-green" to="/all-files"
        >Go to your private storage</BaseButton
      >
    </div>
  </section>
</template>

<style lang="scss" scoped>
.profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
}

.profile__title {
  font-size: 2rem;
  text-align: center;
  padding: 0 2rem 2rem 2rem;
  color: $text-color-secondary;
}

.profile__content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  @include mediumScreen {
    flex-direction: row;
  }
}

.profile__action {
  width: 100%;
  max-width: 300px;
  margin: 2rem 0;
  align-self: center;
}
</style>
