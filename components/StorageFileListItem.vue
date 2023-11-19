<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";

const XlsxFile = resolveComponent("XlsxFile");
const SomeFile = resolveComponent("SomeFile");
const DocxFile = resolveComponent("DocxFile");

const props = defineProps<{
  file: FileObject;
  fileList: FileObject[];
}>();

const emit = defineEmits<{
  (e: "updateFileList"): void;
}>();

const { storage } = useStorage();

const layoutType = useLayoutType();
const selectedFiles = useSelectedFiles();
const sortType = useSortType(props.file);

const previewUrl = computed(() => {
  if (storage.value.bucket === "private") {
    const { privateUrl, privateUrlError } = useRetrievePrivateFileUrl(
      props.file.name
    );
    return privateUrlError.value ? "" : privateUrl.value;
  } else {
    const getPublicUrl = useRetrievePublicFileUrl(props.file.name);
    return getPublicUrl.url;
  }
});

const previewUrlError = ref(false);

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
  return `type: ${sortType.type}`;
});

const previewFileType = computed(() => {
  const type = props.file.metadata.mimetype;
  const explicitTypes = type.split("/")[0];

  const splitName = props.file.name.split(".");
  const fileExtension = splitName.at(-1);

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

const updatedFile = () => {
  emit("updateFileList");
};
</script>

<template>
  <div ref="root" class="file" :class="computedClass">
    <div class="file__details">
      <!-- v-if="selectedFiles" added to get rid of hydration errors caused by useSelectedFiles composable -->
      <FileCheckbox
        v-if="selectedFiles"
        :name="fileName"
        :type="previewFileType"
        class="file__details--checkbox"
      />
      <span class="file__details--name">{{ fileName }}</span>
      <span class="file__details--size">{{ fileSize }}</span>
      <span class="file__details--type">{{ sortFileType }}</span>
      <FileMenu
        class="file__details--actions"
        :file-name="fileName"
        :file-list="fileList"
        @file-action="updatedFile"
      />
    </div>
    <div v-if="layoutType === 'grid'" class="file__preview">
      <div v-if="!previewUrl" class="file__preview--placeholder"></div>
      <template v-else>
        <video
          v-if="previewFileType === 'video'"
          class="file__preview--video"
          :type="file.metadata.mimetype"
          controls
        >
          <source :src="previewUrl" />
          Your browser does not support HTML video.
        </video>
        <embed
          v-else-if="previewFileType === 'pdf'"
          class="file__preview--embed"
          :src="previewUrl"
          type="application/pdf"
          frameBorder="0"
        />
        <component
          :is="fileComponent"
          v-else-if="filePreviewComponent"
          class="file__preview--component"
        />
        <a
          v-else
          :href="previewUrl"
          target="_blank"
          class="file__preview--link"
          :class="{ 'file__preview--placeholder': previewUrlError }"
        >
          <img
            class="file__preview--image"
            :src="previewUrl"
            :alt="fileName"
            @error="previewUrlError = true"
          />
        </a>
      </template>
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

.file__preview--link {
  display: blok;
  height: 100%;
  width: 100%;
}

.file__preview--placeholder {
  background-color: $color-grey-lighter;
  width: 100%;
  height: 100%;
  animation: skeleton-loading 0.5s linear infinite alternate;
}

@keyframes skeleton-loading {
  0% {
    background-color: $color-grey-light;
  }
  100% {
    background-color: $color-grey-lighter;
  }
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
