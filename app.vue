<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <AppLoader v-if="isSessionLoading" class="app__overlay" />
    <BaseMessage
      v-else-if="sessionError"
      type="error"
      :title="sessionError"
      class="app__overlay"
    />

    <BaseNotification />
  </div>
</template>

<script setup lang="ts">
const { isSessionLoading, sessionError, retrieveSession } =
  useRetrieveSession();

onMounted(() => {
  retrieveSession();
});
</script>

<style lang="scss" scoped>
.app {
  position: relative;
  height: 100vh;
}

.app__overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
}
</style>
