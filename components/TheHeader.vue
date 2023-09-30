<script setup lang="ts">
const userData = useUserData();
const isStoragePublic = useIsStoragePublic();
const route = useRoute();

const headerText = computed(() => {
  if (!userData.value.id || (userData.value.id && isStoragePublic.value)) {
    return "Public files";
  } else {
    return "Private files";
  }
});

const isButtonShown = computed(() => {
  return !userData.value.id && route.matched[0].name !== "login";
});
</script>

<template>
  <header class="header">
    <h1 class="header__title">{{ headerText }}</h1>
    <nav class="header__menu">
      <StorageSwitcher v-if="userData.id" v-model="isStoragePublic" />
      <BaseButton v-if="isButtonShown" label="Login" to="/login" />
      <UserMenu v-if="userData.id" />
    </nav>
  </header>
</template>

<style lang="scss" scoped>
.header {
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__title {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 2px;
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

.header__menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
