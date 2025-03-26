<template>
  <div class="app">
    <BaseLoader v-if="isSessionLoading" />
    <BaseMessage v-else-if="sessionError" type="error" :title="sessionError" />
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
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
}
</style>
