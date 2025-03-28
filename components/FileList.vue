<template>
  <div :class="['list', `list--${theme}`]">
    <p class="list__title">{{ title }}</p>
    <ol class="list__list" role="list">
      <li v-for="item in items" :key="item" class="list__item">
        {{ item }}
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    items: string[];
    title: string;
    theme?: "success" | "failure" | "default";
  }>(),
  {
    theme: "default",
  }
);
</script>

<style lang="scss" scoped>
.list {
  color: $text-color-primary;
  font-size: 1.2rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 16px;
  box-shadow: 0.25rem 0.25rem 0.75rem rgb(0 0 0 / 10%);
  width: 100%;
  max-width: 700px;

  &--success {
    & .list__title {
      color: $text-color-success;
    }
    & .list__item::before {
      background-color: $text-color-success;
    }
  }

  &--failure {
    & .list__title {
      color: $text-color-error;
    }
    & .list__item::before {
      background-color: $text-color-error;
    }
  }

  &__title {
    padding-left: 0.5rem;
    font-weight: 500;
  }

  &__list {
    font-size: 1rem;
    counter-reset: list-item-counter;
  }

  &__item {
    display: flex;
    padding: 0.5rem;
    gap: 0.5rem;
    &::before {
      counter-increment: list-item-counter;
      content: counter(list-item-counter);
      background-color: $text-color-primary;
      color: rgb(255, 255, 255);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 25px;
      height: 25px;
      border-radius: 50%;
    }
  }
}
</style>
