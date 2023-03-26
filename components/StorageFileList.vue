<script setup lang="ts">
import { FileObject } from "@/types/FileObject";

const client = useSupabaseClient();

const fileList = ref<FileObject[] | null>([]);

const listAllFiles = async () => {
  const { data, error } = await client.storage.from("files").list("public", {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });
  if (error) throw error;
  data?.forEach((file) => {
    fileList.value?.push(file);
  });
};

listAllFiles();
</script>

<template>
  <section class="files">
    <h2>Your uploaded files:</h2>
    <BaseLoader v-if="!fileList?.length" />
    <ul v-else class="files__list">
      <StorageFileListItem
        v-for="file in fileList"
        :key="file.id"
        :file="file"
      />
    </ul>
  </section>
</template>

<style lang="scss" scoped></style>
