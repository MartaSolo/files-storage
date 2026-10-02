<script setup lang="ts">
import type { FileObject } from "@supabase/storage-js";

const { deleteFile } = useDeleteFile();
const { downloadFile } = useDownloadFile();
const { copyFiles } = useCopyFile();
const { notify } = useNotification();

const props = defineProps<{
  fileList: FileObject[];
  selectedFiles: string[];
}>();

const emit = defineEmits<{
  (e: "filesAction" | "clearSelection"): void;
}>();

const numberOfSelectedFiles = computed(() => props.selectedFiles.length);

const computedWrapperClass = computed(() => {
  return numberOfSelectedFiles.value === 0 ? "inactive" : "";
});

const isDisabled = computed(() => numberOfSelectedFiles.value === 0);

const numbOfSelectedFilesLabel = computed(() => {
  return numberOfSelectedFiles.value === 1
    ? `${numberOfSelectedFiles.value} file selected`
    : `${numberOfSelectedFiles.value} files selected`;
});

const handleCopyFiles = async () => {
  try {
    await copyFiles(props.selectedFiles, props.fileList);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred.";
    notify("error", errorMessage);
  }
  emit("filesAction");
  emit("clearSelection");
};

const handleDownloadFiles = () => {
  props.selectedFiles.forEach((file, index) => {
    const download = () => {
      downloadFile(file);
    };
    setTimeout(download, Number(`${index}000`));
  });
  emit("clearSelection");
};

const handleDeleteFiles = async () => {
  try {
    await deleteFile(props.selectedFiles);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred.";
    notify("error", errorMessage);
  }
  emit("filesAction");
  emit("clearSelection");
};
</script>

<template>
  <div class="menu__files" :class="computedWrapperClass">
    <IconButton
      description="Clear selection"
      :disabled="isDisabled"
      @click="$emit('clearSelection')"
    >
      <template #icon>
        <CloseIcon />
      </template>
    </IconButton>
    <p class="menu__files--label">{{ numbOfSelectedFilesLabel }}</p>
    <IconButton
      description="Copy files"
      :disabled="isDisabled"
      @click="handleCopyFiles"
    >
      <template #icon>
        <CopyFile />
      </template>
    </IconButton>
    <IconButton
      description="Download files"
      :disabled="isDisabled"
      @click="handleDownloadFiles"
    >
      <template #icon>
        <DownloadFile />
      </template>
    </IconButton>
    <IconButton
      description="Delete files"
      :disabled="isDisabled"
      @click="handleDeleteFiles"
    >
      <template #icon>
        <DeleteFile />
      </template>
    </IconButton>
  </div>
</template>

<style lang="scss" scoped>
.menu__files {
  height: 50px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.inactive {
    opacity: 0.5;
  }

  &--label {
    width: 120px;
  }
}
</style>
