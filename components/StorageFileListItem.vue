<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";

const client = useSupabaseClient();

const layoutType = useLayoutType();

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

const computedClass = computed(() => {
  return layoutType.value === "grid" ? "file--grid" : "file--list";
});

const retrievePublicUrl = async () => {
  const { data } = await client.storage
    .from("files/public")
    .getPublicUrl(`${props.file.name}`);
  return data;
};

const { data } = useAsyncData(props.file.id, retrievePublicUrl, {
  server: false,
});

const fileImageSource = computed(() => {
  switch (previewFileType.value) {
    case "image":
    case "video":
    case "pdf":
      return data.value?.publicUrl;
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
  <div ref="root" class="file" :class="computedClass">
    <div class="file__details">
      <h3 class="file__details--name">{{ fileName }}</h3>
      <p class="file__details--size">{{ fileSize }}</p>
      <p class="file__details--type">{{ sortFileType }}</p>
      <FileMenu class="file__details--actions" />
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
        type="application/pdf"
        frameBorder="0"
      />
      <img v-else class="file__preview" :src="fileImageSource" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file {}

.file--grid {
  border: 1px solid grey;
  background-color: $color-grey-lighter;
  border-radius: 8px;
  width: 300px;
  height: 200px;
  padding: 0.5rem;
  @include smallScreen {
    width: 100%;
  }
}

.file--grid .file__details {
  display: grid;
  grid-template-columns: 40% 40% 20%;
  grid-template-rows: auto;
  grid-template-areas:
    "name name button"
    "size type button";
}

.file__details--name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file__details--size,
.file__details--type {
  font-size: 0.75rem;
  color: $text-color-secondary;
}

.file--grid .file__details--name {
  grid-area: name;
}
.file--grid .file__details--size {
  grid-area: size;
}
.file--grid .file__details--type {
  grid-area: type;
}
.file--grid .file__details--actions {
  grid-area: button;
  justify-self: end;
}

.file__preview {
  width: 200px;
  height: 100px;
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

.file__preview--embed {
  width: 80%;
}
</style>
