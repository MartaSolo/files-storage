<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string;
    theme: "white" | "green";
  }>(),
  {
    theme: "green",
  }
);

const computedClass = computed(() => {
  return ["button", `button--${props.theme}`];
});
</script>

<template>
  <button :class="computedClass">{{ label }}</button>
</template>

<style lang="scss" scoped>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 40px;
  min-width: 90px;
}

.button--white {
  background-color: $color-white;
  color: $color-green-dark;
  &:hover {
    background-color: $color-grey-lightest;
  }
}
.button--green {
  background-color: $color-green-dark;
  color: $color-white;
  &:hover {
    background-color: $color-green-dark-hover;
  }
}
.button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  &:hover {
    opacity: 0.4;
  }
}
</style>
