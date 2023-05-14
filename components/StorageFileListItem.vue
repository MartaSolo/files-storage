<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";
import XlsxFile from "@/components/svg/XlsxFile.vue";
import SomeFile from "@/components/svg/SomeFile.vue";
import DocxFile from "@/components/svg/DocxFile.vue";

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

  const splitName = props.file.name.split(".");
  const fileExtension = splitName[splitName.length - 1];

  if (explicitTypes === "image" || explicitTypes === "video") {
    return explicitTypes;
  } else if (
    fileExtension === "docx" ||
    fileExtension === "xlsx" ||
    fileExtension === "pdf"
  ) {
    return fileExtension;
  } else {
    return "other";
  }
});

const computedClass = computed(() => {
  return layoutType.value === "grid" ? "file--grid" : "file--list";
});

const filePreviewComponent = computed(() => {
  return (
    previewFileType.value === "docx" ||
    previewFileType.value === "xlsx" ||
    previewFileType.value === "other"
  );
});

const fileComponent = computed(() => {
  if (previewFileType.value === "docx") return DocxFile;
  if (previewFileType.value === "xlsx") return XlsxFile;
  if (previewFileType.value === "other") return SomeFile;
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
</script>

<template>
  <div ref="root" class="file" :class="computedClass">
    <div class="file__details">
      <FileCheckbox
        :name="fileName"
        :type="previewFileType"
        class="file__details--checkbox"
      />
      <h3 class="file__details--name">{{ fileName }}</h3>
      <p class="file__details--size">{{ fileSize }}</p>
      <p class="file__details--type">{{ sortFileType }}</p>
      <FileMenu class="file__details--actions" />
    </div>
    <div v-if="layoutType === 'grid'" class="file__preview">
      <video
        v-if="previewFileType === 'video'"
        class="file__preview--video"
        controls
      >
        <source :src="data?.publicUrl" />
        Your browser does not support HTML video.
      </video>
      <embed
        v-else-if="previewFileType === 'pdf'"
        class="file__preview--embed"
        :src="data?.publicUrl"
        type="application/pdf"
        frameBorder="0"
      />
      <component
        :is="fileComponent"
        v-else-if="filePreviewComponent"
        class="file__preview--component"
      />
      <img v-else class="file__preview--image" :src="data?.publicUrl" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file--grid {
  background-color: $color-grey-lightest;
  border-radius: 8px;
  width: 300px;
  height: 200px;
  padding: 0.5rem;
  @include smallScreen {
    width: 100%;
  }
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s;
  &:hover {
    background-color: $color-grey-lighter;
  }
}

.file--grid .file__details {
  display: grid;
  grid-template-columns: 20px 70px 1fr 40px;
  grid-template-rows: auto;
  grid-template-areas:
    "checkbox name name button"
    ". size type button";
  gap: 0.25rem;
}

.file__details--name {
  @include cropText;
}

.file__details--size,
.file__details--type {
  font-size: 0.75rem;
  color: $text-color-secondary;
  @include cropText;
}

.file--grid .file__details--checkbox {
  grid-area: checkbox;
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
  margin: 0.5rem;
  flex-grow: 1;
}

.file__preview:has(.file__preview--video),
.file__preview:has(.file__preview--component) {
  display: flex;
  justify-content: center;
}

.file__preview--image,
.file__preview--embed,
.file__preview--component,
.file__preview--video {
  width: 100%;
  height: 130px;
}

.file__preview--image {
  object-fit: cover;
  object-position: left top;
}
</style>

<style lang="scss">
.file--grid:hover .button__btn--grey {
  background-color: $color-grey-lighter;
  transition: background-color 0.2s;
}
.file--grid:hover .button__btn--grey:hover {
  background-color: $color-grey-light;
}
</style>
