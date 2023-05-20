<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";

const XlsxFile = resolveComponent("XlsxFile");
const SomeFile = resolveComponent("SomeFile");
const DocxFile = resolveComponent("DocxFile");

const props = defineProps<{
  file: FileObject;
}>();

const layoutType = useLayoutType();

const getUrl = useRetrievePublicUrl(props.file.name, props.file.id);

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
      <FileMenu class="file__details--actions" :file-name="fileName" />
    </div>
    <div v-if="layoutType === 'grid'" class="file__preview">
      <video
        v-if="previewFileType === 'video'"
        class="file__preview--video"
        controls
      >
        <!-- <source :src="data?.publicUrl" /> -->
        <source :src="getUrl.url.value?.publicUrl" />
        Your browser does not support HTML video.
      </video>
      <embed
        v-else-if="previewFileType === 'pdf'"
        class="file__preview--embed"
        :src="getUrl.url.value?.publicUrl"
        type="application/pdf"
        frameBorder="0"
      />
      <component
        :is="fileComponent"
        v-else-if="filePreviewComponent"
        class="file__preview--component"
      />
      <img
        v-else
        class="file__preview--image"
        :src="getUrl.url.value?.publicUrl"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file {
  background-color: $color-grey-lightest;
  transition: background-color 0.2s;
  &:hover {
    background-color: $color-grey-lighter;
  }
}

.file__details--checkbox {
  grid-area: checkbox;
}

.file__details--name {
  grid-area: name;
  @include cropText;
}

.file__details--size,
.file__details--type {
  font-size: 0.75rem;
  color: $text-color-secondary;
  @include cropText;
}

.file__details--size {
  grid-area: size;
}
.file__details--type {
  grid-area: type;
}

.file__details--actions {
  grid-area: button;
  justify-self: end;
}

// file--grid
.file--grid {
  border-radius: 8px;
  width: 300px;
  height: 200px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  @include smallScreen {
    width: 100%;
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

//file--list
.file--list {
  border-top: 1px solid $color-grey-light;
  &:last-child {
    border-bottom: 1px solid $color-grey-light;
  }
}

.file--list .file__details {
  display: grid;
  padding: 0.25rem 0.5rem;
  gap: 0.25rem;
  grid-template-rows: auto;
  align-items: center;
  grid-template-columns: 20px 1fr 40px;
  grid-template-areas: "checkbox name button";
  @include smallScreen {
    grid-template-columns: 20px 1fr minmax(70px, 90px) 40px;
    grid-template-areas: "checkbox name size button";
  }
  @include mediumScreen {
    grid-template-columns: 20px 1fr 120px 130px 40px;
    grid-template-areas: "checkbox name size type button";
  }
  @include largeScreen {
    grid-template-columns: 20px 1fr 150px 180px 40px;
  }
  @include xlargeScreen {
    grid-template-columns: 20px 1fr 190px 220px 40px;
  }
  @include xxlargeScreen {
    grid-template-columns: 20px 1fr 220px 250px 40px;
  }
}

.file--list .file__details--size {
  display: none;
  @include smallScreen {
    display: block;
  }
}
.file--list .file__details--type {
  display: none;
  @include mediumScreen {
    display: block;
  }
}
</style>

<style lang="scss">
.file:hover .button__btn--grey {
  background-color: $color-grey-lighter;
  transition: background-color 0.2s;
}
.file:hover .button__btn--grey:hover {
  background-color: $color-grey-light;
}
</style>
