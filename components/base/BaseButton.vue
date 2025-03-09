<script setup lang="ts">
import { computed } from "vue";

interface Props {
  theme?: "white" | "green" | "light-green" | "light-gray";
  to?: string | null;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  size?: "small" | "medium" | "large";
}

const props = withDefaults(defineProps<Props>(), {
  theme: "green",
  to: null,
  type: "button",
  loading: false,
  size: "medium",
});

const computedClass = computed(() => {
  return [
    "button",
    `button--${props.theme}`,
    `button--${props.size}`,
    { "button--loading": props.loading },
  ];
});

const component = computed(() => {
  return props.to ? resolveComponent("NuxtLink") : "button";
});

const buttonProps = computed(() => {
  if (props.to) return { to: props.to };
  return {
    type: props.type,
  };
});
</script>

<template>
  <component
    :is="component"
    v-bind="buttonProps"
    :class="computedClass"
    :aria-disabled="loading"
  >
    <span v-if="loading" class="button__loader"></span>
    <slot></slot>
  </component>
</template>

<style lang="scss" scoped>
.button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 40px;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    &:hover {
      opacity: 0.4;
    }
  }

  &--small {
    padding: 0.375rem 0.625rem;
    min-width: 80px;
    font-size: 0.875rem;
  }

  &--medium {
    padding: 0.5rem 0.75rem;
    min-width: 90px;
    font-size: 1rem;
  }

  &--large {
    padding: 0.625rem 1rem;
    min-width: 100px;
    font-size: 1.125rem;
  }

  &__loader {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-radius: 50%;
    border-right-color: transparent;
    animation: button-loading 0.75s linear infinite;
  }
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

@keyframes button-loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
