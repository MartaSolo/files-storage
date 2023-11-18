<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";

const SortUp = resolveComponent("SortUp");
const SortDown = resolveComponent("SortDown");
const UncheckIcon = resolveComponent("UncheckIcon");

const props = defineProps<{
  fileTypes: string[] | string;
  label: string;
  modelValue: string[];
}>();

const types = ref<string[] | string>([]);

onMounted(() => {
  types.value = props.fileTypes;
});

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string[]): void;
}>();

const dropdown = ref<HTMLElement | null>(null);
const labelsRefs = ref<Element[] | ComponentPublicInstance[]>([]);
const isDropdownOpen = ref(false);
const highlightedIndex = ref(-1);

const prevIndex = computed(() => {
  return highlightedIndex.value === 0
    ? types.value.length - 1
    : highlightedIndex.value - 1;
});

const nextIndex = computed(() => {
  return highlightedIndex.value === types.value.length - 1
    ? 0
    : highlightedIndex.value + 1;
});

const highlightPrev = () => {
  highlightedIndex.value = prevIndex.value;
  focusLabel(highlightedIndex.value);
};

const highlightNext = () => {
  highlightedIndex.value = nextIndex.value;
  focusLabel(highlightedIndex.value);
};

const focusLabel = (index: number) => {
  const label = labelsRefs.value[index] as HTMLElement;
  label.focus();
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  highlightedIndex.value = -1;
};

useClickOutside(dropdown, () => {
  isDropdownOpen.value = false;
});

const check = (sortType: string, e: Event) => {
  const target = e.target as HTMLInputElement;

  let updatedValue = [...props.modelValue];

  if (target.checked) {
    updatedValue.push(sortType);
  } else {
    const filteredValue = updatedValue.filter((value) => value !== sortType);
    updatedValue = filteredValue;
  }
  emit("update:modelValue", updatedValue);
};

const uncheckType = (sortType: string) => {
  let updatedValue = [...props.modelValue];
  const filteredValue = updatedValue.filter((value) => value !== sortType);
  updatedValue = filteredValue;
  emit("update:modelValue", updatedValue);
};

const checkByKeyboard = (index: number) => {
  let updatedValue = [...props.modelValue];

  if (index !== -1 && !updatedValue.includes(types.value[index])) {
    updatedValue.push(types.value[index]);
  } else {
    const filteredValue = updatedValue.filter(
      (value) => value !== types.value[index]
    );
    updatedValue = filteredValue;
  }
  emit("update:modelValue", updatedValue);
};
</script>

<template>
  <div class="select">
    <p class="select__label">{{ label }}</p>
    <div ref="dropdown" class="select__dropdown">
      <div class="select__container">
        <div class="select__selected">
          <template v-if="modelValue.length > 0">
            <button
              v-for="type in modelValue"
              :key="type"
              class="select__selected--type"
              @click="uncheckType(type)"
            >
              {{ type }}
              <UncheckIcon class="select__selected--icon" />
            </button>
          </template>
        </div>
        <button
          class="select__button"
          aria-labelledby="toggle dropdown"
          aria-haspopup="listbox"
          :aria-expanded="isDropdownOpen"
          @click="toggleDropdown"
          @keyup.esc="isDropdownOpen = false"
          @keydown.down.prevent="highlightNext()"
        >
          <component :is="isDropdownOpen ? SortUp : SortDown" />
        </button>
      </div>
      <ul v-if="isDropdownOpen" class="select__list" role="listbox">
        <li
          v-for="(type, index) in types"
          :key="type"
          class="select__listitem"
          :class="{
            'select__listitem--highlighted': highlightedIndex === index,
          }"
          role="option"
          @mouseover="highlightedIndex = index"
        >
          <input
            :id="type"
            class="select__listitem--checkbox"
            type="checkbox"
            name="sortType"
            :value="type"
            :checked="modelValue.includes(type)"
            @input="check(type, $event)"
          />
          <label
            :ref="(el) => el !== null && (labelsRefs[index] = el)"
            :for="type"
            class="select__listitem--label"
            :tabindex="highlightedIndex === index ? '0' : '-1'"
            @keyup.left.prevent="highlightPrev()"
            @keyup.right.prevent="highlightNext()"
            @keyup.up.prevent="highlightPrev()"
            @keyup.down.prevent="highlightNext()"
            @keyup.enter.prevent="checkByKeyboard(index)"
            @keyup.space.prevent="checkByKeyboard(index)"
            @keyup.esc="isDropdownOpen = false"
          >
            {{ type }}
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select {
  width: 100%;
  display: flex;
  align-items: center;
}

.select__label {
  padding-right: 0.5rem;
  flex-shrink: 0;
}

.select__dropdown {
  flex-grow: 2;
  position: relative;
}

.select__container {
  width: 100%;
  border: 1px solid $color-grey-light;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  position: relative;
  display: flex;
}

.select__selected {
  width: calc(100% - 40px);
  padding-right: 0.5rem;
  display: flex;
  flex-wrap: wrap;
}

.select__selected--type {
  border: 1px solid $color-green-dark;
  padding: 0.25rem 0.5rem;
  margin: 0 0.25rem 0.5rem 0.25rem;
  border-radius: 8px;
  color: $color-green-dark;
  display: flex;
}

.select__selected--icon {
  align-self: flex-start;
}

.select__button {
  width: 40px;
  border: 1px solid $color-green-dark;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
}

.select__list {
  position: absolute;
  border: 1px solid $color-grey-light;
  width: 100%;
  background-color: $color-white;
  border-radius: 8px;
  z-index: 9999;
}

.select__listitem {
  border-bottom: 1px solid $color-grey-light;
  display: flex;
  &:last-child {
    border-bottom: none;
  }
  &:first-child > .select__listitem--label {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  &:last-child > .select__listitem--label {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}

.select__listitem--highlighted {
  background-color: $color-green-light;
}

.select__listitem--label {
  padding: 0.5rem 0.5rem 0.5rem 2.25rem;
  display: block;
  width: 100%;
  height: 100%;
  display: flex;
}

.select__listitem--checkbox {
  appearance: none;
}

.select__listitem--checkbox:checked + .select__listitem--label {
  font-weight: bold;
  padding: 0.5rem 0.5rem 0.5rem 0.5rem;
}

.select__listitem--checkbox:checked + .select__listitem--label::before {
  content: "";
  display: block;
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
  background-image: url("@/assets/img/checked.png");
  background-size: contain;
  background-position: center;
}
</style>
