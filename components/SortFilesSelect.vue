<script setup lang="ts">
import { SortOptions, Keys } from "@/types/SortOptions";

const isDropdownOpen = ref(true);

const sortOptions = ref<SortOptions[]>([
  { name: "name ascending", column: "name", order: "asc" },
  { name: "name descending", column: "name", order: "desc" },
  { name: "type ascending", column: "mimetype", order: "asc" },
  { name: "type descending", column: "mimetype", order: "desc" },
  { name: "size ascending", column: "size", order: "asc" },
  { name: "size descending", column: "size", order: "desc" },
  { name: "time created ascending", column: "created_at", order: "asc" },
  { name: "time created descending", column: "created_at", order: "desc" },
]);

const emit = defineEmits<{
  (e: "setSortOptions", column: Keys, order: Keys): void;
}>();

const dropdownSortOptions = computed(() => {
  return sortOptions.value.slice(1);
});

const toggleOptions = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleClick = (column: Keys, order: Keys) => {
  toggleOptions();
  emit("setSortOptions", column, order);
};
</script>

<template>
  <div class="select">
    <div class="select__title">Sort by:</div>
    <ul class="select__list">
      <li
        class="select__option"
        tabindex="0"
        @click="handleClick(sortOptions[0].column, sortOptions[0].order)"
      >
        {{ sortOptions[0].name }}
      </li>
      <template v-if="isDropdownOpen">
        <li
          v-for="option in dropdownSortOptions"
          :key="option.name"
          class="select__option"
          tabindex="0"
          @click="handleClick(option.column, option.order)"
        >
          {{ option.name }}
        </li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.select {
  display: flex;
}

.select__title {
  padding: 0.5rem 0.5rem 0 0;
}
.select__list {
  position: relative;
}

.select__option {
  border: 1px solid grey;
  padding: 0.5rem;
  width: 210px;
  position: absolute;
  background-color: $color-white;
}

@for $i from 2 through 8 {
  .select__option:nth-child(#{$i}) {
    top: 42px * ($i - 1);
  }
}
</style>
