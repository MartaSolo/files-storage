<script setup lang="ts">
import MoreActions from "@/components/svg/MoreActions.vue";

const isMenuOpen = ref(false);

const root = ref<HTMLElement | null>(null);

useClickOutside(root, () => {
  isMenuOpen.value = false;
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <div ref="root" class="menu">
    <IconButton description="More actions" theme="grey" @click="toggleMenu">
      <template #icon>
        <MoreActions />
      </template>
    </IconButton>
    <div v-if="isMenuOpen" class="menu__list"></div>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  width: 40px;
  height: 40px;
  position: relative;
}

.menu__list {
  width: 100px;
  height: 200px;
  position: absolute;
  z-index: 9999;
  background-color: palevioletred;
}
</style>
