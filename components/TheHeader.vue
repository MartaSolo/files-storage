<script setup lang="ts">
const isUserLoggedIn = useIsUserLoggedIn();
const route = useRoute();

const headerText = computed(() => {
  return isUserLoggedIn.value
    ? "Your private files storage"
    : "Public files storage";
});

const link = computed(() => {
  if (!isUserLoggedIn.value && route.path !== "/login") {
    return {
      text: "Login",
      to: "/login",
    };
  } else if (!isUserLoggedIn.value && route.path === "/login") {
    return {
      text: "Home",
      to: "/",
    };
  } else {
    return {
      text: "Go to public",
      to: "/",
    };
  }
});
</script>

<template>
  <header class="header">
    <h1 class="header__title">{{ headerText }}</h1>
    <BaseButton :label="link.text" :to="link.to" />
  </header>
</template>

<style lang="scss" scoped>
.header {
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
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
