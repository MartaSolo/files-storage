<script setup lang="ts">
const user = useSupabaseUser();
const isStoragePublic = useIsStoragePublic();
const route = useRoute();

const headerText = computed(() => {
  if (!user.value?.id || (user.value.id && isStoragePublic.value)) {
    return "Public files";
  } else {
    return "Private files";
  }
});

const isSwitcherShown = computed(() => {
  return user.value?.id && route.path !== "/your-profile";
});

const isButtonShown = computed(() => {
  return !user.value?.id && route.matched[0].name !== "login";
});
</script>

<template>
  <header class="header">
    <h1 class="header__title">{{ headerText }}</h1>
    <nav class="header__menu">
      <StorageSwitcher v-if="isSwitcherShown" v-model="isStoragePublic" />
      <BaseButton v-if="isButtonShown" to="/login"> Login </BaseButton>
      <UserMenu v-if="user?.id" />
    </nav>
  </header>
</template>

<style lang="scss" scoped>
.header {
  padding: 0.5rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__title {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 2px;
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
