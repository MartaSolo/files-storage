<script setup lang="ts">
const selectedFiles = useSelectedFiles();
const deleteFile = useDeleteFile();
const downloadFile = useDownloadFile();
const copyFile = useCopyFile();

const emit = defineEmits<{
  (e: "filesAction"): void;
}>();

const computedWrapperClass = computed(() => {
  return selectedFiles.value.length === 0 ? "inactive" : "";
});

const isDisabled = computed(() => {
  return selectedFiles.value.length === 0;
});

const numberOfFiles = computed(() => {
  if (selectedFiles.value.length === 1) {
    return `${selectedFiles.value.length} file selected`;
  } else {
    return `${selectedFiles.value.length} files selected`;
  }
});

const handleClearSelection = () => {
  selectedFiles.value = [];
};

// option 1: timeout cuz when we copy couple of files that laready has some copies the emit fires too early - after class with errors not after successfull calls to supabase
const handleCopyFiles = async () => {
  await Promise.all(
    selectedFiles.value.map((file) => {
      return copyFile.copy(file, 1);
    })
  );
  setTimeout(
    () => emit("filesAction"),
    Number(`${selectedFiles.value.length}000`)
  );
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
  await deleteFile.remove(selectedFiles.value);
  emit("filesAction");
  handleClearSelection();
};
</script>

<template>
  <!-- te zrobić pętlę i wyrenderować iconbuttons? -->
  <div>
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
      <p class="menu__files--label">{{ numberOfFiles }}</p>
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
    <div v-if="copyErrorMessages.length > 0">
      <div v-for="(error, index) in copyErrorMessages" :key="index">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu__files {
  height: 50px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.menu__files.inactive {
  opacity: 0.5;
}

.menu__files--label {
  width: 120px;
}
</style>
