<script setup lang="ts">
const GridLayout = resolveComponent("GridLayout");
const ListLayout = resolveComponent("ListLayout");

const layoutType = useLayoutType();

const descriptionText = computed(() => {
  return layoutType.value === "grid" ? "Grid layout" : "List layout";
});

const layoutComponent = computed(() => {
  return layoutType.value === "grid" ? GridLayout : ListLayout;
});

const toggleLayout = () => {
  layoutType.value === "grid"
    ? (layoutType.value = "list")
    : (layoutType.value = "grid");
};
</script>

<template>
  <IconButton :description="descriptionText" theme="grey" @click="toggleLayout">
    <template #icon>
      <component :is="layoutComponent" />
    </template>
  </IconButton>
</template>

<style lang="scss" scoped></style>
