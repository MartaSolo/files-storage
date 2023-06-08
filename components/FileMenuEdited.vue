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
const actionsLength = ref(actions.length);

const copyFile = useCopyFile(props.fileName);
const copyLink = useCopyLink(props.fileName);
const deleteFile = useDeleteFile(props.fileName);
const downloadFile = useDownloadFile();

useClickOutside(root, () => {
  isMenuOpen.value = false;
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  highlightedIndex.value = 0;
};

const prevIndex = computed(() => {
  return highlightedIndex.value === 0
    ? actionsLength.value - 1
    : highlightedIndex.value - 1;
});

const nextIndex = computed(() => {
  return highlightedIndex.value === actionsLength.value - 1
    ? 0
    : highlightedIndex.value + 1;
});

const highlightPrev = () => {
  // console.log("highlightPrev fired");
  highlightedIndex.value = prevIndex.value;
};

const highlightNext = () => {
  // console.log("highlightNext fired");
  highlightedIndex.value = nextIndex.value;
};

const fireActionByKeyboard = () => {
  console.log("fireActionByKeyboard fired");
  handleAction(highlightedIndex.value);
};

const handleAction = (i: number) => {
  console.log("handleAction fired");
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
// const handleAction = (id: string) => {
//   switch (id) {
//     case "copyLink":
//       return handleCopyLink();
//     case "copyFile":
//       return handleCopyFile();
//     case "downloadFile":
//       return handleDownloadFile();
//     case "deleteFile":
//       return handleDeleteFile();
//     case "renameFile":
//       return handleRenameFile();
//   }
// };

const handleCopyLink = async () => {
  await copyLink.copy();
  isMenuOpen.value = false;
  console.log("handleCopyLink fired");
};

const handleCopyFile = async () => {
  await copyFile.copy();
  emit("fileAction");
  isMenuOpen.value = false;
  console.log("handleCopyFile fired");
};

const handleDownloadFile = () => {
  downloadFile.download(props.fileName);
  isMenuOpen.value = false;
  console.log("handleDownloadFile fired");
};

const handleDeleteFile = async () => {
  await deleteFile.remove();
  emit("fileAction");
  isMenuOpen.value = false;
  console.log("handleDeleteFile fired");
};

const handleRenameFile = () => {
  showModal.value = true;
  isMenuOpen.value = false;
  console.log("handleRenameFile fired");
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
      @keyup.enter.prevent="fireActionByKeyboard"
      @keyup.space.prevent="fireActionByKeyboard"
      @keyup.esc="isMenuOpen = false"
      @keydown.tab="isMenuOpen = false"
    >
      <template #icon>
        <MoreActions />
      </template>
    </IconButton>
    <Transition name="menu" :duration="300">
      <template v-if="isMenuOpen">
        <ul class="menu__list">
          <li
            v-for="(action, index) in actions"
            :key="action.id"
            class="menu__list--item"
            :class="{
              'menu__list--item--highlighted': highlightedIndex === index,
            }"
          >
            <button
              :ref="`item-button-${index}`"
              class="menu__item--button"
              @click="handleAction(index)"
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
  top: 41px;
  right: 0px;
  position: absolute;
  z-index: 9999;
  background-color: $color_white;
  border-radius: 4px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
}

.menu__list--item--highlighted .menu__item--button {
  background-color: red;
}
.menu__item--button {
  width: 160px;
  display: flex;
  align-items: center;
  &:hover {
    background-color: $color-green-light-hover;
  }
  // &:focus {
  //   background-color: blue;
  // }
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
}</style>
