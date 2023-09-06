<script setup lang="ts">
const userData = useUserData();
const route = useRoute();

const headerText = computed(() => {
  return userData.value.id ? "Your private files" : "Public files";
});
</script>

<template>
  <header class="header">
    <h1 class="header__title">{{ headerText }}</h1>
    <BaseButton v-if="!userData.id" label="Login" to="/login" />
    <UserMenu v-if="userData.id" />
  </header>
</template>

<style lang="scss" scoped>
.header {
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  // align-items: baseline;
  align-items: center;
}

.header__title {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-align: center;
  padding: 0.75rem 0 1rem 1rem;
  color: $text-color-secondary;

  @include mediumScreen {
    font-size: 1.5rem;
    font-weight: 600;
  }

  @include largeScreen {
    flex-grow: 1;
  }
}
</style>
