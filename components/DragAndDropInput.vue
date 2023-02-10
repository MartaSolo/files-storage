<script setup lang="ts">
const isDragActive = ref(false);

const handleSubmit = () => {
  console.log("Submit");
};

const handleDrop = () => {
  isDragActive.value = false;
};

const handleDrag = (e: Event) => {
  if (e.type === "dragenter" || e.type === "dragover") {
    isDragActive.value = true;
  }
  if (e.type === "dragleave") {
    isDragActive.value = false;
  }
};
</script>

<template>
  <form
    class="form--file"
    :class="{ active: isDragActive }"
    @submit.prevent="handleSubmit"
    @drop.prevent="handleDrop"
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
        <input id="file" class="form--file-input" type="file" name="file" />
      </div>
    </label>
    <div
      class="form--file-overlay"
      @dragenter="handleDrag"
      @dragover.prevent="handleDrag"
      @dragleave="handleDrag"
    ></div>
  </form>
</template>

<style lang="css" scoped>
.form--file {
  border: 4px dashed grey;
  max-width: 500px;
  height: 350px;
  border-radius: 16px;
  position: relative;
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
  justify-content: space-around;
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

.form--file-icon {
  width: 50px;
  height: 50px;
}

.form--file-input {
  display: none;
}
</style>
