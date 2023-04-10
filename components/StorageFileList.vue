<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";
import { FileObjectKeys } from "@/types/FileObjectKeys";

const client = useSupabaseClient();

const listAllFiles = async () => {
  const { data, error } = await client.storage.from("files").list("public", {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });
  if (error) throw error;
  return data;
};

const {
  data: fileList,
  pending: fileListPending,
  error: fileListError,
} = await useAsyncData(listAllFiles, { server: false });

const sortFiles = (key: FileObjectKeys, order: string) => {
  return fileList.value?.sort((e1: FileObject, e2: FileObject) => {
    const a = e1[key] ? e1[key] : e1.metadata[key];
    const b = e2[key] ? e2[key] : e2.metadata[key];
    const sortOrder = order === "asc" ? 1 : -1;
    if (key === "name") {
      return sortOrder === 1 ? a.localeCompare(b) : b.localeCompare(a);
    }
    return a < b ? -sortOrder : a > b ? sortOrder : 0;
  });
};
</script>

<template>
  <section class="files">
    <BaseLoader v-if="fileListPending" />
    <ErrorMessage
      v-else-if="fileListError"
      title="Something went wrong"
      description="We are sorry, but your files cannot be displayed at the moment."
    />
    <template v-else>
      <NewSort @set-sort-options="sortFiles" />
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
