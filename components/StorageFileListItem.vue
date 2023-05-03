<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";

const client = useSupabaseClient();

const props = defineProps<{
  file: FileObject;
}>();

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

const { data } = await client.storage
  .from("files/public")
  .getPublicUrl(`${props.file.name}`);

// const retrievePublicUrl = async () => {
//   const { data } = await client.storage
//     .from("files/public")
//     .getPublicUrl(`${props.file.name}`);
//   console.log("data", data);
//   return data;
// };

// const { data, error: publicUrlError } = await useAsyncData(retrievePublicUrl, {
//   server: false,
// });

const fileImageSource = computed(() => {
  switch (previewFileType.value) {
    case "image":
    case "video":
    case "pdf":
      return data.publicUrl;
    case "docx":
      return "/_nuxt/assets/img/docx_file.png";
    case "xlsx":
      return "/_nuxt/assets/img/xlsx_file.png";
    default:
      return "/_nuxt/assets/img/empty_file.png";
  }
});
</script>

<template>
  <li ref="root" class="file">
    <div class="file__details">
      <h3 class="file__details--name">{{ fileName }}</h3>
      <p class="file__details--size">{{ fileSize }}</p>
      <p class="file__details--type">{{ sortFileType }}</p>
      <FileMenu />
    </div>
    <div class="file__preview">
      <video
        v-if="previewFileType === 'video'"
        class="file__preview--video"
        controls
      >
        <source :src="fileImageSource" />
        Your browser does not support HTML video.
      </video>
      <embed
        v-else-if="previewFileType === 'pdf'"
        class="file__preview--embed"
        :src="fileImageSource"
      />
      <img v-else class="file__preview" :src="fileImageSource" />
    </div>
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

.file__preview {
  width: 200px;
  height: 150px;
  border: 1px solid green;
}
.file__preview--image {
  height: 100%;
  object-fit: contain;
}

.file__preview--video {
  height: 100%;
  object-fit: scale-down;
}

.file__delete,
.file__copy {
  border: 1px solid green;
  margin-right: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
}
</style>
