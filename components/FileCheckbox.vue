<template>
  <div class="checkbox">
    <label class="checkbox__label" :for="props.name" :aria-label="props.name">
      <input
        :id="props.name"
        v-model="selectedFiles"
        :value="props.name"
        type="checkbox"
        name="file-checkbox"
        :class="computedClass"
      />
    </label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  type: "image" | "video" | "docx" | "xlsx" | "pdf";
}>();

const selectedFiles = useSelectedFiles();

const isChecked = computed(() => {
  return selectedFiles.value.includes(props.name);
});

const computedClass = computed(() => {
  return [
    "checkbox__input",
    `checkbox__input--${props.type}`,
    isChecked.value ? "checked" : "",
  ];
});
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  align-items: center;

  &__label {
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  &__input {
    -webkit-appearance: none;
    appearance: none;
    background-color: $color-white;
    width: 20px;
    height: 22px;
    border: 1px solid $color-grey-light;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    &::before {
      content: "";
      position: absolute;
      background-size: cover;
      background-position: center;
    }
  }

  &__input:not(.checked):hover::before {
    position: absolute;
    background-image: none;
    background-color: $color-white;
    content: "";
    border: 1px solid $color-grey-light;
    border-radius: 4px;
    width: 20px;
    height: 22px;
    top: -1px;
  }

  &__input--image::before,
  &__input--video::before,
  &__input--pdf::before,
  &__input--docx::before,
  &__input--xlsx::before,
  &__input--other::before {
    width: 20px;
    height: 22px;
    border-radius: 4px;
    text-align: center;
    color: $color-white;
    top: -1px;
    left: -1px;
  }

  &__input--image::before {
    background-image: url("@/assets/img/image_icon.png");
    height: 28px;
    top: -4px;
    left: -1px;
    border-radius: 8px;
  }

  &__input--video::before {
    background-image: url("@/assets/img/video_icon.png");
    height: 32px;
    top: -6px;
    left: -1px;
    border-radius: 10px;
  }

  &__input--pdf::before {
    background-image: url("@/assets/img/pdf_icon.png");
    width: 13px;
    height: 13px;
    top: 3px;
    left: 2px;
  }

  &__input.checkbox__input--pdf:not(.checked):hover::before {
    left: -1px;
  }

  &__input--docx::before {
    background-color: $color-blue-word;
    content: "W";
  }

  &__input--xlsx::before {
    background-color: $color-green-xls;
    content: "X";
  }

  &__input--other::before {
    background-color: $color-grey-other;
    border-radius: 4px;
    content: "=";
  }

  &__input.checked::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 16px;
    background-image: url("@/assets/img/checked.png");
    background-size: contain;
    background-position: center;
    background-color: $color-white;
  }
}
</style>
