<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";
import { useSortColumn, useSortOrder } from "@/composable/useState";

const sortColumn = useSortColumn();
const sortOrder = useSortOrder();

const {
  data: fileList,
  // refresh,
  error: fileListError,
} = await useFetch<FileObject[]>(
  `/api/files?key=${sortColumn.value}&order=${sortOrder.value}`
);

const sortFiles = async () => {
  // refresh();
  const { data: sortedFileList } = await useFetch<FileObject[]>(
    `/api/files?key=${sortColumn.value}&order=${sortOrder.value}`
  );
  fileList.value = sortedFileList.value;
};
</script>

<template>
  <section class="files">
    <BaseLoader v-if="!fileList" />
    <ErrorMessage
      v-else-if="fileListError"
      title="Something went wrong"
      description="We are sorry, but your files cannot be displayed at the moment."
    />
    <template v-else>
      <SortFileList @set-sort-options="sortFiles" />
      <h2 class="files__title">Your uploaded files:</h2>
      <ul class="files__list">
        <StorageFileListItem
          v-for="file in fileList"
          :key="file.id"
          :file="file"
        />
      </ul>
    </template>
  </section>
</template>

<style lang="scss" scoped></style>
