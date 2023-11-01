<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";
import { MAX_FILE_SIZE_MB } from "@/utils/constants/maxFileSizeMB";
import { FilterParams } from "@/types/FilterParams";

const props = defineProps<{
  fileList: FileObject[];
  modelValue: FilterParams;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: FilterParams): void;
  (e: "set-filters-options"): void;
}>();

const { storage } = useStorage();

const fileTypes = computed(() => {
  const { type } = useSortType(undefined, props.fileList);
  return type;
});

const isFilterOpen = ref(false);

const publicFilters = reactive<FilterParams>({
  name: "",
  types: [],
  sizeMin: 0,
  sizeMax: MAX_FILE_SIZE_MB,
  dates: [],
});

const privateFilters = reactive<FilterParams>({
  name: "",
  types: [],
  sizeMin: 0,
  sizeMax: MAX_FILE_SIZE_MB,
  dates: [],
});

const nameModel = computed({
  get() {
    return storage.value.bucket === "private"
      ? privateFilters.name
      : publicFilters.name;
  },
  set(newValue) {
    return storage.value.bucket === "private"
      ? (privateFilters.name = newValue)
      : (publicFilters.name = newValue);
  },
});

const typeModel = computed({
  get() {
    return storage.value.bucket === "private"
      ? privateFilters.types
      : publicFilters.types;
  },
  set(newValue) {
    return storage.value.bucket === "private"
      ? (privateFilters.types = newValue)
      : (publicFilters.types = newValue);
  },
});

const sizeMinModel = computed({
  get() {
    return storage.value.bucket === "private"
      ? privateFilters.sizeMin
      : publicFilters.sizeMin;
  },
  set(newValue) {
    return storage.value.bucket === "private"
      ? (privateFilters.sizeMin = newValue)
      : (publicFilters.sizeMin = newValue);
  },
});

const sizeMaxModel = computed({
  get() {
    return storage.value.bucket === "private"
      ? privateFilters.sizeMax
      : publicFilters.sizeMax;
  },
  set(newValue) {
    return storage.value.bucket === "private"
      ? (privateFilters.sizeMax = newValue)
      : (publicFilters.sizeMax = newValue);
  },
});

const datesModel = computed({
  get() {
    return storage.value.bucket === "private"
      ? privateFilters.dates
      : publicFilters.dates;
  },
  set(newValue) {
    return storage.value.bucket === "private"
      ? (privateFilters.dates = newValue)
      : (publicFilters.dates = newValue);
  },
});

const activeFilters = computed(() => {
  let activeFilters = 0;

  if (filters.value.name) {
    activeFilters = 1;
  }
  if (filters.value.types && filters.value.types.length >= 1) {
    activeFilters = activeFilters + 1;
  }
  if (
    filters.value.sizeMin !== 0 ||
    filters.value.sizeMax !== MAX_FILE_SIZE_MB
  ) {
    activeFilters = activeFilters + 1;
  }
  if (isDateValid.value && filters.value.dates.length) {
    activeFilters = activeFilters + 1;
  }
  return activeFilters;
});

const filters = computed(() => {
  return storage.value.bucket === "private" ? privateFilters : publicFilters;
});

const toggleFilters = () => {
  isFilterOpen.value = !isFilterOpen.value;
};

const isDateValid = computed(() => {
  return !(
    Array.isArray(filters.value.dates) &&
    filters.value.dates?.some((el) => el === null)
  );
});

const resetFilters = () => {
  if (storage.value.bucket === "private") {
    privateFilters.name = "";
    privateFilters.types = [];
    privateFilters.sizeMin = 0;
    privateFilters.sizeMax = MAX_FILE_SIZE_MB;
    privateFilters.dates = [];
  } else {
    publicFilters.name = "";
    publicFilters.types = [];
    publicFilters.sizeMin = 0;
    publicFilters.sizeMax = MAX_FILE_SIZE_MB;
    publicFilters.dates = [];
  }
};

const handleClear = () => {
  resetFilters();
  emit("update:modelValue", filters.value);
  emit("set-filters-options");
  isFilterOpen.value = false;
};

const handleConfirm = () => {
  emit("update:modelValue", filters.value);
  emit("set-filters-options");
  isFilterOpen.value = false;
};

watch(storage.value, () => {
  emit("update:modelValue", filters.value);
  emit("set-filters-options");
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
        <div class="filter">
          <BaseInput
            v-model="nameModel"
            type="text"
            label="Name includes:"
            name="name-filter"
          />
        </div>
        <div class="filter">
          <BaseMultiselect
            v-model="typeModel"
            :file-types="fileTypes"
            label="File type:"
          />
        </div>
        <div class="filter">
          <BaseMinMaxSlider
            v-model:min-value="sizeMinModel"
            v-model:max-value="sizeMaxModel"
            :min="0"
            :max="MAX_FILE_SIZE_MB"
            :step="0.01"
            label="Size range:"
            unit="MB"
          />
        </div>
        <div class="filter">
          <p class="filter__label">Time created:</p>
          <TimeCreatedDatepicker v-model="datesModel" />
        </div>
        <div class="actions">
          <BaseButton theme="white" @click="handleClear"
            >Clear filters</BaseButton
          >
          <BaseButton :disabled="!isDateValid" @click="handleConfirm"
            >Confirm</BaseButton
          >
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
