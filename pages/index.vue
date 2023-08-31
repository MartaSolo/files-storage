<script setup lang="ts">
import { MAX_FILE_SIZE_MB } from "@/utils/constants/maxFileSizeMB";
import { MAX_FILES_NUMBER } from "@/utils/constants/maxFilesNumber";

const { retrieveSession } = useRetrieveSession();

const getSessionError = ref("");

const getSession = async () => {
  try {
    await retrieveSession();
  } catch (error: any) {
    getSessionError.value = error.message;
  }
};

onMounted(() => {
  getSession();
});
</script>

<template>
  <div>
    <DragAndDropInput
      :max-file-size-m-b="MAX_FILE_SIZE_MB"
      :max-files-number="MAX_FILES_NUMBER"
    />
  </div>
</template>

<style lang="css" scoped></style>
