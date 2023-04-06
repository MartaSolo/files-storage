<script setup lang="ts">
import { SortOption } from "@/types/SortOptions";

const sortOptions = ref<SortOption[]>([
  { name: "name ascending", column: "name", order: "asc" },
  { name: "name descending", column: "name", order: "desc" },
  { name: "type ascending", column: "mimetype", order: "asc" },
  { name: "type descending", column: "mimetype", order: "desc" },
  { name: "size ascending", column: "size", order: "asc" },
  { name: "size descending", column: "size", order: "desc" },
  { name: "time created ascending", column: "created_at", order: "asc" },
  { name: "time created descending", column: "created_at", order: "desc" },
]);

const defaultSelectedOption = sortOptions.value[0].name;

const selectedOption = ref<string>(defaultSelectedOption);

const isDropdownOpen = ref(true);

const emit = defineEmits<{
  (e: "setSortOptions", column: string, order: string): void;
}>();

const toggleOptions = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleClick = (chosenOption: SortOption) => {
  toggleOptions();
  selectedOption.value = chosenOption.name;
  emit("setSortOptions", chosenOption.column, chosenOption.order);
};
</script>

<template>
  <div class="select">
    <label class="select__title">Sort by:</label>
    <input
      v-model="selectedOption"
      class="select__option"
      @focus="isDropdownOpen = true"
    />
    <ul v-if="isDropdownOpen" class="select__list">
      <li
        v-for="option in sortOptions"
        :key="option.name"
        class="select__option select__option--dropdown"
        tabindex="0"
        @click="handleClick(option)"
      >
        {{ option.name }}
      </li>
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
  border: 1px solid rgb(241, 238, 238);
  border-radius: 8px;
  padding: 0.5rem;
  width: 210px;
  background-color: $color-white;
}
.select__option--dropdown {
  border: 1px solid rgb(241, 238, 238);
  padding: 0.5rem;
  width: 210px;
  position: absolute;
  background-color: $color-white;
}

@for $i from 1 through 8 {
  .select__option:nth-child(#{$i}) {
    top: 42px * ($i);
    // top: 42px * ($i - 1);
  }
}
</style>
