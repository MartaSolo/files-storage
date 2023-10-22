<script setup lang="ts">
import { MAX_FILE_SIZE_MB } from "@/utils/constants/maxFileSizeMB";

const profileImageSource = useProfileImageSource();

const imageSource = computed(() => {
  return profileImageSource.value || "_nuxt/assets/img/avatar.png";
});

const {
  isDragActive,
  errorMessages,
  uploadedFiles,
  notUploadedFiles,
  root,
  handleDrag,
  handleDrop,
  handleKeydown,
  resetState,
  handleUpload,
} = useDragAndDrop(MAX_FILE_SIZE_MB, 1);
</script>

<template>
  <section class="profile__photo">
    <span class="profile__photo--name">Photo</span>
    <div
      class="profile__photo--dropzone"
      :class="{ 'profile__photo__dropzone--active': isDragActive }"
      @drop.prevent="handleDrop"
      @dragenter="handleDrag"
      @dragover.prevent="handleDrag"
      @dragleave="handleDrag"
    >
      <p class="profile__photo__description">
        Drop your photo here <br />
        or
      </p>
      <img
        class="profile__photo--image"
        :src="imageSource"
        width="400"
        height="400"
      />
    </div>
    <label
      class="profile__photo__label"
      for="file"
      tabindex="0"
      role="button"
      aria-pressed="false"
      @keydown="handleKeydown"
      @click="resetState"
    >
      Upload your photo
      <img
        class="profile__photo__icon"
        src="@/assets/img/upload.png"
        alt="upload"
      />
      <input
        id="file"
        class="profile__photo__input"
        type="file"
        name="file"
        multiple
        @change="handleUpload"
      />
    </label>
    <template v-if="errorMessages.length">
      <BaseNotification
        v-for="error in errorMessages"
        :key="error"
        theme="error"
        >{{ error }}</BaseNotification
      >
    </template>
  </section>
</template>

<style lang="scss" scoped>
.profile__photo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  @include mediumScreen {
    flex-basis: 50%;
  }
}

.profile__photo--name {
  align-self: flex-start;
  display: inline-block;
  padding: 0 0 0.5rem 0.5rem;
  color: $text-color-secondary;
  font-size: 0.8rem;
}

.profile__photo--dropzone {
  border: 4px dashed $color-grey-light;
  height: 400px;
  width: 400px;
  border-radius: 50%;
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
  position: relative;
  z-index: 9999;
}

.profile__photo__dropzone--active {
  background-color: $color-green-light;
}

.profile__photo--image {
  border-radius: 50%;
  object-fit: cover;
  height: 400px;
  width: 400px;
  position: absolute;
  top: 0;
  left: 0;
}

.profile__photo__description {
  padding: 1rem;
  margin-top: 3rem;
  z-index: 9999;
}

.profile__photo__label {
  border-radius: 16px;
  background-color: $color-green-dark;
  max-width: 300px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  color: $color-white;
  cursor: pointer;
}

.profile__photo__icon {
  width: 50px;
  height: 50px;
}
// .file--label:hover {
//   background-color: $color-green-dark-hover;
// }

.profile__photo__input {
  display: none;
}
</style>
