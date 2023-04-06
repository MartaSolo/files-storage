<script setup lang="ts">
import { Database } from "@/types/storage";

const client = useSupabaseClient<Database>();

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
