<script setup lang="ts">
const props = defineProps<{
  description: string;
  theme: "green" | "grey";
}>();

const isTextDisplayed = ref(false);

const computedClass = computed(() => {
  return `button__btn--${props.theme}`;
});

const descriptionWidth = computed(() => {
  return props.description.length * 7;
});

const descriptionStyle = computed(() => {
  return `width:${descriptionWidth.value}px;`;
});

const showText = () => {
  isTextDisplayed.value = true;
};

const hideText = () => {
  isTextDisplayed.value = false;
};
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<template>
  <div class="button">
    <button
      class="button__btn"
      :class="computedClass"
      v-bind="$attrs"
      aria-labelledby="description"
      @mouseenter="showText"
      @mouseleave="hideText"
      @click="hideText"
    >
      <slot name="icon" />
    </button>
    <div
      v-show="isTextDisplayed"
      id="description"
      class="button__description"
      :style="descriptionStyle"
    >
      {{ description }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.button {
  position: relative;
  display: flex;
  justify-content: center;
}
.button__btn {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s;
}

.button__btn:disabled {
  cursor: not-allowed;
}

.button__btn--green {
  background-color: $color-green-light;
  &:hover:not([disabled]) {
    background-color: $color-green-medium;
  }
}
.button__btn--grey {
  background-color: $color-grey-lightest;
  &:hover:not([disabled]) {
    background-color: $color-grey-light;
  }
}

.button__description {
  background-color: $text-color-primary;
  display: inline-block;
  color: $color-grey-lightest;
  padding: 0.25rem 0;
  border-radius: 5px;
  font-size: 0.75rem;
  position: absolute;
  top: 40px;
  display: flex;
  justify-content: center;
  z-index: 99999;
}
</style>
