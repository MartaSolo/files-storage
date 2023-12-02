<script setup lang="ts">
import { MAX_FILE_SIZE_MB } from "@/utils/constants/maxFileSizeMB";

const {
  isDragActive,
  errorMessages,
  root,
  handleDrag,
  handleDrop,
  handleKeydown,
  resetState,
  handleUpload,
  uploadedFiles,
} = useUploadByDragAndDrop(MAX_FILE_SIZE_MB, 1);

const {
  upsertProfileImage,
  checkProfileImage,
  profileImageError,
  getPrivateFileList,
  selectedImage,
  privateFileList,
  isLoading,
  profileImageName,
} = useProfileImage();

const profileImageSource = useProfileImageSource();
const { notify } = useNotification();
const isStoragePublic = useIsStoragePublic();
const { updateStorage } = useStorage();

watch(
  uploadedFiles,
  () => {
    upsertProfileImage(uploadedFiles.value[0]);
  },
  { deep: true }
);

const errorMessage = computed(() => errorMessages.value[0] || "");

watch(errorMessage, () => {
  if (errorMessage.value) notify("error", errorMessage.value);
});

watch(profileImageError, () => {
  notify("error", profileImageError.value);
});

watch(selectedImage, () => {
  upsertProfileImage(selectedImage.value);
});

onMounted(async () => {
  isStoragePublic.value = false;
  await updateStorage();
  await checkProfileImage();
  getPrivateFileList();
});
</script>

<template>
  <UploadPhotoSkeleton v-if="isLoading" />
  <section v-else ref="root" class="profile__photo">
    <span class="profile__photo--name">Photo</span>
    <div class="profile__photo--buttons">
      <label
        class="profile__photo--label"
        for="file"
        tabindex="0"
        role="button"
        aria-pressed="false"
        @keydown="handleKeydown"
        @click="resetState"
      >
        Upload your photo
        <img
          class="profile__photo--icon"
          src="@/assets/img/upload.png"
          alt="upload"
        />
        <input
          id="file"
          class="profile__photo--input"
          type="file"
          name="file"
          multiple
          @change="handleUpload"
        />
      </label>
      <BaseSelect
        v-model="selectedImage"
        class="profile__photo--select"
        placeholder="Select your photo"
        :options="privateFileList"
      />
    </div>
    <div
      class="profile__photo--dropzone"
      :class="{ active: isDragActive }"
      @drop.prevent="handleDrop"
      @dragenter="handleDrag"
      @dragover.prevent="handleDrag"
      @dragleave="handleDrag"
    >
      <p class="profile__photo--description">
        Drop your photo here <br />
        or
      </p>
      <nuxt-img
        :src="profileImageSource"
        :alt="profileImageName"
        loading="lazy"
        width="400"
        height="400"
        quality="80"
        sizes="xs:100vw sm:100vw md:100vw lg:50vw xl:50vw 2xl:50vw"
        class="profile__photo--image"
      />
    </div>
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
  width: 100%;
  max-width: 300px;
  height: auto;
  aspect-ratio: 1 / 1;
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
  position: relative;
  z-index: 999;
  @include mediumScreen {
    max-width: 400px;
  }
  &.active {
    border: 4px dashed $color-green-dark;
  }
}

.profile__photo--image {
  border-radius: 50%;
  object-fit: cover;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.profile__photo--description {
  padding: 1rem;
  margin-top: 3rem;
  z-index: 9999;
}

.profile__photo--buttons {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  margin: 0.5rem 0 2rem 0;
  @include mediumScreen {
    width: 100%;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  }
  @include largeScreenPlus {
    gap: 4rem;
  }
}

.profile__photo--label {
  flex-basis: 50%;
  border-radius: $secondary-border-radius;
  background-color: $color-green-dark;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  color: $color-white;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
}

.profile__photo--icon {
  width: 40px;
  height: 40px;
}

.profile__photo--input {
  display: none;
}

.profile__photo--select {
  flex-basis: 50%;
}
</style>
