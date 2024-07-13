<script setup lang="ts">
import { SortOption } from "@/types/SortOptions";
import { FileObjectKeys } from "@/types/FileObjectKeys";

const SortUp = resolveComponent("SortUp");
const SortDown = resolveComponent("SortDown");

const sortOptions: SortOption[] = [
  { label: "name ascending", column: "name", order: "asc" },
  { label: "name descending", column: "name", order: "desc" },
  { label: "type ascending", column: "mimetype", order: "asc" },
  { label: "type descending", column: "mimetype", order: "desc" },
  { label: "size ascending", column: "size", order: "asc" },
  { label: "size descending", column: "size", order: "desc" },
  { label: "time created ascending", column: "created_at", order: "asc" },
  { label: "time created descending", column: "created_at", order: "desc" },
];

const root = ref<HTMLElement | null>(null);

useClickOutside(root, () => {
  isDropdownOpen.value = false;
});

const sortColumn = useSortColumn();
const sortOrder = useSortOrder();

const isDropdownOpen = ref(false);

const defaultSelectedOption = sortOptions.filter(
  (option) =>
    option.column === sortColumn.value && option.order === sortOrder.value
)[0].label;

const selectedOption = ref<string>(defaultSelectedOption);

const highlightedOptionIndex = ref(
  sortOptions.map((option) => option.label).indexOf(selectedOption.value)
);

const sortOptionsLength = sortOptions.length;

const prevOptionIndex = computed(() => {
  const prev = highlightedOptionIndex.value - 1;
  return prev < 0 ? sortOptionsLength - 1 : prev;
});

const nextOptionIndex = computed(() => {
  const next = highlightedOptionIndex.value + 1;
  return next > sortOptionsLength - 1 ? 0 : next;
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
  highlightedOptionIndex.value = sortOptions.findIndex(
    (option) => option.label === selectedOption.value
  );
  sortColumn.value = chosenOption.column as FileObjectKeys;
  sortOrder.value = chosenOption.order;
  emit("setSortOptions");
};

const emit = defineEmits<{
  (e: "setSortOptions"): void;
}>();

const selectOptionByKeyboard = () => {
  if (isDropdownOpen.value) {
    const highlightedOption = sortOptions[highlightedOptionIndex.value];
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
      <span id="sort-label" class="sort__label">Sort by:</span>
      <button
        id="sort-button"
        class="sort__selected"
        aria-haspopup="listbox"
        :aria-expanded="isDropdownOpen"
        aria-controls="sort-dropdown"
        @click="toggleOptions"
        @keydown.enter.prevent="selectOptionByKeyboard"
        @keydown.space.prevent="selectOptionByKeyboard"
        @keydown.up.prevent="highlightPrevOption"
        @keydown.down.prevent="highlightNextOption"
        @keydown.escape="isDropdownOpen = false"
        @keydown.tab="isDropdownOpen = false"
      >
        {{ selectedOption }}
        <component :is="isDropdownOpen ? SortUp : SortDown" />
      </button>
    </div>
    <ul
      v-if="isDropdownOpen"
      id="sort-dropdown"
      class="sort__dropdown"
      tabindex="-1"
      role="listbox"
      aria-labelledby="sort-button"
    >
      <li
        v-for="(option, index) in sortOptions"
        :id="option.label"
        :key="option.label"
        class="sort__option"
        :class="calculatedClass(option.label, index)"
        role="option"
        :aria-selected="option.label === selectedOption"
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
  width: 300px;
}

.sort__select {
  display: inline-flex;
}

.sort__label {
  padding: 0.5rem 0.5rem 0 0;
}

.sort__selected {
  border: 1px solid $color-green-light;
  border-radius: $base-border-radius;
  padding: 0.5rem;
  width: 230px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sort__dropdown {
  border: 1px solid $color-green-light;
  border-radius: $base-border-radius;
  width: 230px;
  background-color: $color-white;
  position: absolute;
  left: 66px;
  z-index: 9999;
}

.sort__option {
  padding: 0.5rem;
  cursor: pointer;
  &:first-child {
    border-top-left-radius: $base-border-radius;
    border-top-right-radius: $base-border-radius;
  }
  &:last-child {
    border-bottom-left-radius: $base-border-radius;
    border-bottom-right-radius: $base-border-radius;
  }
  &:hover {
    background-color: $color-green-light-hover;
  }
  &--selected {
    font-weight: 800;
  }
  &--highlighted {
    background-color: $color-green-light;
  }
}

@for $i from 1 through 7 {
  .sort__option:nth-child(#{$i}) {
    border-bottom: 1px solid $color-green-light;
  }
}
</style>
