<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";
import GridLayout from "@/components/svg/GridLayout.vue";
import ListLayout from "@/components/svg/ListLayout.vue";

const sortColumn = useSortColumn();
const sortOrder = useSortOrder();
const fileView = useFileView();

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

const toggleLayout = () => {
  fileView.value === "grid"
    ? (fileView.value = "list")
    : (fileView.value = "grid");
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
      <button class="files__view" @click="toggleLayout"></button>
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
.files__view {
  width: 50px;
  height: 50px;
  background-color: green;
}
</style>
