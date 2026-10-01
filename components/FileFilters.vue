<template>
  <div class="filters" data-testid="file-filters">
    <div class="filters__menu">
      <IconButton
        description="File filters"
        theme="green"
        data-testid="file-filters-toggle"
        :aria-expanded="isFilterOpen"
        @click="toggleFilters"
      >
        <template #icon>
          <FilterIcon />
          <div
            v-if="activeFiltersCount >= 1"
            class="filters__number"
            data-testid="file-filters-count"
          >
            {{ activeFiltersCount }}
          </div>
        </template>
      </IconButton>
    </div>
    <Transition>
      <div
        v-if="isFilterOpen"
        class="filters__selection"
        data-testid="file-filters-panel"
      >
        <button
          class="filters__close-button"
          aria-label="Close filters"
          data-testid="file-filters-close"
          type="button"
          @click="isFilterOpen = false"
        >
          <CloseIcon />
        </button>
        <div class="filters__filter">
          <BaseInput
            type="text"
            label="Name includes:"
            name="name-filter"
            class="filters__filter-name"
            data-testid="file-filters-name"
            :model-value="filters.name"
            @update:model-value="($event) => (filters.name = $event as string)"
          />
        </div>
        <div class="filters__filter">
          <BaseMultiselect
            label="File type:"
            data-testid="file-filters-types"
            :file-types="fileTypes"
            :model-value="filters.types"
            @update:model-value="($event: string[]) => (filters.types = $event)"
          />
        </div>
        <div class="filters__filter">
          <BaseMinMaxSlider
            label="Size range:"
            unit="MB"
            data-testid="file-filters-size"
            :min="0"
            :max="MAX_FILE_SIZE_MB"
            :step="0.01"
            :min-value="filters.sizeMin"
            :max-value="filters.sizeMax"
            @update:min-value="($event: number) => (filters.sizeMin = $event)"
            @update:max-value="($event: number) => (filters.sizeMax = $event)"
          />
        </div>
        <div class="filters__filter">
          <p class="filters__filter-label">Time created:</p>
          <TimeCreatedDatepicker
            data-testid="file-filters-dates"
            :model-value="filters.dates"
            @update:model-value="
              ($event) => (filters.dates = ($event as Date[] | null) ?? [])
            "
          />
        </div>
        <div class="filters__actions">
          <BaseButton
            theme="white"
            data-testid="file-filters-clear"
            @click="handleClear"
          >
            Clear filters
          </BaseButton>
          <BaseButton
            :disabled="!isDateValid || !hasFiltersChanged"
            data-testid="file-filters-confirm"
            @click="handleConfirm"
          >
            Confirm
          </BaseButton>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { MAX_FILE_SIZE_MB } from "@/utils/constants/maxFileSizeMB";
import type { FilterParams } from "@/types/FilterParams";

const props = defineProps<{
  fileTypes: string[];
  modelValue: FilterParams;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: FilterParams): void;
}>();

const { storage } = useStorage();

const isFilterOpen = ref(false);

const filters = reactive<FilterParams>({ ...props.modelValue });

const hasValidDates = (dates: FilterParams["dates"]) =>
  !!dates?.length && !dates.some((date) => date === null);

const countFilters = (f: FilterParams) => {
  let count = 0;
  if (f.name) count++;
  if (f.types.length) count++;
  if (f.sizeMin !== 0 || f.sizeMax !== MAX_FILE_SIZE_MB) count++;
  if (hasValidDates(f.dates)) count++;
  return count;
};

const activeFiltersCount = computed(() => countFilters(props.modelValue));

const isDateValid = computed(
  () => !filters.dates.some((date) => date === null)
);

const isSameFilters = (a: FilterParams, b: FilterParams) =>
  a.name === b.name &&
  a.sizeMin === b.sizeMin &&
  a.sizeMax === b.sizeMax &&
  a.types.length === b.types.length &&
  a.types.every((type) => b.types.includes(type)) &&
  a.dates.length === b.dates.length &&
  a.dates.every((date, i) => date?.getTime() === b.dates[i]?.getTime());

const hasFiltersChanged = computed(
  () => !isSameFilters(filters, props.modelValue)
);

const resetFilters = () => {
  filters.name = "";
  filters.types = [];
  filters.sizeMin = 0;
  filters.sizeMax = MAX_FILE_SIZE_MB;
  filters.dates = [];
};

const emitFilters = () => {
  emit("update:modelValue", {
    ...filters,
    types: [...filters.types],
    dates: [...filters.dates],
  });
};

const handleClear = () => {
  resetFilters();
  if (activeFiltersCount.value) emitFilters();
  isFilterOpen.value = false;
};

const handleConfirm = () => {
  emitFilters();
  isFilterOpen.value = false;
};

const toggleFilters = () => {
  isFilterOpen.value = !isFilterOpen.value;
  if (isFilterOpen.value) {
    filters.name = props.modelValue.name;
    filters.types = [...props.modelValue.types];
    filters.sizeMin = props.modelValue.sizeMin;
    filters.sizeMax = props.modelValue.sizeMax;
    filters.dates = [...props.modelValue.dates];
  }
};

watch(
  storage,
  () => {
    handleClear();
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.filters {
  width: 50px;
  position: relative;

  &__number {
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

  &__selection {
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
    display: flex;
    flex-direction: column;
    @include mediumScreenPlus {
      right: -225px;
    }
  }

  &__close-button {
    align-self: end;
  }

  &__filter {
    border-bottom: 1px solid $color-green-medium;
    padding: 1rem 0.5rem;
    &:last-child {
      border-bottom: none;
    }
  }

  &__filter-name {
    margin-bottom: 0;
  }

  &__filter-label {
    padding-bottom: 0.5rem;
  }

  &__actions {
    display: flex;
    justify-content: space-around;
    padding: 1rem;
  }
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
