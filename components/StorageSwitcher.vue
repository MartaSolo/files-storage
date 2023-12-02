<template>
  <div class="switch">
    <button
      class="switch__button switch__button--public"
      :class="{ 'switch__button--active': modelValue }"
      @click="emit('update:modelValue', true)"
    >
      Public
    </button>
    <button
      class="switch__button switch__button--private"
      :class="{ 'switch__button--active': !modelValue }"
      @click="emit('update:modelValue', false)"
    >
      Private
    </button>
    <span
      class="switch__glider"
      :style="{ transform: `translateX(${gliderPosition}%)` }"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const gliderPosition = computed(() => {
  return props.modelValue ? "0" : "100";
});
</script>

<style lang="scss" scoped>
.switch {
  --switch-width: 130px;
  --switch-width-lg: 140px;
  --switch-height: 34px;
  width: var(--switch-width);
  height: var(--switch-height);
  position: relative;
  display: inline-flex;
  border-radius: 999px;
  background-color: $color-white;
  border: 2px solid $color-green-dark;
  @include largeScreen {
    width: var(--switch-width-lg);
  }
}

.switch__button {
  width: calc(var(--switch-width) / 2);
  font-size: 14px;
  font-weight: 600;
  color: $color-green-dark;
  display: flex;
  justify-content: center;
  align-items: center;
  &--public {
    border-top-left-radius: 999px;
    border-bottom-left-radius: 999px;
  }
  &--private {
    border-top-right-radius: 999px;
    border-bottom-right-radius: 999px;
  }
  &--active {
    z-index: 40;
    color: $color-white;
  }
  @include largeScreen {
    width: calc(var(--switch-width-lg) / 2);
  }
}

.switch__glider {
  position: absolute;
  left: -1px;
  height: 100%;
  cursor: pointer;
  background-color: $color-green-dark;
  border-radius: 999px;
  transition: transform 0.25s ease-out;
  width: calc(var(--switch-width) / 2);
  @include largeScreen {
    width: calc(var(--switch-width-lg) / 2);
  }
}
</style>
