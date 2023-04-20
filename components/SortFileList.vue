<script setup lang="ts">
import { SortOption } from "@/types/SortOptions";
import SortUp from "@/components/svg/SortUp.vue";
import SortDown from "@/components/svg/SortDown.vue";
import { useClickOutside } from "@/composable/useClickOutside";
import { useSortColumn, useSortOrder } from "@/composable/useState";

const sortOptions = ref<SortOption[]>([
  { label: "name ascending", column: "name", order: "asc" },
  { label: "name descending", column: "name", order: "desc" },
  { label: "type ascending", column: "mimetype", order: "asc" },
  { label: "type descending", column: "mimetype", order: "desc" },
  { label: "size ascending", column: "size", order: "asc" },
  { label: "size descending", column: "size", order: "desc" },
  { label: "time created ascending", column: "created_at", order: "asc" },
  { label: "time created descending", column: "created_at", order: "desc" },
]);

const root = ref<HTMLElement | null>(null);

useClickOutside(root, () => {
  isDropdownOpen.value = false;
});

const sortColumn = useSortColumn();
const sortOrder = useSortOrder();

const isDropdownOpen = ref(false);

const defaultSelectedOption = sortOptions.value.filter(
  (option) =>
    option.column === sortColumn.value && option.order === sortOrder.value
)[0].label;

const selectedOption = ref<string>(defaultSelectedOption);

const highlightedOptionIndex = ref(
  sortOptions.value.map((option) => option.label).indexOf(selectedOption.value)
);

const sortOptionsLength = computed(() => {
  return sortOptions.value.length;
});

const prevOptionIndex = computed(() => {
  const prev = highlightedOptionIndex.value - 1;
  return prev < 0 ? sortOptionsLength.value - 1 : prev;
});

const nextOptionIndex = computed(() => {
  const next = highlightedOptionIndex.value + 1;
  return next > sortOptionsLength.value - 1 ? 0 : next;
});

const highlightPrevOption = () => {
  highlightedOptionIndex.value = prevOptionIndex.value;
};

const highlightNextOption = () => {
  highlightedOptionIndex.value = nextOptionIndex.value;
};

const calculatedClass = (optionLabel: string, optionIndex: number) => {
  const selectedClass =
    optionLabel === selectedOption.value ? "sort__option--selected" : "";
  const highlightedClass =
    optionIndex === highlightedOptionIndex.value
      ? "sort__option--highlighted"
      : "";
  return [selectedClass, highlightedClass];
};

const toggleOptions = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectOption = (chosenOption: SortOption) => {
  toggleOptions();
  selectedOption.value = chosenOption.label;
  highlightedOptionIndex.value = sortOptions.value.findIndex(
    (option) => option.label === selectedOption.value
  );
  sortColumn.value = chosenOption.column;
  sortOrder.value = chosenOption.order;
  emit("setSortOptions");
};

const emit = defineEmits<{
  (e: "setSortOptions"): void;
}>();

const handleKeyUpEnter = () => {
  if (isDropdownOpen.value) {
    const highlightedOption = sortOptions.value[highlightedOptionIndex.value];
    selectOption(highlightedOption);
    isDropdownOpen.value = false;
  } else {
    isDropdownOpen.value = true;
  }
};
</script>

<template>
  <div ref="root" class="sort">
    <div class="sort__select">
      <div class="sort__label">Sort by:</div>
      <div
        class="sort__selected"
        tabindex="0"
        @click="toggleOptions"
        @keyup.space="toggleOptions"
        @keyup.enter="handleKeyUpEnter"
        @keyup.escape="isDropdownOpen = false"
        @keyup.up.exact="highlightPrevOption"
        @keyup.down.exact="highlightNextOption"
        @keydown.tab="isDropdownOpen = false"
      >
        <div class="sort__selected--option">{{ selectedOption }}</div>
        <component :is="isDropdownOpen ? SortUp : SortDown" />
      </div>
    </div>
    <ul v-if="isDropdownOpen" class="sort__list">
      <li
        v-for="(option, index) in sortOptions"
        :key="option.label"
        class="sort__option"
        :class="calculatedClass(option.label, index)"
        @click="selectOption(option)"
      >
        {{ option.label }}
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
  cursor: pointer;
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
  cursor: pointer;
  &:hover {
    background-color: $color-green-light-hover;
  }
}

@for $i from 1 through 7 {
  .sort__option:nth-child(#{$i}) {
    border-bottom: 1px solid $color-green-light;
  }
}

.sort__option--selected {
  font-weight: 800;
}

.sort__option--highlighted {
  background-color: $color-green-light;
}
</style>
