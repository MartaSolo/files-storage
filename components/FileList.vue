<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  items: string[];
  title: string;
  success?: boolean;
}>();

const computedClass = computed(() => {
  if (props.success) {
    return "success";
  } else if (!props.success) {
    return "failure";
  } else {
    return "";
  }
});
</script>

<template>
  <div class="list--wrapper" :class="computedClass">
    <p class="list--title">{{ title }}</p>
    <ol class="list--list" role="list">
      <li v-for="item in items" :key="item" class="list--item">
        {{ item }}
      </li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.list--wrapper {
  color: $text-color-primary;
  font-size: 1.2rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 16px;
  box-shadow: 0.25rem 0.25rem 0.75rem rgb(0 0 0 / 10%);
  width: 385px;
}

@media (min-width: 768px) {
  .list--wrapper {
    width: 600px;
  }
}

.list--title {
  padding-left: 0.5rem;
  font-weight: 500;
}

.list--wrapper.success .list--title {
  color: $text-color-success;
}
.list--wrapper.failure .list--title {
  color: $text-color-error;
}

.list--list {
  font-size: 1rem;
  counter-reset: list-item-counter;
}

.list--item {
  display: flex;
  padding: 0.5rem;
  gap: 0.5rem;
}
.list--item::before {
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

.list--wrapper.success .list--item::before {
  background-color: $text-color-success;
}
.list--wrapper.failure .list--item::before {
  background-color: $text-color-error;
}
</style>
