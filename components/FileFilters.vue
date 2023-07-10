<script setup lang="ts">
import { FileObject } from "@supabase/storage-js";

const props = defineProps<{
  fileList: FileObject[];
}>();

const root = ref<HTMLElement | null>(null);
const isFilterOpen = ref(false);
const sliderMin = ref(1.5);
const sliderMax = ref(3.5);
const nameFilter = ref("");
const selectedTypes = ref<string[]>([]);

const sortTypes = useSortType(undefined, props.fileList);

useClickOutside(root, () => {
  isFilterOpen.value = false;
});

const toggleFilters = () => {
  isFilterOpen.value = !isFilterOpen.value;
};
</script>

<template>
  <div ref="root" class="filters">
    <div class="filters__menu">
      <IconButton
        description="File filters"
        theme="green"
        @click="toggleFilters"
      >
        <template #icon>
          <FilterIcon />
        </template>
      </IconButton>
      <p class="filters__menu--active">4</p>
    </div>
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
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filters {
  width: 50px;
  position: relative;
}

.filters__menu--active {
  position: absolute;
  top: 15px;
  left: 30px;
  color: $color-green-dark;
}

.filters__selection {
  background-color: $color-white;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
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
</style>
