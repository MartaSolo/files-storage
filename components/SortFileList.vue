<script setup lang="ts">
import type { SortOption, SortColumn } from "@/types/SortOptions";
import type { SortOrder } from "@/types/SortOrder";

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

const props = defineProps<{
  sortColumn: SortColumn;
  sortOrder: SortOrder;
}>();

const emit = defineEmits<{
  (
    e: "setSortOptions",
    selectedSortColumn: SortColumn,
    selectedSortOrder: SortOrder
  ): void;
}>();

const selectedOption = computed(
  () =>
    sortOptions.find(
      (option) =>
        option.column === props.sortColumn && option.order === props.sortOrder
    ) ?? sortOptions[0]!
);

const selectedIndex = computed(() => sortOptions.indexOf(selectedOption.value));

const root = ref<HTMLElement | null>(null);

const isDropdownOpen = ref(false);

const highlightedOptionIndex = ref(selectedIndex.value);

const sortOptionsLength = sortOptions.length;

const prevOptionIndex = computed(() => {
  const prev = highlightedOptionIndex.value - 1;
  return prev < 0 ? sortOptionsLength - 1 : prev;
});

const nextOptionIndex = computed(() => {
  const next = highlightedOptionIndex.value + 1;
  return next > sortOptionsLength - 1 ? 0 : next;
});

const openDropdown = () => {
  highlightedOptionIndex.value = selectedIndex.value;
  isDropdownOpen.value = true;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const toggleOptions = () => {
  if (isDropdownOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
  }
};

const handleArrowUp = () => {
  if (isDropdownOpen.value) {
    highlightedOptionIndex.value = prevOptionIndex.value;
  } else {
    openDropdown();
  }
};

const handleArrowDown = () => {
  if (isDropdownOpen.value) {
    highlightedOptionIndex.value = nextOptionIndex.value;
  } else {
    openDropdown();
  }
};

const calculatedClass = (optionLabel: string, optionIndex: number) => {
  const selectedClass =
    optionLabel === selectedOption.value.label ? "sort__option--selected" : "";
  const highlightedClass =
    optionIndex === highlightedOptionIndex.value
      ? "sort__option--highlighted"
      : "";
  return [selectedClass, highlightedClass];
};

const selectOption = (chosenOption: SortOption) => {
  closeDropdown();
  if (
    chosenOption.column !== props.sortColumn ||
    chosenOption.order !== props.sortOrder
  ) {
    emit("setSortOptions", chosenOption.column, chosenOption.order);
  }
};

const selectOptionByKeyboard = () => {
  if (isDropdownOpen.value) {
    const highlightedOption = sortOptions[highlightedOptionIndex.value];
    if (highlightedOption) selectOption(highlightedOption);
  } else {
    openDropdown();
  }
};

const sortButtonId = useId();
const sortDropdownId = useId();
const spanId = useId();

const getOptionId = (option: SortOption) =>
  `${sortDropdownId}-${option.column}-${option.order}`;

const highlightedOptionId = computed(() => {
  if (!isDropdownOpen.value) return undefined;
  const option = sortOptions[highlightedOptionIndex.value];
  return option ? getOptionId(option) : undefined;
});

useClickOutside(root, () => {
  closeDropdown();
});
</script>

<template>
  <div ref="root" class="sort" data-testid="sort">
    <div class="sort__select">
      <span :id="spanId" class="sort__label">Sort by:</span>
      <button
        :id="sortButtonId"
        class="sort__selected"
        role="combobox"
        :aria-activedescendant="highlightedOptionId"
        :aria-expanded="isDropdownOpen"
        :aria-controls="sortDropdownId"
        :aria-labelledby="spanId"
        data-testid="sort-button"
        @click="toggleOptions"
        @keydown.enter.prevent="selectOptionByKeyboard"
        @keydown.space.prevent="selectOptionByKeyboard"
        @keydown.up.prevent="handleArrowUp"
        @keydown.down.prevent="handleArrowDown"
        @keydown.escape="closeDropdown"
        @keydown.tab="closeDropdown"
      >
        {{ selectedOption.label }}
        <component :is="isDropdownOpen ? SortUp : SortDown" />
      </button>
    </div>
    <ul
      v-if="isDropdownOpen"
      :id="sortDropdownId"
      class="sort__dropdown"
      role="listbox"
      :aria-labelledby="spanId"
    >
      <li
        v-for="(option, index) in sortOptions"
        :id="getOptionId(option)"
        :key="getOptionId(option)"
        class="sort__option"
        :class="calculatedClass(option.label, index)"
        role="option"
        :aria-selected="option.label === selectedOption.label"
        data-testid="sort-option"
        @mousedown.prevent
        @mouseenter="highlightedOptionIndex = index"
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
