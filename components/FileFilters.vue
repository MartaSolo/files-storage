<script setup lang="ts">
const isFilterOpen = ref(false);
const sliderMin = ref(1.5);
const sliderMax = ref(3.5);
// const sliderMin = ref(1);
// const sliderMax = ref(4);

const toggleFilters = () => {
  isFilterOpen.value = !isFilterOpen.value;
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
        </template>
      </IconButton>
      <p class="filters__menu--active">4</p>
    </div>
    <div v-if="isFilterOpen" class="filters__selection">
      <div class="filter">
        <label class="filter__label">Name includes:</label>
        <input class="filter__param" type="text" />
      </div>
      <div class="filter">
        <p class="filter__label">Type:</p>
      </div>
      <div class="filter">
        <p class="filter__label">Size range:</p>
        <CustomMinMaxSlider
          v-model:min-value="sliderMin"
          v-model:max-value="sliderMax"
          class="filter__param"
          :min="0"
          :max="5"
          :step="0.01"
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
.filter__param {
}
</style>
