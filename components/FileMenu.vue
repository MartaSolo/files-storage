<script setup lang="ts">
import { FileActions } from "@/types/FileActions";

const CopyLink = resolveComponent("CopyLink");
const CopyFile = resolveComponent("CopyFile");
const DownloadFile = resolveComponent("DownloadFile");
const DeleteFile = resolveComponent("DeleteFile");
const RenameFile = resolveComponent("RenameFile");

const actions: FileActions[] = [
  { id: "copyLink", label: "Copy link", svg: CopyLink },
  { id: "copyFile", label: "Copy file", svg: CopyFile },
  { id: "downloadFile", label: "Download file", svg: DownloadFile },
  { id: "deleteFile", label: "Delete file", svg: DeleteFile },
  { id: "renameFile", label: "Rename file", svg: RenameFile },
];

const props = defineProps<{
  fileName: string;
}>();

const emit = defineEmits<{
  (e: "fileAction"): void;
}>();

const isMenuOpen = ref(false);
const root = ref<HTMLElement | null>(null);
const showModal = ref(false);
const highlightedIndex = ref(0);
const menuListPosition = ref("bottom");

const copyFile = useCopyFile();
const copyLink = useCopyLink(props.fileName);
const deleteFile = useDeleteFile();
const downloadFile = useDownloadFile();

onMounted(() => {
  const windowInnerHeight = window.innerHeight;
  const rectBottom = root.value?.getBoundingClientRect().bottom || 0;
  const bottomDistance = windowInnerHeight - rectBottom;
  if (bottomDistance < 200) {
    menuListPosition.value = "top";
  }
});

const computedMenuListClass = computed(() => {
  return `menu__list--${menuListPosition.value}`;
});

const prevIndex = computed(() => {
  return highlightedIndex.value === 0
    ? actions.length - 1
    : highlightedIndex.value - 1;
});

const nextIndex = computed(() => {
  return highlightedIndex.value === actions.length - 1
    ? 0
    : highlightedIndex.value + 1;
});

const highlightPrev = () => {
  highlightedIndex.value = prevIndex.value;
};

const highlightNext = () => {
  highlightedIndex.value = nextIndex.value;
};

useClickOutside(root, () => {
  isMenuOpen.value = false;
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  highlightedIndex.value = 0;
};

const handleCopyLink = () => {
  copyLink.copy();
  isMenuOpen.value = false;
};

const handleCopyFile = async () => {
  // option 1
  await copyFile.copy(props.fileName, 1);
  emit("fileAction");
  isMenuOpen.value = false;
};

const handleDownloadFile = () => {
  downloadFile.download(props.fileName);
  isMenuOpen.value = false;
};

const handleDeleteFile = async () => {
  await deleteFile.remove([props.fileName]);
  emit("fileAction");
  isMenuOpen.value = false;
};

const handleRenameFile = () => {
  showModal.value = true;
  isMenuOpen.value = false;
};

const handleAction = (i: number) => {
  switch (i) {
    case 0:
      return handleCopyLink();
    case 1:
      return handleCopyFile();
    case 2:
      return handleDownloadFile();
    case 3:
      return handleDeleteFile();
    case 4:
      return handleRenameFile();
  }
};

const handleActionByKeyboard = () => {
  if (isMenuOpen.value) {
    handleAction(highlightedIndex.value);
  } else {
    isMenuOpen.value = true;
  }
};
</script>

<template>
  <div ref="root" class="menu">
    <IconButton
      description="More actions"
      theme="grey"
      @click="toggleMenu"
      @keyup.down.prevent="highlightedIndex = 0"
      @keyup.left.prevent="highlightPrev()"
      @keyup.right.prevent="highlightNext()"
      @keyup.enter.prevent="handleActionByKeyboard"
      @keyup.space.prevent="handleActionByKeyboard"
      @keyup.esc="isMenuOpen = false"
      @keydown.tab="isMenuOpen = false"
      @keydown.enter.prevent
    >
      <template #icon>
        <MoreActions />
      </template>
    </IconButton>
    <Transition name="menu" :duration="300">
      <template v-if="isMenuOpen">
        <ul class="menu__list" :class="computedMenuListClass">
          <li
            v-for="(action, index) in actions"
            :key="action.id"
            class="menu__list--item"
            :class="{
              'menu__list--item--highlighted': highlightedIndex === index,
            }"
          >
            <button
              class="menu__item--button"
              @click="handleAction(index)"
              @mouseover="highlightedIndex = index"
            >
              <div class="menu__item--icon">
                <component :is="action.svg" />
              </div>
              {{ action.label }}
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
  position: absolute;
  right: 0px;
  z-index: 9999;
  background-color: $color_white;
  border-radius: 4px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
}

.menu__list--bottom {
  top: 41px;
}
.menu__list--top {
  top: -202px;
}

.menu__list--item--highlighted .menu__item--button {
  background-color: $color-green-light-hover;
}
.menu__item--button {
  width: 160px;
  display: flex;
  align-items: center;
  &:hover {
    background-color: $color-green-light-hover;
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
