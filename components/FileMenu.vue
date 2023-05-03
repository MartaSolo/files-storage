<script setup lang="ts">
import MoreActions from "@/components/svg/MoreActions.vue";

const { isTextDisplayed, showText, hideText } = useButtonText();

const isMenuOpen = ref(false);

const root = ref<HTMLElement | null>(null);

useClickOutside(root, () => {
  isMenuOpen.value = false;
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isTextDisplayed) isTextDisplayed.value = false;
};
</script>

<template>
  <div ref="root" class="menu">
    <button
      class="menu__button"
      aria-labelledby="description"
      @click="toggleMenu"
      @mouseenter="showText"
      @mouseleave="hideText"
    >
      <MoreActions />
    </button>
    <span v-show="isTextDisplayed" id="description" class="menu__description"
      >More actions</span
    >
    <div v-if="isMenuOpen" class="menu__list"></div>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  border: 1px solid green;
  width: 40px;
  height: 40px;
  position: relative;
}
.menu__button {
  border-radius: 50%;
  background-color: $color-green-light;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: $color-green-medium;
  }
}

.menu__description {
  @include buttonDescription;
  top: 40px;
  left: -22px;
  width: 90px;
}
.menu__list {
  width: 200px;
  height: 200px;
  background-color: palevioletred;
  position: absolute;
}
</style>
