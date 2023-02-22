<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  maxFilesNumber: number;
  maxFileSizeMB: number;
}>();

const isDragActive = ref(false);
const message = ref<string>("");
const uploadedFiles = ref<string[]>([]);
const notUploadedFiles = ref<string[]>([]);

const maxFileSizeBytes = computed(() => {
  return props.maxFileSizeMB * 1000000;
});

const resetState = () => {
  message.value = "";
  uploadedFiles.value = [];
  notUploadedFiles.value = [];
};

const handleDrag = (e: Event) => {
  if (e.type === "dragenter" || e.type === "dragover") {
    isDragActive.value = true;
    resetState();
  }
  if (e.type === "dragleave") {
    isDragActive.value = false;
  }
};

const numberOfFilesExceeded = (arrayOfFiles: []) => {
  if (arrayOfFiles.length > props.maxFilesNumber) {
    message.value = `You can upload up to ${props.maxFilesNumber} files at a time!`;
    return true;
  } else {
    return false;
  }
};

const handleDrop = (e: Event) => {
  e.stopPropagation();
  isDragActive.value = false;

  if (e.dataTransfer.items) {
    if (numberOfFilesExceeded(e.dataTransfer.items)) return;
    [...e.dataTransfer.items].forEach((item) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file.size < maxFileSizeBytes.value) {
          uploadedFiles.value.push(file.name);
          // send to backend
        } else {
          notUploadedFiles.value.push(file.name);
        }
      }
    });
  } else {
    if (numberOfFilesExceeded(e.dataTransfer.files)) return;
    [...e.dataTransfer.files].forEach((file) => {
      if (file.size < maxFileSizeBytes.value) {
        uploadedFiles.value.push(file.name);
        // send to backend
      } else {
        notUploadedFiles.value.push(file.name);
      }
    });
  }
};

const handleUpload = (e: Event) => {
  // e.preventDefault();
  console.log("handleUpload", e);
  if (!e.target?.files) return;
  if (numberOfFilesExceeded(e.target?.files)) return;

  [...e.target?.files].forEach((file) => {
    if (file.size < maxFileSizeBytes.value) {
      uploadedFiles.value.push(file.name);
      // send to backend
    } else {
      notUploadedFiles.value.push(file.name);
    }
  });
};

const handleKeydown = (e: Event) => {
  console.log(e);
  const input = document.getElementById("file");
  if (e.code === "Enter") {
    resetState();
    input?.click();
  }
};

const handleSubmit = () => {
  console.log("Submit");
};
</script>

<template>
  <div class="wrapper">
    <form
      class="file--form"
      @submit.prevent="handleSubmit"
      @dragenter="handleDrag"
    >
      <p class="file--info">
        You can upload max {{ maxFilesNumber }} files, max {{ maxFileSizeMB }}MB
        each.
      </p>
      <div
        class="file--dropzone"
        :class="{ active: isDragActive }"
        @drop.prevent="handleDrop"
        @dragenter="handleDrag"
        @dragover.prevent="handleDrag"
        @dragleave="handleDrag"
      >
        <p class="file--dropzone-description">Drop your files here</p>
        <img
          class="file--dropzone-icon"
          src="../assets/img/drag-and-drop.png"
          alt="drag and drop icon"
        />
        <p class="file--dropzone-description">or</p>
      </div>
      <label
        class="file--label"
        for="file"
        tabindex="0"
        role="button"
        aria-pressed="false"
        @keydown="handleKeydown"
        @click="resetState"
      >
        Upload your files
        <img
          class="file--label-icon"
          src="../assets/img/upload.png"
          alt="upload"
        />
        <input
          id="file"
          class="file--input"
          type="file"
          name="file"
          multiple
          @change="handleUpload"
        />
      </label>
    </form>

    <Transition>
      <div v-if="message" class="upload--error-message">{{ message }}</div>
    </Transition>

    <Transition>
      <FileList
        v-if="uploadedFiles.length"
        title="Uploaded files:"
        :items="uploadedFiles"
        :success="true"
      />
    </Transition>

    <Transition>
      <FileList
        v-if="notUploadedFiles.length"
        title="Files not uploaded due to the exceeded size:"
        :items="notUploadedFiles"
        :success="false"
      />
    </Transition>
  </div>
</template>

<style lang="css" scoped>
.wrapper {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid green;
}

.file--form {
  width: 100%;
  box-shadow: 0.25rem 0.25rem 0.75rem rgb(0 0 0 / 10%);
  height: 450px;
  border-radius: 16px;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (min-width: 768px) {
  .file--form {
    width: 700px;
  }
}

.file--info {
  color: rgb(143, 148, 148);
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  padding: 1rem;
}

.file--dropzone {
  border: 4px dashed rgb(168, 203, 203);
  border-radius: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: rgb(6, 89, 89);
  text-align: center;
  margin-bottom: 1rem;
}
.file--dropzone.active {
  background-color: rgb(218, 233, 233);
}

.file--dropzone-description {
  padding: 1rem;
}

.file--label {
  border-radius: 16px;
  background-color: rgb(6, 89, 89);
  max-width: 300px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  color: rgb(251, 249, 249);
  cursor: pointer;
}

.file--label:hover {
  background-color: rgb(5, 130, 130);
}

.file--dropzone-icon,
.file--label-icon {
  width: 50px;
  height: 50px;
}

.file--input {
  display: none;
}

.upload--error-message {
  font-size: 1.2rem;
  color: rgb(239, 26, 26);
  text-align: center;
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
