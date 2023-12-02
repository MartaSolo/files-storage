<script setup lang="ts">
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
</script>

<template>
  <div>
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
  @include mediumScreen {
    height: calc(100vh - 134px);
  }
}
</style>
