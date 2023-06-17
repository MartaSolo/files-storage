<script setup>
const selectedFiles = useSelectedFiles();

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
</script>

<template>
  <div class="menu__files" :class="computedWrapperClass">
    <IconButton
      description="Clear selection"
      theme="grey"
      :disabled="isDisabled"
    >
      <template #icon>
        <CloseIcon />
      </template>
    </IconButton>
    <p class="menu__files--label">{{ numberOfFiles }}</p>
    <IconButton description="Copy files" theme="grey" :disabled="isDisabled">
      <template #icon>
        <CopyFile />
      </template>
    </IconButton>
    <IconButton
      description="Download files"
      theme="grey"
      :disabled="isDisabled"
    >
      <template #icon>
        <DownloadFile />
      </template>
    </IconButton>
    <IconButton description="Delete files" theme="grey" :disabled="isDisabled">
      <template #icon>
        <DeleteFile />
      </template>
    </IconButton>
  </div>
</template>

<style lang="scss" scoped>
.menu__files {
  // border: 1px solid red;
  height: 50px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.menu__files.inactive {
  cursor: not-allowed;
  opacity: 0.5;
}

.menu__files--label {
  width: 120px;
}
</style>
