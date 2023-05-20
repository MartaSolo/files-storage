<script setup lang="ts">
// const client = useSupabaseClient();

const props = defineProps<{
  fileName: string;
}>();

const isMenuOpen = ref(false);

const root = ref<HTMLElement | null>(null);

const copyFile = useCopyFile(props.fileName);

const copyLink = useCopyLink(props.fileName);

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
    <template v-if="isMenuOpen">
      <ul class="menu__list">
        <li class="menu__list--item">
          <button class="menu__item--button" @click="copyFile.copy">
            Copy file
            <div class="menu__item--icon"><CopyFile /></div>
          </button>
        </li>
        <li class="menu__list--item">
          <button class="menu__item--button" @click="copyLink.copy">
            Copy link
            <div class="menu__item--icon"><CopyLink /></div>
          </button>
        </li>
      </ul>
    </template>
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
  right: 20px;
  position: absolute;
  z-index: 9999;
  background-color: $color_white;
}
</style>
