<script setup lang="ts">
const GridLayout = resolveComponent("GridLayout");
const ListLayout = resolveComponent("ListLayout");

const layoutType = useLayoutType();

const descriptionText = computed(() => {
  return layoutType.value === "grid" ? "List layout" : "Grid layout";
});

const layoutComponent = computed(() => {
  return layoutType.value === "grid" ? ListLayout : GridLayout;
});

const toggleLayout = () => {
  if (layoutType.value === "grid") {
    layoutType.value = "list";
  } else {
    layoutType.value = "grid";
  }
};
</script>

<template>
  <IconButton :description="descriptionText" @click="toggleLayout">
    <template #icon>
      <component :is="layoutComponent" />
    </template>
  </IconButton>
</template>
