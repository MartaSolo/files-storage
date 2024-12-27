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

<template>
  <div class="message">
    <h2 :class="['message__title', `message__title--${type}`]">{{ title }}</h2>
    <p v-if="description" class="message__description">{{ description }}</p>
  </div>
</template>

<style lang="scss" scoped>
.message {
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.message__title {
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

.message__description {
  font-size: 1.5rem;
}
</style>
