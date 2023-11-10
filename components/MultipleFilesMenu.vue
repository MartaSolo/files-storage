<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";

const selectedFiles = useSelectedFiles();
const deleteFile = useDeleteFile();
const downloadFile = useDownloadFile();
const copyFile = useCopyFile();
const { storage } = useStorage();
const { notify } = useNotification();

const props = defineProps<{
  fileList: FileObject[];
}>();

const emit = defineEmits<{
  (e: "filesAction"): void;
}>();

const numberOfSelectedFiles = computed(() => {
  return selectedFiles.value.length;
});

const computedWrapperClass = computed(() => {
  return numberOfSelectedFiles.value === 0 ? "inactive" : "";
});

const isDisabled = computed(() => {
  return numberOfSelectedFiles.value === 0;
});

const numbOfSelectedFilesLabel = computed(() => {
  return numberOfSelectedFiles.value === 1
    ? `${numberOfSelectedFiles.value} file selected`
    : `${numberOfSelectedFiles.value} files selected`;
});

const handleClearSelection = () => {
  selectedFiles.value = [];
};

const handleCopyFiles = async () => {
  try {
    await Promise.all(
      selectedFiles.value.map((file) => {
        return copyFile.copy(file, props.fileList);
      })
    );
  } catch (error: any) {
    notify("error", error.message);
  }
  emit("filesAction");
  handleClearSelection();
};

const handleDownloadFiles = () => {
  selectedFiles.value.forEach((file, index) => {
    const download = () => {
      downloadFile.download(file);
    };
    setTimeout(download, Number(`${index}000`));
  });
  handleClearSelection();
};

const handleDeleteFiles = async () => {
  try {
    await deleteFile.remove(selectedFiles.value);
  } catch (error: any) {
    notify("error", error.message);
  }
  emit("filesAction");
  handleClearSelection();
};

watch(storage.value, () => {
  selectedFiles.value = [];
});
</script>

<template>
  <div class="menu__files" :class="computedWrapperClass">
    <IconButton
      description="Clear selection"
      theme="grey"
      :disabled="isDisabled"
      @click="handleClearSelection"
    >
      <template #icon>
        <CloseIcon />
      </template>
    </IconButton>
    <p class="menu__files--label">{{ numbOfSelectedFilesLabel }}</p>
    <IconButton
      description="Copy files"
      theme="grey"
      :disabled="isDisabled"
      @click="handleCopyFiles"
    >
      <template #icon>
        <CopyFile />
      </template>
    </IconButton>
    <IconButton
      description="Download files"
      theme="grey"
      :disabled="isDisabled"
      @click="handleDownloadFiles"
    >
      <template #icon>
        <DownloadFile />
      </template>
    </IconButton>
    <IconButton
      description="Delete files"
      theme="grey"
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
}

.menu__files--label {
  width: 120px;
}
</style>
