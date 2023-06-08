<script setup lang="ts">
const props = defineProps<{
  fileName: string;
}>();

const emit = defineEmits<{
  (e: "fileAction"): void;
}>();

const isMenuOpen = ref(false);
const root = ref<HTMLElement | null>(null);
const showModal = ref(false);

const copyFile = useCopyFile(props.fileName);
const copyLink = useCopyLink(props.fileName);
const deleteFile = useDeleteFile(props.fileName);
const downloadFile = useDownloadFile();

useClickOutside(root, () => {
  isMenuOpen.value = false;
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleCopyLink = () => {
  copyLink.copy();
  isMenuOpen.value = false;
};

const handleCopyFile = async () => {
  await copyFile.copy();
  isMenuOpen.value = false;
  emit("fileAction");
};

const handleDownloadFile = () => {
  downloadFile.download(props.fileName);
  isMenuOpen.value = false;
};

const handleDeleteFile = async () => {
  await deleteFile.remove();
  isMenuOpen.value = false;
  emit("fileAction");
};

const handleRenameFile = () => {
  showModal.value = true;
  isMenuOpen.value = false;
};
</script>

<template>
  <div ref="root" class="menu">
    <IconButton description="More actions" theme="grey" @click="toggleMenu">
      <template #icon>
        <MoreActions />
      </template>
    </IconButton>
    <Transition name="menu" :duration="300">
      <template v-if="isMenuOpen">
        <ul class="menu__list">
          <li class="menu__list--item">
            <button class="menu__item--button" @click="handleCopyLink">
              <div class="menu__item--icon"><CopyLink /></div>
              Copy link
            </button>
          </li>
          <li class="menu__list--item">
            <button class="menu__item--button" @click="handleCopyFile">
              <div class="menu__item--icon"><CopyFile /></div>
              Copy file
            </button>
          </li>
          <li class="menu__list--item">
            <button class="menu__item--button" @click="handleDownloadFile">
              <div class="menu__item--icon"><DownloadFile /></div>
              Download file
            </button>
          </li>
          <li class="menu__list--item">
            <button class="menu__item--button" @click="handleDeleteFile">
              <div class="menu__item--icon"><DeleteFile /></div>
              Delete file
            </button>
          </li>
          <li class="menu__list--item">
            <button class="menu__item--button" @click="handleRenameFile">
              <div class="menu__item--icon"><RenameFile /></div>
              Rename file
            </button>
          </li>
        </ul>
      </template>
    </Transition>
    <RenameFileModal
      v-if="showModal"
      :file-name="fileName"
      @close-rename-file-modal="showModal = false"
      @file-name-updated="emit('fileAction')"
    />
  </div>
</template>

<style lang="scss" scoped>
.menu {
  width: 40px;
  height: 40px;
  position: relative;
}

.menu__list {
  top: 41px;
  right: 0px;
  position: absolute;
  z-index: 9999;
  background-color: $color_white;
  border-radius: 4px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
}

.menu__item--button {
  width: 160px;
  display: flex;
  align-items: center;
  &:hover {
    background-color: grey;
  }
}

.menu__list--item:first-child .menu__item--button {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.menu__list--item:last-child .menu__item--button {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.menu__item--icon {
  height: 40px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.3rem;
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>
