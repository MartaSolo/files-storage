<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    theme?: "white" | "green" | "light-green" | "light-gray";
    to?: string | null;
  }>(),
  {
    theme: "green",
    to: null,
  }
);

const computedClass = computed(() => {
  return ["button", `button--${props.theme}`];
});

const component = computed(() => {
  return props.to ? resolveComponent("NuxtLink") : "button";
});
</script>

<template>
  <component :is="component" :to="to" :class="computedClass">
    <slot></slot
  ></component>
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

.button--light-green {
  background-color: $color-green-light;
  color: $color-green-dark;
  &:hover {
    background-color: $color-green-light-hover;
  }
}

.button--light-grey {
  background-color: $color-grey-lightest;
  color: $text-color-primary;
  &:hover {
    background-color: $color-grey-lighter;
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
