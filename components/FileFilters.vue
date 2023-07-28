<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";
import { FilterParams } from "@/types/FilterParams";

const props = defineProps<{
  fileList: FileObject[];
  modelValue: FilterParams;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: FilterParams): void;
  (e: "reset-filtered-list"): void;
  (e: "set-filters-options"): void;
}>();

const isFilterOpen = ref(false);
const nameFilter = ref("");
const selectedTypes = ref<string[]>([]);
const sliderMin = ref(0);
const sliderMax = ref(5);
const dates = ref<Date[] | null>(null);

const sortTypes = useSortType(undefined, props.fileList);

const isDateValid = computed(() => {
  return !(
    Array.isArray(dates.value) && dates.value?.some((el) => el === null)
  );
});

const activeFilters = computed(() => {
  let activeFilters = 0;

  if (nameFilter.value) {
    activeFilters = 1;
  }
  if (selectedTypes.value.length >= 1) {
    activeFilters = activeFilters + 1;
  }
  if (sliderMin.value !== 0 || sliderMax.value !== 5) {
    activeFilters = activeFilters + 1;
  }
  if (isDateValid.value && dates.value !== null) {
    activeFilters = activeFilters + 1;
  }
  return activeFilters;
});

const filters = computed(() => {
  return {
    name: nameFilter.value,
    types: selectedTypes.value,
    sizeMin: sliderMin.value,
    sizeMax: sliderMax.value,
    dates: dates.value,
  };
});

const toggleFilters = () => {
  isFilterOpen.value = !isFilterOpen.value;
};

const resetFilters = () => {
  nameFilter.value = "";
  selectedTypes.value = [];
  sliderMin.value = 0;
  sliderMax.value = 5;
  dates.value = null;
};

const handleClear = () => {
  resetFilters();
  emit("update:modelValue", filters.value);
  // do I need this reset to be emitted?
  emit("reset-filtered-list");
  emit("set-filters-options");
  isFilterOpen.value = false;
};

const handleConfirm = () => {
  emit("update:modelValue", filters.value);
  emit("set-filters-options");
  isFilterOpen.value = false;
};
</script>

<template>
  <div class="filters">
    <div class="filters__menu">
      <IconButton
        description="File filters"
        theme="green"
        @click="toggleFilters"
      >
        <template #icon>
          <FilterIcon />
          <div v-if="activeFilters >= 1" class="filters__menu--active">
            {{ activeFilters }}
          </div>
        </template>
      </IconButton>
    </div>
    <Transition>
      <div v-if="isFilterOpen" class="filters__selection">
        <div class="filter">
          <BaseInput
            v-model="nameFilter"
            type="text"
            label="Name includes:"
            name="name-filter"
          />
        </div>
        <div class="filter">
          <BaseMultiselect
            v-model="selectedTypes"
            :file-types="sortTypes.type"
            label="File type:"
          />
        </div>
        <div class="filter">
          <BaseMinMaxSlider
            v-model:min-value="sliderMin"
            v-model:max-value="sliderMax"
            :min="0"
            :max="5"
            :step="0.01"
            label="Size range:"
            unit="MB"
          />
        </div>
        <div class="filter">
          <p class="filter__label">Time created:</p>
          <TimeCreatedDatepicker v-model="dates" />
        </div>
        <div class="actions">
          <BaseButton
            theme="white"
            label="Clear filters"
            @click="handleClear"
          />
          <BaseButton
            label="Confirm"
            :disabled="!isDateValid || activeFilters === 0"
            @click="handleConfirm"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.filters {
  width: 50px;
  position: relative;
}

.filters__menu--active {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: $color-green-dark;
  border-radius: 99px;
  color: $color-white;
  top: -9px;
  left: 30px;
  font-size: 0.8rem;
}

.filters__selection {
  background-color: $color-white;
  padding: 1rem;
  box-shadow: 0 2px 8px $box-shadow-color;
  position: absolute;
  width: calc(100vw - 70px);
  max-width: 500px;
  top: 50px;
  right: 10px;
  border-radius: 8px;
  z-index: 99999;
  @include mediumScreenPlus {
    right: -225px;
  }
}

.filter {
  border-bottom: 1px solid $color-green-medium;
  padding: 1rem 0.5rem;
}
.filter:last-child {
  border-bottom: none;
}
.filter__label {
  padding-bottom: 0.5rem;
}

.actions {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
