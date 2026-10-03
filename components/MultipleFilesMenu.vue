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
  filesAction: [];
  clearSelection: [];
}>();

const isLoading = ref(false);

const numberOfSelectedFiles = computed(() => props.selectedFiles.length);

const isDisabled = computed(
  () => numberOfSelectedFiles.value === 0 || isLoading.value
);

const numberOfSelectedFilesLabel = computed(() => {
  return numberOfSelectedFiles.value === 1
    ? `${numberOfSelectedFiles.value} file selected`
    : `${numberOfSelectedFiles.value} files selected`;
});

const notifyError = (error: unknown) => {
  const errorMessage =
    error instanceof Error ? error.message : "Unknown error occurred.";
  notify("error", errorMessage);
};

const handleClearSelection = () => {
  emit("clearSelection");
};

const handleCopyFiles = async () => {
  let succeeded = false;
  isLoading.value = true;
  try {
    await copyFiles(props.selectedFiles, props.fileList);
    succeeded = true;
  } catch (error) {
    notifyError(error);
  } finally {
    isLoading.value = false;
  }
  if (succeeded) emit("clearSelection");
  emit("filesAction");
};

const handleDeleteFiles = async () => {
  let succeeded = false;
  isLoading.value = true;
  try {
    await deleteFile(props.selectedFiles);
    succeeded = true;
  } catch (error) {
    notifyError(error);
  } finally {
    isLoading.value = false;
  }
  if (succeeded) emit("clearSelection");
  emit("filesAction");
};

const handleDownloadFiles = () => {
  props.selectedFiles.forEach((file, index) => {
    const download = async () => {
      try {
        await downloadFile(file);
      } catch (error) {
        notifyError(error);
      }
    };
    setTimeout(download, index * 1000);
  });
  emit("clearSelection");
};
</script>

<template>
  <div
    class="menu__files"
    :class="{ inactive: !numberOfSelectedFiles }"
    data-testid="multiple-files-menu"
  >
    <IconButton
      description="Clear selection"
      :disabled="isDisabled"
      data-testid="multiple-files-menu-clear"
      @click="handleClearSelection"
    >
      <template #icon>
        <CloseIcon />
      </template>
    </IconButton>
    <p class="menu__files--label" data-testid="multiple-files-menu-label">
      {{ numberOfSelectedFilesLabel }}
    </p>
    <IconButton
      description="Copy files"
      :disabled="isDisabled"
      data-testid="multiple-files-menu-copy"
      @click="handleCopyFiles"
    >
      <template #icon>
        <CopyFile />
      </template>
    </IconButton>
    <IconButton
      description="Download files"
      :disabled="isDisabled"
      data-testid="multiple-files-menu-download"
      @click="handleDownloadFiles"
    >
      <template #icon>
        <DownloadFile />
      </template>
    </IconButton>
    <IconButton
      description="Delete files"
      :disabled="isDisabled"
      data-testid="multiple-files-menu-delete"
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
