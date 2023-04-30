<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";

const client = useSupabaseClient();

const props = defineProps<{
  file: FileObject;
}>();

const { data } = await client.storage
  .from("files/public")
  .getPublicUrl(`${props.file.name}`);

const fileName = computed(() => {
  return props.file.name;
});

const fileSize = computed(() => {
  const size = props.file.metadata.size;
  const sizeLength = size.toString().length;
  if (sizeLength <= 5) {
    return `size: ${(size / 1000).toFixed(1)}KB`;
  } else {
    return `size: ${(size / 1000000).toFixed(1)}MB`;
  }
});

const sortFileType = computed(() => {
  const type = props.file.metadata.mimetype.split("/")[0];
  return `type: ${type}`;
});

const previewFileType = computed(() => {
  const type = props.file.metadata.mimetype;
  const explicitTypes = type.split("/")[0];
  if (explicitTypes === "image" || explicitTypes === "video") {
    return explicitTypes;
  } else {
    const splitName = props.file.name.split(".");
    const fileExtension = splitName[splitName.length - 1];
    return fileExtension;
  }
});
</script>

<template>
  <li class="file">
    <div class="file__details">
      <h3 class="file__details--name">{{ fileName }}</h3>
      <p class="file__details--size">{{ fileSize }}</p>
      <p class="file__details--type">{{ sortFileType }}</p>
      <button class="file__actions"></button>
    </div>
    <img
      v-if="previewFileType === 'image'"
      class="file__preview"
      :src="data.publicUrl"
    />
    <video
      v-else-if="previewFileType === 'video'"
      class="file__preview"
      controls
    >
      <source :src="data.publicUrl" />
      Your browser does not support HTML video.
    </video>
    <embed
      v-else-if="previewFileType === 'pdf'"
      class="file__preview"
      :src="data.publicUrl"
    />
    <img
      v-else-if="previewFileType === 'docx'"
      class="file__preview"
      src="@/assets/img/docx_file.png"
    />
    <img
      v-else-if="previewFileType === 'xlsx'"
      class="file__preview"
      src="@/assets/img/xlsx_file.png"
    />
    <img v-else class="file__preview" src="@/assets/img/empty_file.png" />
  </li>
</template>

<style lang="scss" scoped>
.file {
  background-color: $color-grey-lighter;
  border-radius: 4px;
  margin-bottom: 1rem;
  width: 300px;
  height: 250px;
}
.file__details--size,
.file__details--type {
  font-size: 0.75rem;
  color: $text-color-secondary;
}

.file__actions {
  border-radius: 50%;
  background-color: red;
  width: 40px;
  height: 40px;
}
.file__preview {
  width: 200px;
  height: 100px;
}

.file__delete,
.file__copy {
  border: 1px solid green;
  margin-right: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
}
</style>
