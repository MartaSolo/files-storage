<script setup lang="ts">
const props = defineProps<{
  fileName: string;
}>();

const emit = defineEmits<{
  (e: "fileAction"): void;
}>();

const isMenuOpen = ref(false);

const root = ref<HTMLElement | null>(null);

const copyFile = useCopyFile(props.fileName);
const copyLink = useCopyLink(props.fileName);
const deleteFile = useDeleteFile(props.fileName);
const downloadFile = useDownloadFile(props.fileName);

useClickOutside(root, () => {
  isMenuOpen.value = false;
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleCopyLink = () => {
  copyLink.copy();
  toggleMenu();
};

const handleCopyFile = async () => {
  await copyFile.copy();
  toggleMenu();
  emit("fileAction");
};

const handleDownloadFile = () => {
  downloadFile.download();
  toggleMenu();
};

const handleDeleteFile = async () => {
  await deleteFile.remove();
  toggleMenu();
  emit("fileAction");
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
          <button class="menu__item--button" @click="handleCopyLink">
            Copy link
            <div class="menu__item--icon"><CopyLink /></div>
          </button>
        </li>
        <li class="menu__list--item">
          <button class="menu__item--button" @click="handleCopyFile">
            Copy file
            <div class="menu__item--icon"><CopyFile /></div>
          </button>
        </li>
        <li class="menu__list--item">
          <button class="menu__item--button" @click="handleDownloadFile">
            Download file
            <div class="menu__item--icon"><DownloadFile /></div>
          </button>
        </li>
        <li class="menu__list--item">
          <button class="menu__item--button" @click="handleDeleteFile">
            Delete file
            <div class="menu__item--icon"><DeleteFile /></div>
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
  width: 150px;
  height: 200px;
  right: 20px;
  position: absolute;
  z-index: 9999;
  background-color: $color_white;
}

.menu__item--button {
  display: flex;
}

.menu__item--icon {
  height: 40px;
  width: 40px;
}
</style>
