<script setup lang="ts">
import { MAX_FILE_SIZE_MB } from "@/utils/constants/maxFileSizeMB";
import { FilterParams } from "@/types/FilterParams";

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

const activeFilters = computed(() => {
  let activeFilters = 0;
  if (filters.name) activeFilters = 1;
  if (filters.types.length) activeFilters += 1;
  if (filters.sizeMin !== 0 || filters.sizeMax !== MAX_FILE_SIZE_MB)
    activeFilters += 1;
  if (isDateValid.value && filters.dates?.length) activeFilters += 1;
  return activeFilters;
});

const toggleFilters = () => {
  isFilterOpen.value = !isFilterOpen.value;
};

const isDateValid = computed(() => {
  return !(
    Array.isArray(filters.dates) && filters.dates?.some((el) => el === null)
  );
});

const resetFilters = () => {
  filters.name = "";
  filters.types = [];
  filters.sizeMin = 0;
  filters.sizeMax = MAX_FILE_SIZE_MB;
  filters.dates = [];
};

const handleClear = () => {
  resetFilters();
  emit("update:modelValue", { ...filters });
  isFilterOpen.value = false;
};

const handleConfirm = () => {
  emit("update:modelValue", { ...filters });
  isFilterOpen.value = false;
};

watch(storage.value, () => {
  handleClear();
});
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
        <button class="filters__close-button" @click="isFilterOpen = false">
          <CloseIcon />
        </button>
        <div class="filters__filter">
          <BaseInput
            type="text"
            label="Name includes:"
            name="name-filter"
            :model-value="filters.name"
            @update:model-value="($event) => (filters.name = $event as string)"
          />
        </div>
        <div class="filters__filter">
          <BaseMultiselect
            label="File type:"
            :file-types="fileTypes"
            :model-value="filters.types"
            @update:model-value="($event:string[]) => (filters.types = $event)"
          />
        </div>
        <div class="filters__filter">
          <BaseMinMaxSlider
            label="Size range:"
            unit="MB"
            :min="0"
            :max="MAX_FILE_SIZE_MB"
            :step="0.01"
            :min-value="filters.sizeMin"
            :max-value="filters.sizeMax"
            @update:min-value="($event:number) => (filters.sizeMin = $event)"
            @update:max-value="($event:number) => (filters.sizeMax = $event)"
          />
        </div>
        <div class="filters__filter">
          <p class="filters__filter--label">Time created:</p>
          <TimeCreatedDatepicker
            :model-value="filters.dates"
            @update:model-value="($event) => (filters.dates = $event as Date[])"
          />
        </div>
        <div class="filters__actions">
          <BaseButton theme="white" @click="handleClear">
            Clear filters
          </BaseButton>
          <BaseButton :disabled="!isDateValid" @click="handleConfirm">
            Confirm
          </BaseButton>
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
  display: flex;
  flex-direction: column;
  @include mediumScreenPlus {
    right: -225px;
  }
}

.filters__close-button {
  align-self: end;
}

.filters__filter {
  border-bottom: 1px solid $color-green-medium;
  padding: 1rem 0.5rem;
  &:last-child {
    border-bottom: none;
  }
  &--label {
    padding-bottom: 0.5rem;
  }
}

.filters__actions {
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
