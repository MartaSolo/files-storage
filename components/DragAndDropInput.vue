<script setup lang="ts">
const client = useSupabaseClient();

const props = defineProps<{
  maxFilesNumber: number;
  maxFileSizeMB: number;
}>();

const isDragActive = ref(false);
const errorMessages = ref<string[]>([]);
const uploadedFiles = ref<string[]>([]);
const notUploadedFiles = ref<string[]>([]);
const root = ref<HTMLElement | null>(null);

const maxFileSizeBytes = computed(() => {
  return props.maxFileSizeMB * 1000000;
});

const resetState = () => {
  errorMessages.value = [];
  uploadedFiles.value = [];
  notUploadedFiles.value = [];
};

const handleDrag = (e: DragEvent) => {
  if (e.type === "dragenter" || e.type === "dragover") {
    isDragActive.value = true;
    resetState();
  }
  if (e.type === "dragleave") {
    isDragActive.value = false;
  }
};

const numberOfFilesExceeded = (
  listOfFiles: FileList | DataTransferItemList
) => {
  if (listOfFiles.length > props.maxFilesNumber) {
    errorMessages.value.push(
      `You can upload up to ${props.maxFilesNumber} files at a time!`
    );
    return true;
  } else {
    return false;
  }
};

const uploadFileToSupabase = async (file: File) => {
  const { error } = await client.storage
    .from("files")
    .upload(`public/${file.name}`, file);
  if (error) {
    errorMessages.value.push(`Error: ${error?.message}`);
    notUploadedFiles.value.push(file.name);
    throw error;
  } else {
    uploadedFiles.value.push(file.name);
  }
};

const addExceededSizeErrorMessage = () => {
  errorMessages.value.push(`Error: some files have exceeded size`);
};

const handleDrop = (e: DragEvent) => {
  e.stopPropagation();
  isDragActive.value = false;

  if (e.dataTransfer?.items) {
    if (numberOfFilesExceeded(e.dataTransfer.items)) return;
    [...e.dataTransfer.items].forEach((item) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) {
          if (file.size < maxFileSizeBytes.value) {
            uploadFileToSupabase(file);
          } else {
            addExceededSizeErrorMessage();
            notUploadedFiles.value.push(file.name);
          }
        }
      }
    });
  } else if (e.dataTransfer?.files) {
    if (numberOfFilesExceeded(e.dataTransfer.files)) return;
    [...e.dataTransfer.files].forEach((file) => {
      if (file.size < maxFileSizeBytes.value) {
        uploadFileToSupabase(file);
      } else {
        addExceededSizeErrorMessage();
        notUploadedFiles.value.push(file.name);
      }
    });
  }
};

const handleUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || numberOfFilesExceeded(target.files)) return;
  [...target.files].forEach((file) => {
    if (file.size < maxFileSizeBytes.value) {
      uploadedFiles.value.push(file.name);
      uploadFileToSupabase(file);
    } else {
      notUploadedFiles.value.push(file.name);
    }
  });
};

const handleKeydown = (e: KeyboardEvent) => {
  const input = root.value?.querySelector("#file") as HTMLInputElement | null;
  if (e.code === "Enter") {
    resetState();
    input?.click();
  }
};
</script>

<template>
  <div ref="root" class="drag-and-drop">
    <form class="drag-and-drop__form" @submit.prevent>
      <p class="drag-and-drop__info">
        You can upload max {{ maxFilesNumber }} files, max {{ maxFileSizeMB }}MB
        each.
      </p>
      <div
        class="drag-and-drop__dropzone"
        :class="{ 'drag-and-drop__dropzone--active': isDragActive }"
        @drop.prevent="handleDrop"
        @dragenter="handleDrag"
        @dragover.prevent="handleDrag"
        @dragleave="handleDrag"
      >
        <p class="drag-and-drop__description">Drop your files here</p>
        <img
          class="drag-and-drop__icon"
          src="@/assets/img/drag-and-drop.png"
          alt="drag and drop icon"
        />
        <p class="drag-and-drop__description">or</p>
      </div>
      <label
        class="drag-and-drop__label"
        for="file"
        tabindex="0"
        role="button"
        aria-pressed="false"
        @keydown="handleKeydown"
        @click="resetState"
      >
        Upload your files
        <img
          class="drag-and-drop__icon"
          src="@/assets/img/upload.png"
          alt="upload"
        />
        <input
          id="file"
          class="drag-and-drop__input"
          type="file"
          name="file"
          multiple
          @change="handleUpload"
        />
      </label>
    </form>

    <Transition>
      <FileList
        v-if="uploadedFiles.length"
        title="Uploaded files:"
        :items="uploadedFiles"
        theme="success"
      />
    </Transition>
    <Transition>
      <div v-if="errorMessages" class="drag-and-drop__error">
        <p v-for="message in errorMessages" :key="message">{{ message }}</p>
      </div>
    </Transition>
    <Transition>
      <FileList
        v-if="notUploadedFiles.length"
        title="Files not uploaded:"
        :items="notUploadedFiles"
        theme="failure"
      />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.drag-and-drop {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.drag-and-drop__form {
  width: 100%;
  max-width: 700px;
  box-shadow: 0.25rem 0.25rem 0.75rem rgb(0 0 0 / 10%);
  border-radius: 16px;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.drag-and-drop__info {
  color: $text-color-secondary;
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  padding: 1rem;
}

.drag-and-drop__dropzone {
  border: 4px dashed $color-green-medium;
  border-radius: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: $color-green-dark;
  text-align: center;
  margin-bottom: 1rem;
}
.drag-and-drop__dropzone--active {
  background-color: $color-green-light;
}

.drag-and-drop__description {
  padding: 1rem;
}

.drag-and-drop__label {
  border-radius: 16px;
  background-color: $color-green-dark;
  max-width: 300px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  color: $color-white;
  cursor: pointer;
}

.file--label:hover {
  background-color: $color-green-dark-hover;
}

.drag-and-drop__icon {
  width: 50px;
  height: 50px;
}

.drag-and-drop__input {
  display: none;
}

.drag-and-drop__error {
  font-size: 1.2rem;
  color: $text-color-error;
  text-align: center;
  padding: 0.5rem 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
