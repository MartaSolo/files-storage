<script setup lang="ts">
const props = defineProps<{
  options: string[];
  modelValue: string;
  placeholder: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const isDropdownOpen = ref(false);
const root = ref<HTMLElement | null>(null);
const listItems = ref<HTMLElement[] | null>(null);
const highlightedIndex = ref(0);

const setHighlightedIndex = () => {
  if (props.modelValue) {
    highlightedIndex.value = props.options.indexOf(props.modelValue);
  } else {
    highlightedIndex.value = 0;
  }
};

onMounted(() => {
  setHighlightedIndex();
});

useClickOutside(root, () => {
  isDropdownOpen.value = false;
  setHighlightedIndex();
});

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  setHighlightedIndex();
};

const handleBlur = () => {
  setHighlightedIndex();
};

const prevOptionIndex = computed(() => {
  const prev = highlightedIndex.value - 1;
  return prev < 0 ? props.options.length - 1 : prev;
});

const nextOptionIndex = computed(() => {
  const next = highlightedIndex.value + 1;
  return next > props.options.length - 1 ? 0 : next;
});

const highlightPrev = () => {
  highlightedIndex.value = prevOptionIndex.value;
};

const highlightNext = () => {
  highlightedIndex.value = nextOptionIndex.value;
};

const selectOption = (selectedOption: string) => {
  emit("update:modelValue", selectedOption);
  isDropdownOpen.value = false;
};

const selectOptionByKeyboard = (index: number) => {
  if (isDropdownOpen.value) {
    const highlightedOption = props.options[index];
    selectOption(highlightedOption);
  } else {
    isDropdownOpen.value = true;
  }
};

const scrollIntoView = () => {
  if (isDropdownOpen.value && listItems.value?.length) {
    listItems.value[highlightedIndex.value].scrollIntoView({
      block: "nearest",
    });
  }
};

watch(highlightedIndex, scrollIntoView);
</script>

<template>
  <div ref="root" class="select">
    <button
      type="button"
      role="combobox"
      aria-controls="listbox-container"
      aria-owns="listbox-container"
      :aria-expanded="isDropdownOpen"
      class="select__button"
      @click="toggleDropdown"
      @blur="handleBlur"
      @keydown.esc="isDropdownOpen = false"
      @keydown.tab="isDropdownOpen = false"
      @keydown.up.prevent="highlightPrev()"
      @keydown.down.prevent="highlightNext()"
      @keydown.enter.prevent="selectOptionByKeyboard(highlightedIndex)"
      @keydown.space.prevent="selectOptionByKeyboard(highlightedIndex)"
    >
      {{ modelValue || placeholder }}
      <ArrowIcon class="select__arrow" :class="{ open: isDropdownOpen }" />
    </button>
    <ul
      v-if="isDropdownOpen"
      id="listbox-container"
      role="listbox"
      class="select__list"
    >
      <li
        v-for="(option, index) in options"
        :key="index"
        ref="listItems"
        role="option"
        :aria-selected="modelValue === option"
        class="select__list--item"
        :class="{
          active: highlightedIndex === index,
          selected: modelValue === option,
        }"
        @click="selectOption(option)"
        @mouseover="highlightedIndex = index"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.select {
  width: 100%;
  height: 100%;
  position: relative;
}

.select__button {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  border: 2px solid $color-green-dark;
  border-radius: $secondary-border-radius;
  padding: 0.25rem 1rem;
  gap: 0.5rem;
  text-align: center;
  color: $color-green-dark;
  &:hover {
    background-color: $color-green-light-hover;
  }
}

.select__arrow {
  transform: scale(1.4) rotate(90deg);
  &.open {
    transform: scale(1.4) rotate(270deg);
  }
}

.select__list {
  position: absolute;
  z-index: 9999;
  width: 100%;
  border-radius: $base-border-radius;
  border: 1px solid $color-green-light;
  max-height: 452px;
  @include customScrollbarGreen;
  margin-bottom: 2rem;
}

.select__list--item {
  width: 100%;
  cursor: pointer;
  padding: 0.5rem 1rem;
  background-color: $color-white;
  border-bottom: 1px solid $color-green-light;
  &:first-child {
    border-top-left-radius: $base-border-radius;
  }
  &:last-child {
    border-bottom-left-radius: $base-border-radius;
    border-bottom: none;
  }
  &.active {
    background-color: $color-green-light-hover;
  }
  &:hover {
    background-color: $color-green-light-hover;
  }
  &.selected {
    font-weight: 800;
  }
}
</style>
