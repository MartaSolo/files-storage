<script setup>
const selectedFiles = useSelectedFiles();
const deleteFile = useDeleteFile();

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

const handleCopyFiles = () => {
  console.log("handleCopyFiles");
};

const handleDownloadFiles = () => {
  console.log("handleDownloadFiles");
};

const handleDeleteFiles = () => {
  selectedFiles.value.forEach(async (file) => {
    await deleteFile.remove(file);
  });
};
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
