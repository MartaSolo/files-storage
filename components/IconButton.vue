<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    description: string;
    theme?: "grey" | "green" | "white";
  }>(),
  { theme: "grey" }
);

defineOptions({ inheritAttrs: false });

const isTextDisplayed = ref(false);

const computedClass = computed(() => `button__btn--${props.theme}`);

const showText = () => (isTextDisplayed.value = true);

const hideText = () => (isTextDisplayed.value = false);
</script>

<template>
  <div class="button">
    <button
      class="button__btn"
      type="button"
      :class="computedClass"
      v-bind="$attrs"
      :aria-label="description"
      @mouseenter="showText"
      @mouseleave="hideText"
      @focus="showText"
      @blur="hideText"
      @click="hideText"
    >
      <slot name="icon" />
    </button>
    <div v-show="isTextDisplayed" class="button__description">
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
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  &:disabled {
    cursor: not-allowed;
  }
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

.button__btn--white {
  background-color: $color-white;
  &:hover:not([disabled]) {
    background-color: $color-grey-lightest;
  }
}

.button__description {
  background-color: $text-color-primary;
  display: inline-block;
  color: $color-grey-lightest;
  padding: 0.25rem 0.5rem;
  margin-top: 0.25rem;
  border-radius: 5px;
  font-size: 0.75rem;
  position: absolute;
  top: 40px;
  display: flex;
  justify-content: center;
  z-index: 9999;
  width: max-content;
  white-space: nowrap;
}
</style>
