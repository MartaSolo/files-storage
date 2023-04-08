<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
  }>(),
  {
    title: "Error",
    description: "We are sorry, but something is wrong",
  }
);
</script>

<template>
  <div class="error">
    <h2 class="error__title">{{ title }}</h2>
    <p class="error__description">{{ description }}</p>
  </div>
</template>

<style lang="scss" scoped>
.error {
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.error__title {
  font-size: 2.5rem;
  padding-bottom: 1rem;
  color: $text-color_error;
}

.error__description {
  font-size: 1.5rem;
}
</style>
