<script setup lang="ts">
import { computed } from "vue";

const maxFilesNumber = ref<number>(10);
const maxFileSizeMB = ref<number>(5);
const isDragActive = ref(false);
const message = ref<string>("");
const uploadedFiles = ref<string[]>([]);
const notUploadedFiles = ref<string[]>([]);

const maxFileSizeBytes = computed(() => {
  return maxFileSizeMB.value * 1000000;
});

const handleDrag = (e: Event) => {
  if (e.type === "dragenter" || e.type === "dragover") {
    isDragActive.value = true;
    message.value = "";
    uploadedFiles.value = [];
    notUploadedFiles.value = [];
  }
  if (e.type === "dragleave") {
    isDragActive.value = false;
  }
};

const numberOfFilesExceeded = (arrayOfFiles: []) => {
  if (arrayOfFiles.length > maxFilesNumber.value) {
    message.value = `You can upload up to ${maxFilesNumber.value} files at a time!`;
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

const handleSubmit = () => {
  console.log("Submit");
};
</script>

<template>
  <div class="wrapper">
    <form
      class="form--file"
      :class="{ active: isDragActive }"
      @submit.prevent="handleSubmit"
      @dragenter="handleDrag"
    >
      <label class="form--file-label" for="file">
        Drop your file here
        <img
          class="form--file-icon"
          src="../assets/img/drag-and-drop.png"
          alt="drag and drop icon"
        />
        or
        <button class="form--file-button">
          Upload your file
          <img
            class="form--file-icon"
            src="../assets/img/upload.png"
            alt="upload"
          />
        </button>
        <p class="form--file-info">
          You can upload max {{ maxFilesNumber }} files, max
          {{ maxFileSizeMB }}MB each.
        </p>
        <input
          id="file"
          class="form--file-input"
          type="file"
          name="file"
          multiple
        />
      </label>
      <div
        class="form--file-overlay"
        @drop.prevent="handleDrop"
        @dragenter="handleDrag"
        @dragover.prevent="handleDrag"
        @dragleave="handleDrag"
      ></div>
    </form>
    <div v-if="message" class="upload--error-message">{{ message }}</div>
    <div v-if="uploadedFiles.length > 0" class="uploaded--files-success">
      <FileList
        title="Uploaded files:"
        :items="uploadedFiles"
        :success="true"
      />
    </div>
    <div v-if="notUploadedFiles.length > 0" class="uploaded--files-failure">
      <FileList
        title="Files not uploaded due to the exceeded size:"
        :items="notUploadedFiles"
        :success="false"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
.wrapper {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1 px solid green;
}

.form--file {
  border: 4px dashed grey;
  height: 350px;
  border-radius: 16px;
  position: relative;
  margin: 1rem 0;
}

@media (min-width: 768px) {
  .form--file {
    width: 600px;
  }
}
.form--file.active {
  background-color: rgb(168, 203, 203);
}

.form--file-label {
  height: 100%;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: rgb(6, 89, 89);
  text-align: center;
}

.form--file-button {
  border: 1px solid black;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background-color: rgb(6, 89, 89);
  color: rgb(251, 249, 249);
  font-size: 1rem;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.form--file-button:hover {
  background-color: rgb(5, 130, 130);
}

.form--file-overlay {
  height: 100%;
  width: 100%;
  border-radius: 8px;
  position: absolute;
  top: 0;
  /* z-index: -99; */
}
.form--file-overlay:hover {
  background: red;
}

.form--file-info {
  color: rgb(143, 148, 148);
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
}

.form--file-icon {
  width: 50px;
  height: 50px;
}

.form--file-input {
  display: none;
}

.upload--error-message {
  font-size: 1.2rem;
  color: rgb(239, 26, 26);
  text-align: center;
}
</style>
