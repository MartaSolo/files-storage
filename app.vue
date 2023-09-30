<script setup lang="ts">
const { isSessionLoading, retrieveSession } = useRetrieveSession();
const getSessionError = ref("");

const getSession = async () => {
  try {
    await retrieveSession();
  } catch (error: any) {
    getSessionError.value = error.message;
  }
};

onMounted(() => {
  getSession();
});
</script>

<template>
  <div>
    <BaseLoader v-if="isSessionLoading" />
    <ErrorMessage v-else-if="getSessionError" :description="getSessionError" />
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
