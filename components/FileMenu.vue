<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";
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
  fileList: FileObject[];
}>();

const emit = defineEmits<{
  (e: "fileAction"): void;
}>();

const isMenuOpen = ref(false);
const root = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const showRenameModal = ref(false);
const highlightedIndex = ref(0);
const menuListPosition = ref("bottom");

const copyFile = useCopyFile();
const copyLink = useCopyLink(props.fileName);
const deleteFile = useDeleteFile();
const downloadFile = useDownloadFile();
const { notify } = useNotification();

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
  try {
    await copyFile.copy(props.fileName, props.fileList);
  } catch (error: any) {
    notify("error", error.message);
  }
  emit("fileAction");
  isMenuOpen.value = false;
};

const handleDownloadFile = async () => {
  try {
    await downloadFile.download(props.fileName);
  } catch (error: any) {
    notify("error", error.message);
  }
  isMenuOpen.value = false;
};

const handleDeleteFile = async () => {
  try {
    await deleteFile.remove([props.fileName]);
  } catch (error: any) {
    notify("error", error.message);
  }
  emit("fileAction");
  isMenuOpen.value = false;
};

const handleRenameFile = () => {
  showRenameModal.value = true;
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

onMounted(() => {
  const target = root.value as Element;

  const observerOptions = {
    rootMargin: "0px 0px -240px 0px",
    threshold: [0, 0.25, 0.5, 0.75, 1],
  };

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio < 1 && entry.boundingClientRect.top > 240) {
        menuListPosition.value = "top";
      } else {
        menuListPosition.value = "bottom";
      }
    });
  }, observerOptions);

  observer.value.observe(target);
});

onBeforeUnmount(() => {
  const target = root.value as Element;
  observer.value?.unobserve(target);
});
</script>

<template>
  <div ref="root" class="menu">
    <IconButton
      description="More actions"
      theme="grey"
      @click="toggleMenu"
      @keydown.up.prevent="highlightPrev"
      @keydown.down.prevent="highlightNext"
      @keydown.enter.prevent="handleActionByKeyboard"
      @keydown.space.prevent="handleActionByKeyboard"
      @keydown.esc="isMenuOpen = false"
      @keydown.tab="isMenuOpen = false"
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
              :aria-label="action.label"
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
      v-if="showRenameModal"
      :file-name="fileName"
      @close-rename-file-modal="showRenameModal = false"
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
