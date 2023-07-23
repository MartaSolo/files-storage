<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    min: number;
    max: number;
    step: number;
    minValue: number;
    maxValue: number;
    label: string;
    unit?: string;
  }>(),
  {
    step: 1,
    unit: "",
  }
);

const emit = defineEmits<{
  (e: "update:minValue", sliderMinValue: number): void;
  (e: "update:maxValue", sliderMaxValue: number): void;
}>();

const leftPercent = computed(() => {
  const value = ((props.minValue - props.min) / (props.max - props.min)) * 100;
  return `${value}%`;
});

const rightPercent = computed(() => {
  const value =
    100 - ((props.maxValue - props.min) / (props.max - props.min)) * 100;
  return `${value}%`;
});

const onInputMin = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:minValue", Number(target.value));
};

const onInputMax = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emit("update:maxValue", Number(target.value));
};
</script>

<template>
  <div class="slider">
    <p class="slider__label">{{ label }}</p>
    <div class="slider__range minmax">
      <input
        id="min"
        type="range"
        name="min"
        :min="min"
        :max="max"
        :value="minValue"
        :step="step"
        @input="onInputMin"
      />
      <input
        id="max"
        type="range"
        name="max"
        :min="min"
        :max="max"
        :value="maxValue"
        :step="step"
        @input="onInputMax"
      />
    </div>
    <div class="slider__inputs">
      <div class="slider__input">
        <BaseInput
          name="min-size"
          type="number"
          class="slider__input--input"
          :min="min"
          :max="max"
          :model-value="minValue"
          :step="step"
          @input="onInputMin"
        >
          <span v-if="unit" class="slider__input--unit">{{ unit }}</span>
        </BaseInput>
      </div>
      <div class="minmax__dash"></div>
      <div class="slider__input">
        <BaseInput
          name="max-size"
          type="number"
          class="slider__input--input"
          :min="min"
          :max="max"
          :model-value="maxValue"
          :step="step"
          @input="onInputMax"
        >
          <span v-if="unit" class="slider__input--unit">{{ unit }}</span>
        </BaseInput>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.slider__label {
  padding-bottom: 0.75rem;
}

.slider__range {
  --trackHeight: 0.5rem;
  --thumbRadius: 1rem;
}

/* style for the input element with type "range" */
.slider__range input[type="range"] {
  position: relative;
  appearance: none;
  background: none;
  pointer-events: none;
  border-radius: 999px;
  z-index: 0;
}

/* ::before element to replace the slider track */
.slider__range input[type="range"]::before,
.slider__range.minmax::before {
  content: "";
  position: absolute;
  height: 100%;
  background: $color-green-dark;
  pointer-events: none;
  border-radius: 999px;
}

.slider__range input[type="range"]::-webkit-slider-thumb {
  position: relative;
  width: var(--thumbRadius);
  height: var(--thumbRadius);
  margin-top: calc((var(--trackHeight) - var(--thumbRadius)) / 2);
  background: $color-green-dark;
  border-radius: 999px;
  pointer-events: all;
  appearance: none;
  z-index: 1;
}

.slider__range.minmax {
  position: relative;
  height: var(--trackHeight);
  background: $color-green-medium;
  border-radius: 999px;
  margin: 0.5rem 0;
  --progressLeft: 0%;
  --progressRight: 0%;
}

.slider__range.minmax input[type="range"] {
  position: absolute;
  pointer-events: none;
  width: 100%;
}

.slider__range.minmax input[type="range"]::-webkit-slider-runnable-track {
  background: none;
}

.slider__range.minmax::before {
  left: v-bind(leftPercent);
  right: v-bind(rightPercent);
  width: unset;
}

.slider__range.minmax input[type="range"]::before {
  display: none;
}

.slider__inputs {
  padding-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.minmax__dash {
  width: 15px;
  height: 2px;
  border-radius: 8px;
  background-color: $text-color-secondary;
  @include smallScreen {
    width: 30px;
  }
}

.slider__input--unit {
  padding: 0.5rem 0 0.5rem 0.5rem;
}

.slider__input {
  width: 100px;

  @include smallScreen {
    width: 150px;
  }
}
</style>
