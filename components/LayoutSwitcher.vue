<script setup>
import GridLayout from "@/components/svg/GridLayout.vue";
import ListLayout from "@/components/svg/ListLayout.vue";

const layoutType = useLayoutType();

const { isTextDisplayed, showText, hideText } = useButtonText();

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
  <div class="layout">
    <button
      class="layout__button"
      aria-labelledby="description"
      @click="toggleLayout"
      @mouseenter="showText"
      @mouseleave="hideText"
    >
      <component :is="layoutComponent" />
    </button>
    <span v-show="isTextDisplayed" id="description" class="layout__text">
      {{ descriptionText }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  position: relative;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.layout__button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: $color-grey-lighter;
  display: flex;
  justify-content: center;
  align-items: center;
}

.layout__button:hover {
  background-color: $color-grey-light;
}

.layout__text {
  @include buttonDescription;
  top: 52px;
}
</style>
