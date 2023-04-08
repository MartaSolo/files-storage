<script setup lang="ts">
import { SortOption } from "@/types/SortOptions";
import SortUp from "@/components/svg/SortUp.vue";
import SortDown from "@/components/svg/SortDown.vue";

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

const isDropdownOpen = ref(false);

const emit = defineEmits<{
  (e: "setSortOptions", column: string, order: string): void;
}>();

const selectedClass = (name: string) => {
  return name === selectedOption.value ? "sort__option--selected" : "";
};

const toggleOptions = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleClick = (chosenOption: SortOption) => {
  toggleOptions();
  selectedOption.value = chosenOption.name;
  emit("setSortOptions", chosenOption.column, chosenOption.order);
};

const selectedOnKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    toggleOptions();
  }
};
</script>

<template>
  <div class="sort">
    <div class="sort__select">
      <div class="sort__label">Sort by:</div>
      <div
        class="sort__selected"
        tabindex="0"
        @click="toggleOptions"
        @keydown="selectedOnKeyDown"
      >
        <div class="sort__selected__option">{{ selectedOption }}</div>
        <component :is="isDropdownOpen ? SortUp : SortDown" />
      </div>
    </div>
    <ul v-if="isDropdownOpen" class="sort__list">
      <li
        v-for="option in sortOptions"
        :key="option.name"
        class="sort__option"
        :class="selectedClass(option.name)"
        tabindex="0"
        @click="handleClick(option)"
      >
        {{ option.name }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.sort {
  position: relative;
}
.sort__select {
  display: inline-flex;
}
.sort__label {
  padding: 0.5rem 0.5rem 0 0;
}

.sort__selected {
  border: 1px solid $color-green-light;
  border-radius: 8px;
  padding: 0.5rem;
  width: 230px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sort__list {
  border: 1px solid $color-green-light;
  border-radius: 8px;
  width: 230px;
  background-color: $color-white;
  position: absolute;
  left: 66px;
}
.sort__option {
  padding: 0.5rem;
}

@for $i from 1 through 7 {
  .sort__option:nth-child(#{$i}) {
    border-bottom: 1px solid $color-green-light;
  }
}
.sort__option--selected {
  font-weight: 800;
}
</style>
