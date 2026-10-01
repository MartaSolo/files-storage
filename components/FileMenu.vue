<template>
  <div ref="root" class="menu" data-testid="file-menu">
    <IconButton
      description="More actions"
      aria-haspopup="menu"
      :aria-expanded="isMenuOpen"
      data-testid="file-menu-trigger"
      @click="toggleMenu"
      @keydown.up.prevent="highlightPrev"
      @keydown.down.prevent="highlightNext"
      @keydown.enter.prevent="handleActionByKeyboard"
      @keydown.space.prevent="handleActionByKeyboard"
      @keydown.esc="isMenuOpen = false"
      @keydown.tab="isMenuOpen = false"
      @keyup.space.prevent
    >
      <template #icon>
        <MoreActions />
      </template>
    </IconButton>
    <Transition name="menu" :duration="300">
      <ul
        v-if="isMenuOpen"
        role="menu"
        :class="['menu__list', `menu__list--${menuListPosition}`]"
      >
        <li
          v-for="(action, index) in actions"
          :key="action.id"
          class="menu__list-item"
          role="none"
          :data-testid="`file-menu-item-${index}`"
          :class="{
            'menu__list-item--highlighted': highlightedIndex === index,
          }"
        >
          <button
            class="menu__item-button"
            :data-testid="`file-menu-action-${action.id}`"
            role="menuitem"
            @click="handleAction(action.id)"
            @mouseover="highlightedIndex = index"
          >
            <div class="menu__item-icon">
              <component :is="action.svg" />
            </div>
            {{ action.label }}
          </button>
        </li>
      </ul>
    </Transition>
    <RenameFileModal
      :is-open="showRenameModal"
      :file-name="fileName"
      @close-rename-file-modal="showRenameModal = false"
      @file-name-updated="emit('fileAction')"
    />
  </div>
</template>

<script setup lang="ts">
import type { FileObject } from "@supabase/storage-js";
import type { FileActions, FileActionId } from "@/types/FileActions";

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

const { copyFile } = useCopyFile();
const { copyLink } = useCopyLink();
const { deleteFile } = useDeleteFile();
const { downloadFile } = useDownloadFile();
const { notify } = useNotification();

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
  if (isMenuOpen.value) highlightedIndex.value = prevIndex.value;
};

const highlightNext = () => {
  if (isMenuOpen.value) highlightedIndex.value = nextIndex.value;
};

useClickOutside(root, () => {
  isMenuOpen.value = false;
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  highlightedIndex.value = 0;
};

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "Unknown error occurred.";
};

const handleCopyLink = async () => {
  isMenuOpen.value = false;
  try {
    await copyLink(props.fileName);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    notify("error", errorMessage);
  }
};

const handleCopyFile = async () => {
  isMenuOpen.value = false;
  try {
    await copyFile(props.fileName, props.fileList);
    emit("fileAction");
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    notify("error", errorMessage);
  }
};

const handleDownloadFile = async () => {
  isMenuOpen.value = false;
  try {
    await downloadFile(props.fileName);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    notify("error", errorMessage);
  }
};

const handleDeleteFile = async () => {
  isMenuOpen.value = false;
  try {
    await deleteFile([props.fileName]);
    emit("fileAction");
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    notify("error", errorMessage);
  }
};

const handleRenameFile = () => {
  showRenameModal.value = true;
  isMenuOpen.value = false;
};

const handleAction = (id: FileActionId) => {
  switch (id) {
    case "copyLink":
      return handleCopyLink();
    case "copyFile":
      return handleCopyFile();
    case "downloadFile":
      return handleDownloadFile();
    case "deleteFile":
      return handleDeleteFile();
    case "renameFile":
      return handleRenameFile();
  }
};

const handleActionByKeyboard = () => {
  if (isMenuOpen.value) {
    const actionId = actions?.[highlightedIndex.value]?.id;
    if (actionId) handleAction(actionId);
    highlightedIndex.value = 0;
  } else {
    highlightedIndex.value = 0;
    isMenuOpen.value = true;
  }
};

const BOTTOM_MARGIN = 240;

onMounted(() => {
  if (!root.value) return;

  const observerOptions = {
    rootMargin: `0px 0px -${BOTTOM_MARGIN}px 0px`,
    threshold: [0, 0.25, 0.5, 0.75, 1],
  };

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (
        entry.intersectionRatio < 1 &&
        entry.boundingClientRect.top > BOTTOM_MARGIN
      ) {
        menuListPosition.value = "top";
      } else {
        menuListPosition.value = "bottom";
      }
    });
  }, observerOptions);

  observer.value.observe(root.value);
});

onBeforeUnmount(() => {
  observer.value?.disconnect();
});
</script>

<style lang="scss" scoped>
.menu {
  width: 40px;
  height: 40px;
  position: relative;

  &__list {
    position: absolute;
    right: 0px;
    z-index: 9999;
    background-color: $color_white;
    border-radius: $base-border-radius;
    box-shadow:
      rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

    &--bottom {
      top: 41px;
    }

    &--top {
      top: -202px;
    }
  }

  &__list-item--highlighted .menu__item-button {
    background-color: $color-green-light-hover;
  }

  &__item-button {
    width: 160px;
    display: flex;
    align-items: center;
    &:hover {
      background-color: $color-green-light-hover;
    }
  }

  &__list-item:first-child .menu__item-button {
    border-top-left-radius: $base-border-radius;
    border-top-right-radius: $base-border-radius;
  }

  &__list-item:last-child .menu__item-button {
    border-bottom-left-radius: $base-border-radius;
    border-bottom-right-radius: $base-border-radius;
  }

  &__item-icon {
    height: 40px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 0.3rem;
  }
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
