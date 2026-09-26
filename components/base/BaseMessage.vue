<template>
  <div class="message">
    <p
      :class="['message__title', `message__title--${type}`]"
      data-testid="base-message-title"
    >
      {{ title }}
    </p>
    <p
      v-if="description"
      class="message__description"
      data-testid="base-message-description"
    >
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    description?: string;
    type?: "error" | "success" | "info";
  }>(),
  {
    type: "info",
    description: "",
  }
);
</script>

<style lang="scss" scoped>
.message {
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  &__title {
    font-size: 2.5rem;
    padding-bottom: 1rem;
    &--error {
      color: $text-color-error;
    }
    &--success {
      color: $text-color-success;
    }
    &--info {
      color: $text-color-primary;
    }
  }

  &__description {
    font-size: 1.5rem;
  }
}
</style>
