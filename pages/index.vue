<script setup lang="ts">
import { MAX_FILE_SIZE_MB } from "@/utils/constants/maxFileSizeMB";
import { MAX_FILES_NUMBER } from "@/utils/constants/maxFilesNumber";

const userData = useUserData();

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
  if (!userData.value.id) getSession();
});
</script>

<template>
  <DragAndDropInput
    :max-file-size-m-b="MAX_FILE_SIZE_MB"
    :max-files-number="MAX_FILES_NUMBER"
  />
</template>

<style lang="css" scoped></style>
