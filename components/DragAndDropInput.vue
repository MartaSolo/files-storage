<script setup lang="ts">
import { computed } from "vue";

const maxFilesNumber = ref<number>(10);
const maxFileSizeBytes = ref<number>(5000000);
const isDragActive = ref(false);
const message = ref<string>("");
const uploadedFiles = ref<string[]>([]);

const maxFileSizeMB = computed(() => {
  return maxFileSizeBytes.value / 1000000;
});

const handleDrag = (e: Event) => {
  if (e.type === "dragenter" || e.type === "dragover") {
    isDragActive.value = true;
  }
  if (e.type === "dragleave") {
    isDragActive.value = false;
  }
};

const numberOfFilesExceeded = (data: []) => {
  if (data.length > maxFilesNumber.value) {
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
        }
      }
    });
  } else {
    if (numberOfFilesExceeded(e.dataTransfer.files)) return;
    [...e.dataTransfer.files].forEach((file) => {
      if (file.size < maxFileSizeBytes.value) {
        uploadedFiles.value.push(file.name);
        // send to backend
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
        <div class="form--file-wrapper">
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
        </div>
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
    <div v-if="uploadedFiles.length > 0" class="uploaded--files">
      You have just uploaded:
      <ol class="uploaded--files-list">
        <li
          v-for="(file, index) in uploadedFiles"
          :key="index"
          class="uploaded--files-list-item"
        >
          {{ file }}
        </li>
      </ol>
    </div>
  </div>
</template>

<style lang="css" scoped>
.wrapper {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form--file {
  border: 4px dashed grey;
  max-width: 500px;
  height: 350px;
  border-radius: 16px;
  position: relative;
  margin: 1rem 0;
}
.form--file.active {
  background-color: rgb(168, 203, 203);
}

.form--file-label {
  display: block;
  height: 100%;
}

.form--file-wrapper {
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
}

.form--file-overlay {
  height: 100%;
  width: 100%;
  border-radius: 8px;
  position: absolute;
  top: 0;
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
.uploaded--files {
  font-size: 1.2rem;
  color: rgb(20, 24, 27);
}

.uploaded--files-list {
  list-style-type: decimal;
}

</style>
