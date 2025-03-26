<template>
  <DragAndDropInput
    :max-file-size-m-b="MAX_FILE_SIZE_MB"
    :max-files-number="MAX_FILES_NUMBER"
  />
</template>

<script setup lang="ts">
import { MAX_FILE_SIZE_MB } from "@/utils/constants/maxFileSizeMB";
import { MAX_FILES_NUMBER } from "@/utils/constants/maxFilesNumber";
</script>
