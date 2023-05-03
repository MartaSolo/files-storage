<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";

const sortColumn = useSortColumn();
const sortOrder = useSortOrder();

const {
  data: fileList,
  refresh,
  error: fileListError,
} = await useFetch<FileObject[]>(`/api/files`, {
  query: { key: sortColumn, order: sortOrder },
});

const sortFiles = () => {
  refresh();
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
      <div class="files__menu">
        <SortFileList @set-sort-options="sortFiles" />
        <LayoutSwitcher />
      </div>
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

<style lang="scss" scoped>
.files__menu {
  padding-top: 1rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 2rem;
}
</style>
