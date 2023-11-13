<script setup lang="ts">
const { isSessionLoading, sessionError, retrieveSession } =
  useRetrieveSession();

onMounted(() => {
  retrieveSession();
});
</script>

<template>
  <div>
    <BaseLoader v-if="isSessionLoading" />
    <ErrorMessage v-else-if="sessionError" :description="sessionError" />
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
    <BaseNotification />
  </div>
</template>
