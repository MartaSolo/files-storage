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

const tabs: { label: string; path: string }[] = [
  {
    label: "Add new files",
    path: "/",
  },
  {
    label: "All files",
    path: "/all-files",
  },
];

onMounted(() => {
  getSession();
});
</script>

<template>
  <BaseLoader v-if="isSessionLoading" />
  <div v-else>
    <TheHeader />
    <BaseTabs :tabs="tabs" />
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.content {
  padding: 1rem;
  max-width: 1700px;
  margin: 0 auto;
  overflow-y: hidden;
  height: calc(100vh - 108px);
  @include mediumScreen {
    height: calc(100vh - 132px);
  }
}
</style>
