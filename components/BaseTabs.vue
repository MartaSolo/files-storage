<script setup lang="ts">
const props = defineProps<{
  tabs: { label: string; path: string }[];
}>();
</script>

<template>
  <ul class="tabs" role="tablist">
    <BaseTab v-for="tab in tabs" :key="tab.path" :tab="tab" />
  </ul>
</template>

<style lang="scss" scoped>
.tabs {
  display: flex;
}
</style>
