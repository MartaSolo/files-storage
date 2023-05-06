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
    <IconButton description="More actions" theme="green" @click="toggleMenu">
      <template #icon>
        <MoreActions />
      </template>
    </IconButton>
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

.menu__list {
  width: 200px;
  height: 200px;
  background-color: palevioletred;
  position: absolute;
}
</style>
